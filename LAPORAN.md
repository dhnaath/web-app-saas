# Laporan Pembersihan Repo

Sumber: `dhnaath/dna-consulting-baru` (branch `main`).
Hasil: kode siap dipindah ke repo baru. `tsc --noEmit` bersih dan `vite build` sukses.

## Ringkasan angka

| | Sebelum | Sesudah |
|---|---|---|
| File di repo (tanpa .git) | 612 | 339 |
| Baris kode `src/` | 178.155 | 135,610 |
| Dependensi runtime | 70+ | 19 |
| Ukuran bundle produksi | 4,35 MB | 4,35 MB (lihat catatan) |

Catatan bundle: file yang dihapus memang tidak pernah masuk bundle (sudah di-tree-shake),
jadi yang berkurang adalah kompleksitas repo, bukan ukuran bundle.
Bundle masih satu chunk besar; code splitting per rute akan menurunkannya secara nyata.

## Yang dihapus

1. **263 file kode tidak terpakai** (±40 ribu baris), ditentukan dari graf import
   mulai `src/main.tsx`: seluruh `src/repo-routes/` (126 file, sisa proyek lama yang
   sudah dikecualikan di tsconfig), 45 komponen shadcn di `components/ui/`, modul
   `finance/` versi lama, `wira/` versi lama, launcher section yang tidak dirender, dsb.
2. **Hasil build yang ikut ter-commit**: `dist/`, `assets/`, `public/assets/` (±9 MB).
3. **`wira/db/schema.sql`**: skema SQL yang tidak dipakai kode mana pun.
4. **Dependensi tidak terpakai**: BlockNote, FullCalendar, Mantine, hook-form, zod,
   recharts, sonner, dan hampir semua paket Radix, dll.
5. **Import dan variabel tidak terpakai** di file yang masih aktif (±1.350 temuan,
   dihapus lewat fitur resmi TypeScript lalu diverifikasi `tsc`).

## Jejak AI yang dihapus

- `@google/genai`, `express`, `dotenv` dan variabel `GEMINI_API_KEY` / `APP_URL`.
- `metadata.json` (konfigurasi AI Studio), README bawaan AI Studio, komentar di `vite.config.ts`.
- `lib/lovable-error-reporting.ts` dan `error-capture.ts` / `error-page.ts` (sisa Lovable).
- `finance/components/ChatPanel.tsx` ("Analisis didukung oleh AI Gemini").
- `TerminalModal`: sebelumnya "Terminal AI" yang membalas dengan teks tetap seolah menganalisis.
  Sekarang terminal perintah biasa (`help`, `tugas`, `kas`, `jadwal`, `clear`);
  perintah tak dikenal dijawab jujur.
- Data contoh bertema AI/LLM/RAG di knowledge-base, research-manager, web-clipper,
  bookmark-manager diganti ke tema valuasi bisnis/DCF. Struktur dan ID tetap sama.
  Merek (ChatGPT, Copilot, Coursera Deep Learning) dan frasa "AI" pada judul contoh
  juga dinetralkan. Silakan tinjau, karena ini perubahan isi, bukan kode.

## Bug asli yang ditemukan dan diperbaiki

`features/credit/utils.ts`: template string ditulis `\${...}` (dengan backslash), sehingga
`toISO()` mengembalikan teks literal `"${y}-${m}-${day}"` dan warna heatmap menjadi
`rgb(${r}, ...)` literal. `toISO()` dipakai untuk tanggal default di dashboard kredit.

## Soal "backend dan frontend": ini yang sebenarnya ada

**Repo ini tidak punya backend.** Tidak ada server, API, atau database yang berjalan.
Semua data disimpan di `localStorage` lewat store Zustand per fitur
(`features/<fitur>/store.ts` + `types.ts`). Karena itu tidak ada "nama backend" untuk
disamakan dengan UI. Yang bisa dan sudah dilakukan: mencocokkan store (lapisan data)
dengan UI, dan hasilnya di bawah.

### Aksi store yang tidak pernah dipakai UI (fungsi data tanpa tombol/form)

Ini yang paling mendekati ketidaksamaan "backend vs frontend". Fungsinya masih ada di
store; hanya binding yang tidak terpakai di komponen yang dibuang. Pilih: buat UI-nya,
atau hapus aksinya dari store.

- `approval-manager`: `cancelRequest`
- `asset-manager`: `createTag`, `deleteFolder`, `moveAsset`, `renameAsset`, `updateTags`
- `bookmark-manager`: `deleteFolder`, `deleteTag`, `moveBookmark`, `updateFolder`
- `collaboration`: `createShare`, `deleteComment`
- `deliverable-manager`: `addReview`, `addStakeholder`, `deleteDeliverable`
- `expense-tracker`: `setStatus`, `updateExpense`
- `forms`: `addActionMapping`, `deleteForm`, `removeActionMapping`, `updateField`
- `goal-manager`: `updateGoal`
- `interaction-manager`: `addFollowUp`, `deleteInteraction`, `updateInteraction`
- `meeting-manager`: `createSeries`, `deleteMeeting`, `removeAgendaItem`, `updateMeeting`
- `milestone-manager`: `removeStakeholder`, `updateMilestone`
- `people-manager`: `archivePerson`, `createTag`, `updatePerson`
- `resource-manager`: `setSelectedResourceId`, `updateAllocationStatus`, `updateResource`
- `schedule-manager`: `createSchedule`
- `statistics`: `addWidgetToDashboard`, `createDashboard`, `removeWidget`, `setSelectedDashboardId`
- `subscription-manager`: `setSelectedSubscriptionId`, `updateSubscription`
- `template-manager`: `createCategory`, `publishTemplate`, `updateTemplateMetadata`
- `time-tracker`: `updateEntry`
- `workflow-manager`: `addStage`, `addTransition`, `cancelInstance`, `createInstance`

Selain itu masih ada ±90 setter `useState` yang tidak pernah dipanggil (misalnya
`setSortMethod`, `setStatusFilter`). Tandanya filter/input terkait belum punya kontrol di UI.
Daftar lengkap: jalankan `npx tsc --noEmit --noUnusedLocals`.

## Ketidakkonsistenan penamaan yang TIDAK saya ubah (butuh keputusan Anda)

Merombak ini otomatis berisiko dan menyentuh data pengguna, jadi saya tidak lakukan sepihak.

- **Nama produk**: UI dan `index.html` memakai "All in One", sedangkan repo/README "DNA Consulting".
- **Kunci localStorage** memakai 4 pola berbeda: `aio_*`, `client_os_*`, `wira_*`, dan polos
  (`credit_data`, `transactions_list`, `manajemen_debts`, `appLanguage`). Bahasa disimpan di
  dua kunci (`aio_lang` dan `appLanguage`). Mengganti kunci akan mereset data tersimpan pengguna
  kecuali ada migrasi.
- **Nama folder fitur** campuran Indonesia/Inggris: `klien`, `komunitas`, `matriks` vs
  `task-manager`, `knowledge-base`; ada juga `nonWhiteApps` (camelCase) dan `wira` (nama orang).
- **Gaya nama file**: PascalCase ±187, kebab-case ±19, camelCase/lainnya ±121.
- **Rute** didefinisikan manual di `router.tsx` (±1.950 baris).

## Langkah berikutnya yang disarankan

1. Putuskan satu nama produk dan satu pola kunci storage (saya bisa buatkan migrasi).
2. Putuskan nasib 52 aksi store yang belum punya UI.
3. Pecah `router.tsx` dan aktifkan lazy-loading rute untuk mengecilkan bundle.
