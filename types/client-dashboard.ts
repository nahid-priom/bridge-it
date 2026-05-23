export type ClientProjectStatus =
  | 'in_progress'
  | 'pending_review'
  | 'completed'
  | 'delayed';

export type ClientOrderStatus =
  | 'active'
  | 'delivered'
  | 'cancelled'
  | 'refunded'
  | 'pending';

export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';

export type MilestoneStatus = 'pending' | 'in_review' | 'approved' | 'paid';

export type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'draft';

export type TicketPriority = 'low' | 'medium' | 'high';

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export type ClientProject = {
  id: string;
  title: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar?: string;
  progress: number;
  milestoneStatus: string;
  dueDate: string;
  budget: number;
  currency: string;
  status: ClientProjectStatus;
  category: string;
};

export type ClientOrder = {
  id: string;
  orderNumber: string;
  type: 'service' | 'product';
  title: string;
  sellerName: string;
  sellerAvatar?: string;
  amount: number;
  currency: string;
  deliveryDate: string;
  paymentStatus: PaymentStatus;
  status: ClientOrderStatus;
  createdAt: string;
};

export type ClientMilestone = {
  id: string;
  projectId: string;
  title: string;
  progress: number;
  dueDate: string;
  amount: number;
  currency: string;
  status: MilestoneStatus;
};

export type ClientTransaction = {
  id: string;
  type: 'payment' | 'refund' | 'deposit' | 'milestone' | 'purchase';
  label: string;
  amount: number;
  currency: string;
  date: string;
  status: PaymentStatus;
};

export type ClientInvoice = {
  id: string;
  invoiceNumber: string;
  sellerName: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  issuedAt: string;
  dueAt: string;
};

export type ClientSeller = {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  activeProjects: number;
  responseTime: string;
  isOnline: boolean;
};

export type ClientMessage = {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar?: string;
  lastMessage: string;
  lastAt: string;
  unread: number;
  isOnline: boolean;
};

export type ClientChatMessage = {
  id: string;
  from: 'client' | 'seller';
  text: string;
  time: string;
};

export type ClientNotification = {
  id: string;
  title: string;
  body: string;
  type: 'payment' | 'project' | 'message' | 'support' | 'order';
  read: boolean;
  createdAt: string;
};

export type ClientActivity = {
  id: string;
  title: string;
  description: string;
  type: 'file' | 'milestone' | 'payment' | 'invoice' | 'support' | 'message';
  createdAt: string;
};

export type ClientPurchasedProduct = {
  id: string;
  name: string;
  image?: string;
  vendor: string;
  orderStatus: ClientOrderStatus;
  warrantyUntil?: string;
  licenseKey?: string;
  trackingId?: string;
};

export type ClientPurchasedService = {
  id: string;
  title: string;
  sellerName: string;
  revisionsLeft: number;
  status: ClientOrderStatus;
  deliveryFiles: number;
  dueDate: string;
};

export type SupportTicket = {
  id: string;
  subject: string;
  priority: TicketPriority;
  status: TicketStatus;
  updatedAt: string;
  messages: number;
};

export type ClientDashboardStats = {
  activeProjects: number;
  totalOrders: number;
  pendingPayments: number;
  walletBalance: number;
  completedProjects: number;
  activeSellers: number;
  currency: string;
};

export type ClientDashboardOverview = {
  stats: ClientDashboardStats;
  projects: ClientProject[];
  orders: ClientOrder[];
  activities: ClientActivity[];
  notifications: ClientNotification[];
  spendingByMonth: { month: string; amount: number }[];
  projectCompletion: { label: string; value: number }[];
};

export type ClientProjectDetail = ClientProject & {
  description: string;
  milestones: ClientMilestone[];
  activities: ClientActivity[];
  invoices: ClientInvoice[];
  transactions: ClientTransaction[];
};
