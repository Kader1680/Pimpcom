import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import { serverGet } from '@/lib/server-fetch';
import { Category, ProductListResponse } from '@/types';

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    serverGet<ProductListResponse>('/products?limit=8&sort=newest'),
    serverGet<Category[]>('/categories'),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-line bg-white">
        <div className="container-page grid gap-10 py-16 md:grid-cols-2 md:py-24">
          <div className="flex flex-col justify-center">
            <span className="label-eyebrow mb-4">New season, restocked shelves</span>
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl">
              Everyday goods, <span className="text-brand-500">built to keep.</span>
            </h1>
            <p className="mt-5 max-w-md text-base text-ink/60">
              Fieldstock curates electronics, apparel, home essentials and books from makers
              who care about the second and third year of ownership, not just the first.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="btn-primary">
                Browse the shop
              </Link>
              <Link href="#categories" className="btn-secondary">
                Explore categories
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-[28px] bg-brand-50" />
            <div className="grid h-full grid-cols-2 gap-4">
              <div className="relative col-span-2 aspect-[16/9] overflow-hidden rounded-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200"
                  alt="Smart watch product photo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="relative aspect-square overflow-hidden rounded-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"
                  alt="Wireless headphones"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-square overflow-hidden rounded-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800"
                  alt="Ceramic mug set"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="container-page py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <span className="label-eyebrow">Shop by department</span>
            <h2 className="font-display text-2xl font-bold">Categories</h2>
          </div>
          <Link href="/products" className="text-sm font-semibold text-brand-600 hover:underline">
            View all products →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {(categories || []).map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.id}`}
              className="group card flex flex-col justify-between p-5 transition-shadow hover:shadow-pop"
            >
              <span className="font-display text-lg font-semibold">{cat.name}</span>
              <span className="mt-2 text-sm text-ink/50">{cat.description}</span>
              <span className="mt-4 text-sm font-semibold text-brand-600 group-hover:underline">
                Shop now →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="container-page pb-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <span className="label-eyebrow">Just landed</span>
            <h2 className="font-display text-2xl font-bold">Newest arrivals</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {(featured?.items || []).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {!featured?.items?.length && (
            <p className="col-span-full text-sm text-ink/50">
              No products yet — connect the backend and run the seed script to populate the shop.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
