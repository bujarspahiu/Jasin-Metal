import React from 'react';
import { Product } from '@/lib/data';
import { useShop } from '@/contexts/ShopContext';
import { Heart, ShoppingBag, Eye, FileText } from 'lucide-react';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { lang, t, addToCart, toggleWishlist, wishlist, navigate } = useShop();
  const isFav = wishlist.includes(product.id);
  const isQuote = product.price === null;

  return (
    <div className="group bg-white border border-neutral-200 hover:border-neutral-900 transition-all duration-300 relative overflow-hidden">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.newArrival && <span className="bg-neutral-900 text-white text-[9px] font-bold tracking-[0.2em] px-2 py-1">{t.common.newArrival}</span>}
        {product.bestSeller && <span className="bg-amber-500 text-white text-[9px] font-bold tracking-[0.2em] px-2 py-1">{t.common.bestSeller}</span>}
        {isQuote && <span className="bg-white border border-neutral-900 text-neutral-900 text-[9px] font-bold tracking-[0.2em] px-2 py-1">QUOTE</span>}
      </div>

      {/* Wishlist */}
      <button
        onClick={() => toggleWishlist(product.id)}
        className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/90 backdrop-blur border border-neutral-200 hover:border-neutral-900 flex items-center justify-center transition"
        aria-label="Wishlist"
      >
        <Heart className={`w-4 h-4 transition ${isFav ? 'fill-red-500 text-red-500' : 'text-neutral-700'}`} />
      </button>

      {/* Image */}
      <button
        onClick={() => navigate({ name: 'product', id: product.id })}
        className="block w-full aspect-square bg-gradient-to-br from-neutral-50 to-neutral-100 overflow-hidden"
      >
        <img
          src={product.image}
          alt={product.name[lang]}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
        />
      </button>

      {/* Hover overlay */}
      <div className="absolute inset-x-0 bottom-[120px] px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
        <button
          onClick={() => navigate({ name: 'product', id: product.id })}
          className="w-full bg-neutral-900 text-white py-2.5 text-[11px] font-bold tracking-[0.15em] hover:bg-neutral-700 transition flex items-center justify-center gap-2"
        >
          <Eye className="w-3.5 h-3.5" /> {t.common.viewProduct.toUpperCase()}
        </button>
      </div>

      {/* Info */}
      <div className="p-4 border-t border-neutral-100">
        <div className="text-[10px] text-neutral-400 tracking-wider mb-1">{product.sku}</div>
        <button
          onClick={() => navigate({ name: 'product', id: product.id })}
          className="block text-left font-medium text-sm text-neutral-900 mb-1 hover:text-neutral-600 transition line-clamp-1"
        >
          {product.name[lang]}
        </button>
        <div className="text-xs text-neutral-500 mb-3 line-clamp-1">{product.spec[lang]}</div>

        <div className="flex items-center justify-between gap-2">
          <div>
            {isQuote ? (
              <div className="text-sm font-bold text-neutral-900">{t.common.requestQuote}</div>
            ) : (
              <div className="text-lg font-bold text-neutral-900">€{product.price?.toFixed(2)}</div>
            )}
          </div>
          {isQuote ? (
            <button
              onClick={() => navigate({ name: 'quote' })}
              className="bg-white border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white p-2.5 transition"
              aria-label="Request Quote"
            >
              <FileText className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => addToCart(product.id)}
              className="bg-neutral-900 text-white hover:bg-neutral-700 p-2.5 transition"
              aria-label="Add to Cart"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
