import React, { useState } from 'react';
import { ShopProvider, useShop } from '@/contexts/ShopContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Home from '@/components/pages/Home';
import Shop from '@/components/pages/Shop';
import ProductDetail from '@/components/pages/ProductDetail';
import Cart from '@/components/pages/Cart';
import Quote from '@/components/pages/Quote';
import Admin from '@/components/pages/Admin';
import MyAccount from '@/components/pages/MyAccount';
import AuthModal from '@/components/AuthModal';
import { Wishlist, Contact, About, Projects } from '@/components/pages/SimplePages';
import { Shield, Lock, ArrowLeft } from 'lucide-react';

const AdminGate: React.FC = () => {
  const { isAuthenticated, user, canAccessAdmin } = useAuth();
  const { navigate } = useShop();
  const [showAuth, setShowAuth] = useState(!isAuthenticated);

  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white p-4">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/20">
              <Lock className="w-7 h-7" />
            </div>
            <div className="text-[10px] tracking-[0.4em] text-neutral-500 mb-3">SECURE AREA</div>
            <h1 className="text-3xl font-light mb-3">Admin Panel Access</h1>
            <p className="text-neutral-400 mb-8 text-sm">Authentication is required to access the administration dashboard. Please sign in with an authorized account.</p>
            <div className="space-y-2">
              <button onClick={() => setShowAuth(true)} className="w-full bg-white text-neutral-950 py-4 text-xs font-bold tracking-[0.2em] hover:bg-neutral-200 transition">
                SIGN IN
              </button>
              <button onClick={() => navigate({ name: 'home' })} className="w-full border border-white/30 text-white py-4 text-xs font-bold tracking-[0.2em] hover:bg-white/10 transition flex items-center justify-center gap-2">
                <ArrowLeft className="w-3.5 h-3.5" /> BACK TO STORE
              </button>
            </div>
            <div className="mt-8 bg-white/5 border border-white/10 p-4 text-left text-[11px] text-neutral-400">
              <div className="font-bold text-white mb-2">Demo admin credentials:</div>
              <div>admin@kitchenmfg.com / admin123</div>
              <div>manager@kitchenmfg.com / manager123</div>
            </div>
          </div>
        </div>
        <AuthModal open={showAuth} onClose={() => setShowAuth(false)} initialMode="login" />
      </>
    );
  }

  if (!canAccessAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
        <div className="max-w-md w-full text-center bg-white border border-neutral-200 p-10">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-5">
            <Shield className="w-7 h-7" />
          </div>
          <div className="text-[10px] tracking-[0.4em] text-red-600 mb-3">ACCESS DENIED</div>
          <h1 className="text-2xl font-light mb-3">Insufficient Permissions</h1>
          <p className="text-neutral-600 text-sm mb-6">
            Your account ({user?.role}) does not have access to the admin panel. Please contact a system administrator if you believe this is an error.
          </p>
          <button onClick={() => navigate({ name: 'home' })} className="w-full bg-neutral-900 text-white py-3 text-xs font-bold tracking-[0.2em] hover:bg-neutral-700">
            RETURN TO STORE
          </button>
        </div>
      </div>
    );
  }

  return <Admin />;
};

const AccountGate: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { navigate } = useShop();
  const [showAuth, setShowAuth] = useState(!isAuthenticated);

  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-[70vh] flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <Lock className="w-7 h-7 text-neutral-500" />
            </div>
            <h1 className="text-2xl font-light mb-3">Sign in required</h1>
            <p className="text-neutral-600 text-sm mb-6">Please sign in to access your account, orders, and saved addresses.</p>
            <div className="space-y-2">
              <button onClick={() => setShowAuth(true)} className="w-full bg-neutral-900 text-white py-3.5 text-xs font-bold tracking-[0.2em] hover:bg-neutral-700">
                SIGN IN
              </button>
              <button onClick={() => navigate({ name: 'home' })} className="w-full border border-neutral-300 py-3.5 text-xs font-bold tracking-[0.2em] hover:border-neutral-900">
                CONTINUE BROWSING
              </button>
            </div>
          </div>
        </div>
        <AuthModal open={showAuth} onClose={() => setShowAuth(false)} initialMode="login" />
      </>
    );
  }

  return <MyAccount />;
};

const Router: React.FC = () => {
  const { page } = useShop();

  if (page.name === 'admin') return <AdminGate />;

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900">
      <Header />
      <main className="flex-1">
        {page.name === 'home' && <Home />}
        {page.name === 'shop' && <Shop />}
        {page.name === 'product' && <ProductDetail />}
        {page.name === 'cart' && <Cart />}
        {page.name === 'wishlist' && <Wishlist />}
        {page.name === 'quote' && <Quote />}
        {page.name === 'contact' && <Contact />}
        {page.name === 'about' && <About />}
        {page.name === 'projects' && <Projects />}
        {page.name === 'account' && <AccountGate />}
      </main>
      <Footer />
    </div>
  );
};

const AppLayout: React.FC = () => (
  <AuthProvider>
    <ShopProvider>
      <Router />
    </ShopProvider>
  </AuthProvider>
);

export default AppLayout;
