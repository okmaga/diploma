import axios from "axios";
import localStorageService from "./localStorage.service";

const httpAuth = axios.create({
  // baseURL: "https://identitytoolkit.googleapis.com/v1/accounts:",
  // params: {
  //   key: process.env.REACT_APP_FIREBASE_KEY
  // }
  baseURL: "http://localhost:8080/api/auth/"
});

const authService = {
  register: async ({ email, password, ...rest }) => {
    const { data } = await httpAuth.post(`signUp`, { email, password, returnSecureToken: true, ...rest });
    console.log(data);
    return data;
  },
  login: async ({ email, password }) => {
    const { data } = await httpAuth.post(`signInWithPassword`, { email, password, returnSecureToken: true });
    return data;
  },
  refresh: async () => {
    const { data } = await httpAuth.post("token", {
      grant_type: "refresh_token",
      refresh_token: localStorageService.getRefreshToken()
    });
    return data;
  }
};

export default authService;
