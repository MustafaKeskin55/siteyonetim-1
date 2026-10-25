"use client";

import * as React from "react";
import {
  MessagesSquare,
  Plus,
  Trash2,
  Lock,
  ShieldCheck,
  RefreshCw,
  X,
  Users,
  User,
  Camera,
  Heart,
  MessageCircle,
  Pin,
  Send,
  Sparkles,
  EyeOff,
  Image as ImageIcon,
  Clock,
  CheckCircle2,
  Megaphone,
  Smile,
  MoreHorizontal,
} from "lucide-react";
import { useAlert, useConfirm } from "@/components/ModalProvider";

type ReactionType = "like" | "love" | "applause" | "tea" | "useful" | "sad";

interface ReactionDef {
  type: ReactionType;
  emoji: string;
  label: string;
  color: string;
  badgeBg: string;
}

const REACTIONS: ReactionDef[] = [
  { type: "like", emoji: "👍", label: "Beğen", color: "text-blue-500", badgeBg: "bg-blue-50 dark:bg-blue-950/70" },
  { type: "love", emoji: "❤️", label: "Sevdim", color: "text-rose-500", badgeBg: "bg-rose-50 dark:bg-rose-950/70" },
  { type: "applause", emoji: "👏", label: "Harika", color: "text-amber-500", badgeBg: "bg-amber-50 dark:bg-amber-950/70" },
  { type: "tea", emoji: "☕", label: "Komşuluk", color: "text-orange-500", badgeBg: "bg-orange-50 dark:bg-orange-950/70" },
  { type: "useful", emoji: "💡", label: "Faydalı", color: "text-yellow-500", badgeBg: "bg-yellow-50 dark:bg-yellow-950/70" },
  { type: "sad", emoji: "😢", label: "Üzücü", color: "text-indigo-400", badgeBg: "bg-indigo-50 dark:bg-indigo-950/70" },
];

interface DirectNeighbor {
  id: string;
  name: string;
  apartmentNo: string;
  avatarBg: string;
  isOnline: boolean;
  unreadCount?: number;
}

interface DirectMessage {
  id: string;
  sender: "manager" | "neighbor";
  text: string;
  time: string;
}

const NEIGHBORS: DirectNeighbor[] = [
  { id: "n1", name: "Zeynep Hanım", apartmentNo: "6", avatarBg: "from-blue-600 to-indigo-600", isOnline: true, unreadCount: 1 },
  { id: "n2", name: "Murat Bey", apartmentNo: "9", avatarBg: "from-amber-500 to-orange-600", isOnline: true },
  { id: "n3", name: "Ahmet Bey", apartmentNo: "12", avatarBg: "from-emerald-500 to-teal-600", isOnline: false },
  { id: "n4", name: "Fatma Hanım", apartmentNo: "8", avatarBg: "from-indigo-500 to-sky-600", isOnline: false },
  { id: "n5", name: "Kemal Bey", apartmentNo: "3", avatarBg: "from-slate-600 to-slate-800", isOnline: true },
  { id: "n6", name: "Selin Hanım", apartmentNo: "2", avatarBg: "from-cyan-500 to-blue-600", isOnline: true },
];

const INITIAL_DIRECT_MESSAGES: Record<string, DirectMessage[]> = {
  n1: [
    { id: "dm1", sender: "neighbor", text: "Merhaba yönetici bey, bahçedeki kamelyaya yeni minderler için teşekkür ederiz çok rahat olmuş.", time: "14:10" },
    { id: "dm2", sender: "manager", text: "Rica ederiz Zeynep Hanım, komşularımızın memnun kalmasına çok sevindik. Güle güle kullanın!", time: "14:15" },
    { id: "dm3", sender: "neighbor", text: "Çay demledik birazdan ineriz, müsait olursanız bir bardak sıcak çay ikram etmek isteriz.", time: "14:18" },
  ],
  n2: [
    { id: "dm4", sender: "neighbor", text: "Yönetici bey selamlar, bina girişinde bulduğumuz sarman kedi sahibine ulaştı mı acaba?", time: "11:30" },
    { id: "dm5", sender: "manager", text: "Evet Murat Bey, Daire 4 Aylin Hanım'ların misafirinin kedisiymiş, teslim ettik. Duyarlılığınız için çok sağ olun.", time: "11:42" },
    { id: "dm6", sender: "neighbor", text: "Çok sevindim, teşekkürler kolay gelsin!", time: "11:45" },
  ],
  n3: [
    { id: "dm7", sender: "neighbor", text: "Yönetici bey iyi günler, otoparkta 12 nolu yerimin önüne yabancı bir araç yanaşmış çıkamıyorum. Plakayı anons edebilir miyiz?", time: "09:20" },
    { id: "dm8", sender: "manager", text: "Merhaba Ahmet Bey, hemen güvenlik personeline bilgi veriyorum, 5 dakikaya çektiriyoruz.", time: "09:23" },
    { id: "dm9", sender: "neighbor", text: "Hızlı dönüşünüz için teşekkür ederim.", time: "09:26" },
  ],
  n4: [
    { id: "dm10", sender: "neighbor", text: "Merhaba, bu ayın aidat makbuzunu sistem üzerinden kontrol ettim, sorunsuz onaylanmış teşekkürler.", time: "Dün" },
    { id: "dm11", sender: "manager", text: "İyi günler Fatma Hanım, ödemeniz kayıtlara geçmiştir, teşekkür ederiz.", time: "Dün" },
  ],
  n5: [
    { id: "dm12", sender: "neighbor", text: "Yönetim selamlar, bina ana giriş kapısının hidroliği biraz sert çarpıyor gibi, kontrol edilebilir mi?", time: "Dün" },
    { id: "dm13", sender: "manager", text: "Merhaba Kemal Bey, servis bakım listemize aldık, yarın sabah ayarı yapılacak.", time: "Dün" },
  ],
  n6: [
    { id: "dm14", sender: "neighbor", text: "İyi çalışmalar, çocuk parkındaki salıncak zincirinin bir tarafı biraz gevşemiş, rica etsem bakılabilir mi?", time: "2 gün önce" },
    { id: "dm15", sender: "manager", text: "Bilgilendirme için teşekkürler Selin Hanım, teknik görevlimiz bugün öğlen sağlamlaştırdı.", time: "2 gün önce" },
  ],
};

interface Channel {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string;
  isAnnouncementOnly: boolean;
  sortOrder: number;
}

interface Message {
  id: string;
  channelId: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  author: {
    id: string;
    name: string;
    apartmentNo: string;
    role: string;
  };
}

interface StoryItem {
  id: string;
  name: string;
  label: string;
  apt: string;
  color: string;
  isUser?: boolean;
  content: string;
  time: string;
  imageUrl?: string;
}

interface FeedPost {
  id: string;
  author: {
    name: string;
    apt: string;
    isManagement?: boolean;
  };
  time: string;
  content: string;
  imageUrl?: string;
  reactions: Record<ReactionType, number>;
  userReaction?: ReactionType | null;
  isPinned?: boolean;
  comments: {
    id: string;
    author: string;
    apt: string;
    text: string;
    time: string;
  }[];
}

export default function AdminCommunityPage() {
  const showAlert = useAlert();
  const showConfirm = useConfirm();

  // ══════════════════════════════════════════════════════════
  // KOMŞULUK SOSYAL AKIŞ & HİKAYELER STATE
  // ══════════════════════════════════════════════════════════
  const [stories, setStories] = React.useState<StoryItem[]>([
    {
      id: "s0",
      name: "Siz (Yönetici)",
      label: "Hikaye Ekle",
      apt: "YNT",
      color: "border-dashed border-2 border-blue-400 dark:border-blue-500",
      isUser: true,
      content: "Bina geneline 24 saatlik anlık görsel veya duyuru paylaşın.",
      time: "Şimdi",
    },
    {
      id: "s1",
      name: "Bina Yönetimi",
      label: "Duyuru 📌",
      apt: "YNT",
      color: "from-blue-600 via-indigo-600 to-sky-500",
      content: "Perşembe günü 13:00 - 15:00 saatleri arasında hidrofor bakımı yapılacaktır. Kısa süreli su kesintisi olabilir.",
      time: "2 saat önce",
    },
    {
      id: "s2",
      name: "Zeynep Hanım",
      label: "Çay Saati ☕️",
      apt: "D.6",
      color: "from-cyan-500 via-sky-600 to-blue-700",
      content: "Kamelyada komşuluk çayı ve kurabiye etkinliği başladı, müsait olan tüm komşularımızı bekleriz!",
      time: "45 dk önce",
    },
    {
      id: "s3",
      name: "Murat Bey",
      label: "Kedi Bulundu 🐱",
      apt: "D.9",
      color: "from-amber-500 via-orange-500 to-yellow-600",
      content: "Bina girişindeki merdiven altında tasmalı sarman bir kedi bulundu. Sahibini arıyoruz, yönetim odasında bekliyor.",
      time: "3 saat önce",
    },
    {
      id: "s4",
      name: "Ahmet Bey",
      label: "Matkap Lazım 🔧",
      apt: "D.12",
      color: "from-emerald-500 via-teal-600 to-cyan-600",
      content: "Merhaba komşular, 1 saatliğine ödünç darbeli matkap verebilecek var mı?",
      time: "4 saat önce",
    },
    {
      id: "s5",
      name: "Sevgi Hanım",
      label: "Temiz Masa 🎁",
      apt: "D.18",
      color: "from-indigo-500 via-blue-600 to-slate-700",
      content: "Çocuk odasındaki az kullanılmış beyaz çalışma masasını ihtiyacı olan bir komşumuza hediye ediyoruz.",
      time: "5 saat önce",
    },
  ]);

  const [activeStory, setActiveStory] = React.useState<StoryItem | null>(null);
  const [showNewStoryModal, setShowNewStoryModal] = React.useState(false);
  const [newStoryTitle, setNewStoryTitle] = React.useState("");
  const [newStoryText, setNewStoryText] = React.useState("");

  const [posts, setPosts] = React.useState<FeedPost[]>([
    {
      id: "p1",
      author: { name: "Bina Yönetimi (Resmi)", apt: "YNT", isManagement: true },
      time: "1 saat önce",
      isPinned: true,
      imageUrl: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=1200&q=80",
      content:
        "📢 Sayın site sakinlerimiz, ortak alan bahçe kamelyamızın ahşap zemin ve masa bakımları tamamlanmıştır. Yeni oturma minderleri yerleştirildi. Komşularımızın keyifli akşamlarda güle güle kullanmasını dileriz.",
      reactions: { like: 24, love: 14, applause: 4, tea: 0, useful: 0, sad: 0 },
      userReaction: "love",
      comments: [
        { id: "c1", author: "Zeynep K.", apt: "D.6", text: "Çok ferah ve nezih olmuş, emeğinize sağlık yönetici bey! 👏🌸", time: "40 dk önce" },
        { id: "c2", author: "Mehmet Y.", apt: "D.14", text: "Hafta sonu komşularla çay saatine çok uygun oldu, teşekkürler.", time: "25 dk önce" },
        { id: "c3", author: "Selin A.", apt: "D.2", text: "Akşam aydınlatması da çok hoş görünüyor ✨", time: "10 dk önce" },
      ],
    },
    {
      id: "p2",
      author: { name: "Zeynep Hanım", apt: "D.6" },
      time: "3 saat önce",
      imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80",
      content:
        "Merhabalar komşular! ☕️🍪 Kamelyada komşularla akşam çayı başlattık. Taze kek ve kurabiyemiz bol, çayını veya bardağını kapan tüm komşularımızı bahçeye bekliyoruz!",
      reactions: { like: 8, love: 5, applause: 2, tea: 14, useful: 0, sad: 0 },
      userReaction: null,
      comments: [
        { id: "c4", author: "Fatma D.", apt: "D.8", text: "Fırından sıcak poğaça aldım hemen aşağı iniyorum Zeynep Hanım! 😊", time: "2 saat önce" },
        { id: "c5", author: "Barış K.", apt: "D.11", text: "Çocukları parka indirdim, biz de kamelyadayız selamlar!", time: "1 saat önce" },
      ],
    },
    {
      id: "p3",
      author: { name: "Murat Bey", apt: "D.9" },
      time: "5 saat önce",
      imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=80",
      content:
        "Bina giriş kapısının önünde mavi tasmaya sahip tatlı bir sarman kedi gördük. Soğukta kalmaması için güvenliğe haber verdik, şu an yönetim ofisinde ısınıyor. Sahibini arıyoruz 🐱",
      reactions: { like: 12, love: 18, applause: 0, tea: 0, useful: 6, sad: 0 },
      userReaction: "love",
      comments: [
        { id: "c6", author: "Aylin T.", apt: "D.4", text: "Bizim 3. kattaki Aylin'lerin kedisine benziyor, hemen haber veriyorum!", time: "4 saat önce" },
        { id: "c7", author: "Bina Yönetimi", apt: "YNT", text: "Kedimizin mamasını ve suyunu verdik, güvende bekliyor.", time: "3 saat önce" },
      ],
    },
    {
      id: "p4",
      author: { name: "Ahmet Bey", apt: "D.12" },
      time: "7 saat önce",
      imageUrl: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=1200&q=80",
      content:
        "Salon perdesi kornişini monte etmek için 1 saatliğine darbeli matkap ve basamaklı merdiven ödünç verebilecek bir komşumuz var mıdır? İşim biter bitmez hemen teslim ederim.",
      reactions: { like: 6, love: 0, applause: 3, tea: 0, useful: 9, sad: 0 },
      userReaction: null,
      comments: [
        { id: "c8", author: "Kemal T.", apt: "D.3", text: "Ahmet Bey bende hem matkap seti hem de merdiven var. Daire 3'e uğrayıp alabilirsiniz.", time: "6 saat önce" },
        { id: "c9", author: "Ahmet Bey", apt: "D.12", text: "Çok teşekkür ederim Kemal Bey, hemen geliyorum!", time: "5 saat önce" },
      ],
    },
  ]);

  const [newPostText, setNewPostText] = React.useState("");
  const [newPostImageUrl, setNewPostImageUrl] = React.useState("");
  const [showImageInput, setShowImageInput] = React.useState(false);
  const [commentInputs, setCommentInputs] = React.useState<Record<string, string>>({});
  const [activeReactionPostId, setActiveReactionPostId] = React.useState<string | null>(null);

  // ══════════════════════════════════════════════════════════
  // CANLI İLETİŞİM STATE (KANALLAR & ÖZEL MESAJLAR - DM)
  // ══════════════════════════════════════════════════════════
  const [commMode, setCommMode] = React.useState<"CHANNELS" | "DIRECT">("CHANNELS");
  const [selectedNeighborId, setSelectedNeighborId] = React.useState<string>("n1");
  const [directMessages, setDirectMessages] = React.useState<Record<string, DirectMessage[]>>(INITIAL_DIRECT_MESSAGES);
  const [dmInputText, setDmInputText] = React.useState<string>("");

  // ══════════════════════════════════════════════════════════
  // TEXT CHANNELS STATE
  // ══════════════════════════════════════════════════════════
  const [channels, setChannels] = React.useState<Channel[]>([]);
  const [selectedChannelId, setSelectedChannelId] = React.useState<string>("");
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [loadingMessages, setLoadingMessages] = React.useState(false);
  const [channelMessageText, setChannelMessageText] = React.useState("");

  // New Channel Modal
  const [showNewChannelModal, setShowNewChannelModal] = React.useState(false);
  const [newChannelName, setNewChannelName] = React.useState("");
  const [newChannelDesc, setNewChannelDesc] = React.useState("");
  const [newChannelIcon, setNewChannelIcon] = React.useState("MessageSquare");
  const [newChannelAnnouncementOnly, setNewChannelAnnouncementOnly] = React.useState(false);
  const [savingChannel, setSavingChannel] = React.useState(false);

  // Load Channels
  const fetchChannels = React.useCallback(async () => {
    try {
      const res = await fetch("/api/community/channels", { credentials: "include" });
      const data = await res.json();
      if (Array.isArray(data)) {
        setChannels(data);
        if (data.length > 0 && !selectedChannelId) {
          setSelectedChannelId(data[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedChannelId]);

  React.useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  // Fetch Messages for selected channel
  const fetchMessages = React.useCallback(async (channelId: string) => {
    if (!channelId) return;
    setLoadingMessages(true);
    try {
      const res = await fetch(`/api/community/messages?channelId=${channelId}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setMessages(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  React.useEffect(() => {
    if (selectedChannelId) {
      fetchMessages(selectedChannelId);
    }
  }, [selectedChannelId, fetchMessages]);

  // Create Channel
  const handleCreateChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim()) {
      showAlert({ title: "Hata", message: "Lütfen kanal adını girin.", variant: "error" });
      return;
    }

    setSavingChannel(true);
    try {
      const res = await fetch("/api/community/channels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: newChannelName.trim(),
          description: newChannelDesc.trim() || undefined,
          icon: newChannelIcon,
          isAnnouncementOnly: newChannelAnnouncementOnly,
        }),
      });

      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) throw new Error(data?.error || "Kanal oluşturulamadı");

      setShowNewChannelModal(false);
      setNewChannelName("");
      setNewChannelDesc("");
      await fetchChannels();
      showAlert({ title: "Başarılı", message: "Yeni komşuluk grubu/kanalı oluşturuldu.", variant: "success" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "İşlem başarısız";
      showAlert({ title: "Hata", message: msg, variant: "error" });
    } finally {
      setSavingChannel(false);
    }
  };

  // Delete message (Moderation)
  const handleDeleteMessage = async (msgId: string) => {
    const ok = await showConfirm({
      title: "Mesajı Kaldır",
      message: "Bu mesajı uygunsuzluk veya kural ihlali sebebiyle gruptan silmek istediğinize emin misiniz?",
      confirmLabel: "Evet, Sil",
      cancelLabel: "Vazgeç",
      variant: "warning",
    });
    if (!ok) return;

    try {
      const res = await fetch(`/api/community/messages?id=${msgId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Silinemedi");
      setMessages((prev) => prev.filter((m) => m.id !== msgId));
      showAlert({ title: "Silindi", message: "Mesaj moderasyon kapsamında kaldırıldı.", variant: "success" });
    } catch {
      showAlert({ title: "Hata", message: "Mesaj silinemedi.", variant: "error" });
    }
  };

  // Send message as Admin in channel
  const handleSendChannelMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelMessageText.trim() || !selectedChannelId) return;

    try {
      const res = await fetch("/api/community/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          channelId: selectedChannelId,
          content: channelMessageText.trim(),
        }),
      });

      if (res.ok) {
        setChannelMessageText("");
        await fetchMessages(selectedChannelId);
      }
    } catch {
      // ignore
    }
  };

  // ══════════════════════════════════════════════════════════
  // KOMŞULUK AKIŞI ACTIONS
  // ══════════════════════════════════════════════════════════
  // Facebook-Style Multi-Emoji Reactions Handler
  const handleReactToPost = (postId: string, reactionType: ReactionType) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const currentReaction = p.userReaction;
        const updatedReactions = { ...p.reactions };

        if (currentReaction === reactionType) {
          // Toggle off
          updatedReactions[reactionType] = Math.max(0, (updatedReactions[reactionType] || 1) - 1);
          return {
            ...p,
            userReaction: null,
            reactions: updatedReactions,
          };
        } else {
          // Decrement previous if existed
          if (currentReaction) {
            updatedReactions[currentReaction] = Math.max(0, (updatedReactions[currentReaction] || 1) - 1);
          }
          // Increment new
          updatedReactions[reactionType] = (updatedReactions[reactionType] || 0) + 1;
          return {
            ...p,
            userReaction: reactionType,
            reactions: updatedReactions,
          };
        }
      })
    );
    setActiveReactionPostId(null);
  };

  const handleQuickReactionToggle = (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;
    if (post.userReaction) {
      handleReactToPost(postId, post.userReaction);
    } else {
      handleReactToPost(postId, "like");
    }
  };

  // Helper calculation for reactions
  const getTotalReactions = (reactions: Record<ReactionType, number>) => {
    return Object.values(reactions).reduce((acc, count) => acc + count, 0);
  };

  const getActiveReactions = (reactions: Record<ReactionType, number>) => {
    return REACTIONS.filter((r) => (reactions[r.type] || 0) > 0);
  };

  // Direct Message (DM) Handler
  const handleSendDirectMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dmInputText.trim() || !selectedNeighborId) return;

    const newMsg: DirectMessage = {
      id: "dm_" + Date.now(),
      sender: "manager",
      text: dmInputText.trim(),
      time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
    };

    setDirectMessages((prev) => ({
      ...prev,
      [selectedNeighborId]: [...(prev[selectedNeighborId] || []), newMsg],
    }));
    setDmInputText("");
  };

  const handleAddComment = (postId: string) => {
    const text = (commentInputs[postId] || "").trim();
    if (!text) return;

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          comments: [
            ...p.comments,
            {
              id: "c_" + Date.now(),
              author: "Bina Yönetimi",
              apt: "YNT",
              text,
              time: "Şimdi",
            },
          ],
        };
      })
    );
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  const handleDeletePost = async (postId: string) => {
    const ok = await showConfirm({
      title: "Gönderiyi Kaldır",
      message: "Bu gönderiyi moderasyon kapsamında akıştan tamamen silmek istiyor musunuz?",
      confirmLabel: "Evet, Kaldır",
      cancelLabel: "Vazgeç",
      variant: "warning",
    });
    if (!ok) return;

    setPosts((prev) => prev.filter((p) => p.id !== postId));
    showAlert({ title: "Silindi", message: "Gönderi akıştan kaldırıldı.", variant: "success" });
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost: FeedPost = {
      id: "p_" + Date.now(),
      author: { name: "Bina Yönetimi (Resmi)", apt: "YNT", isManagement: true },
      time: "Şimdi",
      content: newPostText.trim(),
      imageUrl: newPostImageUrl.trim() || undefined,
      reactions: { like: 1, love: 0, applause: 0, tea: 0, useful: 0, sad: 0 },
      userReaction: "like",
      comments: [],
    };

    setPosts([newPost, ...posts]);
    setNewPostText("");
    setNewPostImageUrl("");
    setShowImageInput(false);
    showAlert({ title: "Paylaşıldı", message: "Resmi gönderi komşuluk akışında yayınlandı.", variant: "success" });
  };

  const handleCreateStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoryTitle.trim() || !newStoryText.trim()) return;

    const newStory: StoryItem = {
      id: "s_" + Date.now(),
      name: "Bina Yönetimi",
      label: newStoryTitle.trim(),
      apt: "YNT",
      color: "from-blue-600 to-indigo-600",
      content: newStoryText.trim(),
      time: "Şimdi",
    };

    setStories([stories[0], newStory, ...stories.slice(1)]);
    setShowNewStoryModal(false);
    setNewStoryTitle("");
    setNewStoryText("");
    showAlert({ title: "Yayınlandı", message: "24 saatlik resmi hikayeniz yayınlandı.", variant: "success" });
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300 border border-blue-200 dark:border-blue-800 text-xs font-bold mb-2">
            <Camera className="h-3.5 w-3.5 text-blue-600 dark:text-sky-400" />
            <span>SOSYAL KOMŞULUK AĞI &amp; CANLI İLETİŞİM</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Komşuluk Sosyal Ağı &amp; Sohbet Kanalları
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            24 saatlik anlık komşuluk hikayeleri, fotoğraflı komşu paylaşımları ve canlı tematik bina sohbet kanalları.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setShowNewStoryModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>+ Hikaye Paylaş</span>
          </button>

          <button
            type="button"
            onClick={() => setShowNewChannelModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <MessagesSquare className="h-4 w-4 text-indigo-600 dark:text-sky-400" />
            <span>+ Yeni Kanal Ekle</span>
          </button>
        </div>
      </div>

      {/* KVKK Bilgilendirme Notu */}
      <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-center justify-between text-xs text-blue-900 dark:text-blue-200">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-sky-400 shrink-0" />
          <span>
            <strong>%100 Telefon Gizlilik Kalkanı:</strong> Sakinler birbirlerinin telefon ve e-posta adreslerini göremez; paylaşımlarda sadece isim ve Daire No görünür.
          </span>
        </div>
        <span className="font-mono text-[11px] bg-blue-100 dark:bg-blue-900/80 px-2.5 py-0.5 rounded font-bold">
          KVKK Aktif
        </span>
      </div>

      {/* ══════════════════════════════════════════════════════════
          1. 24 SAATLİK KOMŞULUK HİKAYELERİ (STORIES CAROUSEL)
      ══════════════════════════════════════════════════════════ */}
      <div className="bg-white dark:bg-[#0d1424] rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
            <Camera className="h-4 w-4 text-blue-600 dark:text-sky-400" />
            <span>24 Saatlik Komşuluk Hikayeleri</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            Bina sakinlerine açık anlık durumlar
          </span>
        </div>

        <div className="flex items-center gap-5 overflow-x-auto scrollbar-none py-1">
          {stories.map((st) => (
            <div
              key={st.id}
              onClick={() => {
                if (st.isUser) {
                  setShowNewStoryModal(true);
                } else {
                  setActiveStory(st);
                }
              }}
              className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group select-none"
            >
              <div
                className={`h-16 w-16 rounded-full p-[2.5px] transition-transform duration-200 group-hover:scale-105 ${
                  st.isUser
                    ? "border-2 border-dashed border-blue-500 bg-slate-50 dark:bg-slate-900 flex items-center justify-center"
                    : `bg-gradient-to-tr ${st.color}`
                }`}
              >
                <div className="h-full w-full rounded-full bg-white dark:bg-[#0d1424] flex items-center justify-center font-bold text-xs text-slate-800 dark:text-white">
                  {st.isUser ? (
                    <Plus className="h-6 w-6 text-blue-600 dark:text-sky-400" />
                  ) : (
                    <span>{st.apt}</span>
                  )}
                </div>
              </div>
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-sky-400 text-center max-w-[75px] truncate">
                {st.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          2. UNIFIED DUAL SECTION: SOSYAL AKIŞ & CANLI SOHBET
      ══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Sol Kolon (7 Cols): Feed Posts */}
        <div className="lg:col-span-7 space-y-5">
              
              {/* Quick Post Box for Management */}
              <div className="bg-white dark:bg-[#0d1424] rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                <form onSubmit={handleCreatePost} className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full p-[2px] bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 shrink-0">
                      <div className="h-full w-full rounded-full bg-white dark:bg-[#0d1424] p-[1px]">
                        <div className="h-full w-full rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-blue-600 dark:text-sky-400">
                          YNT
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <textarea
                        rows={2}
                        value={newPostText}
                        onChange={(e) => setNewPostText(e.target.value)}
                        placeholder="Bina sakinleriyle bir duyuru veya komşuluk fotoğrafı paylaşın..."
                        className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500/20 resize-none transition-all text-slate-900 dark:text-white"
                      />
                      {showImageInput && (
                        <div className="flex items-center gap-2">
                          <input
                            type="url"
                            placeholder="Fotoğraf görsel URL'si yapıştırın (https://...)"
                            value={newPostImageUrl}
                            onChange={(e) => setNewPostImageUrl(e.target.value)}
                            className="flex-1 text-xs px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setNewPostImageUrl("");
                              setShowImageInput(false);
                            }}
                            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1 cursor-pointer"
                          >
                            İptal
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions & Submit */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setShowImageInput(!showImageInput)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Camera className="h-4 w-4 text-blue-600 dark:text-sky-400" />
                      <span>{showImageInput ? "Görsel Alanını Kapat" : "Fotoğraf Ekle"}</span>
                    </button>

                    <button
                      type="submit"
                      disabled={!newPostText.trim()}
                      className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all disabled:opacity-40 cursor-pointer shadow-xs"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Paylaş</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Feed Stream */}
              <div className="space-y-5">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white dark:bg-[#0d1424] rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors"
                  >
                    {/* 1. POST HEADER */}
                    <header className="px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full p-[2px] bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 shrink-0">
                          <div className="h-full w-full rounded-full bg-white dark:bg-[#0d1424] p-[1.5px]">
                            <div className="h-full w-full rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-blue-600 dark:text-sky-400">
                              {post.author.apt}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white cursor-pointer hover:underline">
                              {post.author.name}
                            </span>
                            {post.author.isManagement && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-blue-600 dark:text-sky-400 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800/60">
                                <CheckCircle2 className="h-3 w-3 inline text-blue-600 dark:text-sky-400" />
                                <span>Yönetim</span>
                              </span>
                            )}
                            <span className="text-slate-300 dark:text-slate-600 text-xs">•</span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                              {post.time}
                            </span>
                            {post.isPinned && (
                              <>
                                <span className="text-slate-300 dark:text-slate-600 text-xs">•</span>
                                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800/50">
                                  <Pin className="h-2.5 w-2.5" /> Sabit
                                </span>
                              </>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">Daire: {post.author.apt}</p>
                        </div>
                      </div>

                      {/* Right: Moderation */}
                      <button
                        type="button"
                        onClick={() => handleDeletePost(post.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Gönderiyi Akıştan Kaldır (Moderatör)"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </header>

                    {/* 2. POST MEDIA / IMAGE */}
                    {post.imageUrl && (
                      <div
                        className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-slate-100 dark:bg-slate-900 overflow-hidden cursor-pointer select-none group"
                        onDoubleClick={() => handleQuickReactionToggle(post.id)}
                      >
                        <img
                          src={post.imageUrl}
                          alt="Komşuluk Paylaşımı"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-mono flex items-center gap-1.5">
                          <Camera className="h-3 w-3" />
                          <span>Komşu Fotoğrafı</span>
                        </div>
                      </div>
                    )}

                    {/* 3. POST ACTION BAR (FACEBOOK-STYLE MULTI-EMOJI REACTIONS & COMMENTS) */}
                    <div className="px-4 pt-3 pb-1 flex items-center justify-between relative">
                      <div className="flex items-center gap-3">
                        {/* Reaction Picker Container */}
                        <div
                          className="relative"
                          onMouseEnter={() => setActiveReactionPostId(post.id)}
                        >
                          {/* Floating Reaction Dock */}
                          {activeReactionPostId === post.id && (
                            <div
                              onMouseLeave={() => setActiveReactionPostId(null)}
                              className="absolute -top-13 left-0 z-30 bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 rounded-full px-3 py-1.5 shadow-2xl flex items-center gap-2.5 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md"
                            >
                              {REACTIONS.map((r) => (
                                <button
                                  key={r.type}
                                  type="button"
                                  onClick={() => handleReactToPost(post.id, r.type)}
                                  className="group/emoji relative text-2xl transform hover:scale-135 hover:-translate-y-1.5 active:scale-105 transition-all duration-150 cursor-pointer p-0.5 select-none"
                                >
                                  <span>{r.emoji}</span>
                                  {/* Tooltip */}
                                  <span className="opacity-0 group-hover/emoji:opacity-100 transition-opacity absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full pointer-events-none whitespace-nowrap shadow-md">
                                    {r.label}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Reaction Button */}
                          <button
                            type="button"
                            onClick={() => handleQuickReactionToggle(post.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all cursor-pointer font-bold text-xs"
                          >
                            {post.userReaction ? (
                              <>
                                <span className="text-base">
                                  {REACTIONS.find((r) => r.type === post.userReaction)?.emoji}
                                </span>
                                <span className={REACTIONS.find((r) => r.type === post.userReaction)?.color}>
                                  {REACTIONS.find((r) => r.type === post.userReaction)?.label}
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="text-base">👍</span>
                                <span className="text-slate-600 dark:text-slate-300">Tepki Ver</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Comment Button */}
                        <button
                          type="button"
                          onClick={() => {
                            const inputEl = document.getElementById(`comment-input-${post.id}`);
                            inputEl?.focus();
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer font-semibold text-xs"
                          title="Yorum Yap"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>Yorum ({post.comments.length})</span>
                        </button>
                      </div>

                      <span className="text-[11px] font-mono text-slate-400">
                        🔒 Bina İçi
                      </span>
                    </div>

                    {/* 4. REACTIONS BREAKDOWN / SUMMARY */}
                    <div className="px-4 pt-1.5">
                      {getTotalReactions(post.reactions) > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center -space-x-1.5">
                            {getActiveReactions(post.reactions)
                              .slice(0, 3)
                              .map((r) => (
                                <span
                                  key={r.type}
                                  className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-[#0d1424] text-xs shadow-2xs"
                                  title={`${r.label}: ${post.reactions[r.type]}`}
                                >
                                  {r.emoji}
                                </span>
                              ))}
                          </div>
                          <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                            {getTotalReactions(post.reactions)} komşu tepki verdi
                          </span>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400">
                          İlk tepkiyi bırakan komşu siz olun
                        </p>
                      )}
                    </div>

                    {/* 5. CAPTION */}
                    <div className="px-4 pt-1.5 space-y-1 text-xs sm:text-sm leading-relaxed">
                      <p className="text-slate-800 dark:text-slate-200">
                        <span className="font-bold text-slate-900 dark:text-white mr-2">
                          {post.author.name}
                        </span>
                        <span>{post.content}</span>
                      </p>
                    </div>

                    {/* 6. COMMENTS PREVIEW */}
                    <div className="px-4 pt-2 pb-1 space-y-1">
                      {post.comments.length > 2 && (
                        <button
                          type="button"
                          className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer block"
                        >
                          Tüm {post.comments.length} yorumu gör
                        </button>
                      )}

                      {post.comments.map((comment) => (
                        <div key={comment.id} className="text-xs flex items-baseline justify-between gap-2">
                          <p className="text-slate-800 dark:text-slate-200">
                            <span className="font-bold text-slate-900 dark:text-white mr-1.5">
                              {comment.author}
                            </span>
                            <span className="text-[10px] text-blue-600 dark:text-sky-400 font-mono mr-1.5">({comment.apt})</span>
                            <span>{comment.text}</span>
                          </p>
                          <span className="text-[10px] text-slate-400 shrink-0">{comment.time}</span>
                        </div>
                      ))}

                      <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 pt-1">
                        {post.time}
                      </p>
                    </div>

                    {/* 7. INLINE COMMENT COMPOSER (EXACT SOCIAL FEED STYLE) */}
                    <div className="mt-2 px-4 py-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-3">
                      <Smile className="h-5 w-5 text-slate-400 dark:text-slate-500 shrink-0 cursor-pointer hover:text-slate-600 dark:hover:text-slate-300 transition-colors" />
                      <input
                        id={`comment-input-${post.id}`}
                        type="text"
                        placeholder="Bir komşu yorumu ekle..."
                        value={commentInputs[post.id] || ""}
                        onChange={(e) =>
                          setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddComment(post.id);
                        }}
                        className="flex-1 text-xs bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddComment(post.id)}
                        disabled={!(commentInputs[post.id] || "").trim()}
                        className="text-xs font-bold text-blue-600 dark:text-sky-400 hover:text-blue-700 dark:hover:text-sky-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                      >
                        Paylaş
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>

        {/* SAĞ KOLON (5 COLS): TEMATİK KOMŞU SOHBET KANALLARI & CANLI İLETİŞİM */}
        <div className="lg:col-span-5 space-y-5">
          {/* Yönetici & Moderatör Profil Kartı (Social Sidebar Style) */}
          <div className="bg-white dark:bg-[#0d1424] rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between transition-colors">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full p-[2px] bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 shrink-0">
                <div className="h-full w-full rounded-full bg-white dark:bg-[#0d1424] p-[1.5px]">
                  <div className="h-full w-full rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    YNT
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Bina Yönetim Portalı</span>
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 dark:text-sky-400" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  <span>Canlı Moderasyon Aktif</span>
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold text-blue-600 dark:text-sky-400 bg-blue-50 dark:bg-blue-950/80 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800">
              {channels.length} Kanal
            </span>
          </div>

          {/* Sohbet Kanalları & Bireysel Komşu Mesajları Kartı */}
          <div className="bg-white dark:bg-[#0d1424] rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
            {/* Header Tabs: Bina Kanalları vs Özel Mesajlar (DM) */}
            <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCommMode("CHANNELS")}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  commMode === "CHANNELS"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/60"
                }`}
              >
                <MessagesSquare className="h-4 w-4" />
                <span>Bina Kanalları ({channels.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setCommMode("DIRECT")}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer relative ${
                  commMode === "DIRECT"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/60"
                }`}
              >
                <Users className="h-4 w-4" />
                <span>Özel Komşu DM</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </button>
            </div>

            {/* TAB 1: BİNA SOHBET KANALLARI (#) */}
            {commMode === "CHANNELS" ? (
              <>
                {/* Subheader */}
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Tematik Kanallar</span>
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Bina geneli ortak konular ve canlı akış
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowNewChannelModal(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-sky-300 border border-blue-200 dark:border-blue-800 text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/60 cursor-pointer"
                    title="Yeni Kanal Ekle"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Kanal</span>
                  </button>
                </div>

                {/* Kanal Seçim Çipleri */}
                <div className="p-3 bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                  {channels.map((ch) => {
                    const isSelected = selectedChannelId === ch.id;
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => setSelectedChannelId(ch.id)}
                        className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-blue-600 text-white shadow-xs"
                            : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <span>#</span>
                        <span>{ch.name}</span>
                        {ch.isAnnouncementOnly && <Lock className="h-2.5 w-2.5 opacity-70" />}
                      </button>
                    );
                  })}
                </div>

                {/* Seçili Kanal Başlığı */}
                <div className="px-4 py-2.5 bg-slate-50/40 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                    #{channels.find((c) => c.id === selectedChannelId)?.name || "Kanal"}
                    {channels.find((c) => c.id === selectedChannelId)?.isAnnouncementOnly && (
                      <span className="ml-2 text-[10px] font-mono bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded">
                        Yalnızca Yönetim
                      </span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => fetchMessages(selectedChannelId)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                    title="Yenile"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${loadingMessages ? "animate-spin" : ""}`} />
                  </button>
                </div>

                {/* Mesaj Akışı */}
                <div className="p-4 space-y-2.5 overflow-y-auto max-h-[340px] min-h-[260px]">
                  {loadingMessages ? (
                    <div className="text-center py-12 text-xs text-slate-400">Mesajlar yükleniyor...</div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-12 text-xs text-slate-400">Bu kanalda henüz mesaj bulunmuyor.</div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-2.5 group"
                      >
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {msg.author?.name || "Sakin"}
                            </span>
                            <span className="text-[10px] font-mono text-blue-600 dark:text-sky-400 font-bold bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.2 rounded">
                              D.{msg.author?.apartmentNo || "—"}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(msg.createdAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                            {msg.content}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer shrink-0"
                          title="Mesajı Sil (Moderasyon)"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Input Bar */}
                <form onSubmit={handleSendChannelMessage} className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Yönetici olarak mesaj yazın..."
                    value={channelMessageText}
                    onChange={(e) => setChannelMessageText(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={!channelMessageText.trim()}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold disabled:opacity-40 cursor-pointer shrink-0"
                  >
                    Gönder
                  </button>
                </form>
              </>
            ) : (
              /* TAB 2: BİREYSEL / ÖZEL KOMŞU SOHBETLERİ (DM) */
              <>
                {/* Neighbor Selector Horizontal Bar */}
                <div className="p-3 bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
                  {NEIGHBORS.map((nbr) => {
                    const isSelected = selectedNeighborId === nbr.id;
                    return (
                      <button
                        key={nbr.id}
                        type="button"
                        onClick={() => setSelectedNeighborId(nbr.id)}
                        className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-blue-600 text-white shadow-xs"
                            : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <span className="relative flex h-2 w-2">
                          {nbr.isOnline && (
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          )}
                          <span
                            className={`relative inline-flex rounded-full h-2 w-2 ${
                              nbr.isOnline ? "bg-emerald-500" : "bg-slate-400"
                            }`}
                          />
                        </span>
                        <span>{nbr.name}</span>
                        <span className="font-mono text-[10px] opacity-75">(D.{nbr.apartmentNo})</span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Neighbor Header & Privacy Shield */}
                {(() => {
                  const currentNeighbor = NEIGHBORS.find((n) => n.id === selectedNeighborId) || NEIGHBORS[0];
                  const currentThread = directMessages[currentNeighbor.id] || [];
                  return (
                    <>
                      <div className="px-4 py-3 bg-slate-50/40 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`h-8 w-8 rounded-full bg-gradient-to-tr ${currentNeighbor.avatarBg} text-white font-bold flex items-center justify-center text-xs shrink-0`}
                          >
                            D.{currentNeighbor.apartmentNo}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 dark:text-white">
                                {currentNeighbor.name}
                              </span>
                              <span className="text-[10px] font-mono text-blue-600 dark:text-sky-400 font-bold bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.2 rounded">
                                Daire {currentNeighbor.apartmentNo}
                              </span>
                            </div>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                              <span>{currentNeighbor.isOnline ? "Çevrimiçi" : "Son görülme bugün"}</span>
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/50">
                          🔒 Telefon Gizli
                        </span>
                      </div>

                      {/* Direct Message Bubbles Stream */}
                      <div className="p-4 space-y-3 overflow-y-auto max-h-[340px] min-h-[260px] bg-slate-50/30 dark:bg-[#070b14]/50">
                        {currentThread.length === 0 ? (
                          <div className="text-center py-12 text-xs text-slate-400">
                            {currentNeighbor.name} ile henüz özel mesajlaşma başlamadı. Bir komşuluk mesajı gönderin!
                          </div>
                        ) : (
                          currentThread.map((msg) => (
                            <div
                              key={msg.id}
                              className={`flex flex-col ${
                                msg.sender === "manager" ? "items-end" : "items-start"
                              }`}
                            >
                              <div
                                className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                                  msg.sender === "manager"
                                    ? "bg-blue-600 text-white rounded-br-xs"
                                    : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-xs"
                                }`}
                              >
                                <p>{msg.text}</p>
                              </div>
                              <span className="text-[10px] text-slate-400 mt-1 px-1 font-mono">
                                {msg.time}
                              </span>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Direct Message Input Bar */}
                      <form
                        onSubmit={handleSendDirectMessage}
                        className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2"
                      >
                        <input
                          type="text"
                          placeholder={`${currentNeighbor.name} (D.${currentNeighbor.apartmentNo}) komşunuza özel mesaj...`}
                          value={dmInputText}
                          onChange={(e) => setDmInputText(e.target.value)}
                          className="flex-1 px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <button
                          type="submit"
                          disabled={!dmInputText.trim()}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold disabled:opacity-40 cursor-pointer shrink-0"
                        >
                          Gönder
                        </button>
                      </form>
                    </>
                  );
                })()}
              </>
            )}
          </div>

          {/* Komşuluk İlkeleri Kartı */}
          <div className="bg-white dark:bg-[#0d1424] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 transition-colors">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Komşuluk İlkeleri &amp; Moderasyon</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Sakinler fotoğraf paylaşabilir, ödünç eşya isteyebilir ve sohbet edebilir.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Yönetici olarak uygunsuz içerikleri ve mesajları tek tıkla silebilirsiniz.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Hikayeler 24 saat sonra otomatik olarak arşivlenir.</span>
              </li>
            </ul>
          </div>
        </div>

      </div>

      {/* ══════════ MODAL: STORY VIEWER ══════════ */}
      {activeStory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-800 relative animate-in fade-in zoom-in-95 duration-200">
            {/* Story Progress Bar */}
            <div className="h-1 w-full bg-slate-800 rounded-full mb-4 overflow-hidden">
              <div className="h-full bg-blue-500 w-full animate-pulse" />
            </div>

            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs text-white shrink-0 overflow-hidden shadow-xs">
                  {activeStory.apt.length > 3 ? "YNT" : activeStory.apt}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{activeStory.name}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">{activeStory.time}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveStory(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="py-6 text-center space-y-4">
              <span className="text-xs font-bold text-blue-400 bg-blue-950 px-3 py-1 rounded-full border border-blue-800">
                {activeStory.label}
              </span>
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                {activeStory.content}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">24 Saat Sonra Silinir</span>
              <button
                type="button"
                onClick={() => {
                  setStories(stories.filter((s) => s.id !== activeStory.id));
                  setActiveStory(null);
                  showAlert({ title: "Silindi", message: "Hikaye kaldırıldı.", variant: "success" });
                }}
                className="text-rose-400 hover:text-rose-300 font-bold"
              >
                Hikayeyi Kaldır
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ MODAL: CREATE STORY ══════════ */}
      {showNewStoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d1424] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Yeni Hikaye Yayınla</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewStoryModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Hikaye Etiketi / Başlığı
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Duyuru 📌, Bakım 🔧, Çay Saati ☕️"
                  value={newStoryTitle}
                  onChange={(e) => setNewStoryTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Hikaye Metni
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="24 saat boyunca tüm sakinlerin hikaye çubuğunda görünecek metni yazın..."
                  value={newStoryText}
                  onChange={(e) => setNewStoryText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewStoryModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs cursor-pointer"
                >
                  Yayınla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════ MODAL: CREATE CHANNEL ══════════ */}
      {showNewChannelModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d1424] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Yeni Komşuluk Kanalı Ekle</h3>
              <button
                type="button"
                onClick={() => setShowNewChannelModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateChannel} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Kanal Adı
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Evcil Hayvanlar, İmece & Bahçe"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Açıklama
                </label>
                <input
                  type="text"
                  placeholder="Kanalın amacını belirten kısa açıklama"
                  value={newChannelDesc}
                  onChange={(e) => setNewChannelDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="announcementOnly"
                  checked={newChannelAnnouncementOnly}
                  onChange={(e) => setNewChannelAnnouncementOnly(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="announcementOnly" className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  Yalnızca yönetim mesaj yazabilsin (Duyuru Kanalı)
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewChannelModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={savingChannel}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs disabled:opacity-50"
                >
                  {savingChannel ? "Kaydediliyor..." : "Kanalı Oluştur"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
