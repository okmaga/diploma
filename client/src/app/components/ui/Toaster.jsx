import React from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useToaster } from "../../hooks/useToaster";
import { Alert } from "@mui/material";

const Toaster = () => {
  const { open, message, severity } = useToaster();

  const action = (
    <>
      <Button
        color="secondary"
        size="small"
        onClick={() => console.log("click")}
      >
        Undo
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={() => console.log("click")}
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
        onClose={() => console.log("close")}
        action={action}
        severity={severity}
        sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toaster;
