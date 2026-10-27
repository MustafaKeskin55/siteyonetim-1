import { NextResponse } from "next/server";
import { getPlatformDb } from "@/db/platform";
import { users } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const db = await getPlatformDb();
    const list = await db
      .select({
        id: users.id,
        name: users.name,
        emailOrPhone: users.emailOrPhone,
        block: users.apartmentNo,
        apartmentNo: users.apartmentNo,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(100);

    const residents = list.map((u) => ({
      id: u.id,
      name: u.name,
      emailOrPhone: u.emailOrPhone,
      block: "A Blok",
      apartmentNo: u.apartmentNo || "Daire",
      role: u.role === "ADMIN" ? "Site Yöneticisi" : "Sakin",
      debt: 0.0,
      status: "Düzenli",
      phone: u.emailOrPhone,
      plate: "",
      createdAt: u.createdAt || "",
    }));

    return NextResponse.json(residents);
  } catch (error: any) {
    return NextResponse.json({ error: "Sakinler yüklenemedi." }, { status: 500 });
  }
}
