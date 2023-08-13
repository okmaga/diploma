import React from "react";
import "./costCenters.scss";
import CostCenterCard from "../../components/ui/costCenterCard/CostCenterCard";

const CostCenters = () => {
  return (
    <div className="costCenters">
      <h1 className="page-title">Cost Centers</h1>
      <div className="page-container">
        <CostCenterCard name={"HR"} value={0.25}/>
        <CostCenterCard name={"Community Relations"} value={0.95}/>
        <CostCenterCard name={"Director's Office"} value={0.75}/>
        <CostCenterCard name={"Building Maintenance"} value={1.25}/>
      </div>
    </div>
  );
};

export default CostCenters;
