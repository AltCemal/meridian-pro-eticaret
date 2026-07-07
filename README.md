# Meridian — Taslak 4: Tam Teşekküllü Pro E-Ticaret (Ödemeli)

Next.js (App Router) + TypeScript + Tailwind + Supabase Auth + Stripe ile
hazırlanmış, **doğrudan kredi kartıyla ödeme alan** butik e-ticaret
şablonu. Örnek içerik olarak kurgusal bir kadın giyim markası
("Meridian") kullanılmıştır — önceki üç taslaktan (zanaat, endüstriyel,
zine) bilinçli olarak farklı, sade siyah–beyaz–kırmızı editoryal moda
kimliği uygulanmıştır (ince kenarlıklı "hang tag" ürün kartları, çift
çizgili editoryal ayırıcılar, italik serif başlıklar).

## Mimari özeti

- **Supabase Auth** (e-posta/şifre + Google) ile müşteri hesapları.
- **Row Level Security**: Her müşteri yalnızca kendi siparişlerini
  görebilir (`orders`/`order_items` üzerinde `auth.uid() = user_id`
  politikası).
- **Stripe Checkout**: `/api/checkout` sunucu tarafında fiyat/stok
  doğrulaması yapar, bekleyen bir sipariş oluşturur, Stripe'ın barındırdığı
  ödeme sayfasına yönlendirir.
- **Stripe Webhook**: `/api/webhooks/stripe`, ödeme tamamlandığında
  siparişi "ödendi" yapar ve stoğu düşürür — bunu yaparken **service
  role** anahtarıyla RLS'i bilinçli olarak bypass eder (müşterinin kendi
  siparişini "ödendi" olarak işaretlemesini engellemek için bu işlem
  asla istemci tarafından yapılamaz).

## 1) Supabase kurulumu

1. [supabase.com](https://supabase.com) üzerinde proje oluşturun.
2. **SQL Editor**'de sırasıyla `supabase/schema.sql` ve (opsiyonel)
   `supabase/seed.sql` dosyalarını çalıştırın. Bu, tabloları, RLS
   politikalarını, yeni kullanıcı için otomatik profil oluşturan
   trigger'ı ve stok düşürme fonksiyonunu kurar.
3. **Authentication > Providers > Google**'ı açın; Google Cloud
   Console'da bir OAuth Client ID/Secret oluşturup buraya girin.
   Yönlendirme URL'si Supabase tarafından otomatik gösterilir
   (`https://<proje>.supabase.co/auth/v1/callback`).
4. **Project Settings > API**'den `Project URL`, `anon public` ve
   `service_role` anahtarlarını alın.

## 2) Stripe kurulumu

1. [stripe.com](https://stripe.com) üzerinde bir hesap açın (test modu
   yeterli).
2. **Developers > API keys**'den `Secret key`'i alın.
3. Yerelde webhook test etmek için [Stripe CLI](https://stripe.com/docs/stripe-cli)
   kurun ve çalıştırın:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   Bu komutun verdiği `whsec_...` değerini `STRIPE_WEBHOOK_SECRET`
   olarak kullanın. Prodüksiyonda **Developers > Webhooks**'tan
   `checkout.session.completed` olayını dinleyen bir endpoint
   oluşturup oradaki secret'ı kullanın.

> **Not:** Brief'te Iyzico/Stripe/PayTR seçenekleri sayılmıştı; bu
> taslak mimariyi göstermek için Stripe Checkout ile kurulmuştur.
> Iyzico veya PayTR'ye geçmek isterseniz `app/api/checkout/route.ts`
> (ödeme başlatma) ve `app/api/webhooks/stripe/route.ts` (ödeme
> onaylama) dosyalarını ilgili sağlayıcının SDK/iFrame ve webhook/callback
> imza doğrulama deseniyle değiştirmeniz yeterlidir — sipariş/stok
> mantığının geri kalanı aynı kalır.

## 3) Ortam değişkenleri

```bash
cp .env.local.example .env.local
```

Tüm alanları doldurun (`.env.local.example` içinde her birinin nereden
alınacağı açıklanmıştır).

## 4) Kurulum ve çalıştırma

```bash
npm install
npm run dev
```

Ödeme akışını uçtan uca test etmek için `stripe listen` komutunu ayrı
bir terminalde açık tutun (bkz. yukarı) ve Stripe'ın test kart numarasını
kullanın: `4242 4242 4242 4242`, herhangi bir gelecek tarih ve CVC.

## Yapı

```
app/
  page.tsx                    → Ana sayfa
  magaza/page.tsx              → Ürün listeleme + kategori filtresi
  magaza/[slug]/page.tsx       → Ürün detay — dinamik SEO + Schema.org
  sepet/page.tsx                → Sepet + teslimat adresi + ödemeye geç
  hesap/giris/page.tsx          → Giriş / kayıt (e-posta + Google)
  hesap/page.tsx                 → Hesap özeti + sipariş geçmişi (RLS korumalı)
  odeme/basarili/page.tsx        → Ödeme sonrası onay, sepeti temizler
  odeme/basarisiz/page.tsx       → Ödeme iptal/başarısız
  auth/callback/route.ts         → Google OAuth kod değişimi
  api/checkout/route.ts          → Stripe Checkout Session oluşturur
  api/webhooks/stripe/route.ts   → Ödeme onayı, stok düşürme

lib/
  supabase/client.ts   → Tarayıcı Supabase istemcisi
  supabase/server.ts   → Sunucu (cookie tabanlı oturum) Supabase istemcisi
  supabase/admin.ts    → Service role istemcisi — SADECE webhook kullanır
  store/cart.ts         → Zustand sepet store'u (localStorage'da kalıcı)
  actions/auth.ts        → Server Actions: giriş/kayıt/çıkış
  stripe.ts               → Stripe SDK örneği

middleware.ts           → Oturumu yeniler, /hesap rotalarını korur
supabase/schema.sql      → Tablolar, RLS politikaları, trigger, RPC fonksiyonu
```

## Güvenlik notları

- **Fiyat/stok istemciden asla güvenilmez.** `/api/checkout`, sepetteki
  ürünleri veritabanından yeniden okur ve Stripe'a gönderilecek tutarı
  sunucu tarafında hesaplar.
- **Sipariş durumu değişikliği yalnızca webhook'tan yapılabilir.**
  `orders` tablosunda `update` için herhangi bir public RLS politikası
  yoktur; sadece `SUPABASE_SERVICE_ROLE_KEY` bunu bypass edebilir ve bu
  anahtar yalnızca sunucu tarafı webhook route'unda kullanılır.
- **Stripe imza doğrulaması zorunludur.** Webhook, `stripe-signature`
  başlığı ve `STRIPE_WEBHOOK_SECRET` ile doğrulanmadan hiçbir olayı
  işlemez — bu olmadan biri sahte bir "ödeme tamamlandı" isteği
  gönderip stok/sipariş durumunu manipüle edebilirdi.
- **RLS ile sipariş gizliliği**: `orders`/`order_items` üzerindeki
  `select` politikaları `auth.uid() = user_id` kontrolü yapar; bir
  kullanıcı başka bir kullanıcının siparişini API üzerinden dahi
  göremez.

## Yeni bir müşteri için değiştirmeniz gerekenler

1. **Marka & içerik**: `components/*`, `app/layout.tsx` içindeki `metadata`.
2. **Tasarım tokenleri**: `tailwind.config.ts` (`colors`, `fontFamily`).
3. **Ürün/kategori verisi**: Supabase Table Editor veya `supabase/seed.sql`.
4. **Ödeme sağlayıcısı**: Stripe yerine Iyzico/PayTR kullanacaksanız
   yukarıdaki "Stripe kurulumu" notuna bakın.
5. **Kargo/iade politikası metinleri**: şu an şablonda yer almıyor,
   gerçek bir mağaza için `app/` altına statik bir sayfa eklemeniz
   önerilir.
