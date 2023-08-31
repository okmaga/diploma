import React from "react";
import { Navigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getPurchaseOrderById } from "../../../../../../store/purchaseOrdersSlice";
import PoForm from "../../../../../../components/ui/poForm/PoForm";
import { getCostCenterById } from "../../../../../../store/costCenterSlice";
import { useToaster } from "../../../../../../hooks/useToaster";

const EditPoPage = () => {
  const { id } = useParams();
  const { toast } = useToaster();
  const po = useSelector(getPurchaseOrderById(id));
  const costCenter = po && useSelector(getCostCenterById(po.costCenter));
  const poData = { ...po, costCenter: costCenter.title };
  if (po.status === "Approved") {
    toast.warning("This PO cannot be updated");
    return <Navigate to={`/purchase-orders/${id}`}/>;
  };

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
