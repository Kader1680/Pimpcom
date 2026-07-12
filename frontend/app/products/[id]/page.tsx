'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { api, ApiError } from '@/lib/api';
import { Product } from '@/types';
import { formatPrice } from '@/lib/format';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const id = params.id as string;
    api
      .get<Product>(`/products/${id}`)
      .then(setProduct)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  async function handleAddToCart() {
    if (!user) {
      router.push('/login');
      return;
    }
    if (!product) return;
    setAdding(true);
    setMessage(null);
    try {
      await addItem(product.id, quantity);
      setMessage('Added to cart.');
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : 'Could not add to cart.');
    } finally {
      setAdding(false);
    }
  }

  if (loading) {
    return <div className="container-page py-20 text-center text-ink/50">Loading…</div>;
  }

  if (notFound || !product) {
    return (
      <div className="container-page py-20 text-center">
        <p className="font-display text-xl font-semibold">Product not found</p>
        <Link href="/products" className="mt-4 inline-block text-brand-600 hover:underline">
          ← Back to shop
        </Link>
      </div>
    );
  }

  const outOfStock = product.stock <= 0;

  return (
    <div className="container-page py-10">
      <nav className="mb-6 text-sm text-ink/50">
        <Link href="/products" className="hover:text-ink">Shop</Link>
        {product.category && (
          <>
            {' '}/{' '}
            <Link href={`/products?category=${product.category.id}`} className="hover:text-ink">
              {product.category.name}
            </Link>
          </>
        )}
        {' '}/ <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-brand-50">
          {product.imageUrl ? (
            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" priority />
          ) : (
            <div className="flex h-full items-center justify-center text-brand-300">No image</div>
          )}
        </div>

        <div className="flex flex-col">
          {product.category && (
            <span className="label-eyebrow mb-2">{product.category.name}</span>
          )}
          <h1 className="font-display text-3xl font-bold">{product.name}</h1>
          <p className="mt-3 font-display text-2xl font-bold text-brand-600">
            {formatPrice(product.price)}
          </p>
          <p className="mt-5 text-sm leading-relaxed text-ink/65">{product.description}</p>

          <div className="mt-4 text-sm">
            {outOfStock ? (
              <span className="font-semibold text-red-600">Out of stock</span>
            ) : (
              <span className="text-ink/50">{product.stock} in stock</span>
            )}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-full border border-line">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-10 w-10 items-center justify-center text-lg"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock || 1, q + 1))}
                className="flex h-10 w-10 items-center justify-center text-lg"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={outOfStock || adding}
              className="btn-primary flex-1"
            >
              {adding ? 'Adding…' : outOfStock ? 'Sold out' : 'Add to cart'}
            </button>
          </div>

          {message && <p className="mt-3 text-sm text-brand-600">{message}</p>}
        </div>
      </div>
    </div>
  );
}
