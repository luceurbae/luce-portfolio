# Design Guide: Website ala Infisical dengan React Bits

Panduan untuk membangun landing page developer-security bergaya Infisical.com, memakai komponen dari React Bits (reactbits.dev).

> **Catatan akurasi:** Struktur, copywriting, dan urutan section di bawah saya ambil dari halaman infisical.com. Nilai visual seperti warna, ukuran font, dan spacing adalah **estimasi** dari screenshot Anda, bukan token resmi. Verifikasi dengan *Inspect Element* sebelum finalisasi.

---

## 1. Karakter Desain

Infisical berada di sisi "bersih dan teknis", bukan "neon cyberpunk". Lima prinsip utamanya:

1. **Putih dominan, hitam sebagai aksen tegas.** Latar putih, teks hampir hitam, tombol utama hitam solid.
2. **Satu warna kejutan.** Kuning stabilo (highlighter) dipakai sangat hemat, misalnya pada frasa kunci "all-in-one" di headline.
3. **Produk adalah visual utama.** Hampir tidak ada ilustrasi dekoratif. Yang tampil adalah mockup UI asli: tabel secrets, daftar sertifikat, session replay.
4. **Garis tipis, bukan bayangan tebal.** Panel dibatasi border 1px abu-abu dan garis grid putus-putus. Terasa seperti blueprint.
5. **Gerak halus dan fungsional.** Animasi dipakai untuk menjelaskan (baris muncul, status berubah), bukan untuk pamer.

Implikasinya untuk React Bits: koleksinya banyak yang bergaya gelap dan mencolok (Galaxy, Lightning, Hyperspeed, dll). **Jangan pakai itu.** Pilih komponen yang bisa diredam ke tampilan minimalis, dan turunkan intensitasnya.

---

## 2. Design Tokens (estimasi)

### Warna

| Token | Nilai perkiraan | Pemakaian |
| --- | --- | --- |
| `--bg` | `#FFFFFF` | Latar halaman |
| `--bg-subtle` | `#FAFAFA` | Latar section selang-seling, panel mockup |
| `--fg` | `#0A0A0A` | Headline, tombol utama |
| `--fg-muted` | `#525252` | Paragraf deskripsi |
| `--border` | `#E5E5E5` | Border panel, tabel, garis grid |
| `--highlight` | `#F7FF62` | Highlight frasa di headline, badge kecil |
| `--status-ok` | `#16A34A` | Status Active |
| `--status-warn` | `#D97706` | Status Expiring |
| `--status-bad` | `#DC2626` | Status Expired |

CSS:

```css
:root {
  --bg: #fff;
  --bg-subtle: #fafafa;
  --fg: #0a0a0a;
  --fg-muted: #525252;
  --border: #e5e5e5;
  --highlight: #f7ff62;
  --radius-sm: 4px;
  --radius-md: 8px;
}
```

Aturan pemakaian: kuning hanya untuk 1 frasa per section (maksimal). Warna status hanya muncul di dalam mockup, tidak di luar.

### Radius dan border

- Tombol utama hampir **kotak** (radius 0 sampai 2px). Ini bagian dari karakter visualnya.
- Panel mockup: radius 8px, border 1px `--border`.
- Hindari bayangan besar. Kalau perlu, `0 1px 2px rgba(0,0,0,.04)`.

---

## 3. Tipografi

Dari screenshot, headline memakai **neo-grotesque** dengan huruf rapat dan bersih. Font aslinya tidak bisa saya pastikan dari gambar.

**Pilihan font:**

- Berbayar (paling mirip): Neue Haas Grotesk, Suisse Int'l, atau Söhne
- Gratis (Google Fonts): **Inter**, **Instrument Sans**, atau **Hanken Grotesk**
- Mono untuk mockup (terminal, nama secret, serial sertifikat): **JetBrains Mono** atau **Geist Mono**

**Skala tipografi:**

| Peran | Ukuran (desktop) | Weight | Line-height | Letter-spacing |
| --- | --- | --- | --- | --- |
| H1 hero | 56 sampai 72px | 400 sampai 500 | 1.05 | -0.03em |
| H2 section | 40 sampai 48px | 400 sampai 500 | 1.1 | -0.025em |
| H3 produk | 24 sampai 28px | 500 | 1.2 | -0.02em |
| Body besar | 18px | 400 | 1.6 | 0 |
| Body | 16px | 400 | 1.6 | 0 |
| Label / eyebrow | 12 sampai 13px | 500 | 1.4 | 0.04em, uppercase |
| Mockup | 12 sampai 13px | 400, mono | 1.5 | 0 |

Ciri khas: headline **tidak bold**. Berat regular dengan ukuran besar dan tracking rapat memberi kesan tenang dan percaya diri. Teks hero rata tengah dan dibatasi lebar (sekitar 14 sampai 18 kata per baris maksimum).

**Efek highlight pada headline** (komponen custom, bukan dari React Bits):

```css
.hl {
  background: var(--highlight);
  padding: 0 .25em;
  /* opsional: animasi wipe dari kiri */
  background-size: 0% 100%;
  background-repeat: no-repeat;
  animation: wipe .6s .5s forwards;
}
@keyframes wipe { to { background-size: 100% 100%; } }
```

---

## 4. Layout dan Grid

- Lebar konten maksimum: **1200 sampai 1280px**, rata tengah.
- Padding horizontal: 24px (mobile), 48px (desktop).
- Jarak antar section: **96 sampai 160px**.
- Garis bantu: Infisical memakai **garis putus-putus tipis** yang membingkai kolom konten, dengan kotak kecil di sudut pada frame tertentu. Tiru dengan border `1px dashed var(--border)` pada wrapper section dan pseudo-element kotak 6px di sudutnya.
- Pola section: *eyebrow kecil, heading, paragraf, CTA, lalu mockup lebar penuh*.

---

## 5. Struktur Halaman dan Pemetaan ke React Bits

Urutan di bawah mengikuti halaman Infisical. Kolom kanan menunjukkan komponen React Bits yang cocok. Semua nama komponen di bawah ada di katalog React Bits.

### 5.1 Navbar

Isi: logo, menu Platform (Secrets Management, Certificate Management, Privileged Access, Agent Vault), Pricing, Developers, Resources, Compare, Careers, badge bintang GitHub, serta dua CTA ("Talk to an expert" sebagai sekunder dan "Get started for free" sebagai utama).

- Bangun sendiri dengan shadcn/ui (NavigationMenu). Navbar Infisical adalah dropdown standar, jadi komponen menu React Bits yang bergaya mencolok (Bubble Menu, Gooey Nav, Staggered Menu) **kurang cocok**.
- Tambahan opsional: **Gradual Blur** di bawah header sticky untuk transisi lembut saat scroll.

### 5.2 Banner pengumuman

Pill kecil di atas hero (mis. pengumuman pendanaan).

- **Shiny Text** untuk kilau tipis pada teks banner. Pakai intensitas rendah.

### 5.3 Hero

Headline, satu paragraf, dua tombol, lalu mockup produk bertab (PAM, PKI, Agent Vault, Secrets) di bawahnya.

- Headline: **Split Text** atau **Blur Text** untuk muncul perlahan saat load. Pilih satu saja.
- Latar: **Dot Grid** atau **Cursor Grid** dengan warna abu sangat pucat dan opacity rendah. Atau cukup grid putus-putus statis tanpa komponen.
- Tombol utama: **Magnet** (tarikan halus ke kursor) dibungkus tombol hitam. Hindari Specular Button karena bergaya kaca.
- Mockup bertab: custom (lihat bagian 6).

### 5.4 Logo pelanggan

Baris logo monokrom yang bergerak.

- **Logo Loop**: marquee tak berujung dengan jeda saat hover. Ubah logo jadi grayscale dan opacity 60%.

### 5.5 Produk: ringkasan

Heading "Meet the all-in-one identity security stack for developers and AI agents." dengan frasa kunci di-highlight kuning, paragraf, dan tombol "Explore product features".

- **Scroll Reveal** atau **Fade Content** untuk heading dan paragraf.

### 5.6 Blok produk (Secrets, Agent Vault, Certificates, PAM)

Setiap blok: judul H3, deskripsi, tautan, lalu 3 kartu fitur kecil dan satu mockup besar.

- Kartu fitur: **Spotlight Card** (sorotan halus mengikuti kursor) atau **Border Glow** dengan warna netral. Alternatif untuk grid fitur: **Magic Bento**, tapi kecilkan efek warnanya.
- Kemunculan saat scroll: **Animated Content** dengan stagger antar kartu.
- Mockup tabel: **Animated List** untuk baris yang masuk berurutan.
- Badge status (Active/Expiring/Expired): bisa terinspirasi dari **Status Mark** dan **Call Chip** di kategori Micro Interactions.
- Blok Agent Vault (agen, proxy, layanan tujuan): diagram SVG custom, dengan **Electric Border** atau **Star Border** pada node "Agent Vault" sebagai penanda pusat. Pakai warna netral.

### 5.7 Integrasi

Grid logo layanan (GitHub, GitLab, Vercel, Kubernetes, Terraform, dll).

- **Logo Loop** dua baris dengan arah berlawanan, atau **Orbit Images** bila ingin gaya orbit.

### 5.8 Reliabilitas / enterprise

Klaim "10 billion secrets every day" dan 4 poin (compliance, enkripsi, uptime, self-host).

- **Count Up** atau **Counter** untuk angka.
- 4 poin: kartu sederhana, cukup border tipis.

### 5.9 Customer stories

Kutipan pelanggan dengan nama, jabatan, dan perusahaan.

- **Carousel** atau **Stack**. Alternatif paling aman: grid kartu biasa dengan **Tilted Card** yang sangat ringan.

### 5.10 Testimoni komunitas

Dinding kutipan dari X/Twitter yang bergulir otomatis.

- **Logo Loop** atau **Scroll Velocity** sebagai dasar marquee. Karena kode komponen React Bits menjadi milik Anda, Anda bisa mengganti isi item dari logo menjadi kartu testimoni.

### 5.11 CTA penutup dan footer

- CTA: heading satu baris, dua tombol. **Click Spark** bisa dipakai sangat tipis, atau lewati.
- Footer: 6 kolom tautan (Product, Use Cases, Developers, Resources, Legal, Contact). Custom, tanpa animasi.

---

## 6. Mockup Produk (inti identitas visual)

Ini bagian yang paling membuat situs terasa seperti Infisical. Bangun sebagai komponen React biasa, bukan gambar.

**Anatomi panel mockup:**

- Wrapper: border 1px, radius 8px, latar putih, header kecil (judul seperti "PKI Dashboard").
- Tab pill di atas: All / Active / Expiring / Expired.
- Tabel: header 12px uppercase abu, baris 40px, font mono untuk nilai teknis.
- Badge status: pill kecil dengan titik berwarna dan teks.
- Tombol aksi kecil (mis. "Request Certificate", toggle "Auto-renew").

**Interaksi yang disarankan:**

- Klik tab memfilter baris (dengan animasi baris masuk dan keluar).
- Hero berganti mockup otomatis tiap 5 sampai 6 detik, berhenti saat hover.
- Session replay: timeline yang berjalan, baris aktivitas muncul sesuai detik, status berubah ke "Expired".

Data contoh (fiktif, buat sendiri, jangan menyalin data merek lain): nama domain internal, serial terpotong (`4a68...c3`), tanggal kedaluwarsa, durasi akses (`15m`, `1h`).

---

## 7. Motion

| Aspek | Aturan |
| --- | --- |
| Durasi | 200 sampai 400ms untuk UI, 600 sampai 800ms untuk reveal besar |
| Easing | `cubic-bezier(.22, 1, .36, 1)` (ease-out halus) |
| Reveal saat scroll | Sekali saja, fade + naik 12 sampai 20px |
| Stagger | 40 sampai 80ms antar item |
| Efek kursor | Hanya satu per halaman, dan halus |
| `prefers-reduced-motion` | Wajib: matikan marquee, stagger, dan efek kursor |

Batas keras: **maksimal 1 efek "wow"** per viewport. Sisanya reveal biasa.

---

## 8. Setup Teknis

React Bits menginstal komponen sebagai source code milik Anda, dalam varian JS atau TS dan CSS atau Tailwind.

**Stack yang disarankan:** Next.js (App Router) + TypeScript + Tailwind + shadcn/ui.

**Instal komponen via CLI** (sesuai halaman instalasi React Bits):

```bash
npx shadcn@latest add @react-bits/SplitText-TS-TW
```

Akhiran menentukan varian: JS atau TS, lalu CSS atau TW. Contoh untuk komponen lain mengikuti pola nama yang sama:

```bash
npx shadcn@latest add @react-bits/LogoLoop-TS-TW
npx shadcn@latest add @react-bits/SpotlightCard-TS-TW
npx shadcn@latest add @react-bits/CountUp-TS-TW
npx shadcn@latest add @react-bits/AnimatedList-TS-TW
```

Penulisan nama persis bisa berbeda per komponen. Cek tab *Code* di halaman komponen untuk perintah yang benar dan daftar dependensi tambahan (sebagian memakai GSAP, Framer Motion/motion, atau WebGL seperti OGL dan Three.js).

**Struktur folder:**

```
app/
  page.tsx
components/
  ui/            # shadcn
  bits/          # hasil instal React Bits
  sections/      # Hero, Products, Integrations, ...
  mockups/       # PkiTable, SessionReplay, AgentVaultFlow
```

**Performa:**

- Komponen WebGL (latar shader) berat. Untuk gaya Infisical, hindari atau muat dengan `dynamic(() => import(...), { ssr: false })`.
- Muat mockup di bawah fold secara lazy.
- Target: LCP di bawah 2,5 detik dan tanpa layout shift pada pergantian tab mockup (beri tinggi tetap).

---

## 9. Do dan Don't

**Do**

- Pakai whitespace yang lega dan hierarki tipografi yang tegas.
- Tampilkan produk nyata (tabel, log, timeline) sebagai bukti.
- Tulis copy yang spesifik dan teknis ("Agents shouldn't see your secrets").
- Satu warna aksen, dipakai hemat.

**Don't**

- Jangan pakai latar shader gelap atau neon (Galaxy, Lightning, Aurora, Prism) untuk gaya ini.
- Jangan menumpuk beberapa efek kursor sekaligus (Splash Cursor, Ghost Cursor, Blob Cursor).
- Jangan beri bayangan besar, gradien ungu-biru, atau sudut sangat bulat.
- Jangan menyalin logo, teks, atau gambar milik Infisical. Pakai struktur dan prinsipnya, lalu isi dengan merek dan konten Anda sendiri.

---

## 10. Urutan Pengerjaan

1. Setup proyek, font, dan token warna.
2. Navbar dan footer.
3. Hero statis (headline, highlight, CTA) lalu tambahkan Split Text.
4. Satu mockup tabel yang rapi. Jadikan ini template untuk mockup lain.
5. Logo Loop.
6. Blok produk satu per satu dengan Spotlight Card dan Animated Content.
7. Count Up, testimoni, CTA penutup.
8. Responsif (mockup dibuat scroll horizontal di mobile) dan `prefers-reduced-motion`.
9. Audit aksesibilitas: kontras teks abu pada putih, fokus keyboard, label tab.
10. Uji performa dan kurangi efek bila perlu.

---

## Sumber

- infisical.com (struktur halaman, copywriting, urutan section)
- reactbits.dev (katalog komponen dan instruksi instalasi)
