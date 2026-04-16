import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { X, Mail, Lock, User as UserIcon, Building2, Phone, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';

type Mode = 'login' | 'register' | 'forgot';

interface Props {
  open: boolean;
  onClose: () => void;
  initialMode?: Mode;
}

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
);
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#1877F2"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07"/></svg>
);

const AuthModal: React.FC<Props> = ({ open, onClose, initialMode = 'login' }) => {
  const { login, register, forgotPassword, socialLogin } = useAuth();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [accountType, setAccountType] = useState<'b2c' | 'b2b'>('b2c');
  const [form, setForm] = useState({
    email: '', password: '', firstName: '', lastName: '', phone: '',
    companyName: '', vatNumber: '', confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resetSent, setResetSent] = useState(false);

  React.useEffect(() => { if (open) { setMode(initialMode); setResetSent(false); setErrors({}); } }, [open, initialMode]);

  if (!open) return null;

  const validate = () => {
    const e: Record<string, string> = {};
    if (mode !== 'forgot' && !form.email) e.email = 'Required';
    if (mode !== 'forgot' && !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (mode === 'forgot' && !form.email) e.email = 'Required';
    if (mode !== 'forgot' && !form.password) e.password = 'Required';
    if (mode !== 'forgot' && form.password.length < 6) e.password = 'Min 6 characters';
    if (mode === 'register') {
      if (!form.firstName) e.firstName = 'Required';
      if (!form.lastName) e.lastName = 'Required';
      if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
      if (accountType === 'b2b') {
        if (!form.companyName) e.companyName = 'Required';
        if (!form.vatNumber) e.vatNumber = 'Required';
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    let ok = false;
    if (mode === 'login') ok = await login(form.email, form.password);
    else if (mode === 'register') ok = await register({ ...form, accountType });
    else if (mode === 'forgot') { ok = await forgotPassword(form.email); if (ok) setResetSent(true); }
    setLoading(false);
    if (ok && mode !== 'forgot') onClose();
  };

  const handleSocial = async (p: 'google' | 'facebook') => {
    setLoading(true);
    const ok = await socialLogin(p);
    setLoading(false);
    if (ok) onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-full max-w-md max-h-[95vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="relative p-8 pb-4 border-b border-neutral-100">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-neutral-100" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-gradient-to-br from-neutral-900 via-neutral-700 to-neutral-900 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-neutral-300 rotate-45"></div>
            </div>
            <div className="text-[10px] tracking-[0.3em] text-neutral-500">KITCHEN INDUSTRIAL MFG.</div>
          </div>
          <h2 className="text-2xl font-light tracking-tight">
            {mode === 'login' && 'Welcome back'}
            {mode === 'register' && 'Create account'}
            {mode === 'forgot' && 'Reset password'}
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            {mode === 'login' && 'Sign in to your account to continue.'}
            {mode === 'register' && 'Join our professional community.'}
            {mode === 'forgot' && 'We will email you a reset link.'}
          </p>
        </div>

        <div className="p-8 pt-6">
          {mode === 'forgot' && resetSent ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6" />
              </div>
              <div className="font-medium mb-2">Check your inbox</div>
              <div className="text-sm text-neutral-500 mb-6">We sent a password reset link to <strong>{form.email}</strong>.</div>
              <button onClick={() => setMode('login')} className="text-sm font-bold tracking-wider text-neutral-900 hover:text-neutral-600">← BACK TO SIGN IN</button>
            </div>
          ) : (
            <>
              {/* Social */}
              {mode !== 'forgot' && (
                <>
                  <div className="grid grid-cols-2 gap-2 mb-5">
                    <button disabled={loading} onClick={() => handleSocial('google')} className="flex items-center justify-center gap-2 border border-neutral-300 py-2.5 text-sm font-medium hover:border-neutral-900 hover:bg-neutral-50 transition disabled:opacity-50">
                      <GoogleIcon /> Google
                    </button>
                    <button disabled={loading} onClick={() => handleSocial('facebook')} className="flex items-center justify-center gap-2 border border-neutral-300 py-2.5 text-sm font-medium hover:border-neutral-900 hover:bg-neutral-50 transition disabled:opacity-50">
                      <FacebookIcon /> Facebook
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex-1 h-px bg-neutral-200"></div>
                    <span className="text-[10px] tracking-[0.3em] text-neutral-400">OR</span>
                    <div className="flex-1 h-px bg-neutral-200"></div>
                  </div>
                </>
              )}

              {/* Account type (register only) */}
              {mode === 'register' && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button type="button" onClick={() => setAccountType('b2c')} className={`p-3 border-2 text-left transition ${accountType === 'b2c' ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200'}`}>
                    <UserIcon className="w-4 h-4 mb-1" />
                    <div className="text-xs font-bold">Personal</div>
                    <div className="text-[10px] text-neutral-500">B2C customer</div>
                  </button>
                  <button type="button" onClick={() => setAccountType('b2b')} className={`p-3 border-2 text-left transition ${accountType === 'b2b' ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200'}`}>
                    <Building2 className="w-4 h-4 mb-1" />
                    <div className="text-xs font-bold">Business</div>
                    <div className="text-[10px] text-neutral-500">B2B / VAT</div>
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                {mode === 'register' && (
                  <div className="grid grid-cols-2 gap-2">
                    <Field icon={UserIcon} placeholder="First name" value={form.firstName} onChange={(v) => setForm({ ...form, firstName: v })} error={errors.firstName} />
                    <Field placeholder="Last name" value={form.lastName} onChange={(v) => setForm({ ...form, lastName: v })} error={errors.lastName} />
                  </div>
                )}

                <Field icon={Mail} type="email" placeholder="Email address" value={form.email} onChange={(v) => setForm({ ...form, email: v })} error={errors.email} />

                {mode === 'register' && (
                  <Field icon={Phone} placeholder="Phone (optional)" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
                )}

                {mode === 'register' && accountType === 'b2b' && (
                  <>
                    <Field icon={Building2} placeholder="Company name" value={form.companyName} onChange={(v) => setForm({ ...form, companyName: v })} error={errors.companyName} />
                    <Field placeholder="VAT / Tax number" value={form.vatNumber} onChange={(v) => setForm({ ...form, vatNumber: v })} error={errors.vatNumber} />
                  </>
                )}

                {mode !== 'forgot' && (
                  <div>
                    <div className={`flex items-center border transition ${errors.password ? 'border-red-500' : 'border-neutral-300 focus-within:border-neutral-900'}`}>
                      <Lock className="w-4 h-4 ml-3 text-neutral-400" />
                      <input
                        type={showPw ? 'text' : 'password'}
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="flex-1 px-3 py-3 text-sm outline-none"
                      />
                      <button type="button" onClick={() => setShowPw(!showPw)} className="px-3 text-neutral-400 hover:text-neutral-700">
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <div className="text-xs text-red-500 mt-1">{errors.password}</div>}
                  </div>
                )}

                {mode === 'register' && (
                  <Field icon={Lock} type="password" placeholder="Confirm password" value={form.confirmPassword} onChange={(v) => setForm({ ...form, confirmPassword: v })} error={errors.confirmPassword} />
                )}

                {mode === 'login' && (
                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 text-neutral-600 cursor-pointer">
                      <input type="checkbox" defaultChecked className="accent-neutral-900" /> Remember me
                    </label>
                    <button type="button" onClick={() => setMode('forgot')} className="text-neutral-900 hover:underline font-medium">Forgot password?</button>
                  </div>
                )}

                {mode === 'register' && (
                  <label className="flex items-start gap-2 text-xs text-neutral-600 pt-1 cursor-pointer">
                    <input type="checkbox" required className="mt-0.5 accent-neutral-900" />
                    <span>I agree to the <a className="underline text-neutral-900">Terms of Service</a> and <a className="underline text-neutral-900">Privacy Policy</a>.</span>
                  </label>
                )}

                <button type="submit" disabled={loading} className="w-full bg-neutral-900 text-white py-3.5 text-xs font-bold tracking-[0.2em] hover:bg-neutral-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? 'PLEASE WAIT...' : mode === 'login' ? 'SIGN IN' : mode === 'register' ? 'CREATE ACCOUNT' : 'SEND RESET LINK'}
                  {!loading && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </form>

              {/* Mode switcher */}
              <div className="text-center text-sm text-neutral-500 mt-6 pt-5 border-t border-neutral-100">
                {mode === 'login' && <>Don't have an account? <button onClick={() => setMode('register')} className="font-bold text-neutral-900 hover:underline">Create one</button></>}
                {mode === 'register' && <>Already have an account? <button onClick={() => setMode('login')} className="font-bold text-neutral-900 hover:underline">Sign in</button></>}
                {mode === 'forgot' && <button onClick={() => setMode('login')} className="font-bold text-neutral-900 hover:underline">← Back to sign in</button>}
              </div>

              {mode === 'login' && (
                <div className="mt-4 bg-neutral-50 border border-neutral-200 p-3 text-[11px] text-neutral-600 space-y-0.5">
                  <div className="font-bold text-neutral-900 mb-1">Demo accounts:</div>
                  <div>admin@kitchenmfg.com / admin123 <span className="text-neutral-400">— Super Admin</span></div>
                  <div>manager@kitchenmfg.com / manager123 <span className="text-neutral-400">— Sales Manager</span></div>
                  <div>customer@example.com / customer123 <span className="text-neutral-400">— Customer</span></div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const Field: React.FC<{
  icon?: React.ComponentType<{ className?: string }>;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}> = ({ icon: Icon, type = 'text', placeholder, value, onChange, error }) => (
  <div>
    <div className={`flex items-center border transition ${error ? 'border-red-500' : 'border-neutral-300 focus-within:border-neutral-900'}`}>
      {Icon && <Icon className="w-4 h-4 ml-3 text-neutral-400" />}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-3 py-3 text-sm outline-none bg-transparent"
      />
    </div>
    {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
  </div>
);

export default AuthModal;
