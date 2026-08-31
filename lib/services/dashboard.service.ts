import { getCurrentUser } from '@/lib/auth/get-current-user';
import { getClientOrders } from '@/lib/services/orders.service';
import { getClientProjects } from '@/lib/services/projects.service';
import { getClientQuotations } from '@/lib/services/quotations.service';
import { getClientPayments } from '@/lib/services/payments.service';

export async function getBitpDashboardOverview() {
  const user = await getCurrentUser();
  if (!user) {
    return {
      totalOrders: 0,
      activeProjects: 0,
      pendingPayments: 0,
      completedProjects: 0,
      recentOrders: [],
    };
  }

  const [orders, projects, payments] = await Promise.all([
    getClientOrders(user.id),
    getClientProjects(user.id),
    getClientPayments(user.id),
  ]);

  return {
    totalOrders: orders.length,
    activeProjects: projects.filter((p) => p.status === 'in_progress').length,
    pendingPayments: payments.filter((p) => p.payment_status === 'pending').length,
    completedProjects: projects.filter((p) => p.status === 'completed').length,
    recentOrders: orders.slice(0, 5),
  };
}

export async function getBitpClientOrders() {
  const user = await getCurrentUser();
  if (!user) return [];
  return getClientOrders(user.id);
}

export async function getBitpClientProjects() {
  const user = await getCurrentUser();
  if (!user) return [];
  return getClientProjects(user.id);
}

export async function getBitpClientQuotations() {
  const user = await getCurrentUser();
  if (!user) return [];
  return getClientQuotations(user.id);
}

export async function getBitpClientPayments() {
  const user = await getCurrentUser();
  if (!user) return [];
  return getClientPayments(user.id);
}
