import React from "react";
import PropTypes from "prop-types";
import "./table.scss";
import _ from "lodash";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
const Table = ({ data, columns, onRowClick, itemsCount, selectedSort, onSort }) => {
  const renderContent = (item, i, column) => {
    if (columns[column].component) {
      const component = columns[column].component;
      if (typeof component === "function") {
        return component(item, i);
      }
      return component;
    } else {
      return _.get(item, columns[column].path);
    }
  };

  const renderSortArrow = (selectedSort, currentPath) => {
    if (selectedSort.path === currentPath) {
      if (selectedSort.order === "asc") {
        return <ArrowUpwardIcon />;
      } else {
        return <ArrowDownwardIcon />;
      }
    };
    return null;
  };
  const handleRowClick = (item) => {
    if (onRowClick) {
      onRowClick(item);
    };
  };

  const handleSort = (item) => {
    if (selectedSort.path === item) {
      onSort({ ...selectedSort, order: selectedSort.order === "asc" ? "desc" : "asc" }
      );
    } else {
      onSort({ path: item, order: "asc" });
    };
  };

  return (
    <table className="table">
      <thead className="thead">
        <tr className="thead-row">
          {Object.keys(columns).map(column => (
            <th
              className={"thead-item" +
                (columns[column].path && selectedSort ? " sortable" : "") +
                (column === "requestor" || column === "costCenter" ? " md-hide" : "")
              }
              key={column}
              onClick={columns[column].path && selectedSort ? () => handleSort(columns[column].path) : undefined }
            >
              <p>
                {columns[column].name}
              </p>
              <span>
                {selectedSort && renderSortArrow(selectedSort, columns[column].path)}
              </span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="tbody">
        {data.map((item, i) => (<tr
          onClick={() => handleRowClick(item)}
          style={{ cursor: (onRowClick ? "pointer" : "") }}
          className="tbody-row"
          key={item._id}
        >
          {Object.keys(columns).map(column => (<td
            className={"tbody-item" + (column === "requestor" || column === "costCenter" ? " md-hide" : "")}
            key={column}>
            {renderContent(item, i, column)}
          </td>))}
        </tr>))}
      </tbody>
    </table>
  );
};

Table.propTypes = {
  columns: PropTypes.object,
  data: PropTypes.array,
  onRowClick: PropTypes.func,
  itemsCount: PropTypes.number,
  onSort: PropTypes.func,
  selectedSort: PropTypes.object
};
export default Table;
