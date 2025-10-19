// //  import React from "react";
// // import "./Table.scss";

// // export default function Table({ title,columns, data }) {
// //   if (!data || data.length === 0) {
// //     return <p className="table-no-data">No Data Available</p>;
// //   }

// //   const headers = columns && columns.length > 0
// //     ?columns
// //     :Object.keys(data[0]).map(key =>({key,label:key}));
  
// //   // Object.keys(data[0]);

// //   return (
// //     <div className="table-container">
// //       {title && <h3 className="table-title">{title}</h3>}
// //       <div className="table-wrapper">
// //         <table className="custom-table">
// //           <thead>
// //             <tr>
// //               {headers.map((column, index) => (
// //                 <th key={index}>{column.label}</th>
// //               ))}
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {data.map((row, i) => (
// //               <tr key={i}>
// //                 {headers.map((column,j)=> (
// //                   <td key={j}>
// //                   {column.render
// //             ? column.render(row[column.key], row, i) // Pass value, row, and index for custom rendering
// //             : (row[column.key] || "null")
// //                   }</td>

// //                 ))}
                
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>
// //   );
// // }
import React, { useState } from "react";
import "./Table.scss";

export default function Table({ title, columns = [], data = [], rowsPerPage = 10 }) {
  const [currentPage, setCurrentPage] = useState(1);

  if (!Array.isArray(data) || data.length === 0) {
    return <p className="table-no-data">No Data Available</p>;
  }

  const headers = columns.length > 0
    ? columns
    : (data[0] ? Object.keys(data[0]).map(key => ({ key, label: key })) : []);

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const pagedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

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
                      ? column.render(row[column.key], row, i + (currentPage - 1) * rowsPerPage)
                      : (row[column.key] || "null")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ margin: "16px 0", display: "flex", justifyContent: "center", gap: 8 }}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx + 1}
              onClick={() => setCurrentPage(idx + 1)}
              style={{
                fontWeight: currentPage === idx + 1 ? 700 : 400,
                border: currentPage === idx + 1 ? "1px solid #d4af37" : "1px solid #ccc",
              }}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
