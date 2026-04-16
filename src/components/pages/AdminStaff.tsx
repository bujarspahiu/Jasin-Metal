import React, { useState } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ShopProvider } from '@/contexts/ShopContext';
import Admin from '@/components/pages/Admin';
import { Lock } from 'lucide-react';
import { hashPassword, isHashed } from '@/lib/crypto';

const SESSION_KEY = 'staff_session';
export const STAFF_PASS_KEY = 'staff_password';
const STAFF_USER = 'admin';
const getStoredPass = () => localStorage.getItem(STAFF_PASS_KEY) || 'admin';

const AdminStaff: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(
    () => localStorage.getItem(SESSION_KEY) === 'true'
  );

  const handleLogin = () => {
    localStorage.setItem(SESSION_KEY, 'true');
    setLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return <StaffLogin onLogin={handleLogin} />;
  }

  return (
    <AuthProvider>
      <ShopProvider>
        <Admin onLogout={handleLogout} />
      </ShopProvider>
    </AuthProvider>
  );
};

const StaffLogin: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise<void>((r) => setTimeout(r, 500));
    if (username.trim() === STAFF_USER) {
      const stored = getStoredPass();
      let passwordMatch = false;
      if (isHashed(stored)) {
        const enteredHash = await hashPassword(password);
        passwordMatch = enteredHash === stored;
      } else {
        passwordMatch = password === stored;
        if (passwordMatch) {
          const hashed = await hashPassword(stored);
          localStorage.setItem(STAFF_PASS_KEY, hashed);
        }
      }
      if (passwordMatch) {
        onLogin();
      } else {
        setError('Username ose fjalëkalimi është gabim.');
      }
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
          <div className="text-xl font-bold text-white tracking-[0.15em]">JASIN</div>
          <div className="text-[10px] tracking-[0.3em] text-neutral-400">METAL</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[10px] tracking-[0.2em] text-neutral-500 mb-1.5">
              USERNAME
            </label>
            <input
              type="text"
              required
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              className="w-full bg-neutral-900 border border-neutral-700 text-white px-4 py-3 text-sm outline-none focus:border-neutral-400 transition placeholder:text-neutral-600"
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] text-neutral-500 mb-1.5">
              PASSWORD
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-neutral-900 border border-neutral-700 text-white px-4 py-3 text-sm outline-none focus:border-neutral-400 transition placeholder:text-neutral-600"
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
            className="w-full bg-white text-neutral-950 py-4 text-xs font-bold tracking-[0.2em] hover:bg-neutral-200 transition disabled:opacity-50"
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

export default AdminStaff;
