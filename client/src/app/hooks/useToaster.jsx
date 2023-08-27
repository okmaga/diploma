import React, { useContext, useState } from "react";
import PropTypes from "prop-types";

const ToastContext = React.createContext();

export const useToaster = () => {
  return useContext(ToastContext);
};

const ToastProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [onAction, setOnAction] = useState(null);
  const [severity, setSeverity] = useState("info");

  const launch = (text, onAction, duration = 6000) => {
    setMessage(text);
    setOnAction(onAction);
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
      setMessage("");
      setSeverity("info");
      setOnAction(null);
    }, duration);
  };

  const toast = {
    info: (text, onAction) => {
      setSeverity("info");
      launch(text, onAction);
    },
    success: (text, onAction) => {
      setSeverity("success");
      launch(text, onAction);
    },
    warning: (text, onAction) => {
      setSeverity("warning");
      launch(text, onAction);
    },
    error: (text, onAction) => {
      setSeverity("error");
      launch(text, onAction);
    }
  };

  return (
    <ToastContext.Provider value={{ open, setOpen, severity, message, toast, onAction }}>
      {children}
    </ToastContext.Provider>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
};

export default ToastProvider;
