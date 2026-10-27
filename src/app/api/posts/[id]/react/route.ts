import { NextResponse } from "next/server";
import { getPlatformDb } from "@/db/platform";
import { communityPostReactions, users } from "@/db/schema";
import { getSession } from "@/lib/session";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id: postId } = await context.params;
    const db = await getPlatformDb();
    const session = await getSession();
    const body = (await request.json()) as Record<string, any>;
    const reactionType = String(body.reaction || "like").toLowerCase();

    const rxId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `rx_${Date.now()}`;
    const userId = session?.id || body.userId || (await db.select({ id: users.id }).from(users).limit(1))[0]?.id;

    try {
      await db.insert(communityPostReactions).values({
        id: rxId,
        postId,
        userId,
        reactionType,
      });
    } catch {
      // already reacted
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Tepki kaydedilemedi." }, { status: 500 });
  }
}
