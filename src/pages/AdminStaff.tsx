import React, { useState, useEffect } from 'react';
import { PRODUCTS, CATEGORIES } from '@/lib/data';
import {
  LayoutDashboard, Package, ShoppingCart, FileText, Users, Settings,
  TrendingUp, DollarSign, AlertTriangle, Eye, Edit, Trash2, Plus,
  Search, LogOut, Lock,
} from 'lucide-react';

const SESSION_KEY = 'staff_session';
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin';

const AdminStaff: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem(SESSION_KEY) === 'true';
  });

  const handleLogin = () => {
    localStorage.setItem(SESSION_KEY, 'true');
    setLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return <StaffLoginPage onLogin={handleLogin} />;
  }

  return <StaffPanel onLogout={handleLogout} />;
};

const StaffLoginPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    if (username.trim() === ADMIN_USER && password === ADMIN_PASS) {
      onLogin();
    } else {
      setError('Username ose fjalëkalimi është gabim.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-neutral-300 via-white to-neutral-400 mb-6">
            <div className="w-8 h-8 border-2 border-neutral-900 rotate-45" />
          </div>
          <div className="text-[10px] tracking-[0.4em] text-neutral-500 mb-1">STAFF ACCESS</div>
          <div className="text-xl font-bold text-white tracking-[0.15em]">KITCHEN</div>
          <div className="text-[10px] tracking-[0.3em] text-neutral-400">INDUSTRIAL MFG.</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[10px] tracking-[0.2em] text-neutral-500 mb-1.5">USERNAME</label>
            <input
              type="text"
              required
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 text-white px-4 py-3 text-sm outline-none focus:border-neutral-400 transition placeholder:text-neutral-600"
              placeholder="username"
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] text-neutral-500 mb-1.5">PASSWORD</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 text-white px-4 py-3 text-sm outline-none focus:border-neutral-400 transition placeholder:text-neutral-600"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-900/40 border border-red-700 text-red-300 text-xs px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-neutral-950 py-4 text-xs font-bold tracking-[0.2em] hover:bg-neutral-200 transition disabled:opacity-50 mt-2"
          >
            {loading ? 'DUKE U KYÇUR...' : 'SIGN IN'}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2 text-neutral-700">
          <Lock className="w-3 h-3" />
          <span className="text-[10px] tracking-[0.2em]">SECURE STAFF AREA</span>
        </div>
      </div>
    </div>
  );
};

const StaffPanel: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [section, setSection] = useState<'dashboard' | 'products' | 'orders' | 'quotes' | 'users' | 'settings'>('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const nav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'quotes', label: 'Quote Requests', icon: FileText },
    { id: 'users', label: 'Users & Roles', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <aside className="w-64 bg-neutral-950 text-neutral-300 min-h-screen p-6 hidden md:flex flex-col">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-neutral-300 via-white to-neutral-400 flex items-center justify-center shrink-0">
              <div className="w-4 h-4 border border-neutral-900 rotate-45" />
            </div>
            <div>
              <div className="font-bold text-[10px] tracking-[0.2em] text-white leading-none">KITCHEN</div>
              <div className="text-[9px] tracking-[0.25em] text-neutral-500 leading-none mt-0.5">INDUSTRIAL MFG.</div>
            </div>
          </div>
          <div className="text-[10px] tracking-[0.3em] text-neutral-500">ADMIN PANEL</div>
        </div>

        <nav className="space-y-1 flex-1">
          {nav.map((n) => (
            <button
              key={n.id}
              onClick={() => setSection(n.id as any)}
              className={`w-full text-left flex items-center gap-3 px-4 py-3 text-sm transition rounded-none ${
                section === n.id
                  ? 'bg-white/10 text-white'
                  : 'text-neutral-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <n.icon className="w-4 h-4 shrink-0" />
              {n.label}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-neutral-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-neutral-400 to-neutral-700 flex items-center justify-center font-bold text-white text-sm">
              A
            </div>
            <div>
              <div className="text-sm text-white">Admin Staff</div>
              <div className="text-[10px] text-neutral-500">Super Admin</div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs tracking-[0.15em] text-neutral-400 hover:text-red-400 hover:bg-red-900/20 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            LOGOUT
          </button>
        </div>
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-neutral-950 px-4 py-3 flex items-center justify-between">
        <div className="text-xs font-bold tracking-[0.2em] text-white">KITCHEN MFG. ADMIN</div>
        <button onClick={() => setMobileNavOpen(!mobileNavOpen)} className="text-neutral-400 text-xs tracking-widest">
          {mobileNavOpen ? 'CLOSE' : 'MENU'}
        </button>
      </div>

      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-neutral-950 pt-16 p-6 flex flex-col">
          <nav className="space-y-1 flex-1">
            {nav.map((n) => (
              <button
                key={n.id}
                onClick={() => { setSection(n.id as any); setMobileNavOpen(false); }}
                className={`w-full text-left flex items-center gap-3 px-4 py-4 text-sm transition ${
                  section === n.id ? 'bg-white/10 text-white' : 'text-neutral-400'
                }`}
              >
                <n.icon className="w-4 h-4" /> {n.label}
              </button>
            ))}
          </nav>
          <button onClick={onLogout} className="flex items-center gap-2 px-4 py-3 text-xs text-red-400 mt-4">
            <LogOut className="w-4 h-4" /> LOGOUT
          </button>
        </div>
      )}

      <main className="flex-1 p-6 md:p-10 overflow-x-hidden mt-12 md:mt-0">
        {section === 'dashboard' && <SectionDashboard />}
        {section === 'products' && <SectionProducts />}
        {section === 'orders' && <SectionOrders />}
        {section === 'quotes' && <SectionQuotes />}
        {section === 'users' && <SectionUsers />}
        {section === 'settings' && <SectionSettings />}
      </main>
    </div>
  );
};

const SectionDashboard: React.FC = () => {
  const stats = [
    { label: 'Today Sales', value: '€4,820', change: '+12.4%', icon: DollarSign, color: 'text-green-600' },
    { label: 'This Week', value: '€28,450', change: '+8.2%', icon: TrendingUp, color: 'text-green-600' },
    { label: 'This Month', value: '€142,800', change: '+18.6%', icon: TrendingUp, color: 'text-green-600' },
    { label: 'Pending Orders', value: '24', change: '4 new', icon: ShoppingCart, color: 'text-amber-600' },
  ];
  const recentOrders = [
    { id: 'ORD-4821', customer: 'Hotel Adriatic', total: 3240, status: 'In Production' },
    { id: 'ORD-4820', customer: 'Bakery Artigiana', total: 1890, status: 'Shipped' },
    { id: 'ORD-4819', customer: 'Restaurant Vila', total: 890, status: 'Paid' },
    { id: 'ORD-4818', customer: 'Butcher Mario', total: 2450, status: 'Delivered' },
    { id: 'ORD-4817', customer: 'Hotel Mediterranean', total: 5680, status: 'Processing' },
  ];
  const topProducts = PRODUCTS.slice(0, 5);

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-light">Dashboard</h1>
          <div className="text-sm text-neutral-500">Welcome back. Here's what's happening today.</div>
        </div>
        <select className="border border-neutral-300 px-4 py-2 text-sm bg-white">
          <option>Last 30 days</option>
          <option>Last 7 days</option>
          <option>Today</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white p-6 border border-neutral-200">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-neutral-900 text-white flex items-center justify-center">
                <s.icon className="w-4 h-4" />
              </div>
              <span className={`text-xs font-bold ${s.color}`}>{s.change}</span>
            </div>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-neutral-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 border border-neutral-200 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="font-bold">Revenue Overview</div>
            <div className="text-xs text-neutral-500">Last 30 days</div>
          </div>
          <div className="text-2xl font-bold">€142,800</div>
        </div>
        <div className="h-48 flex items-end gap-1">
          {Array.from({ length: 30 }).map((_, i) => {
            const h = 20 + Math.sin(i * 0.4) * 30 + ((i * 17 + 7) % 40);
            return (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-neutral-900 to-neutral-600 hover:from-neutral-700 transition"
                style={{ height: `${h}%` }}
              />
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white p-6 border border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <div className="font-bold">Recent Orders</div>
            <button className="text-xs text-neutral-500 hover:text-neutral-900">View all</button>
          </div>
          <div className="space-y-2">
            {recentOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between py-2 border-b border-neutral-100 text-sm">
                <div>
                  <div className="font-medium">{o.id}</div>
                  <div className="text-xs text-neutral-500">{o.customer}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">€{o.total}</div>
                  <div className="text-[10px] tracking-wider text-neutral-500">{o.status.toUpperCase()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 border border-neutral-200">
          <div className="font-bold mb-4">Top Selling Products</div>
          <div className="space-y-2">
            {topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 py-2 border-b border-neutral-100">
                <div className="text-xs text-neutral-400 w-5">0{i + 1}</div>
                <img src={p.image} className="w-10 h-10 object-contain bg-neutral-50 p-1" alt="" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{p.name.en}</div>
                  <div className="text-xs text-neutral-500">{50 + i * 13} sold</div>
                </div>
                <div className="text-sm font-bold">{p.price ? `€${p.price}` : 'QUOTE'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-5 mt-8 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <div className="font-bold text-sm text-amber-900">Low Stock Alert</div>
          <div className="text-sm text-amber-800 mt-1">
            3 products are running low: Butcher Prep Station (3 units), Commercial Mixer 40L (4 units), Double Basin Sink (9 units).
          </div>
        </div>
      </div>
    </>
  );
};

const SectionProducts: React.FC = () => (
  <>
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-light">Products</h1>
      <button className="bg-neutral-900 text-white px-5 py-2.5 text-xs font-bold tracking-[0.2em] flex items-center gap-2 hover:bg-neutral-700">
        <Plus className="w-4 h-4" /> ADD PRODUCT
      </button>
    </div>
    <div className="bg-white border border-neutral-200 mb-4 p-4 flex items-center gap-3">
      <Search className="w-4 h-4 text-neutral-400" />
      <input placeholder="Search products..." className="flex-1 outline-none text-sm" />
      <select className="border border-neutral-300 px-3 py-2 text-sm">
        <option>All Categories</option>
        {CATEGORIES.map((c) => <option key={c.id}>{c.name.en}</option>)}
      </select>
    </div>
    <div className="bg-white border border-neutral-200 overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-neutral-50 border-b border-neutral-200 text-xs tracking-wider text-neutral-500">
          <tr>
            <th className="text-left p-4">PRODUCT</th>
            <th className="text-left p-4">SKU</th>
            <th className="text-left p-4">CATEGORY</th>
            <th className="text-left p-4">PRICE</th>
            <th className="text-left p-4">STOCK</th>
            <th className="text-left p-4">STATUS</th>
            <th className="p-4" />
          </tr>
        </thead>
        <tbody>
          {PRODUCTS.map((p) => (
            <tr key={p.id} className="border-b border-neutral-100 hover:bg-neutral-50">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <img src={p.image} className="w-10 h-10 object-contain bg-neutral-50 p-1" alt="" />
                  <span className="font-medium">{p.name.en}</span>
                </div>
              </td>
              <td className="p-4 text-neutral-500">{p.sku}</td>
              <td className="p-4">{p.category}</td>
              <td className="p-4 font-bold">{p.price ? `€${p.price}` : 'Quote'}</td>
              <td className="p-4">
                <span className={`font-medium ${p.stock > 20 ? 'text-green-600' : p.stock > 5 ? 'text-amber-600' : 'text-red-600'}`}>
                  {p.stock}
                </span>
              </td>
              <td className="p-4">
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 font-medium">Active</span>
              </td>
              <td className="p-4">
                <div className="flex gap-2">
                  <button className="text-neutral-500 hover:text-neutral-900"><Eye className="w-4 h-4" /></button>
                  <button className="text-neutral-500 hover:text-neutral-900"><Edit className="w-4 h-4" /></button>
                  <button className="text-neutral-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

const SectionOrders: React.FC = () => {
  const orders = [
    { id: 'ORD-4821', customer: 'Hotel Adriatic', total: 3240, status: 'In Production', date: '2026-04-16' },
    { id: 'ORD-4820', customer: 'Bakery Artigiana', total: 1890, status: 'Shipped', date: '2026-04-16' },
    { id: 'ORD-4819', customer: 'Restaurant Vila', total: 890, status: 'Paid', date: '2026-04-15' },
    { id: 'ORD-4818', customer: 'Butcher Mario', total: 2450, status: 'Delivered', date: '2026-04-15' },
    { id: 'ORD-4817', customer: 'Hotel Mediterranean', total: 5680, status: 'Processing', date: '2026-04-14' },
    { id: 'ORD-4816', customer: 'Café Central', total: 420, status: 'Ready to Ship', date: '2026-04-14' },
    { id: 'ORD-4815', customer: 'Bistro Luna', total: 1280, status: 'Cancelled', date: '2026-04-13' },
  ];
  const statusColor = (s: string) =>
    ({
      Paid: 'bg-blue-100 text-blue-700',
      Processing: 'bg-purple-100 text-purple-700',
      'In Production': 'bg-amber-100 text-amber-700',
      'Ready to Ship': 'bg-cyan-100 text-cyan-700',
      Shipped: 'bg-indigo-100 text-indigo-700',
      Delivered: 'bg-green-100 text-green-700',
      Cancelled: 'bg-red-100 text-red-700',
    }[s] || 'bg-neutral-100 text-neutral-600');

  return (
    <>
      <h1 className="text-3xl font-light mb-6">Orders</h1>
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {['All', 'New', 'Paid', 'Processing', 'In Production', 'Ready', 'Shipped', 'Delivered', 'Cancelled'].map((s) => (
          <button key={s} className="px-4 py-2 text-xs font-bold border border-neutral-300 bg-white whitespace-nowrap hover:border-neutral-900">
            {s.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="bg-white border border-neutral-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 border-b border-neutral-200 text-xs tracking-wider text-neutral-500">
            <tr>
              <th className="text-left p-4">ORDER</th>
              <th className="text-left p-4">CUSTOMER</th>
              <th className="text-left p-4">DATE</th>
              <th className="text-left p-4">TOTAL</th>
              <th className="text-left p-4">STATUS</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                <td className="p-4 font-bold">{o.id}</td>
                <td className="p-4">{o.customer}</td>
                <td className="p-4 text-neutral-500">{o.date}</td>
                <td className="p-4 font-bold">€{o.total}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 font-medium ${statusColor(o.status)}`}>{o.status}</span>
                </td>
                <td className="p-4">
                  <button className="text-neutral-500 hover:text-neutral-900"><Eye className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

const SectionQuotes: React.FC = () => {
  const quotes = [
    { id: 'QR-2291', business: 'Hotel', project: 'Custom Inox Kitchen', client: 'Hotel Shkodra', status: 'New', date: '2026-04-16' },
    { id: 'QR-2290', business: 'Bakery', project: 'Bakery Kitchen Equipment', client: 'Panetteria Roma', status: 'In Review', date: '2026-04-15' },
    { id: 'QR-2289', business: 'Butcher', project: 'Butcher Shop Solutions', client: 'Macelleria Rossi', status: 'Offer Sent', date: '2026-04-14' },
    { id: 'QR-2288', business: 'Restaurant', project: 'Restaurant Kitchen Project', client: 'Trattoria Sole', status: 'Converted', date: '2026-04-12' },
  ];
  return (
    <>
      <h1 className="text-3xl font-light mb-6">Quote Requests</h1>
      <div className="bg-white border border-neutral-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 border-b border-neutral-200 text-xs tracking-wider text-neutral-500">
            <tr>
              <th className="text-left p-4">ID</th>
              <th className="text-left p-4">CLIENT</th>
              <th className="text-left p-4">BUSINESS</th>
              <th className="text-left p-4">PROJECT</th>
              <th className="text-left p-4">DATE</th>
              <th className="text-left p-4">STATUS</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody>
            {quotes.map((q) => (
              <tr key={q.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                <td className="p-4 font-bold">{q.id}</td>
                <td className="p-4">{q.client}</td>
                <td className="p-4">{q.business}</td>
                <td className="p-4">{q.project}</td>
                <td className="p-4 text-neutral-500">{q.date}</td>
                <td className="p-4">
                  <select defaultValue={q.status} className="text-xs border border-neutral-300 px-2 py-1 bg-white">
                    <option>New</option>
                    <option>In Review</option>
                    <option>Offer Sent</option>
                    <option>Converted</option>
                    <option>Rejected</option>
                  </select>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button className="text-neutral-500 hover:text-neutral-900"><Eye className="w-4 h-4" /></button>
                    <button className="text-neutral-500 hover:text-neutral-900"><Edit className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

const SectionUsers: React.FC = () => {
  const users = [
    { name: 'Admin Staff', email: 'admin@kitchenmfg.com', role: 'Super Admin', status: 'Active' },
    { name: 'Elena Dervishi', email: 'elena@kitchenmfg.com', role: 'Admin', status: 'Active' },
    { name: 'Marko Gjoni', email: 'marko@kitchenmfg.com', role: 'Sales Manager', status: 'Active' },
    { name: 'Arta Hoxha', email: 'arta@kitchenmfg.com', role: 'Product Manager', status: 'Active' },
    { name: 'Besnik Prifti', email: 'besnik@kitchenmfg.com', role: 'Order Manager', status: 'Suspended' },
    { name: 'Ilir Krasniqi', email: 'ilir@kitchenmfg.com', role: 'Staff', status: 'Active' },
  ];
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-light">Users & Roles</h1>
        <button className="bg-neutral-900 text-white px-5 py-2.5 text-xs font-bold tracking-[0.2em] flex items-center gap-2 hover:bg-neutral-700">
          <Plus className="w-4 h-4" /> ADD USER
        </button>
      </div>
      <div className="bg-white border border-neutral-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 border-b border-neutral-200 text-xs tracking-wider text-neutral-500">
            <tr>
              <th className="text-left p-4">USER</th>
              <th className="text-left p-4">EMAIL</th>
              <th className="text-left p-4">ROLE</th>
              <th className="text-left p-4">STATUS</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.email} className="border-b border-neutral-100 hover:bg-neutral-50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-neutral-400 to-neutral-700 flex items-center justify-center text-white text-xs font-bold">
                      {u.name.charAt(0)}
                    </div>
                    <span className="font-medium">{u.name}</span>
                  </div>
                </td>
                <td className="p-4 text-neutral-500">{u.email}</td>
                <td className="p-4">
                  <span className="text-xs bg-neutral-100 px-2 py-1 font-medium">{u.role}</span>
                </td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 font-medium ${u.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {u.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button className="text-neutral-500 hover:text-neutral-900"><Edit className="w-4 h-4" /></button>
                    <button className="text-neutral-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        {['Super Admin', 'Admin', 'Manager', 'Product Manager', 'Sales Manager', 'Order Manager', 'Staff'].map((r) => (
          <div key={r} className="bg-white border border-neutral-200 p-4">
            <div className="font-bold text-sm mb-1">{r}</div>
            <div className="text-xs text-neutral-500">Permissions: Products, Orders, Quotes, Analytics</div>
          </div>
        ))}
      </div>
    </>
  );
};

const SectionSettings: React.FC = () => {
  const [tab, setTab] = useState('company');
  const tabs = [
    { id: 'company', label: 'Company' },
    { id: 'shipping', label: 'Shipping & Tax' },
    { id: 'payments', label: 'Payments' },
    { id: 'homepage', label: 'Homepage' },
    { id: 'seo', label: 'SEO & Social' },
  ];
  return (
    <>
      <h1 className="text-3xl font-light mb-6">Settings</h1>
      <div className="flex gap-2 mb-6 border-b border-neutral-200 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-3 text-xs font-bold tracking-[0.15em] border-b-2 whitespace-nowrap transition ${
              tab === t.id ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            {t.label.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="bg-white border border-neutral-200 p-6 max-w-3xl">
        {tab === 'company' && (
          <div className="space-y-4">
            <div><label className="text-xs font-bold tracking-wider block mb-1">COMPANY NAME</label><input defaultValue="Kitchen Industrial Manufacturing" className="w-full border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-900" /></div>
            <div><label className="text-xs font-bold tracking-wider block mb-1">EMAIL</label><input defaultValue="info@kitchenmfg.com" className="w-full border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-900" /></div>
            <div><label className="text-xs font-bold tracking-wider block mb-1">PHONE</label><input defaultValue="+355 69 123 4567" className="w-full border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-900" /></div>
            <div><label className="text-xs font-bold tracking-wider block mb-1">WHATSAPP</label><input defaultValue="+355 69 123 4567" className="w-full border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-900" /></div>
            <div><label className="text-xs font-bold tracking-wider block mb-1">ADDRESS</label><textarea rows={3} defaultValue="Autostrada Tiranë-Durrës, km 8, Vorë, Albania" className="w-full border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-900" /></div>
            <div>
              <label className="text-xs font-bold tracking-wider block mb-1">LANGUAGES</label>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-neutral-900 text-white text-xs">English</span>
                <span className="px-3 py-1 bg-neutral-900 text-white text-xs">Albanian</span>
                <button className="px-3 py-1 border border-dashed border-neutral-400 text-xs text-neutral-500">+ Add</button>
              </div>
            </div>
          </div>
        )}
        {tab === 'shipping' && (
          <div className="space-y-4">
            <div><label className="text-xs font-bold tracking-wider block mb-1">FREE SHIPPING THRESHOLD (€)</label><input defaultValue="500" className="w-full border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-900" /></div>
            <div><label className="text-xs font-bold tracking-wider block mb-1">STANDARD SHIPPING RATE (€)</label><input defaultValue="25" className="w-full border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-900" /></div>
            <div><label className="text-xs font-bold tracking-wider block mb-1">VAT %</label><input defaultValue="20" className="w-full border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-900" /></div>
            <div>
              <label className="text-xs font-bold tracking-wider block mb-2">DELIVERY ZONES</label>
              <div className="space-y-2">
                {['Albania', 'Kosovo', 'North Macedonia', 'Italy', 'Greece'].map((z) => (
                  <label key={z} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" defaultChecked /> {z}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
        {tab === 'payments' && (
          <div className="space-y-3">
            {['Credit Card', 'Bank Transfer', 'Cash on Delivery', 'PayPal'].map((p) => (
              <label key={p} className="flex items-center gap-3 p-3 border border-neutral-200 text-sm cursor-pointer hover:border-neutral-400 transition">
                <input type="checkbox" defaultChecked /> {p}
              </label>
            ))}
          </div>
        )}
        {tab === 'homepage' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold tracking-wider block mb-2">HOMEPAGE SLIDER IMAGES</label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => <div key={i} className="aspect-video bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400 text-xs">{i}</div>)}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold tracking-wider block mb-2">FEATURED CATEGORIES</label>
              <div className="text-sm text-neutral-500">{CATEGORIES.slice(0, 5).map((c) => c.name.en).join(', ')}</div>
            </div>
            <div>
              <label className="text-xs font-bold tracking-wider block mb-2">FEATURED PRODUCTS</label>
              <div className="text-sm text-neutral-500">8 products selected</div>
            </div>
          </div>
        )}
        {tab === 'seo' && (
          <div className="space-y-4">
            <div><label className="text-xs font-bold tracking-wider block mb-1">META TITLE</label><input defaultValue="Kitchen Industrial MFG — Premium Stainless Steel Solutions" className="w-full border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-900" /></div>
            <div><label className="text-xs font-bold tracking-wider block mb-1">META DESCRIPTION</label><textarea rows={3} defaultValue="Precision inox manufacturing for professional kitchens, hotels, restaurants, bakeries and butchers." className="w-full border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-900" /></div>
            <div><label className="text-xs font-bold tracking-wider block mb-1">INSTAGRAM</label><input defaultValue="https://instagram.com/kitchenmfg" className="w-full border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-900" /></div>
            <div><label className="text-xs font-bold tracking-wider block mb-1">FACEBOOK</label><input defaultValue="https://facebook.com/kitchenmfg" className="w-full border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-900" /></div>
          </div>
        )}
        <button className="bg-neutral-900 text-white px-8 py-3 text-xs font-bold tracking-[0.2em] mt-6 hover:bg-neutral-700 transition">
          SAVE CHANGES
        </button>
      </div>
    </>
  );
};

export default AdminStaff;
