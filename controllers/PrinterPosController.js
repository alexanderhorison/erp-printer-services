const net = require("net");
const dns = require("dns");
const { promisify } = require("util");

const dnsLookup = promisify(dns.lookup);

// DNS Cache untuk mDNS/Bonjour hostname
const dnsCache = new Map();
const DNS_CACHE_TTL = 60000; // 60 detik

class PrinterPosController {
  static async printPos(req, res) {
    const startTime = Date.now();
    const timing = {};

    try {
      const { buffer, printerSetting } = req.body;

      if (!buffer) {
        return res.status(400).json({
          success: false,
          message: "buffer is required",
        });
      }

      // Default ke pos-tba-1.local (Bonjour network printer)
      // TIP: Gunakan IP langsung untuk menghindari DNS lookup delay
      const printerHost = printerSetting?.printerHost || "pos-tba-1.local";
      const printerPort = printerSetting?.printerPort || 9100; // Standard port untuk network POS printer

      console.log(`[TIMING] Request received at ${new Date().toISOString()}`);
      console.log(`[TIMING] Target printer: ${printerHost}:${printerPort}`);

      // Convert string buffer to binary Buffer
      let dataToPrintBuffer;
      if (typeof buffer === "string") {
        // String dengan escape sequences (\x1b, \n, dll) langsung convert ke Buffer
        dataToPrintBuffer = Buffer.from(buffer, "utf8");
      } else if (Buffer.isBuffer(buffer)) {
        dataToPrintBuffer = buffer;
      } else if (Array.isArray(buffer)) {
        dataToPrintBuffer = Buffer.from(buffer);
      } else {
        return res.status(400).json({
          success: false,
          message: "buffer must be string, Buffer, or array",
        });
      }

      timing.bufferConversion = Date.now() - startTime;
      console.log(`[TIMING] Buffer conversion: ${timing.bufferConversion}ms`);

      // Resolve hostname ke IP (dengan cache untuk performa)
      let resolvedIP = printerHost;

      // Cek apakah sudah IP address atau hostname
      const isIPAddress = /^(\d{1,3}\.){3}\d{1,3}$/.test(printerHost);

      if (!isIPAddress) {
        const dnsStartTime = Date.now();
        const cached = dnsCache.get(printerHost);

        if (cached && Date.now() - cached.timestamp < DNS_CACHE_TTL) {
          resolvedIP = cached.ip;
          timing.dnsLookup = Date.now() - dnsStartTime;
          console.log(
            `[TIMING] DNS cache hit: ${printerHost} -> ${resolvedIP} (${timing.dnsLookup}ms)`
          );
        } else {
          try {
            const result = await dnsLookup(printerHost);
            resolvedIP = result.address;
            dnsCache.set(printerHost, {
              ip: resolvedIP,
              timestamp: Date.now(),
            });
            timing.dnsLookup = Date.now() - dnsStartTime;
            console.log(
              `[TIMING] DNS lookup: ${printerHost} -> ${resolvedIP} (${timing.dnsLookup}ms)`
            );
          } catch (dnsErr) {
            console.error(
              `[TIMING] DNS lookup failed for ${printerHost}:`,
              dnsErr.message
            );
            return res.status(500).json({
              success: false,
              message: `Failed to resolve printer hostname: ${printerHost}`,
              error: dnsErr.message,
            });
          }
        }
      } else {
        console.log(`[TIMING] Using IP address directly: ${printerHost}`);
      }

      // Send raw binary data via TCP socket to network printer
      const client = new net.Socket();
      let hasResponded = false;
      let connectTime = 0;
      let writeTime = 0;

      // Set timeout untuk koneksi
      client.setTimeout(5000);

      const connectStartTime = Date.now();

      client.connect(printerPort, resolvedIP, () => {
        connectTime = Date.now() - connectStartTime;
        console.log(
          `[TIMING] Connected to printer ${printerHost}:${printerPort} in ${connectTime}ms`
        );

        const writeStartTime = Date.now();
        client.write(dataToPrintBuffer);
        writeTime = Date.now() - writeStartTime;
        console.log(`[TIMING] Data written in ${writeTime}ms`);

        client.end();
      });

      client.on("close", () => {
        if (!hasResponded) {
          hasResponded = true;
          const totalTime = Date.now() - startTime;
          console.log(`[TIMING] Connection closed. Total time: ${totalTime}ms`);

          return res.status(200).json({
            success: true,
            message: "Print successful",
          });
        }
      });

      client.on("error", (err) => {
        if (!hasResponded) {
          hasResponded = true;
          const totalTime = Date.now() - startTime;
          console.error(
            `[TIMING] Printer connection error after ${totalTime}ms:`,
            err
          );

          // Deteksi jenis error untuk pesan yang lebih jelas
          let errorMessage = "Print failed";
          if (err.code === "ECONNREFUSED") {
            errorMessage = "Printer is offline or unreachable";
          } else if (err.code === "EHOSTUNREACH") {
            errorMessage = "Printer network unreachable";
          } else if (err.code === "ETIMEDOUT") {
            errorMessage = "Printer connection timeout";
          }

          return res.status(500).json({
            success: false,
            message: errorMessage,
          });
        }
      });

      client.on("timeout", () => {
        client.destroy();
        if (!hasResponded) {
          hasResponded = true;
          const totalTime = Date.now() - startTime;
          console.log(`[TIMING] Connection timeout after ${totalTime}ms`);

          return res.status(500).json({
            success: false,
            message: "Printer connection timeout",
          });
        }
      });
    } catch (error) {
      console.error(error, "error printing POS");
      res.status(500).json({
        success: false,
        message: error.message || "Unexpected server error",
      });
    }
  }
}

module.exports = PrinterPosController;
