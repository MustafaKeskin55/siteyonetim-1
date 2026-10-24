import { NextResponse } from "next/server";
import { and, eq, inArray, desc } from "drizzle-orm";
import { getSession } from "@/lib/session";
import { acquireDatabase, databaseUnavailable } from "@/server/database/access";
import {
  communityPolls,
  communityPollVotes,
  communityChannels,
  communityMessages,
  users,
} from "@/db/schema";
import { nanoid } from "nanoid";

function forbidden() {
  return NextResponse.json({ error: "Yetkisiz işlem" }, { status: 403 });
}

export async function GET() {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") || !session.siteId) {
    return forbidden();
  }

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
      .where(eq(communityPolls.siteId, session.siteId))
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

    const result = polls.map((p) => {
      let parsedOptions: string[] = [];
      try {
        parsedOptions = JSON.parse(p.options || "[]");
      } catch {
        parsedOptions = [];
      }

      const pVotes = votes.filter((v) => v.pollId === p.id);
      const totalVotes = pVotes.length;

      const breakdown = parsedOptions.map((opt, idx) => {
        const optionVotes = pVotes.filter((v) => v.optionIndex === idx);
        const count = optionVotes.length;
        const percent = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
        return {
          text: opt,
          count,
          percent,
          voters: optionVotes.map((v) => ({
            name: v.voterName || "Sakin",
            apartmentNo: v.apartmentNo || "—",
          })),
        };
      });

      return {
        ...p,
        totalVotes,
        breakdown,
      };
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Anketler alınamadı";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") || !session.siteId) {
    return forbidden();
  }

  const d = await acquireDatabase();
  if (!d.ok) return await databaseUnavailable();

  try {
    const body = (await req.json().catch(() => ({}))) as {
      question?: string;
      options?: string[];
      channelId?: string;
      expiresAt?: string;
    };

    const { question, options, expiresAt } = body;
    let { channelId } = body;

    if (!question || !question.trim()) {
      return NextResponse.json({ error: "Soru metni gereklidir" }, { status: 400 });
    }

    const cleanOptions = (options || []).map((o) => o.trim()).filter(Boolean);
    if (cleanOptions.length < 2) {
      return NextResponse.json({ error: "En az 2 seçenek belirtilmelidir" }, { status: 400 });
    }

    // Kanal belirtilmemişse varsayılan kanalı seç
    if (!channelId) {
      const [firstCh] = await d.db
        .select()
        .from(communityChannels)
        .where(eq(communityChannels.siteId, session.siteId))
        .limit(1);
      if (firstCh) {
        channelId = firstCh.id;
      } else {
        // Kanal yoksa oluştur
        const chId = "ch_" + nanoid(10);
        await d.db.insert(communityChannels).values({
          id: chId,
          siteId: session.siteId,
          name: "Genel Duyuru & Oylama",
          slug: "genel-oylama",
          description: "Bina geneli resmi oylama ve duyuru kanalı",
          icon: "Vote",
          isAnnouncementOnly: false,
          sortOrder: 0,
        });
        channelId = chId;
      }
    }

    const pollId = "poll_" + nanoid(10);

    await d.db.insert(communityPolls).values({
      id: pollId,
      siteId: session.siteId,
      channelId: channelId!,
      createdBy: session.id,
      question: question.trim(),
      options: JSON.stringify(cleanOptions),
      expiresAt: expiresAt || null,
    });

    // Otomatik olarak komşuluk akışına mesaj olarak ekle
    const msgId = "msg_" + nanoid(10);
    await d.db.insert(communityMessages).values({
      id: msgId,
      siteId: session.siteId,
      channelId: channelId!,
      userId: session.id,
      content: `📊 Yeni Bina Anketi & Karar Oylaması: ${question.trim()}`,
      pollId,
      isPinned: true,
    });

    return NextResponse.json({ success: true, pollId });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Anket oluşturulamadı";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") || !session.siteId) {
    return forbidden();
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Anket ID zorunludur" }, { status: 400 });
  }

  const d = await acquireDatabase();
  if (!d.ok) return await databaseUnavailable();

  try {
    // Önce oyları ve bağlı mesajları temizle
    await d.db.delete(communityPollVotes).where(eq(communityPollVotes.pollId, id));
    await d.db.delete(communityMessages).where(eq(communityMessages.pollId, id));
    await d.db
      .delete(communityPolls)
      .where(and(eq(communityPolls.id, id), eq(communityPolls.siteId, session.siteId)));

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Silme işlemi başarısız";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
