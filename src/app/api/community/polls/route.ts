import { NextResponse } from "next/server";
import { and, eq, inArray, desc } from "drizzle-orm";
import { getSession } from "@/lib/session";
import { acquireDatabase, databaseUnavailable } from "@/server/database/access";
import {
  communityPolls,
  communityPollVotes,
  communityChannels,
  users,
} from "@/db/schema";

export async function GET() {
  const session = await getSession();
  if (!session || !session.id) {
    return NextResponse.json({ error: "Oturum açmanız gerekiyor" }, { status: 401 });
  }

  const siteId = session.siteId || "default_site";
  const d = await acquireDatabase();
  if (!d.ok) return await databaseUnavailable();

  try {
    const polls = await d.db
      .select({
        id: communityPolls.id,
        siteId: communityPolls.siteId,
        channelId: communityPolls.channelId,
        question: communityPolls.question,
        options: communityPolls.options,
        expiresAt: communityPolls.expiresAt,
        createdAt: communityPolls.createdAt,
        channelName: communityChannels.name,
        creatorName: users.name,
      })
      .from(communityPolls)
      .leftJoin(communityChannels, eq(communityPolls.channelId, communityChannels.id))
      .leftJoin(users, eq(communityPolls.createdBy, users.id))
      .where(eq(communityPolls.siteId, siteId))
      .orderBy(desc(communityPolls.createdAt));

    if (polls.length === 0) return NextResponse.json([]);

    const pollIds = polls.map((p) => p.id);

    const votes = await d.db
      .select({
        id: communityPollVotes.id,
        pollId: communityPollVotes.pollId,
        userId: communityPollVotes.userId,
        optionIndex: communityPollVotes.optionIndex,
        createdAt: communityPollVotes.createdAt,
        voterName: users.name,
        apartmentNo: users.apartmentNo,
      })
      .from(communityPollVotes)
      .leftJoin(users, eq(communityPollVotes.userId, users.id))
      .where(inArray(communityPollVotes.pollId, pollIds));

    const now = new Date();

    const result = polls.map((p) => {
      let parsedOptions: string[] = [];
      try {
        parsedOptions = JSON.parse(p.options || "[]");
      } catch {
        parsedOptions = [];
      }

      const pVotes = votes.filter((v) => v.pollId === p.id);
      const totalVotes = pVotes.length;

      // Current user's vote
      const myVote = pVotes.find((v) => v.userId === session.id);
      const userVote = myVote !== undefined ? myVote.optionIndex : null;

      const isExpired = p.expiresAt ? new Date(p.expiresAt) < now : false;

      const breakdown = parsedOptions.map((opt, idx) => {
        const optionVotes = pVotes.filter((v) => v.optionIndex === idx);
        const count = optionVotes.length;
        const percent = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
        return {
          text: opt,
          count,
          percent,
        };
      });

      return {
        ...p,
        totalVotes,
        userVote,
        isExpired,
        breakdown,
      };
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Anketler alınamadı";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
