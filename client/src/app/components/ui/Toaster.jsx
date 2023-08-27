import React from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useToaster } from "../../hooks/useToaster";
import { Alert } from "@mui/material";

const Toaster = () => {
  const { open, setOpen, message, severity, onAction } = useToaster();

  const action = (
    <>
      <Button
        color="secondary"
        size="small"
        onClick={onAction?.func}
      >
        {onAction?.title}
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={() => setOpen(false)}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      autoHideDuration={6000}
    >
      <Alert
        onClose={() => setOpen(false)}
        action={onAction ? action : null}
        severity={severity}
        sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toaster;
