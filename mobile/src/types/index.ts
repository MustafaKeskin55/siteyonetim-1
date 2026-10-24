export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

export interface ApartmentProperty {
  id: string;
  siteId?: string;
  siteName: string;
  block?: string;
  apartmentNo: string;
  role?: 'Kat Maliki' | 'Kiracı';
  isPrimary?: boolean;
}

export interface ProSubscription {
  isPro: boolean;
  plan?: 'monthly_small' | 'monthly_large' | 'yearly';
  startedAt?: string;
  expiresAt?: string;
  transactionId?: string;
  cardLastFour?: string;
}

export interface User {
  id: string;
  name: string;
  emailOrPhone: string;
  role: UserRole;
  apartmentNo?: string | null;
  block?: string;
  siteId?: string | null;
  siteName?: string;
  vehiclePlate?: string;
  isPro?: boolean;
  proExpiresAt?: string;
  proSubscription?: ProSubscription;
  properties?: ApartmentProperty[];
}

export interface Site {
  id: string;
  name: string;
  address?: string;
  blockCount?: number;
  unitCount?: number;
}

export interface PaymentItem {
  id: string;
  period: string;
  amount: number;
  date: string;
  dueDate?: string;
  status: 'Tamamlandı' | 'Bekliyor' | 'Gecikmiş';
  type: string;
}

export interface CommunityChannel {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon: string;
  isAnnouncementOnly: boolean;
  residentCount?: number;
  sortOrder?: number;
}

export interface PollOptionWithVotes {
  text: string;
  count: number;
  percent: number;
}

export interface Poll {
  id: string;
  question: string;
  options: string[];
  expiresAt?: string | null;
  totalVotes: number;
  userVotedOption: number | null;
  optionsWithVotes: PollOptionWithVotes[];
}

export interface CommunityMessage {
  id: string;
  channelId: string;
  userId: string;
  content: string;
  imageUrl?: string | null;
  isPinned?: boolean;
  createdAt: string;
  isMine: boolean;
  isEdited?: boolean;
  canDelete?: boolean;
  reactions?: { [emoji: string]: string[] };
  author: {
    id: string;
    name: string;
    apartmentNo: string;
    role?: UserRole;
    avatarInitials?: string;
  };
  poll?: Poll | null;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrl?: string | null;
  images?: string[];
  createdAt: string;
  eventTime?: string;
}

export type RequestStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';

export interface ResidentRequest {
  id: string;
  subject: string;
  description: string;
  category: string;
  status: RequestStatus;
  createdAt: string;
  resolutionNote?: string | null;
  rejectedNote?: string | null;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: 'WELCOME' | 'PAYMENT' | 'ANNOUNCEMENT' | 'REQUEST' | 'SYSTEM';
  href?: string;
  readAt?: string | null;
  createdAt: string;
}
