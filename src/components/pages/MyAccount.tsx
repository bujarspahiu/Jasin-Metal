import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useShop } from '@/contexts/ShopContext';
import { PRODUCTS } from '@/lib/data';
import ProductCard from '@/components/ProductCard';
import { User as UserIcon, Package, MapPin, Heart, Settings, LogOut, Plus, Trash2, Edit, Check, Building2, ShoppingBag, Calendar } from 'lucide-react';

const MyAccount: React.FC = () => {
  const { user, logout, updateProfile, addAddress, removeAddress } = useAuth();
  const { navigate, wishlist } = useShop();
  const [tab, setTab] = useState<'overview' | 'orders' | 'addresses' | 'wishlist' | 'profile'>('overview');

  if (!user) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: UserIcon },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'profile', label: 'Profile Settings', icon: Settings },
  ];

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex items-center gap-5">
          <div className="w-16 h-16 bg-gradient-to-br from-neutral-700 to-neutral-950 rounded-full flex items-center justify-center text-white text-xl font-light">
            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] tracking-[0.3em] text-neutral-500 mb-1">
              MY ACCOUNT {user.accountType === 'b2b' && '· B2B CLIENT'}
            </div>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight">
              {user.firstName} {user.lastName}
            </h1>
            <div className="text-sm text-neutral-500">{user.email}{user.companyName && ` · ${user.companyName}`}</div>
          </div>
          <button onClick={() => { logout(); navigate({ name: 'home' }); }} className="hidden md:flex items-center gap-2 border border-neutral-300 px-4 py-2 text-xs font-bold tracking-wider hover:border-neutral-900 transition">
            <LogOut className="w-3.5 h-3.5" /> SIGN OUT
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 grid lg:grid-cols-[240px_1fr] gap-8">
        {/* Sidebar */}
        <aside>
          <nav className="bg-white border border-neutral-200">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id as any)}
                className={`w-full text-left flex items-center gap-3 px-5 py-4 text-sm border-b border-neutral-100 last:border-b-0 transition ${tab === t.id ? 'bg-neutral-950 text-white' : 'hover:bg-neutral-50'}`}>
                <t.icon className="w-4 h-4" /> {t.label}
                {t.id === 'wishlist' && wishlist.length > 0 && <span className="ml-auto text-[10px] bg-white text-neutral-900 px-1.5 py-0.5">{wishlist.length}</span>}
                {t.id === 'orders' && user.orders.length > 0 && <span className={`ml-auto text-[10px] px-1.5 py-0.5 ${tab === t.id ? 'bg-white text-neutral-900' : 'bg-neutral-900 text-white'}`}>{user.orders.length}</span>}
              </button>
            ))}
            <button onClick={() => { logout(); navigate({ name: 'home' }); }} className="w-full text-left flex items-center gap-3 px-5 py-4 text-sm text-red-600 hover:bg-red-50 transition md:hidden border-t border-neutral-100">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </nav>
        </aside>

        {/* Content */}
        <section>
          {tab === 'overview' && <Overview user={user} onTab={setTab} />}
          {tab === 'orders' && <Orders user={user} />}
          {tab === 'addresses' && <Addresses user={user} addAddress={addAddress} removeAddress={removeAddress} />}
          {tab === 'wishlist' && <WishlistTab />}
          {tab === 'profile' && <Profile user={user} updateProfile={updateProfile} />}
        </section>
      </div>
    </div>
  );
};

const Overview: React.FC<{ user: any; onTab: (t: any) => void }> = ({ user, onTab }) => {
  const totalSpent = user.orders.reduce((s: number, o: any) => s + o.total, 0);
  const cards = [
    { label: 'Total Orders', value: user.orders.length, icon: Package, color: 'bg-blue-50 text-blue-700' },
    { label: 'Total Spent', value: `€${totalSpent}`, icon: ShoppingBag, color: 'bg-green-50 text-green-700' },
    { label: 'Saved Addresses', value: user.addresses.length, icon: MapPin, color: 'bg-purple-50 text-purple-700' },
    { label: 'Account Type', value: user.accountType === 'b2b' ? 'B2B' : 'B2C', icon: user.accountType === 'b2b' ? Building2 : UserIcon, color: 'bg-amber-50 text-amber-700' },
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="bg-white border border-neutral-200 p-5">
            <div className={`w-9 h-9 ${c.color} flex items-center justify-center mb-3`}><c.icon className="w-4 h-4" /></div>
            <div className="text-2xl font-bold">{c.value}</div>
            <div className="text-xs text-neutral-500 mt-0.5">{c.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-white border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="font-bold">Recent Orders</div>
          <button onClick={() => onTab('orders')} className="text-xs text-neutral-500 hover:text-neutral-900">View all →</button>
        </div>
        {user.orders.length === 0 ? (
          <div className="text-center py-10 text-sm text-neutral-500">No orders yet. Start shopping to see your order history here.</div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {user.orders.slice(0, 3).map((o: any) => (
              <div key={o.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">{o.id}</div>
                  <div className="text-xs text-neutral-500">{o.date} · {o.items} items</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">€{o.total}</div>
                  <div className="text-[10px] tracking-wider text-green-600">{o.status.toUpperCase()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Orders: React.FC<{ user: any }> = ({ user }) => (
  <div className="bg-white border border-neutral-200">
    <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
      <div className="font-bold">Order History</div>
      <select className="text-xs border border-neutral-300 px-3 py-1.5"><option>All time</option><option>Last 30 days</option><option>Last year</option></select>
    </div>
    {user.orders.length === 0 ? (
      <div className="p-12 text-center text-sm text-neutral-500">
        <Package className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
        No orders yet.
      </div>
    ) : (
      <div className="divide-y divide-neutral-100">
        {user.orders.map((o: any) => (
          <div key={o.id} className="p-5 flex flex-wrap gap-4 items-center hover:bg-neutral-50 transition">
            <div className="w-12 h-12 bg-neutral-100 flex items-center justify-center shrink-0"><Package className="w-5 h-5 text-neutral-500" /></div>
            <div className="flex-1 min-w-[180px]">
              <div className="font-bold">{o.id}</div>
              <div className="text-xs text-neutral-500 flex items-center gap-2"><Calendar className="w-3 h-3" /> {o.date} · {o.items} items</div>
            </div>
            <div><span className="text-[10px] tracking-wider bg-green-100 text-green-700 px-2 py-1 font-medium">{o.status.toUpperCase()}</span></div>
            <div className="font-bold text-lg">€{o.total}</div>
            <button className="text-xs tracking-wider text-neutral-700 hover:text-neutral-900 border border-neutral-300 px-3 py-1.5 hover:border-neutral-900">VIEW DETAILS</button>
          </div>
        ))}
      </div>
    )}
  </div>
);

const Addresses: React.FC<{ user: any; addAddress: any; removeAddress: any }> = ({ user, addAddress, removeAddress }) => {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ label: 'Home', line1: '', city: '', postal: '', country: 'Albania' });
  return (
    <div className="space-y-4">
      {user.addresses.length === 0 && !adding && (
        <div className="bg-white border border-neutral-200 p-12 text-center">
          <MapPin className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
          <div className="font-medium mb-2">No addresses saved</div>
          <div className="text-sm text-neutral-500 mb-5">Add a delivery address to speed up checkout.</div>
          <button onClick={() => setAdding(true)} className="bg-neutral-900 text-white px-6 py-3 text-xs font-bold tracking-[0.2em] hover:bg-neutral-700 inline-flex items-center gap-2"><Plus className="w-3.5 h-3.5" /> ADD ADDRESS</button>
        </div>
      )}
      {user.addresses.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          {user.addresses.map((a: any) => (
            <div key={a.id} className="bg-white border border-neutral-200 p-5 relative">
              {a.isDefault && <span className="absolute top-3 right-3 text-[9px] tracking-wider bg-neutral-900 text-white px-2 py-0.5">DEFAULT</span>}
              <div className="text-[10px] tracking-[0.3em] text-neutral-500 mb-2">{a.label.toUpperCase()}</div>
              <div className="text-sm leading-relaxed">{a.line1}<br/>{a.city}, {a.postal}<br/>{a.country}</div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-neutral-100">
                <button className="text-xs text-neutral-600 hover:text-neutral-900 flex items-center gap-1"><Edit className="w-3 h-3" /> Edit</button>
                <button onClick={() => removeAddress(a.id)} className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"><Trash2 className="w-3 h-3" /> Remove</button>
              </div>
            </div>
          ))}
          {!adding && (
            <button onClick={() => setAdding(true)} className="border-2 border-dashed border-neutral-300 hover:border-neutral-900 p-5 flex items-center justify-center gap-2 text-sm font-bold tracking-wider text-neutral-600 hover:text-neutral-900 transition min-h-[160px]">
              <Plus className="w-4 h-4" /> ADD NEW ADDRESS
            </button>
          )}
        </div>
      )}
      {adding && (
        <form onSubmit={(e) => { e.preventDefault(); addAddress({ ...form, isDefault: user.addresses.length === 0 }); setAdding(false); setForm({ label: 'Home', line1: '', city: '', postal: '', country: 'Albania' }); }} className="bg-white border border-neutral-200 p-6 space-y-3">
          <div className="font-bold mb-2">New Address</div>
          <div className="grid grid-cols-2 gap-3">
            <select value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="border border-neutral-300 px-4 py-2.5 text-sm">
              <option>Home</option><option>Office</option><option>Warehouse</option>
            </select>
            <select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="border border-neutral-300 px-4 py-2.5 text-sm">
              <option>Albania</option><option>Kosovo</option><option>North Macedonia</option><option>Italy</option><option>Greece</option>
            </select>
          </div>
          <input required placeholder="Street address" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} className="border border-neutral-300 px-4 py-2.5 text-sm w-full" />
          <div className="grid grid-cols-2 gap-3">
            <input required placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="border border-neutral-300 px-4 py-2.5 text-sm" />
            <input required placeholder="Postal code" value={form.postal} onChange={(e) => setForm({ ...form, postal: e.target.value })} className="border border-neutral-300 px-4 py-2.5 text-sm" />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" className="bg-neutral-900 text-white px-6 py-3 text-xs font-bold tracking-[0.2em] hover:bg-neutral-700">SAVE ADDRESS</button>
            <button type="button" onClick={() => setAdding(false)} className="border border-neutral-300 px-6 py-3 text-xs font-bold tracking-wider hover:border-neutral-900">CANCEL</button>
          </div>
        </form>
      )}
    </div>
  );
};

const WishlistTab: React.FC = () => {
  const { wishlist, navigate } = useShop();
  const items = PRODUCTS.filter((p) => wishlist.includes(p.id));
  if (items.length === 0) {
    return (
      <div className="bg-white border border-neutral-200 p-12 text-center">
        <Heart className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
        <div className="font-medium mb-2">Your wishlist is empty</div>
        <div className="text-sm text-neutral-500 mb-5">Save products to buy later.</div>
        <button onClick={() => navigate({ name: 'shop' })} className="bg-neutral-900 text-white px-6 py-3 text-xs font-bold tracking-[0.2em] hover:bg-neutral-700">EXPLORE PRODUCTS</button>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {items.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
};

const Profile: React.FC<{ user: any; updateProfile: any }> = ({ user, updateProfile }) => {
  const [form, setForm] = useState({ ...user });
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [saved, setSaved] = useState(false);
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  return (
    <div className="space-y-5">
      <form onSubmit={save} className="bg-white border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="font-bold">Personal Information</div>
          {saved && <div className="text-xs text-green-600 flex items-center gap-1"><Check className="w-3 h-3" /> Saved</div>}
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] tracking-wider font-bold block mb-1">FIRST NAME</label>
            <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="border border-neutral-300 px-4 py-2.5 text-sm w-full" />
          </div>
          <div>
            <label className="text-[10px] tracking-wider font-bold block mb-1">LAST NAME</label>
            <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="border border-neutral-300 px-4 py-2.5 text-sm w-full" />
          </div>
          <div>
            <label className="text-[10px] tracking-wider font-bold block mb-1">EMAIL</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="border border-neutral-300 px-4 py-2.5 text-sm w-full" />
          </div>
          <div>
            <label className="text-[10px] tracking-wider font-bold block mb-1">PHONE</label>
            <input value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="border border-neutral-300 px-4 py-2.5 text-sm w-full" />
          </div>
          {user.accountType === 'b2b' && (
            <>
              <div>
                <label className="text-[10px] tracking-wider font-bold block mb-1">COMPANY</label>
                <input value={form.companyName || ''} onChange={(e) => setForm({ ...form, companyName: e.target.value })} className="border border-neutral-300 px-4 py-2.5 text-sm w-full" />
              </div>
              <div>
                <label className="text-[10px] tracking-wider font-bold block mb-1">VAT NUMBER</label>
                <input value={form.vatNumber || ''} onChange={(e) => setForm({ ...form, vatNumber: e.target.value })} className="border border-neutral-300 px-4 py-2.5 text-sm w-full" />
              </div>
            </>
          )}
        </div>
        <button type="submit" className="bg-neutral-900 text-white px-8 py-3 text-xs font-bold tracking-[0.2em] hover:bg-neutral-700 mt-5">SAVE CHANGES</button>
      </form>

      <form onSubmit={(e) => { e.preventDefault(); setSaved(true); setPw({ current: '', next: '', confirm: '' }); setTimeout(() => setSaved(false), 2000); }} className="bg-white border border-neutral-200 p-6">
        <div className="font-bold mb-5">Change Password</div>
        <div className="space-y-3 max-w-md">
          <input type="password" required placeholder="Current password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} className="border border-neutral-300 px-4 py-2.5 text-sm w-full" />
          <input type="password" required placeholder="New password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} className="border border-neutral-300 px-4 py-2.5 text-sm w-full" />
          <input type="password" required placeholder="Confirm new password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} className="border border-neutral-300 px-4 py-2.5 text-sm w-full" />
        </div>
        <button type="submit" className="bg-neutral-900 text-white px-8 py-3 text-xs font-bold tracking-[0.2em] hover:bg-neutral-700 mt-5">UPDATE PASSWORD</button>
      </form>

      <div className="bg-white border border-red-200 p-6">
        <div className="font-bold text-red-600 mb-2">Danger Zone</div>
        <div className="text-sm text-neutral-600 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</div>
        <button className="border border-red-300 text-red-600 px-6 py-2.5 text-xs font-bold tracking-wider hover:bg-red-50">DELETE ACCOUNT</button>
      </div>
    </div>
  );
};

export default MyAccount;
