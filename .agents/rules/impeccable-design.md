# Impeccable Design Rules (Yapay Zeka Tasarım Klişelerini Engelleyen 61 Kural Kılavuzu)

Bu kurallar `siteyonetim` projesinde tasarlanan tüm bileşenler ve sayfalar için bağlayıcıdır.

## I. Renk ve Degradeler (Color & Gradients)
1. **Mor-Mavi Yapay Zeka Klişesini Yasakla:** Klasik Tailwind `from-purple-600 to-indigo-600` veya radyal mor bulanıklıklar yerine; mimari, kurumsal ve ferah paletler (Slate, Zinc, Emerald, Teal, Midnight Navy, Amber) kullan.
2. **Kontrast Zorunluluğu:** Gri metinler için asla `text-slate-400` veya `text-gray-400` gibi okunaksız açık tonlar ana metin olarak kullanılmaz. En az WCAG AA standartlarında kontrast sağlanır.
3. **Semantik Vurgu:** Renkler sadece dekorasyon için değil, bilgi hiyerarşisi için kullanılır (Örn: Yeşil = Kasa/Artı Bakiye, Kırmızı = Gider/Acil, Mavi/İndigo = Bilgi/Sohbet).
4. **Işık & Derinlik:** Arka planlar sadece düz zemin veya aşırı blur yerine; ince ızgara (subtle grid), radial aydınlatma ve temiz kenarlıklar (borders with alpha) ile derinleştirilir.

## II. Kart ve Düzen Klişeleri (Layout & Anti-Card-Soup)
5. **İç İçe Kart Çorbası (Card Soup) Yasağı:** Kart içinde kart, onun içinde başka kart hiyerarşisi yasaktır. Bento grid veya çizgi ayraçlı editoryal bölmeler tercih edilir.
6. **İkon Kutusu Enflasyonu Yasağı:** Her başlığın üstüne otomatik olarak renkli kutu içinde küçük Lucide ikonu kondurma. İkonlar fonksiyonel olmalı veya tipografi kendi başına güçlü durmalıdır.
7. **Kalıp 3 Sütun Yasağı:** Her özelliği 3 adet tıpatıp aynı kutucuğa bölmek yerine; asimetrik bento grid, öne çıkan ana özellik ve destekleyici mikro paneller kullan.
8. **Editoryal Ritim:** Sayfa boyunca farklı görsel ritimler (büyük rakamlar, canlı demo pencereleri, interaktif kaydırıcılar) sun.

## III. Tipografi (Typography & Hierarchy)
9. **Cesur ve Net Başlıklar:** Başlıklar vurucu, net ve karakterli olmalıdır.
10. **Mikro Metinler (Sub-labels):** Küçük etiketler `uppercase tracking-wider font-semibold` ile profesyonel bir finans/yönetim standardı hissi vermelidir.
11. **Rakam Tipografisi:** Finansal rakamlar, yüzdeler ve istatistikler mono veya tabular rakam desteğiyle (tabular-nums) gösterilir.

## IV. Hareket ve Etkileşim (GSAP & Three.js)
12. **ScrollTrigger Deneyimi:** Sayfa aşağı kaydırıldıkça ögeler pat diye görünmez; pürüzsüzce (stagger, fade-up, scale) sahneye girer.
13. **3D Canlılık (Three.js):** Statik görseller yerine, kullanıcı mouse hareketine ve scroll'a tepki veren hafif, modern 3D mimari / site blokları sahnesi kullanılır.
14. **Performans:** 3D sahneler ve animasyonlar mobil cihazlarda işlemciyi yormayacak şekilde optimize edilir (low draw calls, responsive canvas).
