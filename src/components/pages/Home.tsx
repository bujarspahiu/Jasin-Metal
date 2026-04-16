import React, { useEffect, useState } from 'react';
import { useShop } from '@/contexts/ShopContext';
import { HERO_SLIDES, CATEGORIES, PRODUCTS, PROJECTS } from '@/lib/data';
import ProductCard from '@/components/ProductCard';
import { ChevronLeft, ChevronRight, ArrowRight, Award, Wrench, Truck, HardHat, Headphones, Factory } from 'lucide-react';

const Home: React.FC = () => {
  const { t, lang, navigate } = useShop();
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(id);
  }, []);

  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 8);
  const bestSellers = PRODUCTS.filter((p) => p.bestSeller).slice(0, 4);
  const newArrivals = PRODUCTS.filter((p) => p.newArrival).slice(0, 4);

  const trustItems = [
    { icon: Award, k: 'quality' as const },
    { icon: Wrench, k: 'custom' as const },
    { icon: Truck, k: 'fast' as const },
    { icon: HardHat, k: 'install' as const },
    { icon: Headphones, k: 'support' as const },
  ];

  return (
    <div>
      {/* HERO SLIDER */}
      <section className="relative h-[75vh] md:h-[85vh] overflow-hidden bg-neutral-950">
        {HERO_SLIDES.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === slide ? 'opacity-100' : 'opacity-0'}`}
          >
            <img src={s.image} alt="" className="w-full h-full object-cover scale-105" style={{ transform: i === slide ? 'scale(1)' : 'scale(1.08)', transition: 'transform 7s ease-out' }} />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
          </div>
        ))}

        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 md:px-8 flex items-center">
          <div className="max-w-2xl">
            <div className="text-[11px] tracking-[0.4em] text-neutral-300 mb-5 font-medium">{HERO_SLIDES[slide].eyebrow[lang]}</div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-white leading-[1.05] mb-6 tracking-tight">
              {HERO_SLIDES[slide].title[lang]}
            </h1>
            <p className="text-base md:text-lg text-neutral-300 mb-10 max-w-xl font-light leading-relaxed">
              {HERO_SLIDES[slide].subtitle[lang]}
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate({ name: 'shop' })}
                className="group bg-white text-neutral-950 px-8 py-4 text-xs font-bold tracking-[0.2em] hover:bg-neutral-200 transition flex items-center gap-3"
              >
                {t.hero.shopNow.toUpperCase()}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>
              <button
                onClick={() => navigate({ name: 'quote' })}
                className="border border-white/40 text-white px-8 py-4 text-xs font-bold tracking-[0.2em] hover:bg-white/10 transition"
              >
                {t.hero.requestQuote.toUpperCase()}
              </button>
            </div>
          </div>
        </div>

        {/* Slider controls */}
        <button onClick={() => setSlide((s) => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 border border-white/30 text-white hover:bg-white hover:text-neutral-900 transition flex items-center justify-center">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={() => setSlide((s) => (s + 1) % HERO_SLIDES.length)} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 border border-white/30 text-white hover:bg-white hover:text-neutral-900 transition flex items-center justify-center">
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`h-0.5 transition-all ${i === slide ? 'w-12 bg-white' : 'w-6 bg-white/40 hover:bg-white/70'}`}
            />
          ))}
        </div>

        {/* Counter */}
        <div className="absolute bottom-8 right-8 z-20 text-white text-xs tracking-[0.3em] hidden md:block">
          <span className="text-lg font-bold">{String(slide + 1).padStart(2, '0')}</span>
          <span className="text-neutral-500 mx-2">/</span>
          <span className="text-neutral-500">{String(HERO_SLIDES.length).padStart(2, '0')}</span>
        </div>
      </section>

      {/* IMMEDIATE SHOPPING - FEATURED CATEGORIES */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <div className="text-[10px] tracking-[0.3em] text-neutral-500 mb-2">01 — {t.sections.featuredCategories.toUpperCase()}</div>
              <h2 className="text-3xl md:text-5xl font-light text-neutral-900 tracking-tight">{t.sections.browseByCategory}</h2>
            </div>
            <button onClick={() => navigate({ name: 'shop' })} className="text-sm font-bold tracking-wider text-neutral-900 hover:text-neutral-600 flex items-center gap-2">
              {t.common.viewAll.toUpperCase()} <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => navigate({ name: 'shop', category: c.id })}
                className="group relative aspect-[4/5] overflow-hidden bg-neutral-100"
              >
                <img src={c.image} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-4 text-left">
                  <div className="text-[9px] tracking-[0.3em] text-neutral-300 mb-1">{c.count > 0 ? `${c.count} ITEMS` : 'BESPOKE'}</div>
                  <div className="text-white font-medium text-sm md:text-base leading-tight">{c.name[lang]}</div>
                  <div className="h-0.5 w-8 bg-white mt-2 group-hover:w-16 transition-all"></div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-16 md:py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <div className="text-[10px] tracking-[0.3em] text-neutral-500 mb-2">02 — {t.sections.featuredProducts.toUpperCase()}</div>
              <h2 className="text-3xl md:text-5xl font-light text-neutral-900 tracking-tight">{t.sections.featuredProducts}</h2>
            </div>
            <button onClick={() => navigate({ name: 'shop' })} className="text-sm font-bold tracking-wider text-neutral-900 hover:text-neutral-600 flex items-center gap-2">
              {t.common.viewAll.toUpperCase()} <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* SHORT COMPANY INTRO */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <Factory className="w-10 h-10 mx-auto text-neutral-400 mb-6" />
          <div className="text-[10px] tracking-[0.4em] text-neutral-500 mb-4">EST. 2008 · ALBANIA</div>
          <h2 className="text-3xl md:text-5xl font-light text-neutral-900 leading-tight mb-6 tracking-tight">
            {t.sections.introTitle}
          </h2>
          <p className="text-lg text-neutral-600 font-light leading-relaxed max-w-2xl mx-auto">
            {t.sections.introDesc}
          </p>
        </div>
      </section>

      {/* BEST SELLERS + NEW ARRIVALS */}
      <section className="py-16 md:py-20 bg-white border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid lg:grid-cols-2 gap-10 md:gap-16">
          <div>
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="text-[10px] tracking-[0.3em] text-amber-600 mb-2">BEST SELLERS</div>
                <h3 className="text-2xl md:text-3xl font-light text-neutral-900">{t.sections.bestSellers}</h3>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {bestSellers.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
          <div>
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="text-[10px] tracking-[0.3em] text-neutral-900 mb-2">NEW ARRIVALS</div>
                <h3 className="text-2xl md:text-3xl font-light text-neutral-900">{t.sections.newArrivals}</h3>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOM MANUFACTURING BANNER */}
      <section className="relative py-24 md:py-32 bg-neutral-950 overflow-hidden">
        <img src="https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374591945_4f7b16de.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
          <div className="max-w-2xl">
            <div className="text-[10px] tracking-[0.4em] text-neutral-400 mb-4">— BESPOKE ENGINEERING</div>
            <h2 className="text-4xl md:text-6xl font-light text-white mb-6 tracking-tight leading-[1.05]">
              {t.sections.customTitle}
            </h2>
            <p className="text-neutral-300 text-lg font-light leading-relaxed mb-10 max-w-xl">
              {t.sections.customDesc}
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => navigate({ name: 'quote' })} className="bg-white text-neutral-950 px-8 py-4 text-xs font-bold tracking-[0.2em] hover:bg-neutral-200 transition">
                {t.sections.requestOffer.toUpperCase()}
              </button>
              <button onClick={() => navigate({ name: 'contact' })} className="border border-white/40 text-white px-8 py-4 text-xs font-bold tracking-[0.2em] hover:bg-white/10 transition">
                {t.sections.contactUs.toUpperCase()}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS / PORTFOLIO */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <div className="text-[10px] tracking-[0.3em] text-neutral-500 mb-2">03 — PORTFOLIO</div>
              <h2 className="text-3xl md:text-5xl font-light text-neutral-900 tracking-tight">{t.sections.ourProjects}</h2>
            </div>
            <button onClick={() => navigate({ name: 'projects' })} className="text-sm font-bold tracking-wider text-neutral-900 hover:text-neutral-600 flex items-center gap-2">
              {t.common.viewAll.toUpperCase()} <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {PROJECTS.map((pr) => (
              <button key={pr.id} onClick={() => navigate({ name: 'projects' })} className="group relative aspect-[4/3] overflow-hidden bg-neutral-100">
                <img src={pr.image} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
                <div className="absolute inset-x-0 bottom-0 p-5 text-left">
                  <div className="text-[9px] tracking-[0.3em] text-neutral-300 mb-1">{pr.category.toUpperCase()}</div>
                  <div className="text-white font-medium text-lg">{pr.title[lang]}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST / QUALITY */}
      <section className="py-16 md:py-20 bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <div className="text-[10px] tracking-[0.3em] text-neutral-500 mb-3">04 — WHY US</div>
            <h2 className="text-3xl md:text-5xl font-light text-neutral-900 tracking-tight">{t.sections.trustTitle}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {trustItems.map((item, i) => (
              <div key={i} className="bg-white p-6 md:p-8 border border-neutral-200 hover:border-neutral-900 transition group">
                <div className="w-12 h-12 bg-neutral-900 text-white flex items-center justify-center mb-5 group-hover:bg-neutral-700 transition">
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="text-[9px] tracking-[0.3em] text-neutral-400 mb-2">0{i + 1}</div>
                <div className="font-bold text-sm text-neutral-900 mb-2">{(t.trust as any)[item.k]}</div>
                <div className="text-xs text-neutral-500 leading-relaxed">{(t.trust as any)[item.k + 'Desc']}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
