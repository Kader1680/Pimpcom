'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { formatPrice } from '@/lib/format';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const outOfStock = product.stock <= 0;

  async function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push('/login');
      return;
    }
    setAdding(true);
    try {
      await addItem(product.id, 1);
    } finally {
      setAdding(false);
    }
  }

  return (
    <Link
      href={`/products/${product.id}`}
      className="card group flex flex-col overflow-hidden transition-shadow hover:shadow-pop"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-brand-50">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-brand-300">No image</div>
        )}
        {product.category && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-brand-600">
            {product.category.name}
          </span>
        )}
        {outOfStock && (
          <span className="absolute right-3 top-3 rounded-full bg-ink/80 px-2.5 py-1 text-[11px] font-semibold text-white">
            Sold out
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-display text-base font-semibold leading-snug">{product.name}</h3>
        <p className="line-clamp-2 text-sm text-ink/55">{product.description}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-display text-lg font-bold text-brand-600">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={handleAdd}
            disabled={outOfStock || adding}
            className="rounded-full bg-ink px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {adding ? 'Adding…' : 'Add to cart'}
          </button>
        </div>
      </div>
    </Link>
  );
}
