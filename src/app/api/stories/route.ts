import { NextResponse } from "next/server";
import { getPlatformDb } from "@/db/platform";
import { communityStories, users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const db = await getPlatformDb();

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

    return NextResponse.json(stories);
  } catch (error: any) {
    console.error("GET /api/stories error:", error);
    return NextResponse.json({ error: "Hikayeler yüklenemedi." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = await getPlatformDb();
    const session = await getSession();
    const body = (await request.json()) as Record<string, any>;
    const content = String(body.content || "").trim();

    if (!content) {
      return NextResponse.json({ error: "Hikaye içeriği boş olamaz." }, { status: 400 });
    }

    const id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `s_${Date.now()}`;
    const authorId = session?.id || body.authorId || (await db.select({ id: users.id }).from(users).limit(1))[0]?.id;

    await db.insert(communityStories).values({
      id,
      siteId: session?.siteId || body.siteId || "site-default",
      authorId,
      title: body.label || body.title || "Duyuru",
      content,
      imageUrl: body.imageUrl || null,
    });

    return NextResponse.json({ success: true, id, message: "Hikaye paylaşıldı." });
  } catch (error: any) {
    console.error("POST /api/stories error:", error);
    return NextResponse.json({ error: "Hikaye kaydedilemedi." }, { status: 500 });
  }
}
