# GTA Indonesia Cirebon Multiplayer Server

Server Node.js + Socket.IO untuk multiplayer realtime. Socket.IO menyediakan komunikasi dua arah berlatensi rendah dan fallback transport bila WebSocket tidak dapat digunakan. citeturn0search0turn0search2

## Jalankan lokal

```bash
cd server
npm install
npm start
```

Server default berjalan di port 3000.

## Hubungkan game

Buka game dengan parameter:

`https://selleradi5-tech.github.io/gta-indonesia-cirebon/?server=https%3A%2F%2FALAMAT-SERVER-KAMU`

Atau isi URL server melalui konfigurasi JavaScript `window.GTA_MULTIPLAYER_SERVER`.

Fitur tahap 1:
- room berdasarkan kode
- nama pemain
- sinkronisasi posisi, rotasi, dan status kendaraan
- pemain lain tampil sebagai karakter 3D
- reconnect/manual keluar
- single-player tetap berjalan jika server tidak tersedia
