'use client';

import { useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { Order, OrderStatus } from '@/types';
import { formatDate, formatPrice, statusStyles } from '@/lib/format';

const STATUSES: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  function load() {
    setLoading(true);
    api
      .get<Order[]>('/orders')
      .then(setOrders)
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleStatusChange(id: string, status: OrderStatus) {
    setUpdatingId(id);
    setError(null);
    try {
      const updated = await api.patch<Order>(`/orders/${id}/status`, { status });
      setOrders((list) => list.map((o) => (o.id === id ? { ...o, status: updated.status } : o)));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not update order.');
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="container-page py-8">
      <div className="mb-8">
        <span className="label-eyebrow">Fulfillment</span>
        <h1 className="font-display text-3xl font-bold">Orders</h1>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-sm text-ink/50">Loading orders…</p>
      ) : orders.length === 0 ? (
        <p className="card p-8 text-center text-sm text-ink/50">No orders yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="card overflow-hidden">
              <button
                onClick={() => setExpanded((id) => (id === order.id ? null : order.id))}
                className="flex w-full flex-wrap items-center justify-between gap-3 p-4 text-left"
              >
                <div>
                  <p className="font-display font-semibold">#{order.id.slice(0, 8)}</p>
                  <p className="text-xs text-ink/40">
                    {order.user?.name || 'Customer'} · {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{formatPrice(order.total)}</span>
                  <select
                    value={order.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                    disabled={updatingId === order.id}
                    className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold capitalize ${statusStyles[order.status]}`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </button>

              {expanded === order.id && (
                <div className="border-t border-line bg-paper/50 p-4">
                  {order.shippingAddress && (
                    <p className="mb-3 text-sm text-ink/60">
                      <span className="font-semibold text-ink/80">Ship to:</span> {order.shippingAddress}
                    </p>
                  )}
                  <div className="divide-y divide-line">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-2 text-sm">
                        <span>
                          {item.productName} <span className="text-ink/40">× {item.quantity}</span>
                        </span>
                        <span className="font-medium">{formatPrice(item.unitPrice * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
