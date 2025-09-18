# Heart Detection (Next.js + TypeScript)

Web UI untuk **menganalisis sinyal ECG dari CSV** dan mengirimnya ke AI backend (BERT / Conformer / MAE). README ini jadi panduan cepat untuk cloning, setup, dan menjalankan proyek.

---

## ✨ Fitur
- Upload file **ECG .csv**
- Pilih model **BERT / Conformer / MAE**
- Loading & error state yang jelas
- Ringkasan hasil (counts & labels per segmen)
- Dibangun dengan **Next.js (App Router)** + **TypeScript**

---

## 🧱 Tech Stack
- Next.js 14/15 (App Router)
- React 18 + TypeScript
- UI components di `src/components/ui`
- Helper API di `src/lib/apis` (mis. `postdiagnoseECG`)
- Terhubung ke **AI Backend** (FastAPI/Python atau sejenisnya)

---

## ✅ Prasyarat
- **Node.js** 18 LTS atau 20 LTS (`node -v`)
- Package manager: **pnpm** (disarankan) / yarn / npm
- URL **AI Backend** yang aktif

> Windows: pertimbangkan `nvm-windows` untuk ganti versi Node. Jika ada masalah path panjang: `git config --system core.longpaths true`.

---

## 🚀 Mulai Cepat

### 1) Clone
```bash
git clone
pnpm install atau 
npm install
npm run dev
