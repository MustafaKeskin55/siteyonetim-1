import { NextResponse } from "next/server";
import { getPlatformDb } from "@/db/platform";
import { communityPosts, communityPostComments, communityPostReactions, users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const db = await getPlatformDb();

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

      allReactions = await db.select().from(communityPostReactions);
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
        authorName: p.authorName || "Komşu",
        authorApt: p.authorApt || "Daire",
        authorRole: p.authorRole === "ADMIN" ? "Yönetici" : "Kat Maliki",
        isPinned: Boolean(p.isPinned),
        imageUrl: p.imageUrl,
        timeAgo: p.createdAt || "Yeni",
        comments: postComments,
        reactions: reactionCounts,
      };
    });

    return NextResponse.json(posts);
  } catch (error: any) {
    console.error("GET /api/posts error:", error);
    return NextResponse.json({ error: "Paylaşımlar yüklenemedi." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = await getPlatformDb();
    const session = await getSession();
    const body = (await request.json()) as Record<string, any>;
    const content = String(body.content || "").trim();

    if (!content) {
      return NextResponse.json({ error: "Paylaşım içeriği boş olamaz." }, { status: 400 });
    }

    const id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `p_${Date.now()}`;
    const authorId = session?.id || body.authorId || (await db.select({ id: users.id }).from(users).limit(1))[0]?.id;

    await db.insert(communityPosts).values({
      id,
      siteId: session?.siteId || body.siteId || "site-default",
      authorId,
      content,
      imageUrl: body.imageUrl || null,
      isPinned: Boolean(body.isPinned),
    });

    return NextResponse.json({ success: true, id, message: "Paylaşım oluşturuldu." });
  } catch (error: any) {
    console.error("POST /api/posts error:", error);
    return NextResponse.json({ error: "Paylaşım kaydedilemedi." }, { status: 500 });
  }
}
