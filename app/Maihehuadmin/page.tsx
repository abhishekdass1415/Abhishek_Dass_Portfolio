import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/utils/auth';
import LoginForm from '@/components/admin/LoginForm';

export const dynamic = 'force-dynamic';

export default async function AdminLogin() {
  return (
    <main className="login-wrap">
      <LoginForm />
    </main>
  );
}
