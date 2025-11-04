//  import React from "react";
// import { Funnel } from "lucide-react";

// // ✅ Pagination (with numbered buttons, ellipsis & gold highlight)
// export function Pagination({ page, setPage, totalPages }) {
//   const maxVisiblePages = 3;

//   const generatePages = () => {
//     let pages = [];
//     if (totalPages <= 5) {
//       for (let i = 1; i <= totalPages; i++) pages.push(i);
//     } else {
//       if (page <= maxVisiblePages) {
//         pages = [1, 2, 3, "...", totalPages];
//       } else if (page >= totalPages - 2) {
//         pages = [1, "...", totalPages - 2, totalPages - 1, totalPages];
//       } else {
//         pages = [1, "...", page, "...", totalPages];
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

//       {/* Page Info */}
//       <span style={{ fontSize: "0.9rem", color: "#444", marginLeft: 8 }}>
//         Page <strong>{page}</strong> of {totalPages}
//       </span>
//     </div>
//   );
// }

// // ✅ Main Table
// export default function Table({
//   columns,
//   paginatedData = [],
//   openFilter,
//   toggleFilter,
//   filters,
//   handleCheckboxChange,
//   searchValue,
//   setSearchValue,
//   uniqueValues,
//   clearFilter,
//   applyFilter,
//   onRowClick,
// }) {
//   return (
//     <div
//       style={{
//         background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
//         borderRadius: 10,
//         padding: "12px",
//         boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
//       }}
//     >
//       <table
//         style={{
//           width: "100%",
//           borderCollapse: "collapse",
//           textAlign: "center",
//           fontFamily: "Inter, sans-serif,outfit",
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
//                 {col.key !== "serialNo" && col.key !== "more" && (
//                   <Funnel
//                     size={4}
//                     style={{
//                       marginLeft: 6,
//                       cursor: "pointer",
//                       verticalAlign: "middle",
//                       opacity: 0.3,
//                     }}
//                     onClick={() => toggleFilter(col.key)}
//                   />
//                 )}
//                 {openFilter === col.key && (
//                   <div
//                     style={{
//                       position: "absolute",
//                       top: "110%",
//                       right: 0,
//                       background: "#fff",
//                       border: "1px solid #ddd",
//                       borderRadius: 6,
//                       boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//                       width: 180,
//                       zIndex: 2500,
//                       padding: 8,
//                       textAlign: "left",
//                     }}
//                   >
//                     <input
//                       type="text"
//                       placeholder="Search..."
//                       value={searchValue}
//                       onChange={(e) => setSearchValue(e.target.value)}
//                       style={{
//                         width: "100%",
//                         padding: "4px 6px",
//                         marginBottom: 6,
//                         fontSize: "0.8rem",
//                         border: "1px solid #ccc",
//                         borderRadius: 4,
//                       }}
//                     />
//                     <div
//                       style={{
//                         maxHeight: 150,
//                         overflowY: "auto",
//                         fontSize: "0.8rem",
//                       }}
//                     >
//                       {uniqueValues(col.key)
//                         .filter((v) =>
//                           v
//                             ?.toString()
//                             .toLowerCase()
//                             .includes(searchValue.toLowerCase())
//                         )
//                         .map((val) => (
//                           <label key={val} style={{ display: "block" }}>
//                             <input
//                               type="checkbox"
//                               checked={(filters[col.key] || []).includes(val)}
//                               onChange={() =>
//                                 handleCheckboxChange(col.key, val)
//                               }
//                             />{" "}
//                             {val}
//                           </label>
//                         ))}
//                     </div>
//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         marginTop: 6,
//                       }}
//                     >
//                       <button
//                         onClick={() => clearFilter(col.key)}
//                         style={{
//                           background: "#f3f4f6",
//                           border: "none",
//                           borderRadius: 4,
//                           padding: "4px 8px",
//                           fontSize: "0.75rem",
//                           cursor: "pointer",
//                         }}
//                       >
//                         Clear
//                       </button>
//                       <button
//                         onClick={applyFilter}
//                         style={{
//                           background: "#007bff",
//                           color: "#fff",
//                           border: "none",
//                           borderRadius: 4,
//                           padding: "4px 8px",
//                           fontSize: "0.75rem",
//                           cursor: "pointer",
//                         }}
//                       >
//                         Apply
//                       </button>
//                     </div>
//                   </div>
//                 )}
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
//                   {col.render ? col.render(row[col.key], row, idx) : row[col.key] || "-"}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

import React from "react";
import { Funnel } from "lucide-react";

// ✅ Pagination (without "Page 1 of 553" text)
export function Pagination({ page, setPage, totalPages }) {
  const maxVisiblePages = 3;

  const generatePages = () => {
    let pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= maxVisiblePages) {
        pages = [1, 2, 3, "...", totalPages];
      } else if (page >= totalPages - 2) {
        pages = [1, "...", totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [1, "...", page, "...", totalPages];
      }
    }
    return pages;
  };

  const pages = generatePages();

  const handleClick = (p) => {
    if (p === "..." || p === page) return;
    setPage(p);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "6px",
        padding: "18px 0",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Prev Button */}
      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        style={{
          border: "1px solid #d1d5db",
          background: page === 1 ? "#f3f4f6" : "#fff",
          color: "#374151",
          borderRadius: "6px",
          padding: "5px 9px",
          cursor: page === 1 ? "not-allowed" : "pointer",
          fontWeight: 500,
        }}
      >
        &lt;
      </button>

      {/* Number Buttons */}
      {pages.map((p, idx) => (
        <button
          key={idx}
          onClick={() => handleClick(p)}
          disabled={p === "..."}
          style={{
            border: p === page ? "1px solid gold" : "1px solid #d1d5db",
            background: "#fff",
            color: p === page ? "#000" : "#374151",
            borderRadius: "6px",
            padding: "5px 10px",
            minWidth: "32px",
            cursor: p === "..." ? "default" : "pointer",
            fontWeight: p === page ? 600 : 400,
          }}
        >
          {p}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
        style={{
          border: "1px solid #d1d5db",
          background: page === totalPages ? "#f3f4f6" : "#fff",
          color: "#374151",
          borderRadius: "6px",
          padding: "5px 9px",
          cursor: page === totalPages ? "not-allowed" : "pointer",
          fontWeight: 500,
        }}
      >
        &gt;
      </button>
    </div>
  );
}

// ✅ Main Table
export default function Table({
  columns,
  paginatedData = [],
  openFilter,
  toggleFilter,
  filters,
  handleCheckboxChange,
  searchValue,
  setSearchValue,
  uniqueValues,
  clearFilter,
  applyFilter,
  onRowClick,
}) {
  return (
    <div
      style={{
        background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
        borderRadius: 10,
        padding: "12px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "center",
          fontFamily: "Inter, sans-serif,outfit",
          fontSize: "0.85rem",
        }}
      >
        <thead>
          <tr style={{ background: "#f3f4f6", height: 36 }}>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  padding: "6px 8px",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  borderBottom: "1px solid #e5e7eb",
                  position: "relative",
                  color: "#1e293b",
                  textAlign: "center",
                  background: "#f8fafc",
                }}
              >
                {col.label}
                {col.key !== "serialNo" && col.key !== "more" && (
                  <Funnel
                    size={4}
                    style={{
                      marginLeft: 6,
                      cursor: "pointer",
                      verticalAlign: "middle",
                      opacity: 0.3,
                    }}
                    onClick={() => toggleFilter(col.key)}
                  />
                )}
                {openFilter === col.key && (
                  <div
                    style={{
                      position: "absolute",
                      top: "110%",
                      right: 0,
                      background: "#fff",
                      border: "1px solid #ddd",
                      borderRadius: 6,
                      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                      width: 180,
                      zIndex: 2500,
                      padding: 8,
                      textAlign: "left",
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "4px 6px",
                        marginBottom: 6,
                        fontSize: "0.8rem",
                        border: "1px solid #ccc",
                        borderRadius: 4,
                      }}
                    />
                    <div
                      style={{
                        maxHeight: 150,
                        overflowY: "auto",
                        fontSize: "0.8rem",
                      }}
                    >
                      {uniqueValues(col.key)
                        .filter((v) =>
                          v
                            ?.toString()
                            .toLowerCase()
                            .includes(searchValue.toLowerCase())
                        )
                        .map((val) => (
                          <label key={val} style={{ display: "block" }}>
                            <input
                              type="checkbox"
                              checked={(filters[col.key] || []).includes(val)}
                              onChange={() =>
                                handleCheckboxChange(col.key, val)
                              }
                            />{" "}
                            {val}
                          </label>
                        ))}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: 6,
                      }}
                    >
                      <button
                        onClick={() => clearFilter(col.key)}
                        style={{
                          background: "#f3f4f6",
                          border: "none",
                          borderRadius: 4,
                          padding: "4px 8px",
                          fontSize: "0.75rem",
                          cursor: "pointer",
                        }}
                      >
                        Clear
                      </button>
                      <button
                        onClick={applyFilter}
                        style={{
                          background: "#007bff",
                          color: "#fff",
                          border: "none",
                          borderRadius: 4,
                          padding: "4px 8px",
                          fontSize: "0.75rem",
                          cursor: "pointer",
                        }}
                      >
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
          {(Array.isArray(paginatedData) ? paginatedData : []).map((row, idx) => (
            <tr
              key={idx}
              style={{
                height: 32,
                borderBottom: "1px solid #e5e7eb",
                fontSize: "0.83rem",
                cursor: onRowClick ? "pointer" : "default",
                background: idx % 2 === 0 ? "#ffffff" : "#f9fafb",
                transition: "background 0.2s ease",
              }}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#e0f2fe")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  idx % 2 === 0 ? "#ffffff" : "#f9fafb")
              }
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  style={{
                    padding: "4px 6px",
                    color: "#1f2937",
                    verticalAlign: "middle",
                  }}
                >
                  {col.render ? col.render(row[col.key], row, idx) : row[col.key] || "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
