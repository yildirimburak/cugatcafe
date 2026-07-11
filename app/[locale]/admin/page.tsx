import type { Metadata } from 'next';
import { AdminPanel } from '@/components/admin/AdminPanel';

export const metadata: Metadata = {
  title: 'Yönetim Paneli',
  robots: { index: false, follow: false },
};

export default async function AdminPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminPanel locale={locale} />
    </div>
  );
}

