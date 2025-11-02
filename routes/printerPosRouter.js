const router = require("express").Router();
const PrinterPosController = require("../controllers/PrinterPosController");

router.post("/print-file", PrinterPosController.printPos);

module.exports = router;
