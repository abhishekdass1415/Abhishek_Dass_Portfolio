import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/utils/auth';
import Dashboard from '@/components/admin/Dashboard';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  if (!(await isAuthenticated())) redirect('/Maihehuadmin');
  return <Dashboard />;
}
