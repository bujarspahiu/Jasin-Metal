import React, { useState } from 'react';
import { useShop } from '@/contexts/ShopContext';
import { PRODUCTS, PROJECTS } from '@/lib/data';
import ProductCard from '@/components/ProductCard';
import { Mail, Phone, MapPin, Heart, Award, Factory, Users, Target } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export const Wishlist: React.FC = () => {
  const { wishlist, t, navigate } = useShop();
  const items = PRODUCTS.filter((p) => wishlist.includes(p.id));

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <Heart className="w-16 h-16 mx-auto text-neutral-300 mb-6" />
        <h1 className="text-3xl font-light mb-4">Your wishlist is empty</h1>
        <button onClick={() => navigate({ name: 'shop' })} className="bg-neutral-900 text-white px-8 py-4 text-xs font-bold tracking-[0.2em] hover:bg-neutral-700">
          EXPLORE PRODUCTS
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <h1 className="text-4xl font-light mb-10 tracking-tight">{t.common.wishlist}</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {items.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
};

export const Contact: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, subject: form.subject, message: form.message }),
      });
    } catch {}
    toast({ title: 'Message sent', description: 'We will reply within 24 hours.' });
    setForm({ name: '', email: '', subject: '', message: '' });
  };
  return (
    <div className="bg-white">
      <div className="bg-gradient-to-br from-neutral-100 to-white py-14 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-[10px] tracking-[0.3em] text-neutral-500 mb-3">GET IN TOUCH</div>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight">Contact Us</h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 grid md:grid-cols-[1fr_1.5fr] gap-12">
        <div className="space-y-6">
          {[
            { icon: MapPin, title: 'Head Office', text: 'Kosovë, Prizren, Lubizhde\nrruga: Tranziti Vjeter' },
            { icon: Phone, title: 'Phone', text: '+383 49 308 338' },
            { icon: Mail, title: 'Email', text: 'info@jasin-metal.com' },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 p-5 border border-neutral-200 hover:border-neutral-900 transition">
              <div className="w-10 h-10 bg-neutral-900 text-white flex items-center justify-center shrink-0">
                <item.icon className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-sm mb-1">{item.title}</div>
                <div className="text-sm text-neutral-600 whitespace-pre-line">{item.text}</div>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={submit} className="space-y-3">
          <input required placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border border-neutral-300 px-4 py-3 text-sm w-full focus:border-neutral-900 outline-none" />
          <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="border border-neutral-300 px-4 py-3 text-sm w-full focus:border-neutral-900 outline-none" />
          <input required placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="border border-neutral-300 px-4 py-3 text-sm w-full focus:border-neutral-900 outline-none" />
          <textarea required rows={8} placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="border border-neutral-300 px-4 py-3 text-sm w-full focus:border-neutral-900 outline-none resize-none" />
          <button className="bg-neutral-900 text-white px-10 py-4 text-xs font-bold tracking-[0.2em] hover:bg-neutral-700">SEND MESSAGE</button>
        </form>
      </div>
    </div>
  );
};

export const About: React.FC = () => {
  const stats = [
    { v: '15+', l: 'Years of precision manufacturing' },
    { v: '2,400+', l: 'Completed installations' },
    { v: '180+', l: 'International clients' },
    { v: '98%', l: 'Client retention rate' },
  ];
  const values = [
    { icon: Award, title: 'Quality First', desc: 'Every piece is rigorously tested and certified to industry standards.' },
    { icon: Factory, title: 'In-House Production', desc: 'Complete control from raw material to finished installation.' },
    { icon: Users, title: 'Expert Team', desc: 'Certified welders, engineers, and installers across every project.' },
    { icon: Target, title: 'Precision', desc: 'Tolerances measured in millimeters. Delivered on time, every time.' },
  ];
  return (
    <div className="bg-white">
      <div className="relative h-[50vh] bg-neutral-950 overflow-hidden">
        <img src="https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374558191_216aaa27.jpg" className="absolute inset-0 w-full h-full object-cover opacity-60" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent"></div>
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 md:px-8 flex items-end pb-12">
          <div>
            <div className="text-[10px] tracking-[0.4em] text-neutral-400 mb-3">— SINCE 2008</div>
            <h1 className="text-4xl md:text-6xl font-light text-white tracking-tight">About the Manufacturer</h1>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-20">
        <p className="text-2xl font-light text-neutral-900 leading-relaxed mb-8">Jasin Metal is Kosovo's leading producer of premium stainless steel products and turnkey professional kitchens.</p>
        <p className="text-neutral-600 leading-relaxed mb-4">Since 2008 we have engineered bespoke industrial solutions for hotels, restaurants, bakeries, butcher shops and food production facilities across the Balkans and Europe. Our 4,200m² production facility in Prizren combines CNC precision with traditional craftsmanship — every fork, every shelf, every complete kitchen carries the same standard of excellence.</p>
        <p className="text-neutral-600 leading-relaxed">From a single piece of cutlery to a complete industrial installation, we deliver engineering, manufacturing, and on-site commissioning under one roof.</p>
      </div>
      <div className="bg-neutral-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.l} className="text-center">
              <div className="text-4xl md:text-5xl font-light mb-2">{s.v}</div>
              <div className="text-xs text-neutral-400 tracking-wider">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <h2 className="text-3xl font-light mb-12 tracking-tight">Our Values</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((v, i) => (
            <div key={i} className="border border-neutral-200 p-6 hover:border-neutral-900 transition">
              <v.icon className="w-8 h-8 text-neutral-900 mb-4" />
              <div className="font-bold mb-2">{v.title}</div>
              <div className="text-sm text-neutral-600 leading-relaxed">{v.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Projects: React.FC = () => {
  const { lang } = useShop();
  const [filter, setFilter] = useState('all');
  const cats = ['all', 'bakery', 'butcher', 'restaurant', 'hotel', 'shelves', 'custom'];
  const filtered = filter === 'all' ? PROJECTS : PROJECTS.filter((p) => p.category === filter);
  return (
    <div className="bg-white">
      <div className="bg-gradient-to-br from-neutral-100 to-white py-14 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-[10px] tracking-[0.3em] text-neutral-500 mb-3">PORTFOLIO · SELECTED WORK</div>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight">Completed Projects</h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="flex gap-2 mb-8 flex-wrap">
          {cats.map((c) => (
            <button key={c} onClick={() => setFilter(c)} className={`px-5 py-2 text-xs font-bold tracking-[0.15em] border transition ${filter === c ? 'bg-neutral-900 text-white border-neutral-900' : 'border-neutral-300 text-neutral-700 hover:border-neutral-900'}`}>
              {c.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((pr) => (
            <div key={pr.id} className="group relative aspect-[4/3] overflow-hidden bg-neutral-100">
              <img src={pr.image} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="text-[9px] tracking-[0.3em] text-neutral-300 mb-1">{pr.category.toUpperCase()}</div>
                <div className="text-white font-medium text-lg">{pr.title[lang]}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
