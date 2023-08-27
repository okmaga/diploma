const User = require("../models/User");
const PurchaseOrder = require("../models/PurchaseOrder");
const CostCenter = require("../models/CostCenter");
const bcrypt = require("bcryptjs");
const usersMock = require("../mock/users.json");
const purchaseOrdersMock = require("../mock/purchaseOrders.json");
const costCentersMock = require("../mock/costCenters.json");



module.exports = async () => {
  const users = await User.find();
  if (users.length !== usersMock.length) {
    await createInitialEntity(User, usersMock);
  }

  const purchaseOrders = await PurchaseOrder.find();
  if (purchaseOrders.length !== purchaseOrdersMock.length) {
    console.log(purchaseOrders.length);
    console.log(purchaseOrdersMock.length);
    await createInitialEntity(PurchaseOrder, purchaseOrdersMock);
  }

  const costCenters = await CostCenter.find();
  if (costCenters.length !== costCentersMock.length) {
    await createInitialEntity(CostCenter, costCentersMock);
  }
};

async function createInitialEntity(Model, data) {
  await Model.collection.drop();

  return Promise.all(
    data.map(async item => {
      try {
        delete item.id;
        if (item.description) {
          const words = item.description.split(" ");
          item.title = `New ${words[0].toLowerCase()} ${words[1].toLowerCase()}`;
        };

        if (item.costCenter) {
          const costCenterDb = await CostCenter.findOne({ title: item.costCenter });
          item.costCenter = costCenterDb._id;
        };

        if (item?.managers) {
          const newManagersArr = await Promise.all(
            item.managers.map(async email => {
              const manager = await User.findOne({ email });
              return manager._id;
            })
          )

          item.managers = newManagersArr;
        };

        if (item?.requestor) {
          const requestor = await User.findOne({ email: item.requestor });
          item.requestor = { email: item.requestor, _id: requestor._id };
        };
        if (item?.password) {
          item.password = await bcrypt.hash(item.password, 12)
        };


        const newItem = new Model(item);
        await newItem.save();
        return newItem;
      } catch (e) {
        return e;
      }
    })
  )
};

