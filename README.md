# BikinCV Online

Website pembuatan CV online yang berjalan sepenuhnya di browser — tanpa backend, tanpa login, tanpa biaya.

## Fitur

- **CV Builder** — isi data profil, pengalaman, pendidikan, skill, bahasa, dan section tambahan bebas (organisasi, prestasi, sertifikasi, dll)
- **Preview live** — hasil CV langsung terlihat saat mengetik
- **3 Template** — Minimal, Modern, Executive dengan warna berbeda
- **Section kustom** — tambah section sendiri dengan nama bebas, tipe entry atau list, pilih kolom kiri atau kanan
- **Export PDF** — download langsung dari browser, ukuran A4
- **Autosave** — data tersimpan otomatis di localStorage browser
- **Foto profil** — upload foto, diproses lokal tanpa dikirim ke server

## Teknologi

- HTML, CSS, JavaScript murni — tanpa framework
- [html2canvas](https://html2canvas.hertzen.com/) + [jsPDF](https://github.com/parallax/jsPDF) untuk export PDF
- Google Fonts (Manrope + Instrument Serif)
- Deploy via Cloudflare Pages

## Struktur Proyek

```
index.html          halaman utama
styles/main.css     semua styling
scripts/main.js     logika builder dan preview
assets/
  icons/            favicon
  images/           gambar preview
docs/
  deploy-cloudflare.md   panduan deploy
  konsep-website.md      konsep dan arah produk
.well-known/
  security.txt      security disclosure
_headers            security headers untuk Cloudflare Pages
robots.txt
sitemap.xml
site.webmanifest
```

## Menjalankan Lokal

Tidak perlu build step. Cukup buka `index.html` di browser, atau gunakan live server:

```bash
npx serve .
```

## Deploy

Lihat panduan lengkap di [`docs/deploy-cloudflare.md`](docs/deploy-cloudflare.md).

Singkatnya:
1. Push ke GitHub
2. Connect repo di Cloudflare Pages
3. Build command: *(kosong)*, output directory: `/`
4. Setiap `git push` otomatis deploy

## Lisensi

MIT
