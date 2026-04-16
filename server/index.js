import express from 'express';
import pg from 'pg';
import { Resend } from 'resend';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;
const app = express();
const PORT = process.env.PORT || 3001;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Jasin Metal <noreply@jasin-metal.com>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@jasin-metal.com';

async function sendEmail({ to, subject, html }) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY not set — skipping email to', to);
    return;
  }
  try {
    await resend.emails.send({ from: FROM_EMAIL, to, subject, html });
    console.log('[email] Sent to', to, '—', subject);
  } catch (err) {
    console.error('[email] Failed to send to', to, err.message);
  }
}

app.use(express.json({ limit: '10mb' }));

function requireAdminKey(req, res, next) {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) return next();
  const sent = req.headers['x-admin-key'] || (req.headers['authorization'] || '').replace('Bearer ', '');
  if (sent === adminKey) return next();
  return res.status(401).json({ error: 'Unauthorized' });
}

const SEED_PRODUCTS = [
  { id: 'p1', name_en: 'Professional Dinner Fork', name_sq: 'Pirun Profesional', category: 'cutlery', price: 4.90, image: 'https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374675311_fab23642.png', spec_en: 'AISI 304 · Satin Finish · 205mm', spec_sq: 'AISI 304 · Satin · 205mm', material: 'AISI 304', dimensions: '205 × 25 × 3mm', sku: 'CUT-FRK-001', stock: 480, featured: true, best_seller: true, new_arrival: false, type: 'direct', sort_order: 1 },
  { id: 'p2', name_en: 'Table Spoon 18/10', name_sq: 'Lugë Tavoline 18/10', category: 'cutlery', price: 4.50, image: 'https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374697234_568eab65.png', spec_en: 'AISI 304 · Mirror Polish · 200mm', spec_sq: 'AISI 304 · Pasqyrë · 200mm', material: 'AISI 304', dimensions: '200 × 42 × 3mm', sku: 'CUT-SPN-001', stock: 520, featured: true, best_seller: true, new_arrival: false, type: 'direct', sort_order: 2 },
  { id: 'p3', name_en: 'Round Serving Plate 28cm', name_sq: 'Pjatë Shërbimi Rrumbullake 28cm', category: 'serving', price: 18.90, image: 'https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374717911_ed51f807.png', spec_en: 'Brushed Inox · Ø280mm', spec_sq: 'Inox i Brushuar · Ø280mm', material: 'AISI 304', dimensions: 'Ø280 × 20mm', sku: 'SRV-PLT-028', stock: 145, featured: true, best_seller: false, new_arrival: true, type: 'direct', sort_order: 3 },
  { id: 'p4', name_en: 'Rectangular Serving Tray', name_sq: 'Tabaka Drejtkëndëshe', category: 'serving', price: 24.50, image: 'https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374733967_e756004a.jpg', spec_en: 'Polished Edges · 450×320mm', spec_sq: 'Buza të Lëmuara · 450×320mm', material: 'AISI 304', dimensions: '450 × 320 × 25mm', sku: 'SRV-TRY-450', stock: 88, featured: true, best_seller: false, new_arrival: false, type: 'direct', sort_order: 4 },
  { id: 'p5', name_en: 'Heavy-Duty 4-Tier Shelving', name_sq: 'Raft 4 Nivele i Fortë', category: 'shelves', price: 389.00, image: 'https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374750605_e7165cd6.jpg', spec_en: 'Load 200kg/shelf · 1800×400×1800', spec_sq: 'Mbajtje 200kg · 1800×400×1800', material: 'AISI 304', dimensions: '1800 × 400 × 1800mm', sku: 'SHL-4T-1800', stock: 24, featured: true, best_seller: true, new_arrival: false, type: 'direct', sort_order: 5 },
  { id: 'p6', name_en: 'Single Basin Commercial Sink', name_sq: 'Lavaman Komercial një Vaskë', category: 'sinks', price: 529.00, image: 'https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374769787_ff687c9c.png', spec_en: 'With Drainboard · 1200×600mm', spec_sq: 'Me Pjatë Kullimi · 1200×600mm', material: 'AISI 304 · 1.2mm', dimensions: '1200 × 600 × 900mm', sku: 'SNK-1B-1200', stock: 16, featured: true, best_seller: false, new_arrival: true, type: 'direct', sort_order: 6 },
  { id: 'p7', name_en: 'Industrial Work Table', name_sq: 'Tavolinë Pune Industriale', category: 'sinks', price: 449.00, image: 'https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374790151_2f6051e1.png', spec_en: 'Undershelf · 1500×700×900', spec_sq: 'Me Raft Poshtë · 1500×700×900', material: 'AISI 304 · 1.2mm', dimensions: '1500 × 700 × 900mm', sku: 'WTB-1500', stock: 32, featured: true, best_seller: true, new_arrival: false, type: 'direct', sort_order: 7 },
  { id: 'p8', name_en: 'Mobile Prep Station', name_sq: 'Stacion Pune i Lëvizshëm', category: 'equipment', price: 689.00, image: 'https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374809973_aea00dc2.png', spec_en: 'Wheeled · Lockable · 1200×600', spec_sq: 'Me Rrota · I Kyçur · 1200×600', material: 'AISI 304', dimensions: '1200 × 600 × 900mm', sku: 'PRP-MOB-1200', stock: 12, featured: true, best_seller: false, new_arrival: true, type: 'direct', sort_order: 8 },
  { id: 'p9', name_en: 'Double Basin Sink Station', name_sq: 'Lavaman me Dy Vaska', category: 'sinks', price: 849.00, image: 'https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374835130_17a184f3.jpg', spec_en: '2 Basins · 1600×700mm', spec_sq: '2 Vaska · 1600×700mm', material: 'AISI 304 · 1.5mm', dimensions: '1600 × 700 × 900mm', sku: 'SNK-2B-1600', stock: 9, featured: false, best_seller: false, new_arrival: false, type: 'direct', sort_order: 9 },
  { id: 'p10', name_en: 'Commercial Dough Mixer 40L', name_sq: 'Mikser Brumi 40L', category: 'bakery', price: null, image: 'https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374857707_e075497f.png', spec_en: '3-speed · Stainless bowl · 40L', spec_sq: '3 shpejtësi · Tas inox · 40L', material: 'AISI 304', dimensions: '600 × 780 × 1200mm', sku: 'BKY-MIX-40', stock: 4, featured: true, best_seller: false, new_arrival: false, type: 'quote', sort_order: 10 },
  { id: 'p11', name_en: 'Butcher Prep Station with Hooks', name_sq: 'Tavolinë Mishtarie me Grepa', category: 'butcher', price: null, image: 'https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374875434_66280328.jpg', spec_en: 'Hooks + HDPE top · 2000×800', spec_sq: 'Grepa + HDPE · 2000×800', material: 'AISI 304 + HDPE', dimensions: '2000 × 800 × 1900mm', sku: 'BTC-PRP-2000', stock: 3, featured: false, best_seller: false, new_arrival: false, type: 'quote', sort_order: 11 },
  { id: 'p12', name_en: 'Professional Chef Knife 25cm', name_sq: 'Thikë Kuzhinieri 25cm', category: 'cutlery', price: 89.00, image: 'https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374894664_007d9434.png', spec_en: 'Forged · German steel · 250mm', spec_sq: 'Farkëtuar · Çelik gjerman · 250mm', material: 'X50CrMoV15', dimensions: '250mm blade', sku: 'CUT-KNF-250', stock: 64, featured: false, best_seller: true, new_arrival: true, type: 'direct', sort_order: 12 },
];

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

      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(50) PRIMARY KEY,
        name_en VARCHAR(500) NOT NULL,
        name_sq VARCHAR(500) NOT NULL,
        category VARCHAR(100) NOT NULL,
        price DECIMAL(12, 2),
        image TEXT NOT NULL DEFAULT '',
        spec_en TEXT DEFAULT '',
        spec_sq TEXT DEFAULT '',
        material VARCHAR(255) DEFAULT '',
        dimensions VARCHAR(255) DEFAULT '',
        sku VARCHAR(100) UNIQUE NOT NULL,
        stock INTEGER DEFAULT 0,
        featured BOOLEAN DEFAULT false,
        best_seller BOOLEAN DEFAULT false,
        new_arrival BOOLEAN DEFAULT false,
        type VARCHAR(50) DEFAULT 'direct',
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
      CREATE INDEX IF NOT EXISTS idx_quotes_email ON quote_requests(email);
      CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
      CREATE INDEX IF NOT EXISTS idx_orders_ref ON orders(order_ref);
    `);
    console.log('[DB] Schema initialized successfully');

    const { rows } = await client.query('SELECT COUNT(*) FROM products');
    if (parseInt(rows[0].count) === 0) {
      for (const p of SEED_PRODUCTS) {
        await client.query(
          `INSERT INTO products (id, name_en, name_sq, category, price, image, spec_en, spec_sq, material, dimensions, sku, stock, featured, best_seller, new_arrival, type, sort_order)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
           ON CONFLICT (id) DO NOTHING`,
          [p.id, p.name_en, p.name_sq, p.category, p.price, p.image, p.spec_en, p.spec_sq,
           p.material, p.dimensions, p.sku, p.stock, p.featured, p.best_seller, p.new_arrival, p.type, p.sort_order]
        );
      }
      console.log('[DB] Products seeded');
    }
  } finally {
    client.release();
  }
}

// ─── Email Templates ────────────────────────────────────────────────────────

function emailWrapper(content) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    body{font-family:Arial,sans-serif;background:#f5f5f5;margin:0;padding:0}
    .wrap{max-width:600px;margin:32px auto;background:#fff;border:1px solid #e5e5e5}
    .header{background:#111;padding:24px 32px;color:#fff}
    .header h1{margin:0;font-size:20px;font-weight:300;letter-spacing:0.1em}
    .header span{font-size:11px;letter-spacing:0.3em;color:#999;display:block;margin-bottom:6px}
    .body{padding:32px}
    .body p{color:#333;line-height:1.6;margin:0 0 16px}
    .ref{background:#f5f5f5;border-left:3px solid #111;padding:12px 16px;font-family:monospace;font-size:15px;font-weight:bold;margin:20px 0}
    table{width:100%;border-collapse:collapse;margin:16px 0}
    th{background:#f5f5f5;text-align:left;padding:10px 12px;font-size:11px;letter-spacing:0.1em;color:#666;border-bottom:1px solid #e5e5e5}
    td{padding:10px 12px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#333}
    .total-row td{font-weight:bold;color:#111;border-top:2px solid #111;border-bottom:none}
    .footer{background:#f5f5f5;padding:20px 32px;font-size:11px;color:#999;text-align:center;letter-spacing:0.05em;border-top:1px solid #e5e5e5}
    .btn{display:inline-block;background:#111;color:#fff;padding:12px 24px;text-decoration:none;font-size:12px;letter-spacing:0.15em;margin:16px 0}
  </style></head><body><div class="wrap">${content}
  <div class="footer">Jasin Metal · info@jasin-metal.com · +355 69 123 4567<br>© ${new Date().getFullYear()} Jasin Metal. Të gjitha të drejtat e rezervuara.</div>
  </div></body></html>`;
}

function contactConfirmEmail(name, subject, message) {
  return emailWrapper(`
    <div class="header"><span>JASIN METAL</span><h1>Mesazhi juaj u pranua</h1></div>
    <div class="body">
      <p>Përshëndetje <strong>${name}</strong>,</p>
      <p>Faleminderit që na kontaktuat. Kemi marrë mesazhin tuaj dhe do t'ju përgjigjemi brenda 24 orësh.</p>
      ${subject ? `<p><strong>Tema:</strong> ${subject}</p>` : ''}
      <div class="ref" style="font-family:inherit;font-size:14px;font-weight:normal;padding:16px">${message}</div>
      <p>Nëse keni pyetje urgjente, mund të na kontaktoni drejtpërdrejt në <strong>+355 69 123 4567</strong>.</p>
    </div>`);
}

function contactAdminEmail(name, email, subject, message) {
  return emailWrapper(`
    <div class="header"><span>NJOFTIM I RI</span><h1>Mesazh i ri nga faqja</h1></div>
    <div class="body">
      <p><strong>Emri:</strong> ${name}<br>
      <strong>Email:</strong> ${email}<br>
      ${subject ? `<strong>Tema:</strong> ${subject}` : ''}</p>
      <div class="ref" style="font-family:inherit;font-size:14px;font-weight:normal;padding:16px">${message}</div>
    </div>`);
}

function quoteConfirmEmail(name, ref, details) {
  return emailWrapper(`
    <div class="header"><span>JASIN METAL</span><h1>Kërkesa juaj për ofertë u pranua</h1></div>
    <div class="body">
      <p>Përshëndetje <strong>${name}</strong>,</p>
      <p>Kemi marrë kërkesën tuaj për ofertë. Ekipi ynë do ta shqyrtojë dhe do t'ju dërgojë ofertën brenda <strong>1–2 ditësh pune</strong>.</p>
      <p>Numri i referencës suaj:</p>
      <div class="ref">${ref}</div>
      ${details.projectType ? `<p><strong>Projekti:</strong> ${details.projectType}</p>` : ''}
      ${details.requirements ? `<p><strong>Kërkesat:</strong> ${details.requirements}</p>` : ''}
      <p>Ruajeni këtë numër referimi për komunikimin e ardhshëm me ne.</p>
    </div>`);
}

function quoteAdminEmail(ref, details) {
  return emailWrapper(`
    <div class="header"><span>KËRKESË E RE PËR OFERTË</span><h1>${ref}</h1></div>
    <div class="body">
      <table>
        <tr><th>KLIENTI</th><th>EMAIL</th><th>TELEFONI</th></tr>
        <tr><td>${details.name}${details.company ? ` / ${details.company}` : ''}</td><td>${details.email}</td><td>${details.phone || '—'}</td></tr>
      </table>
      ${details.businessType ? `<p><strong>Lloji i biznesit:</strong> ${details.businessType}</p>` : ''}
      ${details.projectType ? `<p><strong>Projekti:</strong> ${details.projectType}</p>` : ''}
      ${details.dimensions ? `<p><strong>Dimensionet:</strong> ${details.dimensions}</p>` : ''}
      ${details.requirements ? `<p><strong>Kërkesat:</strong> ${details.requirements}</p>` : ''}
    </div>`);
}

function orderConfirmEmail(customerName, ref, items, subtotal, total) {
  const rows = items.map(item =>
    `<tr><td>${item.name || item.nameEn || 'Product'}</td><td style="text-align:center">${item.quantity || 1}</td><td style="text-align:right">€${Number(item.price || 0).toFixed(2)}</td><td style="text-align:right">€${(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}</td></tr>`
  ).join('');
  return emailWrapper(`
    <div class="header"><span>JASIN METAL</span><h1>Konfirmim Porosie</h1></div>
    <div class="body">
      <p>Përshëndetje <strong>${customerName || 'Klient'}</strong>,</p>
      <p>Faleminderit për porosinë tuaj! Kemi marrë porosinë dhe do ta përpunojmë sa më shpejt.</p>
      <p>Numri i porosisë suaj:</p>
      <div class="ref">${ref}</div>
      <table>
        <tr><th>PRODUKTI</th><th style="text-align:center">SASIA</th><th style="text-align:right">ÇMIMI</th><th style="text-align:right">TOTALI</th></tr>
        ${rows}
        <tr class="total-row"><td colspan="3">TOTALI</td><td style="text-align:right">€${Number(total || subtotal || 0).toFixed(2)}</td></tr>
      </table>
      <p>Nëse keni pyetje rreth porosisë, kontaktoni me numrin e referencës <strong>${ref}</strong>.</p>
    </div>`);
}

function newsletterWelcomeEmail(email) {
  return emailWrapper(`
    <div class="header"><span>JASIN METAL</span><h1>Mirë se erdhët në listën tonë!</h1></div>
    <div class="body">
      <p>Faleminderit që u abonuat në lajmërimet e Jasin Metal.</p>
      <p>Do të merrni lajme mbi produktet tona të reja, ofertat speciale dhe projekte nga bota e inoksit profesional.</p>
      <p>Nëse dëshironi të çabonoheni në çdo kohë, na dërgoni email në <strong>info@jasin-metal.com</strong>.</p>
    </div>`);
}

function welcomeEmail(firstName, email) {
  return emailWrapper(`
    <div class="header"><span>JASIN METAL</span><h1>Mirë se erdhët, ${firstName}!</h1></div>
    <div class="body">
      <p>Llogaria juaj u krijua me sukses me adresën <strong>${email}</strong>.</p>
      <p>Tani mund të:</p>
      <ul style="color:#333;line-height:1.8">
        <li>Shfletoni katalogun tonë të produkteve inox</li>
        <li>Kërkoni oferta për produkte me porosi</li>
        <li>Ndiqni porositë tuaja</li>
      </ul>
      <p>Faleminderit që zgjodhët Jasin Metal.</p>
    </div>`);
}

// ─── Public Routes ───────────────────────────────────────────────────────────

app.post('/api/subscribe', async (req, res) => {
  const { email, source = 'website' } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const result = await pool.query(
      `INSERT INTO newsletter_subscribers (email, source)
       VALUES ($1, $2)
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
      [email.toLowerCase().trim(), source]
    );
    if (result.rows.length > 0) {
      sendEmail({ to: email, subject: 'Mirë se erdhët në Jasin Metal Newsletter', html: newsletterWelcomeEmail(email) });
    }
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

    const details = { name, company, email, phone, businessType, projectType, dimensions, requirements };
    sendEmail({ to: email, subject: `Kërkesa juaj për ofertë ${ref} u pranua — Jasin Metal`, html: quoteConfirmEmail(name, ref, details) });
    sendEmail({ to: ADMIN_EMAIL, subject: `[Ofertë e Re] ${ref} — ${name}${company ? ' / ' + company : ''}`, html: quoteAdminEmail(ref, details) });

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

    sendEmail({ to: email, subject: 'Mesazhi juaj u pranua — Jasin Metal', html: contactConfirmEmail(name, subject, message) });
    sendEmail({ to: ADMIN_EMAIL, subject: `[Mesazh i Ri] ${subject || 'Pa temë'} — ${name}`, html: contactAdminEmail(name, email, subject, message) });

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

    sendEmail({
      to: customerEmail,
      subject: `Konfirmim porosie ${ref} — Jasin Metal`,
      html: orderConfirmEmail(customerName, ref, items, subtotal, total),
    });

    res.json({ success: true, order: result.rows[0] });
  } catch (err) {
    console.error('[orders]', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/welcome-email', async (req, res) => {
  const { email, firstName } = req.body;
  if (!email || !firstName) return res.status(400).json({ error: 'email and firstName are required' });
  try {
    await pool.query(
      `INSERT INTO newsletter_subscribers (email, source) VALUES ($1, 'register') ON CONFLICT (email) DO NOTHING`,
      [email.toLowerCase().trim()]
    );
  } catch {}
  sendEmail({ to: email, subject: 'Mirë se erdhët në Jasin Metal!', html: welcomeEmail(firstName, email) });
  res.json({ success: true });
});

// ─── Admin Routes ────────────────────────────────────────────────────────────

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

// ─── Products (read public, write protected) ─────────────────────────────────

function rowToProduct(r) {
  return {
    id: r.id,
    name: { en: r.name_en, sq: r.name_sq },
    category: r.category,
    price: r.price !== null ? parseFloat(r.price) : null,
    image: r.image,
    spec: { en: r.spec_en, sq: r.spec_sq },
    material: r.material,
    dimensions: r.dimensions,
    sku: r.sku,
    stock: r.stock,
    featured: r.featured,
    bestSeller: r.best_seller,
    newArrival: r.new_arrival,
    type: r.type,
  };
}

app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY sort_order ASC, created_at ASC');
    res.json(result.rows.map(rowToProduct));
  } catch (err) {
    console.error('[products GET]', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/products', requireAdminKey, async (req, res) => {
  const { id, name, category, price, image, spec, material, dimensions, sku, stock, featured, bestSeller, newArrival, type } = req.body;
  if (!id || !name?.en || !sku || !category) return res.status(400).json({ error: 'id, name.en, sku and category are required' });

  try {
    const maxOrder = await pool.query('SELECT COALESCE(MAX(sort_order), 0) AS m FROM products');
    const sortOrder = parseInt(maxOrder.rows[0].m) + 1;
    const result = await pool.query(
      `INSERT INTO products (id, name_en, name_sq, category, price, image, spec_en, spec_sq, material, dimensions, sku, stock, featured, best_seller, new_arrival, type, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
       RETURNING *`,
      [id, name.en, name.sq || '', category, price ?? null, image || '', spec?.en || '', spec?.sq || '',
       material || '', dimensions || '', sku.toUpperCase(), stock ?? 0,
       featured ?? false, bestSeller ?? false, newArrival ?? false, type || 'direct', sortOrder]
    );
    res.status(201).json(rowToProduct(result.rows[0]));
  } catch (err) {
    console.error('[products POST]', err.message);
    if (err.code === '23505') return res.status(409).json({ error: 'SKU already exists' });
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/products/:id', requireAdminKey, async (req, res) => {
  const { id } = req.params;
  const { name, category, price, image, spec, material, dimensions, sku, stock, featured, bestSeller, newArrival, type } = req.body;

  try {
    const result = await pool.query(
      `UPDATE products SET
        name_en = COALESCE($1, name_en),
        name_sq = COALESCE($2, name_sq),
        category = COALESCE($3, category),
        price = $4,
        image = COALESCE($5, image),
        spec_en = COALESCE($6, spec_en),
        spec_sq = COALESCE($7, spec_sq),
        material = COALESCE($8, material),
        dimensions = COALESCE($9, dimensions),
        sku = COALESCE($10, sku),
        stock = COALESCE($11, stock),
        featured = COALESCE($12, featured),
        best_seller = COALESCE($13, best_seller),
        new_arrival = COALESCE($14, new_arrival),
        type = COALESCE($15, type)
       WHERE id = $16
       RETURNING *`,
      [name?.en, name?.sq, category, price !== undefined ? (price ?? null) : undefined,
       image, spec?.en, spec?.sq, material, dimensions, sku ? sku.toUpperCase() : undefined,
       stock, featured, bestSeller, newArrival, type, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(rowToProduct(result.rows[0]));
  } catch (err) {
    console.error('[products PUT]', err.message);
    if (err.code === '23505') return res.status(409).json({ error: 'SKU already exists' });
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/products/:id', requireAdminKey, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error('[products DELETE]', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
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
