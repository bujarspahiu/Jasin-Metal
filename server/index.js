import express from 'express';
import pg from 'pg';

const { Pool } = pg;
const app = express();
const PORT = 3001;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

app.use(express.json());

async function initDb() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        source VARCHAR(100) DEFAULT 'website',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS quote_requests (
        id SERIAL PRIMARY KEY,
        ref VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        company VARCHAR(255),
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        business_type VARCHAR(100),
        project_type VARCHAR(255),
        dimensions TEXT,
        requirements TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(500),
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'unread',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_ref VARCHAR(30) UNIQUE NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_name VARCHAR(255),
        customer_phone VARCHAR(50),
        items JSONB NOT NULL DEFAULT '[]',
        subtotal DECIMAL(12, 2) DEFAULT 0,
        total DECIMAL(12, 2) DEFAULT 0,
        status VARCHAR(50) DEFAULT 'pending',
        shipping_address JSONB,
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
      CREATE INDEX IF NOT EXISTS idx_quotes_email ON quote_requests(email);
      CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
      CREATE INDEX IF NOT EXISTS idx_orders_ref ON orders(order_ref);
    `);
    console.log('[DB] Schema initialized successfully');
  } finally {
    client.release();
  }
}

app.post('/api/subscribe', async (req, res) => {
  const { email, source = 'website' } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    await pool.query(
      `INSERT INTO newsletter_subscribers (email, source)
       VALUES ($1, $2)
       ON CONFLICT (email) DO NOTHING`,
      [email.toLowerCase().trim(), source]
    );
    res.json({ success: true, message: 'Subscribed successfully' });
  } catch (err) {
    console.error('[subscribe]', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/quote', async (req, res) => {
  const { name, company, email, phone, businessType, projectType, dimensions, requirements } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });

  const ref = 'QR-' + Date.now().toString().slice(-8);
  try {
    await pool.query(
      `INSERT INTO quote_requests (ref, name, company, email, phone, business_type, project_type, dimensions, requirements)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [ref, name, company || null, email.toLowerCase().trim(), phone || null, businessType || null, projectType || null, dimensions || null, requirements || null]
    );

    try {
      await pool.query(
        `INSERT INTO newsletter_subscribers (email, source) VALUES ($1, 'quote-form') ON CONFLICT (email) DO NOTHING`,
        [email.toLowerCase().trim()]
      );
    } catch {}

    res.json({ success: true, ref, message: 'Quote request submitted' });
  } catch (err) {
    console.error('[quote]', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'Name, email and message are required' });

  try {
    await pool.query(
      `INSERT INTO contact_messages (name, email, subject, message) VALUES ($1, $2, $3, $4)`,
      [name, email.toLowerCase().trim(), subject || null, message]
    );
    res.json({ success: true, message: 'Message received' });
  } catch (err) {
    console.error('[contact]', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/orders', async (req, res) => {
  const { customerEmail, customerName, customerPhone, items, subtotal, total, shippingAddress, notes } = req.body;
  if (!customerEmail || !items?.length) return res.status(400).json({ error: 'Email and items are required' });

  const ref = 'ORD-' + Date.now().toString().slice(-8);
  try {
    const result = await pool.query(
      `INSERT INTO orders (order_ref, customer_email, customer_name, customer_phone, items, subtotal, total, shipping_address, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, order_ref`,
      [ref, customerEmail.toLowerCase().trim(), customerName || null, customerPhone || null,
       JSON.stringify(items), subtotal || 0, total || 0, shippingAddress ? JSON.stringify(shippingAddress) : null, notes || null]
    );
    res.json({ success: true, order: result.rows[0] });
  } catch (err) {
    console.error('[orders]', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/admin/stats', async (req, res) => {
  try {
    const [subs, quotes, messages, orders] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM newsletter_subscribers'),
      pool.query('SELECT COUNT(*) FROM quote_requests'),
      pool.query('SELECT COUNT(*) FROM contact_messages'),
      pool.query('SELECT COUNT(*), COALESCE(SUM(total), 0) as revenue FROM orders WHERE status != $1', ['cancelled']),
    ]);
    res.json({
      subscribers: parseInt(subs.rows[0].count),
      quotes: parseInt(quotes.rows[0].count),
      messages: parseInt(messages.rows[0].count),
      orders: parseInt(orders.rows[0].count),
      revenue: parseFloat(orders.rows[0].revenue),
    });
  } catch (err) {
    console.error('[stats]', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/admin/quotes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM quote_requests ORDER BY created_at DESC LIMIT 100');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/admin/messages', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 100');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/admin/subscribers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM newsletter_subscribers ORDER BY created_at DESC LIMIT 500');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[API] Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('[DB] Failed to initialize:', err.message);
    process.exit(1);
  });
