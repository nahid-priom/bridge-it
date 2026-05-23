export interface DashboardOrderView {
  id: string;
  service: string;
  buyer: string;
  amount: string;
  status: string;
  date: string;
}

export interface DashboardStatView {
  label: string;
  value: string;
  change: string;
}

export interface DashboardPageData {
  sellerSlug: string;
  customUrl: string;
  stats: DashboardStatView[];
  recentOrders: DashboardOrderView[];
}
