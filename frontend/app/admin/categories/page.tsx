'use client';

import { useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { Category } from '@/types';

interface FormState {
  id: string | null;
  name: string;
  description: string;
  imageUrl: string;
}

const emptyForm: FormState = { id: null, name: '', description: '', imageUrl: '' };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setLoading(true);
    api
      .get<Category[]>('/categories')
      .then(setCategories)
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function startEdit(category: Category) {
    setForm({
      id: category.id,
      name: category.name,
      description: category.description || '',
      imageUrl: category.imageUrl || '',
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const payload = {
      name: form.name,
      description: form.description || undefined,
      imageUrl: form.imageUrl || undefined,
    };
    try {
      if (form.id) {
        await api.patch(`/categories/${form.id}`, payload);
      } else {
        await api.post('/categories', payload);
      }
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save category.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this category? Products in it will become uncategorized.')) return;
    try {
      await api.delete(`/categories/${id}`);
      setCategories((c) => c.filter((cat) => cat.id !== id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not delete category.');
    }
  }

  return (
    <div className="container-page py-8">
      <div className="mb-8">
        <span className="label-eyebrow">Organization</span>
        <h1 className="font-display text-3xl font-bold">Categories</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="card h-fit space-y-4 p-6">
          <h2 className="font-display text-lg font-bold">
            {form.id ? 'Edit category' : 'New category'}
          </h2>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink/60">Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="input-field"
              placeholder="Electronics"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink/60">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              className="input-field"
              placeholder="Gadgets and devices"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink/60">Image URL</label>
            <input
              value={form.imageUrl}
              onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
              className="input-field"
              placeholder="https://…"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving…' : form.id ? 'Save changes' : 'Create category'}
            </button>
            {form.id && (
              <button type="button" onClick={() => setForm(emptyForm)} className="btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="lg:col-span-2">
          {loading ? (
            <p className="text-sm text-ink/50">Loading categories…</p>
          ) : (
            <div className="card divide-y divide-line">
              {categories.map((c) => (
                <div key={c.id} className="flex items-center justify-between gap-4 p-4">
                  <div>
                    <p className="font-display font-semibold">{c.name}</p>
                    <p className="text-sm text-ink/50">{c.description}</p>
                  </div>
                  <div className="flex shrink-0 gap-3">
                    <button
                      onClick={() => startEdit(c)}
                      className="text-xs font-semibold text-brand-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-xs font-semibold text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {categories.length === 0 && (
                <p className="p-6 text-center text-sm text-ink/50">No categories yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
