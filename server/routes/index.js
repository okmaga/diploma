const express = require("express");
const router = express.Router({ mergeParams: true});

router.use("/auth", require("./auth.routes"));
router.use("/user", require("./user.routes"));
router.use("/purchaseorder", require("./purchaseorder.routes"));
router.use("/costcenter", require("./costcenter.routes"));

module.exports = router;