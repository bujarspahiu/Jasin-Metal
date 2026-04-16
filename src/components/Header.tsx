import React, { useState, useRef, useEffect } from 'react';
import { useShop } from '@/contexts/ShopContext';
import { useAuth } from '@/contexts/AuthContext';
import { Search, ShoppingBag, Heart, Menu, X, User, LogOut, Package, Settings, Shield, LayoutDashboard } from 'lucide-react';
import AuthModal from '@/components/AuthModal';

const Header: React.FC = () => {
  const { t, lang, setLang, navigate, cartCount, wishlist, searchQuery, setSearchQuery, page } = useShop();
  const { user, isAuthenticated, logout, canAccessAdmin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const navItems: { key: keyof typeof t.nav; page: any }[] = [
    { key: 'home', page: { name: 'home' } },
    { key: 'shop', page: { name: 'shop' } },
    { key: 'projects', page: { name: 'projects' } },
    { key: 'custom', page: { name: 'quote' } },
    { key: 'about', page: { name: 'about' } },
    { key: 'contact', page: { name: 'contact' } },
  ];

  const isActive = (p: any) => page.name === p.name;

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200">
        {/* Top bar */}
        <div className="bg-neutral-950 text-neutral-300 text-xs py-2 px-4 md:px-8">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <span className="hidden sm:block tracking-wider">AISI 304 · AISI 316 · CERTIFIED MANUFACTURING</span>
            <div className="flex items-center gap-4 ml-auto">
              <a href="tel:+355691234567" className="hover:text-white transition">+355 69 123 4567</a>
              <span className="text-neutral-600 hidden sm:inline">|</span>
              {!isAuthenticated && (
                <button onClick={() => openAuth('login')} className="hover:text-white transition hidden sm:inline">Sign In</button>
              )}
              <span className="text-neutral-600 hidden sm:inline">|</span>
              <div className="flex gap-1">
                <button onClick={() => setLang('en')} className={`px-2 py-0.5 text-xs font-medium tracking-wider ${lang === 'en' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'}`}>EN</button>
                <span className="text-neutral-700">/</span>
                <button onClick={() => setLang('sq')} className={`px-2 py-0.5 text-xs font-medium tracking-wider ${lang === 'sq' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'}`}>SQ</button>
              </div>
            </div>
          </div>
        </div>

        {/* Main nav */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center gap-8">
          {/* Logo */}
          <button onClick={() => navigate({ name: 'home' })} className="flex items-center gap-2 group shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-neutral-900 via-neutral-700 to-neutral-900 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-neutral-300 rotate-45"></div>
            </div>
            <div className="text-left">
              <div className="font-black text-sm tracking-[0.2em] text-neutral-900 leading-none">KITCHEN</div>
              <div className="text-[10px] tracking-[0.3em] text-neutral-500 leading-none mt-0.5">INDUSTRIAL MFG.</div>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => navigate(item.page)}
                className={`tracking-wide transition relative py-1 ${isActive(item.page) ? 'text-neutral-900' : 'text-neutral-600 hover:text-neutral-900'}`}
              >
                {t.nav[item.key]}
                {isActive(item.page) && <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-neutral-900"></span>}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 md:gap-2 ml-auto">
            <button onClick={() => setSearchOpen((s) => !s)} className="p-2 hover:bg-neutral-100 rounded transition" aria-label="Search">
              <Search className="w-5 h-5 text-neutral-700" />
            </button>
            <button onClick={() => navigate({ name: 'wishlist' })} className="p-2 hover:bg-neutral-100 rounded transition relative" aria-label="Wishlist">
              <Heart className="w-5 h-5 text-neutral-700" />
              {wishlist.length > 0 && <span className="absolute top-0 right-0 bg-neutral-900 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{wishlist.length}</span>}
            </button>
            <button onClick={() => navigate({ name: 'cart' })} className="p-2 hover:bg-neutral-100 rounded transition relative" aria-label="Cart">
              <ShoppingBag className="w-5 h-5 text-neutral-700" />
              {cartCount > 0 && <span className="absolute top-0 right-0 bg-neutral-900 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
            </button>

            {/* User menu */}
            <div className="relative" ref={menuRef}>
              {isAuthenticated ? (
                <button onClick={() => setMenuOpen((s) => !s)} className="flex items-center gap-2 p-1 hover:bg-neutral-100 rounded transition" aria-label="Account">
                  <div className="w-8 h-8 bg-gradient-to-br from-neutral-700 to-neutral-950 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user!.firstName.charAt(0)}{user!.lastName.charAt(0) || ''}
                  </div>
                </button>
              ) : (
                <button onClick={() => openAuth('login')} className="p-2 hover:bg-neutral-100 rounded transition" aria-label="Sign In">
                  <User className="w-5 h-5 text-neutral-700" />
                </button>
              )}

              {menuOpen && isAuthenticated && user && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-neutral-200 shadow-xl py-2 z-50">
                  <div className="px-5 py-3 border-b border-neutral-100">
                    <div className="text-sm font-bold">{user.firstName} {user.lastName}</div>
                    <div className="text-xs text-neutral-500 truncate">{user.email}</div>
                    {user.accountType === 'b2b' && <div className="inline-block mt-1 text-[9px] tracking-wider bg-neutral-900 text-white px-1.5 py-0.5">B2B</div>}
                    {user.role !== 'customer' && <div className="inline-block mt-1 ml-1 text-[9px] tracking-wider bg-amber-500 text-white px-1.5 py-0.5">{user.role.replace('_', ' ').toUpperCase()}</div>}
                  </div>
                  <button onClick={() => { navigate({ name: 'account' }); setMenuOpen(false); }} className="w-full text-left px-5 py-2.5 text-sm hover:bg-neutral-50 flex items-center gap-3">
                    <User className="w-4 h-4 text-neutral-500" /> My Account
                  </button>
                  <button onClick={() => { navigate({ name: 'account' }); setMenuOpen(false); }} className="w-full text-left px-5 py-2.5 text-sm hover:bg-neutral-50 flex items-center gap-3">
                    <Package className="w-4 h-4 text-neutral-500" /> Orders
                  </button>
                  <button onClick={() => { navigate({ name: 'wishlist' }); setMenuOpen(false); }} className="w-full text-left px-5 py-2.5 text-sm hover:bg-neutral-50 flex items-center gap-3">
                    <Heart className="w-4 h-4 text-neutral-500" /> Wishlist
                  </button>
                  <button onClick={() => { navigate({ name: 'account' }); setMenuOpen(false); }} className="w-full text-left px-5 py-2.5 text-sm hover:bg-neutral-50 flex items-center gap-3">
                    <Settings className="w-4 h-4 text-neutral-500" /> Settings
                  </button>
                  {canAccessAdmin() && (
                    <>
                      <div className="border-t border-neutral-100 my-1"></div>
                      <button onClick={() => { navigate({ name: 'admin' }); setMenuOpen(false); }} className="w-full text-left px-5 py-2.5 text-sm hover:bg-neutral-50 flex items-center gap-3 font-medium">
                        <LayoutDashboard className="w-4 h-4 text-amber-500" /> Admin Panel
                      </button>
                    </>
                  )}
                  <div className="border-t border-neutral-100 my-1"></div>
                  <button onClick={() => { logout(); setMenuOpen(false); navigate({ name: 'home' }); }} className="w-full text-left px-5 py-2.5 text-sm hover:bg-red-50 text-red-600 flex items-center gap-3">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>

            {!isAuthenticated ? (
              <button onClick={() => openAuth('register')} className="hidden md:inline-flex ml-2 bg-neutral-900 text-white px-5 py-2.5 text-xs font-bold tracking-[0.15em] hover:bg-neutral-700 transition">
                SIGN UP
              </button>
            ) : (
              <button onClick={() => navigate({ name: 'quote' })} className="hidden md:inline-flex ml-2 bg-neutral-900 text-white px-5 py-2.5 text-xs font-bold tracking-[0.15em] hover:bg-neutral-700 transition">
                {t.hero.requestQuote.toUpperCase()}
              </button>
            )}
            <button onClick={() => setMobileOpen((s) => !s)} className="lg:hidden p-2" aria-label="Menu">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-neutral-200 bg-white px-4 md:px-8 py-4">
            <div className="max-w-7xl mx-auto flex items-center gap-3">
              <Search className="w-5 h-5 text-neutral-400" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { navigate({ name: 'shop' }); setSearchOpen(false); } }}
                placeholder={t.common.search}
                className="flex-1 bg-transparent outline-none text-neutral-900 placeholder:text-neutral-400"
              />
              <button onClick={() => setSearchOpen(false)} className="text-neutral-500 hover:text-neutral-900"><X className="w-4 h-4" /></button>
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-neutral-200 bg-white">
            <nav className="flex flex-col py-2">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => { navigate(item.page); setMobileOpen(false); }}
                  className="px-6 py-3 text-left text-sm font-medium text-neutral-700 hover:bg-neutral-50 border-b border-neutral-100"
                >
                  {t.nav[item.key]}
                </button>
              ))}
              {!isAuthenticated && (
                <>
                  <button onClick={() => { openAuth('login'); setMobileOpen(false); }} className="px-6 py-3 text-left text-sm font-medium text-neutral-700 hover:bg-neutral-50 border-b border-neutral-100 flex items-center gap-2">
                    <User className="w-4 h-4" /> Sign In
                  </button>
                </>
              )}
              {isAuthenticated && (
                <>
                  <button onClick={() => { navigate({ name: 'account' }); setMobileOpen(false); }} className="px-6 py-3 text-left text-sm font-medium text-neutral-700 hover:bg-neutral-50 border-b border-neutral-100 flex items-center gap-2">
                    <User className="w-4 h-4" /> My Account
                  </button>
                  {canAccessAdmin() && (
                    <button onClick={() => { navigate({ name: 'admin' }); setMobileOpen(false); }} className="px-6 py-3 text-left text-sm font-medium text-neutral-700 hover:bg-neutral-50 border-b border-neutral-100 flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" /> Admin Panel
                    </button>
                  )}
                </>
              )}
              <button onClick={() => { navigate({ name: 'quote' }); setMobileOpen(false); }} className="mx-4 my-3 bg-neutral-900 text-white py-3 text-xs font-bold tracking-[0.15em]">
                {t.hero.requestQuote.toUpperCase()}
              </button>
            </nav>
          </div>
        )}
      </header>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} initialMode={authMode} />
    </>
  );
};

export default Header;
