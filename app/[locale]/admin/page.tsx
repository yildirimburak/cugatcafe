import { AdminPanel } from '@/components/admin/AdminPanel';

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

