'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { api } from '@/lib/api';
import { Category, ProductListResponse } from '@/types';

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container-page py-20 text-center text-sm text-ink/50">Loading…</div>}>
      <ProductsPageContent />
    </Suspense>
  );
}

function ProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [data, setData] = useState<ProductListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const categoryId = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    api.get<Category[]>('/categories').then(setCategories).catch(() => {});
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', '12');
    if (sort) params.set('sort', sort);
    if (categoryId) params.set('categoryId', categoryId);
    if (searchParams.get('search')) params.set('search', searchParams.get('search')!);

    try {
      const res = await api.get<ProductListResponse>(`/products?${params.toString()}`);
      setData(res);
    } finally {
      setLoading(false);
    }
  }, [page, sort, categoryId, searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    if (key !== 'page') params.delete('page');
    router.push(`/products?${params.toString()}`);
  }

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <span className="label-eyebrow">The full catalog</span>
        <h1 className="font-display text-3xl font-bold">All products</h1>
      </div>

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateParam('search', search);
          }}
          className="flex w-full max-w-sm gap-2"
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="input-field"
          />
          <button type="submit" className="btn-secondary shrink-0 !px-4">
            Search
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          <select
            value={categoryId}
            onChange={(e) => updateParam('category', e.target.value)}
            className="input-field !w-auto"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="input-field !w-auto"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card aspect-[3/4.2] animate-pulse bg-line/40" />
          ))}
        </div>
      ) : data?.items?.length ? (
        <>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {data.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {data.totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              {Array.from({ length: data.totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => updateParam('page', String(i + 1))}
                  className={`h-9 w-9 rounded-full text-sm font-semibold ${
                    page === i + 1
                      ? 'bg-brand-500 text-white'
                      : 'border border-line bg-white text-ink/60 hover:border-ink/30'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="card flex flex-col items-center gap-2 py-20 text-center">
          <p className="font-display text-lg font-semibold">No products found</p>
          <p className="text-sm text-ink/50">Try a different search term or category.</p>
        </div>
      )}
    </div>
  );
}
