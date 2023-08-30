import httpService from "./http.service";

const purchaseOrderEndpoint = "purchaseorder/";

const purchaseOrderService = {
  fetchAll: async () => {
    const { data } = await httpService.get(purchaseOrderEndpoint);
    return data;
  },
  create: async (payload) => {
    const { data } = await httpService.post(purchaseOrderEndpoint, payload);
    return data;
  },
  update: async (payload) => {
    const { data } = await httpService.patch(purchaseOrderEndpoint + payload._id, payload);
    return data;
  },
  bulkApprove: async (payload) => {
    const { data } = await httpService.patch(purchaseOrderEndpoint, { purchaseOrders: payload, action: "approve" });
    return data;
  },
  bulkCancel: async (payload) => {
    const { data } = await httpService.patch(purchaseOrderEndpoint, { purchaseOrders: payload, action: "cancel" });
    return data;
  }
};

export default purchaseOrderService;
