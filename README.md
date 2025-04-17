# 🦈 ProcessShark - AI-Enhanced Mission Tracker

A productivity web app to create, track and complete personal missions (goals), powered by real-time updates and AI feedback.

---

## 🌟 Features

- ✅ User authentication with Supabase (Google Login)
- ✅ Create, edit and delete missions with custom day tracking
- ✅ Daily progress tracking with statuses (pending, completed, skipped)
- ✅ Beautiful circular progress bars & dynamic mission stats
- ✅ Realtime updates using Supabase Channels (Postgres changes)
- ✅ Notes for each day (with word limits)
- ✅ AI-powered motivational feedback with DeepSeek (AI-Shark)
- ✅ Personal profile page (with blog + mission stats)
- ✅ Blog system with nested comments and like/dislike support
- ✅ Dark mode support and fully mobile responsive
- ✅ Custom guide page with FAQ, tips, onboarding steps
- ✅ Modular UI built using shadcn/ui + Tailwind CSS + framer-motion
- ✅ Deletion confirmation modals for all critical actions

---

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (Auth, Database, Realtime, Storage)
- **AI API**: DeepSeek AI
- **Animations**: framer-motion
- **Realtime**: Supabase Channels
- **UI Components**: ShadCN, Lucide Icons

---

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/processshark.git
cd processshark
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env.local`

```bash
touch .env.local
```

Fill it like this:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
DEEPSEEK_API_KEY=your-deepseek-api-key
```

> You can find your Supabase credentials in your project dashboard (API section).  
> You can register for [DeepSeek AI](https://deepseek.com/) and get an API key.

### 4. Run locally

```bash
npm run dev
```

---

## 🧪 Test Accounts

- You can log in using your Google account.
- The database will automatically create a user record on first login.

---

## 📂 Folder Structure

```
app/
  about-blog/           # Blog pages (detail, edit, add)
  dashboard/            # Main dashboard view
  ai-shark/             # AI feedback page
  guideline/            # Usage guide
components/             # UI components (modals, buttons, charts, etc.)
lib/                    # Supabase, db helpers, auth logic
types/                  # TypeScript interfaces
```

---

## 🧠 AI Integration

The AI feedback is powered by **DeepSeek Chat API**. It analyzes your mission completion rates and gives:
- motivational messages
- skipped vs completed day ratios
- progress interpretation

---

## 🚀 Deployment

The project is deployed using **Vercel**.

Ensure the following environment variables are added to Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DEEPSEEK_API_KEY`

---

## 🇹🇷 Türkçe Açıklama

# 🦈 ProcessShark - Yapay Zekâ Destekli Görev Takibi Uygulaması

Kişisel görevlerini oluştur, ilerlemeni takip et ve AI destekli öneriler al! Supabase ve Next.js altyapısıyla geliştirilmiş, gerçek zamanlı görev takip sistemi.

---

## 🌟 Özellikler

- ✅ Supabase ile Google Giriş Sistemi
- ✅ Görev (Mission) oluşturma, silme, güncelleme
- ✅ Günlük ilerleme durumu (tamamlandı, atlandı, beklemede)
- ✅ İlerleme çubuğu ve istatistik kartları
- ✅ Supabase Realtime ile anlık güncellemeler
- ✅ Gün başına not bırakma (kelime sınırı ile)
- ✅ DeepSeek AI ile motivasyonel geri bildirim (AI-Shark)
- ✅ Kişisel profil sayfası: görev, blog ve beğeni sayısı
- ✅ Blog sistemi: yorum + yanıt + beğeni / beğenmeme
- ✅ Mobil uyumlu tasarım, karanlık mod
- ✅ Şık kullanıcı arayüzü (shadcn/ui, Tailwind CSS)
- ✅ Tüm silme işlemleri için onay modalları

---

## ⚙️ Kurulum Adımları

### 1. Repo’yu klonla

```bash
git clone https://github.com/kullanici-adi/processshark.git
cd processshark
```

### 2. Bağımlılıkları yükle

```bash
npm install
```

### 3. `.env.local` oluştur

```bash
touch .env.local
```

Ve şu şekilde doldur:

```env
NEXT_PUBLIC_SUPABASE_URL=supabase-url'iniz
NEXT_PUBLIC_SUPABASE_ANON_KEY=anon-key'iniz
DEEPSEEK_API_KEY=deepseek-api-key'iniz
```

> Supabase bilgilerini Supabase dashboard > API sekmesinde bulabilirsiniz.

### 4. Uygulamayı başlat

```bash
npm run dev
```

---

## 📂 Proje Klasör Yapısı

- `dashboard/`: Görev ekranı
- `about-blog/`: Blog oluşturma, düzenleme, listeleme
- `ai-shark/`: AI yorum ekranı
- `guideline/`: Rehber, SSY, ipuçları
- `components/`: UI bileşenleri
- `lib/`: Supabase ve yardımcı fonksiyonlar
- `types/`: TypeScript arayüzleri

---

## 🧠 AI Kullanımı

AI önerileri görevlerdeki ilerlemeni analiz eder, sana özgü geri bildirim verir. 
- Tamamlanma oranı
- Atlanan günler
- Motivasyon cümleleri içerir

---

## 🌐 Deploy

- Vercel üzerinde host edilebilir.
- `.env.local` dosyasındaki bilgileri Vercel ortam değişkeni olarak eklemeyi unutma.

---

## 🤝 Katkı Sağla

Pull Request göndermekten çekinme! Yeni özellikler, UI iyileştirmeleri veya hata düzeltmeleri için katkıda bulunabilirsin.

---

> Developed with ❤️ by the SalihElcicek
