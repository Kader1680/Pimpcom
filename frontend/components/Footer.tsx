import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="container-page grid gap-8 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-xs text-white">
              P
            </span>
            Pimpcom
          </div>
          <p className="mt-3 max-w-xs text-sm text-ink/60">
            Everyday goods, thoughtfully sourced. Electronics, apparel, home essentials and books — picked to last.
          </p>
        </div>
        <div>
          <h4 className="label-eyebrow mb-3">Shop</h4>
          <ul className="space-y-2 text-sm text-ink/70">
            <li><Link href="/products" className="hover:text-ink">All products</Link></li>
            <li><Link href="/products?category=electronics" className="hover:text-ink">Electronics</Link></li>
            <li><Link href="/products?category=clothing" className="hover:text-ink">Clothing</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="label-eyebrow mb-3">Account</h4>
          <ul className="space-y-2 text-sm text-ink/70">
            <li><Link href="/orders" className="hover:text-ink">My orders</Link></li>
            <li><Link href="/cart" className="hover:text-ink">Cart</Link></li>
            <li><Link href="/login" className="hover:text-ink">Log in</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="label-eyebrow mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-ink/70">
            <li>Support</li>
            <li>Shipping &amp; returns</li>
            <li>Careers</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-ink/40">
        © {new Date().getFullYear()} Pimpcom. All rights reserved.
      </div>
    </footer>
  );
}
