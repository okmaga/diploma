const express = require("express");
const router = express.Router({ mergeParams: true });
const PurchaseOrder = require("../models/PurchaseOrder");
const auth = require("../middleware/auth.middleware");
const User = require("../models/User");
const { ObjectId } = require("mongodb");

router.get("/", auth, async (req, res) => {
  try {
    if (req.isAdmin) {
      const list = await PurchaseOrder.find();
      res.status(200).send(list);
    } else {
      const user = await User.findById(req.user._id);
      const list = await PurchaseOrder.find({ $or: [{ "requestor._id": user._id }, { costCenter: user?.costCenter } ] });
      res.status(200).send(list);
    };
  } catch (e) {
    res.status(500).json({
      error: {
        message: "SERVER_ERROR",
        code: 500
      }
    })
  };
});

router.patch("/", auth, async (req, res) => {
  const { action, purchaseOrders } = req.body;
  const id =  req.user._id
  const dbUser = await User.findById(id);
  const { role, costCenter } = dbUser;

  switch (action) {
    case "approve": {
      const isManagerOfCostCenter =
        role === "manager"
        && purchaseOrders.every(po => {
          return po.costCenter.toString() === costCenter.toString()
        })

      const canApprove = isManagerOfCostCenter || req.isAdmin;

      if (!canApprove) {
        return res.status(401).json({error: {
            message: "NOT_AUTHORIZED",
            code: 401
          }});
      };

      const ids = purchaseOrders.map(po => po._id);

      const result = await PurchaseOrder.updateMany(
        { _id: { $in: ids } },
        { $set: { status: "Approved" } }
      );
      if (result.acknowledged && result.matchedCount === ids.length) {
        res.status(200).send(result);
      }
      break;
    }

    case "cancel": {
      const isRequestor =
        purchaseOrders.every(po => {
          return po.requestor._id.toString() === dbUser._id.toString()
        })

      const canCancel = isRequestor || req.isAdmin;

      if (!canCancel) {
        return res.status(401).json({error: {
            message: "NOT_AUTHORIZED",
            code: 401
          }});
      };
      const ids = purchaseOrders.map(po => po._id);
      const result = await PurchaseOrder.updateMany(
        { _id: { $in: ids }, status: "Pending" },
        { $set: { status: "Cancelled"} }
      );
      if (result.acknowledged && result.matchedCount !== ids.length) {
        res.status(200).send({...result, partiallyUpdated: true });
      }
      if (result.acknowledged && result.matchedCount === ids.length) {
        res.status(200).send(result);
      }
      break
    }
    default:
      return res.status(401).json({error: {
          message: "NOT_AUTHORIZED",
          code: 401
        }});
  }
});

module.exports = router;