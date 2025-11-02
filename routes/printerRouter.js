const router = require("express").Router();
const PrinterController = require("../controllers/PrinterDotMatrixController");

router.post("/print-file", PrinterController.printDotMatrix);

module.exports = router;
