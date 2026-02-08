const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const QRCode = require('qrcode');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Database setup
const db = new sqlite3.Database('./shortly.db', (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to SQLite database');
    initDatabase();
  }
});

// Initialize database tables
function initDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      short_code TEXT UNIQUE NOT NULL,
      long_url TEXT NOT NULL,
      custom_alias BOOLEAN DEFAULT 0,
      password_hash TEXT,
      protected BOOLEAN DEFAULT 0,
      ttl_days INTEGER,
      tags TEXT,
      description TEXT,
      clicks INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating links table:', err);
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS clicks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      short_code TEXT NOT NULL,
      clicked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (short_code) REFERENCES links(short_code)
    )
  `, (err) => {
    if (err) console.error('Error creating clicks table:', err);
  });
}

// Helper functions
function generateShortCode() {
  return crypto.randomBytes(4).toString('base64url').substring(0, 6);
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

// API Routes

// Shorten URL
app.post('/api/shorten', (req, res) => {
  const { url, custom, password, ttl_days, tags, description } = req.body;

  if (!url || !isValidUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  const shortCode = custom || generateShortCode();
  const passwordHash = password ? hashPassword(password) : null;
  const isProtected = !!password;

  const query = `
    INSERT INTO links (short_code, long_url, custom_alias, password_hash, protected, ttl_days, tags, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [shortCode, url, !!custom, passwordHash, isProtected, ttl_days, tags, description],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(409).json({ error: 'Short code already exists' });
        }
        return res.status(500).json({ error: 'Failed to create short link' });
      }

      res.json({
        short: shortCode,
        url: `${req.protocol}://${req.get('host')}/${shortCode}`,
        id: this.lastID
      });
    }
  );
});

// Get recent links
app.get('/api/recent', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  db.all(
    `SELECT * FROM links ORDER BY created_at DESC LIMIT ?`,
    [limit],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch links' });
      }
      res.json(rows);
    }
  );
});

// Get link metadata
app.get('/api/link/:code', (req, res) => {
  const { code } = req.params;

  db.get(
    'SELECT * FROM links WHERE short_code = ?',
    [code],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!row) {
        return res.status(404).json({ error: 'Link not found' });
      }

      // Don't send password hash to client
      const { password_hash, ...linkData } = row;
      res.json(linkData);
    }
  );
});

// Get click statistics
app.get('/api/stats/:code', (req, res) => {
  const { code } = req.params;
  const days = parseInt(req.query.days) || 7;

  db.all(
    `SELECT DATE(clicked_at) as day, COUNT(*) as cnt 
     FROM clicks 
     WHERE short_code = ? 
     AND clicked_at >= datetime('now', '-' || ? || ' days')
     GROUP BY DATE(clicked_at)
     ORDER BY day`,
    [code, days],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch statistics' });
      }
      res.json({ rows });
    }
  );
});

// Generate QR Code
app.get('/qr/:code', async (req, res) => {
  const { code } = req.params;
  const url = `${req.protocol}://${req.get('host')}/${code}`;

  try {
    const qrCode = await QRCode.toBuffer(url, {
      width: 300,
      margin: 2,
      color: {
        dark: '#2563EB',
        light: '#FFFFFF'
      }
    });
    
    res.type('png');
    res.send(qrCode);
  } catch (err) {
    console.error('QR Code generation error:', err);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

// Redirect handler
app.get('/r/:code', (req, res) => {
  const { code } = req.params;

  db.get(
    'SELECT * FROM links WHERE short_code = ?',
    [code],
    (err, row) => {
      if (err || !row) {
        return res.status(404).send('Link not found');
      }

      // Check if link is expired
      if (row.ttl_days) {
        const createdAt = new Date(row.created_at);
        const expiresAt = new Date(createdAt.getTime() + row.ttl_days * 24 * 60 * 60 * 1000);
        if (new Date() > expiresAt) {
          return res.status(410).send('Link has expired');
        }
      }

      // Check if password protected
      if (row.protected) {
        if (req.method === 'POST') {
          const { password } = req.body;
          if (!password || hashPassword(password) !== row.password_hash) {
            return res.status(403).json({ error: 'Incorrect password' });
          }
        } else {
          return res.redirect(`/password.html?code=${code}`);
        }
      }

      // Log click
      db.run(
        'INSERT INTO clicks (short_code) VALUES (?)',
        [code]
      );

      // Update click count
      db.run(
        'UPDATE links SET clicks = clicks + 1 WHERE short_code = ?',
        [code]
      );

      // Redirect to long URL
      res.redirect(row.long_url);
    }
  );
});

// Password verification
app.post('/r/:code', (req, res) => {
  const { code } = req.params;
  const { password } = req.body;

  db.get(
    'SELECT * FROM links WHERE short_code = ?',
    [code],
    (err, row) => {
      if (err || !row) {
        return res.status(404).json({ error: 'Link not found' });
      }

      if (row.ttl_days) {
        const createdAt = new Date(row.created_at);
        const expiresAt = new Date(createdAt.getTime() + row.ttl_days * 24 * 60 * 60 * 1000);
        if (new Date() > expiresAt) {
          return res.status(410).json({ error: 'Link has expired' });
        }
      }

      if (!password || hashPassword(password) !== row.password_hash) {
        return res.status(403).json({ error: 'Incorrect password' });
      }

      // Log click
      db.run('INSERT INTO clicks (short_code) VALUES (?)', [code]);
      db.run('UPDATE links SET clicks = clicks + 1 WHERE short_code = ?', [code]);

      res.json({ success: true, redirect: row.long_url });
    }
  );
});

// Serve password page
app.get('/password.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'password.html'));
});

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle short code redirects
app.get('/:code', (req, res) => {
  res.redirect(`/r/${req.params.code}`);
});

// Start server
app.listen(PORT, () => {
  console.log(`Shortly URL Shortener running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    }
    console.log('Database connection closed');
    process.exit(0);
  });
});