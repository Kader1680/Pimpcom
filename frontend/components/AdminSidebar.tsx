'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/admin', label: 'Dashboard', icon: '◱' },
  { href: '/admin/products', label: 'Products', icon: '▤' },
  { href: '/admin/categories', label: 'Categories', icon: '▧' },
  { href: '/admin/orders', label: 'Orders', icon: '▥' },
  { href: '/admin/users', label: 'Users', icon: '◍' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 border-b border-line bg-white md:w-56 md:border-b-0 md:border-r md:min-h-[calc(100vh-4rem)]">
      <nav className="container-page flex gap-1 overflow-x-auto py-3 md:container-page md:flex-col md:gap-1 md:py-6">
        {links.map((link) => {
          const active = link.href === '/admin' ? pathname === '/admin' : pathname?.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active ? 'bg-brand-500 text-white' : 'text-ink/60 hover:bg-paper'
              }`}
            >
              <span aria-hidden>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
