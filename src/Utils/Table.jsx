 import React, { useState } from "react";
import "./Table.scss";

export default function Table({ title, columns = [], data = [], rowsPerPage = 10 }) {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const pagedData = data.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage);
  const headers = columns.length > 0
    ? columns
    : (data[0] ? Object.keys(data[0]).map(key => ({ key, label: key })) : []);

  const navButtonStyle = {
    padding: "5px 10px",
    margin: "0 5px",
    borderRadius: 6,
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    color: "#725fe9",
    fontWeight: "bold",
    cursor: "pointer",
  };

  const pageButtonStyle = {
    padding: "6px 12px",
    margin: "0 4px",
    borderRadius: 6,
    outline: "none",
    cursor: "pointer",
  };

  function renderPagination() {
    // Pagination buttons with ellipses logic like ActiveListings
    const buttons = [];
    buttons.push(0);
    let left = Math.max(1, currentPage - 2);
    let right = Math.min(totalPages - 2, currentPage + 2);

    if (left > 1) buttons.push("left-ellipsis");
    for (let i = left; i <= right; i++) buttons.push(i);
    if (right < totalPages - 2) buttons.push("right-ellipsis");
    if (totalPages > 1) buttons.push(totalPages - 1);

    return (
      <div style={{ margin: "16px 0", display: "flex", justifyContent: "center", gap: 8 }}>
        <button onClick={() => setCurrentPage(0)} disabled={currentPage === 0} style={navButtonStyle}>
          ««
        </button>
        <button onClick={() => setCurrentPage(Math.max(currentPage - 1, 0))} disabled={currentPage === 0} style={navButtonStyle}>
          ‹
        </button>

        {buttons.map((btn, idx) => {
          if (typeof btn === "string") {
            return (
              <span key={btn + idx} style={{ padding: "0 6px", fontWeight: "bold" }}>...</span>
            );
          }
          return (
            <button
              key={btn}
              onClick={() => setCurrentPage(btn)}
              style={{
                ...pageButtonStyle,
                backgroundColor: btn === currentPage ? "#725fe9" : "#fff",
                color: btn === currentPage ? "#fff" : "#222",
                border: btn === currentPage ? "2px solid #725fe9" : "1px solid #ccc",
                fontWeight: btn === currentPage ? 700 : 400,
              }}
            >
              {btn + 1}
            </button>
          );
        })}

        <button onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages - 1))} disabled={currentPage === totalPages - 1} style={navButtonStyle}>
          ›
        </button>
        <button onClick={() => setCurrentPage(totalPages - 1)} disabled={currentPage === totalPages - 1} style={navButtonStyle}>
          »»
        </button>
      </div>
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    return <p className="table-no-data">No Data Available</p>;
  }

  return (
    <div className="table-container">
      {title && <h3 className="table-title">{title}</h3>}
      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              {headers.map((column, index) => (
                <th key={index}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pagedData.map((row, i) => (
              <tr key={i}>
                {headers.map((column, j) => (
                  <td key={j}>
                    {typeof column.render === "function"
                      ? column.render(row[column.key], row, i + currentPage * rowsPerPage)
                      : (row[column.key] ?? "null")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && renderPagination()}
    </div>
  );
}
