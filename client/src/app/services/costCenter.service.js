import httpService from "./http.service";

const costCenterEndpoint = "costcenter/";

const costCenterService = {
  fetchAll: async () => {
    const { data } = await httpService.get(costCenterEndpoint);
    return data;
  }
};

export default costCenterService;
