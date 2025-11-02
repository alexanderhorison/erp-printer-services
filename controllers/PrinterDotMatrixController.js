const fs = require("fs");
const { exec } = require("child_process");

class PrinterDotMatrixController {
  static async printDotMatrix(req, res) {
    try {
      const { fileName, buffer, printerSetting } = req.body;
      if (!fileName || !buffer || !printerSetting) {
        return res.status(400).json({
          error: "fileName and buffer and printer setting are required",
        });
      }

      console.log("🖨️ Incoming print request:", req.body);

      const { printerIp, queueName } = printerSetting;

      // Simpan sementara file
      const tmpPath = `./tmp/${fileName}`;
      // 1. Save file
      try {
        fs.writeFileSync(tmpPath, buffer, "utf-8");
      } catch (err) {
        console.error("File write error:", err);
        fs.unlinkSync(tmpPath);
        throw {
          code: 500,
          message: err.message || "Failed to save temporary file",
        };
      }
      // Eksekusi LPR
      exec(
        `lpr -S ${printerIp} -P ${queueName} ${tmpPath}`,
        (err, stdout, stderr) => {
          try {
            // Always clean up tmp file
            if (fs.existsSync(tmpPath)) {
              fs.unlinkSync(tmpPath);
            }
          } catch (cleanupErr) {
            console.warn("⚠️ Failed to clean up tmp file:", cleanupErr.message);
          }

          const stderrMsg = stderr ? stderr.trim() : "";
          const stdoutMsg = stdout ? stdout.trim() : "";

          const errorIndicators = ["aborted", "error", "not found", "unable"];
          if (
            err ||
            errorIndicators.some(
              (ind) =>
                stderrMsg.toLowerCase().includes(ind) ||
                stdoutMsg.toLowerCase().includes(ind)
            )
          ) {
            console.error(
              "❌ LPR execution error:",
              err || stderrMsg || stdoutMsg
            );
            return res.status(500).json({
              success: false,
              message:
                stderrMsg ||
                stdoutMsg ||
                err.message ||
                "Failed to send to printer",
            });
          }

          return res.status(200).json({
            success: true,
            message: `Print success for ${fileName}`,
          });
        }
      );
    } catch (err) {
      console.error(err, "error dr sini");
      res.status(500).json({
        success: false,
        message: err.message || "Unexpected server error",
      });
    }
  }
}

module.exports = PrinterDotMatrixController;
