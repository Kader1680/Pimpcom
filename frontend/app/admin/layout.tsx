import AdminGuard from '@/components/AdminGuard';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex flex-col md:flex-row">
        <AdminSidebar />
        <div className="min-w-0 flex-1 bg-paper">{children}</div>
      </div>
    </AdminGuard>
  );
}
