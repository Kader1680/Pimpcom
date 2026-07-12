'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, ApiError } from '@/lib/api';
import { Category, Product } from '@/types';

interface ProductFormValues {
  name: string;
  description: string;
  price: string;
  stock: string;
  imageUrl: string;
  categoryId: string;
  isActive: boolean;
}

const emptyValues: ProductFormValues = {
  name: '',
  description: '',
  price: '',
  stock: '',
  imageUrl: '',
  categoryId: '',
  isActive: true,
};

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [values, setValues] = useState<ProductFormValues>(emptyValues);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get<Category[]>('/categories').then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    if (product) {
      setValues({
        name: product.name,
        description: product.description || '',
        price: String(product.price),
        stock: String(product.stock),
        imageUrl: product.imageUrl || '',
        categoryId: product.categoryId || product.category?.id || '',
        isActive: product.isActive,
      });
    }
  }, [product]);

  function update<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const payload = {
      name: values.name,
      description: values.description,
      price: parseFloat(values.price),
      stock: parseInt(values.stock, 10),
      imageUrl: values.imageUrl || undefined,
      categoryId: values.categoryId || undefined,
      isActive: values.isActive,
    };

    try {
      if (product) {
        await api.patch(`/products/${product.id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save product.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card max-w-2xl space-y-5 p-6">
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-ink/60">Product name</label>
        <input
          required
          value={values.name}
          onChange={(e) => update('name', e.target.value)}
          className="input-field"
          placeholder="Wireless Headphones"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-ink/60">Description</label>
        <textarea
          value={values.description}
          onChange={(e) => update('description', e.target.value)}
          rows={4}
          className="input-field"
          placeholder="A short, honest description of the product."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink/60">Price (USD)</label>
          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={values.price}
            onChange={(e) => update('price', e.target.value)}
            className="input-field"
            placeholder="49.99"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink/60">Stock quantity</label>
          <input
            required
            type="number"
            min="0"
            step="1"
            value={values.stock}
            onChange={(e) => update('stock', e.target.value)}
            className="input-field"
            placeholder="100"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-ink/60">Category</label>
        <select
          value={values.categoryId}
          onChange={(e) => update('categoryId', e.target.value)}
          className="input-field"
        >
          <option value="">Uncategorized</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-ink/60">Image URL</label>
        <input
          value={values.imageUrl}
          onChange={(e) => update('imageUrl', e.target.value)}
          className="input-field"
          placeholder="https://images.unsplash.com/…"
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-medium text-ink/70">
        <input
          type="checkbox"
          checked={values.isActive}
          onChange={(e) => update('isActive', e.target.checked)}
          className="h-4 w-4 rounded border-line text-brand-500 focus:ring-brand-400"
        />
        Visible in storefront
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving…' : product ? 'Save changes' : 'Create product'}
        </button>
        <button type="button" onClick={() => router.push('/admin/products')} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}
