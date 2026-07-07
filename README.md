# Meridian Pro E-Ticaret

Next.js 14 + TypeScript + Tailwind + Supabase + Stripe ile gelistirilmis butik e-ticaret uygulamasi.

## Ozellikler

- Supabase Auth (eposta/sifre + Google)
- Sepet yonetimi (Zustand + localStorage)
- Stripe Checkout odeme akisi
- Stripe webhook ile siparis durum guncelleme
- Supabase RLS ile kullanici bazli siparis erisimi

## Teknoloji

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase
- Stripe

## Kurulum

1. Bagimliliklari yukleyin:

```bash
npm install
```

2. Ortam degiskenlerini ayarlayin:

```bash
cp .env.local.example .env.local
```

3. Supabase SQL dosyalarini calistirin:

- supabase/schema.sql
- supabase/seed.sql (opsiyonel)

4. Gelistirme sunucusunu baslatin:

```bash
npm run dev
```

## Stripe Webhook (Local)

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

CLI ciktisindaki whsec_ degerini STRIPE_WEBHOOK_SECRET olarak .env.local dosyasina yazin.

## Test Karti

- 4242 4242 4242 4242
- Herhangi bir gelecek tarih
- Herhangi bir CVC

## Notlar

- Fiyat ve stok dogrulamasi sunucu tarafinda yapilir.
- Siparis durumu degisikligi sadece webhook tarafinda yapilir.
- Service role key sadece server-side kullanilmalidir.
