// // // // //  import React from "react";
// // // // // import { Funnel } from "lucide-react";

// // // // // // ✅ Pagination (with numbered buttons, ellipsis & gold highlight)
// // // // // export function Pagination({ page, setPage, totalPages }) {
// // // // //   const maxVisiblePages = 3;

// // // // //   const generatePages = () => {
// // // // //     let pages = [];
// // // // //     if (totalPages <= 5) {
// // // // //       for (let i = 1; i <= totalPages; i++) pages.push(i);
// // // // //     } else {
// // // // //       if (page <= maxVisiblePages) {
// // // // //         pages = [1, 2, 3, "...", totalPages];
// // // // //       } else if (page >= totalPages - 2) {
// // // // //         pages = [1, "...", totalPages - 2, totalPages - 1, totalPages];
// // // // //       } else {
// // // // //         pages = [1, "...", page, "...", totalPages];
// // // // //       }
// // // // //     }
// // // // //     return pages;
// // // // //   };

// // // // //   const pages = generatePages();

// // // // //   const handleClick = (p) => {
// // // // //     if (p === "..." || p === page) return;
// // // // //     setPage(p);
// // // // //   };

// // // // //   return (
// // // // //     <div
// // // // //       style={{
// // // // //         display: "flex",
// // // // //         justifyContent: "center",
// // // // //         alignItems: "center",
// // // // //         gap: "6px",
// // // // //         padding: "18px 0",
// // // // //         fontFamily: "Inter, sans-serif",
// // // // //       }}
// // // // //     >
// // // // //       {/* Prev Button */}
// // // // //       <button
// // // // //         onClick={() => setPage(page - 1)}
// // // // //         disabled={page === 1}
// // // // //         style={{
// // // // //           border: "1px solid #d1d5db",
// // // // //           background: page === 1 ? "#f3f4f6" : "#fff",
// // // // //           color: "#374151",
// // // // //           borderRadius: "6px",
// // // // //           padding: "5px 9px",
// // // // //           cursor: page === 1 ? "not-allowed" : "pointer",
// // // // //           fontWeight: 500,
// // // // //         }}
// // // // //       >
// // // // //         &lt;
// // // // //       </button>

// // // // //       {/* Number Buttons */}
// // // // //       {pages.map((p, idx) => (
// // // // //         <button
// // // // //           key={idx}
// // // // //           onClick={() => handleClick(p)}
// // // // //           disabled={p === "..."}
// // // // //           style={{
// // // // //             border: p === page ? "1px solid gold" : "1px solid #d1d5db",
// // // // //             background: "#fff",
// // // // //             color: p === page ? "#000" : "#374151",
// // // // //             borderRadius: "6px",
// // // // //             padding: "5px 10px",
// // // // //             minWidth: "32px",
// // // // //             cursor: p === "..." ? "default" : "pointer",
// // // // //             fontWeight: p === page ? 600 : 400,
// // // // //           }}
// // // // //         >
// // // // //           {p}
// // // // //         </button>
// // // // //       ))}

// // // // //       {/* Next Button */}
// // // // //       <button
// // // // //         onClick={() => setPage(page + 1)}
// // // // //         disabled={page === totalPages}
// // // // //         style={{
// // // // //           border: "1px solid #d1d5db",
// // // // //           background: page === totalPages ? "#f3f4f6" : "#fff",
// // // // //           color: "#374151",
// // // // //           borderRadius: "6px",
// // // // //           padding: "5px 9px",
// // // // //           cursor: page === totalPages ? "not-allowed" : "pointer",
// // // // //           fontWeight: 500,
// // // // //         }}
// // // // //       >
// // // // //         &gt;
// // // // //       </button>

// // // // //       {/* Page Info */}
// // // // //       <span style={{ fontSize: "0.9rem", color: "#444", marginLeft: 8 }}>
// // // // //         Page <strong>{page}</strong> of {totalPages}
// // // // //       </span>
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // // // ✅ Main Table
// // // // // export default function Table({
// // // // //   columns,
// // // // //   paginatedData = [],
// // // // //   openFilter,
// // // // //   toggleFilter,
// // // // //   filters,
// // // // //   handleCheckboxChange,
// // // // //   searchValue,
// // // // //   setSearchValue,
// // // // //   uniqueValues,
// // // // //   clearFilter,
// // // // //   applyFilter,
// // // // //   onRowClick,
// // // // // }) {
// // // // //   return (
// // // // //     <div
// // // // //       style={{
// // // // //         background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
// // // // //         borderRadius: 10,
// // // // //         padding: "12px",
// // // // //         boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
// // // // //       }}
// // // // //     >
// // // // //       <table
// // // // //         style={{
// // // // //           width: "100%",
// // // // //           borderCollapse: "collapse",
// // // // //           textAlign: "center",
// // // // //           fontFamily: "Inter, sans-serif,outfit",
// // // // //           fontSize: "0.85rem",
// // // // //         }}
// // // // //       >
// // // // //         <thead>
// // // // //           <tr style={{ background: "#f3f4f6", height: 36 }}>
// // // // //             {columns.map((col) => (
// // // // //               <th
// // // // //                 key={col.key}
// // // // //                 style={{
// // // // //                   padding: "6px 8px",
// // // // //                   fontWeight: 600,
// // // // //                   fontSize: "0.85rem",
// // // // //                   borderBottom: "1px solid #e5e7eb",
// // // // //                   position: "relative",
// // // // //                   color: "#1e293b",
// // // // //                   textAlign: "center",
// // // // //                   background: "#f8fafc",
// // // // //                 }}
// // // // //               >
// // // // //                 {col.label}
// // // // //                 {col.key !== "serialNo" && col.key !== "more" && (
// // // // //                   <Funnel
// // // // //                     size={4}
// // // // //                     style={{
// // // // //                       marginLeft: 6,
// // // // //                       cursor: "pointer",
// // // // //                       verticalAlign: "middle",
// // // // //                       opacity: 0.3,
// // // // //                     }}
// // // // //                     onClick={() => toggleFilter(col.key)}
// // // // //                   />
// // // // //                 )}
// // // // //                 {openFilter === col.key && (
// // // // //                   <div
// // // // //                     style={{
// // // // //                       position: "absolute",
// // // // //                       top: "110%",
// // // // //                       right: 0,
// // // // //                       background: "#fff",
// // // // //                       border: "1px solid #ddd",
// // // // //                       borderRadius: 6,
// // // // //                       boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
// // // // //                       width: 180,
// // // // //                       zIndex: 2500,
// // // // //                       padding: 8,
// // // // //                       textAlign: "left",
// // // // //                     }}
// // // // //                   >
// // // // //                     <input
// // // // //                       type="text"
// // // // //                       placeholder="Search..."
// // // // //                       value={searchValue}
// // // // //                       onChange={(e) => setSearchValue(e.target.value)}
// // // // //                       style={{
// // // // //                         width: "100%",
// // // // //                         padding: "4px 6px",
// // // // //                         marginBottom: 6,
// // // // //                         fontSize: "0.8rem",
// // // // //                         border: "1px solid #ccc",
// // // // //                         borderRadius: 4,
// // // // //                       }}
// // // // //                     />
// // // // //                     <div
// // // // //                       style={{
// // // // //                         maxHeight: 150,
// // // // //                         overflowY: "auto",
// // // // //                         fontSize: "0.8rem",
// // // // //                       }}
// // // // //                     >
// // // // //                       {uniqueValues(col.key)
// // // // //                         .filter((v) =>
// // // // //                           v
// // // // //                             ?.toString()
// // // // //                             .toLowerCase()
// // // // //                             .includes(searchValue.toLowerCase())
// // // // //                         )
// // // // //                         .map((val) => (
// // // // //                           <label key={val} style={{ display: "block" }}>
// // // // //                             <input
// // // // //                               type="checkbox"
// // // // //                               checked={(filters[col.key] || []).includes(val)}
// // // // //                               onChange={() =>
// // // // //                                 handleCheckboxChange(col.key, val)
// // // // //                               }
// // // // //                             />{" "}
// // // // //                             {val}
// // // // //                           </label>
// // // // //                         ))}
// // // // //                     </div>
// // // // //                     <div
// // // // //                       style={{
// // // // //                         display: "flex",
// // // // //                         justifyContent: "space-between",
// // // // //                         marginTop: 6,
// // // // //                       }}
// // // // //                     >
// // // // //                       <button
// // // // //                         onClick={() => clearFilter(col.key)}
// // // // //                         style={{
// // // // //                           background: "#f3f4f6",
// // // // //                           border: "none",
// // // // //                           borderRadius: 4,
// // // // //                           padding: "4px 8px",
// // // // //                           fontSize: "0.75rem",
// // // // //                           cursor: "pointer",
// // // // //                         }}
// // // // //                       >
// // // // //                         Clear
// // // // //                       </button>
// // // // //                       <button
// // // // //                         onClick={applyFilter}
// // // // //                         style={{
// // // // //                           background: "#007bff",
// // // // //                           color: "#fff",
// // // // //                           border: "none",
// // // // //                           borderRadius: 4,
// // // // //                           padding: "4px 8px",
// // // // //                           fontSize: "0.75rem",
// // // // //                           cursor: "pointer",
// // // // //                         }}
// // // // //                       >
// // // // //                         Apply
// // // // //                       </button>
// // // // //                     </div>
// // // // //                   </div>
// // // // //                 )}
// // // // //               </th>
// // // // //             ))}
// // // // //           </tr>
// // // // //         </thead>

// // // // //         <tbody>
// // // // //           {(Array.isArray(paginatedData) ? paginatedData : []).map((row, idx) => (
// // // // //             <tr
// // // // //               key={idx}
// // // // //               style={{
// // // // //                 height: 32,
// // // // //                 borderBottom: "1px solid #e5e7eb",
// // // // //                 fontSize: "0.83rem",
// // // // //                 cursor: onRowClick ? "pointer" : "default",
// // // // //                 background: idx % 2 === 0 ? "#ffffff" : "#f9fafb",
// // // // //                 transition: "background 0.2s ease",
// // // // //               }}
// // // // //               onClick={onRowClick ? () => onRowClick(row) : undefined}
// // // // //               onMouseEnter={(e) =>
// // // // //                 (e.currentTarget.style.background = "#e0f2fe")
// // // // //               }
// // // // //               onMouseLeave={(e) =>
// // // // //                 (e.currentTarget.style.background =
// // // // //                   idx % 2 === 0 ? "#ffffff" : "#f9fafb")
// // // // //               }
// // // // //             >
// // // // //               {columns.map((col) => (
// // // // //                 <td
// // // // //                   key={col.key}
// // // // //                   style={{
// // // // //                     padding: "4px 6px",
// // // // //                     color: "#1f2937",
// // // // //                     verticalAlign: "middle",
// // // // //                   }}
// // // // //                 >
// // // // //                   {col.render ? col.render(row[col.key], row, idx) : row[col.key] || "-"}
// // // // //                 </td>
// // // // //               ))}
// // // // //             </tr>
// // // // //           ))}
// // // // //         </tbody>
// // // // //       </table>
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // import React from "react";
// // // // import { Funnel } from "lucide-react";

// // // // // ✅ Pagination (without "Page 1 of 553" text)
// // // // export function Pagination({ page, setPage, totalPages }) {
// // // //   const maxVisiblePages = 3;

// // // //   const generatePages = () => {
// // // //     let pages = [];
// // // //     if (totalPages <= 5) {
// // // //       for (let i = 1; i <= totalPages; i++) pages.push(i);
// // // //     } else {
// // // //       if (page <= maxVisiblePages) {
// // // //         pages = [1, 2, 3, "...", totalPages];
// // // //       } else if (page >= totalPages - 2) {
// // // //         pages = [1, "...", totalPages - 2, totalPages - 1, totalPages];
// // // //       } else {
// // // //         pages = [1, "...", page, "...", totalPages];
// // // //       }
// // // //     }
// // // //     return pages;
// // // //   };

// // // //   const pages = generatePages();

// // // //   const handleClick = (p) => {
// // // //     if (p === "..." || p === page) return;
// // // //     setPage(p);
// // // //   };

// // // //   return (
// // // //     <div
// // // //       style={{
// // // //         display: "flex",
// // // //         justifyContent: "center",
// // // //         alignItems: "center",
// // // //         gap: "6px",
// // // //         padding: "18px 0",
// // // //         fontFamily: "Inter, sans-serif",
// // // //       }}
// // // //     >
// // // //       {/* Prev Button */}
// // // //       <button
// // // //         onClick={() => setPage(page - 1)}
// // // //         disabled={page === 1}
// // // //         style={{
// // // //           border: "1px solid #d1d5db",
// // // //           background: page === 1 ? "#f3f4f6" : "#fff",
// // // //           color: "#374151",
// // // //           borderRadius: "6px",
// // // //           padding: "5px 9px",
// // // //           cursor: page === 1 ? "not-allowed" : "pointer",
// // // //           fontWeight: 500,
// // // //         }}
// // // //       >
// // // //         &lt;
// // // //       </button>

// // // //       {/* Number Buttons */}
// // // //       {pages.map((p, idx) => (
// // // //         <button
// // // //           key={idx}
// // // //           onClick={() => handleClick(p)}
// // // //           disabled={p === "..."}
// // // //           style={{
// // // //             border: p === page ? "1px solid gold" : "1px solid #d1d5db",
// // // //             background: "#fff",
// // // //             color: p === page ? "#000" : "#374151",
// // // //             borderRadius: "6px",
// // // //             padding: "5px 10px",
// // // //             minWidth: "32px",
// // // //             cursor: p === "..." ? "default" : "pointer",
// // // //             fontWeight: p === page ? 600 : 400,
// // // //           }}
// // // //         >
// // // //           {p}
// // // //         </button>
// // // //       ))}

// // // //       {/* Next Button */}
// // // //       <button
// // // //         onClick={() => setPage(page + 1)}
// // // //         disabled={page === totalPages}
// // // //         style={{
// // // //           border: "1px solid #d1d5db",
// // // //           background: page === totalPages ? "#f3f4f6" : "#fff",
// // // //           color: "#374151",
// // // //           borderRadius: "6px",
// // // //           padding: "5px 9px",
// // // //           cursor: page === totalPages ? "not-allowed" : "pointer",
// // // //           fontWeight: 500,
// // // //         }}
// // // //       >
// // // //         &gt;
// // // //       </button>
// // // //     </div>
// // // //   );
// // // // }

// // // // // ✅ Main Table
// // // // export default function Table({
// // // //   columns,
// // // //   paginatedData = [],
// // // //   openFilter,
// // // //   toggleFilter,
// // // //   filters,
// // // //   handleCheckboxChange,
// // // //   searchValue,
// // // //   setSearchValue,
// // // //   uniqueValues,
// // // //   clearFilter,
// // // //   applyFilter,
// // // //   onRowClick,
// // // // }) {
// // // //   return (
// // // //     <div
// // // //       style={{
// // // //         background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
// // // //         borderRadius: 10,
// // // //         padding: "12px",
// // // //         boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
// // // //       }}
// // // //     >
// // // //       <table
// // // //         style={{
// // // //           width: "100%",
// // // //           borderCollapse: "collapse",
// // // //           textAlign: "center",
// // // //           fontFamily: "Inter, sans-serif,outfit",
// // // //           fontSize: "0.85rem",
// // // //         }}
// // // //       >
// // // //         <thead>
// // // //           <tr style={{ background: "#f3f4f6", height: 36 }}>
// // // //             {columns.map((col) => (
// // // //               <th
// // // //                 key={col.key}
// // // //                 style={{
// // // //                   padding: "6px 8px",
// // // //                   fontWeight: 600,
// // // //                   fontSize: "0.85rem",
// // // //                   borderBottom: "1px solid #e5e7eb",
// // // //                   position: "relative",
// // // //                   color: "#1e293b",
// // // //                   textAlign: "center",
// // // //                   background: "#f8fafc",
// // // //                 }}
// // // //               >
// // // //                 {col.label}
// // // //                 {col.key !== "serialNo" && col.key !== "more" && (
// // // //                   <Funnel
// // // //                     size={4}
// // // //                     style={{
// // // //                       marginLeft: 6,
// // // //                       cursor: "pointer",
// // // //                       verticalAlign: "middle",
// // // //                       opacity: 0.3,
// // // //                     }}
// // // //                     onClick={() => toggleFilter(col.key)}
// // // //                   />
// // // //                 )}
// // // //                 {openFilter === col.key && (
// // // //                   <div
// // // //                     style={{
// // // //                       position: "absolute",
// // // //                       top: "110%",
// // // //                       right: 0,
// // // //                       background: "#fff",
// // // //                       border: "1px solid #ddd",
// // // //                       borderRadius: 6,
// // // //                       boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
// // // //                       width: 180,
// // // //                       zIndex: 2500,
// // // //                       padding: 8,
// // // //                       textAlign: "left",
// // // //                     }}
// // // //                   >
// // // //                     <input
// // // //                       type="text"
// // // //                       placeholder="Search..."
// // // //                       value={searchValue}
// // // //                       onChange={(e) => setSearchValue(e.target.value)}
// // // //                       style={{
// // // //                         width: "100%",
// // // //                         padding: "4px 6px",
// // // //                         marginBottom: 6,
// // // //                         fontSize: "0.8rem",
// // // //                         border: "1px solid #ccc",
// // // //                         borderRadius: 4,
// // // //                       }}
// // // //                     />
// // // //                     <div
// // // //                       style={{
// // // //                         maxHeight: 150,
// // // //                         overflowY: "auto",
// // // //                         fontSize: "0.8rem",
// // // //                       }}
// // // //                     >
// // // //                       {uniqueValues(col.key)
// // // //                         .filter((v) =>
// // // //                           v
// // // //                             ?.toString()
// // // //                             .toLowerCase()
// // // //                             .includes(searchValue.toLowerCase())
// // // //                         )
// // // //                         .map((val) => (
// // // //                           <label key={val} style={{ display: "block" }}>
// // // //                             <input
// // // //                               type="checkbox"
// // // //                               checked={(filters[col.key] || []).includes(val)}
// // // //                               onChange={() =>
// // // //                                 handleCheckboxChange(col.key, val)
// // // //                               }
// // // //                             />{" "}
// // // //                             {val}
// // // //                           </label>
// // // //                         ))}
// // // //                     </div>
// // // //                     <div
// // // //                       style={{
// // // //                         display: "flex",
// // // //                         justifyContent: "space-between",
// // // //                         marginTop: 6,
// // // //                       }}
// // // //                     >
// // // //                       <button
// // // //                         onClick={() => clearFilter(col.key)}
// // // //                         style={{
// // // //                           background: "#f3f4f6",
// // // //                           border: "none",
// // // //                           borderRadius: 4,
// // // //                           padding: "4px 8px",
// // // //                           fontSize: "0.75rem",
// // // //                           cursor: "pointer",
// // // //                         }}
// // // //                       >
// // // //                         Clear
// // // //                       </button>
// // // //                       <button
// // // //                         onClick={applyFilter}
// // // //                         style={{
// // // //                           background: "#007bff",
// // // //                           color: "#fff",
// // // //                           border: "none",
// // // //                           borderRadius: 4,
// // // //                           padding: "4px 8px",
// // // //                           fontSize: "0.75rem",
// // // //                           cursor: "pointer",
// // // //                         }}
// // // //                       >
// // // //                         Apply
// // // //                       </button>
// // // //                     </div>
// // // //                   </div>
// // // //                 )}
// // // //               </th>
// // // //             ))}
// // // //           </tr>
// // // //         </thead>

// // // //         <tbody>
// // // //           {(Array.isArray(paginatedData) ? paginatedData : []).map((row, idx) => (
// // // //             <tr
// // // //               key={idx}
// // // //               style={{
// // // //                 height: 32,
// // // //                 borderBottom: "1px solid #e5e7eb",
// // // //                 fontSize: "0.83rem",
// // // //                 cursor: onRowClick ? "pointer" : "default",
// // // //                 background: idx % 2 === 0 ? "#ffffff" : "#f9fafb",
// // // //                 transition: "background 0.2s ease",
// // // //               }}
// // // //               onClick={onRowClick ? () => onRowClick(row) : undefined}
// // // //               onMouseEnter={(e) =>
// // // //                 (e.currentTarget.style.background = "#e0f2fe")
// // // //               }
// // // //               onMouseLeave={(e) =>
// // // //                 (e.currentTarget.style.background =
// // // //                   idx % 2 === 0 ? "#ffffff" : "#f9fafb")
// // // //               }
// // // //             >
// // // //               {columns.map((col) => (
// // // //                 <td
// // // //                   key={col.key}
// // // //                   style={{
// // // //                     padding: "4px 6px",
// // // //                     color: "#1f2937",
// // // //                     verticalAlign: "middle",
// // // //                   }}
// // // //                 >
// // // //                   {col.render ? col.render(row[col.key], row, idx) : row[col.key] || "-"}
// // // //                 </td>
// // // //               ))}
// // // //             </tr>
// // // //           ))}
// // // //         </tbody>
// // // //       </table>
// // // //     </div>
// // // //   );
// // // // }
// // // import React from "react";
// // // import { Funnel } from "lucide-react";

// // // // ✅ Pagination (without "Page 1 of 553" text)
// // // export function Pagination({ page, setPage, totalPages }) {
// // //   const maxVisiblePages = 3;

// // //   const generatePages = () => {
// // //     let pages = [];
// // //     if (totalPages <= 5) {
// // //       for (let i = 1; i <= totalPages; i++) pages.push(i);
// // //     } else {
// // //       if (page <= maxVisiblePages) {
// // //         pages = [1, 2, 3, "...", totalPages];
// // //       } else if (page >= totalPages - 2) {
// // //         pages = [1, "...", totalPages - 2, totalPages - 1, totalPages];
// // //       } else {
// // //         pages = [1, "...", page, "...", totalPages];
// // //       }
// // //     }
// // //     return pages;
// // //   };

// // //   const pages = generatePages();

// // //   const handleClick = (p) => {
// // //     if (p === "..." || p === page) return;
// // //     setPage(p);
// // //   };

// // //   return (
// // //     <div
// // //       style={{
// // //         display: "flex",
// // //         justifyContent: "center",
// // //         alignItems: "center",
// // //         gap: "6px",
// // //         padding: "18px 0",
// // //         fontFamily: "Inter, sans-serif",
// // //       }}
// // //     >
// // //       {/* Prev Button */}
// // //       <button
// // //         onClick={() => setPage(page - 1)}
// // //         disabled={page === 1}
// // //         style={{
// // //           border: "1px solid #d1d5db",
// // //           background: page === 1 ? "#f3f4f6" : "#fff",
// // //           color: "#374151",
// // //           borderRadius: "6px",
// // //           padding: "5px 9px",
// // //           cursor: page === 1 ? "not-allowed" : "pointer",
// // //           fontWeight: 500,
// // //         }}
// // //       >
// // //         &lt;
// // //       </button>

// // //       {/* Number Buttons */}
// // //       {pages.map((p, idx) => (
// // //         <button
// // //           key={idx}
// // //           onClick={() => handleClick(p)}
// // //           disabled={p === "..."}
// // //           style={{
// // //             border: p === page ? "1px solid gold" : "1px solid #d1d5db",
// // //             background: "#fff",
// // //             color: p === page ? "#000" : "#374151",
// // //             borderRadius: "6px",
// // //             padding: "5px 10px",
// // //             minWidth: "32px",
// // //             cursor: p === "..." ? "default" : "pointer",
// // //             fontWeight: p === page ? 600 : 400,
// // //           }}
// // //         >
// // //           {p}
// // //         </button>
// // //       ))}

// // //       {/* Next Button */}
// // //       <button
// // //         onClick={() => setPage(page + 1)}
// // //         disabled={page === totalPages}
// // //         style={{
// // //           border: "1px solid #d1d5db",
// // //           background: page === totalPages ? "#f3f4f6" : "#fff",
// // //           color: "#374151",
// // //           borderRadius: "6px",
// // //           padding: "5px 9px",
// // //           cursor: page === totalPages ? "not-allowed" : "pointer",
// // //           fontWeight: 500,
// // //         }}
// // //       >
// // //         &gt;
// // //       </button>
// // //     </div>
// // //   );
// // // }

// // // // ✅ Main Table
// // // export default function Table({
// // //   columns,
// // //   paginatedData = [],
// // //   openFilter,
// // //   toggleFilter,
// // //   filters,
// // //   handleCheckboxChange,
// // //   searchValue,
// // //   setSearchValue,
// // //   uniqueValues,
// // //   clearFilter,
// // //   applyFilter,
// // //   onRowClick,
// // // }) {
// // //   return (
// // //     <div
// // //       style={{
// // //         background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
// // //         borderRadius: 10,
// // //         padding: "12px",
// // //         boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
// // //       }}
// // //     >
// // //       <table
// // //         style={{
// // //           width: "100%",
// // //           borderCollapse: "collapse",
// // //           textAlign: "center",
// // //           fontFamily: "Inter, sans-serif,outfit",
// // //           fontSize: "0.85rem",
// // //         }}
// // //       >
// // //         <thead>
// // //           <tr style={{ background: "#f3f4f6", height: 36 }}>
// // //             {columns.map((col) => (
// // //               <th
// // //                 key={col.key}
// // //                 style={{
// // //                   padding: "6px 8px",
// // //                   fontWeight: 600,
// // //                   fontSize: "0.85rem",
// // //                   borderBottom: "1px solid #e5e7eb",
// // //                   position: "relative",
// // //                   color: "#1e293b",
// // //                   textAlign: "center",
// // //                   background: "#f8fafc",
// // //                 }}
// // //               >
// // //                 {col.label}
// // //                 {/* {col.key !== "serialNo" && col.key !== "more" && ( 
// // //                   <Funnel
// // //                     size={4}
// // //                     style={{
// // //                       marginLeft: 6,
// // //                       cursor: "pointer",
// // //                       verticalAlign: "middle",
// // //                       opacity: 0.3,
// // //                     }}
// // //                     onClick={() => toggleFilter(col.key)}
// // //                   />
// // //                   )} */}
// // //                 {/* {openFilter === col.key && (
// // //                   <div
// // //                     // style={{
// // //                     //   position: "absolute",
// // //                     //   top: "110%",
// // //                     //   right: 0,
// // //                     //   background: "#fff",
// // //                     //   border: "1px solid #ddd",
// // //                     //   borderRadius: 6,
// // //                     //   boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
// // //                     //   width: 180,
// // //                     //   zIndex: 2500,
// // //                     //   padding: 8,
// // //                     //   textAlign: "left",
// // //                     // }}
// // //                   > */}
// // //                     <input
// // //                       type="text"
// // //                       placeholder="Search..."
// // //                       value={searchValue}
// // //                       onChange={(e) => setSearchValue(e.target.value)}
// // //                       style={{
// // //                         width: "100%",
// // //                         padding: "4px 6px",
// // //                         marginBottom: 6,
// // //                         fontSize: "0.8rem",
// // //                         border: "1px solid #ccc",
// // //                         borderRadius: 4,
// // //                       }}
// // //                     />
// // //                     <div
// // //                       style={{
// // //                         maxHeight: 150,
// // //                         overflowY: "auto",
// // //                         fontSize: "0.8rem",
// // //                       }}
// // //                     >
// // //                       {uniqueValues(col.key)
// // //                         .filter((v) =>
// // //                           v
// // //                             ?.toString()
// // //                             .toLowerCase()
// // //                             .includes(searchValue.toLowerCase())
// // //                         )
// // //                         .map((val) => (
// // //                           <label key={val} style={{ display: "block" }}>
// // //                             <input
// // //                               type="checkbox"
// // //                               checked={(filters[col.key] || []).includes(val)}
// // //                               onChange={() =>
// // //                                 handleCheckboxChange(col.key, val)
// // //                               }
// // //                             />{" "}
// // //                             {val}
// // //                           </label>
// // //                         ))}
// // //                     </div>
// // //                     <div
// // //                       style={{
// // //                         display: "flex",
// // //                         justifyContent: "space-between",
// // //                         marginTop: 6,
// // //                       }}
// // //                     >
// // //                       <button
// // //                         onClick={() => clearFilter(col.key)}
// // //                         style={{
// // //                           background: "#f3f4f6",
// // //                           border: "none",
// // //                           borderRadius: 4,
// // //                           padding: "4px 8px",
// // //                           fontSize: "0.75rem",
// // //                           cursor: "pointer",
// // //                         }}
// // //                       >
// // //                         Clear
// // //                       </button>
// // //                       <button
// // //                         onClick={applyFilter}
// // //                         style={{
// // //                           background: "#007bff",
// // //                           color: "#fff",
// // //                           border: "none",
// // //                           borderRadius: 4,
// // //                           padding: "4px 8px",
// // //                           fontSize: "0.75rem",
// // //                           cursor: "pointer",
// // //                         }}
// // //                       >
// // //                         Apply
// // //                       </button>
// // //                     </div>
// // //                   {/* </div> */}
// // //                 )
// // //               </th>
// // //             ))}
// // //           </tr>
// // //         </thead>

// // //         <tbody>
// // //           {(Array.isArray(paginatedData) ? paginatedData : []).map((row, idx) => (
// // //             <tr
// // //               key={idx}
// // //               style={{
// // //                 height: 32,
// // //                 borderBottom: "1px solid #e5e7eb",
// // //                 fontSize: "0.83rem",
// // //                 cursor: onRowClick ? "pointer" : "default",
// // //                 background: idx % 2 === 0 ? "#ffffff" : "#f9fafb",
// // //                 transition: "background 0.2s ease",
// // //               }}
// // //               onClick={onRowClick ? () => onRowClick(row) : undefined}
// // //               onMouseEnter={(e) =>
// // //                 (e.currentTarget.style.background = "#e0f2fe")
// // //               }
// // //               onMouseLeave={(e) =>
// // //                 (e.currentTarget.style.background =
// // //                   idx % 2 === 0 ? "#ffffff" : "#f9fafb")
// // //               }
// // //             >
// // //               {columns.map((col) => (
// // //                 <td
// // //                   key={col.key}
// // //                   style={{
// // //                     padding: "4px 6px",
// // //                     color: "#1f2937",
// // //                     verticalAlign: "middle",
// // //                   }}
// // //                 >
// // //                   {col.render ? col.render(row[col.key], row, idx) : row[col.key] || "-"}
// // //                 </td>
// // //               ))}
// // //             </tr>
// // //           ))}
// // //         </tbody>
// // //       </table>
// // //     </div>
// // //   );
// // // }
// import React from "react";

// // ✅ Pagination (use if this file also exports it)
// export function Pagination({ page, setPage, totalPages }) {
//   const maxVisiblePages = 3;

//   const generatePages = () => {
//     let pages = [];
//     if (totalPages <= 5) {
//       for (let i = 1; i <= totalPages; i++) pages.push(i);
//     } else {
//       if (page <= maxVisiblePages) {
//         pages = [1,2,3,4 ,"...", totalPages];
//       } else if (page >= totalPages - 2) {
//         pages = [1, "...", totalPages - 3,totalPages-2, totalPages - 1, totalPages];
//       } else {
//         pages = [1, "...",,page-1,page,page+1,"...", totalPages];
//       }
//     }
//     return pages;
//   };

//   const pages = generatePages();

//   const handleClick = (p) => {
//     if (p === "..." || p === page) return;
//     setPage(p);
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         gap: "6px",
//         padding: "18px 0",
//         fontFamily: "Inter, sans-serif",
//       }}
//     >
//       {/* Prev Button */}
//       <button
//         onClick={() => setPage(page - 1)}
//         disabled={page === 1}
//         style={{
//           border: "1px solid #d1d5db",
//           background: page === 1 ? "#f3f4f6" : "#fff",
//           color: "#374151",
//           borderRadius: "6px",
//           padding: "5px 9px",
//           cursor: page === 1 ? "not-allowed" : "pointer",
//           fontWeight: 500,
//         }}
//       >
//         &lt;
//       </button>

//       {/* Number Buttons */}
//       {pages.map((p, idx) => (
//         <button
//           key={idx}
//           onClick={() => handleClick(p)}
//           disabled={p === "..."}
//           style={{
//             border: p === page ? "1px solid gold" : "1px solid #d1d5db",
//             background: "#fff",
//             color: p === page ? "#000" : "#374151",
//             borderRadius: "6px",
//             padding: "5px 10px",
//             minWidth: "32px",
//             cursor: p === "..." ? "default" : "pointer",
//             fontWeight: p === page ? 600 : 400,
//           }}
//         >
//           {p}
//         </button>
//       ))}

//       {/* Next Button */}
//       <button
//         onClick={() => setPage(page + 1)}
//         disabled={page === totalPages}
//         style={{
//           border: "1px solid #d1d5db",
//           background: page === totalPages ? "#f3f4f6" : "#fff",
//           color: "#374151",
//           borderRadius: "6px",
//           padding: "5px 9px",
//           cursor: page === totalPages ? "not-allowed" : "pointer",
//           fontWeight: 500,
//         }}
//       >
//         &gt;
//       </button>
//     </div>
//   );
// }

// // ✅ Main Table
// export default function Table({
//   columns,
//   paginatedData = [],
//   rowsPerPage,
//   onRowClick,
// }) {
//   return (
//     // <div
//     //   style={{
//     //     background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
//     //     borderRadius: 10,
//     //     padding: "12px",
//     //     boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
//     //   }}
//     // >
//       <table
//         style={{
//           width: "100%",
//           borderCollapse: "collapse",
//           textAlign: "center",
//           fontFamily: "Inter, sans-serif, outfit",
//           fontSize: "0.85rem",
//         }}
//       >
//         <thead>
//           <tr style={{ background: "#f3f4f6", height: 36 }}>
//             {columns.map((col) => (
//               <th
//                 key={col.key}
//                 style={{
//                   padding: "6px 8px",
//                   fontWeight: 600,
//                   fontSize: "0.85rem",
//                   borderBottom: "1px solid #e5e7eb",
//                   position: "relative",
//                   color: "#1e293b",
//                   textAlign: "center",
//                   background: "#f8fafc",
//                 }}
//               >
//                 {col.label}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {(Array.isArray(paginatedData) ? paginatedData : []).map((row, idx) => (
//             <tr
//               key={idx}
//               style={{
//                 height: 32,
//                 borderBottom: "1px solid #e5e7eb",
//                 fontSize: "0.83rem",
//                 cursor: onRowClick ? "pointer" : "default",
//                 background: idx % 2 === 0 ? "#ffffff" : "#f9fafb",
//                 transition: "background 0.2s ease",
//               }}
//               onClick={onRowClick ? () => onRowClick(row) : undefined}
//               onMouseEnter={(e) =>
//                 (e.currentTarget.style.background = "#e0f2fe")
//               }
//               onMouseLeave={(e) =>
//                 (e.currentTarget.style.background =
//                   idx % 2 === 0 ? "#ffffff" : "#f9fafb")
//               }
//             >
//               {columns.map((col) => (
//                 <td
//                   key={col.key}
//                   style={{
//                     padding: "4px 6px",
//                     color: "#1f2937",
//                     verticalAlign: "middle",
//                   }}
//                 >
//                   {col.render
//                     ? col.render(row[col.key], row, idx)
//                     : row[col.key] || "-"}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     // </div>
//   );
// }
 import React, { useEffect, useRef, useState } from "react";
 
/* Inline funnel icon */
function FunnelIcon({ active = false, size = 14 }) {
  const stroke = active ? "#b8860b" : "#7a7a7a";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 5.2C3 4.6 3.5 4 4.1 4h15.8c.6 0 1.1.6 1.1 1.2 0 .4-.2.8-.5 1.1L13 12v6.3c0 .4-.3.7-.7.7h-1.6c-.4 0-.7-.3-.7-.7V12L3.4 6.3C3.2 6 3 5.6 3 5.2z"
        stroke={stroke}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {active && <circle cx="17.8" cy="6.4" r="2.0" fill="#b8860b" />}
    </svg>
  );
}
 
/* Pagination (hidden for <=1) */
export function Pagination({ page, setPage, totalPages = 0 }) {
  if (!totalPages || totalPages <= 1) return null;
  const maxVisiblePages = 3;
  const generatePages = () => {
    let pages = [];
    if (totalPages <= 5) for (let i = 1; i <= totalPages; i++) pages.push(i);
    else if (page <= maxVisiblePages) pages = [1, 2, 3, "...", totalPages];
    else if (page >= totalPages - 2) pages = [1, "...", totalPages - 2, totalPages - 1, totalPages];
    else pages = [1, "...", page, "...", totalPages];
    return pages;
  };
  const pages = generatePages();
 
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 6, padding: "18px 0", fontFamily: "Outfit, sans-serif" }}>
      <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} style={navBtnStyle(page === 1)}>&lt;</button>
      {pages.map((p, i) => (
        <button key={i} onClick={() => p !== "..." && setPage(p)} disabled={p === "..."} style={pageBtnStyle(p === page)}>{p}</button>
      ))}
      <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} style={navBtnStyle(page === totalPages)}>&gt;</button>
    </div>
  );
}
const navBtnStyle = (disabled) => ({ border: "1px solid #d1d5db", background: disabled ? "#f3f4f6" : "#fff", color: "#374151", borderRadius: 6, padding: "5px 9px", cursor: disabled ? "not-allowed" : "pointer" });
const pageBtnStyle = (active) => ({ border: active ? "1px solid #b8860b" : "1px solid #d1d5db", background: active ? "#fffbe6" : "#fff", color: active ? "#b8860b" : "#374151", borderRadius: 6, padding: "5px 10px", minWidth: 32 });
 
/* Inject small helpers once (checkbox/scrollbar fallback) */
const ensureStyles = () => {
  if (document.getElementById("table-filter-styles")) return;
  const css = `
    .tf-checkbox { width:16px; height:16px; margin:0; }
  `;
  const s = document.createElement("style");
  s.id = "table-filter-styles";
  s.appendChild(document.createTextNode(css));
  document.head.appendChild(s);
};
 
/* Main Table */
export default function Table({
  columns,
  paginatedData = [],
  openFilter,
  toggleFilter,
  filters = {},
  handleCheckboxChange,
  uniqueValues,
  clearFilter,
  applyFilter,
  onRowClick,
}) {
  const containerRef = useRef(null);
  const thRefs = useRef({});
  const [searchTerm, setSearchTerm] = useState("");
  const [tempFilters, setTempFilters] = useState({});
  const [dropdownPos, setDropdownPos] = useState(null); // { top,left,openUp, width }
 
  useEffect(() => ensureStyles(), []);
 
  // lock body scroll while dropdown open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = openFilter ? "hidden" : prev || "auto";
    return () => (document.body.style.overflow = prev || "auto");
  }, [openFilter]);
 
  useEffect(() => {
    const onDoc = (e) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target) && openFilter) {
        // discard temp for the open column
        setTempFilters((p) => {
          const copy = { ...p };
          delete copy[openFilter];
          return copy;
        });
        toggleFilter(null);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [openFilter, toggleFilter]);
 
  // helpers
  const shouldShowFilter = (label = "") => {
    const lower = (label || "").toLowerCase();
    if (lower.includes("serial") || lower.includes("s.no") || lower.includes("s no")) return false;
    if (lower.includes("click") || lower.includes("action")) return false;
    return true;
  };
 
  const resolveUnique = (colKey) => {
    try {
      if (typeof uniqueValues === "function") {
        const out = uniqueValues(colKey);
        if (Array.isArray(out) && out.length) return out;
      }
      const list = (paginatedData || []).map((r) => (r ? r[colKey] : undefined)).filter((v) => v !== undefined && v !== null && String(v).trim() !== "");
      const uniq = Array.from(new Set(list));
      const numerical = uniq.every((u) => !isNaN(Number(String(u).replace(/[,₹\sCrcr]/g, ""))));
      if (numerical) {
        return uniq.map((u) => ({ raw: u, n: Number(String(u).replace(/[,₹\sCrcr]/g, "")) })).sort((a, b) => a.n - b.n).map(x => x.raw);
      }
      return uniq.sort((a, b) => String(a).localeCompare(String(b)));
    } catch {
      return [];
    }
  };
 
  const tempFor = (colKey) => (tempFilters[colKey] !== undefined ? tempFilters[colKey] : (Array.isArray(filters[colKey]) ? [...filters[colKey]] : []));
 
  const initTempFromParent = (colKey) => setTempFilters((p) => ({ ...p, [colKey]: Array.isArray(filters[colKey]) ? [...filters[colKey]] : [] }));
 
  const toggleTempValue = (colKey, val) => {
    setTempFilters((prev) => {
      const cur = prev[colKey] !== undefined ? [...prev[colKey]] : (Array.isArray(filters[colKey]) ? [...filters[colKey]] : []);
      const next = cur.includes(val) ? cur.filter((x) => x !== val) : [...cur, val];
      return { ...prev, [colKey]: next };
    });
  };
 
  const selectAllVisibleTemp = (colKey, visibleList) => setTempFilters((prev) => ({ ...prev, [colKey]: [...visibleList] }));
  const clearTempAll = (colKey) => setTempFilters((prev) => ({ ...prev, [colKey]: [] }));
 
  const cancelFor = (colKey) => {
    setTempFilters((prev) => { const copy = { ...prev }; delete copy[colKey]; return copy; });
    toggleFilter(null);
    setSearchTerm("");
    setDropdownPos(null);
  };
 
  const applyFor = (colKey) => {
    const final = tempFilters[colKey] !== undefined ? tempFilters[colKey] : (Array.isArray(filters[colKey]) ? filters[colKey] : []);
    const existing = Array.isArray(filters[colKey]) ? filters[colKey] : [];
    final.forEach((v) => { if (!existing.includes(v)) handleCheckboxChange(colKey, v); });
    existing.forEach((v) => { if (!final.includes(v)) handleCheckboxChange(colKey, v); });
    if (typeof applyFilter === "function") applyFilter();
    setTempFilters((prev) => { const copy = { ...prev }; delete copy[colKey]; return copy; });
    toggleFilter(null);
    setSearchTerm("");
    setDropdownPos(null);
  };
 
  const clearAllParent = (colKey) => {
    if (typeof clearFilter === "function") clearFilter(colKey);
    else (filters[colKey] || []).slice().forEach((v) => handleCheckboxChange(colKey, v));
    setTempFilters((prev) => { const copy = { ...prev }; delete copy[colKey]; return copy; });
  };
 
  const isActive = (colKey) => Array.isArray(filters[colKey]) && filters[colKey].length > 0;
 
  // compute fixed position for dropdown (so it won't be clipped by parents)
  const computeFixedPos = (colKey, dropdownWidth = 260) => {
    const th = thRefs.current[colKey];
    const container = containerRef.current;
    if (!th || !container) {
      setDropdownPos(null);
      return;
    }
    const thRect = th.getBoundingClientRect();
    const contRect = container.getBoundingClientRect();
    // left relative to viewport: center the dropdown under th, but clamp to viewport
    let left = thRect.left + thRect.width / 2 - dropdownWidth / 2;
    const minLeft = 8;
    const maxLeft = window.innerWidth - dropdownWidth - 8;
    if (left < minLeft) left = minLeft;
    if (left > maxLeft) left = maxLeft;
    // decide top or bottom based on space
    const spaceBelow = window.innerHeight - thRect.bottom;
    const spaceAbove = thRect.top;
    const openUp = spaceBelow < 240 && spaceAbove > spaceBelow;
    const top = openUp ? undefined : Math.min(window.innerHeight - 8 - 40, thRect.bottom + 6); // slightly below th
    const bottom = openUp ? Math.min(window.innerHeight - 8 - 40, window.innerHeight - thRect.top + 6) : undefined;
    setDropdownPos({ left, top, bottom, openUp, width: dropdownWidth });
  };
 
  // Render
  return (
    <div ref={containerRef} style={{ background: "#fff", borderRadius: 10, padding: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", fontFamily: "Outfit, sans-serif", overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "#f4f6f8", height: 44 }}>
            {columns.map((col, idx) => (
              <th
                key={col.key}
                ref={(el) => (thRefs.current[col.key] = el)}
                style={{ padding: "8px 10px", borderBottom: "1px solid #e6eef8", textAlign: "center", position: "relative" }}
              >
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 600 }}>{col.label}</span>
 
                  {shouldShowFilter(col.label) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (openFilter === col.key) {
                          setTempFilters((p) => { const c = { ...p }; delete c[col.key]; return c; });
                          toggleFilter(null);
                          setSearchTerm("");
                          setDropdownPos(null);
                        } else {
                          initTempFromParent(col.key);
                          toggleFilter(col.key);
                          setTimeout(() => computeFixedPos(col.key, 260), 0);
                        }
                      }}
                      aria-label={`Filter ${col.label}`}
                      style={{ background: "transparent", border: "none", padding: 4, cursor: "pointer" }}
                    >
                      <FunnelIcon active={isActive(col.key)} />
                    </button>
                  )}
                </div>
 
                {/* Fixed dropdown rendered relative to viewport (not clipped) */}
                {openFilter === col.key && shouldShowFilter(col.label) && dropdownPos && (
                  <div
                    className="tf-dropdown"
                    style={{
                      position: "fixed",
                      left: dropdownPos.left,
                      top: dropdownPos.top !== undefined ? dropdownPos.top : undefined,
                      bottom: dropdownPos.bottom !== undefined ? dropdownPos.bottom : undefined,
                      width: dropdownPos.width,
                      overflow: "visible", // no internal scrolling
                      zIndex: 6500,
                      display: "flex",
                      flexDirection: "column",
                      background: "#fff",
                      border: "1px solid #e6eef8",
                      borderRadius: 8,
                      boxShadow: "0 12px 40px rgba(16,24,40,0.16)",
                      maxHeight: "calc(100vh - 40px)",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Search */}
                    <div style={{ padding: 10 }}>
                      <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search..."
                        style={{ width: "220px", padding: "8px 10px", borderRadius: 6, border: "1px solid #e6eef8", fontSize: 13 }}
                      />
                    </div>
 
                    {/* Top Select/Clear row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 10px 8px 10px" }}>
                      <button
                        onClick={() => {
                          const visible = resolveUnique(col.key).filter((v) => String(v).toLowerCase().includes(searchTerm.toLowerCase()));
                          selectAllVisibleTemp(col.key, visible);
                        }}
                        style={{ border: "none", background: "transparent", color: "#1f6feb", cursor: "pointer", fontWeight: 600 }}
                      >
                        Select All
                      </button>
 
                      <button onClick={() => clearTempAll(col.key)} style={{ border: "none", background: "transparent", color: "#1f6feb", cursor: "pointer" }}>
                        Clear All
                      </button>
                    </div>
 
                    {/* Options - NO internal scroll; expand fully (but constrained by maxHeight) */}
                    {/* ✅ Options container — shows 5 items max with internal scroll */}
<div
  style={{
    padding: "6px 8px",
    minHeight: 40,
    maxHeight: 130, // roughly 5 visible options
    overflowY: "auto",
    marginBottom: 70, // space for sticky footer
  }}
>
  {resolveUnique(col.key)
    .filter((v) => String(v).toLowerCase().includes(searchTerm.toLowerCase()))
    .map((val, i) => {
      const checked = tempFor(col.key).includes(val);
      return (
        <label
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "6px 6px",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          <input
            className="tf-checkbox"
            type="checkbox"
            checked={checked}
            onChange={() => toggleTempValue(col.key, val)}
            style={{ width: 16, height: 16, accentColor: "#1f6feb" }}
          />
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: 200,
            }}
          >
            {String(val)}
          </span>
        </label>
      );
    })}

  {resolveUnique(col.key)
    .filter((v) => String(v).toLowerCase().includes(searchTerm.toLowerCase()))
    .length === 0 && (
    <div style={{ padding: 8, color: "#64748b" }}>No options</div>
  )}
</div>

 
                    {/* Sticky footer */}
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, borderTop: "1px solid #eef2f8", padding: "8px 10px", background: "linear-gradient(180deg, rgba(255,255,255,0.95), #fff)", display: "flex", justifyContent: "flex-end", gap: 8 }}>
                      <button onClick={() => cancelFor(col.key)} style={{ background: "#fff", border: "1px solid #e6eef8", color: "#374151", padding: "8px 12px", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>
                        Cancel
                      </button>
                      <button onClick={() => applyFor(col.key)} style={{ background: "#1f6feb", border: "none", color: "#fff", padding: "8px 14px", borderRadius: 6, cursor: "pointer", fontWeight: 700 }}>
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </th>
            ))}
          </tr>
        </thead>
 
        <tbody>
          {(paginatedData || []).length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ padding: 18, textAlign: "center", color: "#666" }}>
                No records found
              </td>
            </tr>
          ) : (
            (paginatedData || []).map((row, rIdx) => (
              <tr key={rIdx} onClick={onRowClick ? () => onRowClick(row) : undefined} style={{ borderBottom: "1px solid #f1f5f9", background: rIdx % 2 === 0 ? "#fff" : "#fbfdff", cursor: onRowClick ? "pointer" : "default" }}>
                {columns.map((col, cIdx) => (
                  <td key={cIdx} style={{ padding: "8px 10px", textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {col.render ? col.render(row[col.key], row, rIdx) : row[col.key] ?? "-"}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}