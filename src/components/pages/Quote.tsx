import React, { useState } from 'react';
import { useShop } from '@/contexts/ShopContext';
import { Upload, Check, FileText, Factory, Building2, Store, Utensils } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Quote: React.FC = () => {
  const { t } = useShop();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    businessType: 'restaurant',
    projectType: '',
    name: '',
    company: '',
    email: '',
    phone: '',
    dimensions: '',
    requirements: '',
  });
  const [files, setFiles] = useState<File[]>([]);

  const businessTypes = [
    { id: 'restaurant', label: 'Restaurant', icon: Utensils },
    { id: 'bakery', label: 'Bakery', icon: Store },
    { id: 'butcher', label: 'Butcher Shop', icon: Factory },
    { id: 'hotel', label: 'Hotel', icon: Building2 },
  ];

  const projectTypes = [
    'Custom Inox Kitchen', 'Custom Shelving System', 'Restaurant Kitchen Project',
    'Bakery Kitchen Equipment', 'Butcher Shop Solutions', 'Hotel Kitchen Installation',
    'Custom Work Tables', 'Custom Sinks', 'Other Industrial Inox',
  ];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          company: form.company,
          email: form.email,
          phone: form.phone,
          businessType: form.businessType,
          projectType: form.projectType,
          dimensions: form.dimensions,
          requirements: form.requirements,
        }),
      });
    } catch {}
    toast({ title: 'Quote request received', description: 'Our team will contact you within 24 hours.' });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-light mb-4">Request Submitted</h1>
        <p className="text-neutral-600 mb-8">Thank you {form.name}. Our engineering team will review your specifications and contact you within 24 hours with a detailed offer.</p>
        <div className="text-sm text-neutral-500">Reference: QR-{Date.now().toString().slice(-6)}</div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="relative bg-neutral-950 py-20 overflow-hidden">
        <img src="https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374591945_4f7b16de.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-[10px] tracking-[0.4em] text-neutral-400 mb-3">— BESPOKE ENGINEERING</div>
          <h1 className="text-4xl md:text-6xl font-light text-white tracking-tight">Request a Custom Quote</h1>
          <p className="text-neutral-300 mt-4 max-w-xl font-light">Share your project details and our engineers will deliver a tailored offer with CAD renders and fixed pricing.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-14">
        <form onSubmit={submit} className="space-y-10">
          {/* Business type */}
          <div>
            <div className="text-[10px] tracking-[0.3em] font-bold mb-4">01 — BUSINESS TYPE</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {businessTypes.map((b) => (
                <button key={b.id} type="button" onClick={() => setForm({ ...form, businessType: b.id })}
                  className={`p-5 border-2 transition text-center ${form.businessType === b.id ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200 hover:border-neutral-400'}`}>
                  <b.icon className="w-6 h-6 mx-auto mb-2 text-neutral-700" />
                  <div className="text-sm font-medium">{b.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Project type */}
          <div>
            <div className="text-[10px] tracking-[0.3em] font-bold mb-4">02 — PROJECT TYPE</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {projectTypes.map((pt) => (
                <label key={pt} className={`flex items-center gap-2 p-3 border cursor-pointer transition ${form.projectType === pt ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200 hover:border-neutral-400'}`}>
                  <input type="radio" name="projectType" value={pt} checked={form.projectType === pt} onChange={() => setForm({ ...form, projectType: pt })} className="accent-neutral-900" />
                  <span className="text-sm">{pt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="text-[10px] tracking-[0.3em] font-bold mb-4">03 — CONTACT INFORMATION</div>
            <div className="grid md:grid-cols-2 gap-3">
              <input required placeholder="Full Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border border-neutral-300 px-4 py-3 text-sm focus:border-neutral-900 outline-none" />
              <input placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="border border-neutral-300 px-4 py-3 text-sm focus:border-neutral-900 outline-none" />
              <input required type="email" placeholder="Email *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="border border-neutral-300 px-4 py-3 text-sm focus:border-neutral-900 outline-none" />
              <input required placeholder="Phone *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="border border-neutral-300 px-4 py-3 text-sm focus:border-neutral-900 outline-none" />
            </div>
          </div>

          {/* Specs */}
          <div>
            <div className="text-[10px] tracking-[0.3em] font-bold mb-4">04 — PROJECT SPECIFICATIONS</div>
            <input placeholder="Approximate dimensions (e.g. 6m × 4m kitchen)" value={form.dimensions} onChange={(e) => setForm({ ...form, dimensions: e.target.value })} className="border border-neutral-300 px-4 py-3 text-sm focus:border-neutral-900 outline-none w-full mb-3" />
            <textarea placeholder="Describe your requirements, equipment needed, timeline, budget range..." rows={6} value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} className="border border-neutral-300 px-4 py-3 text-sm focus:border-neutral-900 outline-none w-full resize-none" />
          </div>

          {/* Files */}
          <div>
            <div className="text-[10px] tracking-[0.3em] font-bold mb-4">05 — ATTACHMENTS (OPTIONAL)</div>
            <label className="block border-2 border-dashed border-neutral-300 hover:border-neutral-900 p-8 text-center cursor-pointer transition">
              <Upload className="w-8 h-8 mx-auto mb-3 text-neutral-400" />
              <div className="text-sm font-medium">Upload drawings, photos, or reference files</div>
              <div className="text-xs text-neutral-500 mt-1">PDF, JPG, PNG, DWG · Max 10MB each</div>
              <input type="file" multiple className="hidden" onChange={(e) => setFiles(Array.from(e.target.files || []))} />
            </label>
            {files.length > 0 && (
              <div className="mt-3 space-y-1">
                {files.map((f, i) => (
                  <div key={i} className="text-xs flex items-center gap-2 text-neutral-600"><FileText className="w-3 h-3" /> {f.name}</div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="w-full md:w-auto bg-neutral-900 text-white px-12 py-4 text-xs font-bold tracking-[0.2em] hover:bg-neutral-700 transition">
            SUBMIT QUOTE REQUEST
          </button>
        </form>
      </div>
    </div>
  );
};

export default Quote;
