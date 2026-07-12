'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { ApiError } from '@/lib/api';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="card w-full max-w-sm p-8">
        <span className="label-eyebrow">Welcome back</span>
        <h1 className="mb-6 font-display text-2xl font-bold">Log in</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink/60">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink/60">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-ink/50">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-semibold text-brand-600 hover:underline">
            Sign up
          </Link>
        </p>
        <p className="mt-2 text-center text-xs text-ink/35">
          Demo admin: admin@shop.com / Admin123!
        </p>
      </div>
    </div>
  );
}
