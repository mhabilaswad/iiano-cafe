# iiano-cafe Frontend

**iiano-cafe** adalah aplikasi web reservasi meja untuk sebuah kafe, dibangun menggunakan **Next.js** sebagai framework frontend. Aplikasi ini memungkinkan pelanggan untuk melakukan reservasi meja secara online dan memungkinkan admin untuk mengelola proses reservasi.

---

## 🌐 Fitur Utama

### 🧑‍💼 Untuk Pengguna Umum
- 🔓 **Halaman Utama**  
  Dapat diakses tanpa login. Menampilkan informasi dasar tentang reservasi.

- 📅 **Reservasi Meja**  
  Pengguna dapat melakukan reservasi meja secara online **setelah login**.

- 📂 **My Reservation**  
  Pengguna dapat melihat status reservasi mereka:
  - `Pending`
  - `Confirmed`
  - `Completed`
  - `Cancelled`

- 🔐 **Autentikasi**  
  Pengguna harus melakukan **pendaftaran (Sign Up)** dan **login** sebelum bisa melakukan reservasi.

---

### 🔧 Untuk Admin
- 🔐 **Halaman Admin**  
  Hanya dapat diakses oleh akun admin yang sudah login.

- 🪑 **Manajemen Meja**
  - Menambahkan meja baru
  - Menghapus meja
  - Melihat detail meja

- ✅ **Verifikasi Reservasi**
  - Mengubah status dari `Pending` → `Confirmed` atau `Completed`
  - Menolak reservasi jika perlu (`Cancelled`)

---

## 🚀 Teknologi yang Digunakan

- **Next.js** – Framework React untuk frontend
- **Tailwind CSS** – Styling responsif
- **REST API** – Komunikasi dengan backend
- **JWT Auth** – Untuk login dan akses yang aman
- **Fetch API** – Mengambil data dari server backend
- **Framer Motion** – Animasi UI
- **React Icons** – Ikon-ikon antarmuka

---

## 🛠️ Instalasi dan Menjalankan

```bash
# 1. Clone repository frontend
git clone https://github.com/sadinal04/iiano-cafe-frontend.git
cd iiano-cafe-frontend

# 2. Install dependencies
npm install

# 3. Jalankan development server
npm run dev
```
---

## 🔗 Backend

Aplikasi ini terhubung ke backend yang dibangun menggunakan **Express.js** dan **TypeScript**.

Silakan kunjungi repositori backend di:  
👉 [https://github.com/sadinal04/iiano-cafe-backend](https://github.com/sadinal04/iiano-cafe-backend)

> ⚠️ Pastikan backend berjalan di `http://localhost:5000` agar frontend dapat berfungsi dengan baik.

---

## 🔗 Presentasi

Video presentasi di Youtube:  
👉 [Presentasi Projek Final Prak PPL B - Kelompok 9]([https://github.com/sadinal04/iiano-cafe-backend](https://youtu.be/jx4rYvp1l7w))

---

## 👨‍💻 Tim Pengembang

- **Aulia Vika Rahman**  
- **Sadinal Mufti**  
- **M. Habil Aswad**
