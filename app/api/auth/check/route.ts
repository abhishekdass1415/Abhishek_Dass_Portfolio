import { isAuthenticated } from '@/lib/utils/auth';
import { fail, ok } from '@/lib/api';

export async function GET() {
  return (await isAuthenticated()) ? ok({ admin: true }) : fail('Unauthorized', 401);
}
