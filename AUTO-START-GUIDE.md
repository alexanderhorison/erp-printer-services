# Auto-Start Setup untuk PM2 di Windows

## Apa yang Terjadi Saat Mesin Mati?

Saat ini, jika mesin mati/restart, aplikasi **TIDAK** akan otomatis jalan lagi. Anda perlu setup auto-start terlebih dahulu.

## Setup Auto-Start (Sekali Saja)

### Opsi 1: Menggunakan Script (Mudah)

Jalankan file batch yang sudah disediakan:

```bash
./setup-autostart.bat
```

Ikuti instruksi yang muncul di layar.

### Opsi 2: Manual

#### Step 1: Generate Startup Script

```bash
pm2 startup
```

Output akan seperti ini:

```
[PM2] You have to run this command as administrator:
[PM2]     C:\...\pm2.cmd startup ...
```

#### Step 2: Copy dan Jalankan Command sebagai Administrator

1. Copy command yang diberikan PM2
2. Buka Command Prompt atau PowerShell **sebagai Administrator** (klik kanan -> Run as Administrator)
3. Paste dan jalankan command tersebut

#### Step 3: Save Process List

```bash
pm2 save
```

Ini akan menyimpan semua aplikasi yang sedang running.

## Verifikasi Auto-Start

### Test 1: Restart PM2

```bash
pm2 kill
pm2 resurrect
```

Aplikasi seharusnya muncul kembali.

### Test 2: Restart Komputer

1. Restart komputer Anda
2. Buka terminal
3. Jalankan: `pm2 list`
4. Aplikasi seharusnya sudah running otomatis ✅

## Fitur Auto-Restart yang Sudah Ada

File `ecosystem.config.js` sudah memiliki konfigurasi auto-restart:

```javascript
autorestart: true,           // Auto-restart jika crash
max_memory_restart: '500M',  // Restart jika memory > 500MB
```

### Skenario yang Sudah Di-handle:

✅ **Aplikasi crash** → PM2 auto-restart  
✅ **Memory leak (>500MB)** → PM2 restart  
✅ **Error/exception** → PM2 restart

### Skenario yang Perlu Setup Manual:

❌ **Mesin restart/reboot** → Perlu setup `pm2 startup`  
❌ **PM2 dienable** → Perlu setup `pm2 startup`

## Perintah Berguna

### Lihat Status Auto-Start

```bash
pm2 startup
```

Jika sudah setup, akan muncul: "Platform [win32] has been added to startup"

### Hapus Auto-Start

```bash
pm2 unstartup
```

### Update Process List yang Disave

Setiap kali ada perubahan aplikasi (tambah/hapus), jalankan:

```bash
pm2 save
```

### Restore Saved Processes

```bash
pm2 resurrect
```

## Alternatif: Windows Task Scheduler

Jika `pm2 startup` tidak work, gunakan Windows Task Scheduler:

1. Buka Task Scheduler
2. Create Basic Task
3. Trigger: "When the computer starts"
4. Action: "Start a program"
5. Program: `pm2`
6. Arguments: `resurrect`
7. Start in: `C:\Users\YourUsername`

## Troubleshooting

### PM2 tidak auto-start setelah reboot

**Solusi 1**: Jalankan ulang setup sebagai Administrator

```bash
pm2 startup
# Copy command yang muncul
# Run as Administrator
pm2 save
```

**Solusi 2**: Gunakan Windows Service Wrapper

- Install `pm2-windows-service`
- Lebih stable untuk Windows

**Solusi 3**: Gunakan Windows Task Scheduler (dijelaskan di atas)

### Aplikasi tidak muncul setelah resurrect

Cek apakah process list sudah disave:

```bash
pm2 save
```

Cek file dump:

```bash
pm2 list
pm2 dump
```

## Best Practice untuk Production

1. ✅ Setup `pm2 startup` (sekali saja)
2. ✅ Jalankan `pm2 save` setiap kali ada perubahan aplikasi
3. ✅ Test restart mesin untuk verifikasi
4. ✅ Setup monitoring/alerting jika aplikasi down
5. ✅ Backup file dump PM2 secara berkala

## Summary

| Skenario      | Auto-Restart? | Setup Required                 |
| ------------- | ------------- | ------------------------------ |
| App crash     | ✅ Yes        | Already configured             |
| Out of memory | ✅ Yes        | Already configured             |
| Mesin restart | ❌ No         | Run `pm2 startup` + `pm2 save` |
| PM2 dienable  | ❌ No         | Run `pm2 startup` + `pm2 save` |

---

**Next Step**: Jalankan `./setup-autostart.bat` atau ikuti manual steps di atas! 🚀
