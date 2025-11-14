const router = require("express").Router();
const PrinterCheckController = require("../controllers/PrinterCheckController");

router.post("/", PrinterCheckController.check);
router.post("/single", PrinterCheckController.checkByIp);

module.exports = router;
