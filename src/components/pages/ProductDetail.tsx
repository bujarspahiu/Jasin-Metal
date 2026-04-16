import React, { useState } from 'react';
import { useShop } from '@/contexts/ShopContext';
import { PRODUCTS } from '@/lib/data';
import ProductCard from '@/components/ProductCard';
import { Heart, ShoppingBag, FileText, Truck, Shield, RefreshCw, Minus, Plus, Check } from 'lucide-react';

const ProductDetail: React.FC = () => {
  const { page, lang, t, addToCart, toggleWishlist, wishlist, navigate, getProduct } = useShop();
  const id = page.name === 'product' ? page.id : '';
  const product = getProduct(id);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<'specs' | 'shipping' | 'materials'>('specs');

  if (!product) return <div className="p-20 text-center">Product not found</div>;

  const isQuote = product.price === null;
  const isFav = wishlist.includes(product.id);
  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const gallery = [product.image, product.image, product.image, product.image];

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Breadcrumb */}
        <div className="text-xs text-neutral-500 mb-8 tracking-wider">
          <button onClick={() => navigate({ name: 'home' })} className="hover:text-neutral-900">HOME</button>
          <span className="mx-2">/</span>
          <button onClick={() => navigate({ name: 'shop' })} className="hover:text-neutral-900">SHOP</button>
          <span className="mx-2">/</span>
          <span className="text-neutral-900">{product.name[lang].toUpperCase()}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Gallery */}
          <div>
            <div className="aspect-square bg-gradient-to-br from-neutral-50 to-neutral-100 mb-4 overflow-hidden">
              <img src={product.image} alt="" className="w-full h-full object-contain p-8" />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {gallery.map((img, i) => (
                <button key={i} className="aspect-square bg-neutral-50 border border-neutral-200 hover:border-neutral-900 p-2 transition">
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="text-[10px] tracking-[0.3em] text-neutral-500 mb-3">{product.sku} · {product.category.toUpperCase()}</div>
            <h1 className="text-3xl md:text-4xl font-light text-neutral-900 mb-4 tracking-tight">{product.name[lang]}</h1>
            <p className="text-neutral-600 mb-6">{product.spec[lang]}</p>

            <div className="border-t border-b border-neutral-200 py-6 mb-6">
              {isQuote ? (
                <div>
                  <div className="text-sm text-neutral-500 mb-1">Custom Manufacturing</div>
                  <div className="text-3xl font-bold text-neutral-900">{t.common.requestQuote}</div>
                </div>
              ) : (
                <div className="flex items-baseline gap-3">
                  <div className="text-4xl font-bold text-neutral-900">€{product.price?.toFixed(2)}</div>
                  <div className="text-sm text-neutral-500">excl. VAT</div>
                </div>
              )}
              <div className="flex items-center gap-2 mt-3 text-sm">
                {product.stock > 20 ? (
                  <><Check className="w-4 h-4 text-green-600" /><span className="text-green-600 font-medium">{t.common.inStock}</span><span className="text-neutral-500">· {product.stock} units available</span></>
                ) : product.stock > 0 ? (
                  <><Check className="w-4 h-4 text-amber-600" /><span className="text-amber-600 font-medium">{t.common.lowStock}</span><span className="text-neutral-500">· Only {product.stock} left</span></>
                ) : (
                  <span className="text-red-600 font-medium">{t.common.outOfStock}</span>
                )}
              </div>
            </div>

            {/* Key specs */}
            <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
              <div><div className="text-neutral-500 text-xs tracking-wider mb-1">{t.common.material.toUpperCase()}</div><div className="font-medium">{product.material}</div></div>
              <div><div className="text-neutral-500 text-xs tracking-wider mb-1">{t.common.dimensions.toUpperCase()}</div><div className="font-medium">{product.dimensions}</div></div>
            </div>

            {/* Actions */}
            {!isQuote && (
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center border border-neutral-300">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-11 h-12 hover:bg-neutral-100"><Minus className="w-4 h-4 mx-auto" /></button>
                  <div className="w-12 text-center font-bold">{qty}</div>
                  <button onClick={() => setQty(qty + 1)} className="w-11 h-12 hover:bg-neutral-100"><Plus className="w-4 h-4 mx-auto" /></button>
                </div>
                <button onClick={() => addToCart(product.id, qty)} className="flex-1 bg-neutral-900 text-white h-12 text-xs font-bold tracking-[0.2em] hover:bg-neutral-700 transition flex items-center justify-center gap-2">
                  <ShoppingBag className="w-4 h-4" /> {t.common.addToCart.toUpperCase()}
                </button>
                <button onClick={() => toggleWishlist(product.id)} className="h-12 w-12 border border-neutral-300 hover:border-neutral-900 flex items-center justify-center">
                  <Heart className={`w-5 h-5 ${isFav ? 'fill-red-500 text-red-500' : 'text-neutral-700'}`} />
                </button>
              </div>
            )}
            {isQuote && (
              <button onClick={() => navigate({ name: 'quote' })} className="w-full bg-neutral-900 text-white h-14 text-xs font-bold tracking-[0.2em] hover:bg-neutral-700 transition flex items-center justify-center gap-2 mb-4">
                <FileText className="w-4 h-4" /> {t.common.requestQuote.toUpperCase()}
              </button>
            )}

            {/* Info row */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-neutral-200">
              <div className="text-center">
                <Truck className="w-5 h-5 mx-auto mb-2 text-neutral-700" />
                <div className="text-xs font-bold tracking-wider">FREE SHIPPING</div>
                <div className="text-[10px] text-neutral-500">Orders over €500</div>
              </div>
              <div className="text-center">
                <Shield className="w-5 h-5 mx-auto mb-2 text-neutral-700" />
                <div className="text-xs font-bold tracking-wider">5-YEAR WARRANTY</div>
                <div className="text-[10px] text-neutral-500">On all inox products</div>
              </div>
              <div className="text-center">
                <RefreshCw className="w-5 h-5 mx-auto mb-2 text-neutral-700" />
                <div className="text-xs font-bold tracking-wider">30-DAY RETURNS</div>
                <div className="text-[10px] text-neutral-500">Hassle-free</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-20">
          <div className="flex gap-8 border-b border-neutral-200 mb-8">
            {[
              { k: 'specs', label: 'SPECIFICATIONS' },
              { k: 'materials', label: 'MATERIALS & FINISH' },
              { k: 'shipping', label: 'SHIPPING' },
            ].map((tb) => (
              <button key={tb.k} onClick={() => setTab(tb.k as any)} className={`pb-4 text-xs font-bold tracking-[0.2em] border-b-2 transition ${tab === tb.k ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-500 hover:text-neutral-900'}`}>
                {tb.label}
              </button>
            ))}
          </div>
          {tab === 'specs' && (
            <div className="grid md:grid-cols-2 gap-x-16 gap-y-3 max-w-3xl">
              {[
                ['SKU', product.sku],
                ['Material', product.material],
                ['Dimensions', product.dimensions],
                ['Category', product.category],
                ['Stock', `${product.stock} units`],
                ['Finish', 'Brushed / Satin'],
                ['Certification', 'CE · ISO 9001'],
                ['Made in', 'Albania'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-neutral-100 py-2">
                  <span className="text-neutral-500 text-sm">{k}</span>
                  <span className="font-medium text-sm">{v}</span>
                </div>
              ))}
            </div>
          )}
          {tab === 'materials' && (
            <div className="max-w-3xl text-neutral-600 leading-relaxed space-y-3">
              <p>Manufactured from premium {product.material} stainless steel, food-grade certified and resistant to corrosion in humid and saline environments.</p>
              <p>Available in satin brushed, mirror polish, or bead-blasted finish on request. All welded seams are ground smooth and passivated to industrial specification.</p>
            </div>
          )}
          {tab === 'shipping' && (
            <div className="max-w-3xl text-neutral-600 leading-relaxed space-y-3">
              <p>Standard delivery within Albania: 3–5 business days. International shipping available on request with DDP terms.</p>
              <p>Large industrial installations include white-glove delivery and professional on-site installation by our certified team.</p>
            </div>
          )}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-20">
            <div className="text-[10px] tracking-[0.3em] text-neutral-500 mb-3">RELATED PRODUCTS</div>
            <h2 className="text-3xl font-light text-neutral-900 mb-8">You might also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
