# Deploy ke GitHub + Cloudflare Pages

## 1. Push ke GitHub

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/username/nama-repo.git
git push -u origin main
```

Ganti `username` dan `nama-repo` sesuai akun GitHub kamu.

## 2. Hubungkan ke Cloudflare Pages

1. Buka [dash.cloudflare.com](https://dash.cloudflare.com)
2. Pilih **Workers & Pages** → **Create application** → **Pages**
3. Klik **Connect to Git** → pilih repo GitHub yang baru dibuat
4. Isi pengaturan build:
   - **Framework preset**: `None`
   - **Build command**: *(kosongkan)*
   - **Build output directory**: `/` atau `.`
5. Klik **Save and Deploy**

Cloudflare akan otomatis deploy setiap kali kamu push ke branch `main`.

## 3. Custom Domain (opsional)

1. Di halaman project Cloudflare Pages → **Custom domains**
2. Klik **Set up a custom domain**
3. Masukkan domain kamu → ikuti instruksi DNS

## Struktur file yang relevan

```
_headers     ← security headers (otomatis dibaca Cloudflare Pages)
index.html
styles/
scripts/
assets/
```

File `_headers` sudah dikonfigurasi dengan security headers yang tepat dan akan otomatis diterapkan oleh Cloudflare Pages.

## Update setelah perubahan

```bash
git add .
git commit -m "update"
git push
```

Cloudflare Pages akan otomatis redeploy dalam ~1 menit.
