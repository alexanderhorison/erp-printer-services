# ERP Printer Services

Layanan printer untuk sistem ERP yang berjalan dengan PM2.

## Prerequisites

- Node.js (v14 atau lebih tinggi)
- PM2 (Process Manager)

## Setup dan Menjalankan Aplikasi

### 1. Install Dependencies

```bash
npm install
```

### 2. Konfigurasi Environment

Salin file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Edit file `.env` dan atur PORT jika diperlukan (default: 3000):

```
PORT=3000
```

### 3. Install PM2

```bash
npm install -g pm2
```

### 4. Jalankan Aplikasi

**Development Mode (dengan nodemon):**

```bash
npm start
```

**Production Mode (dengan PM2):**

```bash
npm run pm2:start
```

### 5. Monitor Aplikasi

```bash
# Lihat status
pm2 status

# Lihat logs
npm run pm2:logs

# Monitor resource
npm run pm2:monit
```

### 6. Stop/Restart Aplikasi

```bash
# Stop
npm run pm2:stop

# Restart
npm run pm2:restart

# Delete dari PM2
npm run pm2:delete
```

### 7. Setup Auto-Start (Agar Otomatis Jalan Saat Restart Mesin)

**PENTING untuk Production!**

```bash
# Jalankan setup script
./setup-autostart.bat

# Atau manual:
pm2 startup  # Ikuti instruksi yang muncul
pm2 save     # Save process list
```

📖 **Panduan lengkap**: [AUTO-START-GUIDE.md](./AUTO-START-GUIDE.md)

## Testing

Setelah aplikasi berjalan, test dengan:

```bash
curl http://localhost:3000
```

Atau buka di browser: http://localhost:3000

Response yang diharapkan: `✅ Print server is running`

## Available Scripts

- `npm start` - Development mode dengan nodemon (hot-reload)
- `npm run prod` - Production mode dengan Node.js
- `npm run pm2:start` - Start dengan PM2
- `npm run pm2:stop` - Stop aplikasi PM2
- `npm run pm2:restart` - Restart aplikasi PM2
- `npm run pm2:delete` - Hapus aplikasi dari PM2
- `npm run pm2:logs` - Lihat logs PM2
- `npm run pm2:monit` - Monitor resource PM2

## Troubleshooting

### Port sudah digunakan

Jika port 3000 sudah digunakan, edit file `.env` dan ubah PORT ke nomor lain:

```
PORT=3001
```

Lalu restart aplikasi:

```bash
npm run pm2:restart
```

### PM2 command not found

Install PM2 secara global:

```bash
npm install -g pm2
```

### Aplikasi tidak start

Cek logs untuk detail error:

```bash
npm run pm2:logs
```

## Production Deployment

Untuk production, pertimbangkan:

1. **Auto-startup**: Setup PM2 startup script

   ```bash
   pm2 startup
   pm2 save
   ```

2. **Environment Variables**: Gunakan secrets management
3. **Log Rotation**: Install PM2 logrotate
   ```bash
   pm2 install pm2-logrotate
   ```
4. **Monitoring**: Setup PM2 Plus atau monitoring tools lainnya
5. **Reverse Proxy**: Gunakan nginx atau traefik di depan service

## Dokumentasi Lengkap

Untuk panduan lengkap penggunaan PM2, lihat [PM2-README.md](./PM2-README.md)
