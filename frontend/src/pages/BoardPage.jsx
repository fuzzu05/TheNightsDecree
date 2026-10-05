import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { Link } from 'react-router-dom';

export default function BoardPage() {
  const { user, logout } = useContext(AuthContext);
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeComments, setActiveComments] = useState({});
  const [newComment, setNewComment] = useState('');

  const API_URL = `${import.meta.env.VITE_API_URL}/notices`;

  useEffect(() => {
    document.title = "The Notice Board - College Notice Board";
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await fetch(`${API_URL}?college_id=${user.college_id}`);
      const data = await response.json();
      setNotices(data);
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotices();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || user.role !== 'admin' && user.role !== 'teacher') return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, is_urgent: isUrgent, college_id: user.college_id, author_id: user.id }),
      });
      if (response.ok) {
        setTitle('');
        setContent('');
        setIsUrgent(false);
        fetchNotices();
      }
    } catch (error) {
      console.error('Error creating notice:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) fetchNotices();
    } catch (error) {
      console.error('Error deleting notice:', error);
    }
  };

  const loadComments = async (noticeId) => {
    if (activeComments[noticeId]) {
      setActiveComments(prev => { const n = { ...prev }; delete n[noticeId]; return n; });
      return;
    }
    try {
      const res = await fetch(`${API_URL}/${noticeId}/comments`);
      const data = await res.json();
      setActiveComments(prev => ({ ...prev, [noticeId]: data }));
    } catch (err) {
      console.error(err);
    }
  };

  const submitComment = async (noticeId) => {
    if (!newComment) return;
    try {
      const res = await fetch(`${API_URL}/${noticeId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, user_name: user.name, content: newComment })
      });
      if (res.ok) {
        setNewComment('');
        loadComments(noticeId); // reload this section
        loadComments(noticeId); // toggle fix to just reload
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return (
    <div className="container auth-container">
      <div className="form-container" style={{ textAlign: 'center' }}>
        <h2 className="auth-title" style={{ color: 'var(--bright-red)' }}>Forbidden Territory</h2>
        <p style={{ color: '#ccc', marginBottom: '2rem' }}>You must log in to access the Notice Board.</p>
        <Link to="/login" className="btn btn-large">Login</Link>
      </div>
    </div>
  );

  const canPost = user.role === 'admin' || user.role === 'teacher';

  return (
    <div className="container">
      <header className="header" style={{ position: 'relative' }}>
        <button onClick={logout} className="btn-delete" style={{ position: 'absolute', top: 0, right: 0 }}>Logout</button>
        <h1>College Notice Board</h1>
        <p>Welcome, {user.name} | Role: {user.role.toUpperCase()}</p>
      </header>

      <main className="main-content">
        {canPost && (
          <section className="form-container">
            <h2>Post a New Notice</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Notice Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Message Content</label>
                <textarea rows="3" value={content} onChange={(e) => setContent(e.target.value)} required ></textarea>
              </div>
              <div className="form-group checkbox-group">
                <input type="checkbox" id="urgent" checked={isUrgent} onChange={(e) => setIsUrgent(e.target.checked)} />
                <label htmlFor="urgent" style={{ margin: 0 }}>Mark as Urgent</label>
              </div>
              <button type="submit" className="btn">Publish Notice</button>
            </form>
          </section>
        )}

        <section>
          {loading ? (
            <div className="loading">Summoning notices...</div>
          ) : (
            <div className="notices-grid">
              {notices.map((notice) => (
                <div key={notice.id} className={`notice-card ${notice.is_urgent ? 'urgent' : ''}`}>
                  <h3 className="notice-title">{notice.title}</h3>
                  <p className="notice-content">{notice.content}</p>
                  <p className="notice-date">
                    {new Date(notice.created_at).toLocaleDateString()}
                  </p>

                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                    <button className="btn" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }} onClick={() => loadComments(notice.id)}>
                      {activeComments[notice.id] ? 'Hide Blood Trails' : 'View Blood Trails (Comments)'}
                    </button>

                    {canPost && (
                      <button className="btn-delete" style={{ float: 'right', marginTop: 0 }} onClick={() => handleDelete(notice.id)}>
                        Vanish
                      </button>
                    )}
                  </div>

                  {activeComments[notice.id] && (
                    <div className="comments-section">
                      {activeComments[notice.id].map(c => (
                        <div key={c.id} className="comment-item">
                          <strong className="comment-author">{c.user_name}:</strong> <span className="comment-text">{c.content}</span>
                        </div>
                      ))}
                      {activeComments[notice.id].length === 0 && <p className="comment-empty">No whispers yet.</p>}

                      <div className="comment-input-group">
                        <input type="text" placeholder="Add a comment..." className="comment-input" value={newComment} onChange={e => setNewComment(e.target.value)} />
                        <button className="btn comment-btn" onClick={() => submitComment(notice.id)}>Send</button>
                      </div>
                    </div>
                  )}

                </div>
              ))}

              {notices.length === 0 && (
                <p style={{ textAlign: 'center', color: '#666', gridColumn: '1 / -1' }}>
                  The crypt is silent. No notices found.
                </p>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
