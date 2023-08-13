import React from "react";
import { LinearProgress } from "@mui/material";
import PropTypes from "prop-types";
import "./costCenterCard.scss";

const CostCenterCard = ({ name, value }) => {
  const MAX = 2;
  const MIN = 0;
  const normalise = (value) => ((value - MIN) * 100) / (MAX - MIN);

  return (
    <div className="cost-center-card">
      <p className="cost-center-title">{name}</p>
      <div className="cost-center-spent">{value}M out 2M</div>
      <div className="cost-center-progress">
        <LinearProgress sx={{ height: 10, borderRadius: "1rem" }} variant="determinate" value={normalise(value)} />
      </div>
    </div>
  );
};

CostCenterCard.propTypes = {
  value: PropTypes.number,
  name: PropTypes.string
};

export default CostCenterCard;
