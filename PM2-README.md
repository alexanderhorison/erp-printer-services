# PM2 Setup - ERP Printer Services

## Install PM2

```bash
# Install PM2 globally
npm install -g pm2

# Atau install sebagai dev dependency
npm install --save-dev pm2
```

## Cara Menggunakan

### 1. Start Aplikasi

```bash
# Menggunakan npm script
npm run pm2:start

# Atau langsung dengan PM2
pm2 start ecosystem.config.js
```

### 2. Monitor Aplikasi

```bash
# Lihat status
pm2 status

# Lihat logs real-time
npm run pm2:logs
# atau
pm2 logs erp-printer-service

# Monitor resource usage
npm run pm2:monit
# atau
pm2 monit
```

### 3. Stop/Restart/Delete

```bash
# Stop aplikasi
npm run pm2:stop

# Restart aplikasi
npm run pm2:restart

# Delete dari PM2
npm run pm2:delete
```

### 4. Setup Auto-start (Windows)

**PENTING**: Agar aplikasi start otomatis saat mesin restart/reboot.

```bash
# Step 1: Generate startup script
pm2 startup

# Step 2: Copy command yang muncul dan run sebagai Administrator

# Step 3: Save process list
pm2 save
```

**Atau gunakan script yang sudah disediakan:**

```bash
./setup-autostart.bat
```

📖 **Panduan lengkap**: Lihat [AUTO-START-GUIDE.md](./AUTO-START-GUIDE.md)

> **Catatan**: Tanpa setup ini, aplikasi TIDAK akan otomatis jalan setelah mesin restart!

## Perintah PM2 Berguna Lainnya

```bash
# Lihat detail aplikasi
pm2 show erp-printer-service

# Lihat logs
pm2 logs erp-printer-service --lines 100

# Flush logs
pm2 flush

# Reload aplikasi (zero downtime)
pm2 reload erp-printer-service

# Restart semua apps
pm2 restart all

# Stop semua apps
pm2 stop all

# Delete semua apps
pm2 delete all

# Reset restart count
pm2 reset erp-printer-service
```

## Update Aplikasi

Ketika ada perubahan code:

```bash
# Pull changes
git pull

# Install dependencies (jika ada perubahan)
npm install

# Restart aplikasi
npm run pm2:restart
```

## Konfigurasi Environment

Edit file `.env` untuk mengubah PORT atau environment lainnya, lalu restart:

```bash
npm run pm2:restart
```

## Cluster Mode (Optional)

Untuk load balancing, edit `ecosystem.config.js`:

```javascript
instances: 'max',  // atau angka spesifik
exec_mode: 'cluster'
```

Lalu restart:

```bash
pm2 reload ecosystem.config.js
```

## Logs Location

Logs disimpan di folder `./logs/`:

- `err.log` - Error logs
- `out.log` - Standard output logs
- `combined.log` - Combined logs

## Troubleshooting

### PM2 command not found

Install PM2 global:

```bash
npm install -g pm2
```

### Port already in use

Cek process yang menggunakan port:

```bash
netstat -ano | findstr :3000
```

Kill process:

```bash
taskkill /PID <PID_NUMBER> /F
```

### Aplikasi tidak start

Cek logs:

```bash
pm2 logs erp-printer-service --err
```

## Production Best Practices

1. ✅ Setup auto-startup
2. ✅ Enable log rotation
3. ✅ Set max memory restart
4. ✅ Configure environment variables
5. ✅ Regular log monitoring
6. ✅ Backup ecosystem.config.js

## Log Rotation (Recommended)

Install PM2 log rotate module:

```bash
pm2 install pm2-logrotate

# Configure
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true
```

## Quick Reference

| Command               | Description             |
| --------------------- | ----------------------- |
| `npm run pm2:start`   | Start aplikasi          |
| `npm run pm2:stop`    | Stop aplikasi           |
| `npm run pm2:restart` | Restart aplikasi        |
| `npm run pm2:logs`    | Lihat logs              |
| `npm run pm2:monit`   | Monitor resource        |
| `pm2 status`          | Status semua apps       |
| `pm2 save`            | Save process list       |
| `pm2 resurrect`       | Restore saved processes |

Selamat menggunakan PM2! 🚀
