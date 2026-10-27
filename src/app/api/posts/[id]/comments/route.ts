import { NextResponse } from "next/server";
import { getPlatformDb } from "@/db/platform";
import { communityPostComments, users } from "@/db/schema";
import { getSession } from "@/lib/session";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id: postId } = await context.params;
    const db = await getPlatformDb();
    const session = await getSession();
    const body = (await request.json()) as Record<string, any>;
    const text = String(body.text || body.content || "").trim();

    if (!text) {
      return NextResponse.json({ error: "Yorum boş olamaz." }, { status: 400 });
    }

    const commentId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `c_${Date.now()}`;
    const userId = session?.id || body.userId || (await db.select({ id: users.id }).from(users).limit(1))[0]?.id;

    await db.insert(communityPostComments).values({
      id: commentId,
      postId,
      userId,
      content: text,
    });

    return NextResponse.json({ success: true, id: commentId, message: "Yorum eklendi." });
  } catch (error: any) {
    return NextResponse.json({ error: "Yorum kaydedilemedi." }, { status: 500 });
  }
}
