import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import userService from "../services/user.service";
import localStorageService, { setTokens } from "../services/localStorage.service";
import { toast } from "react-toastify";
import authService from "../services/auth.service";
import configFile from "../config.json";
import { CircularProgress } from "@mui/material";

const AuthContext = React.createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  async function getUserData() {
    try {
      const content = await userService.getCurrentUser();
      setCurrentUser(content);
    } catch (error) {
      errorCatcher(error);
    } finally {
      setIsLoading(false);
    };
  };

  useEffect(() => {
    if (localStorageService.getAccessToken()) {
      getUserData();
    } else {
      setIsLoading(false);
    };
  }, []);

  async function logIn({ email, password }) {
    try {
      const data = await authService.login({ email, password });
      data.localId = data.userId;
      data.idToken = data.accessToken;
      setTokens(data);
      await getUserData();
    } catch (error) {
      errorCatcher(error);
      const { code, message } = error.response.data.error;
      if (code === 400) {
        switch (message) {
        case "INVALID_PASSWORD":
          throw new Error("Email or password are incorrect");
        case "EMAIL_NOT_FOUND":
          throw new Error("Email or password are incorrect");
        default:
          throw new Error("Too many log in attempts. Try again later.");
        };
      };
    };
  };

  function logOut() {
    localStorageService.removeAuthData();
    setCurrentUser(null);
  };

  async function signUp(payload) {
    try {
      const data = await authService.register(payload);
      data.localId = data.userId;
      data.idToken = data.accessToken;
      if (payload.logMeIn) {
        setTokens(data);
        await getUserData();
      }
      if (configFile.isFireBase) {
        await createUser({ ...payload, _id: data.localId });
      } else {
        return data;
      };
    } catch (error) {
      errorCatcher(error);
      const { code, message } = error.response.data.error;
      if (code === 400) {
        if (message === "EMAIL_EXISTS") {
          const errorObject = { email: "User with such email already exists" };
          throw errorObject;
        };
      };
    };
  };

  async function createUser(data) {
    try {
      const { content } = await userService.create(data);
      setCurrentUser(content);
    } catch (error) {
      errorCatcher(error);
    };
  };

  function errorCatcher(error) {
    const { message } = error.response.data;
    setError(message);
  };

  useEffect(() => {
    if (error !== null) {
      toast.error(error);
      setError(null);
    };
  }, [error]);

  return (
    <AuthContext.Provider value={{ currentUser, logIn, signUp, logOut, isLoading }}>
      {!isLoading ? children : <CircularProgress />}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
};
export default AuthProvider;
