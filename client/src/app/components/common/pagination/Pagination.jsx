import React from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import "./pagination.scss";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ArrowForward } from "@mui/icons-material";

const Pagination = ({ itemsCount, pageSize, onPageChange, currentPage }) => {
  const pageCount = Math.ceil(itemsCount / pageSize);

  if (pageCount === 1) return null;

  const pages = _.range(1, pageCount + 1);

  return (
    <nav className="pagination">
      <ul>
        <li><ArrowBackIcon onClick={() => onPageChange(Math.max(currentPage - 1, 1))} /></li>
        {pages.map((page) => (
          <li
            key={"page_" + page}
            className={(page === currentPage ? "current" : "")}
            onClick={() => onPageChange(page)}
          >
            {page}
          </li>
        ))}
        <li><ArrowForward onClick={() => onPageChange(Math.min(currentPage + 1, pageCount))}/></li>
      </ul>
    </nav>
  );
};

Pagination.propTypes = {
  itemsCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired
};

export default Pagination;
