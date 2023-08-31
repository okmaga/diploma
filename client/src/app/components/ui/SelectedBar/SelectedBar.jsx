import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./selectedBar.scss";
import DeselectIcon from "@mui/icons-material/Deselect";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import Button from "@mui/material/Button";
import useExpanded from "../../../hooks/useExpanded";
import Table from "../../common/table/Table";
import { Checkbox } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { approvePurchaseOrder, cancelPurchaseOrder } from "../../../store/purchaseOrdersSlice";
import { useToaster } from "../../../hooks/useToaster";
import { LoadingButton } from "@mui/lab";
import { getCurrentUser } from "../../../store/authSlice";
import CancelIcon from "@mui/icons-material/Cancel";
import Tooltip from "@mui/material/Tooltip";
import { useThemeContext } from "../../../hooks/useThemeContext";

const SelectedBar = ({ selectedRows, setSelectedRows, actionDisabled, purchaseOrdersCcTitlesMemo }) => {
  const { mode } = useThemeContext();
  const currentUser = useSelector(getCurrentUser());
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToaster();
  const dispatch = useDispatch();
  const { ref, isExpanded, setIsExpanded } = useExpanded(false);
  if (!selectedRows) return null;
  useEffect(() => {
    setIsExpanded(false);
  }, []);

  const undoAction = {
    title: "Undo",
    func: () => {
      console.log("Undone");
    }
  };

  const handleConfirmDeselect = (e, id) => {
    setSelectedRows(prev => prev.filter(po => po._id !== id));
  };

  const handleBulkApprove = () => {
    try {
      setIsLoading(true);
      dispatch(approvePurchaseOrder(selectedRows))
        .unwrap()
        .then(() => {
          toast.success("Approved", undoAction);
          setSelectedRows([]);
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

  const handleBulkCancel = () => {
    try {
      setIsLoading(true);
      dispatch(cancelPurchaseOrder(selectedRows))
        .unwrap()
        .then(() => {
          toast.info("Cancelled", undoAction);
          setSelectedRows([]);
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

  const style = mode === "light" ? {
    backgroundColor: "#2a3447",
    height: isExpanded ? `${selectedRows.length * 15}rem` : "3rem",
    opacity: isExpanded ? "97%" : "90%",
    color: "#eee"
  } : {
    height: isExpanded ? `${selectedRows.length * 15}rem` : "3rem",
    opacity: "100%",
    backgroundColor: "#bbb",
    color: "#2a3447"
  };

  const columns = {
    selector: {
      name: <Checkbox
        style={{ color: mode === "light" ? "white" : "#2a3447" }}
        checked={true}
        onClick={() => setSelectedRows([])}
      />,
      component: (purchaseOrder) =>
        <Checkbox
          style={{ color: mode === "light" ? "white" : "#2a3447" }}
          checked={true}
          onClick={(e) => handleConfirmDeselect(e, purchaseOrder._id)}
        />
    },
    index: {
      name: "#",
      component: (purchaseOrder, i) => i + 1
    },
    title: { name: "Title", path: "title" },
    costcenter: {
      name: "Cost Center",
      path: "costCenter",
      component: ({ _id }) => {
        const matchingCostCenter = purchaseOrdersCcTitlesMemo.find(po => po._id === _id);
        return matchingCostCenter.ccTitle;
      }
    },
    amount: {
      name: "Amount",
      path: "amount",
      component: (purchaseOrder) => purchaseOrder.amount.toLocaleString("en-US")
    }
  };

  return (
    <div
      ref={ref}
      className={"selected-bar" + (isExpanded ? " expanded" : "")}
      style={{ ...style }}
    >
      {!isExpanded && <>
        <div className="count">
          <span className="count-title">Selected: </span>
          <span className="count-number">{selectedRows.length}</span>
        </div>
        <div>
          <DeselectIcon
            style={{ margin: 0, padding: 0, cursor: "pointer" }}
            onClick={() => setSelectedRows([])}
          />
        </div>
        <div className="sum">
          <span className="sum-title">Total: </span>
          <span className="sum-number">
            {selectedRows.reduce((total, item) => total + item.amount, 0).toLocaleString("en-US")}
          </span>
        </div>
        <div>
          {currentUser.role !== "user" && <Tooltip
            placement="top"
            title={"Select \"Pending\" items"}
            open={actionDisabled}
          >
            <Button
              variant={isLoading ? "outlined" : "contained"}
              size="medium"
              disabled={actionDisabled}
              onClick={() => setIsExpanded(true)}>
              <AssignmentTurnedInIcon
              />Approve
            </Button>
          </Tooltip>}
          {currentUser.role === "user" && <Tooltip
            placement="top"
            title={"Select \"Pending\" items"}
            open={actionDisabled}
          >
            <Button
              variant={isLoading ? "outlined" : "contained"}
              disabled={actionDisabled}
              color="error"
              size="medium"
              onClick={() => setIsExpanded(true)}>
              <CancelIcon/>
              Cancel
            </Button>
          </Tooltip>
          }
        </div>
      </>}
      {isExpanded && <>
        <div className="table-container">
          <Table
            data={selectedRows}
            columns={columns}
            itemsCount={selectedRows.length}
            selectedRows={selectedRows}
          />
        </div>
        <div className="sum">
          <span className="sum-title" style={{ fontSize: "1.5rem" }}>RUB </span>
          <span className="sum-number" style={{ fontSize: "1.5rem" }}>
            {selectedRows.reduce((total, item) => total + item.amount, 0).toLocaleString("en-US")}
          </span>
        </div>
        <div>
          {currentUser.role !== "user" && <LoadingButton
            loading={isLoading}
            size="large"
            variant="contained"
            onClick={handleBulkApprove}
            className="confirm-button"
            startIcon={<AssignmentTurnedInIcon />}
          >Confirm</LoadingButton>}
          {currentUser.role === "user" &&
              <LoadingButton
                loading={isLoading}
                size="large"
                variant="contained"
                color="error"
                className="confirm-button"
                onClick={handleBulkCancel}
                startIcon={<CancelIcon />}
              >Cancel</LoadingButton>
          }
        </div>
      </>}
    </div>
  );
};

SelectedBar.propTypes = {
  selectedRows: PropTypes.array,
  purchaseOrdersCcTitlesMemo: PropTypes.array,
  setSelectedRows: PropTypes.func,
  actionDisabled: PropTypes.bool
};

export default SelectedBar;
