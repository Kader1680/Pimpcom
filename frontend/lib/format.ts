export function formatPrice(value: number | string): string {
  const n = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(n || 0);
}

export function formatDate(value: string | Date): string {
  const d = typeof value === 'string' ? new Date(value) : value;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

export const statusStyles: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-600',
  processing: 'bg-blue-500/15 text-blue-600',
  shipped: 'bg-brand-500/15 text-brand-600',
  delivered: 'bg-brand-600/15 text-brand-700',
  cancelled: 'bg-red-500/15 text-red-600',
};
