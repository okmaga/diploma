import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getPurchaseOrderById } from "../../../../../../store/purchaseOrdersSlice";
import PoForm from "../../../../../../components/ui/poForm/PoForm";
import { getCostCenterById } from "../../../../../../store/costCenterSlice";
const EditPoPage = () => {
  const { id } = useParams();
  const po = useSelector(getPurchaseOrderById(id));
  const costCenter = po && useSelector(getCostCenterById(po.costCenter));
  const poData = { ...po, costCenter: costCenter.title };

  return (
    <div>
      <h1 style={{ marginBottom: "3rem" }}>Edit purchase order</h1>
      <PoForm
        mode="edit"
        poData={poData}
      />
    </div>
  );
};

export default EditPoPage;
