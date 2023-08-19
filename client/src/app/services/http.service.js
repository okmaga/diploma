import axios from "axios";
import { toast } from "react-toastify";
import configFile from "../config.json";
import localStorageService, { setTokens } from "./localStorage.service";
import authService from "./auth.service";

const http = axios.create({
  baseURL: configFile.apiEndpoint
});

http.interceptors.request.use(
  async function (config) {
    if (configFile.isFireBase) {
      const containsSlash = /\/$/gi.test(config.url);
      config.url = (containsSlash ? config.url.slice(0, -1) : config.url) + ".json";
    }
    const refreshToken = localStorageService.getRefreshToken();
    const expiresDate = localStorageService.getTokenExpiresDate();
    if (refreshToken && expiresDate < Date.now()) {
      const data = await authService.refresh();
      setTokens({
        refreshToken: data.refreshToken,
        idToken: data.accessToken,
        localId: data.userId,
        expiresIn: data.expires_in
      });
    }
    const accessToken = localStorageService.getAccessToken();
    if (accessToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`
      };
    }
    return config;
  }, function (error) {
    return Promise.reject(error);
  }
);

function transformData(data) {
  return data && !data._id
    ? Object.keys(data).map(key => ({
      ...data[key]
    }))
    : data;
};
http.interceptors.response.use(
  (res) => {
    if (configFile.isFireBase) {
      res.data = { content: transformData(res.data) };
    }
    return res;
  },
  function (error) {
    const expectedErrors = error.response && error.response.status >= 400 && error.response.status < 500;
    if (!expectedErrors) {
      toast.error("Something went wrong. Try again later.");
    };
    return Promise.reject(error);
  });

const httpService = {
  get: http.get,
  post: http.post,
  put: http.put,
  delete: http.delete,
  patch: http.patch
};

export default httpService;
