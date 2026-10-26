/** Talep kayıtları: veritabanı durum sabitleri ile arayüz (Türkçe) arasında köprü */

export type ClientRequestItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl?: string | null;
  date: string;
  status: "Bekliyor" | "İşlemde" | "Çözüldü" | "Reddedildi";
  resolutionNote?: string | null;
  resolutionImageUrl?: string | null;
  rejectedNote?: string | null;
  rejectedImageUrl?: string | null;
  userName?: string | null;
  userPhone?: string | null;
  apartmentNo?: string | null;
};

export function dbRequestToClient(row: {
  id: string;
  subject: string;
  description: string;
  category: string | null;
  imageUrl?: string | null;
  status: string;
  resolutionNote?: string | null;
  resolutionImageUrl?: string | null;
  rejectedNote?: string | null;
  rejectedImageUrl?: string | null;
  createdAt: string | null;
  userName?: string | null;
  userEmailOrPhone?: string | null;
  apartmentNo?: string | null;
}): ClientRequestItem {
  return {
    id: row.id,
    title: row.subject,
    category: row.category?.trim() || "Genel",
    description: row.description,
    imageUrl: row.imageUrl ?? null,
    date: row.createdAt
      ? new Date(row.createdAt).toLocaleDateString("tr-TR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : new Date().toLocaleDateString("tr-TR"),
    status:
      row.status === "IN_PROGRESS" ? "İşlemde"
      : row.status === "RESOLVED" ? "Çözüldü"
      : row.status === "REJECTED" ? "Reddedildi"
      : "Bekliyor",
    resolutionNote: row.resolutionNote ?? null,
    resolutionImageUrl: row.resolutionImageUrl ?? null,
    rejectedNote: row.rejectedNote ?? null,
    rejectedImageUrl: row.rejectedImageUrl ?? null,
    userName: row.userName ?? null,
    userPhone: row.userEmailOrPhone ?? null,
    apartmentNo: row.apartmentNo ?? null,
  };
}

export function uiStatusToDb(s: string): "OPEN" | "IN_PROGRESS" | "RESOLVED" | "REJECTED" {
  if (s === "İşlemde") return "IN_PROGRESS";
  if (s === "Çözüldü") return "RESOLVED";
  if (s === "Reddedildi") return "REJECTED";
  return "OPEN";
}

/**
 * Modern tarayıcılarda data: URL'lerinin yeni sekmede engellenmesini
 * (about:blank#blocked hatasını) önlemek için Blob URL'ye dönüştürerek açar.
 */
export function openImageSafely(url: string) {
  if (typeof window === "undefined" || !url) return;
  try {
    if (url.startsWith("data:")) {
      const parts = url.split(",");
      const mime = parts[0].match(/:(.*?);/)?.[1] || "image/jpeg";
      const bstr = atob(parts[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const blob = new Blob([u8arr], { type: mime });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
      setTimeout(() => URL.revokeObjectURL(blobUrl), 120000);
      return;
    }
  } catch (err) {
    console.error("openImageSafely error:", err);
  }
  window.open(url, "_blank");
}

export function downloadImageSafely(url: string, filename = "ariza-gorseli.jpg") {
  if (typeof window === "undefined" || !url) return;
  try {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (err) {
    console.error("downloadImageSafely error:", err);
  }
}

