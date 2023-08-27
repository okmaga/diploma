import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import Table from "../common/table/Table";
import { Checkbox, Chip } from "@mui/material";
import Pagination from "../common/pagination/Pagination";
import paginate from "../../utils/paginate";
import SelectedBar from "./SelectedBar/SelectedBar";
import _ from "lodash";
import { useSelector } from "react-redux";
import { getCurrentUser } from "../../store/authSlice";

const PurchaseOrdersTable = ({ purchaseOrders, costCenters }) => {
  const currentUser = useSelector(getCurrentUser());
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortBy, setSortBy] = useState({ path: "timestamp", order: "desc" });
  const [actionDisabled, setActionDisabled] = useState(false);
  const pageSize = 20;
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const isActionValid = selectedRows.every((po, i, arr) => {
      if (po.status === "Cancelled") return false;
      if (po.status === "Approved" && currentUser.role !== "admin") return false;
      return po.status === arr[0].status;
    });
    setActionDisabled(!isActionValid);
  }, [selectedRows]);

  const purchaseOrdersCcTitlesMemo = useMemo(() => {
    return purchaseOrders.map(po => {
      const { _id } = po;
      const { title } = costCenters && costCenters.find(cc => (cc._id === po.costCenter));
      return { _id, ccTitle: title };
    });
  }, [purchaseOrders, costCenters]);
  const handleSort = (item) => {
    setSortBy(item);
  };

  const sortedPurchaseOrders = _.orderBy(purchaseOrders, [sortBy.path], [sortBy.order]);

  const purchaseOrdersCrop = paginate(sortedPurchaseOrders, currentPage, pageSize);

  const handleRowSelect = (e, payload) => {
    const { checked } = e.target;
    const { entirePage } = payload;

    if (entirePage) {
      if (checked) {
        purchaseOrdersCrop.map(po => {
          if (selectedRows.find(selectedRow => selectedRow._id === po._id)) return null;
          return setSelectedRows(prev => [...prev, po]);
        });
      } else {
        setSelectedRows(prev => prev.filter(po => {
          return !purchaseOrdersCrop.find(purchaseOrder => purchaseOrder._id === po._id);
        }));
      }
    } else {
      if (checked) {
        setSelectedRows(prev => [...prev, payload]);
      } else {
        setSelectedRows(prev => [...prev].filter(po => po._id !== payload._id));
      };
    };
  };

  const count = purchaseOrders.length;

  const columns = {
    selector: {
      name: <Checkbox
        onClick={(e) => handleRowSelect(e, { entirePage: true })}
        checked={purchaseOrdersCrop.every(po => selectedRows.includes(po))}
      />,
      component: (purchaseOrder) =>
        <Checkbox
          onClick={(e) => handleRowSelect(e, purchaseOrder)}
          checked={selectedRows.some(po => po._id === purchaseOrder._id)}
        />
    },
    index: {
      name: "#",
      component: (purchaseOrder, i) => i + 1 + (pageSize * (currentPage - 1))
    },
    timestamp: {
      name: "Date",
      path: "timestamp",
      component: (purchaseOrder) => {
        const date = new Date(purchaseOrder.timestamp);
        const dayMonth = date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
        return dayMonth;
      }
    },
    title: { name: "Title", path: "title" },
    costCenter: {
      name: "Cost Center",
      path: "costCenter",
      component: ({ _id }) => {
        const matchingCostCenter = purchaseOrdersCcTitlesMemo.find(po => po._id === _id);
        return matchingCostCenter.ccTitle;
      }
    },
    requestor: { name: "Requester", path: "requestor", component: (purchaseOrder) => purchaseOrder.requestor.email },
    amount: {
      name: "Amount",
      path: "amount",
      component: (purchaseOrder) => purchaseOrder.amount.toLocaleString("en-US")
    },
    status: {
      name: "Status",
      path: "status",
      component: (purchaseOrder) => {
        const { status } = purchaseOrder;
        let color;

        switch (status) {
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
          label={purchaseOrder.status}
          style={{ opacity: 0.85 }}
          size="small"
          variant="contained"
          color={color}
        />;
      }
    }
  };

  return (
    <>
      <Table
        data={purchaseOrdersCrop}
        columns={columns}
        itemsCount={count}
        selectedRows={selectedRows}
        selectedSort={sortBy}
        onSort={handleSort}
      />
      <Pagination
        pageSize={20}
        onPageChange={handlePageChange}
        currentPage={currentPage}
        itemsCount={count}
      />
      {selectedRows.length > 0 && <SelectedBar
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        actionDisabled={actionDisabled}
      /> }
    </>
  );
};

PurchaseOrdersTable.propTypes = {
  purchaseOrders: PropTypes.array,
  costCenters: PropTypes.array
};

export default PurchaseOrdersTable;
