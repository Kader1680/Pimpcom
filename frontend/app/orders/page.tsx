'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Order } from '@/types';
import { formatDate, formatPrice, statusStyles } from '@/lib/format';
import { useAuth } from '@/lib/auth-context';

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="container-page py-20 text-center text-sm text-ink/50">Loading…</div>}>
      <OrdersPageContent />
    </Suspense>
  );
}

function OrdersPageContent() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const placedId = searchParams.get('placed');

  useEffect(() => {
    if (!user) return;
    api
      .get<Order[]>('/orders/mine')
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [user]);

  if (!authLoading && !user) {
    return (
      <div className="container-page py-20 text-center">
        <p className="font-display text-xl font-semibold">Log in to see your orders</p>
        <Link href="/login" className="btn-primary mt-5 inline-flex">
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <span className="label-eyebrow">Order history</span>
        <h1 className="font-display text-3xl font-bold">My orders</h1>
      </div>

      {placedId && (
        <div className="mb-6 rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-700">
          Order placed successfully. Thank you!
        </div>
      )}

      {loading ? (
        <p className="text-sm text-ink/50">Loading orders…</p>
      ) : orders.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 py-20 text-center">
          <p className="font-display text-lg font-semibold">No orders yet</p>
          <Link href="/products" className="btn-primary">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
                <div>
                  <p className="text-xs font-semibold text-ink/40">
                    Order #{order.id.slice(0, 8)}
                  </p>
                  <p className="text-xs text-ink/40">{formatDate(order.createdAt)}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[order.status]}`}
                >
                  {order.status}
                </span>
              </div>
              <div className="divide-y divide-line">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2.5 text-sm">
                    <span>
                      {item.productName} <span className="text-ink/40">× {item.quantity}</span>
                    </span>
                    <span className="font-medium">{formatPrice(item.unitPrice * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-end pt-3 font-display font-bold">
                Total: {formatPrice(order.total)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
