import React, { useState } from 'react';
import { useShop } from '@/contexts/ShopContext';
import { CATEGORIES } from '@/lib/data';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, MessageCircle, Send } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Footer: React.FC = () => {
  const { t, lang, navigate } = useShop();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer-newsletter' }),
      });
      toast({ title: 'Subscribed', description: 'Thank you for subscribing.' });
      setEmail('');
    } catch {
      toast({ title: 'Error', description: 'Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-neutral-950 text-neutral-400 mt-20">
      {/* Top CTA band */}
      <div className="border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="text-[10px] tracking-[0.3em] text-neutral-500 mb-2">{t.footer.newsletter.toUpperCase()}</div>
            <h3 className="text-2xl md:text-3xl font-light text-white">{t.footer.newsletterDesc}</h3>
          </div>
          <form onSubmit={subscribe} className="flex gap-0 border border-neutral-700 focus-within:border-neutral-400 transition">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.footer.yourEmail}
              className="flex-1 bg-transparent px-5 py-4 text-white placeholder:text-neutral-500 outline-none"
            />
            <button disabled={loading} className="bg-white text-neutral-950 px-6 md:px-8 font-bold text-xs tracking-[0.15em] hover:bg-neutral-200 transition flex items-center gap-2 disabled:opacity-50">
              {loading ? '...' : t.footer.subscribe.toUpperCase()} <Send className="w-3 h-3" />
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center mb-4">
            <img src="/jasin-logo.png" alt="JASIN METAL" className="h-12 w-auto" />
          </div>
          <p className="text-sm text-neutral-500 leading-relaxed mb-6">{t.footer.tagline}</p>
          <div className="flex gap-2">
            {[Facebook, Instagram, Linkedin, MessageCircle].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 border border-neutral-800 hover:border-neutral-400 hover:bg-neutral-900 flex items-center justify-center transition">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <div className="text-white font-bold text-xs tracking-[0.2em] mb-5">{t.footer.quickLinks.toUpperCase()}</div>
          <ul className="space-y-3 text-sm">
            {[
              { k: 'shop', p: { name: 'shop' } },
              { k: 'projects', p: { name: 'projects' } },
              { k: 'custom', p: { name: 'quote' } },
              { k: 'about', p: { name: 'about' } },
              { k: 'contact', p: { name: 'contact' } },
            ].map((i) => (
              <li key={i.k}><button onClick={() => navigate(i.p as any)} className="hover:text-white transition">{(t.nav as any)[i.k]}</button></li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <div className="text-white font-bold text-xs tracking-[0.2em] mb-5">{t.nav.categories.toUpperCase()}</div>
          <ul className="space-y-3 text-sm">
            {CATEGORIES.slice(0, 6).map((c) => (
              <li key={c.id}>
                <button onClick={() => navigate({ name: 'shop', category: c.id })} className="hover:text-white transition text-left">
                  {c.name[lang]}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <div className="text-white font-bold text-xs tracking-[0.2em] mb-5">{t.footer.contactInfo.toUpperCase()}</div>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3"><MapPin className="w-4 h-4 mt-0.5 shrink-0 text-neutral-500" /><span>Kosovë, Prizren, Lubizhde<br/>rruga: Tranziti Vjeter</span></li>
            <li className="flex gap-3"><Phone className="w-4 h-4 mt-0.5 shrink-0 text-neutral-500" /><a href="tel:+38349308338" className="hover:text-white">+383 49 308 338</a></li>
            <li className="flex gap-3"><Mail className="w-4 h-4 mt-0.5 shrink-0 text-neutral-500" /><a href="mailto:info@jasin-metal.com" className="hover:text-white">info@jasin-metal.com</a></li>
            <li className="flex gap-3"><MessageCircle className="w-4 h-4 mt-0.5 shrink-0 text-green-500" /><a href="https://wa.me/38349308338" target="_blank" rel="noreferrer" className="hover:text-white">WhatsApp Chat</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-neutral-500">
          <div>© {new Date().getFullYear()} Jasin Metal. {t.footer.rights}</div>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Shipping</a>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp */}
      <a href="https://wa.me/38349308338" target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-2xl flex items-center justify-center text-white transition hover:scale-110">
        <MessageCircle className="w-6 h-6" />
      </a>
    </footer>
  );
};

export default Footer;
