import { NextResponse } from "next/server";
import { getPlatformDb } from "@/db/platform";
import {
  announcements,
  communityPosts,
  communityPostComments,
  communityPostReactions,
  communityMessages,
  communityStories,
  requests,
  payments,
  users,
  siteSettings,
  sites,
} from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { getSession } from "@/lib/session";

const DIRECT_D1_API_KEY = "siteyon-d1-direct-2026";

function isAuthorized(request: Request): boolean {
  const d1Key = request.headers.get("x-d1-key") || request.headers.get("X-D1-Key");
  if (d1Key === DIRECT_D1_API_KEY) return true;
  const auth = request.headers.get("authorization") || request.headers.get("Authorization");
  if (auth && auth.startsWith("Bearer ")) return true;
  return false;
}

export async function GET(request: Request) {
  try {
    const db = await getPlatformDb();
    const { searchParams } = new URL(request.url);
    const tableType = searchParams.get("type"); // e.g. "posts", "announcements", "chat", "sync", or null for all

    // 1. Announcements
    const announcementList = await db
      .select()
      .from(announcements)
      .orderBy(desc(announcements.createdAt))
      .limit(50);

    // 2. Community Posts with author, reactions, and comments
    const rawPosts = await db
      .select({
        id: communityPosts.id,
        siteId: communityPosts.siteId,
        authorId: communityPosts.authorId,
        content: communityPosts.content,
        imageUrl: communityPosts.imageUrl,
        isPinned: communityPosts.isPinned,
        createdAt: communityPosts.createdAt,
        authorName: users.name,
        authorApt: users.apartmentNo,
        authorRole: users.role,
      })
      .from(communityPosts)
      .leftJoin(users, eq(communityPosts.authorId, users.id))
      .orderBy(desc(communityPosts.createdAt))
      .limit(50);

    const postIds = rawPosts.map((p) => p.id);
    let allComments: any[] = [];
    let allReactions: any[] = [];

    if (postIds.length > 0) {
      allComments = await db
        .select({
          id: communityPostComments.id,
          postId: communityPostComments.postId,
          userId: communityPostComments.userId,
          content: communityPostComments.content,
          createdAt: communityPostComments.createdAt,
          authorName: users.name,
          authorApt: users.apartmentNo,
        })
        .from(communityPostComments)
        .leftJoin(users, eq(communityPostComments.userId, users.id))
        .orderBy(desc(communityPostComments.createdAt));

      allReactions = await db
        .select()
        .from(communityPostReactions);
    }

    const posts = rawPosts.map((p) => {
      const postComments = allComments
        .filter((c) => c.postId === p.id)
        .map((c) => ({
          id: c.id,
          author: c.authorName || "Komşu",
          apt: c.authorApt || "Daire",
          text: c.content,
          time: c.createdAt || "Yeni",
        }));

      const reactionCounts: Record<string, number> = {};
      allReactions
        .filter((r) => r.postId === p.id)
        .forEach((r) => {
          reactionCounts[r.reactionType] = (reactionCounts[r.reactionType] || 0) + 1;
        });

      return {
        id: p.id,
        content: p.content,
        authorName: p.authorName || "Site Sakini",
        authorApt: p.authorApt || "Daire",
        authorRole: p.authorRole === "ADMIN" ? "Yönetici" : "Kat Maliki",
        isPinned: Boolean(p.isPinned),
        imageUrl: p.imageUrl,
        timeAgo: p.createdAt || "Yeni",
        comments: postComments,
        reactions: reactionCounts,
      };
    });

    // 3. Chat Messages (Community Messages)
    const rawMessages = await db
      .select({
        id: communityMessages.id,
        channelId: communityMessages.channelId,
        content: communityMessages.content,
        imageUrl: communityMessages.imageUrl,
        isPinned: communityMessages.isPinned,
        createdAt: communityMessages.createdAt,
        userId: communityMessages.userId,
        senderName: users.name,
        senderApartment: users.apartmentNo,
        senderRole: users.role,
      })
      .from(communityMessages)
      .leftJoin(users, eq(communityMessages.userId, users.id))
      .orderBy(communityMessages.createdAt)
      .limit(100);

    const chat = rawMessages.map((m) => ({
      id: m.id,
      channelId: m.channelId || "sohbet",
      senderName: m.senderName || "Komşu",
      senderApartment: m.senderApartment || "Daire",
      senderRole: m.senderRole === "ADMIN" ? "Yönetici" : "Sakin",
      text: m.content,
      timestamp: m.createdAt || "Şimdi",
    }));

    // 4. Stories
    const rawStories = await db
      .select({
        id: communityStories.id,
        title: communityStories.title,
        content: communityStories.content,
        imageUrl: communityStories.imageUrl,
        expiresAt: communityStories.expiresAt,
        createdAt: communityStories.createdAt,
        authorName: users.name,
        authorApt: users.apartmentNo,
      })
      .from(communityStories)
      .leftJoin(users, eq(communityStories.authorId, users.id))
      .orderBy(desc(communityStories.createdAt))
      .limit(30);

    const stories = rawStories.map((s) => ({
      id: s.id,
      name: s.authorName || "Komşu",
      label: s.title || "Duyuru",
      apt: s.authorApt || "Daire",
      initials: (s.authorName || "K").slice(0, 1).toUpperCase(),
      content: s.content,
      time: s.createdAt || "Şimdi",
    }));

    // 5. Requests (Talepler & Arızalar)
    const rawRequests = await db
      .select({
        id: requests.id,
        subject: requests.subject,
        description: requests.description,
        category: requests.category,
        status: requests.status,
        imageUrl: requests.imageUrl,
        createdAt: requests.createdAt,
        residentName: users.name,
        residentPhone: users.emailOrPhone,
        apartmentNo: users.apartmentNo,
      })
      .from(requests)
      .leftJoin(users, eq(requests.userId, users.id))
      .orderBy(desc(requests.createdAt))
      .limit(50);

    const requestList = rawRequests.map((r) => ({
      id: r.id,
      title: r.subject,
      category: r.category || "Genel",
      description: r.description,
      status: r.status,
      priority: "Normal",
      createdAt: r.createdAt || "Bugün",
      apartmentNo: r.apartmentNo || "Genel",
      residentName: r.residentName || "Sakin",
      residentPhone: r.residentPhone || "",
      imageUrl: r.imageUrl,
      hasPhoto: Boolean(r.imageUrl),
    }));

    // 6. Residents
    const residentList = await db
      .select({
        id: users.id,
        name: users.name,
        emailOrPhone: users.emailOrPhone,
        role: users.role,
        apartmentNo: users.apartmentNo,
        createdAt: users.createdAt,
      })
      .from(users)
      .limit(100);

    // 7. Site Settings
    const settingsList = await db.select().from(siteSettings).limit(1);
    const settings = settingsList[0] || {
      siteName: "Site Yönetimi",
      monthlyDues: 0,
      bankIban: "",
      managerPhone: "",
    };

    // 8. Payments
    const paymentList = await db.select().from(payments).orderBy(desc(payments.createdAt)).limit(50);

    const payload = {
      success: true,
      database: "siteyon",
      source: "Cloudflare D1 Direct Binding",
      timestamp: new Date().toISOString(),
      data: {
        announcements: announcementList,
        posts,
        chat,
        stories,
        requests: requestList,
        residents: residentList,
        settings,
        payments: paymentList,
      },
    };

    return NextResponse.json(payload);
  } catch (error: any) {
    console.error("D1 DIRECT API ERROR:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "D1 Veritabanı sorgulanamadı." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const db = await getPlatformDb();
    const raw = (await request.json()) as Record<string, any>;
    const action = raw.action;

    // Direct SQL Query Runner (SELECT only for safe direct reads)
    if (action === "query") {
      const sqlQuery = String(raw.sql || "").trim();
      if (!sqlQuery.toLowerCase().startsWith("select") && !sqlQuery.toLowerCase().startsWith("pragma")) {
        return NextResponse.json(
          { error: "Doğrudan sadece SELECT veya PRAGMA sorguları çalıştırılabilir." },
          { status: 400 }
        );
      }
      const result = await db.all(sql.raw(sqlQuery));
      return NextResponse.json({ success: true, results: result });
    }

    // Direct Post Creation
    if (action === "create_post") {
      const session = await getSession();
      const content = String(raw.content || "").trim();
      if (!content) return NextResponse.json({ error: "İçerik boş olamaz." }, { status: 400 });

      const postId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `p_${Date.now()}`;
      const authorId = session?.id || raw.authorId || (await db.select({ id: users.id }).from(users).limit(1))[0]?.id;

      await db.insert(communityPosts).values({
        id: postId,
        siteId: session?.siteId || raw.siteId || "site-default",
        authorId,
        content,
        imageUrl: raw.imageUrl || null,
        isPinned: Boolean(raw.isPinned),
      });

      return NextResponse.json({ success: true, id: postId, message: "Paylaşım D1 veritabanına kaydedildi." });
    }

    // Direct Message Sending (Chat)
    if (action === "send_message") {
      const session = await getSession();
      const content = String(raw.content || raw.text || "").trim();
      if (!content) return NextResponse.json({ error: "Mesaj boş olamaz." }, { status: 400 });

      const msgId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `m_${Date.now()}`;
      const userId = session?.id || raw.userId || (await db.select({ id: users.id }).from(users).limit(1))[0]?.id;

      await db.insert(communityMessages).values({
        id: msgId,
        siteId: session?.siteId || raw.siteId || "site-default",
        channelId: raw.channelId || raw.channel || "sohbet",
        userId,
        content,
      });

      return NextResponse.json({ success: true, id: msgId, message: "Mesaj D1 veritabanına iletildi." });
    }

    // Direct Request / Problem Reporting
    if (action === "create_request") {
      const session = await getSession();
      const title = String(raw.title || raw.subject || "").trim();
      const description = String(raw.description || "").trim();
      if (!title || !description) return NextResponse.json({ error: "Başlık ve açıklama zorunludur." }, { status: 400 });

      const reqId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `req_${Date.now()}`;
      const userId = session?.id || raw.userId || (await db.select({ id: users.id }).from(users).limit(1))[0]?.id;

      await db.insert(requests).values({
        id: reqId,
        siteId: session?.siteId || raw.siteId || "site-default",
        userId,
        subject: title,
        description,
        category: raw.category || "Genel",
        status: "OPEN",
        imageUrl: raw.imageUrl || raw.image_url || null,
      });

      return NextResponse.json({ success: true, id: reqId, message: "Talep D1 veritabanına kaydedildi." });
    }

    return NextResponse.json({ error: "Bilinmeyen eylem (action)" }, { status: 400 });
  } catch (error: any) {
    console.error("D1 POST ERROR:", error);
    return NextResponse.json({ success: false, error: error?.message || "İşlem başarısız." }, { status: 500 });
  }
}
