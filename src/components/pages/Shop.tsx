import React, { useMemo, useState } from 'react';
import { useShop } from '@/contexts/ShopContext';
import { CATEGORIES, PRODUCTS } from '@/lib/data';
import ProductCard from '@/components/ProductCard';
import { SlidersHorizontal, X } from 'lucide-react';

const Shop: React.FC = () => {
  const { t, lang, page, navigate, searchQuery } = useShop();
  const initialCat = page.name === 'shop' ? (page.category || 'all') : 'all';
  const [category, setCategory] = useState<string>(initialCat);
  const [sort, setSort] = useState<'featured' | 'price-asc' | 'price-desc' | 'new'>('featured');
  const [priceMax, setPriceMax] = useState(1000);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let arr = [...PRODUCTS];
    if (category !== 'all') arr = arr.filter((p) => p.category === category);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      arr = arr.filter((p) => p.name[lang].toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.spec[lang].toLowerCase().includes(q));
    }
    arr = arr.filter((p) => p.price === null || p.price <= priceMax);
    if (sort === 'price-asc') arr.sort((a, b) => (a.price ?? 99999) - (b.price ?? 99999));
    if (sort === 'price-desc') arr.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    if (sort === 'new') arr.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
    return arr;
  }, [category, sort, priceMax, searchQuery, lang]);

  return (
    <div className="bg-white">
      {/* Page header */}
      <div className="bg-gradient-to-br from-neutral-100 via-neutral-50 to-white border-b border-neutral-200 py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-[10px] tracking-[0.3em] text-neutral-500 mb-3">SHOP · {filtered.length} PRODUCTS</div>
          <h1 className="text-4xl md:text-6xl font-light text-neutral-900 tracking-tight">
            {category === 'all' ? t.nav.shop : CATEGORIES.find((c) => c.id === category)?.name[lang]}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 grid lg:grid-cols-[260px_1fr] gap-10">
        {/* Sidebar filters */}
        <aside className={`${showFilters ? 'fixed inset-0 z-50 bg-white overflow-auto p-6' : 'hidden'} lg:block lg:static lg:p-0`}>
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <div className="font-bold tracking-wider">FILTERS</div>
            <button onClick={() => setShowFilters(false)}><X className="w-5 h-5" /></button>
          </div>

          <div className="mb-8">
            <div className="text-[10px] tracking-[0.25em] font-bold text-neutral-900 mb-4">CATEGORIES</div>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setCategory('all')} className={`text-sm text-left w-full py-1 ${category === 'all' ? 'font-bold text-neutral-900' : 'text-neutral-600 hover:text-neutral-900'}`}>
                  All Products <span className="text-neutral-400 ml-2">({PRODUCTS.length})</span>
                </button>
              </li>
              {CATEGORIES.filter((c) => c.id !== 'custom').map((c) => {
                const count = PRODUCTS.filter((p) => p.category === c.id).length;
                return (
                  <li key={c.id}>
                    <button onClick={() => setCategory(c.id)} className={`text-sm text-left w-full py-1 ${category === c.id ? 'font-bold text-neutral-900' : 'text-neutral-600 hover:text-neutral-900'}`}>
                      {c.name[lang]} <span className="text-neutral-400 ml-2">({count})</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mb-8">
            <div className="text-[10px] tracking-[0.25em] font-bold text-neutral-900 mb-4">PRICE RANGE</div>
            <input
              type="range"
              min={0}
              max={1000}
              step={50}
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-full accent-neutral-900"
            />
            <div className="flex justify-between text-xs text-neutral-500 mt-2">
              <span>€0</span><span>Up to €{priceMax}</span>
            </div>
          </div>

          <div className="mb-8">
            <div className="text-[10px] tracking-[0.25em] font-bold text-neutral-900 mb-4">MATERIAL</div>
            <div className="space-y-2 text-sm">
              {['AISI 304', 'AISI 316', 'HDPE + Inox'].map((m) => (
                <label key={m} className="flex items-center gap-2 text-neutral-600 cursor-pointer">
                  <input type="checkbox" className="accent-neutral-900" /> {m}
                </label>
              ))}
            </div>
          </div>

          <button onClick={() => { setCategory('all'); setPriceMax(1000); }} className="text-xs tracking-[0.2em] text-neutral-900 underline">RESET FILTERS</button>
        </aside>

        {/* Products */}
        <div>
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <button onClick={() => setShowFilters(true)} className="lg:hidden flex items-center gap-2 text-sm font-medium border border-neutral-300 px-4 py-2">
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
            <div className="text-sm text-neutral-500">{filtered.length} results</div>
            <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="border border-neutral-300 px-3 py-2 text-sm bg-white">
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="new">Newest</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-neutral-500">No products match your filters.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
