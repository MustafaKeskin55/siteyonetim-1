import type { PlatformDatabase } from "@/db/platform";
import { sites } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { PlanType, FeatureKey } from "@/lib/features";
import { PLAN_FEATURES, PLAN_DETAILS } from "@/lib/features";

export type SitePlanInfo = {
  plan: PlanType;
  features: FeatureKey[];
  maxSites: number;
  maxUsers: number;
  planExpiresAt: string | null;
  isExpired: boolean;
  isFrozen: boolean;
  daysRemaining: number;
};

const DEFAULT_PLAN: SitePlanInfo = {
  plan: "starter",
  features: PLAN_FEATURES.starter,
  maxSites: PLAN_DETAILS.starter.maxSites,
  maxUsers: PLAN_DETAILS.starter.maxUsers,
  planExpiresAt: null,
  isExpired: false,
  isFrozen: false,
  daysRemaining: 60,
};

/** Site ID'den plan bilgisini getir */
export async function getSitePlan(
  db: PlatformDatabase,
  siteId: string | null | undefined,
): Promise<SitePlanInfo> {
  if (!siteId) return DEFAULT_PLAN;

  try {
    const rows = await db
      .select({ plan: sites.plan, planExpiresAt: sites.planExpiresAt })
      .from(sites)
      .where(eq(sites.id, siteId))
      .limit(1);

    const plan = (rows[0]?.plan as PlanType) || "starter";
    const validPlan = ["starter", "professional", "enterprise"].includes(plan) ? plan : "starter";
    const planExpiresAt = rows[0]?.planExpiresAt || null;

    let isExpired = false;
    let daysRemaining = 60;

    if (planExpiresAt) {
      const expiresTime = new Date(planExpiresAt).getTime();
      const now = Date.now();
      if (!isNaN(expiresTime)) {
        isExpired = expiresTime < now;
        daysRemaining = Math.max(0, Math.ceil((expiresTime - now) / (1000 * 60 * 60 * 24)));
      }
    }

    const isFrozen = isExpired;

    return {
      plan: validPlan,
      features: isFrozen ? [] : PLAN_FEATURES[validPlan],
      maxSites: PLAN_DETAILS[validPlan].maxSites,
      maxUsers: PLAN_DETAILS[validPlan].maxUsers,
      planExpiresAt,
      isExpired,
      isFrozen,
      daysRemaining,
    };
  } catch {
    return DEFAULT_PLAN;
  }
}

/** Site aktif mi kontrol et (60 günlük deneme süresi bittiyse dondur) */
export async function assertSiteActive(
  db: PlatformDatabase,
  siteId: string | null | undefined,
): Promise<{ ok: true; planInfo: SitePlanInfo } | { ok: false; error: string; code: string; daysRemaining: number }> {
  if (!siteId) return { ok: true, planInfo: DEFAULT_PLAN };
  const planInfo = await getSitePlan(db, siteId);
  if (planInfo.isFrozen) {
    return {
      ok: false,
      code: "SITE_FROZEN",
      error: "Binanızın 60 günlük lansman deneme süresi dolmuştur. Tüm bina işlemleri ve erişimleri otomatik olarak dondurulmuştur. Lütfen hizmete devam etmek için paketinizi yenileyin.",
      daysRemaining: 0,
    };
  }
  return { ok: true, planInfo };
}

/** Belirli bir özelliğe sahip mi? */
export function hasFeature(sitePlan: SitePlanInfo, feature: FeatureKey): boolean {
  return sitePlan.features.includes(feature);
}

/** Birden fazla özellikten herhangi birine sahip mi? */
export function hasAnyFeature(sitePlan: SitePlanInfo, features: FeatureKey[]): boolean {
  return features.some((f) => sitePlan.features.includes(f));
}

/** Tüm özelliklere sahip mi? */
export function hasAllFeatures(sitePlan: SitePlanInfo, features: FeatureKey[]): boolean {
  return features.every((f) => sitePlan.features.includes(f));
}
