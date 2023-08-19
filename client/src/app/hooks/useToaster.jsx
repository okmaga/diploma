import React, { useContext, useState } from "react";
import PropTypes from "prop-types";

const ToastContext = React.createContext();

export const useToaster = () => {
  return useContext(ToastContext);
};

const ToastProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("info");

  const launch = (text, duration = 6000) => {
    setMessage(text);
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
      setMessage("");
      setSeverity("info");
    }, duration);
  };

  const toast = {
    info: (text) => {
      setSeverity("info");
      launch(text);
    },
    success: (text) => {
      setSeverity("success");
      launch(text);
    },
    warning: (text) => {
      setSeverity("warning");
      launch(text);
    },
    error: (text) => {
      setSeverity("error");
      launch(text);
    }
  };

  return (
    <ToastContext.Provider value={{ open, severity, message, toast }}>
      {children}
    </ToastContext.Provider>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
};

export default ToastProvider;
