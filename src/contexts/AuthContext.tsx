import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';

export type UserRole = 'super_admin' | 'admin' | 'manager' | 'product_manager' | 'sales_manager' | 'order_manager' | 'staff' | 'customer';

export interface Address {
  id: string;
  label: string;
  line1: string;
  city: string;
  postal: string;
  country: string;
  isDefault?: boolean;
}

export interface OrderHistoryItem {
  id: string;
  date: string;
  total: number;
  status: string;
  items: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  accountType: 'b2c' | 'b2b';
  companyName?: string;
  vatNumber?: string;
  addresses: Address[];
  orders: OrderHistoryItem[];
  createdAt: string;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  updateProfile: (data: Partial<User>) => void;
  addAddress: (addr: Omit<Address, 'id'>) => void;
  removeAddress: (id: string) => void;
  hasRole: (roles: UserRole[]) => boolean;
  canAccessAdmin: () => boolean;
  socialLogin: (provider: 'google' | 'facebook') => Promise<boolean>;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  accountType: 'b2c' | 'b2b';
  companyName?: string;
  vatNumber?: string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'kitchen_mfg_auth';

// Demo users for role-based testing
const DEMO_USERS: Record<string, { password: string; user: Omit<User, 'id' | 'createdAt'> }> = {
  'admin@kitchenmfg.com': {
    password: 'admin123',
    user: {
      email: 'admin@kitchenmfg.com', firstName: 'Admin', lastName: 'User', phone: '+355 69 000 0001',
      role: 'super_admin', accountType: 'b2c', addresses: [], orders: [],
    },
  },
  'manager@kitchenmfg.com': {
    password: 'manager123',
    user: {
      email: 'manager@kitchenmfg.com', firstName: 'Sales', lastName: 'Manager',
      role: 'sales_manager', accountType: 'b2c', addresses: [], orders: [],
    },
  },
  'customer@example.com': {
    password: 'customer123',
    user: {
      email: 'customer@example.com', firstName: 'Elena', lastName: 'Dervishi', phone: '+355 69 234 5678',
      role: 'customer', accountType: 'b2c',
      addresses: [
        { id: 'a1', label: 'Home', line1: 'Rruga Myslym Shyri 42', city: 'Tirana', postal: '1001', country: 'Albania', isDefault: true },
      ],
      orders: [
        { id: 'ORD-4819', date: '2026-04-15', total: 890, status: 'Delivered', items: 3 },
        { id: 'ORD-4756', date: '2026-03-22', total: 1540, status: 'Delivered', items: 5 },
        { id: 'ORD-4712', date: '2026-02-18', total: 380, status: 'Delivered', items: 2 },
      ],
    },
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setLoading(false);
  }, []);

  const persist = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  };

  const login = useCallback(async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 500));
    const demo = DEMO_USERS[email.toLowerCase()];
    if (demo && demo.password === password) {
      const u: User = { ...demo.user, id: 'u_' + Date.now(), createdAt: new Date().toISOString() };
      persist(u);
      toast({ title: `Welcome back, ${u.firstName}`, description: 'You are now signed in.' });
      return true;
    }
    // Allow any email/password combo as a customer for demo
    if (email && password.length >= 6) {
      const u: User = {
        id: 'u_' + Date.now(),
        email, firstName: email.split('@')[0], lastName: '',
        role: 'customer', accountType: 'b2c', addresses: [], orders: [],
        createdAt: new Date().toISOString(),
      };
      persist(u);
      toast({ title: 'Signed in', description: 'Welcome to Kitchen Industrial MFG.' });
      return true;
    }
    toast({ title: 'Sign in failed', description: 'Invalid credentials.' });
    return false;
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    await new Promise((r) => setTimeout(r, 600));
    const u: User = {
      id: 'u_' + Date.now(),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: 'customer',
      accountType: data.accountType,
      companyName: data.companyName,
      vatNumber: data.vatNumber,
      addresses: [],
      orders: [],
      createdAt: new Date().toISOString(),
    };
    persist(u);
    try {
      await fetch('/api/crm/69e151eeabc82c9459d80766/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          name: `${data.firstName} ${data.lastName}`,
          source: data.accountType === 'b2b' ? 'register-b2b' : 'register-b2c',
          metadata: { accountType: data.accountType, company: data.companyName, vat: data.vatNumber },
        }),
      });
    } catch {}
    toast({ title: 'Account created', description: `Welcome aboard, ${u.firstName}.` });
    return true;
  }, []);

  const logout = useCallback(() => {
    persist(null);
    toast({ title: 'Signed out', description: 'See you soon.' });
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    await new Promise((r) => setTimeout(r, 500));
    toast({ title: 'Reset link sent', description: `Check ${email} for instructions.` });
    return true;
  }, []);

  const socialLogin = useCallback(async (provider: 'google' | 'facebook') => {
    await new Promise((r) => setTimeout(r, 600));
    const u: User = {
      id: 'u_' + Date.now(),
      email: `demo.${provider}@example.com`,
      firstName: provider === 'google' ? 'Google' : 'Facebook',
      lastName: 'User',
      role: 'customer', accountType: 'b2c', addresses: [], orders: [],
      createdAt: new Date().toISOString(),
    };
    persist(u);
    toast({ title: `Signed in with ${provider}`, description: 'Welcome!' });
    return true;
  }, []);

  const updateProfile = useCallback((data: Partial<User>) => {
    setUser((u) => {
      if (!u) return u;
      const next = { ...u, ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    toast({ title: 'Profile updated' });
  }, []);

  const addAddress = useCallback((addr: Omit<Address, 'id'>) => {
    setUser((u) => {
      if (!u) return u;
      const next = { ...u, addresses: [...u.addresses, { ...addr, id: 'a_' + Date.now() }] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    toast({ title: 'Address saved' });
  }, []);

  const removeAddress = useCallback((id: string) => {
    setUser((u) => {
      if (!u) return u;
      const next = { ...u, addresses: u.addresses.filter((a) => a.id !== id) };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const hasRole = useCallback((roles: UserRole[]) => !!user && roles.includes(user.role), [user]);
  const canAccessAdmin = useCallback(() => !!user && user.role !== 'customer', [user]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, register, logout, forgotPassword, updateProfile, addAddress, removeAddress, hasRole, canAccessAdmin, socialLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
