import React from "react";
import "./Pagination.scss";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 3; // numbers to show around current page

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage > 2) pages.push(1); // always show first
      if (currentPage > 3) pages.push("..."); // ellipsis before

      let start = Math.max(2, currentPage - maxVisible);
      let end = Math.min(totalPages - 1, currentPage + maxVisible);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("...");
      if (currentPage < totalPages - 1) pages.push(totalPages); // always last
    }

    return pages;
  };

  return (
    <div className="pagination-container">
      {/* Previous (always active) */}
      <button
        className="pagination-prev"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
      >
        Previous
      </button>

      {/* Page Numbers */}
      <div className="pagination">
        {getPageNumbers().map((num, idx) =>
          num === "..." ? (
            <span key={idx} className="ellipsis">
              ...
            </span>
          ) : (
            <button
              key={idx}
              className={`page-btn ${currentPage === num ? "active" : ""}`}
              onClick={() => onPageChange(num)}
            >
              {num}
            </button>
          )
        )}
      </div>

      {/* Next (always active) */}
      <button
        className="pagination-next"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
