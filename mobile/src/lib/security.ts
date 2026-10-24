/**
 * Güvenlik ve KVKK Yardımcı Fonksiyonları
 * XSS, Enjeksiyon ve Veri Gizliliği Koruması
 */

/**
 * XSS Koruması: Kullanıcı tarafından girilen tüm metinleri güvenli hale getirir
 */
export function sanitizeText(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

/**
 * KVKK Uyumluluğu: Telefon numarasını gizler ve maskeler
 * Örnek: "05321234567" -> "0532 *** ** 67"
 */
export function maskPhoneNumber(phone?: string | null): string {
  if (!phone) return 'Gizli Numara';
  const clean = phone.replace(/\D/g, '');
  if (clean.length < 10) return 'Gizli Numara';
  return `${clean.slice(0, 4)} *** ** ${clean.slice(-2)}`;
}

/**
 * KVKK Uyumluluğu: Sakin ismini komşuluk ekranında gizlilikle biçimlendirir
 * Örnek: "Fatma Kaya" -> "Fatma K."
 */
export function maskResidentName(fullName?: string | null): string {
  if (!fullName) return 'Komşu Sakin';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const firstName = parts[0];
  const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();
  return `${firstName} ${lastInitial}.`;
}

/**
 * Sakin adından 2 harfli avatar kısaltması üretir
 * Örnek: "Fatma Kaya" -> "FK"
 */
export function getInitials(name?: string | null): string {
  if (!name) return 'KS';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Güvenli URL doğrulaması (javascript: veya data: script saldırılarını engeller)
 */
export function isSafeUrl(url?: string | null): boolean {
  if (!url) return false;
  const clean = url.trim().toLowerCase();
  if (clean.startsWith('javascript:') || clean.startsWith('vbscript:') || clean.startsWith('data:text/html')) {
    return false;
  }
  return true;
}

/**
 * Güvenli JSON ayrıştırma
 */
export function safeJsonParse<T>(jsonStr: unknown, fallback: T): T {
  if (typeof jsonStr !== 'string') return fallback;
  try {
    return JSON.parse(jsonStr) as T;
  } catch {
    return fallback;
  }
}

/**
 * Şifre Güvenlik Seviyesi Kontrolü
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  score: number; // 0-4
  feedback: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (password.length < 6) {
    return { isValid: false, score: 0, feedback: 'Şifre en az 6 karakter olmalıdır.' };
  }

  let feedback = 'Zayıf';
  if (score === 2) feedback = 'Orta';
  if (score === 3) feedback = 'İyi';
  if (score >= 4) feedback = 'Çok Güçlü';

  return {
    isValid: password.length >= 6,
    score,
    feedback,
  };
}

/**
 * Para formatlama (TL)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount) + ' ₺';
}

/**
 * Saat ve Tarih formatlama
 */
export function formatMessageTime(isoString?: string | null): string {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${hours}.${minutes}`;
  } catch {
    return '';
  }
}
