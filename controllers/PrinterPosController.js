

class PrinterPosController {
  static async printPos(req, res) {
    try {
      
    } catch (error) {
      console.error(err, "error printing POS");
      res.status(500).json({
        success: false,
        message: err.message || "Unexpected server error",
      });
    }
  }
}

module.exports = PrinterPosController;