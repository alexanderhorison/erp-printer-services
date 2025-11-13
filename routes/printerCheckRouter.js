const router = require("express").Router();
const PrinterCheckController = require("../controllers/PrinterCheckController");

router.post("/", PrinterCheckController.check);

module.exports = router;
