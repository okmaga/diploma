const express = require("express");
const CostCenter = require("../models/CostCenter");
const User = require("../models/User");
const router = express.Router({ mergeParams: true});
const auth = require("../middleware/auth.middleware");

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const list = await CostCenter.find();

    if (req.isAdmin) {
      res.status(200).send(list);
    } else if (user.role === "manager") {
      const filteredList = list.map(cc => {
        const isManagerOfCc = cc.managers.some(manager => {
          return manager._id.toString() === user._id.toString()
        });

        if (!isManagerOfCc) {
          cc.limit = 0;
        };
        return cc;
      });
      res.status(200).send(filteredList);
    } else {
      const filteredList = list.map(cc => {
        cc.limit = 0;
        return cc;
      });
      res.status(200).send(filteredList);
    };
  } catch (e) {
    res.status(500).json({
      message: "Server error. Try again later"
    })
  }
});

router.patch("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(req.user._id);

    if (user.role === "admin") {
      const updatedCostCenter = await CostCenter.findByIdAndUpdate(id, req.body, { new: true });
      res.send(updatedCostCenter);
    } else {
      return res.status(401).json({message: "Unathorized"});
    }
  } catch (e) {
    res.status(500).json({
      message: "Server error. Try again later"
    })
  }
})



module.exports = router;
