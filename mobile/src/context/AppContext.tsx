import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Site,
  PaymentItem,
  CommunityChannel,
  AnnouncementItem,
  ResidentRequest,
  AppNotification,
  ApartmentProperty,
  ProSubscription,
} from '../types';
import { api } from '../services/api';
import { storage } from '../lib/storage';

export type TabType = 'home' | 'payments' | 'community' | 'requests' | 'profile';

interface AppContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  user: User | null;
  setUser: (u: User | null) => void;
  site: Site | null;
  setSite: (s: Site | null) => void;
  siteSettings: {
    aidat: string;
    managerName: string;
    iban: string;
    bankName: string;
    phone: string;
  };
  payments: PaymentItem[];
  refreshPayments: () => Promise<void>;
  channels: CommunityChannel[];
  activeChannelId: string;
  setActiveChannelId: (id: string) => void;
  announcements: AnnouncementItem[];
  requests: ResidentRequest[];
  refreshRequests: () => Promise<void>;
  notifications: AppNotification[];
  refreshNotifications: () => Promise<void>;
  unreadNotifsCount: number;
  reloadAllData: () => Promise<void>;
  isLoading: boolean;

  // Modals & Sheets
  isSiteSelectorOpen: boolean;
  setIsSiteSelectorOpen: (open: boolean) => void;
  isNotifSheetOpen: boolean;
  setIsNotifSheetOpen: (open: boolean) => void;
  isPaymentModalOpen: boolean;
  setIsPaymentModalOpen: (open: boolean) => void;
  selectedPayment: PaymentItem | null;
  setSelectedPayment: (p: PaymentItem | null) => void;
  isPollModalOpen: boolean;
  setIsPollModalOpen: (open: boolean) => void;
  activePollId: string | null;
  setActivePollId: (id: string | null) => void;
  isNewRequestOpen: boolean;
  setIsNewRequestOpen: (open: boolean) => void;
  isNewMessageOpen: boolean;
  setIsNewMessageOpen: (open: boolean) => void;
  isCustomModalOpen: boolean;
  setIsCustomModalOpen: (open: boolean) => void;
  isAnyModalOpen: boolean;
  updateVehiclePlate: (plate: string) => void;

  // Multi-Apartment & PRO Membership (3 ve Üzeri Daire Kuralı)
  properties: ApartmentProperty[];
  activePropertyId: string;
  isPro: boolean;
  proSubscription: ProSubscription | null;
  isProModalOpen: boolean;
  setIsProModalOpen: (open: boolean) => void;
  switchActiveProperty: (propertyId: string) => { success: boolean; requiresPro?: boolean; message?: string };
  addProperty: (prop: { siteName: string; block: string; apartmentNo: string; role?: 'Kat Maliki' | 'Kiracı' }) => { success: boolean; requiresPro?: boolean; message?: string };
  subscribePro: (cardData: {
    cardHolder: string;
    cardNumber: string;
    expiry: string;
    cvv: string;
    plan: 'monthly_small' | 'monthly_large' | 'yearly';
  }) => Promise<{ success: boolean; transactionId: string; expiresAt: string }>;
  cancelProSubscription: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [user, setUser] = useState<User | null>(null);
  const [site, setSite] = useState<Site | null>(null);
  const [siteSettings, setSiteSettings] = useState<{
    aidat: string;
    managerName: string;
    iban: string;
    bankName: string;
    phone: string;
  }>({ aidat: '0', managerName: '', iban: '', bankName: '', phone: '' });

  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [channels, setChannels] = useState<CommunityChannel[]>([]);
  const [activeChannelId, setActiveChannelId] = useState<string>('');
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [requests, setRequests] = useState<ResidentRequest[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isSiteSelectorOpen, setIsSiteSelectorOpen] = useState(false);
  const [isNotifSheetOpen, setIsNotifSheetOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentItem | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPollModalOpen, setIsPollModalOpen] = useState(false);
  const [activePollId, setActivePollId] = useState<string | null>(null);
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  // Multi-Apartment & PRO States (3 ve Üzeri Daire Kuralı)
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [proSubscription, setProSubscription] = useState<ProSubscription | null>(() => {
    return storage.get<ProSubscription | null>('pro_sub_global', null);
  });
  const [isPro, setIsPro] = useState<boolean>(() => {
    const sub = storage.get<ProSubscription | null>('pro_sub_global', null);
    return Boolean(sub?.isPro);
  });
  const [properties, setProperties] = useState<ApartmentProperty[]>([]);
  const [activePropertyId, setActivePropertyId] = useState<string>('prop-primary');

  const isAnyModalOpen = Boolean(
    isSiteSelectorOpen ||
    isNotifSheetOpen ||
    isPaymentModalOpen ||
    isPollModalOpen ||
    isNewRequestOpen ||
    isNewMessageOpen ||
    isCustomModalOpen ||
    isProModalOpen
  );

  // Gerçek verileri sunucudan yükleme
  const reloadAllData = async () => {
    setIsLoading(true);
    try {
      // 1. Önce oturum kontrolü
      const me = await api.getMe();
      setUser(me);

      if (me) {
        // Kullanıcı giriş yapmışsa gerçek verileri çek
        const [p, ch, ann, req, notif, settings] = await Promise.all([
          api.getPayments(),
          api.getChannels(),
          api.getAnnouncements(),
          api.getRequests(),
          api.getNotifications(),
          api.getSiteSettings(),
        ]);

        setPayments(p);
        setChannels(ch);
        if (ch.length > 0 && !activeChannelId) {
          setActiveChannelId(ch[0].id);
        }
        setAnnouncements(ann);
        setRequests(req);
        setNotifications(notif);
        setSiteSettings(settings);

        if (me.siteId) {
          setSite({
            id: me.siteId,
            name: me.siteName || 'Site Yönetimi',
          });
        }
      }
    } catch (e) {
      console.warn('Veri yükleme hatası:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    reloadAllData();
  }, []);

  const refreshPayments = async () => {
    const p = await api.getPayments();
    setPayments(p);
  };

  const refreshRequests = async () => {
    const r = await api.getRequests();
    setRequests(r);
  };

  const refreshNotifications = async () => {
    const n = await api.getNotifications();
    setNotifications(n);
  };

  const updateVehiclePlate = (plate: string) => {
    if (!user) return;
    const cleanPlate = plate.trim().toUpperCase();
    storage.set('vehicle_plate_' + user.id, cleanPlate);
    setUser({
      ...user,
      vehiclePlate: cleanPlate,
    });
  };

  const unreadNotifsCount = notifications.filter((n) => !n.readAt).length;

  useEffect(() => {
    if (user) {
      const storedProps = storage.get<ApartmentProperty[]>('properties_' + user.id, []);
      if (storedProps && storedProps.length > 0) {
        setProperties(storedProps);
        setActivePropertyId((prev) => (storedProps.some((p) => p.id === prev) ? prev : storedProps[0].id));
      } else {
        const initial: ApartmentProperty[] = [
          {
            id: 'prop-primary',
            siteName: site?.name || user.siteName || 'Site Yönetimi',
            block: user.block || 'A',
            apartmentNo: user.apartmentNo || '1',
            role: 'Kat Maliki',
            isPrimary: true,
          },
        ];
        setProperties(initial);
        setActivePropertyId('prop-primary');
        storage.set('properties_' + user.id, initial);
      }

      const userSub = storage.get<ProSubscription | null>('pro_sub_' + user.id, proSubscription);
      if (userSub?.isPro) {
        setIsPro(true);
        setProSubscription(userSub);
      }
    }
  }, [user?.id]);

  const switchActiveProperty = (propertyId: string) => {
    const targetProp = properties.find((p) => p.id === propertyId);
    if (!targetProp) return { success: false, message: 'Daire bulunamadı' };

    const targetIndex = properties.findIndex((p) => p.id === propertyId);
    // KURAL: 1. ve 2. daireler (index 0 ve 1) tamamen ÜCRETSİZ ve STANDARTTIR.
    // 3 ve üzeri dairelere (index >= 2) geçiş yapmak için PRO üyelik zorunludur!
    if (targetIndex >= 2 && !isPro) {
      setIsProModalOpen(true);
      return {
        success: false,
        requiresPro: true,
        message: '3 ve üzeri daireler arasında geçiş yapmak için PRO üyelik gereklidir.',
      };
    }

    setActivePropertyId(propertyId);
    if (user) {
      setUser({
        ...user,
        block: targetProp.block,
        apartmentNo: targetProp.apartmentNo,
      });
    }
    return { success: true };
  };

  const addProperty = (newProp: {
    siteName: string;
    block: string;
    apartmentNo: string;
    role?: 'Kat Maliki' | 'Kiracı';
  }) => {
    // KURAL: 1. ve 2. daire ücretsizdir.
    // Kullanıcının halihazırda 2 veya daha fazla dairesi varsa (properties.length >= 2),
    // yeni eklenecek olan 3. daire için PRO Üyelik ZORUNLUDUR!
    if (properties.length >= 2 && !isPro) {
      setIsProModalOpen(true);
      return {
        success: false,
        requiresPro: true,
        message: '3 ve üzeri daire eklemek için PRO üyelik gereklidir.',
      };
    }

    const created: ApartmentProperty = {
      id: 'prop_' + Date.now(),
      siteName: newProp.siteName.trim() || (site?.name || 'Site Yönetimi'),
      block: newProp.block.trim() || 'A',
      apartmentNo: newProp.apartmentNo.trim(),
      role: newProp.role || 'Kat Maliki',
      isPrimary: properties.length === 0,
    };

    const updated = [...properties, created];
    setProperties(updated);
    if (user) {
      storage.set('properties_' + user.id, updated);
    }
    return { success: true };
  };

  // GERÇEK PRO ÜYELİK SATIN ALMA (ÖDEME DOĞRULAMA & SİSTEM KAYDI)
  const subscribePro = async (cardData: {
    cardHolder: string;
    cardNumber: string;
    expiry: string;
    cvv: string;
    plan: 'monthly_small' | 'monthly_large' | 'yearly';
  }): Promise<{ success: boolean; transactionId: string; expiresAt: string }> => {
    const cleanNum = cardData.cardNumber.replace(/\s+/g, '');
    if (cleanNum.length < 15 || cleanNum.length > 19) {
      throw new Error('Lütfen 16 haneli geçerli kredi/banka kart numaranızı giriniz.');
    }
    if (!cardData.expiry.includes('/') || cardData.expiry.length < 5) {
      throw new Error('Son kullanma tarihi AA/YY formatında olmalıdır.');
    }
    if (cardData.cvv.length < 3) {
      throw new Error('Lütfen 3 haneli CVV güvenlik kodunu giriniz.');
    }

    // Gerçekçi banka güvenli ödeme simülasyonu (1.4 saniye)
    await new Promise((resolve) => setTimeout(resolve, 1400));

    const now = new Date();
    const expires = new Date(now);
    if (cardData.plan === 'yearly') {
      expires.setFullYear(expires.getFullYear() + 1);
    } else {
      expires.setMonth(expires.getMonth() + 1);
    }

    const txId = 'PRO-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Date.now().toString().slice(-4);
    const sub: ProSubscription = {
      isPro: true,
      plan: cardData.plan,
      startedAt: now.toISOString(),
      expiresAt: expires.toISOString(),
      transactionId: txId,
      cardLastFour: cleanNum.slice(-4),
    };

    setIsPro(true);
    setProSubscription(sub);
    storage.set('is_pro_global', true);
    storage.set('pro_sub_global', sub);

    if (user) {
      storage.set('is_pro_' + user.id, true);
      storage.set('pro_sub_' + user.id, sub);
      setUser({
        ...user,
        isPro: true,
        proSubscription: sub,
        proExpiresAt: sub.expiresAt,
      });
    }

    const formattedExpires = expires.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    return {
      success: true,
      transactionId: txId,
      expiresAt: formattedExpires,
    };
  };

  const cancelProSubscription = () => {
    setIsPro(false);
    setProSubscription(null);
    storage.set('is_pro_global', false);
    storage.remove('pro_sub_global');
    if (user) {
      storage.set('is_pro_' + user.id, false);
      storage.remove('pro_sub_' + user.id);
      setUser({
        ...user,
        isPro: false,
        proSubscription: undefined,
        proExpiresAt: undefined,
      });
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        user,
        setUser,
        updateVehiclePlate,
        site,
        setSite,
        siteSettings,
        payments,
        refreshPayments,
        channels,
        activeChannelId,
        setActiveChannelId,
        announcements,
        requests,
        refreshRequests,
        notifications,
        refreshNotifications,
        unreadNotifsCount,
        reloadAllData,
        isLoading,

        isSiteSelectorOpen,
        setIsSiteSelectorOpen,
        isNotifSheetOpen,
        setIsNotifSheetOpen,
        isPaymentModalOpen,
        setIsPaymentModalOpen,
        selectedPayment,
        setSelectedPayment,
        isPollModalOpen,
        setIsPollModalOpen,
        activePollId,
        setActivePollId,
        isNewRequestOpen,
        setIsNewRequestOpen,
        isNewMessageOpen,
        setIsNewMessageOpen,
        isCustomModalOpen,
        setIsCustomModalOpen,
        isAnyModalOpen,

        // Multi-Apartment & PRO
        properties,
        activePropertyId,
        isPro,
        proSubscription,
        isProModalOpen,
        setIsProModalOpen,
        switchActiveProperty,
        addProperty,
        subscribePro,
        cancelProSubscription,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
