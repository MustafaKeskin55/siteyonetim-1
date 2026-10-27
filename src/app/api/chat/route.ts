import { NextResponse } from "next/server";
import { getPlatformDb } from "@/db/platform";
import { communityMessages, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/session";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const channelId = searchParams.get("channel") || "sohbet";
    const db = await getPlatformDb();

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
      .where(eq(communityMessages.channelId, channelId))
      .orderBy(communityMessages.createdAt)
      .limit(100);

    const messages = rawMessages.map((m) => ({
      id: m.id,
      channelId: m.channelId || channelId,
      senderName: m.senderName || "Komşu",
      senderApartment: m.senderApartment || "Daire",
      senderRole: m.senderRole === "ADMIN" ? "Yönetici" : "Sakin",
      text: m.content,
      timestamp: m.createdAt || "Şimdi",
    }));

    return NextResponse.json(messages);
  } catch (error: any) {
    console.error("GET /api/chat error:", error);
    return NextResponse.json({ error: "Mesajlar yüklenemedi." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = await getPlatformDb();
    const session = await getSession();
    const body = (await request.json()) as Record<string, any>;
    const content = String(body.text || body.content || "").trim();
    const channelId = String(body.channel || body.channelId || "sohbet").trim();

    if (!content) {
      return NextResponse.json({ error: "Mesaj içeriği boş olamaz." }, { status: 400 });
    }

    const id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `m_${Date.now()}`;
    const userId = session?.id || body.userId || (await db.select({ id: users.id }).from(users).limit(1))[0]?.id;

    await db.insert(communityMessages).values({
      id,
      siteId: session?.siteId || body.siteId || "site-default",
      channelId,
      userId,
      content,
    });

    return NextResponse.json({ success: true, id, message: "Mesaj gönderildi." });
  } catch (error: any) {
    console.error("POST /api/chat error:", error);
    return NextResponse.json({ error: "Mesaj kaydedilemedi." }, { status: 500 });
  }
}
