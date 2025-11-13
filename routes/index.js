const router = require("express").Router();
const PrinterRouter = require("./printerRouter");
const PrinterPosRouter = require("./printerPosRouter");
const PrinterCheckRouter = require("./printerCheckRouter");

router.use("/printer-check", PrinterCheckRouter);

router.use("/print-api", PrinterRouter);

router.use("/print-pos-api", PrinterPosRouter);

module.exports = router;
