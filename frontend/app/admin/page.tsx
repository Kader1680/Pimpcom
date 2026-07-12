'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Order, Product, User } from '@/types';
import { formatPrice, formatDate, statusStyles } from '@/lib/format';

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<Product[]>('/products/admin/all'),
      api.get<Order[]>('/orders'),
      api.get<User[]>('/users'),
    ])
      .then(([p, o, u]) => {
        setProducts(p);
        setOrders(o);
        setUsers(u);
      })
      .finally(() => setLoading(false));
  }, []);

  const revenue = orders.reduce((sum, o) => sum + Number(o.total), 0);
  const lowStock = products.filter((p) => p.stock <= 5);
  const recentOrders = orders.slice(0, 5);

  const stats = [
    { label: 'Total revenue', value: formatPrice(revenue) },
    { label: 'Orders', value: orders.length },
    { label: 'Products', value: products.length },
    { label: 'Customers', value: users.filter((u) => u.role === 'customer').length },
  ];

  return (
    <div className="container-page py-8">
      <div className="mb-8">
        <span className="label-eyebrow">Overview</span>
        <h1 className="font-display text-3xl font-bold">Dashboard</h1>
      </div>

      {loading ? (
        <p className="text-sm text-ink/50">Loading dashboard…</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="card p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">{s.label}</p>
                <p className="mt-2 font-display text-2xl font-bold">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="card p-5 lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg font-bold">Recent orders</h2>
                <Link href="/admin/orders" className="text-sm font-semibold text-brand-600 hover:underline">
                  View all →
                </Link>
              </div>
              {recentOrders.length === 0 ? (
                <p className="text-sm text-ink/50">No orders yet.</p>
              ) : (
                <div className="divide-y divide-line">
                  {recentOrders.map((o) => (
                    <div key={o.id} className="flex items-center justify-between py-3 text-sm">
                      <div>
                        <p className="font-medium">#{o.id.slice(0, 8)}</p>
                        <p className="text-xs text-ink/40">{formatDate(o.createdAt)}</p>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[o.status]}`}>
                        {o.status}
                      </span>
                      <span className="font-semibold">{formatPrice(o.total)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg font-bold">Low stock</h2>
                <Link href="/admin/products" className="text-sm font-semibold text-brand-600 hover:underline">
                  Manage →
                </Link>
              </div>
              {lowStock.length === 0 ? (
                <p className="text-sm text-ink/50">All products are well stocked.</p>
              ) : (
                <ul className="space-y-3">
                  {lowStock.map((p) => (
                    <li key={p.id} className="flex items-center justify-between text-sm">
                      <span className="truncate pr-2">{p.name}</span>
                      <span className="shrink-0 rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-semibold text-red-600">
                        {p.stock} left
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
