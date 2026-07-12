'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { ApiError } from '@/lib/api';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(name, email, password);
      router.push('/');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="card w-full max-w-sm p-8">
        <span className="label-eyebrow">Join Fieldstock</span>
        <h1 className="mb-6 font-display text-2xl font-bold">Create your account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink/60">Full name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="Jane Doe"
            />
          </div>
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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="At least 6 characters"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-ink/50">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-brand-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
