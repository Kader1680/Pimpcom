'use client';

import { useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { User } from '@/types';
import { formatDate } from '@/lib/format';
import { useAuth } from '@/lib/auth-context';

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  function load() {
    setLoading(true);
    api
      .get<User[]>('/users')
      .then(setUsers)
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function toggleActive(u: User) {
    setUpdatingId(u.id);
    setError(null);
    try {
      const updated = await api.patch<User>(`/users/${u.id}`, { isActive: !u.isActive });
      setUsers((list) => list.map((x) => (x.id === u.id ? { ...x, isActive: updated.isActive } : x)));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not update user.');
    } finally {
      setUpdatingId(null);
    }
  }

  async function toggleRole(u: User) {
    setUpdatingId(u.id);
    setError(null);
    try {
      const newRole = u.role === 'admin' ? 'customer' : 'admin';
      const updated = await api.patch<User>(`/users/${u.id}`, { role: newRole });
      setUsers((list) => list.map((x) => (x.id === u.id ? { ...x, role: updated.role } : x)));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not update user.');
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="container-page py-8">
      <div className="mb-8">
        <span className="label-eyebrow">People</span>
        <h1 className="font-display text-3xl font-bold">Users</h1>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-sm text-ink/50">Loading users…</p>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="border-b border-line bg-paper/60 text-xs uppercase tracking-wide text-ink/40">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-ink/60">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                        u.role === 'admin' ? 'bg-amber-500/15 text-amber-600' : 'bg-ink/10 text-ink/60'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        u.isActive ? 'bg-brand-500/15 text-brand-700' : 'bg-red-500/10 text-red-600'
                      }`}
                    >
                      {u.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink/50">{u.createdAt ? formatDate(u.createdAt) : '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => toggleRole(u)}
                        disabled={updatingId === u.id || u.id === currentUser?.id}
                        className="text-xs font-semibold text-brand-600 hover:underline disabled:opacity-40"
                      >
                        Make {u.role === 'admin' ? 'customer' : 'admin'}
                      </button>
                      <button
                        onClick={() => toggleActive(u)}
                        disabled={updatingId === u.id || u.id === currentUser?.id}
                        className="text-xs font-semibold text-red-500 hover:underline disabled:opacity-40"
                      >
                        {u.isActive ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
