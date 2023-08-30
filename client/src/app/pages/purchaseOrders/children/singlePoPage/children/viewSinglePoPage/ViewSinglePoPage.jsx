import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./viewSinglePoPage.scss";
import Button from "@mui/material/Button";
import { getCurrentUser } from "../../../../../../store/authSlice";
import { approvePurchaseOrder, getPurchaseOrderById } from "../../../../../../store/purchaseOrdersSlice";
import { Chip } from "@mui/material";
import { getCostCenterById } from "../../../../../../store/costCenterSlice";
import { useToaster } from "../../../../../../hooks/useToaster";
import { LoadingButton } from "@mui/lab";

const ViewSinglePoPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(getCurrentUser());
  const { toast } = useToaster();
  const { id } = useParams();
  const po = useSelector(getPurchaseOrderById(id));

  const renderChip = (po) => {
    let color;

    switch (po.status) {
    case "Approved":
      color = "success";
      break;
    case "Pending":
      color = "warning";
      break;
    case "Rejected":
      color = "error";
      break;
    default:
      break;
    }

    return <Chip
      label={po.status}
      style={{ opacity: 0.85 }}
      size="small"
      variant="contained"
      color={color}
    />;
  };

  const isRequestor = currentUser && po && currentUser._id === po.requestor._id;

  const isManager = currentUser && po && currentUser.role === "manager";

  const isAdmin = currentUser && po && currentUser.role === "admin";

  const renderApproveButton = po.status === "Pending" && (isManager || isAdmin);
  const renderContent = (po, key) => {
    switch (key) {
    case "status":
      return renderChip(po);
    case "amount":
      return Number(po[key]).toLocaleString("en-US");
    case "costCenter":
      return useSelector(getCostCenterById(po[key])).title;
    case "timestamp": {
      const legacyDate = po?.timestamp ? new Date(po?.timestamp) : null;
      const updatedDate = new Date(po?.updatedAt);
      const createdDate = new Date(po?.createdAt);
      const date = updatedDate > createdDate ? updatedDate : legacyDate ?? createdDate;
      const dayMonth = date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
      return dayMonth;
    }
    default:
      return po[key];
    };
  };

  const keysToDisplay = ["title", "amount", "description", "status", "costCenter", "timestamp"];

  const handleApprove = () => {
    setIsLoading(true);
    try {
      dispatch(approvePurchaseOrder([po]))
        .unwrap()
        .then(() => {
          navigate("/purchase-orders");
          toast.success("Approved");
        })
        .catch((error) => {
          toast.error(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch (error) {
      toast.error(error);
    };
  };

  return (
    <div className="single-po-page">
      <h1>Purchase order</h1>
      {po && keysToDisplay.map(key =>
        <div key={key} className="po-row">
          <div className="po-row-key">{key}</div>
          <div className="po-row-value">{renderContent(po, key)}
          </div>
        </div>)
      }
      {isRequestor &&
        <Button
          style={{ marginTop: "2rem", marginLeft: "0.5rem" }}
          variant="contained"
          onClick={() => navigate("edit")}
        >Edit</Button>
      }
      {(renderApproveButton) &&
        <LoadingButton
          loading={isLoading}
          style={{ marginTop: "2rem", marginLeft: "0.5rem" }}
          variant="contained"
          onClick={handleApprove}
        >Approve</LoadingButton>
      }
    </div>
  );
};

export default ViewSinglePoPage;
