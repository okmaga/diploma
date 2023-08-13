const User = require("../models/User")
const PurchaseOrder = require("../models/PurchaseOrder")

const usersMock = require("../mock/users.json");
const purchaseOrdersMock = require("../mock/purchaseOrders.json");

module.exports = async () => {
  const users = await User.find();
  if (users.length !== usersMock.length) {
    await createInitialEntity(User, usersMock);
  }

  const purchaseOrders = await PurchaseOrder.find();
  if (purchaseOrders.length !== purchaseOrdersMock.length) {
    await createInitialEntity(PurchaseOrder, purchaseOrdersMock);
  }
};

async function createInitialEntity(Model, data) {
  await Model.collection.drop();

  return Promise.all(
    data.map(async item => {
      try {
        delete item.id;
        const newItem = new Model(item);
        await newItem.save();
        return newItem;
      } catch (e) {
        return e;
      }
    })
  )
};
