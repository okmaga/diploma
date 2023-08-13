import React from "react";
import PropTypes from "prop-types";
import "./table.scss";
import _ from "lodash";

const Table = ({ data, columns }) => {
  const renderContent = (item, column) => {
    if (columns[column].component) {
      const component = columns[column].component;
      if (typeof component === "function") {
        return component(item);
      }
      return component;
    } else {
      return _.get(item, columns[column].path);
    }
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
        {data.map(item => (<tr className="tbody-row" key={item._id}>
          {Object.keys(columns).map(column => (<td
            className="tbody-item"
            key={column}>
            {renderContent(item, column)}
          </td>))}
        </tr>))}
      </tbody>
    </table>
  );
};

Table.propTypes = {
  columns: PropTypes.object,
  data: PropTypes.array
};
export default Table;
