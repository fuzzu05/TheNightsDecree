require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// --- ROUTES ---

// 1. COLLEGES
app.get('/api/colleges', async (req, res) => {
  const { data, error } = await supabase.from('colleges').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 2. AUTHENTICATION
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name, role, college_id } = req.body;
  
  // Check if email exists
  const { data: existingUser } = await supabase.from('users').select('id').eq('email', email).single();
  if (existingUser) {
    return res.status(400).json({ error: 'Email already exists in the shadows' });
  }

  const newUser = {
    id: crypto.randomUUID(),
    email,
    password, // In a real prod app, use bcrypt here.
    name,
    role,
    college_id
  };

  const { data, error } = await supabase.from('users').insert([newUser]).select().single();
  if (error) return res.status(500).json({ error: error.message });
  
  return res.status(201).json(data);
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .eq('password', password)
    .single();

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid credentials. The spirits reject you.' });
  }
  
  return res.json(user);
});

// 3. NOTICES
app.get('/api/notices', async (req, res) => {
  const { college_id } = req.query;
  let query = supabase.from('notices').select('*').order('created_at', { ascending: false });
  
  if (college_id) {
    query = query.eq('college_id', college_id);
  }
  
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  
  return res.json(data);
});

app.post('/api/notices', async (req, res) => {
  const { title, content, is_urgent, college_id, author_id } = req.body;
  
  const { data, error } = await supabase
    .from('notices')
    .insert([{ title, content, is_urgent, college_id, author_id }])
    .select()
    .single();
    
  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json(data);
});

app.delete('/api/notices/:id', async (req, res) => {
  const { id } = req.params;
  
  const { error } = await supabase.from('notices').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  
  return res.json({ success: true });
});

// 4. COMMENTS
app.get('/api/notices/:id/comments', async (req, res) => {
  const { id } = req.params;
  
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('notice_id', id)
    .order('created_at', { ascending: true });
    
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

app.post('/api/notices/:id/comments', async (req, res) => {
  const { id } = req.params;
  const { user_id, user_name, content } = req.body;
  
  const { data, error } = await supabase
    .from('comments')
    .insert([{ notice_id: id, user_id, user_name, content }])
    .select()
    .single();
    
  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json(data);
});

// Easter Egg Route (Also used by the ping bot to keep the server awake)
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; text-align: center; margin-top: 20vh; background-color: #000; color: #fff; height: 100vh; padding-top: 50px;">
      <h1 style="color: #8a0303;">The Night's Decree</h1>
      <p style="font-size: 1.2rem;">
        A product under <strong>ActenX</strong> developed by 
        <a href="https://www.linkedin.com/in/fuzail-a-khan/" target="_blank" style="color: #d10000; text-decoration: none; font-weight: bold;">
          Fuzail Aqdas Khan
        </a>
      </p>
      <p style="color: #666; margin-top: 50px;">The crypt is alive.</p>
    </div>
  `);
});

app.listen(port, () => {
  console.log(`Vampire SaaS Server connected to Supabase and running on port ${port}`);
});
