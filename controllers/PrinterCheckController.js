const { exec } = require("child_process");
const net = require("net");

const SOCKET_TIMEOUT = 3000; // 3 detik - aman untuk latency ZeroTier
const PING_TIMEOUT = 1500; // ms, aman untuk ZeroTier (sebelumnya 200ms)
const RETRY_DELAY = 500; // tunggu 500ms sebelum retry

class PrinterCheckController {
  static checkPrinterTcp(printer) {
    return new Promise((resolve) => {
      const client = new net.Socket();
      let settled = false;

      const finish = (status) => {
        if (settled) return;
        settled = true;
        client.destroy();
        resolve({ ip: printer.ip, name: printer.name, status });
      };

      client.setTimeout(SOCKET_TIMEOUT);
      client.connect(printer.port, printer.ip, () => finish("ONLINE"));
      client.on("error", () => finish("OFFLINE"));
      client.on("timeout", () => finish("OFFLINE"));
    });
  }

  static checkPrinterPing(printer) {
    return new Promise((resolve) => {
      exec(
        `ping -n 1 -w ${PING_TIMEOUT} ${printer.ip}`,
        { windowsHide: true }, // hilangkan CMD window blinking
        (error, stdout) => {
          const isConnected = !error && stdout.includes("TTL=");
          resolve({
            ip: printer.ip,
            name: printer.name,
            status: isConnected ? "ONLINE" : "OFFLINE",
          });
        },
      );
    });
  }

  static async checkPrinter(printer) {
    // Gunakan TCP jika port tersedia, fallback ke ping jika tidak
    const doCheck = printer.port
      ? () => PrinterCheckController.checkPrinterTcp(printer)
      : () => PrinterCheckController.checkPrinterPing(printer);

    const result = await doCheck();
    if (result.status === "ONLINE") return result;

    // Retry sekali sebelum mark OFFLINE — cegah false-offline karena ZeroTier blip
    await new Promise((res) => setTimeout(res, RETRY_DELAY));
    return doCheck();
  }

  static async check(req, res) {
    try {
      const listPrinter = req.body || [];

      const results = await Promise.all(
        listPrinter.map((printer) =>
          PrinterCheckController.checkPrinter(printer),
        ),
      );

      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }

  static async checkByIp(req, res) {
    try {
      const { ip, name, port } = req.body;
      const result = await PrinterCheckController.checkPrinter({
        ip,
        name,
        port,
      });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }
}

module.exports = PrinterCheckController;
