# DNA Consulting

Aplikasi workspace all-in-one untuk konsultan: klien, proyek, tugas, keuangan,
valuasi, syariah, pajak, matriks strategi, dan alat produktivitas.

Aplikasi ini murni frontend (React + Vite + TypeScript). Data disimpan di
`localStorage` browser melalui store Zustand per fitur.

## Menjalankan

Prasyarat: Node.js 20+ (atau Bun).

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # hasil build ke dist/
npm run lint     # pemeriksaan tipe TypeScript
```

## Struktur

```
src/
  main.tsx, App.tsx, router.tsx   Entry point dan definisi rute
  app/                            Shell: sidebar, header, dock, modal global
  routes/                         Halaman launcher dan dashboard komoditas
  features/<nama-fitur>/          Satu folder per modul (UI, store, types)
  hooks/, lib/, config/, data/    Utilitas dan data bersama
```
