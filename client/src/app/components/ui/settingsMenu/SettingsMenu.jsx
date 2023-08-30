import React, { useState } from "react";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import SettingsIcon from "@mui/icons-material/Settings";
import { useThemeContext } from "../../../hooks/useThemeContext";
import { FormControlLabel, Switch } from "@mui/material";

const SettingsMenu = () => {
  const { mode, toggleMode } = useThemeContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Tooltip title="Settings">
        <IconButton
          onClick={handleClick}
          size="small"
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <SettingsIcon sx={{ width: 32, height: 32 }}/>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
      >
        <FormControlLabel
          control={<Switch />}
          onClick={toggleMode}
          checked={mode === "dark"}
          label={mode === "dark" ? "dark mode" : "dark mode"}
        />
      </Menu>
    </>
  );
};

export default SettingsMenu;
