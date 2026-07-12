'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api, ApiError } from '@/lib/api';
import { Product } from '@/types';
import { formatPrice } from '@/lib/format';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function load() {
    setLoading(true);
    api
      .get<Product[]>('/products/admin/all')
      .then(setProducts)
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleDelete(id: string) {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    setDeletingId(id);
    setError(null);
    try {
      await api.delete(`/products/${id}`);
      setProducts((p) => p.filter((prod) => prod.id !== id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not delete product.');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="container-page py-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="label-eyebrow">Catalog</span>
          <h1 className="font-display text-3xl font-bold">Products</h1>
        </div>
        <Link href="/admin/products/new" className="btn-primary">
          + New product
        </Link>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-sm text-ink/50">Loading products…</p>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-line bg-paper/60 text-xs uppercase tracking-wide text-ink/40">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-brand-50">
                        {p.imageUrl && <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />}
                      </div>
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink/60">{p.category?.name || '—'}</td>
                  <td className="px-4 py-3 font-medium">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">
                    <span className={p.stock <= 5 ? 'font-semibold text-red-600' : 'text-ink/70'}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        p.isActive ? 'bg-brand-500/15 text-brand-700' : 'bg-ink/10 text-ink/50'
                      }`}
                    >
                      {p.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="text-xs font-semibold text-brand-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        disabled={deletingId === p.id}
                        className="text-xs font-semibold text-red-500 hover:underline disabled:opacity-50"
                      >
                        {deletingId === p.id ? 'Deleting…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-ink/50">
                    No products yet.{' '}
                    <Link href="/admin/products/new" className="text-brand-600 hover:underline">
                      Create one →
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
