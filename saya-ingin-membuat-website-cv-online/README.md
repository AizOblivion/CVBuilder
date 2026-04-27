# Website Pembuatan CV Online

Fondasi awal untuk website layanan pembuatan CV online yang modern, meyakinkan, dan siap dikembangkan.

Versi saat ini sudah disiapkan sebagai static website yang siap di-host ke Netlify, Vercel, atau GitHub Pages.

## Tujuan

Website ini dirancang untuk:

- menawarkan layanan pembuatan CV online
- membantu pengunjung memahami manfaat dan alur layanan
- menampilkan fitur, keunggulan, dan contoh hasil CV
- mengarahkan pengunjung untuk mulai membuat CV atau menghubungi admin

## Konsep Utama

Pendekatan desain yang dipakai:

- landing page modern yang fokus pada konversi
- copy yang jelas, singkat, dan mudah dipindai
- tampilan profesional dengan nuansa hangat dan tepercaya
- cocok untuk target fresh graduate, job seeker, dan profesional aktif

## Struktur Halaman

1. Hero
2. Kenapa Perlu CV Online
3. Fitur Utama
4. Cara Kerja
5. Template / Hasil CV
6. Testimoni / FAQ
7. CTA dan Kontak

## Struktur Folder

```text
.
|-- index.html
|-- README.md
|-- netlify.toml
|-- _headers
|-- _redirects
|-- 404.html
|-- vercel.json
|-- robots.txt
|-- sitemap.xml
|-- site.webmanifest
|-- .well-known/
|   `-- security.txt
|-- docs/
|   `-- konsep-website.md
|-- assets/
|   |-- images/
|   |   `-- cv-preview.svg
|   `-- icons/
|       `-- favicon.svg
|-- styles/
|   `-- main.css
`-- scripts/
    `-- main.js
```

## Siap Hosting

Project ini sudah memiliki:

- halaman utama static `index.html`
- metadata SEO dasar
- favicon dan web manifest
- `robots.txt` dan `sitemap.xml`
- konfigurasi deploy untuk Netlify dan Vercel
- security headers dasar untuk static hosting
- `404.html` untuk fallback error page
- `.well-known/security.txt` untuk disclosure keamanan

## Pengembangan Berikutnya

- ganti teks dummy dengan brand dan layanan asli
- ganti `https://example.com` di metadata dan sitemap dengan domain asli
- ganti email keamanan dan policy URL di `.well-known/security.txt`
- tambahkan template CV, harga, dan CTA nyata
- sambungkan form ke email atau backend
- tambahkan halaman builder / dashboard bila ingin dibuat interaktif
- deploy ke Vercel, Netlify, atau GitHub Pages
