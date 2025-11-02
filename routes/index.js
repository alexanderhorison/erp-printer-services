const router = require("express").Router();
const PrinterRouter = require("./printerRouter");

router.use("/print-api", PrinterRouter);
router.use("/print-pos-api", PrinterRouter);

module.exports = router;
