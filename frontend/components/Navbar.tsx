'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm text-white">
            P
          </span>
          Pimpcom 
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/products" className="text-sm font-medium text-ink/70 hover:text-ink">
            Shop  
          </Link>
          {user && (
            <Link href="/orders" className="text-sm font-medium text-ink/70 hover:text-ink">
              My Orders
            </Link>
          )}
          {user?.role === 'admin' && (
            <Link href="/admin" className="text-sm font-medium text-ink/70 hover:text-ink">
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {!isAdminRoute && (
            <Link
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white hover:border-ink/30"
              aria-label="View cart"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-ink">
                  {itemCount}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <div className="hidden items-center gap-3 md:flex">
              <span className="text-sm text-ink/60">Hi, {user.name.split(' ')[0]}</span>
              <button onClick={logout} className="btn-secondary !py-1.5 !px-3.5 text-xs">
                Log out
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/login" className="btn-secondary !py-1.5 !px-3.5 text-xs">
                Log in
              </Link>
              <Link href="/register" className="btn-primary !py-1.5 !px-3.5 text-xs">
                Sign up
              </Link>
            </div>
          )}

          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-line bg-paper md:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            <Link href="/products" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-white" onClick={() => setMenuOpen(false)}>
              Shop
            </Link>
            {user && (
              <Link href="/orders" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-white" onClick={() => setMenuOpen(false)}>
                My Orders
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link href="/admin" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-white" onClick={() => setMenuOpen(false)}>
                Admin
              </Link>
            )}
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="rounded-lg px-3 py-2 text-left text-sm font-medium hover:bg-white"
              >
                Log out
              </button>
            ) : (
              <>
                <Link href="/login" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-white" onClick={() => setMenuOpen(false)}>
                  Log in
                </Link>
                <Link href="/register" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-white" onClick={() => setMenuOpen(false)}>
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
