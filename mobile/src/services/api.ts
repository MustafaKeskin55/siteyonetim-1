import {
  User,
  Site,
  PaymentItem,
  CommunityChannel,
  CommunityMessage,
  AnnouncementItem,
  ResidentRequest,
  AppNotification,
  Poll,
} from '../types';
import { storage } from '../lib/storage';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

// Güvenli fetch sarmalayıcısı (JWT Bearer Token ve Cookie kimlik doğrulaması)
async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = storage.get<string | null>(TOKEN_KEY, null);
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({ error: 'Sunucu hatası' }))) as { error?: string };
    throw new Error(errorData?.error || `İşlem başarısız: ${response.status}`);
  }

  return (await response.json()) as T;
}

export const api = {
  // 1. Kimlik Doğrulama
  getToken: (): string | null => {
    return storage.get<string | null>(TOKEN_KEY, null);
  },

  setToken: (token: string | null) => {
    if (token) {
      storage.set(TOKEN_KEY, token);
    } else {
      storage.remove(TOKEN_KEY);
    }
  },

  login: async (usernameOrPhone: string, password: string) => {
    const res = await request<{
      message: string;
      token?: string;
      user: {
        id: string;
        name: string;
        role: string;
        siteId?: string | null;
        apartmentNo?: string | null;
      };
    }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ usernameOrPhone, password }),
    });

    if (res.token) {
      api.setToken(res.token);
    }
    const mappedUser: User = {
      id: res.user.id,
      name: res.user.name,
      emailOrPhone: usernameOrPhone,
      role: res.user.role as User['role'],
      apartmentNo: res.user.apartmentNo,
      siteId: res.user.siteId,
      vehiclePlate: storage.get<string>('vehicle_plate_' + res.user.id, ''),
    };
    storage.set(USER_KEY, mappedUser);
    return mappedUser;
  },

  register: async (data: {
    name: string;
    emailOrPhone: string;
    password: string;
    inviteCode?: string;
    accountType?: 'RESIDENT' | 'MANAGER';
    newSiteName?: string;
    apartmentNo?: string;
  }) => {
    return await request<{ ok: boolean; message: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  logout: () => {
    storage.remove(TOKEN_KEY);
    storage.remove(USER_KEY);
  },

  getMe: async (): Promise<User | null> => {
    try {
      const res = await request<{
        authenticated: boolean;
        user: {
          id: string;
          name: string;
          role: string;
          siteId?: string | null;
          apartmentNo?: string | null;
        } | null;
      }>('/api/auth/me');

      if (!res.authenticated || !res.user) {
        return null;
      }

      return {
        id: res.user.id,
        name: res.user.name,
        emailOrPhone: '',
        role: res.user.role as User['role'],
        apartmentNo: res.user.apartmentNo,
        siteId: res.user.siteId,
        vehiclePlate: storage.get<string>('vehicle_plate_' + res.user.id, ''),
      };
    } catch {
      return null;
    }
  },

  // 2. Site Ayarları & Banka Bilgileri (Gerçek Veritabanından)
  getSiteSettings: async (): Promise<{
    aidat: string;
    managerName: string;
    iban: string;
    bankName: string;
    phone: string;
  }> => {
    try {
      return await request<{
        aidat: string;
        managerName: string;
        iban: string;
        bankName: string;
        phone: string;
      }>('/api/settings');
    } catch {
      return { aidat: '0', managerName: '', iban: '', bankName: '', phone: '' };
    }
  },

  // 3. Aidatlar (Gerçek Veritabanından)
  getPayments: async (): Promise<PaymentItem[]> => {
    try {
      const rows = await request<
        Array<{
          id: string;
          period: string;
          amount: number;
          date: string;
          status: string;
          type: string;
        }>
      >('/api/payments');

      return rows.map((r) => ({
        id: r.id,
        period: r.period,
        amount: r.amount,
        date: r.date,
        status: r.status === 'Tamamlandı' ? 'Tamamlandı' : 'Bekliyor',
        type: r.type || 'Aidat',
      }));
    } catch (e) {
      console.warn('Aidatlar alınamadı:', e);
      return [];
    }
  },

  // 4. Duyurular (Gerçek Veritabanından)
  getAnnouncements: async (): Promise<AnnouncementItem[]> => {
    try {
      const rows = await request<
        Array<{
          id: string;
          title: string;
          content: string;
          category?: string | null;
          imageUrl?: string | null;
          createdAt?: string | null;
        }>
      >('/api/announcements');

      return rows.map((r) => ({
        id: r.id,
        title: r.title,
        content: r.content,
        category: r.category || 'Genel',
        imageUrl: r.imageUrl,
        createdAt: r.createdAt || new Date().toISOString(),
      }));
    } catch (e) {
      console.warn('Duyurular alınamadı:', e);
      return [];
    }
  },

  // 5. Talepler (Gerçek Veritabanından)
  getRequests: async (): Promise<ResidentRequest[]> => {
    try {
      const rows = await request<
        Array<{
          id: string;
          title?: string;
          subject?: string;
          description: string;
          category: string;
          status: string;
          createdAt: string;
          resolutionNote?: string | null;
          rejectedNote?: string | null;
        }>
      >('/api/requests');

      return rows.map((r) => {
        let mappedStatus: ResidentRequest['status'] = 'OPEN';
        if (r.status === 'İşlemde' || r.status === 'IN_PROGRESS') mappedStatus = 'IN_PROGRESS';
        else if (r.status === 'Çözüldü' || r.status === 'RESOLVED') mappedStatus = 'RESOLVED';
        else if (r.status === 'Reddedildi' || r.status === 'REJECTED') mappedStatus = 'REJECTED';

        return {
          id: r.id,
          subject: r.subject || r.title || 'Talep',
          description: r.description,
          category: r.category || 'Genel',
          status: mappedStatus,
          createdAt: r.createdAt,
          resolutionNote: r.resolutionNote,
          rejectedNote: r.rejectedNote,
        };
      });
    } catch (e) {
      console.warn('Talepler alınamadı:', e);
      return [];
    }
  },

  createRequest: async (subject: string, category: string, description: string): Promise<ResidentRequest> => {
    const res = await request<{ success: boolean; request: any }>('/api/requests', {
      method: 'POST',
      body: JSON.stringify({ title: subject, category, description }),
    });
    return res.request;
  },

  // 6. Topluluk Kanalları (Gerçek Veritabanından)
  getChannels: async (): Promise<CommunityChannel[]> => {
    try {
      const rows = await request<
        Array<{
          id: string;
          name: string;
          slug: string;
          description?: string | null;
          icon?: string | null;
          isAnnouncementOnly?: boolean;
          sortOrder?: number;
        }>
      >('/api/community/channels');

      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        description: r.description || undefined,
        icon: r.icon || 'Users',
        isAnnouncementOnly: !!r.isAnnouncementOnly,
        sortOrder: r.sortOrder || 0,
      }));
    } catch (e) {
      console.warn('Kanallar alınamadı:', e);
      return [];
    }
  },

  // 7. Topluluk Mesajları (Gerçek Veritabanından)
  getMessages: async (channelId: string): Promise<CommunityMessage[]> => {
    try {
      const rows = await request<
        Array<{
          id: string;
          channelId: string;
          content: string;
          imageUrl?: string | null;
          createdAt: string;
          isMine: boolean;
          canDelete?: boolean;
          author: {
            id: string;
            name: string;
            apartmentNo: string;
            role?: string;
          };
          poll?: any;
        }>
      >(`/api/community/messages?channelId=${encodeURIComponent(channelId)}`);

      return rows.map((r) => ({
        id: r.id,
        channelId: r.channelId,
        userId: r.author.id,
        content: r.content,
        imageUrl: r.imageUrl,
        createdAt: r.createdAt,
        isMine: r.isMine,
        canDelete: r.canDelete,
        author: {
          id: r.author.id,
          name: r.author.name,
          apartmentNo: r.author.apartmentNo,
          avatarInitials: r.author.name ? r.author.name.slice(0, 2).toUpperCase() : 'KS',
        },
        poll: r.poll || null,
      }));
    } catch (e) {
      console.warn('Mesajlar alınamadı:', e);
      return [];
    }
  },

  sendMessage: async (channelId: string, content: string, user: User, imageUrl?: string): Promise<CommunityMessage> => {
    const res = await request<{ success: boolean; messageId: string }>('/api/community/messages', {
      method: 'POST',
      body: JSON.stringify({ channelId, content, imageUrl }),
    });

    return {
      id: res.messageId || 'msg_' + Date.now(),
      channelId,
      userId: user.id,
      content,
      imageUrl: imageUrl || null,
      createdAt: new Date().toISOString(),
      isMine: true,
      canDelete: true,
      author: {
        id: user.id,
        name: user.name,
        apartmentNo: user.apartmentNo ? `Daire ${user.apartmentNo}` : 'Sakin',
        avatarInitials: user.name.slice(0, 2).toUpperCase(),
      },
    };
  },

  editMessage: async (messageId: string, content: string): Promise<boolean> => {
    const res = await request<{ success: boolean }>('/api/community/messages', {
      method: 'PATCH',
      body: JSON.stringify({ id: messageId, content }),
    });
    return !!res.success;
  },

  deleteMessage: async (messageId: string): Promise<boolean> => {
    try {
      const res = await request<{ success: boolean }>(`/api/community/messages?id=${encodeURIComponent(messageId)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: messageId }),
      });
      return !!res.success;
    } catch (err: any) {
      // Mesaj sunucuda zaten yoksa / silinmişse (404 / bulunamadı) işlemi başarılı say
      if (
        err?.message?.includes('404') ||
        err?.message?.includes('bulunamadı') ||
        err?.message?.includes('bulunamad')
      ) {
        return true;
      }
      throw err;
    }
  },

  // 8. Anket Oy Verme (Gerçek Veritabanından)
  getPoll: async (pollId: string): Promise<Poll | null> => {
    return null;
  },

  votePoll: async (pollId: string, optionIndex: number): Promise<Poll | null> => {
    try {
      await request('/api/community/polls/vote', {
        method: 'POST',
        body: JSON.stringify({ pollId, optionIndex }),
      });
    } catch {}
    return null;
  },

  // Gerçek Topluluk Üyeleri & WhatsApp Yönetimi
  getCommunityMembers: async (): Promise<Array<{
    id: string;
    name: string;
    apartmentNo: string;
    role: 'ADMIN' | 'USER';
    emailOrPhone: string;
    isOnline?: boolean;
  }>> => {
    try {
      return await request<Array<{
        id: string;
        name: string;
        apartmentNo: string;
        role: 'ADMIN' | 'USER';
        emailOrPhone: string;
        isOnline?: boolean;
      }>>('/api/community/members');
    } catch {
      return [];
    }
  },

  updateMemberRole: async (userId: string, role: 'ADMIN' | 'USER'): Promise<boolean> => {
    try {
      const res = await request<{ success: boolean }>('/api/community/members', {
        method: 'PATCH',
        body: JSON.stringify({ userId, role }),
      });
      return !!res.success;
    } catch {
      return false;
    }
  },

  removeMemberFromSite: async (userId: string): Promise<boolean> => {
    try {
      const res = await request<{ success: boolean }>(`/api/community/members?userId=${encodeURIComponent(userId)}`, {
        method: 'DELETE',
      });
      return !!res.success;
    } catch {
      return false;
    }
  },

  sendPollMessage: async (channelId: string, question: string, options: string[], user: User): Promise<CommunityMessage> => {
    const res = await request<{ success: boolean; messageId: string }>('/api/community/messages', {
      method: 'POST',
      body: JSON.stringify({
        channelId,
        poll: { question, options },
      }),
    });
    return {
      id: res.messageId || 'msg_' + Date.now(),
      channelId,
      userId: user.id,
      content: question,
      imageUrl: null,
      createdAt: new Date().toISOString(),
      isMine: true,
      canDelete: true,
      author: {
        id: user.id,
        name: user.name,
        apartmentNo: user.apartmentNo ? `Daire ${user.apartmentNo}` : 'Sakin',
        avatarInitials: user.name.slice(0, 2).toUpperCase(),
      },
    };
  },

  // 9. Aidat FAST/Havale Bildirimi
  payDue: async (paymentId: string): Promise<void> => {
    // Havale / FAST bildirimi yapıldığında
    return;
  },

  // 10. Bildirimler (Gerçek Veritabanından)
  getNotifications: async (): Promise<AppNotification[]> => {
    try {
      const rows = await request<
        Array<{
          id: string;
          title: string;
          body: string;
          type: string;
          href?: string | null;
          readAt?: string | null;
          createdAt?: string | null;
        }>
      >('/api/notifications');

      return rows.map((r) => ({
        id: r.id,
        title: r.title,
        body: r.body,
        type: (r.type as AppNotification['type']) || 'SYSTEM',
        href: r.href || undefined,
        readAt: r.readAt,
        createdAt: r.createdAt || new Date().toISOString(),
      }));
    } catch {
      return [];
    }
  },

  markNotificationRead: async (notifId: string): Promise<void> => {
    return;
  },
};
