import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Video,
  Phone,
  Paperclip,
  Send,
  Plus,
  Users,
  CheckCheck,
  Search,
  FileText,
  Image as ImageIcon,
  FileCode,
  FileSpreadsheet,
  X,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Camera,
  Share2,
  AlertTriangle,
  Download,
  Building,
  Radio,
  Clock,
  HeartHandshake,
  ShoppingBag,
  MessageSquare,
  Sparkles,
  Lightbulb,
  Smile,
  MoreHorizontal,
  Pencil,
  Trash2,
  Check,
  ChevronDown,
  Copy,
  Crown,
  ShieldCheck,
  UserMinus,
  UserPlus,
  Hand,
  Vote,
  Info,
  Volume2,
  VolumeX,
  LogOut,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { api } from "../services/api";
import { CommunityMessage, CommunityChannel } from "../types";
import { formatMessageTime, sanitizeText, isSafeUrl } from "../lib/security";

// İzin verilen güvenli dosya tipleri (kodlama/çalıştırılabilir dosyalar YASAK)
const ALLOWED_EXTENSIONS = [
  ".pdf",
  ".docx",
  ".doc",
  ".txt",
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
];

// WhatsApp Hızlı Tepki Emojileri
const QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

// Kapsamlı WhatsApp Tarzı Emoji Paketi & Kategorileri
interface EmojiCategory {
  id: string;
  name: string;
  icon: string;
  emojis: string[];
}

const WHATSAPP_EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    id: 'smileys',
    name: 'Yüzler & Duygular',
    icon: '😃',
    emojis: [
      '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
      '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😋',
      '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐',
      '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌',
      '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧',
      '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐',
      '😕', '😟', '🙁', '😮', '😯', '😲', '😳', '🥺', '😦', '😧',
      '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓',
      '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀'
    ]
  },
  {
    id: 'gestures',
    name: 'El & Jestler',
    icon: '👍',
    emojis: [
      '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞',
      '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍',
      '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝',
      '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂',
      '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅'
    ]
  },
  {
    id: 'hearts',
    name: 'Kalpler & Semboller',
    icon: '❤️',
    emojis: [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
      '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '💯',
      '🔥', '✨', '🌟', '💫', '💥', '💢', '💦', '💨', '💬', '💭',
      '💤', '🔔', '🔕', '📢', '📣', '✅', '❌', '🆗', '🆙', '🆒',
      '🆕', '🆓', '⚠️', '⛔', '🚫', '🔴', '🟢', '🔵', '⚪', '⚫'
    ]
  },
  {
    id: 'places',
    name: 'Site, Ev & Araçlar',
    icon: '🏠',
    emojis: [
      '🏠', '🏡', '🏢', '🏣', '🏤', '🏥', '🏦', '🏨', '🏩', '🏪',
      '🏫', '🏬', '🏭', '🏯', '🏰', '💒', '🗼', '🗽', '⛪', '🕌',
      '🚪', '🛗', '🪟', '🔑', '🗝️', '📦', '🛒', '💡', '🔦', '🏮',
      '🧱', '🪵', '🔧', '🔨', '🛠️', '🪚', '🪛', '🧰', '🚰', '🚿',
      '🚗', '🚕', '🚙', '🚌', '🚎', '🚓', '🚑', '🚒', '🚚', '🚲'
    ]
  },
  {
    id: 'food',
    name: 'Yemek & Doğa',
    icon: '☕',
    emojis: [
      '☕', '🍵', '🧃', '🥤', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃',
      '🍕', '🍔', '🍟', '🌭', '🥪', '🥙', '🍳', '🍞', '🥐', '🥨',
      '🍰', '🎂', '🧁', '🍦', '🍨', '🍩', '🍪', '🍫', '🍬', '🍿',
      '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍒', '🍑',
      '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐯', '🦁',
      '🌸', '🌹', '🌺', '🌻', '🌼', '🌷', '🌱', '🌿', '☘️', '🍀',
      '☀️', '🌤️', '⛅', '🌥️', '☁️', '🌦️', '🌧️', '⛈️', '🌩️', '⚡'
    ]
  }
];

interface SharedAttachment {
  name: string;
  type: "image" | "pdf" | "word" | "txt";
  size: string;
  url?: string;
  dataUrl?: string;
}

// Görselleri hafifleterek Data URL formatına dönüştürme (Hızlı yükleme ve anında önizleme)
const compressAndReadImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_DIM = 1200;
        let w = img.width;
        let h = img.height;

        if (w > h && w > MAX_DIM) {
          h = Math.round((h * MAX_DIM) / w);
          w = MAX_DIM;
        } else if (h > MAX_DIM) {
          w = Math.round((w * MAX_DIM) / h);
          h = MAX_DIM;
        }

        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, w, h);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        resolve(dataUrl);
      };
      img.onerror = () => resolve((e.target?.result as string) || "");
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
};

// Gerçek Apartman ve Site Toplantı Çeşitleri
export interface MeetingType {
  id: 'general' | 'emergency' | 'block' | 'voice';
  title: string;
  badge: string;
  icon: string;
  description: string;
  agenda: string;
  quorum: string;
}

export const REAL_MEETING_TYPES: MeetingType[] = [
  {
    id: 'general',
    title: 'Olağan / Olağanüstü Genel Kurul',
    badge: 'Resmi Karar Yetkili',
    icon: '🏛️',
    description: 'Yıllık bütçe, aidat artış oranı, yönetim kurulu seçimi ve resmi karar defteri oylaması.',
    agenda: '2026 Yılı Tahmini Bütçe ve Aidat Belirleme Görüşmesi',
    quorum: '%51 Kat Malik Çoğunluğu',
  },
  {
    id: 'emergency',
    title: 'Acil Durum & Onarım Toplantısı',
    badge: 'Acil Çağrı',
    icon: '⚡',
    description: 'Bina asansör arızası, su taşkını, çatı izolasyonu veya jeneratör revizyonu acil kararları.',
    agenda: 'A Blok Ana Hidrofor ve Su Tesisatı Patlağı Acil Onarım Teklifleri',
    quorum: 'Acil Durum Çoğunluğu',
  },
  {
    id: 'block',
    title: 'Blok & Komşu İstişare Toplantısı',
    badge: 'Sosyal & Yaşam',
    icon: '👥',
    description: 'Otopark düzeni, evcil hayvan kuralları, çocuk oyun parkı, güvenlik ve peyzaj düzenlemesi.',
    agenda: 'Kapalı Otopark Numaralandırması ve Misafir Araç Giriş Kuralları',
    quorum: 'Gönüllü Sakin Katılımı',
  },
  {
    id: 'voice',
    title: 'Canlı Ses Odası (Walkie-Talkie)',
    badge: 'Hızlı Sesli',
    icon: '🎙️',
    description: 'Kamera açmadan hızlıca komşularla sesli olarak fikir alışverişi yapma ve anlık danışma odası.',
    agenda: 'Bina Akşam Güvenlik & Işıklandırma Hızlı İstişaresi',
    quorum: 'Açık Katılım',
  }
];

// Gerçek Canlı Karar Oylaması Tipi
export interface MeetingLiveVote {
  id: string;
  topic: string;
  yesCount: number;
  noCount: number;
  votedUserChoice: 'YES' | 'NO' | null;
  createdBy: string;
  createdAt: string;
}

// WhatsApp Tarzı Kanal & Grup Üyeleri
export interface ChannelMember {
  id: string;
  name: string;
  apartmentNo: string;
  role: 'ADMIN' | 'AUDITOR' | 'RESIDENT';
  avatarBg: string;
  phone?: string;
  isOnline?: boolean;
}

export const CommunityChatScreen: React.FC = () => {
  const {
    user,
    site,
    siteSettings,
    channels,
    activeChannelId,
    setActiveChannelId,
    setIsCustomModalOpen,
  } = useApp();

  if (!user) return null;

  // 'list' = Sohbetler ve Kanallar Listesi, 'chat' = Seçili Sohbet Odası
  const [currentView, setCurrentView] = useState<"list" | "chat">("list");
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showAttachDrawer, setShowAttachDrawer] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeEmojiTab, setActiveEmojiTab] = useState('smileys');
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingMessage, setEditingMessage] = useState<CommunityMessage | null>(null);
  const [selectedMessageForAction, setSelectedMessageForAction] = useState<CommunityMessage | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<CommunityMessage | null>(null);
  const [isDeletingMessage, setIsDeletingMessage] = useState(false);
  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTouchStart = (msg: CommunityMessage) => {
    longPressTimeoutRef.current = setTimeout(() => {
      setSelectedMessageForAction(msg);
      if (navigator.vibrate) {
        try { navigator.vibrate(35); } catch {}
      }
    }, 400);
  };

  const handleTouchEnd = () => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
  };

  const handleTouchMove = () => {
    handleTouchEnd();
  };

  // WhatsApp Kuralı: Bir kişi bir mesaja yalnızca TEK BİR tepki verebilir (Değiştirme / Kaldırma)
  const handleToggleReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId) return msg;
        const currentReactions: { [key: string]: string[] } = {};
        let wasAlreadyThisEmoji = false;

        // Önce kullanıcının mevcut tüm tepkilerini tespit edip diğerlerinden temizleyelim
        if (msg.reactions) {
          Object.entries(msg.reactions).forEach(([em, users]) => {
            const hasUser = users.includes(user.id);
            if (hasUser && em === emoji) {
              wasAlreadyThisEmoji = true;
            }
            // Kullanıcıyı bu emojinin listesinden çıkar
            const filteredUsers = users.filter((uid) => uid !== user.id);
            if (filteredUsers.length > 0) {
              currentReactions[em] = filteredUsers;
            }
          });
        }

        // Eğer kullanıcı daha önce AYNI emojiyi vermemişse, yeni emojiyi ekle (farklıysa değiştirir)
        if (!wasAlreadyThisEmoji) {
          if (!currentReactions[emoji]) {
            currentReactions[emoji] = [];
          }
          currentReactions[emoji].push(user.id);
        }

        return { ...msg, reactions: currentReactions };
      })
    );
    setSelectedMessageForAction(null);
    setShowReactionPicker(false);
  };

  const [previewImage, setPreviewImage] = useState<{
    url: string;
    authorName?: string;
    time?: string;
  } | null>(null);

  // 1. Gerçek Toplantı Sistemi Durumları
  const [isMeetingOpen, setIsMeetingOpen] = useState(false);
  const [isMeetingSelectModalOpen, setIsMeetingSelectModalOpen] = useState(false);
  const [activeMeetingType, setActiveMeetingType] = useState<MeetingType>(REAL_MEETING_TYPES[0]);
  const [meetingDuration, setMeetingDuration] = useState(0);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [hasRaisedHand, setHasRaisedHand] = useState(false);
  const [isInviteParticipantOpen, setIsInviteParticipantOpen] = useState(false);
  const [meetingParticipants, setMeetingParticipants] = useState<ChannelMember[]>([]);

  // Canlı Karar Oylaması Durumları (Dinamik ve Gerçek)
  const [activeMeetingVote, setActiveMeetingVote] = useState<MeetingLiveVote | null>(null);
  const [isNewVoteModalOpen, setIsNewVoteModalOpen] = useState(false);
  const [newVoteTopicInput, setNewVoteTopicInput] = useState('');

  // Toplantı Süre Sayacı
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isMeetingOpen) {
      interval = setInterval(() => {
        setMeetingDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMeetingOpen]);

  // 2. WhatsApp Tarzı Grup Bilgisi & Gerçek Veritabanı Kullanıcı Yönetimi
  const [isGroupInfoOpen, setIsGroupInfoOpen] = useState(false);
  const [channelMembers, setChannelMembers] = useState<ChannelMember[]>(() => [
    {
      id: user.id,
      name: user.name,
      apartmentNo: user.apartmentNo || '—',
      role: user.role === 'ADMIN' ? 'ADMIN' : 'RESIDENT',
      avatarBg: 'from-indigo-600 to-indigo-700',
      phone: (user as any).phone || (user as any).emailOrPhone || '',
      isOnline: true,
    }
  ]);

  // Gerçek Üyeleri API'den yükle
  const loadRealMembers = async () => {
    try {
      const realMems = await api.getCommunityMembers();
      if (realMems && realMems.length > 0) {
        const colors = [
          'from-indigo-600 to-indigo-700',
          'from-emerald-500 to-teal-600',
          'from-blue-500 to-indigo-600',
          'from-purple-500 to-violet-600',
          'from-amber-500 to-amber-600',
        ];
        setChannelMembers(
          realMems.map((m, idx) => ({
            id: m.id,
            name: m.name,
            apartmentNo: m.apartmentNo || '—',
            role: m.role === 'ADMIN' ? 'ADMIN' : 'RESIDENT',
            avatarBg: colors[idx % colors.length],
            phone: m.emailOrPhone,
            isOnline: m.id === user.id || !!m.isOnline,
          }))
        );
      }
    } catch (e) {
      console.warn('Üyeler yüklenirken hata:', e);
    }
  };

  useEffect(() => {
    loadRealMembers();
  }, [user.id]);

  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberApt, setNewMemberApt] = useState('');
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [selectedMemberForAction, setSelectedMemberForAction] = useState<ChannelMember | null>(null);
  const [memberToRemove, setMemberToRemove] = useState<ChannelMember | null>(null);
  const [isConfirmLeaveGroupOpen, setIsConfirmLeaveGroupOpen] = useState(false);

  // Modallardan herhangi biri açıkken alt menüyü (BottomNav) arkada bırak / gizle
  const hasLocalModalOpen = Boolean(
    isMeetingSelectModalOpen ||
    isMeetingOpen ||
    isGroupInfoOpen ||
    isAddMemberModalOpen ||
    isInviteParticipantOpen ||
    isNewVoteModalOpen ||
    previewImage ||
    selectedMessageForAction ||
    selectedMemberForAction ||
    memberToRemove ||
    isConfirmLeaveGroupOpen ||
    messageToDelete ||
    showAttachDrawer
  );

  useEffect(() => {
    setIsCustomModalOpen(hasLocalModalOpen);
    return () => {
      setIsCustomModalOpen(false);
    };
  }, [hasLocalModalOpen, setIsCustomModalOpen]);

  // WhatsApp Tarzı Yönetici Yapma / Alma
  const handleToggleMemberAdmin = async (memberId: string) => {
    const target = channelMembers.find((m) => m.id === memberId);
    if (!target) return;
    const newRole: ChannelMember['role'] = target.role === 'ADMIN' ? 'RESIDENT' : 'ADMIN';
    setChannelMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
    );
    setSelectedMemberForAction(null);
    try {
      await api.updateMemberRole(memberId, newRole === 'ADMIN' ? 'ADMIN' : 'USER');
    } catch (e) {
      console.warn('Rol güncellenemedi:', e);
    }
  };

  // WhatsApp Tarzı Gruptan Çıkarma (Pencere Onayı Yerine WhatsApp Modalı Kullanır)
  const executeRemoveMember = async (member: ChannelMember) => {
    setChannelMembers((prev) => prev.filter((m) => m.id !== member.id));
    setMemberToRemove(null);
    setSelectedMemberForAction(null);
    setMessages((prev) => [
      ...prev,
      {
        id: 'sys-' + Date.now(),
        channelId: activeChannelId,
        userId: 'system',
        content: `ℹ️ ${member.name} gruptan çıkarıldı.`,
        isMine: false,
        canDelete: false,
        createdAt: new Date().toISOString(),
        author: {
          id: 'system',
          name: 'Sistem',
          apartmentNo: '',
        }
      }
    ]);
    try {
      await api.removeMemberFromSite(member.id);
    } catch (e) {
      console.warn('Üye çıkarılamadı:', e);
    }
  };

  // WhatsApp Tarzı Gruba Katılımcı Ekleme
  const handleAddCustomMember = () => {
    if (!newMemberName.trim()) return;
    const colors = [
      'from-indigo-600 to-indigo-700',
      'from-emerald-500 to-teal-600',
      'from-blue-500 to-indigo-600',
      'from-purple-500 to-violet-600',
      'from-amber-500 to-amber-600',
    ];
    const newMember: ChannelMember = {
      id: 'res-' + Date.now(),
      name: newMemberName.trim(),
      apartmentNo: newMemberApt.trim() || '—',
      role: 'RESIDENT',
      avatarBg: colors[Math.floor(Math.random() * colors.length)],
      isOnline: true,
    };
    setChannelMembers((prev) => [...prev, newMember]);
    setNewMemberName('');
    setNewMemberApt('');
    setIsAddMemberModalOpen(false);
    setMessages((prev) => [
      ...prev,
      {
        id: 'sys-' + Date.now(),
        channelId: activeChannelId,
        userId: 'system',
        content: `✅ ${newMember.name} (Daire ${newMember.apartmentNo}) gruba eklendi.`,
        isMine: false,
        canDelete: false,
        createdAt: new Date().toISOString(),
        author: {
          id: 'system',
          name: 'Sistem',
          apartmentNo: '',
        }
      }
    ]);
  };

  // Gerçek Toplantı Başlatma
  const handleStartRealMeeting = (type: MeetingType) => {
    setActiveMeetingType(type);
    setIsMeetingSelectModalOpen(false);
    setIsMeetingOpen(true);
    setMeetingDuration(0);
    setActiveMeetingVote(null);
    const myParticipant: ChannelMember = {
      id: user.id,
      name: user.name,
      apartmentNo: user.apartmentNo || '—',
      role: user.role === 'ADMIN' ? 'ADMIN' : 'RESIDENT',
      avatarBg: 'from-indigo-600 to-indigo-700',
      isOnline: true,
    };
    setMeetingParticipants([myParticipant]);
    setMessages((prev) => [
      ...prev,
      {
        id: 'meet-' + Date.now(),
        channelId: activeChannelId,
        userId: user.id,
        content: `🟢 ${type.icon} CANLI TOPLANTI BAŞLADI: "${type.title}"\nGündem: ${type.agenda}\nKatılmak için üstteki "Toplantı" butonuna dokunun.`,
        isMine: true,
        canDelete: true,
        createdAt: new Date().toISOString(),
        author: {
          id: user.id,
          name: user.name,
          apartmentNo: user.apartmentNo || '',
        }
      }
    ]);
  };

  // Dosya Eki Durumu
  const [pendingAttachment, setPendingAttachment] =
    useState<SharedAttachment | null>(null);
  const [attachError, setAttachError] = useState("");

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Kanal seçildiğinde mesajları yükle
  useEffect(() => {
    if (activeChannelId) {
      api.getMessages(activeChannelId).then((data) => {
        setMessages(data);
        setTimeout(() => {
          chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      });
    }
  }, [activeChannelId]);

  const activeChannel =
    channels.find((c) => c.id === activeChannelId) || channels[0];

  // Kanal açma
  const handleOpenChannel = (channelId: string) => {
    setActiveChannelId(channelId);
    setCurrentView("chat");
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileAccept, setFileAccept] = useState<string>(
    ".pdf,.doc,.docx,.txt,image/*",
  );

  // Gerçek Cihaz Dosyası Seçildiğinde Çalışır
  const handleRealFileSelected = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Güvenlik doğrulaması: uzantıyı kontrol et
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      alert(
        "⚠️ Güvenlik Uyarısı:\nYalnızca kodlama içermeyen dosyalar (.pdf, .docx, .doc, .txt ve görseller) yüklenebilir.",
      );
      e.target.value = "";
      return;
    }

    // Dosya boyutunu hesapla
    let formattedSize = `${(file.size / 1024).toFixed(1)} KB`;
    if (file.size >= 1024 * 1024) {
      formattedSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    }

    let fileType: SharedAttachment["type"] = "txt";
    const isImg =
      file.type.startsWith("image/") ||
      [".jpg", ".jpeg", ".png", ".webp"].includes(ext);
    if (isImg) {
      fileType = "image";
    } else if (ext === ".pdf") {
      fileType = "pdf";
    } else if ([".docx", ".doc"].includes(ext)) {
      fileType = "word";
    }

    let dataUrl: string | undefined = undefined;
    if (isImg) {
      dataUrl = await compressAndReadImage(file);
    }

    setPendingAttachment({
      name: file.name,
      type: fileType,
      size: formattedSize,
      url: dataUrl || (isImg ? URL.createObjectURL(file) : undefined),
      dataUrl,
    });

    setShowAttachDrawer(false);
    e.target.value = "";
  };

  const triggerFilePicker = (acceptTypes: string) => {
    setFileAccept(acceptTypes);
    setShowAttachDrawer(false);
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 50);
  };

  // Mesaj Düzenleme Modunu Başlatma
  const handleStartEdit = (msg: CommunityMessage) => {
    setEditingMessage(msg);
    setInputText(msg.content);
    setSelectedMessageForAction(null);
    setShowEmojiPicker(false);
    setShowAttachDrawer(false);
  };

  // Mesaj Düzenlemeyi İptal Etme
  const handleCancelEdit = () => {
    setEditingMessage(null);
    setInputText("");
  };

  // Mesaj Silme (Kullanıcı kendi mesajını veya Admin/Yetkili silebilir)
  const handleDeleteMessage = async (msgId: string) => {
    setIsDeletingMessage(true);
    const backupMessages = [...messages];
    // İyimser arayüz güncellemesi (Mesajı anında listeden çıkar)
    setMessages((prev) => prev.filter((m) => m.id !== msgId));
    setMessageToDelete(null);
    setSelectedMessageForAction(null);

    try {
      const ok = await api.deleteMessage(msgId);
      if (!ok) {
        setMessages(backupMessages);
        alert("Mesaj silinemedi.");
      }
    } catch (err: any) {
      console.error("Mesaj silinemedi:", err);
      // Mesaj sunucuda zaten yoksa veya 404 ise sorun yok, silinmiş kabul ediyoruz
      if (!err?.message?.includes("404") && !err?.message?.includes("bulunamadı")) {
        setMessages(backupMessages);
        alert("Mesaj silinirken bir sorun oluştu.");
      }
    } finally {
      setIsDeletingMessage(false);
    }
  };

  // Emojiyi imleç/metin sonuna ekleme
  const handleInsertEmoji = (emoji: string) => {
    setInputText((prev) => prev + emoji);
  };

  // Mesaj Gönderme / Düzenleme Kaydetme
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanContent = sanitizeText(inputText);

    // Eğer Düzenleme Modundaysa (PATCH)
    if (editingMessage) {
      if (!cleanContent.trim()) return;
      setIsSending(true);
      try {
        const ok = await api.editMessage(editingMessage.id, cleanContent.trim());
        if (ok) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === editingMessage.id
                ? { ...m, content: cleanContent.trim(), isEdited: true }
                : m,
            ),
          );
        }
        setEditingMessage(null);
        setInputText("");
      } catch (err) {
        console.error("Mesaj düzenlenemedi:", err);
        alert("Mesaj düzenlenirken bir sorun oluştu.");
      } finally {
        setIsSending(false);
      }
      return;
    }

    if (!cleanContent.trim() && !pendingAttachment) return;

    setIsSending(true);
    try {
      let finalContent = cleanContent.trim();
      const attach = pendingAttachment;

      if (attach && attach.type !== "image") {
        finalContent = finalContent
          ? `${finalContent}\n[Ek: ${attach.name} (${attach.size})]`
          : `[Ek Paylaşıldı]: ${attach.name} (${attach.size})`;
      }

      const newMsg = await api.sendMessage(
        activeChannelId,
        finalContent,
        user,
        attach?.dataUrl,
      );
      setMessages((prev) => [...prev, newMsg]);
      setInputText("");
      setPendingAttachment(null);
      setShowEmojiPicker(false);
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  // Kanal ikonunu getirme
  const getChannelIcon = (slug: string) => {
    switch (slug) {
      case "yardimlasma":
        return <HeartHandshake className="w-5 h-5 text-indigo-600" />;
      case "ikinci-el":
        return <ShoppingBag className="w-5 h-5 text-purple-600" />;
      case "genel":
        return <MessageSquare className="w-5 h-5 text-blue-600" />;
      case "evcil-hayvanlar":
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      case "oneri":
        return <Lightbulb className="w-5 h-5 text-emerald-600" />;
      default:
        return <Users className="w-5 h-5 text-indigo-600" />;
    }
  };

  // Arama filtreli kanallar
  const filteredChannels = channels.filter((ch) =>
    ch.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8f9fd] overflow-hidden select-none">
      {/* ========================================================= */}
      {/* 1. GÖRÜNÜM: SOHBETLER VE KANALLAR LİSTESİ (Sohbet Ana Sayfası) */}
      {/* ========================================================= */}
      {currentView === "list" && (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Üst Başlık & Canlı Toplantı Bildirimi */}
          <div className="px-5 pt-3 pb-3 bg-white border-b border-slate-100 shrink-0 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Komşular & Sohbet
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  {site?.name || "Site"} Sakinleri İletişim Ağı
                </p>
              </div>

              {/* Canlı Toplantı Butonu */}
              <button
                onClick={() => setIsMeetingOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-indigo-50 border border-indigo-200/80 text-indigo-700 font-bold text-xs hover:bg-indigo-100 transition-all active-bounce shadow-2xs"
              >
                <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                <span>Site Toplantısı</span>
              </button>
            </div>

            {/* Arama Çubuğu */}
            <div className="relative flex items-center bg-slate-100/90 rounded-2xl px-3.5 py-2">
              <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Grup veya konu ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Kanallar Listesi */}
          <div className="flex-1 overflow-y-auto smooth-scroll px-4 py-3 space-y-2.5">
            {filteredChannels.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-xs text-center space-y-1.5">
                <Users className="w-8 h-8 text-slate-300 mx-auto" />
                <h4 className="font-bold text-xs text-slate-700">
                  Henüz sohbet grubu bulunmuyor.
                </h4>
                <p className="text-[11px] text-slate-400">
                  Yönetim tarafından yeni kanallar oluşturulduğunda burada
                  görünecektir.
                </p>
              </div>
            ) : (
              filteredChannels.map((channel) => {
                const isActive = activeChannelId === channel.id;

                return (
                  <div
                    key={channel.id}
                    onClick={() => handleOpenChannel(channel.id)}
                    className="w-full bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs hover:border-indigo-200 flex items-center justify-between cursor-pointer transition-all active-bounce group"
                  >
                    <div className="flex items-center space-x-3.5 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50/70 border border-indigo-100/80 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        {getChannelIcon(channel.slug)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-slate-900 text-sm truncate">
                            {channel.name}
                          </h3>
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded-md font-medium shrink-0">
                            {channel.residentCount || 24} daire
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5 font-normal">
                          {channel.description ||
                            "Komşularınızla mesajlaşın ve yardımlaşın"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 text-slate-400 ml-2 shrink-0">
                      <span className="text-[10px] text-slate-400">
                        Görüntüle
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                    </div>
                  </div>
                );
              })
            )}

            {/* Bilgilendirme Kartı */}
            <div className="p-3.5 bg-gradient-to-br from-indigo-50/70 to-purple-50/70 rounded-2xl border border-indigo-100/60 flex items-start space-x-3">
              <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs shrink-0 mt-0.5">
                <Video className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <h4 className="font-bold text-slate-900">
                  Online Komşu & Yönetim Toplantıları
                </h4>
                <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                  Apartman toplantılarına uygulama üzerinden görüntülü veya
                  sesli bağlanabilir, kararları oylayabilirsiniz.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. GÖRÜNÜM: SEÇİLEN KANALIN SOHBET ODASI (Uygulamayla Bütünleşik) */}
      {/* ========================================================= */}
      {currentView === "chat" && (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* WhatsApp Tarzı Üst Başlık (Grup Bilgisi ve Toplantı Entegre) */}
          <div className="px-3.5 py-2 bg-[#f0f2f5] border-b border-slate-200/90 shadow-2xs flex items-center justify-between shrink-0 z-30">
            <div className="flex items-center space-x-2.5 min-w-0">
              <button
                onClick={() => setCurrentView("list")}
                className="p-1 -ml-1 rounded-full text-[#00a884] hover:bg-slate-200/60 transition-colors flex items-center"
                title="Geri Dön"
              >
                <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
              </button>

              {/* Tıklandığında WhatsApp Grup Bilgisi (Group Info) Açılır */}
              <div
                onClick={() => setIsGroupInfoOpen(true)}
                className="flex items-center space-x-2.5 min-w-0 cursor-pointer hover:opacity-85 transition-opacity"
                title="Grup Bilgisi ve Katılımcıları Gör"
              >
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200/80 flex items-center justify-center shrink-0 shadow-2xs font-bold text-xs">
                  {getChannelIcon(activeChannel.slug)}
                </div>

                <div className="min-w-0">
                  <h3 className="font-semibold text-[#111b21] text-[13.5px] truncate leading-tight flex items-center space-x-1">
                    <span>{activeChannel.name}</span>
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                  </h3>
                  <p className="text-[10.5px] text-slate-500 font-normal truncate">
                    {channelMembers.length} katılımcı • Bilgi için dokunun
                  </p>
                </div>
              </div>
            </div>

            {/* Toplantı & Grup Bilgisi Butonları */}
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => setIsMeetingSelectModalOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#00a884]/10 hover:bg-[#00a884]/20 text-[#00a884] border border-[#00a884]/25 transition-all text-xs font-semibold active-bounce shadow-2xs"
                title="Canlı Toplantı Başlat / Katıl"
              >
                <Video className="w-4 h-4 text-[#00a884]" />
                <span className="text-[11px]">Toplantı</span>
              </button>

              <button
                onClick={() => setIsGroupInfoOpen(true)}
                className="p-2 rounded-full hover:bg-slate-200/60 text-slate-600 transition-colors"
                title="Katılımcılar & Yöneticiler"
              >
                <Users className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* Mesaj Zaman Çizelgesi (Modern & Sade Zemin) */}
          <div
            className="flex-1 overflow-y-auto smooth-scroll px-3.5 py-3 space-y-3 relative bg-slate-100/70"
            onClick={() => selectedMessageForAction && setSelectedMessageForAction(null)}
          >
            {/* Tarih Ayracı */}
            <div className="flex justify-center my-1 sticky top-1 z-20">
              <span className="bg-white/95 backdrop-blur-xs text-slate-600 text-[11px] font-medium px-3 py-0.5 rounded-full shadow-xs select-none border border-slate-200/70">
                Bugün
              </span>
            </div>

            {messages.map((msg) => {
              const isMine = Boolean(msg.isMine || msg.userId === user.id || msg.author?.id === user.id);
              const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
              const canDelete = Boolean(msg.canDelete || isMine || isAdmin);

              const cleanText = msg.content?.trim() || '';
              const isOnlyAttachmentLabel = cleanText.startsWith('[Ek Paylaşıldı]:') || cleanText.startsWith('[Ek:') || cleanText === 'Paylaşım';
              const displayContent = isOnlyAttachmentLabel && msg.imageUrl ? '' : cleanText;

              if (isMine) {
                // Giden Mesaj (Sağa Yaslı, Hakiki WhatsApp Yeşil Balon #d9fdd3)
                const hasReactions = msg.reactions && Object.keys(msg.reactions).length > 0;
                return (
                  <div key={msg.id} className={`flex justify-end pl-10 group relative ${hasReactions ? 'mb-3' : 'mb-1'}`}>
                    <div className="relative flex flex-col items-end">
                      {/* Yalnızca Görsel Varsa: Çerçevesiz Tam Görsel + Yüzen Saat */}
                      {msg.imageUrl && !displayContent ? (
                        <div
                          onTouchStart={() => handleTouchStart(msg)}
                          onTouchMove={handleTouchMove}
                          onTouchEnd={handleTouchEnd}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            setSelectedMessageForAction(msg);
                          }}
                          className="relative rounded-2xl overflow-hidden shadow-[0_1px_1px_rgba(11,20,26,0.16)] max-w-[260px] group/bubble cursor-pointer"
                        >
                          <img
                            src={msg.imageUrl}
                            alt="Paylaşılan görsel"
                            className="w-full max-h-64 object-cover block hover:opacity-95 transition-opacity"
                            onClick={() =>
                              setPreviewImage({
                                url: msg.imageUrl!,
                                authorName: 'Siz',
                                time: formatMessageTime(msg.createdAt),
                              })
                            }
                          />
                          {/* Yüzen Zaman Kapsülü */}
                          <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-full flex items-center space-x-1 select-none shadow-xs">
                            {msg.isEdited && <span className="text-[9px] opacity-75 italic mr-0.5">(düzenlendi)</span>}
                            <span>{formatMessageTime(msg.createdAt)}</span>
                            <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                          </div>

                          {/* WhatsApp Hover Çıkıntısı */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMessageForAction(msg);
                            }}
                            className="opacity-70 hover:opacity-100 sm:opacity-0 sm:group-hover/bubble:opacity-100 absolute top-1.5 right-1.5 p-1 rounded-full bg-black/40 hover:bg-black/60 text-white transition-opacity shadow-xs"
                            title="Seçenekler"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        /* Metinli Şık Sohbet Balonu (WhatsApp Gerçek Açık Yeşil Balon) */
                        <div
                          onTouchStart={() => handleTouchStart(msg)}
                          onTouchMove={handleTouchMove}
                          onTouchEnd={handleTouchEnd}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            setSelectedMessageForAction(msg);
                          }}
                          className="relative bg-[#d9fdd3] text-[#111b21] rounded-2xl rounded-tr-[2px] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] border border-[#d1f4cb]/60 w-fit max-w-[82%] group/bubble select-text"
                        >
                          {/* Varsa Tepeye Sıfır Çerçevesiz Görsel */}
                          {msg.imageUrl && (
                            <img
                              src={msg.imageUrl}
                              alt="Paylaşılan görsel"
                              className="w-full max-w-[260px] max-h-56 object-cover block cursor-pointer hover:opacity-95 transition-opacity rounded-t-2xl"
                              onClick={() =>
                                setPreviewImage({
                                  url: msg.imageUrl!,
                                  authorName: 'Siz',
                                  time: formatMessageTime(msg.createdAt),
                                })
                              }
                            />
                          )}

                          {/* Metin ve Sağ Alt WhatsApp Zamanı */}
                          <div className="px-3 pt-1.5 pb-1.5">
                            {displayContent && (
                              <p className="text-[13.5px] leading-[19px] text-[#111b21] break-words whitespace-pre-wrap font-normal">
                                {displayContent}
                                <span className="text-[10.5px] text-slate-500/80 inline-flex items-center space-x-0.5 float-right mt-1 ml-2.5 select-none shrink-0 font-normal">
                                  {msg.isEdited && <span className="text-[9.5px] italic mr-0.5">(düzenlendi)</span>}
                                  <span>{formatMessageTime(msg.createdAt)}</span>
                                  <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb] ml-0.5" />
                                </span>
                              </p>
                            )}
                          </div>

                          {/* WhatsApp Hover Menü Butonu */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMessageForAction(msg);
                            }}
                            className="opacity-70 hover:opacity-100 sm:opacity-0 sm:group-hover/bubble:opacity-100 absolute top-1 right-1 p-0.5 rounded-full bg-slate-200/50 hover:bg-slate-300/60 text-slate-600 transition-opacity"
                            title="Seçenekler"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>

                          {/* WhatsApp Sağ Üst Balon Kuyruğu (Notch) */}
                          <svg className="absolute -top-0 -right-2 w-2 h-3 text-[#d9fdd3] fill-current pointer-events-none drop-shadow-[0.5px_0.5px_0.5px_rgba(11,20,26,0.06)]" viewBox="0 0 10 12">
                            <path d="M0,0 L10,0 C6,3 2,7 0,12 Z" />
                          </svg>
                        </div>
                      )}

                      {/* WhatsApp Tarzı Tepkiler (Reactions Pill) */}
                      {hasReactions && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMessageForAction(msg);
                          }}
                          className="mt-[-8px] mr-1 z-10 flex items-center space-x-1 bg-white border border-slate-200/90 rounded-full px-2 py-0.5 shadow-xs select-none cursor-pointer hover:bg-slate-50 active:scale-95 transition-all"
                        >
                          {Object.entries(msg.reactions!).map(([emoji, users]) => {
                            const didReact = users.includes(user.id);
                            return (
                              <span
                                key={emoji}
                                className={`text-xs leading-none flex items-center space-x-0.5 ${didReact ? 'bg-emerald-50 text-emerald-700 px-1 py-0.5 rounded-full font-bold ring-1 ring-emerald-300' : 'text-slate-700'}`}
                              >
                                <span>{emoji}</span>
                                {users.length > 1 && (
                                  <span className="text-[10px] text-slate-500 font-bold ml-0.5">{users.length}</span>
                                )}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              // Gelen Mesaj (Sola Yaslı, Hakiki WhatsApp Beyaz Balon)
              const hasIncomingReactions = msg.reactions && Object.keys(msg.reactions).length > 0;
              return (
                <div key={msg.id} className={`flex items-start space-x-2 pr-10 group relative ${hasIncomingReactions ? 'mb-3' : 'mb-1'}`}>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-100 to-teal-50 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs border border-emerald-200/70 mt-0.5 select-none">
                    {msg.author.avatarInitials || msg.author.name.slice(0, 2).toUpperCase()}
                  </div>

                  <div className="relative flex flex-col items-start max-w-[82%]">
                    {/* Yalnızca Görsel Varsa: Çerçevesiz Tam Görsel + Yüzen Saat */}
                    {msg.imageUrl && !displayContent ? (
                      <div
                        onTouchStart={() => handleTouchStart(msg)}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          setSelectedMessageForAction(msg);
                        }}
                        className="relative rounded-2xl overflow-hidden shadow-[0_1px_1px_rgba(11,20,26,0.16)] max-w-[260px] group/bubble cursor-pointer"
                      >
                        <img
                          src={msg.imageUrl}
                          alt="Paylaşılan görsel"
                          className="w-full max-h-64 object-cover block hover:opacity-95 transition-opacity"
                          onClick={() =>
                            setPreviewImage({
                              url: msg.imageUrl!,
                              authorName: msg.author.name,
                              time: formatMessageTime(msg.createdAt),
                            })
                          }
                        />
                        {/* Yüzen Zaman Kapsülü */}
                        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-full flex items-center space-x-1 select-none shadow-xs">
                          {msg.isEdited && <span className="text-[9px] opacity-75 italic mr-0.5">(düzenlendi)</span>}
                          <span>{formatMessageTime(msg.createdAt)}</span>
                        </div>

                        {/* WhatsApp Hover Menü Butonu */}
                        {canDelete && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMessageForAction(msg);
                            }}
                            className="opacity-70 hover:opacity-100 sm:opacity-0 sm:group-hover/bubble:opacity-100 absolute top-1.5 right-1.5 p-1 rounded-full bg-black/40 hover:bg-black/60 text-white transition-opacity shadow-xs"
                            title="Seçenekler"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ) : (
                      /* Metinli Beyaz Balon (Görsel varsa tepeye sıfır oturur) */
                      <div
                        onTouchStart={() => handleTouchStart(msg)}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          setSelectedMessageForAction(msg);
                        }}
                        className="relative bg-white text-[#111b21] rounded-2xl rounded-tl-[2px] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] border border-slate-100 w-fit max-w-full group/bubble select-text"
                      >
                        {/* Varsa Tepeye Sıfır Çerçevesiz Görsel */}
                        {msg.imageUrl && (
                          <img
                            src={msg.imageUrl}
                            alt="Paylaşılan görsel"
                            className="w-full max-w-[260px] max-h-56 object-cover block cursor-pointer hover:opacity-95 transition-opacity rounded-t-2xl"
                            onClick={() =>
                              setPreviewImage({
                                url: msg.imageUrl!,
                                authorName: msg.author.name,
                                time: formatMessageTime(msg.createdAt),
                              })
                            }
                          />
                        )}

                        <div className="px-3 pt-1.5 pb-1.5">
                          {/* Gönderen İsmi (WhatsApp Grup Sohbeti Renkli Başlığı) */}
                          <div className="text-[12px] font-bold text-[#00a884] select-none mb-0.5 flex items-center space-x-1 tracking-tight">
                            <span>{msg.author.name}</span>
                            {msg.author.apartmentNo && (
                              <span className="text-[10px] text-slate-400 font-normal ml-1">
                                ({msg.author.apartmentNo.replace(/\D/g, '') ? `D.${msg.author.apartmentNo.replace(/\D/g, '')}` : msg.author.apartmentNo})
                              </span>
                            )}
                          </div>

                          {displayContent && (
                            <p className="text-[13.5px] leading-[19px] text-[#111b21] break-words whitespace-pre-wrap font-normal">
                              {displayContent}
                              <span className="text-[10.5px] text-slate-400 inline-flex items-center space-x-1 float-right mt-1 ml-2.5 select-none shrink-0 font-normal">
                                {msg.isEdited && <span className="text-[9.5px] italic mr-0.5">(düzenlendi)</span>}
                                <span>{formatMessageTime(msg.createdAt)}</span>
                              </span>
                            </p>
                          )}
                        </div>

                        {/* WhatsApp Hover Menü Butonu */}
                        {canDelete && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMessageForAction(msg);
                            }}
                            className="opacity-70 hover:opacity-100 sm:opacity-0 sm:group-hover/bubble:opacity-100 absolute top-1 right-1 p-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-opacity"
                            title="Seçenekler"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                        )}

                        {/* WhatsApp Sol Üst Balon Kuyruğu (Notch) */}
                        <svg className="absolute -top-0 -left-2 w-2 h-3 text-white fill-current pointer-events-none drop-shadow-[-0.5px_0.5px_0.5px_rgba(11,20,26,0.06)]" viewBox="0 0 10 12">
                          <path d="M10,0 L0,0 C4,3 8,7 10,12 Z" />
                        </svg>
                      </div>
                    )}

                    {/* WhatsApp Tarzı Tepkiler (Reactions Pill) */}
                    {hasIncomingReactions && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMessageForAction(msg);
                        }}
                        className="mt-[-8px] ml-1 z-10 flex items-center space-x-1 bg-white border border-slate-200/90 rounded-full px-2 py-0.5 shadow-xs select-none cursor-pointer hover:bg-slate-50 active:scale-95 transition-all"
                      >
                        {Object.entries(msg.reactions!).map(([emoji, users]) => {
                          const didReact = users.includes(user.id);
                          return (
                            <span
                              key={emoji}
                              className={`text-xs leading-none flex items-center space-x-0.5 ${didReact ? 'bg-emerald-50 text-emerald-700 px-1 py-0.5 rounded-full font-bold ring-1 ring-emerald-300' : 'text-slate-700'}`}
                            >
                              <span>{emoji}</span>
                              {users.length > 1 && (
                                <span className="text-[10px] text-slate-500 font-bold ml-0.5">{users.length}</span>
                              )}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={chatBottomRef} />
          </div>

          {/* Dosya Eki Seçilmişse Önizleme Çubuğu */}
          {pendingAttachment && (
            <div className="px-3.5 py-2 bg-indigo-50/90 border-t border-indigo-100 flex items-center justify-between">
              <div className="flex items-center space-x-2.5 min-w-0">
                {pendingAttachment.type === 'image' && pendingAttachment.url ? (
                  <img
                    src={pendingAttachment.url}
                    alt="Önizleme"
                    className="w-10 h-10 object-cover rounded-lg border border-indigo-200 shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    <FileText className="w-4.5 h-4.5" />
                  </div>
                )}
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-slate-800 truncate block">
                    {pendingAttachment.name}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {pendingAttachment.size} • {pendingAttachment.type === 'image' ? 'Görsel Hazır' : 'Belge'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPendingAttachment(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Gizli Gerçek Cihaz Dosya Seçici Input */}
          <input
            type="file"
            ref={fileInputRef}
            accept={fileAccept}
            onChange={handleRealFileSelected}
            className="hidden"
          />

          {/* Belge ve Görsel Paylaşım Menüsü (WhatsApp Dairesel İkon Izgarası) */}
          {showAttachDrawer && (
            <div className="bg-white px-6 pt-3.5 pb-4 border-t border-slate-100 rounded-t-[28px] shadow-2xl animate-slide-up select-none">
              {/* WhatsApp Drag Handle */}
              <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-4" />

              <div className="grid grid-cols-4 gap-3">
                {/* Belge (PDF & Word) */}
                <div
                  onClick={() => triggerFilePicker('.pdf,application/pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document')}
                  className="flex flex-col items-center cursor-pointer group active:scale-95 transition-transform"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#7f66ff] to-[#5e43f3] text-white flex items-center justify-center shadow-md shadow-[#5e43f3]/25">
                    <FileText className="w-6 h-6 stroke-[2]" />
                  </div>
                  <span className="text-[11.5px] font-medium text-[#111b21] mt-2 text-center">Belge</span>
                </div>

                {/* Fotoğraf / Galeri */}
                <div
                  onClick={() => triggerFilePicker('image/*')}
                  className="flex flex-col items-center cursor-pointer group active:scale-95 transition-transform"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#ab47bc] to-[#8e24aa] text-white flex items-center justify-center shadow-md shadow-[#8e24aa]/25">
                    <ImageIcon className="w-6 h-6 stroke-[2]" />
                  </div>
                  <span className="text-[11.5px] font-medium text-[#111b21] mt-2 text-center">Galeri</span>
                </div>

                {/* Kamera */}
                <div
                  onClick={() => triggerFilePicker('image/*')}
                  className="flex flex-col items-center cursor-pointer group active:scale-95 transition-transform"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#ec407a] to-[#d81b60] text-white flex items-center justify-center shadow-md shadow-[#d81b60]/25">
                    <Camera className="w-6 h-6 stroke-[2]" />
                  </div>
                  <span className="text-[11.5px] font-medium text-[#111b21] mt-2 text-center">Kamera</span>
                </div>

                {/* Not / Metin */}
                <div
                  onClick={() => triggerFilePicker('.txt,text/plain')}
                  className="flex flex-col items-center cursor-pointer group active:scale-95 transition-transform"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#ff9800] to-[#f57c00] text-white flex items-center justify-center shadow-md shadow-[#f57c00]/25">
                    <FileSpreadsheet className="w-6 h-6 stroke-[2]" />
                  </div>
                  <span className="text-[11.5px] font-medium text-[#111b21] mt-2 text-center">Not</span>
                </div>
              </div>
            </div>
          )}

          {/* Mesaj Düzenleme Bilgi Çubuğu */}
          {editingMessage && (
            <div className="px-3.5 py-1.5 bg-amber-50 border-t border-amber-200 flex items-center justify-between animate-slide-up">
              <div className="flex items-center space-x-2 min-w-0">
                <Pencil className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[11px] font-bold text-amber-800 block leading-tight">Mesajı Düzenliyorsunuz</span>
                  <span className="text-[10px] text-amber-600 truncate block max-w-[240px]">{editingMessage.content}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="p-1 rounded-full text-amber-600 hover:bg-amber-100"
                title="İptal Et"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* WhatsApp Tarzı Kapsamlı Emoji Klavyeli Çekmece */}
          {showEmojiPicker && (
            <div className="bg-white border-t border-slate-200 shadow-md animate-slide-up flex flex-col">
              {/* Üst Sekmeler: WhatsApp Kategorileri */}
              <div className="flex items-center justify-between px-3 pt-2 pb-1 border-b border-slate-100 bg-slate-50/70">
                <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none py-1">
                  {WHATSAPP_EMOJI_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveEmojiTab(cat.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                        activeEmojiTab === cat.id
                          ? 'bg-amber-100 text-amber-900 ring-1 ring-amber-300 shadow-2xs'
                          : 'text-slate-600 hover:bg-slate-200/70'
                      }`}
                      title={cat.name}
                    >
                      <span className="text-sm">{cat.icon}</span>
                      <span className="text-[11px] whitespace-nowrap">{cat.name}</span>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200/60 shrink-0 ml-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Seçilen Kategorideki WhatsApp Emojileri Izgarası */}
              <div className="grid grid-cols-8 sm:grid-cols-10 gap-1 p-2 max-h-44 overflow-y-auto">
                {(WHATSAPP_EMOJI_CATEGORIES.find((c) => c.id === activeEmojiTab)?.emojis || []).map((emoji, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleInsertEmoji(emoji)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-lg hover:bg-slate-100 active:scale-90 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* WhatsApp Tarzı Alt Mesaj Yazma Çubuğu */}
          <div className="p-2 bg-[#f0f2f5] border-t border-slate-200/80 shrink-0">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              {/* Beyaz Giriş Kapsülü */}
              <div className="flex-1 flex items-center bg-white rounded-full px-2.5 py-1 shadow-2xs border border-slate-200/80 focus-within:ring-2 focus-within:ring-[#00a884]/20 transition-all">
                {/* Emoji Butonu */}
                <button
                  type="button"
                  onClick={() => {
                    setShowEmojiPicker(!showEmojiPicker);
                    setShowAttachDrawer(false);
                  }}
                  className={`p-1.5 rounded-full transition-colors ${
                    showEmojiPicker ? 'text-[#00a884] bg-emerald-50' : 'text-slate-500 hover:text-slate-700'
                  }`}
                  title="Emoji"
                >
                  <Smile className="w-5 h-5" />
                </button>

                {/* Mesaj Giriş Inputu */}
                <input
                  type="text"
                  placeholder={editingMessage ? 'Mesajı güncelleyin...' : 'Bir mesaj yazın'}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-transparent text-[13.5px] text-[#111b21] placeholder:text-slate-400 focus:outline-none px-2 py-1"
                />

                {/* Dosya / Görsel Ataş Butonu */}
                <button
                  type="button"
                  onClick={() => {
                    setShowAttachDrawer(!showAttachDrawer);
                    setShowEmojiPicker(false);
                  }}
                  className={`p-1.5 rounded-full transition-colors ${
                    showAttachDrawer ? 'text-[#00a884] bg-emerald-50' : 'text-slate-500 hover:text-slate-700'
                  }`}
                  title="Ek Ekle"
                >
                  <Paperclip className="w-5 h-5 -rotate-45" />
                </button>
              </div>

              {/* WhatsApp Gönder Dairesel Butonu */}
              <button
                type="submit"
                disabled={!inputText.trim() && !pendingAttachment}
                className="w-10 h-10 rounded-full bg-[#00a884] hover:bg-[#008f6f] text-white flex items-center justify-center shadow-md shadow-[#00a884]/25 disabled:opacity-40 transition-all shrink-0 active:scale-95"
                title={editingMessage ? 'Kaydet' : 'Gönder'}
              >
                {editingMessage ? (
                  <Check className="w-5 h-5 stroke-[2.5]" />
                ) : (
                  <Send className="w-4.5 h-4.5 -rotate-12 translate-x-0.5 fill-current" />
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3A. GERÇEK TOPLANTI ÇEŞİDİ SEÇME VE BAŞLATMA MODALI */}
      {/* ========================================================= */}
      {isMeetingSelectModalOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in select-none"
          onClick={() => setIsMeetingSelectModalOpen(false)}
        >
          <div
            className="bg-white rounded-t-[28px] sm:rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[85vh] animate-slide-up sm:animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* WhatsApp Drag Handle */}
            <div className="pt-3 pb-1 bg-white">
              <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto" />
            </div>

            {/* Modal Başlığı */}
            <div className="px-5 py-3.5 bg-white border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#00a884]/15 flex items-center justify-center text-[#008069]">
                  <Video className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#111b21]">Canlı Toplantı Başlat</h3>
                  <p className="text-[11px] text-[#667781]">Apartman & Site Toplantı Çeşitleri</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMeetingSelectModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-[#f0f2f5] transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Toplantı Çeşitleri Listesi */}
            <div className="p-4 space-y-2.5 overflow-y-auto flex-1">
              {REAL_MEETING_TYPES.map((type) => {
                const isSelected = activeMeetingType.id === type.id;
                return (
                  <div
                    key={type.id}
                    onClick={() => setActiveMeetingType(type)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#00a884] bg-[#d9fdd3]/25 shadow-xs ring-1 ring-[#00a884]'
                        : 'border-slate-200/80 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2.5">
                        <span className="text-2xl">{type.icon}</span>
                        <div>
                          <h4 className="text-xs font-bold text-[#111b21] leading-tight">{type.title}</h4>
                          <span className="text-[9.5px] font-semibold text-[#008069] bg-[#d9fdd3] px-1.5 py-0.5 rounded-md mt-0.5 inline-block">
                            {type.badge}
                          </span>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-[#00a884] bg-[#00a884]' : 'border-slate-300'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>

                    <p className="text-[11px] text-[#667781] mt-2 leading-relaxed">
                      {type.description}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Yeter Sayı: <strong className="text-slate-700">{type.quorum}</strong></span>
                      <span className="text-[#008069] font-semibold">Oylama Destekli</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Başlat Butonu */}
            <div className="p-4 pb-6 sm:pb-4 bg-white border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleStartRealMeeting(activeMeetingType)}
                className="w-full py-3.5 rounded-2xl bg-[#00a884] hover:bg-[#008f6f] text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-[#00a884]/25 active:scale-95 transition-all cursor-pointer"
              >
                <span>{activeMeetingType.icon}</span>
                <span>{activeMeetingType.title} Başlat</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3B. CANLI VE ÇALIŞAN APARTMAN TOPLANTISI ODASI */}
      {/* ========================================================= */}
      {isMeetingOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 animate-fade-in select-none">
          <div className="bg-slate-900 text-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-800 flex flex-col h-[620px] max-h-[92vh] animate-scale-up">
            {/* Toplantı Üst Bilgisi */}
            <div className="p-3 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2 min-w-0">
                <span className="text-xl shrink-0">{activeMeetingType.icon}</span>
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                    <h3 className="font-bold text-xs text-white truncate">
                      {activeMeetingType.title}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-0.5">
                    <span className="text-emerald-400 font-mono font-semibold">
                      🔴 CANLI {Math.floor(meetingDuration / 60).toString().padStart(2, '0')}:{(meetingDuration % 60).toString().padStart(2, '0')}
                    </span>
                    <span>•</span>
                    <span className="truncate">{activeMeetingType.quorum}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMeetingOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Canlı Karar Oylaması (Tamamen Dinamik ve Kullanıcı Kontrolünde) */}
            {!activeMeetingVote ? (
              <div className="p-3 bg-slate-800/80 border-b border-slate-700/60 shrink-0 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Vote className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">
                      Canlı Karar Oylaması
                    </span>
                    <p className="text-[11px] text-slate-400">Şu anda aktif bir oylama bulunmuyor.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewVoteModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center space-x-1.5 transition-all shadow-sm active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Oylama Başlat</span>
                </button>
              </div>
            ) : (
              <div className="p-3 bg-slate-800/90 border-b border-slate-700/70 shrink-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10.5px] font-bold text-amber-400 uppercase tracking-wide flex items-center">
                    <Vote className="w-3 h-3 mr-1" /> CANLI KARAR OYLAMASI
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-slate-400">
                      Toplam {activeMeetingVote.yesCount + activeMeetingVote.noCount} Oy
                    </span>
                    {(user.role === 'ADMIN' || activeMeetingVote.createdBy === user.id) && (
                      <button
                        type="button"
                        onClick={() => setActiveMeetingVote(null)}
                        className="text-[10px] text-rose-400 hover:text-rose-300 font-semibold underline"
                      >
                        Sonlandır
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-xs font-semibold text-white leading-snug">
                  {activeMeetingVote.topic}
                </p>

                {/* Oylama Butonları */}
                <div className="mt-2 flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (activeMeetingVote.votedUserChoice === 'YES') return;
                      setActiveMeetingVote((prev) => {
                        if (!prev) return null;
                        const hadNo = prev.votedUserChoice === 'NO';
                        return {
                          ...prev,
                          votedUserChoice: 'YES',
                          yesCount: prev.yesCount + 1,
                          noCount: hadNo ? Math.max(0, prev.noCount - 1) : prev.noCount,
                        };
                      });
                    }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center justify-center space-x-1.5 ${
                      activeMeetingVote.votedUserChoice === 'YES'
                        ? 'bg-emerald-600 text-white ring-2 ring-emerald-400 shadow-md'
                        : 'bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/80 border border-emerald-700/60'
                    }`}
                  >
                    <span>👍 Kabul ({activeMeetingVote.yesCount})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (activeMeetingVote.votedUserChoice === 'NO') return;
                      setActiveMeetingVote((prev) => {
                        if (!prev) return null;
                        const hadYes = prev.votedUserChoice === 'YES';
                        return {
                          ...prev,
                          votedUserChoice: 'NO',
                          yesCount: hadYes ? Math.max(0, prev.yesCount - 1) : prev.yesCount,
                          noCount: prev.noCount + 1,
                        };
                      });
                    }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center justify-center space-x-1.5 ${
                      activeMeetingVote.votedUserChoice === 'NO'
                        ? 'bg-rose-600 text-white ring-2 ring-rose-400 shadow-md'
                        : 'bg-rose-950/60 text-rose-300 hover:bg-rose-900/80 border border-rose-700/60'
                    }`}
                  >
                    <span>👎 Red ({activeMeetingVote.noCount})</span>
                  </button>
                </div>

                {/* Canlı Yüzde Çubuğu */}
                {activeMeetingVote.yesCount + activeMeetingVote.noCount > 0 ? (
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden flex mt-2 shadow-inner">
                    <div
                      className="bg-emerald-500 transition-all duration-300"
                      style={{
                        width: `${Math.round((activeMeetingVote.yesCount / (activeMeetingVote.yesCount + activeMeetingVote.noCount)) * 100)}%`,
                      }}
                    />
                    <div
                      className="bg-rose-500 transition-all duration-300"
                      style={{
                        width: `${Math.round((activeMeetingVote.noCount / (activeMeetingVote.yesCount + activeMeetingVote.noCount)) * 100)}%`,
                      }}
                    />
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-500 mt-1 text-center">Henüz oy kullanılmadı, yukarıdan oyunuzu verebilirsiniz.</p>
                )}
              </div>
            )}

            {/* Katılımcı Video / Ses Izgarası (Gerçek Katılımcılar) */}
            <div className="flex-1 p-2.5 grid grid-cols-2 gap-2 overflow-y-auto content-start">
              {meetingParticipants.map((participant) => {
                const isMe = participant.id === user.id;
                const isAdmin = participant.role === 'ADMIN';
                return (
                  <div
                    key={participant.id}
                    className={`relative rounded-2xl bg-slate-800/90 border flex flex-col items-center justify-center p-2.5 text-center overflow-hidden min-h-[125px] ${
                      isMe ? 'border-emerald-500/70 ring-1 ring-emerald-500/30' : 'border-slate-700'
                    }`}
                  >
                    {isMe && isVideoOff ? (
                      <div className="w-11 h-11 rounded-full bg-slate-700 text-slate-300 font-bold flex items-center justify-center text-sm mb-1.5">
                        <VideoOff className="w-5 h-5 text-slate-400" />
                      </div>
                    ) : (
                      <div className={`w-11 h-11 rounded-full bg-gradient-to-tr ${participant.avatarBg || 'from-indigo-600 to-indigo-700'} text-white font-bold flex items-center justify-center text-sm shadow-md mb-1.5 ${
                        isMe && !isMicMuted ? 'ring-2 ring-emerald-400' : ''
                      }`}>
                        {participant.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}

                    <span className="text-xs font-bold text-white truncate max-w-[120px]">
                      {isMe ? `Sen (${participant.name})` : participant.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {isAdmin ? '👑 Yönetici' : `Daire ${participant.apartmentNo}`}
                    </span>

                    {/* Mikrofon Durumu */}
                    <div className="absolute top-2 right-2 p-1 rounded-full bg-black/40 text-white">
                      {isMe ? (
                        isMicMuted ? <MicOff className="w-3.5 h-3.5 text-rose-400" /> : <Mic className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Mic className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </div>

                    {/* El Kaldırma */}
                    {isMe && hasRaisedHand && (
                      <div className="absolute top-2 left-2 bg-amber-400 text-slate-900 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full flex items-center space-x-0.5 shadow-sm animate-bounce">
                        <span>✋</span>
                        <span>Söz İstiyor</span>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Komşu Davet Etme Buton Kartı */}
              <button
                type="button"
                onClick={() => setIsInviteParticipantOpen(true)}
                className="rounded-2xl border-2 border-dashed border-slate-700 hover:border-slate-500 bg-slate-800/40 hover:bg-slate-800/80 p-3 flex flex-col items-center justify-center text-center transition-colors min-h-[125px] group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-slate-800 group-hover:bg-slate-700 text-slate-400 group-hover:text-emerald-400 flex items-center justify-center mb-1.5 transition-colors">
                  <UserPlus className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-300">Komşu Çağır</span>
                <span className="text-[10px] text-slate-500 mt-0.5">Toplantıya davet et</span>
              </button>
            </div>

            {/* Toplantı Alt Kontrol Çubuğu */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-around shrink-0">
              {/* Mikrofon */}
              <button
                type="button"
                onClick={() => setIsMicMuted(!isMicMuted)}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all active:scale-95 ${
                  isMicMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 text-white hover:bg-slate-700'
                }`}
                title="Mikrofon"
              >
                {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Kamera */}
              <button
                type="button"
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all active:scale-95 ${
                  isVideoOff ? 'bg-rose-600 text-white' : 'bg-slate-800 text-white hover:bg-slate-700'
                }`}
                title="Kamera"
              >
                {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </button>

              {/* Söz İste / El Kaldır */}
              <button
                type="button"
                onClick={() => setHasRaisedHand(!hasRaisedHand)}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all active:scale-95 ${
                  hasRaisedHand ? 'bg-amber-500 text-slate-900 shadow-md shadow-amber-500/30' : 'bg-slate-800 text-white hover:bg-slate-700'
                }`}
                title="Söz İste (El Kaldır)"
              >
                <Hand className="w-5 h-5" />
              </button>

              {/* Katılımcı Çağır (Davet Et) */}
              <button
                type="button"
                onClick={() => setIsInviteParticipantOpen(true)}
                className="w-11 h-11 rounded-2xl bg-slate-800 text-white hover:bg-slate-700 flex items-center justify-center transition-all active:scale-95"
                title="Komşu Çağır"
              >
                <UserPlus className="w-5 h-5" />
              </button>

              {/* Ayrıl */}
              <button
                type="button"
                onClick={() => setIsMeetingOpen(false)}
                className="w-11 h-11 rounded-2xl bg-rose-600 text-white hover:bg-rose-700 flex items-center justify-center transition-all active:scale-95 shadow-md shadow-rose-600/30"
                title="Toplantıdan Ayrıl"
              >
                <PhoneOff className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3B-1. YENİ KARAR OYLAMASI BAŞLATMA MODALI */}
      {/* ========================================================= */}
      {isNewVoteModalOpen && (
        <div
          className="fixed inset-0 z-60 bg-black/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in select-none"
          onClick={() => setIsNewVoteModalOpen(false)}
        >
          <div
            className="bg-slate-900 border border-slate-700/80 rounded-t-[28px] sm:rounded-3xl w-full max-w-sm p-5 text-white shadow-2xl animate-slide-up sm:animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* WhatsApp Drag Handle */}
            <div className="w-10 h-1 bg-slate-600 rounded-full mx-auto mb-3" />

            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Vote className="w-4.5 h-4.5 text-amber-400" />
                <h4 className="font-bold text-sm text-white">Yeni Karar Oylaması Başlat</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsNewVoteModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="py-3 space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Oylanacak Karar / Soru *
                </label>
                <textarea
                  rows={3}
                  value={newVoteTopicInput}
                  onChange={(e) => setNewVoteTopicInput(e.target.value)}
                  placeholder="Örn: Asansör bakım sözleşmesinin yenilenmesini onaylıyor musunuz?"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00a884] focus:ring-1 focus:ring-[#00a884]"
                />
              </div>

              <div className="text-[10.5px] text-slate-400 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50 leading-relaxed">
                💡 Katılımcılar <span className="text-[#00a884] font-bold">Kabul</span> veya <span className="text-rose-400 font-bold">Red</span> oyu verebilecektir. Oylar anlık olarak toplanır ve yüzde grafiğinde gösterilir.
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsNewVoteModalOpen(false)}
                className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
              >
                İptal
              </button>
              <button
                type="button"
                disabled={!newVoteTopicInput.trim()}
                onClick={() => {
                  if (!newVoteTopicInput.trim()) return;
                  setActiveMeetingVote({
                    id: 'vote-' + Date.now(),
                    topic: newVoteTopicInput.trim(),
                    yesCount: 0,
                    noCount: 0,
                    votedUserChoice: null,
                    createdBy: user.id,
                    createdAt: new Date().toISOString(),
                  });
                  setNewVoteTopicInput('');
                  setIsNewVoteModalOpen(false);
                }}
                className="flex-1 py-3 rounded-xl bg-[#00a884] hover:bg-[#008f6f] disabled:opacity-50 text-white text-xs font-bold transition-colors shadow-md shadow-[#00a884]/20"
              >
                Oylamayı Başlat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3B-2. TOPLANTIYA KOMŞU ÇAĞIRMA (DAVET) MODALI */}
      {/* ========================================================= */}
      {isInviteParticipantOpen && (
        <div
          className="fixed inset-0 z-60 bg-black/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in select-none"
          onClick={() => setIsInviteParticipantOpen(false)}
        >
          <div
            className="bg-slate-900 border border-slate-700/80 rounded-t-[28px] sm:rounded-3xl w-full max-w-sm p-5 text-white shadow-2xl animate-slide-up sm:animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* WhatsApp Drag Handle */}
            <div className="w-10 h-1 bg-slate-600 rounded-full mx-auto mb-3" />

            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-4.5 h-4.5 text-[#00a884]" />
                <h4 className="font-bold text-sm text-white">Toplantıya Komşu Çağır</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsInviteParticipantOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="py-2 max-h-60 overflow-y-auto divide-y divide-slate-800">
              {channelMembers
                .filter((m) => !meetingParticipants.some((p) => p.id === m.id))
                .map((m) => (
                  <div key={m.id} className="py-2.5 px-1 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${m.avatarBg} text-white font-bold text-xs flex items-center justify-center`}>
                        {m.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white">{m.name}</h5>
                        <span className="text-[10.5px] text-slate-400">Daire {m.apartmentNo}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setMeetingParticipants((prev) => [...prev, m]);
                        setIsInviteParticipantOpen(false);
                        setMessages((prev) => [
                          ...prev,
                          {
                            id: 'sys-' + Date.now(),
                            channelId: activeChannelId,
                            userId: 'system',
                            content: `📞 ${m.name} canlı toplantıya dahil edildi.`,
                            isMine: false,
                            canDelete: false,
                            createdAt: new Date().toISOString(),
                            author: {
                              id: 'system',
                              name: 'Sistem',
                              apartmentNo: '',
                            },
                          },
                        ]);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#00a884] hover:bg-[#008f6f] text-white text-xs font-bold transition-all shadow-xs active:scale-95"
                    >
                      Odaya Çağır
                    </button>
                  </div>
                ))}
              {channelMembers.filter((m) => !meetingParticipants.some((p) => p.id === m.id)).length === 0 && (
                <p className="text-xs text-slate-400 text-center py-5">
                  Tüm kayıtlı site sakinleri zaten toplantıda.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3C. WHATSAPP BİREBİR GRUP BİLGİSİ (GROUP INFO) PANELİ */}
      {/* ========================================================= */}
      {isGroupInfoOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in select-none"
          onClick={() => setIsGroupInfoOpen(false)}
        >
          <div
            className="w-full sm:max-w-sm bg-slate-50 h-full overflow-y-auto flex flex-col shadow-2xl animate-slide-left border-l border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Üst Bar */}
            <div className="sticky top-0 z-20 px-3.5 py-3 bg-white border-b border-slate-200/90 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setIsGroupInfoOpen(false)}
                  className="p-1 rounded-full text-slate-600 hover:bg-slate-100"
                >
                  <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
                </button>
                <h3 className="font-bold text-sm text-slate-800">Grup Bilgisi</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsGroupInfoOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grup Başlık Kartı */}
            <div className="bg-white p-5 flex flex-col items-center text-center border-b border-slate-200/80">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-800 border-2 border-emerald-300/80 flex items-center justify-center text-3xl shadow-sm mb-3">
                {getChannelIcon(activeChannel.slug)}
              </div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                {activeChannel.name}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Grup • {channelMembers.length} katılımcı
              </p>
              {activeChannel.description && (
                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl mt-3 border border-slate-100 text-left w-full">
                  {activeChannel.description}
                </p>
              )}
            </div>

            {/* WhatsApp Tarzı Katılımcı Ekleme Butonu */}
            <div className="p-3 bg-white border-b border-slate-200/80 mt-2">
              <button
                type="button"
                onClick={() => setIsAddMemberModalOpen(true)}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200/60 text-[#00a884] font-bold text-xs transition-all active:scale-95"
              >
                <div className="w-9 h-9 rounded-full bg-[#00a884] text-white flex items-center justify-center shadow-xs">
                  <UserPlus className="w-4.5 h-4.5" />
                </div>
                <span>Katılımcı Ekle</span>
              </button>
            </div>

            {/* Katılımcılar Listesi */}
            <div className="flex-1 bg-white p-3 border-b border-slate-200/80 mt-2">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-bold text-slate-500">
                  {channelMembers.length} KATILIMCI
                </span>
                <span className="text-[11px] text-slate-400">
                  {channelMembers.filter((m) => m.role === 'ADMIN').length} Yönetici
                </span>
              </div>

              {/* Katılımcı Arama */}
              <div className="relative flex items-center bg-slate-100 rounded-xl px-2.5 py-1.5 mb-2">
                <Search className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
                <input
                  type="text"
                  placeholder="Katılımcı ara..."
                  value={memberSearchQuery}
                  onChange={(e) => setMemberSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                />
              </div>

              {/* Liste */}
              <div className="divide-y divide-slate-100">
                {channelMembers
                  .filter((m) => m.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) || m.apartmentNo.includes(memberSearchQuery))
                  .map((member) => {
                    const isCurrentUser = member.id === user.id;
                    const isAdmin = member.role === 'ADMIN';
                    const isAuditor = member.role === 'AUDITOR';

                    return (
                      <div
                        key={member.id}
                        onClick={() => {
                          if (!isCurrentUser) {
                            setSelectedMemberForAction(member);
                          }
                        }}
                        className="py-2.5 px-2 flex items-center justify-between hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${member.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs`}>
                            {member.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center space-x-1.5">
                              <span className="text-xs font-bold text-slate-800 truncate">
                                {member.name}
                              </span>
                              {isCurrentUser && (
                                <span className="text-[10px] text-slate-400 font-normal">(Siz)</span>
                              )}
                            </div>
                            <span className="text-[10.5px] text-slate-400 block">
                              Daire {member.apartmentNo}
                            </span>
                          </div>
                        </div>

                        {/* WhatsApp Tarzı Grup Yöneticisi Rozeti */}
                        <div className="shrink-0">
                          {isAdmin ? (
                            <span className="text-[9.5px] font-bold text-[#00a884] bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md flex items-center space-x-1">
                              <Crown className="w-3 h-3 text-[#00a884]" />
                              <span>Grup Yöneticisi</span>
                            </span>
                          ) : isAuditor ? (
                            <span className="text-[9.5px] font-bold text-blue-700 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-md flex items-center space-x-1">
                              <ShieldCheck className="w-3 h-3 text-blue-600" />
                              <span>Denetçi</span>
                            </span>
                          ) : (
                            <span className="text-[9.5px] text-slate-400 font-medium">Kat Maliki</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Gruptan Çık Butonu */}
            <div className="p-3 bg-white mt-2 mb-6">
              <button
                type="button"
                onClick={() => setIsConfirmLeaveGroupOpen(true)}
                className="w-full py-3 text-[#ea0038] font-bold text-xs hover:bg-rose-50 rounded-2xl transition-colors text-center cursor-pointer"
              >
                Gruptan Ayrıl
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3D. WHATSAPP KATILIMCI EKLEME MODALI */}
      {/* ========================================================= */}
      {isAddMemberModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in select-none"
          onClick={() => setIsAddMemberModalOpen(false)}
        >
          <div
            className="bg-white rounded-t-[28px] sm:rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[85vh] animate-slide-up sm:animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* WhatsApp Drag Handle */}
            <div className="pt-3 pb-1 bg-white">
              <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto" />
            </div>

            {/* Modal Başlığı */}
            <div className="px-5 py-3.5 bg-white border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#111b21]">Katılımcı Ekle</h3>
                <p className="text-[11px] text-[#667781]">Binadaki kayıtlı daire sakinleri</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddMemberModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-[#f0f2f5] transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Gerçek Katılımcı Ekleme Formu */}
            <div className="p-4 space-y-3.5 flex-1 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-[#111b21] mb-1.5">
                  Komşu / Sakin Adı Soyadı *
                </label>
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Örn: Ahmet Kaya"
                  className="w-full bg-[#f0f2f5] border border-slate-200/80 rounded-xl px-3.5 py-3 text-xs text-[#111b21] placeholder-slate-400 focus:outline-none focus:border-[#00a884] focus:bg-white focus:ring-1 focus:ring-[#00a884]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111b21] mb-1.5">
                  Daire No
                </label>
                <input
                  type="text"
                  value={newMemberApt}
                  onChange={(e) => setNewMemberApt(e.target.value)}
                  placeholder="Örn: 12 veya A Blok D.5"
                  className="w-full bg-[#f0f2f5] border border-slate-200/80 rounded-xl px-3.5 py-3 text-xs text-[#111b21] placeholder-slate-400 focus:outline-none focus:border-[#00a884] focus:bg-white focus:ring-1 focus:ring-[#00a884]"
                />
              </div>

              <div className="text-[11px] text-[#008069] bg-[#d9fdd3]/30 border border-[#c4eec0] rounded-xl p-3 leading-relaxed">
                ℹ️ Eklenen komşu gruba kaydedilir, grup sohbetine ve canlı toplantılara anında katılabilir.
              </div>

              <button
                type="button"
                disabled={!newMemberName.trim()}
                onClick={handleAddCustomMember}
                className="w-full py-3.5 rounded-2xl bg-[#00a884] hover:bg-[#008f6f] disabled:opacity-50 text-white font-bold text-xs transition-all shadow-md shadow-[#00a884]/20 active:scale-95 cursor-pointer"
              >
                Gruba Ekle +
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3E. WHATSAPP KATILIMCI YÖNETİM MENÜSÜ (AKSYONLAR) */}
      {/* ========================================================= */}
      {selectedMemberForAction && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in select-none"
          onClick={() => setSelectedMemberForAction(null)}
        >
          <div
            className="w-full sm:max-w-xs bg-white rounded-t-[28px] sm:rounded-3xl p-5 shadow-2xl border border-slate-100 animate-slide-up sm:animate-scale-up space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* WhatsApp Drag Handle */}
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-2" />

            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <div className={`w-11 h-11 rounded-full bg-gradient-to-tr ${selectedMemberForAction.avatarBg} text-white font-bold text-sm flex items-center justify-center`}>
                {selectedMemberForAction.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#111b21] leading-tight">{selectedMemberForAction.name}</h4>
                <span className="text-[10.5px] text-[#667781]">Daire {selectedMemberForAction.apartmentNo}</span>
              </div>
            </div>

            {/* Yönetici Yap / Yöneticilikten Çıkar */}
            <button
              type="button"
              onClick={() => handleToggleMemberAdmin(selectedMemberForAction.id)}
              className="w-full flex items-center space-x-3 px-3.5 py-3 rounded-2xl text-xs font-semibold text-[#111b21] hover:bg-[#f0f2f5] transition-colors text-left"
            >
              <Crown className="w-4.5 h-4.5 text-amber-500" />
              <span>{selectedMemberForAction.role === 'ADMIN' ? 'Yöneticilikten Çıkar' : 'Grup Yöneticisi Yap'}</span>
            </button>

            {/* Gruptan Çıkar */}
            <button
              type="button"
              onClick={() => {
                const target = selectedMemberForAction;
                setSelectedMemberForAction(null);
                setMemberToRemove(target);
              }}
              className="w-full flex items-center space-x-3 px-3.5 py-3 rounded-2xl text-xs font-semibold text-[#ea0038] hover:bg-rose-50 transition-colors text-left"
            >
              <UserMinus className="w-4.5 h-4.5 text-[#ea0038]" />
              <span>Gruptan Çıkar</span>
            </button>

            {/* Vazgeç */}
            <button
              type="button"
              onClick={() => setSelectedMemberForAction(null)}
              className="w-full py-3 rounded-2xl bg-[#f0f2f5] text-[#111b21] font-bold text-xs hover:bg-slate-200 transition-colors mt-1"
            >
              Vazgeç
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3F. WHATSAPP KATILIMCIYI ÇIKARMA ONAY MODALI */}
      {/* ========================================================= */}
      {memberToRemove && (
        <div
          className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in select-none"
          onClick={() => setMemberToRemove(null)}
        >
          <div
            className="w-full max-w-[310px] bg-white rounded-[24px] p-5 shadow-2xl border border-slate-100 animate-scale-up space-y-3.5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#ea0038] flex items-center justify-center shrink-0">
                <UserMinus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#111b21]">Gruptan çıkarılsın mı?</h3>
                <p className="text-[11px] text-[#667781] mt-0.5">{memberToRemove.name}</p>
              </div>
            </div>

            <p className="text-xs text-[#667781] leading-relaxed">
              <strong>{memberToRemove.name}</strong> isimli komşuyu bu gruptan çıkarmak istediğinize emin misiniz?
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setMemberToRemove(null)}
                className="w-full py-2.5 rounded-xl bg-[#f0f2f5] hover:bg-slate-200 text-[#111b21] font-semibold text-xs transition-colors"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={() => executeRemoveMember(memberToRemove)}
                className="w-full py-2.5 rounded-xl bg-[#ea0038] hover:bg-[#c9002f] text-white font-semibold text-xs shadow-md shadow-rose-600/20 transition-colors"
              >
                Çıkar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3G. WHATSAPP GRUPTAN AYRILMA ONAY MODALI */}
      {/* ========================================================= */}
      {isConfirmLeaveGroupOpen && (
        <div
          className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in select-none"
          onClick={() => setIsConfirmLeaveGroupOpen(false)}
        >
          <div
            className="w-full max-w-[310px] bg-white rounded-[24px] p-5 shadow-2xl border border-slate-100 animate-scale-up space-y-3.5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#ea0038] flex items-center justify-center shrink-0">
                <LogOut className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#111b21]">Gruptan çıkılsın mı?</h3>
                <p className="text-[11px] text-[#667781] mt-0.5">Sohbetten ayrılacaksınız</p>
              </div>
            </div>

            <p className="text-xs text-[#667781] leading-relaxed">
              Bu gruptan ayrılmak istediğinize emin misiniz? Gruptan çıktığınızda yeni mesaj gönderemezsiniz.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsConfirmLeaveGroupOpen(false)}
                className="w-full py-2.5 rounded-xl bg-[#f0f2f5] hover:bg-slate-200 text-[#111b21] font-semibold text-xs transition-colors"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsConfirmLeaveGroupOpen(false);
                  setIsGroupInfoOpen(false);
                  setCurrentView("list");
                }}
                className="w-full py-2.5 rounded-xl bg-[#ea0038] hover:bg-[#c9002f] text-white font-semibold text-xs shadow-md shadow-rose-600/20 transition-colors"
              >
                Gruptan Çık
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. WHATSAPP TARZI UYGULAMA İÇİ TAM EKRAN FOTOĞRAF GÖRÜNTÜLEYİCİ */}
      {/* ========================================================= */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between animate-fade-in select-none"
          onClick={() => setPreviewImage(null)}
        >
          {/* Üst Çubuk (Geri/Kapat Butonu + Gönderen Bilgisi + İndir Butonu) */}
          <div
            className="px-4 py-3 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between text-white z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="p-1.5 rounded-full hover:bg-white/20 active:scale-95 transition-all text-white"
                title="Geri / Kapat"
              >
                <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
              </button>
              <div>
                <h4 className="text-sm font-bold text-white leading-tight">
                  {previewImage.authorName || 'Fotoğraf'}
                </h4>
                {previewImage.time && (
                  <p className="text-[11px] text-white/60 font-medium">
                    {previewImage.time}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => {
                  const a = document.createElement('a');
                  a.href = previewImage.url;
                  a.download = `komsu_gorsel_${Date.now()}.jpg`;
                  a.click();
                }}
                className="p-2 rounded-full hover:bg-white/20 text-white transition-all active:scale-95"
                title="Fotoğrafı İndir"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="p-2 rounded-full hover:bg-white/20 text-white transition-all active:scale-95"
                title="Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Ortadaki Büyük Görsel */}
          <div
            className="flex-1 flex items-center justify-center p-3 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewImage.url}
              alt="Tam Boy Görsel"
              className="max-w-full max-h-[82vh] object-contain rounded-lg shadow-2xl animate-scale-up select-none"
            />
          </div>

          {/* Alt Çubuk */}
          <div className="p-3 text-center text-[11px] text-white/40 select-none">
            Kapatmak için ekrana dokunun veya geri tuşuna basın
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. WHATSAPP TARZI MESAJ AKSİYON VE TEPKİ MENÜSÜ */}
      {/* ========================================================= */}
      {selectedMessageForAction && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in select-none"
          onClick={() => setSelectedMessageForAction(null)}
        >
          <div
            className="w-full sm:max-w-xs flex flex-col items-center animate-slide-up sm:animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* WhatsApp Yüzen Hızlı Reaksiyon Balonu */}
            <div className="flex items-center justify-between px-3 py-2 bg-white rounded-full shadow-2xl border border-slate-100 mb-3 mx-4">
              {QUICK_REACTIONS.map((emoji) => {
                const hasReacted = selectedMessageForAction.reactions?.[emoji]?.includes(user.id);
                return (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => handleToggleReaction(selectedMessageForAction.id, emoji)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-2xl transition-transform active:scale-90 ${
                      hasReacted ? 'bg-[#d9fdd3] ring-2 ring-[#00a884] scale-110' : 'hover:scale-125'
                    }`}
                    title={hasReacted ? 'Tepkiyi Kaldır' : 'Tepki Ver'}
                  >
                    {emoji}
                  </button>
                );
              })}

              {/* Tüm Emojiler (+) Butonu */}
              <button
                type="button"
                onClick={() => setShowReactionPicker(true)}
                className="w-9 h-9 rounded-full bg-[#f0f2f5] hover:bg-slate-200 text-[#111b21] flex items-center justify-center shrink-0 transition-transform active:scale-90"
                title="Tüm Emojiler"
              >
                <Plus className="w-4.5 h-4.5 stroke-[2.5]" />
              </button>
            </div>

            {/* WhatsApp Alt Aksiyon Kartı */}
            <div className="w-full bg-white rounded-t-[28px] sm:rounded-3xl p-4 shadow-2xl border border-slate-100 space-y-1.5">
              {/* WhatsApp Drag Handle */}
              <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-2" />

              {/* Eylemler Menüsü */}
              <div className="space-y-1">
                {/* Metni Kopyala */}
                {selectedMessageForAction.content && (
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(selectedMessageForAction.content);
                      setSelectedMessageForAction(null);
                    }}
                    className="w-full flex items-center space-x-3.5 px-4 py-3 rounded-2xl text-[#111b21] hover:bg-[#f0f2f5] active:bg-[#f0f2f5] transition-colors text-xs font-semibold text-left cursor-pointer"
                  >
                    <Copy className="w-4.5 h-4.5 text-[#667781]" />
                    <span>Metni Kopyala</span>
                  </button>
                )}

                {/* Düzenle (yalnızca kendi mesajıysa) */}
                {(selectedMessageForAction.isMine ||
                  selectedMessageForAction.userId === user.id ||
                  selectedMessageForAction.author?.id === user.id) && (
                  <button
                    type="button"
                    onClick={() => {
                      handleStartEdit(selectedMessageForAction);
                      setSelectedMessageForAction(null);
                    }}
                    className="w-full flex items-center space-x-3.5 px-4 py-3 rounded-2xl text-[#008069] hover:bg-[#d9fdd3]/30 active:bg-[#d9fdd3]/40 transition-colors text-xs font-semibold text-left cursor-pointer"
                  >
                    <Pencil className="w-4.5 h-4.5 text-[#008069]" />
                    <span>Mesajı Düzenle</span>
                  </button>
                )}

                {/* Sil (kendi mesajıysa veya Yetkili ise) */}
                {(selectedMessageForAction.isMine ||
                  selectedMessageForAction.canDelete ||
                  selectedMessageForAction.userId === user.id ||
                  selectedMessageForAction.author?.id === user.id ||
                  user.role === 'ADMIN' ||
                  user.role === 'SUPER_ADMIN') && (
                  <button
                    type="button"
                    onClick={() => {
                      const targetMsg = selectedMessageForAction;
                      setSelectedMessageForAction(null);
                      setMessageToDelete(targetMsg);
                    }}
                    className="w-full flex items-center space-x-3.5 px-4 py-3 rounded-2xl text-[#ea0038] hover:bg-rose-50 active:bg-rose-100 transition-colors text-xs font-semibold text-left cursor-pointer"
                  >
                    <Trash2 className="w-4.5 h-4.5 text-[#ea0038]" />
                    <span>Mesajı Sil</span>
                  </button>
                )}
              </div>

              {/* Vazgeç Butonu */}
              <button
                type="button"
                onClick={() => setSelectedMessageForAction(null)}
                className="w-full py-3 rounded-2xl bg-[#f0f2f5] hover:bg-slate-200 text-[#111b21] font-bold text-xs transition-colors mt-2 cursor-pointer"
              >
                Vazgeç
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5.1 GÜVENLİ VE ŞIK WHATSAPP MESAJ SİLME ONAY MODALI */}
      {/* ========================================================= */}
      {messageToDelete && (
        <div
          className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in select-none"
          onClick={() => !isDeletingMessage && setMessageToDelete(null)}
        >
          <div
            className="w-full max-w-[310px] bg-white rounded-[24px] p-5 shadow-2xl border border-slate-100 animate-scale-up space-y-3.5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#ea0038] flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#111b21]">Mesaj silinsin mi?</h3>
                <p className="text-[11px] text-[#667781] mt-0.5">Bu işlem geri alınamaz</p>
              </div>
            </div>

            {messageToDelete.content && (
              <div className="bg-[#d9fdd3]/40 border border-[#c4eec0] rounded-xl p-3 text-xs text-[#111b21] line-clamp-3 italic">
                "{messageToDelete.content}"
              </div>
            )}

            <p className="text-xs text-[#667781] leading-relaxed">
              Bu mesajı sohbetten herkes için silmek istediğinize emin misiniz?
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                disabled={isDeletingMessage}
                onClick={() => setMessageToDelete(null)}
                className="w-full py-2.5 rounded-xl bg-[#f0f2f5] hover:bg-slate-200 text-[#111b21] font-semibold text-xs transition-colors disabled:opacity-50 cursor-pointer"
              >
                İptal
              </button>
              <button
                type="button"
                disabled={isDeletingMessage}
                onClick={() => handleDeleteMessage(messageToDelete.id)}
                className="w-full py-2.5 rounded-xl bg-[#ea0038] hover:bg-[#c9002f] text-white font-semibold text-xs shadow-md shadow-rose-600/20 transition-colors flex items-center justify-center space-x-1.5 disabled:opacity-50 cursor-pointer"
              >
                {isDeletingMessage ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Siliniyor...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Herkes İçin Sil</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. WHATSAPP KAPSAMLI TEPKİ SEÇİCİ MODALI (+ BUTONU İÇİN) */}
      {/* ========================================================= */}
      {showReactionPicker && selectedMessageForAction && (
        <div
          className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in select-none"
          onClick={() => setShowReactionPicker(false)}
        >
          <div
            className="w-full sm:max-w-md bg-white rounded-t-[28px] sm:rounded-3xl p-4 shadow-2xl border border-slate-100 animate-slide-up flex flex-col max-h-[75vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* WhatsApp Drag Handle */}
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-2.5" />

            {/* Başlık ve Kapatma */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center space-x-2">
                <span className="text-base">✨</span>
                <h4 className="text-sm font-bold text-[#111b21]">Mesaja Tepki Bırak</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowReactionPicker(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-[#f0f2f5]"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* WhatsApp Kategori Sekmeleri */}
            <div className="flex items-center space-x-1 py-2 overflow-x-auto scrollbar-none border-b border-slate-100 shrink-0">
              {WHATSAPP_EMOJI_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveEmojiTab(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 whitespace-nowrap transition-all cursor-pointer ${
                    activeEmojiTab === cat.id
                      ? 'bg-[#00a884] text-white shadow-xs'
                      : 'bg-[#f0f2f5] text-[#111b21] hover:bg-slate-200'
                  }`}
                >
                  <span className="text-sm">{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

            {/* Seçilen Kategorideki Emojiler Izgarası */}
            <div className="flex-1 overflow-y-auto py-3 pr-1">
              <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5">
                {(WHATSAPP_EMOJI_CATEGORIES.find((c) => c.id === activeEmojiTab)?.emojis || []).map((emoji, idx) => {
                  const hasReacted = selectedMessageForAction.reactions?.[emoji]?.includes(user.id);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleToggleReaction(selectedMessageForAction.id, emoji)}
                      className={`h-10 rounded-xl flex items-center justify-center text-xl transition-all active:scale-90 cursor-pointer ${
                        hasReacted ? 'bg-[#d9fdd3] ring-2 ring-[#00a884] scale-110' : 'hover:bg-slate-100 hover:scale-120'
                      }`}
                    >
                      {emoji}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
