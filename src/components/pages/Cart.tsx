import React, { useState } from 'react';
import { useShop } from '@/contexts/ShopContext';
import { Minus, Plus, X, ShoppingBag, ArrowRight, Heart } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Cart: React.FC = () => {
  const { cart, cartTotal, updateQty, removeFromCart, getProduct, lang, t, navigate, wishlist, toggleWishlist } = useShop();
  const [showCheckout, setShowCheckout] = useState(false);

  if (cart.length === 0 && !showCheckout) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-neutral-300 mb-6" />
        <h1 className="text-3xl font-light mb-4">{t.common.empty}</h1>
        <p className="text-neutral-500 mb-8">Discover our premium stainless steel collection.</p>
        <button onClick={() => navigate({ name: 'shop' })} className="bg-neutral-900 text-white px-8 py-4 text-xs font-bold tracking-[0.2em] hover:bg-neutral-700 transition">
          {t.common.continueShopping.toUpperCase()}
        </button>
      </div>
    );
  }

  const shipping = cartTotal > 500 ? 0 : 25;
  const vat = cartTotal * 0.2;
  const grand = cartTotal + shipping + vat;

  if (showCheckout) {
    return (
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <h1 className="text-4xl font-light mb-10 tracking-tight">Checkout</h1>
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: 'Order placed', description: 'Confirmation sent to your email.' }); setShowCheckout(false); navigate({ name: 'home' }); }} className="grid md:grid-cols-[1fr_360px] gap-10">
          <div className="space-y-8">
            <div>
              <div className="text-[10px] tracking-[0.3em] font-bold mb-4">01 — CONTACT</div>
              <div className="grid sm:grid-cols-2 gap-3">
                <input required placeholder="First Name" className="border border-neutral-300 px-4 py-3 text-sm" />
                <input required placeholder="Last Name" className="border border-neutral-300 px-4 py-3 text-sm" />
                <input required type="email" placeholder="Email" className="border border-neutral-300 px-4 py-3 text-sm sm:col-span-2" />
                <input required placeholder="Phone" className="border border-neutral-300 px-4 py-3 text-sm sm:col-span-2" />
              </div>
            </div>
            <div>
              <div className="text-[10px] tracking-[0.3em] font-bold mb-4">02 — SHIPPING ADDRESS</div>
              <div className="grid sm:grid-cols-2 gap-3">
                <input required placeholder="Street Address" className="border border-neutral-300 px-4 py-3 text-sm sm:col-span-2" />
                <input required placeholder="City" className="border border-neutral-300 px-4 py-3 text-sm" />
                <input required placeholder="Postal Code" className="border border-neutral-300 px-4 py-3 text-sm" />
                <select className="border border-neutral-300 px-4 py-3 text-sm sm:col-span-2">
                  <option>Albania</option><option>Kosovo</option><option>North Macedonia</option><option>Italy</option>
                </select>
              </div>
            </div>
            <div>
              <div className="text-[10px] tracking-[0.3em] font-bold mb-4">03 — PAYMENT</div>
              <div className="space-y-2 text-sm">
                {['Credit / Debit Card', 'Bank Transfer', 'Cash on Delivery'].map((m, i) => (
                  <label key={m} className="flex items-center gap-3 border border-neutral-300 p-4 cursor-pointer hover:border-neutral-900">
                    <input type="radio" name="pay" defaultChecked={i === 0} /> {m}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <aside className="bg-neutral-50 p-6 h-fit sticky top-28">
            <div className="font-bold text-sm tracking-wider mb-4">ORDER SUMMARY</div>
            <div className="space-y-2 text-sm border-b border-neutral-200 pb-4 mb-4">
              {cart.map((it) => {
                const p = getProduct(it.id)!;
                return <div key={it.id} className="flex justify-between"><span>{p.name[lang]} × {it.qty}</span><span>€{((p.price ?? 0) * it.qty).toFixed(2)}</span></div>;
              })}
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>€{cartTotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `€${shipping}`}</span></div>
              <div className="flex justify-between"><span>VAT 20%</span><span>€{vat.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-lg pt-3 border-t border-neutral-200 mt-3"><span>Total</span><span>€{grand.toFixed(2)}</span></div>
            </div>
            <button type="submit" className="w-full bg-neutral-900 text-white mt-5 py-4 text-xs font-bold tracking-[0.2em] hover:bg-neutral-700">PLACE ORDER</button>
            <button type="button" onClick={() => setShowCheckout(false)} className="w-full text-xs tracking-wider text-neutral-600 hover:text-neutral-900 mt-3">← Back to cart</button>
          </aside>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <h1 className="text-4xl font-light mb-10 tracking-tight">Shopping Cart</h1>
      <div className="grid md:grid-cols-[1fr_360px] gap-10">
        <div className="divide-y divide-neutral-200 border-t border-b border-neutral-200">
          {cart.map((it) => {
            const p = getProduct(it.id);
            if (!p) return null;
            return (
              <div key={it.id} className="py-6 flex gap-4">
                <button onClick={() => navigate({ name: 'product', id: p.id })} className="w-24 h-24 bg-neutral-50 shrink-0">
                  <img src={p.image} alt="" className="w-full h-full object-contain p-2" />
                </button>
                <div className="flex-1">
                  <div className="text-[10px] text-neutral-500 tracking-wider">{p.sku}</div>
                  <button onClick={() => navigate({ name: 'product', id: p.id })} className="font-medium text-neutral-900 hover:text-neutral-600 text-left">{p.name[lang]}</button>
                  <div className="text-xs text-neutral-500 mt-1">{p.spec[lang]}</div>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center border border-neutral-300">
                      <button onClick={() => updateQty(it.id, it.qty - 1)} className="w-8 h-8 hover:bg-neutral-100"><Minus className="w-3 h-3 mx-auto" /></button>
                      <div className="w-10 text-center text-sm font-bold">{it.qty}</div>
                      <button onClick={() => updateQty(it.id, it.qty + 1)} className="w-8 h-8 hover:bg-neutral-100"><Plus className="w-3 h-3 mx-auto" /></button>
                    </div>
                    <button onClick={() => toggleWishlist(p.id)} className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1"><Heart className="w-3 h-3" /> Save</button>
                    <button onClick={() => removeFromCart(it.id)} className="text-xs text-neutral-500 hover:text-red-600 flex items-center gap-1"><X className="w-3 h-3" /> {t.common.remove}</button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">€{((p.price ?? 0) * it.qty).toFixed(2)}</div>
                  <div className="text-xs text-neutral-500">€{p.price?.toFixed(2)} each</div>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="bg-neutral-50 p-6 h-fit sticky top-28">
          <div className="font-bold text-sm tracking-wider mb-4">ORDER SUMMARY</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>{t.common.subtotal}</span><span>€{cartTotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `€${shipping}`}</span></div>
            <div className="flex justify-between"><span>VAT 20%</span><span>€{vat.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-xl pt-3 border-t border-neutral-200 mt-3"><span>{t.common.total}</span><span>€{grand.toFixed(2)}</span></div>
          </div>
          <button onClick={() => setShowCheckout(true)} className="w-full bg-neutral-900 text-white mt-5 py-4 text-xs font-bold tracking-[0.2em] hover:bg-neutral-700 flex items-center justify-center gap-2">
            {t.common.checkout.toUpperCase()} <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={() => navigate({ name: 'shop' })} className="w-full text-xs tracking-wider text-neutral-600 hover:text-neutral-900 mt-3">{t.common.continueShopping}</button>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
