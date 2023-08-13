import httpService from "./http.service";

const purchaseOrderEndpoint = "purchaseorder/";

const purchaseOrderService = {
  fetchAll: async () => {
    const { data } = await httpService.get(purchaseOrderEndpoint);
    return data;
  }
};

export default purchaseOrderService;
