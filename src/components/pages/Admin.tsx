import React, { useState } from 'react';
import { useShop } from '@/contexts/ShopContext';
import { PRODUCTS, CATEGORIES } from '@/lib/data';
import { LayoutDashboard, Package, ShoppingCart, FileText, Users, Settings, TrendingUp, DollarSign, AlertTriangle, Eye, Edit, Trash2, Plus, Search, ArrowLeft, LogOut } from 'lucide-react';

const STAFF_PASS_KEY = 'staff_password';
const getStoredPass = () => localStorage.getItem(STAFF_PASS_KEY) || 'admin';

type Section = 'dashboard' | 'products' | 'orders' | 'quotes' | 'users' | 'settings';

interface AdminProps {
  onLogout?: () => void;
}

const Admin: React.FC<AdminProps> = ({ onLogout }) => {
  const { navigate, t } = useShop();
  const [section, setSection] = useState<Section>('dashboard');

  const nav: { id: Section; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: t.admin.nav.dashboard, icon: LayoutDashboard },
    { id: 'products', label: t.admin.nav.products, icon: Package },
    { id: 'orders', label: t.admin.nav.orders, icon: ShoppingCart },
    { id: 'quotes', label: t.admin.nav.quoteRequests, icon: FileText },
    { id: 'users', label: t.admin.nav.usersRoles, icon: Users },
    { id: 'settings', label: t.admin.nav.settings, icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 -mt-0">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-neutral-950 text-neutral-300 min-h-screen p-6 hidden md:flex flex-col">
          {onLogout ? (
            <div className="mb-8" />
          ) : (
            <button onClick={() => navigate({ name: 'home' })} className="flex items-center gap-2 text-xs tracking-[0.2em] text-neutral-500 hover:text-white mb-8">
              <ArrowLeft className="w-3 h-3" /> {t.admin.panel.backToStore}
            </button>
          )}
          <div className="mb-10">
            <div className="text-[10px] tracking-[0.3em] text-neutral-500 mb-1">{t.admin.panel.adminPanel}</div>
            <div className="text-xl font-light text-white">{t.admin.panel.kitchenMfg}</div>
          </div>
          <nav className="space-y-1 flex-1">
            {nav.map((n) => (
              <button key={n.id} onClick={() => setSection(n.id)}
                className={`w-full text-left flex items-center gap-3 px-4 py-3 text-sm transition ${section === n.id ? 'bg-white/10 text-white' : 'text-neutral-400 hover:bg-white/5 hover:text-white'}`}>
                <n.icon className="w-4 h-4" /> {n.label}
              </button>
            ))}
          </nav>
          <div className="mt-10 pt-6 border-t border-neutral-800">
            <div className="text-[10px] tracking-[0.3em] text-neutral-500 mb-3">{t.admin.panel.signedInAs}</div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-neutral-400 to-neutral-700 rounded-full flex items-center justify-center font-bold text-white">A</div>
              <div>
                <div className="text-sm text-white">{t.admin.panel.adminUser}</div>
                <div className="text-[10px] text-neutral-500">{t.admin.panel.superAdmin}</div>
              </div>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-xs tracking-[0.15em] text-neutral-400 hover:text-red-400 hover:bg-red-900/20 transition"
              >
                <LogOut className="w-3.5 h-3.5" /> {t.admin.panel.logout.toUpperCase()}
              </button>
            )}
          </div>
        </aside>

        {/* Mobile nav */}
        <div className="md:hidden w-full bg-neutral-950 p-4 overflow-x-auto">
          <div className="flex gap-2 items-center">
            {nav.map((n) => (
              <button key={n.id} onClick={() => setSection(n.id)} className={`px-3 py-2 text-xs font-bold whitespace-nowrap ${section === n.id ? 'bg-white text-neutral-900' : 'text-neutral-400'}`}>
                {n.label}
              </button>
            ))}
            {onLogout && (
              <button
                onClick={onLogout}
                className="ml-auto flex items-center gap-1 px-3 py-2 text-xs text-red-400 whitespace-nowrap"
              >
                <LogOut className="w-3 h-3" /> {t.admin.panel.logout}
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 p-6 md:p-10 overflow-x-hidden">
          {section === 'dashboard' && <Dashboard />}
          {section === 'products' && <ProductsAdmin />}
          {section === 'orders' && <OrdersAdmin />}
          {section === 'quotes' && <QuotesAdmin />}
          {section === 'users' && <UsersAdmin />}
          {section === 'settings' && <SettingsAdmin />}
        </main>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { t } = useShop();
  const stats = [
    { label: t.admin.stats.todaySales, value: '€4,820', change: '+12.4%', icon: DollarSign, color: 'text-green-600' },
    { label: t.admin.stats.thisWeek, value: '€28,450', change: '+8.2%', icon: TrendingUp, color: 'text-green-600' },
    { label: t.admin.stats.thisMonth, value: '€142,800', change: '+18.6%', icon: TrendingUp, color: 'text-green-600' },
    { label: t.admin.stats.pendingOrders, value: '24', change: t.admin.stats.new, icon: ShoppingCart, color: 'text-amber-600' },
  ];
  const topProducts = PRODUCTS.slice(0, 5);
  const recentOrders = [
    { id: 'ORD-4821', customer: 'Hotel Adriatic', total: 3240, status: t.admin.orders.inProduction },
    { id: 'ORD-4820', customer: 'Bakery Artigiana', total: 1890, status: t.admin.orders.shipped },
    { id: 'ORD-4819', customer: 'Restaurant Vila', total: 890, status: t.admin.orders.paid },
    { id: 'ORD-4818', customer: 'Butcher Mario', total: 2450, status: t.admin.orders.delivered },
    { id: 'ORD-4817', customer: 'Hotel Mediterranean', total: 5680, status: t.admin.orders.processing },
  ];
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-light">{t.admin.dashboard.title}</h1>
          <div className="text-sm text-neutral-500">{t.admin.dashboard.welcome}</div>
        </div>
        <select className="border border-neutral-300 px-4 py-2 text-sm bg-white">
          <option>{t.admin.dashboard.last30Days}</option>
          <option>{t.admin.dashboard.last7Days}</option>
          <option>{t.admin.dashboard.today}</option>
          <option>{t.admin.dashboard.custom}</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white p-6 border border-neutral-200">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-neutral-900 text-white flex items-center justify-center"><s.icon className="w-4 h-4" /></div>
              <span className={`text-xs font-bold ${s.color}`}>{s.change}</span>
            </div>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-neutral-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Chart placeholder */}
      <div className="bg-white p-6 border border-neutral-200 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="font-bold">{t.admin.dashboard.revenueOverview}</div>
            <div className="text-xs text-neutral-500">{t.admin.dashboard.last30Days}</div>
          </div>
          <div className="text-2xl font-bold">€142,800</div>
        </div>
        <div className="h-48 flex items-end gap-1">
          {Array.from({ length: 30 }).map((_, i) => {
            const h = 20 + Math.sin(i * 0.4) * 30 + Math.random() * 40;
            return <div key={i} className="flex-1 bg-gradient-to-t from-neutral-900 to-neutral-600 hover:from-neutral-700 transition" style={{ height: `${h}%` }}></div>;
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white p-6 border border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <div className="font-bold">{t.admin.dashboard.recentOrders}</div>
            <button className="text-xs text-neutral-500 hover:text-neutral-900">{t.admin.dashboard.viewAll}</button>
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
          <div className="flex items-center justify-between mb-4">
            <div className="font-bold">{t.admin.dashboard.topSellingProducts}</div>
          </div>
          <div className="space-y-2">
            {topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 py-2 border-b border-neutral-100">
                <div className="text-xs text-neutral-400 w-5">0{i + 1}</div>
                <img src={p.image} className="w-10 h-10 object-contain bg-neutral-50 p-1" alt="" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{p.name.en}</div>
                  <div className="text-xs text-neutral-500">{Math.floor(Math.random() * 100 + 50)} sold</div>
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
          <div className="font-bold text-sm text-amber-900">{t.admin.dashboard.lowStockAlert}</div>
          <div className="text-sm text-amber-800 mt-1">{t.admin.dashboard.lowStockMsg}</div>
        </div>
      </div>
    </>
  );
};

const ProductsAdmin: React.FC = () => {
  const { t } = useShop();
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-light">{t.admin.products.title}</h1>
        <button className="bg-neutral-900 text-white px-5 py-2.5 text-xs font-bold tracking-[0.2em] flex items-center gap-2 hover:bg-neutral-700">
          <Plus className="w-4 h-4" /> {t.admin.products.addProduct.toUpperCase()}
        </button>
      </div>
      <div className="bg-white border border-neutral-200 mb-4 p-4 flex items-center gap-3">
        <Search className="w-4 h-4 text-neutral-400" />
        <input placeholder={t.admin.products.searchProducts} className="flex-1 outline-none text-sm" />
        <select className="border border-neutral-300 px-3 py-2 text-sm"><option>{t.admin.products.allCategories}</option></select>
      </div>
      <div className="bg-white border border-neutral-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 border-b border-neutral-200 text-xs tracking-wider text-neutral-500">
            <tr>
              <th className="text-left p-4">{t.admin.products.product.toUpperCase()}</th>
              <th className="text-left p-4">{t.admin.products.sku.toUpperCase()}</th>
              <th className="text-left p-4">{t.admin.products.category.toUpperCase()}</th>
              <th className="text-left p-4">{t.admin.products.price.toUpperCase()}</th>
              <th className="text-left p-4">{t.admin.products.stock.toUpperCase()}</th>
              <th className="text-left p-4">{t.admin.products.status.toUpperCase()}</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {PRODUCTS.map((p) => (
              <tr key={p.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                <td className="p-4 flex items-center gap-3"><img src={p.image} className="w-10 h-10 object-contain bg-neutral-50 p-1" alt="" /><span className="font-medium">{p.name.en}</span></td>
                <td className="p-4 text-neutral-500">{p.sku}</td>
                <td className="p-4">{p.category}</td>
                <td className="p-4 font-bold">{p.price ? `€${p.price}` : 'Quote'}</td>
                <td className="p-4">
                  <span className={`${p.stock > 20 ? 'text-green-600' : p.stock > 5 ? 'text-amber-600' : 'text-red-600'} font-medium`}>{p.stock}</span>
                </td>
                <td className="p-4"><span className="text-xs bg-green-100 text-green-700 px-2 py-1 font-medium">{t.admin.products.active}</span></td>
                <td className="p-4 flex gap-2">
                  <button className="text-neutral-500 hover:text-neutral-900"><Eye className="w-4 h-4" /></button>
                  <button className="text-neutral-500 hover:text-neutral-900"><Edit className="w-4 h-4" /></button>
                  <button className="text-neutral-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

const OrdersAdmin: React.FC = () => {
  const { t } = useShop();
  const orders = [
    { id: 'ORD-4821', customer: 'Hotel Adriatic', total: 3240, status: 'In Production', date: '2026-04-16' },
    { id: 'ORD-4820', customer: 'Bakery Artigiana', total: 1890, status: 'Shipped', date: '2026-04-16' },
    { id: 'ORD-4819', customer: 'Restaurant Vila', total: 890, status: 'Paid', date: '2026-04-15' },
    { id: 'ORD-4818', customer: 'Butcher Mario', total: 2450, status: 'Delivered', date: '2026-04-15' },
    { id: 'ORD-4817', customer: 'Hotel Mediterranean', total: 5680, status: 'Processing', date: '2026-04-14' },
    { id: 'ORD-4816', customer: 'Café Central', total: 420, status: 'Ready to Ship', date: '2026-04-14' },
    { id: 'ORD-4815', customer: 'Bistro Luna', total: 1280, status: 'Cancelled', date: '2026-04-13' },
  ];
  const statusColor = (s: string) => ({
    'Paid': 'bg-blue-100 text-blue-700',
    'Processing': 'bg-purple-100 text-purple-700',
    'In Production': 'bg-amber-100 text-amber-700',
    'Ready to Ship': 'bg-cyan-100 text-cyan-700',
    'Shipped': 'bg-indigo-100 text-indigo-700',
    'Delivered': 'bg-green-100 text-green-700',
    'Cancelled': 'bg-red-100 text-red-700',
  }[s] || 'bg-neutral-100');
  const statusLabel = (s: string) => ({
    'Paid': t.admin.orders.paid,
    'Processing': t.admin.orders.processing,
    'In Production': t.admin.orders.inProduction,
    'Ready to Ship': t.admin.orders.ready,
    'Shipped': t.admin.orders.shipped,
    'Delivered': t.admin.orders.delivered,
    'Cancelled': t.admin.orders.cancelled,
  }[s] || s);
  const filters = [
    t.admin.orders.all, t.admin.orders.new, t.admin.orders.paid, t.admin.orders.processing,
    t.admin.orders.inProduction, t.admin.orders.ready, t.admin.orders.shipped,
    t.admin.orders.delivered, t.admin.orders.cancelled,
  ];
  return (
    <>
      <h1 className="text-3xl font-light mb-6">{t.admin.orders.title}</h1>
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {filters.map((s) => (
          <button key={s} className="px-4 py-2 text-xs font-bold border border-neutral-300 bg-white whitespace-nowrap hover:border-neutral-900">{s.toUpperCase()}</button>
        ))}
      </div>
      <div className="bg-white border border-neutral-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 border-b border-neutral-200 text-xs tracking-wider text-neutral-500">
            <tr>
              <th className="text-left p-4">{t.admin.orders.order.toUpperCase()}</th>
              <th className="text-left p-4">{t.admin.orders.customer.toUpperCase()}</th>
              <th className="text-left p-4">{t.admin.orders.date.toUpperCase()}</th>
              <th className="text-left p-4">{t.admin.orders.total.toUpperCase()}</th>
              <th className="text-left p-4">{t.admin.orders.status.toUpperCase()}</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                <td className="p-4 font-bold">{o.id}</td>
                <td className="p-4">{o.customer}</td>
                <td className="p-4 text-neutral-500">{o.date}</td>
                <td className="p-4 font-bold">€{o.total}</td>
                <td className="p-4"><span className={`text-xs px-2 py-1 font-medium ${statusColor(o.status)}`}>{statusLabel(o.status)}</span></td>
                <td className="p-4"><button className="text-neutral-500 hover:text-neutral-900"><Eye className="w-4 h-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

const QuotesAdmin: React.FC = () => {
  const { t } = useShop();
  const quotes = [
    { id: 'QR-2291', business: 'Hotel', project: 'Custom Inox Kitchen', client: 'Hotel Shkodra', status: 'New', date: '2026-04-16' },
    { id: 'QR-2290', business: 'Bakery', project: 'Bakery Kitchen Equipment', client: 'Panetteria Roma', status: 'In Review', date: '2026-04-15' },
    { id: 'QR-2289', business: 'Butcher', project: 'Butcher Shop Solutions', client: 'Macelleria Rossi', status: 'Offer Sent', date: '2026-04-14' },
    { id: 'QR-2288', business: 'Restaurant', project: 'Restaurant Kitchen Project', client: 'Trattoria Sole', status: 'Converted', date: '2026-04-12' },
  ];
  return (
    <>
      <h1 className="text-3xl font-light mb-6">{t.admin.quotes.title}</h1>
      <div className="bg-white border border-neutral-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 border-b border-neutral-200 text-xs tracking-wider text-neutral-500">
            <tr>
              <th className="text-left p-4">{t.admin.quotes.id.toUpperCase()}</th>
              <th className="text-left p-4">{t.admin.quotes.client.toUpperCase()}</th>
              <th className="text-left p-4">{t.admin.quotes.business.toUpperCase()}</th>
              <th className="text-left p-4">{t.admin.quotes.project.toUpperCase()}</th>
              <th className="text-left p-4">{t.admin.quotes.date.toUpperCase()}</th>
              <th className="text-left p-4">{t.admin.quotes.status.toUpperCase()}</th>
              <th className="p-4"></th>
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
                  <select defaultValue={q.status} className="text-xs border border-neutral-300 px-2 py-1">
                    <option value="New">{t.admin.quotes.new}</option>
                    <option value="In Review">{t.admin.quotes.inReview}</option>
                    <option value="Offer Sent">{t.admin.quotes.offerSent}</option>
                    <option value="Converted">{t.admin.quotes.converted}</option>
                    <option value="Rejected">{t.admin.quotes.rejected}</option>
                  </select>
                </td>
                <td className="p-4 flex gap-2">
                  <button className="text-neutral-500 hover:text-neutral-900"><Eye className="w-4 h-4" /></button>
                  <button className="text-neutral-500 hover:text-neutral-900"><Edit className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

const UsersAdmin: React.FC = () => {
  const { t } = useShop();
  const users = [
    { name: 'Admin User', email: 'admin@kitchenmfg.com', role: 'Super Admin', status: 'Active' },
    { name: 'Elena Dervishi', email: 'elena@kitchenmfg.com', role: 'Admin', status: 'Active' },
    { name: 'Marko Gjoni', email: 'marko@kitchenmfg.com', role: 'Sales Manager', status: 'Active' },
    { name: 'Arta Hoxha', email: 'arta@kitchenmfg.com', role: 'Product Manager', status: 'Active' },
    { name: 'Besnik Prifti', email: 'besnik@kitchenmfg.com', role: 'Order Manager', status: 'Suspended' },
    { name: 'Ilir Krasniqi', email: 'ilir@kitchenmfg.com', role: 'Staff', status: 'Active' },
  ];
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-light">{t.admin.users.title}</h1>
        <button className="bg-neutral-900 text-white px-5 py-2.5 text-xs font-bold tracking-[0.2em] flex items-center gap-2">
          <Plus className="w-4 h-4" /> {t.admin.users.addUser.toUpperCase()}
        </button>
      </div>
      <div className="bg-white border border-neutral-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 border-b border-neutral-200 text-xs tracking-wider text-neutral-500">
            <tr>
              <th className="text-left p-4">{t.admin.users.user.toUpperCase()}</th>
              <th className="text-left p-4">{t.admin.users.email.toUpperCase()}</th>
              <th className="text-left p-4">{t.admin.users.role.toUpperCase()}</th>
              <th className="text-left p-4">{t.admin.users.status.toUpperCase()}</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.email} className="border-b border-neutral-100 hover:bg-neutral-50">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-neutral-400 to-neutral-700 rounded-full flex items-center justify-center text-white text-xs font-bold">{u.name.charAt(0)}</div>
                  <span className="font-medium">{u.name}</span>
                </td>
                <td className="p-4 text-neutral-500">{u.email}</td>
                <td className="p-4"><span className="text-xs bg-neutral-100 px-2 py-1 font-medium">{u.role}</span></td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 font-medium ${u.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {u.status === 'Active' ? t.admin.users.active : t.admin.users.suspended}
                  </span>
                </td>
                <td className="p-4 flex gap-2">
                  <button className="text-neutral-500 hover:text-neutral-900"><Edit className="w-4 h-4" /></button>
                  <button className="text-neutral-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
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
            <div className="text-xs text-neutral-500">{t.admin.users.permissions}</div>
          </div>
        ))}
      </div>
    </>
  );
};

const ChangePasswordForm: React.FC = () => {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (currentPass !== getStoredPass()) {
      setMessage({ type: 'error', text: 'Fjalëkalimi aktual është gabim.' });
      return;
    }
    if (newPass.length < 6) {
      setMessage({ type: 'error', text: 'Fjalëkalimi i ri duhet të ketë të paktën 6 karaktere.' });
      return;
    }
    if (newPass !== confirmPass) {
      setMessage({ type: 'error', text: 'Fjalëkalimi i ri dhe konfirmimi nuk përputhen.' });
      return;
    }

    localStorage.setItem(STAFF_PASS_KEY, newPass);
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    setMessage({ type: 'success', text: 'Fjalëkalimi u ndryshua me sukses.' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-xs font-bold tracking-wider block mb-1">FJALËKALIMI AKTUAL</label>
        <input
          type="password"
          required
          value={currentPass}
          onChange={(e) => setCurrentPass(e.target.value)}
          placeholder="••••••••"
          className="w-full border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-600"
        />
      </div>
      <div>
        <label className="text-xs font-bold tracking-wider block mb-1">FJALËKALIMI I RI</label>
        <input
          type="password"
          required
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
          placeholder="••••••••"
          className="w-full border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-600"
        />
      </div>
      <div>
        <label className="text-xs font-bold tracking-wider block mb-1">KONFIRMO FJALËKALIMIN E RI</label>
        <input
          type="password"
          required
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
          placeholder="••••••••"
          className="w-full border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-600"
        />
      </div>
      {message && (
        <div className={`px-4 py-3 text-xs ${message.type === 'success' ? 'bg-green-50 border border-green-300 text-green-800' : 'bg-red-50 border border-red-300 text-red-800'}`}>
          {message.text}
        </div>
      )}
      <button type="submit" className="bg-neutral-900 text-white px-8 py-3 text-xs font-bold tracking-[0.2em] hover:bg-neutral-700">
        NDRYSHO FJALËKALIMIN
      </button>
    </form>
  );
};

const SettingsAdmin: React.FC = () => {
  const { t } = useShop();
  const [tab, setTab] = useState('company');
  const tabs = [
    { id: 'company', label: t.admin.settings.company },
    { id: 'shipping', label: t.admin.settings.shipping },
    { id: 'payments', label: t.admin.settings.payments },
    { id: 'homepage', label: t.admin.settings.homepage },
    { id: 'seo', label: t.admin.settings.seoSocial },
    { id: 'security', label: 'Security' },
  ];
  return (
    <>
      <h1 className="text-3xl font-light mb-6">{t.admin.settings.title}</h1>
      <div className="flex gap-2 mb-6 border-b border-neutral-200 overflow-x-auto">
        {tabs.map((tb) => (
          <button key={tb.id} onClick={() => setTab(tb.id)} className={`px-4 py-3 text-xs font-bold tracking-[0.15em] border-b-2 whitespace-nowrap transition ${tab === tb.id ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-500 hover:text-neutral-900'}`}>
            {tb.label.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="bg-white border border-neutral-200 p-6 max-w-3xl">
        {tab === 'company' && (
          <div className="space-y-4">
            <div><label className="text-xs font-bold tracking-wider block mb-1">{t.admin.settings.companyName.toUpperCase()}</label><input defaultValue="Jasin Metal" className="w-full border border-neutral-300 px-4 py-2.5 text-sm" /></div>
            <div><label className="text-xs font-bold tracking-wider block mb-1">{t.admin.settings.email.toUpperCase()}</label><input defaultValue="info@jasin-metal.com" className="w-full border border-neutral-300 px-4 py-2.5 text-sm" /></div>
            <div><label className="text-xs font-bold tracking-wider block mb-1">{t.admin.settings.phone.toUpperCase()}</label><input defaultValue="+383 49 308 338" className="w-full border border-neutral-300 px-4 py-2.5 text-sm" /></div>
            <div><label className="text-xs font-bold tracking-wider block mb-1">{t.admin.settings.whatsapp.toUpperCase()}</label><input defaultValue="+38349308338" className="w-full border border-neutral-300 px-4 py-2.5 text-sm" /></div>
            <div><label className="text-xs font-bold tracking-wider block mb-1">{t.admin.settings.address.toUpperCase()}</label><textarea rows={3} defaultValue="Kosovë, Prizren, Lubizhde, rruga: Tranziti Vjeter" className="w-full border border-neutral-300 px-4 py-2.5 text-sm" /></div>
            <div><label className="text-xs font-bold tracking-wider block mb-1">{t.admin.settings.languages.toUpperCase()}</label><div className="flex gap-2"><span className="px-3 py-1 bg-neutral-900 text-white text-xs">English</span><span className="px-3 py-1 bg-neutral-900 text-white text-xs">Albanian</span><button className="px-3 py-1 border border-dashed border-neutral-400 text-xs text-neutral-500">{t.admin.settings.addLanguage}</button></div></div>
          </div>
        )}
        {tab === 'shipping' && (
          <div className="space-y-4">
            <div><label className="text-xs font-bold tracking-wider block mb-1">{t.admin.settings.freeShippingThreshold.toUpperCase()}</label><input defaultValue="500" className="w-full border border-neutral-300 px-4 py-2.5 text-sm" /></div>
            <div><label className="text-xs font-bold tracking-wider block mb-1">{t.admin.settings.standardShippingRate.toUpperCase()}</label><input defaultValue="25" className="w-full border border-neutral-300 px-4 py-2.5 text-sm" /></div>
            <div><label className="text-xs font-bold tracking-wider block mb-1">{t.admin.settings.vat.toUpperCase()}</label><input defaultValue="20" className="w-full border border-neutral-300 px-4 py-2.5 text-sm" /></div>
            <div><label className="text-xs font-bold tracking-wider block mb-1">{t.admin.settings.deliveryZones.toUpperCase()}</label><div className="space-y-2">{['Albania', 'Kosovo', 'North Macedonia', 'Italy', 'Greece'].map((z) => <div key={z} className="flex items-center gap-2"><input type="checkbox" defaultChecked /> {z}</div>)}</div></div>
          </div>
        )}
        {tab === 'payments' && (
          <div className="space-y-3">{['Credit Card', 'Bank Transfer', 'Cash on Delivery', 'PayPal'].map((p) => <label key={p} className="flex items-center gap-3 p-3 border border-neutral-200"><input type="checkbox" defaultChecked /> {p}</label>)}</div>
        )}
        {tab === 'homepage' && (
          <div className="space-y-4">
            <div><label className="text-xs font-bold tracking-wider block mb-2">{t.admin.settings.homepageSlider.toUpperCase()}</label><div className="grid grid-cols-4 gap-2">{[1,2,3,4].map((i) => <div key={i} className="aspect-video bg-neutral-100 border border-neutral-200"></div>)}</div></div>
            <div><label className="text-xs font-bold tracking-wider block mb-2">{t.admin.settings.featuredCategoriesLabel.toUpperCase()}</label><div className="text-sm text-neutral-500">{CATEGORIES.slice(0, 5).map((c) => c.name.en).join(', ')}</div></div>
            <div><label className="text-xs font-bold tracking-wider block mb-2">{t.admin.settings.featuredProductsLabel.toUpperCase()}</label><div className="text-sm text-neutral-500">{t.admin.settings.featuredProducts}</div></div>
          </div>
        )}
        {tab === 'seo' && (
          <div className="space-y-4">
            <div><label className="text-xs font-bold tracking-wider block mb-1">{t.admin.settings.metaTitle.toUpperCase()}</label><input defaultValue="Jasin Metal — Premium Stainless Steel Solutions" className="w-full border border-neutral-300 px-4 py-2.5 text-sm" /></div>
            <div><label className="text-xs font-bold tracking-wider block mb-1">{t.admin.settings.metaDescription.toUpperCase()}</label><textarea rows={3} defaultValue="Precision inox manufacturing for professional kitchens, hotels, restaurants, bakeries and butchers." className="w-full border border-neutral-300 px-4 py-2.5 text-sm" /></div>
            <div><label className="text-xs font-bold tracking-wider block mb-1">INSTAGRAM</label><input defaultValue="https://instagram.com/kitchenmfg" className="w-full border border-neutral-300 px-4 py-2.5 text-sm" /></div>
            <div><label className="text-xs font-bold tracking-wider block mb-1">FACEBOOK</label><input defaultValue="https://facebook.com/kitchenmfg" className="w-full border border-neutral-300 px-4 py-2.5 text-sm" /></div>
          </div>
        )}
        {tab === 'security' && (
          <div>
            <h2 className="text-sm font-bold tracking-wider mb-4">NDRYSHO FJALËKALIMIN</h2>
            <ChangePasswordForm />
          </div>
        )}
        {tab !== 'security' && (
          <button className="bg-neutral-900 text-white px-8 py-3 text-xs font-bold tracking-[0.2em] mt-6 hover:bg-neutral-700">{t.admin.settings.saveChanges.toUpperCase()}</button>
        )}
      </div>
    </>
  );
};

export default Admin;
