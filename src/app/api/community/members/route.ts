import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { acquireDatabase, databaseUnavailable } from "@/server/database/access";
import { users } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      return NextResponse.json({ error: "Oturum açmanız gerekiyor" }, { status: 401 });
    }

    const d = await acquireDatabase();
    if (!d.ok) return await databaseUnavailable();

    const siteId = session.siteId;
    if (!siteId) {
      return NextResponse.json([
        {
          id: session.id,
          name: session.name || "Kullanıcı",
          apartmentNo: session.apartmentNo || "1",
          role: session.role || "USER",
          emailOrPhone: "",
          isOnline: true,
        }
      ]);
    }

    // Gerçek veritabanından bu sitedeki tüm kullanıcıları getir
    const siteUsers = await d.db
      .select({
        id: users.id,
        name: users.name,
        apartmentNo: users.apartmentNo,
        role: users.role,
        emailOrPhone: users.emailOrPhone,
        status: users.status,
      })
      .from(users)
      .where(and(eq(users.siteId, siteId), eq(users.status, "APPROVED")));

    const members = siteUsers.map((u) => ({
      id: u.id,
      name: u.name,
      apartmentNo: u.apartmentNo || "—",
      role: u.role,
      emailOrPhone: u.emailOrPhone,
      isOnline: u.id === session.id,
    }));

    return NextResponse.json(members);
  } catch (err: unknown) {
    console.error("GET /api/community/members error:", err);
    return NextResponse.json({ error: "Üyeler alınamadı" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.id || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Bu işlem için yönetici yetkisi gerekir" }, { status: 403 });
    }

    const body = (await req.json().catch(() => ({}))) as { userId?: string; role?: string };
    const { userId, role } = body;

    if (!userId || !role || !["ADMIN", "USER"].includes(role)) {
      return NextResponse.json({ error: "Geçersiz parametre" }, { status: 400 });
    }

    const d = await acquireDatabase();
    if (!d.ok) return await databaseUnavailable();

    await d.db
      .update(users)
      .set({ role: role as "ADMIN" | "USER" })
      .where(eq(users.id, userId));

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("PATCH /api/community/members error:", err);
    return NextResponse.json({ error: "Rol güncellenemedi" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.id || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Bu işlem için yönetici yetkisi gerekir" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Kullanıcı ID zorunludur" }, { status: 400 });
    }

    const d = await acquireDatabase();
    if (!d.ok) return await databaseUnavailable();

    // Siteden çıkar (siteId null yap veya status REJECTED yap)
    await d.db
      .update(users)
      .set({ siteId: null })
      .where(eq(users.id, userId));

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("DELETE /api/community/members error:", err);
    return NextResponse.json({ error: "Kullanıcı çıkarılamadı" }, { status: 500 });
  }
}
