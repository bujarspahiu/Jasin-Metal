import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Lang, PRODUCTS, Product, TRANSLATIONS } from '@/lib/data';
import { toast } from '@/components/ui/use-toast';

export type Page =
  | { name: 'home' }
  | { name: 'shop'; category?: string }
  | { name: 'product'; id: string }
  | { name: 'cart' }
  | { name: 'wishlist' }
  | { name: 'quote' }
  | { name: 'contact' }
  | { name: 'about' }
  | { name: 'projects' }
  | { name: 'account' }
  | { name: 'admin' };

export type CartItem = { id: string; qty: number };

interface ShopContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: typeof TRANSLATIONS['en'];
  page: Page;
  navigate: (p: Page) => void;
  cart: CartItem[];
  addToCart: (id: string, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  cartCount: number;
  cartTotal: number;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  getProduct: (id: string) => Product | undefined;
}

const ShopContext = createContext<ShopContextValue | null>(null);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>('sq');
  const [page, setPage] = useState<Page>({ name: 'home' });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const t = TRANSLATIONS[lang];

  const navigate = useCallback((p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const addToCart = useCallback((id: string, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i));
      return [...prev, { id, qty }];
    });
    const p = PRODUCTS.find((x) => x.id === id);
    toast({ title: 'Added to cart', description: p?.name[lang] });
  }, [lang]);

  const removeFromCart = useCallback((id: string) => setCart((p) => p.filter((i) => i.id !== id)), []);
  const updateQty = useCallback((id: string, qty: number) => {
    if (qty <= 0) return removeFromCart(id);
    setCart((p) => p.map((i) => (i.id === id ? { ...i, qty } : i)));
  }, [removeFromCart]);

  const toggleWishlist = useCallback((id: string) => {
    setWishlist((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }, []);

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((s, i) => {
    const p = PRODUCTS.find((x) => x.id === i.id);
    return s + (p?.price ?? 0) * i.qty;
  }, 0), [cart]);

  const getProduct = useCallback((id: string) => PRODUCTS.find((p) => p.id === id), []);

  return (
    <ShopContext.Provider value={{ lang, setLang, t, page, navigate, cart, addToCart, removeFromCart, updateQty, cartCount, cartTotal, wishlist, toggleWishlist, searchQuery, setSearchQuery, getProduct }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used within ShopProvider');
  return ctx;
};
