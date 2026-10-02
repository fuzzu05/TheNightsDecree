const { Client } = require('pg');

const connectionString = 'postgresql://postgres:fuzzunights2103@db.wqtkwphohecqaoruwhlh.supabase.co:5432/postgres';

const setupDatabase = async () => {
  const client = new Client({
    connectionString,
  });

  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL!');

    // Create Colleges Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS colleges (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );
    `);
    console.log('Colleges table ready.');

    // Create Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        college_id VARCHAR(50) REFERENCES colleges(id)
      );
    `);
    console.log('Users table ready.');

    // Create Notices Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS notices (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        is_urgent BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        college_id VARCHAR(50) REFERENCES colleges(id),
        author_id UUID REFERENCES users(id)
      );
    `);
    console.log('Notices table ready.');

    // Create Comments Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        notice_id INTEGER REFERENCES notices(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id),
        user_name VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Comments table ready.');

    // Insert Default Colleges if they don't exist
    await client.query(`
      INSERT INTO colleges (id, name)
      VALUES 
        ('c1', 'Dracula University'),
        ('c2', 'Nosferatu Institute'),
        ('c3', 'College of the Damned')
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log('Default colleges inserted.');

    console.log('Database setup complete!');
  } catch (err) {
    console.error('Error setting up database:', err);
  } finally {
    await client.end();
  }
};

setupDatabase();
