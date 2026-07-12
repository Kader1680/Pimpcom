'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { formatPrice } from '@/lib/format';
import { api, ApiError } from '@/lib/api';

export default function CartPage() {
  const { user, loading: authLoading } = useAuth();
  const { cart, loading, total, updateItem, removeItem } = useCart();
  const router = useRouter();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState('');

  if (!authLoading && !user) {
    return (
      <div className="container-page py-20 text-center">
        <p className="font-display text-xl font-semibold">Log in to view your cart</p>
        <Link href="/login" className="btn-primary mt-5 inline-flex">
          Log in
        </Link>
      </div>
    );
  }

  async function handleCheckout() {
    setPlacing(true);
    setError(null);
    try {
      const order = await api.post<{ id: string }>('/orders', { shippingAddress: address });
      router.push(`/orders?placed=${order.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not place order.');
    } finally {
      setPlacing(false);
    }
  }

  const items = cart?.items || [];

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <span className="label-eyebrow">Review before checkout</span>
        <h1 className="font-display text-3xl font-bold">Your cart</h1>
      </div>

      {loading ? (
        <p className="text-sm text-ink/50">Loading cart…</p>
      ) : items.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 py-20 text-center">
          <p className="font-display text-lg font-semibold">Your cart is empty</p>
          <Link href="/products" className="btn-primary">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4 md:col-span-2">
            {items.map((item) => (
              <div key={item.id} className="card flex gap-4 p-4">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-brand-50">
                  {item.product.imageUrl && (
                    <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover" />
                  )}
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/products/${item.product.id}`} className="font-display font-semibold hover:underline">
                      {item.product.name}
                    </Link>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs font-semibold text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-ink/50">{formatPrice(item.product.price)} each</p>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-full border border-line">
                      <button
                        onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                        className="flex h-8 w-8 items-center justify-center"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateItem(item.id, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-display font-bold text-brand-600">
                      {formatPrice(Number(item.product.price) * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card h-fit p-6">
            <h2 className="font-display text-lg font-bold">Order summary</h2>
            <div className="mt-4 flex justify-between text-sm text-ink/60">
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="mt-1 flex justify-between text-sm text-ink/60">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="mt-3 flex justify-between border-t border-line pt-3 font-display font-bold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <label className="mt-5 block text-xs font-semibold text-ink/60">Shipping address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Market St, Springfield…"
              rows={3}
              className="input-field mt-1.5"
            />

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

            <button
              onClick={handleCheckout}
              disabled={placing}
              className="btn-primary mt-5 w-full"
            >
              {placing ? 'Placing order…' : 'Place order'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
