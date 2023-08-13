const express = require("express");
const router = express.Router({ mergeParams: true });
const PurchaseOrder = require("../models/PurchaseOrder");

router.get("/", async (req, res) => {
  try {
    const list = await PurchaseOrder.find();
    res.status(200).send(list);
  } catch (e) {
    res.status(500).json({
      message: "Server error. Try again later"
    })
  };
});

module.exports = router;