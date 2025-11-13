const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

class PrinterCheckController {
  static async checkPrinter(printer) {
    try {
      // Ping dengan timeout sangat cepat (200ms)
      const { stdout } = await execPromise(`ping -n 1 -w 200 ${printer.ip}`);

      const isConnected = stdout.includes("TTL=");

      return {
        ip: printer.ip,
        name: printer.name,
        status: isConnected ? "connected" : "rto",
      };
    } catch (error) {
      return {
        ip: printer.ip,
        name: printer.name,
        status: "rto",
      };
    }
  }

  static async check(req, res) {
    try {
      const listPrinter = req.body || [];

      const results = await Promise.all(
        listPrinter.map((printer) =>
          PrinterCheckController.checkPrinter(printer)
        )
      );

      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }
}

module.exports = PrinterCheckController;
