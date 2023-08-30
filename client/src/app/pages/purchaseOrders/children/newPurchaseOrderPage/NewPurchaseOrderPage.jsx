import React from "react";
import "./newPurchaseOrderPage.scss";
import PoForm from "../../../../components/ui/poForm/PoForm";

const NewPurchaseOrderPage = () => {
  return (
    <div>
      <h1 style={{ marginBottom: "2rem" }}>Create purchase order</h1>
      <PoForm />
    </div>
  );
};

export default NewPurchaseOrderPage;
