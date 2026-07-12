'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductForm from '@/components/ProductForm';
import { api } from '@/lib/api';
import { Product } from '@/types';

export default function EditProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Product>(`/products/${params.id}`)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <div className="container-page py-8">
      <div className="mb-8">
        <span className="label-eyebrow">Catalog</span>
        <h1 className="font-display text-3xl font-bold">Edit product</h1>
      </div>
      {loading ? (
        <p className="text-sm text-ink/50">Loading…</p>
      ) : product ? (
        <ProductForm product={product} />
      ) : (
        <p className="text-sm text-red-600">Product not found.</p>
      )}
    </div>
  );
}
