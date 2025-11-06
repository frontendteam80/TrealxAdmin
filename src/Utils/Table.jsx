<<<<<<< HEAD
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
=======
 /* src/Utils/Table.jsx */
import React, { useEffect, useRef, useState } from "react";

/* ---------- Filled funnel SVG ---------- */
function FilledFunnel({ active = false, size = 16 }) {
  const fill = active ? "#2563eb" : "#9ca3af";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path
        d="M3 5.5C3 4.6716 3.6716 4 4.5 4H19.5C20.3284 4 21 4.6716 21 5.5C21 5.9886 20.7548 6.4439 20.3466 6.7399L13 11.9V16.5C13 16.7761 12.7761 17 12.5 17H11.5C11.2239 17 11 16.7761 11 16.5V11.9L3.6534 6.7399C3.2452 6.4439 3 5.9886 3 5.5Z"
        fill={fill}
        stroke={fill}
        strokeWidth="0.4"
      />
    </svg>
  );
}

/* ---------- Pagination (styled like your screenshot) ---------- */
export function Pagination({ page, setPage, totalPages = 0 }) {
  if (!totalPages || totalPages <= 1) return null;

  const pages = (() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const out = [1];
    if (page > 3) out.push("...");
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    for (let i = start; i <= end; i++) out.push(i);
    if (page < totalPages - 2) out.push("...");
    out.push(totalPages);
    return out;
  })();

  const btn = (disabled) => ({
    minWidth: 34,
    height: 34,
    borderRadius: 8,
    border: "1px solid #e6eef8",
    background: disabled ? "#f8fafc" : "#fff",
    color: disabled ? "#cbd5e1" : "#374151",
    cursor: disabled ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  });

  const pageBtn = {
    minWidth: 34,
    height: 34,
    borderRadius: 8,
    border: "1px solid #e6eef8",
    background: "#fff",
    color: "#334155",
    cursor: "pointer",
    fontSize: 14,
  };

  const activePage = { ...pageBtn, background: "#2563eb", color: "#fff", border: "1px solid #2563eb", fontWeight: 700 };

  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12 }}>
      <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} style={btn(page === 1)} aria-label="Prev">‹</button>
      {pages.map((p, i) => (
        <button
          key={i}
          onClick={() => typeof p === "number" && setPage(p)}
          disabled={p === "..."}
          style={p === page ? activePage : pageBtn}
>>>>>>> 575ef5d (newupdate)
        >
          {p}
        </button>
      ))}
<<<<<<< HEAD

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
=======
      <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} style={btn(page === totalPages)} aria-label="Next">›</button>
>>>>>>> 575ef5d (newupdate)
    </div>
  );
}

<<<<<<< HEAD
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
=======
/* ---------- inject CSS helpers once ---------- */
function injectHelpers() {
  if (document.getElementById("tutils-styles")) return;
  const css = `
    .tutils-td { padding: 6px 8px !important; font-size: 13px; }
    .tutils-th { padding: 8px 10px !important; font-size: 13px; }
    .tutils-options-scroll { max-height: 120px; overflow-y: auto; padding-right: 6px; }
    .tutils-options-scroll::-webkit-scrollbar { width: 8px; }
    .tutils-options-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.08); border-radius: 6px; }
    .tutils-ellipsis { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; display: block; }
    .tutils-dropdown-footer { position: absolute; bottom: 0; left: 0; right: 0; }
  `;
  const s = document.createElement("style");
  s.id = "tutils-styles";
  s.appendChild(document.createTextNode(css));
  document.head.appendChild(s);
}

/* ---------- rupee formatter ---------- */
function rupeeFormat(v) {
  if (v === null || v === undefined || v === "") return "-";
  const s = String(v);
  if (s.includes("₹")) return s;
  return `₹ ${s}`;
}

/* ---------- Main Table component ---------- */
export default function Table({
  columns = [],
  paginatedData = [],
  filters = {},
  openFilter,
  toggleFilter = () => {},
  handleCheckboxChange = () => {},
>>>>>>> 575ef5d (newupdate)
  uniqueValues,
  clearFilter,
  applyFilter,
  onRowClick,
<<<<<<< HEAD
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
=======
  page = 1,
  rowsPerPage = 15,
}) {
  injectHelpers();

  const containerRef = useRef(null);
  const thRefs = useRef({});
  const [searchTerm, setSearchTerm] = useState("");
  const [tempFilters, setTempFilters] = useState({});
  const [dropdownPos, setDropdownPos] = useState(null);

  // Keys that should show rupee and left-aligned
  const priceKeys = new Set(["AmountWithUnit", "Price", "DisplayAmount", "Amount", "DisplayPrice"]);

  const startIndex = Math.max(0, (Number(page) - 1) * Number(rowsPerPage));

  /* ---------- lifecycle: close dropdown when clicking outside ---------- */
  useEffect(() => {
    function onDoc(e) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target) && openFilter) {
        // cleanup temp for openFilter
        setTempFilters((prev) => {
          const copy = { ...prev };
          delete copy[openFilter];
          return copy;
        });
        toggleFilter(null);
        setDropdownPos(null);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [openFilter, toggleFilter]);

  // when dropdown open, prevent body scrolling so dropdown appears fixed
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = openFilter ? "hidden" : prev || "auto";
    return () => (document.body.style.overflow = prev || "auto");
  }, [openFilter]);

  /* ---------- helpers ---------- */
  const shouldShowFilter = (label = "") => {
    const l = String(label || "").toLowerCase();
    if (l.includes("s.no") || l.includes("serial") || l.includes("s no")) return false;
    if (l.includes("action") || l.includes("click")) return false;
    return true;
  };

  const resolveUnique = (colKey) => {
    if (typeof uniqueValues === "function") {
      const out = uniqueValues(colKey);
      if (Array.isArray(out) && out.length) return out;
    }
    // fallback: derive from all data in paginatedData
    const list = (paginatedData || []).map((r) => (r ? r[colKey] : undefined)).filter((v) => v !== undefined && v !== null && String(v).trim() !== "");
    const uniq = Array.from(new Set(list));
    const numeric = uniq.every((u) => !isNaN(Number(String(u).replace(/[,₹\sCrcr]/g, ""))));
    if (numeric) {
      return uniq.map((u) => ({ raw: u, n: Number(String(u).replace(/[,₹\sCrcr]/g, "")) })).sort((a, b) => a.n - b.n).map(x => x.raw);
    }
    return uniq.sort((a, b) => String(a).localeCompare(String(b)));
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

    // sync with parent's checkbox handler: check items present in final but not in existing,
    // uncheck items present in existing but not in final
    final.forEach((v) => { if (!existing.includes(v)) handleCheckboxChange(colKey, v); });
    existing.forEach((v) => { if (!final.includes(v)) handleCheckboxChange(colKey, v); });

    if (typeof applyFilter === "function") applyFilter();
    setTempFilters((prev) => { const copy = { ...prev }; delete copy[colKey]; return copy; });
    toggleFilter(null);
    setSearchTerm("");
    setDropdownPos(null);
  };

  const clearAllParent = (colKey) => {
    if (typeof clearFilter === "function") {
      clearFilter(colKey);
    } else {
      (filters[colKey] || []).slice().forEach((v) => handleCheckboxChange(colKey, v));
    }
    setTempFilters((prev) => { const copy = { ...prev }; delete copy[colKey]; return copy; });
  };

  const isActive = (colKey) => Array.isArray(filters[colKey]) && filters[colKey].length > 0;

  const computeFixedPos = (colKey, dropdownWidth = 240) => {
    const th = thRefs.current[colKey];
    if (!th) { setDropdownPos(null); return; }
    const r = th.getBoundingClientRect();
    let left = r.left + r.width / 2 - dropdownWidth / 2;
    left = Math.min(Math.max(left, 8), window.innerWidth - dropdownWidth - 8);
    const spaceBelow = window.innerHeight - r.bottom;
    const spaceAbove = r.top;
    const openUp = spaceBelow < 200 && spaceAbove > spaceBelow;
    const top = openUp ? undefined : Math.min(window.innerHeight - 8 - 40, r.bottom + 8);
    const bottom = openUp ? Math.min(window.innerHeight - 8 - 40, window.innerHeight - r.top + 8) : undefined;
    setDropdownPos({ left, top, bottom, width: dropdownWidth, openUp });
  };

  /* ---------- render helpers ---------- */
  const renderCellContent = (col, row, rIdx) => {
    if (typeof col.render === "function") {
      const res = col.render(row[col.key], row, rIdx);
      if (typeof res === "string" || typeof res === "number") {
        if (priceKeys.has(col.key) || (col.label && col.label.toLowerCase().includes("price"))) return rupeeFormat(res);
        return String(res);
      }
      return res;
    }
    const raw = row[col.key];
    if (raw === null || raw === undefined || raw === "") return "-";
    if (priceKeys.has(col.key) || (col.label && col.label.toLowerCase().includes("price"))) return rupeeFormat(raw);
    return String(raw);
  };

  /* ---------- UI ---------- */
  return (
    <div ref={containerRef} style={{ background: "#fff", borderRadius: 10, padding: 12, boxShadow: "0 8px 24px rgba(15,23,42,0.04)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Outfit, sans-serif" }}>
        <thead>
          <tr style={{ background: "#fafbfd", height: 40 }}>
            {columns.map((col) => (
              <th
                key={col.key}
                ref={(el) => (thRefs.current[col.key] = el)}
                className="tutils-th"
                style={{ borderBottom: "1px solid #eef2f6", fontWeight: 600, textAlign: "center", position: "relative" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: priceKeys.has(col.key) ? "flex-start" : "center", paddingLeft: priceKeys.has(col.key) ? 8 : 0 }}>
                  <span>{col.label}</span>
                  {col.canFilter !== false && shouldShowFilter(col.label) && (
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
                          setTimeout(() => computeFixedPos(col.key, 240), 0);
                        }
                      }}
                      style={{ background: "transparent", border: "none", padding: 6, cursor: "pointer" }}
                      aria-label={`Filter ${col.label}`}
                    >
                      <FilledFunnel active={isActive(col.key)} />
                    </button>
                  )}
                </div>

                {/* Dropdown fixed on page */}
                {openFilter === col.key && shouldShowFilter(col.label) && dropdownPos && (
                  <div
                    style={{
                      position: "fixed",
                      left: dropdownPos.left,
                      top: dropdownPos.top !== undefined ? dropdownPos.top : undefined,
                      bottom: dropdownPos.bottom !== undefined ? dropdownPos.bottom : undefined,
                      width: dropdownPos.width,
                      zIndex: 9999,
                      background: "#fff",
                      border: "1px solid #e6eef8",
                      borderRadius: 8,
                      boxShadow: "0 12px 40px rgba(16,24,40,0.12)",
                      //overflow: "hidden",
                      maxHeight: "calc(100vh - 40px)",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div style={{ padding: 8 }}>
                      <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search..."
                        style={{ width: "90%", padding: "7px 10px", borderRadius: 6, border: "1px solid #e6eef8", fontSize: 13 }}
                      />
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", padding: "0 8px 6px 8px" }}>
                      <button
                        onClick={() => {
                          const visible = resolveUnique(col.key).filter((v) => String(v).toLowerCase().includes(searchTerm.toLowerCase()));
                          selectAllVisibleTemp(col.key, visible);
                        }}
                        style={{ background: "transparent", border: "none", color: "#2563eb", fontWeight: 600, cursor: "pointer", fontSize: 13 }}
                      >
                        Select All
                      </button>
                      <button onClick={() => clearTempAll(col.key)} style={{ background: "transparent", border: "none", color: "#2563eb", cursor: "pointer", fontSize: 13 }}>
                        Clear All
                      </button>
                    </div>

                    <div className="tutils-options-scroll" style={{ padding: "6px 8px 64px 8px" }}>
                      {resolveUnique(col.key).filter((v) => String(v).toLowerCase().includes(searchTerm.toLowerCase())).map((val, i) => {
                        const checked = tempFor(col.key).includes(val);
                        return (
                          <label key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 6px", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleTempValue(col.key, val)}
                              style={{ width: 16, height: 16, accentColor: "#2563eb" }}
                            />
                            <span className="tutils-ellipsis" style={{ maxWidth: 180 }}>{String(val)}</span>
                          </label>
                        );
                      })}

                      {resolveUnique(col.key).filter((v) => String(v).toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                        <div style={{ padding: 8, color: "#64748b", fontSize: 13 }}>No options</div>
                      )}
                    </div>

                    <div className="tutils-dropdown-footer" style={{ borderTop: "1px solid #eef2f6", padding: 8, background: "#fff" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                        <button onClick={() => cancelFor(col.key)} style={{ padding: "7px 10px", borderRadius: 6, border: "1px solid #e6eef8", background: "#fff", cursor: "pointer", fontSize: 13 }}>
                          Cancel
                        </button>
                        <button onClick={() => applyFor(col.key)} style={{ padding: "7px 12px", borderRadius: 6, border: "none", background: "#2563eb", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 13 }}>
                          Apply
                        </button>
                      </div>
>>>>>>> 575ef5d (newupdate)
                    </div>
                  </div>
                )}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
<<<<<<< HEAD
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
=======
          {(paginatedData || []).length === 0 ? (
            <tr><td colSpan={columns.length} className="tutils-td" style={{ textAlign: "center", padding: 14, color: "#64748b" }}>Loading</td></tr>
          ) : (
            paginatedData.map((row, rIdx) => {
              const globalIndex = startIndex + rIdx;
              return (
                <tr key={rIdx} style={{ height: 36, background: rIdx % 2 === 0 ? "#fff" : "#fbfdff", borderBottom: "1px solid #f1f5f9", cursor: onRowClick ? "pointer" : "default" }} onClick={onRowClick ? () => onRowClick(row) : undefined}>
                  {columns.map((col, cIdx) => {
                    const isPrice = priceKeys.has(col.key) || (col.label && col.label.toLowerCase().includes("price"));
                    const align = isPrice ? "left" : "center";
                    const paddingLeft = isPrice ? 12 : undefined;

                    let cellContent;
                    if (col.key === "serialNo") {
                      cellContent = globalIndex + 1;
                    } else {
                      cellContent = renderCellContent(col, row, rIdx);
                    }

                    return (
                      <td key={cIdx} className="tutils-td" style={{ textAlign: align, paddingLeft, verticalAlign: "middle", maxWidth: col.maxWidth || undefined }}>
                        {cellContent}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
>>>>>>> 575ef5d (newupdate)
        </tbody>
      </table>
    </div>
  );
}
