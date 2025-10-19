
// import React, { useState } from "react";

// export default function Table({ columns, data, rowsPerPage = 15 }) {
//   const [currentPage, setCurrentPage] = useState(1);

//   const indexOfLastRow = currentPage * rowsPerPage;
//   const indexOfFirstRow = indexOfLastRow - rowsPerPage;
//   const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

//   return (
//     <>
//       <table style={{ width: "100%", borderCollapse: "separate",borderSpacing:0 }}>
//         <thead>
//           <tr>
//             {columns.map((col) => (
//               <th key={col.label}
//                style={{
//                 textAlign:"left",
//                 fontWeight:"500",
//                 frontsize:"18px",
//                  padding: "5px 8px",
//                  background:"#f0f8ff", 
//                  borderBottom: "1px solid  #ddd" }}>
//                 {col.label}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {currentRows.length === 0 ? (
//             <tr>
//               <td colSpan={columns.length} style={{ textAlign: "center", padding: 20 }}>
//                 No data found.
//               </td>
//             </tr>
//           ) : (
//             currentRows.map((row, idx) => (
//               <tr key={row.id || idx} style={{ borderBottom: "1px solid #eee" }}>
//                 {columns.map((col) => (
//                   <td key={col.key} style={{ padding: "5px 8px",fontSize:"13px", verticalAlign: "middle",borderBottom:"1px solid #eee" }}>
//                     {col.render ? col.render(row[col.key], row, idx, indexOfFirstRow + idx) : row[col.key]}
//                   </td>
//                 ))}
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>

//       <div style={{ marginTop: 16, textAlign: "center" }}>
//         {Array.from({ length: Math.ceil(data.length / rowsPerPage) }, (_, i) => i + 1).map((page) => (
//           <button
//             key={page}
//             onClick={() => setCurrentPage(page)}
//             style={{
//               margin: "0 5px",
//               padding: "6px 12px",
//               backgroundColor: page === currentPage ? "#121212" : "#fff",
//               color: page === currentPage ? "#fff" : "#121212",
//               border: "1px solid #121212",
//               borderRadius: "4px",
//               cursor: "pointer",
//               userSelect: "none",
//             }}
//           >
//             {page}
//           </button>
//         ))}
//       </div>
//     </>
//   );
// }
