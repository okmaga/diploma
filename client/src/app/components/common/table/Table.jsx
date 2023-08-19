import React from "react";
import PropTypes from "prop-types";
import "./table.scss";
import _ from "lodash";

const Table = ({ data, columns, onRowClick }) => {
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
  const handleRowClick = (item) => {
    if (onRowClick) {
      onRowClick(item);
    };
  };
  return (
    <table className="table">
      <thead className="thead">
        <tr className="thead-row">
          {Object.keys(columns).map(column => (
            <th
              className="thead-item"
              key={column}>
              {columns[column].name}
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
            className="tbody-item"
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
  onRowClick: PropTypes.func
};
export default Table;
