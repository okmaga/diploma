import React from "react";
import { LinearProgress } from "@mui/material";
import PropTypes from "prop-types";
import "./costCenterCard.scss";

const CostCenterCard = ({ name, value, limit }) => {
  const min = 0;
  const normalise = (value) => ((value - min) * 100) / (limit - min);

  return (
    <div className="cost-center-card">
      <p className="cost-center-title">{name}</p>
      <div className="cost-center-spent">{(Math.floor(value / 1000)).toLocaleString("en-US")} out {(limit / 1000).toLocaleString("en-US")}</div>
      <div className="cost-center-progress">
        <LinearProgress sx={{ height: 10, borderRadius: "1rem" }} variant="determinate" value={normalise(value)} />
      </div>
    </div>
  );
};

CostCenterCard.propTypes = {
  value: PropTypes.number,
  limit: PropTypes.number,
  name: PropTypes.string
};

export default CostCenterCard;
