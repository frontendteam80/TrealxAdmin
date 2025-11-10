
import React, { useEffect, useRef, useState } from "react";
import "./Table.scss";

/* ---------- Small filled funnel SVG ---------- */
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

/* ---------- Pagination component ---------- */
function Pagination({ page, setPage, totalPages = 0 }) {
  if (!totalPages || totalPages <= 1) return null;

  const clamp = (n) => Math.max(1, Math.min(totalPages, Math.floor(n)));

  const pages = (() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const arr = [1];
    if (page > 3) arr.push("left-ellipsis");
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    for (let i = start; i <= end; i++) arr.push(i);
    if (page < totalPages - 2) arr.push("right-ellipsis");
    arr.push(totalPages);
    return arr;
  })();

  const smallBtn = (disabled = false) => ({
    minWidth: 34,
    height: 34,
    borderRadius: 8,
    border: "1px solid #e8eef6",
    background: disabled ? "#fbfdff" : "#fff",
    color: disabled ? "#c6d0db" : "#333",
    cursor: disabled ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    fontSize: 14,
  });

  const pageBtn = {
    minWidth: 34,
    height: 34,
    borderRadius: 8,
    border: "1px solid #f1f5f9",
    background: "#fff",
    color: "#333",
    cursor: "pointer",
    fontSize: 14,
    padding: "0 8px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const activeBtn = {
    ...pageBtn,
    background: "#fff",
    border: "2px solid #f3c44b",
    color: "#111",
    fontWeight: 700,
    boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
  };

  const [inputPage, setInputPage] = useState(String(page));
  useEffect(() => setInputPage(String(page)), [page]);

  const applyInput = () => {
    const v = Number(inputPage);
    if (!Number.isFinite(v)) {
      setInputPage(String(page));
      return;
    }
    setPage(clamp(v));
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px 12px" }}>
      <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} style={smallBtn(page === 1)} aria-label="Previous">‹</button>

      {pages.map((p, i) =>
        p === "left-ellipsis" || p === "right-ellipsis" ? (
          <div key={p + i} style={{ minWidth: 28, textAlign: "center", color: "#8897a6" }}>...</div>
        ) : (
          <button key={p} onClick={() => setPage(p)} style={p === page ? activeBtn : pageBtn} aria-current={p === page ? "page" : undefined}>
            {p}
          </button>
        )
      )}

      <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} style={smallBtn(page === totalPages)} aria-label="Next">›</button>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 12 }}>
        <div style={{ color: "#6b7280", fontSize: 13 }}>Page</div>
        <input
          value={inputPage}
          onChange={(e) => setInputPage(e.target.value.replace(/[^\d]/g, ""))}
          onKeyDown={(e) => {
            if (e.key === "Enter") applyInput();
            if (e.key === "ArrowUp") setInputPage(String(clamp(Number(inputPage || 1) + 1)));
            if (e.key === "ArrowDown") setInputPage(String(clamp(Number(inputPage || 1) - 1)));
          }}
          onBlur={applyInput}
          style={{
            width: 54,
            height: 32,
            padding: "4px 8px",
            borderRadius: 6,
            border: "1px solid #e6eef8",
            textAlign: "center",
            fontSize: 13,
            background: "#fff",
          }}
        />
        <div style={{ color: "#6b7280", fontSize: 13 }}>of {totalPages}</div>
      </div>
    </div>
  );
}

/* ---------- inject CSS helpers once ---------- */
function injectHelpers() {
  if (document.getElementById("tutils-styles")) return;
  const css = `
    .tutils-td { padding: 8px 10px !important; font-size: 13px; vertical-align: middle; }
    .tutils-th { padding: 10px 12px !important; font-size: 13px; vertical-align: middle; }
    .tutils-options-scroll { max-height: 140px; overflow-y: auto; padding-right: 6px; }
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

// Utility to detect numeric value for alignment
function isNumeric(value) {
  return (
    typeof value === "number" ||
    (typeof value === "string" &&
      value.trim() !== "" &&
      /^[\d,\.\-\s₹]+$/.test(value) &&
      !/[a-zA-Z]/.test(value))
  );
}

/* ---------- Main Table component ---------- */
export default function Table({
  columns = [],
  paginatedData = [],
  filters = {},
  openFilter,
  toggleFilter = () => {},
  handleCheckboxChange = () => {},
  uniqueValues,
  clearFilter,
  applyFilter,
  onRowClick,
  page = 1,
  setPage = () => {},
  rowsPerPage = 15,
  totalCount = 0,
}) {
  injectHelpers();

  const containerRef = useRef(null);
  const thRefs = useRef({});
  const [searchTerm, setSearchTerm] = useState("");
  const [tempFilters, setTempFilters] = useState({});
  const [dropdownPos, setDropdownPos] = useState(null);

  const priceKeys = new Set([
    "AmountWithUnit",
    "Price",
    "DisplayAmount",
    "Amount",
    "DisplayPrice",
    "DisplayPriceRange",
  ]);

  const totalPages = Math.ceil(totalCount / rowsPerPage);
  const startIndex = Math.max(0, (Number(page) - 1) * Number(rowsPerPage));

  // showOnlyApplied[colKey] === true means: show only applied (parent) values for that column
  const [showOnlyApplied, setShowOnlyApplied] = useState({});

  /* ---------- lifecycle: close dropdown when clicking outside ---------- */
  useEffect(() => {
    function onDoc(e) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target) && openFilter) {
        // When clicking outside and closing dropdown, just remove temporary state for that column.
        setTempFilters((prev) => {
          const copy = { ...prev };
          delete copy[openFilter];
          return copy;
        });

        // keep showOnlyApplied intact — applied state persists until parent filters change
        toggleFilter(null);
        setDropdownPos(null);
        setSearchTerm("");
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [openFilter, toggleFilter]);

  // lock body scroll when filter open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = openFilter ? "hidden" : prev || "auto";
    return () => (document.body.style.overflow = prev || "auto");
  }, [openFilter]);

  /* ---------- sync showOnlyApplied with parent filters ----------
     If parent filters for a column become empty, remove "show only applied" flag
     so next open shows full option list automatically.
  */
  useEffect(() => {
    setShowOnlyApplied((prev) => {
      const copy = { ...prev };
      Object.keys(prev).forEach((k) => {
        if (!Array.isArray(filters[k]) || filters[k].length === 0) {
          delete copy[k];
        }
      });
      return copy;
    });
  }, [filters]);

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
    const list = (paginatedData || [])
      .map((r) => (r ? r[colKey] : undefined))
      .filter((v) => v !== undefined && v !== null && String(v).trim() !== "");
    const uniq = Array.from(new Set(list));
    const numeric = uniq.every((u) => !isNaN(Number(String(u).replace(/[,₹\sCrcr]/g, ""))));
    if (numeric) {
      return uniq
        .map((u) => ({ raw: u, n: Number(String(u).replace(/[,₹\sCrcr]/g, "")) }))
        .sort((a, b) => a.n - b.n)
        .map((x) => x.raw);
    }
    return uniq.sort((a, b) => String(a).localeCompare(String(b)));
  };

  const tempFor = (colKey) =>
    tempFilters[colKey] !== undefined
      ? tempFilters[colKey]
      : Array.isArray(filters[colKey])
      ? [...filters[colKey]]
      : [];

  // When user opens dropdown, initialize temp from parent filters
  const initTempFromParent = (colKey) => {
    setTempFilters((p) => ({
      ...p,
      [colKey]: Array.isArray(filters[colKey]) ? [...filters[colKey]] : [],
    }));
  };

  const toggleTempValue = (colKey, val) => {
    setTempFilters((prev) => {
      const cur =
        prev[colKey] !== undefined
          ? [...prev[colKey]]
          : Array.isArray(filters[colKey])
          ? [...filters[colKey]]
          : [];
      const next = cur.includes(val) ? cur.filter((x) => x !== val) : [...cur, val];
      return { ...prev, [colKey]: next };
    });
  };

  const selectAllVisibleTemp = (colKey, visibleList) =>
    setTempFilters((prev) => ({ ...prev, [colKey]: [...visibleList] }));

  // Clear temp selections only (user must click Apply to affect parent filters)
  const clearTempAll = (colKey) => {
    setTempFilters((prev) => ({ ...prev, [colKey]: [] }));
  };

  const cancelFor = (colKey) => {
    setTempFilters((prev) => {
      const copy = { ...prev };
      delete copy[colKey];
      return copy;
    });

    // Do not clear showOnlyApplied here — keep applied view until parent clears filters
    toggleFilter(null);
    setSearchTerm("");
    setDropdownPos(null);
  };

  const applyFor = (colKey) => {
    const final =
      tempFilters[colKey] !== undefined
        ? tempFilters[colKey]
        : Array.isArray(filters[colKey])
        ? filters[colKey]
        : [];
    const existing = Array.isArray(filters[colKey]) ? filters[colKey] : [];

    // sync: call handleCheckboxChange to toggle differences
    final.forEach((v) => {
      if (!existing.includes(v)) handleCheckboxChange(colKey, v);
    });
    existing.forEach((v) => {
      if (!final.includes(v)) handleCheckboxChange(colKey, v);
    });

    if (typeof applyFilter === "function") applyFilter();

    // cleanup temp
    setTempFilters((prev) => {
      const copy = { ...prev };
      delete copy[colKey];
      return copy;
    });

    // if we applied non-empty filters, show only applied values in future opens
    if (Array.isArray(final) && final.length > 0) {
      setShowOnlyApplied((prev) => ({ ...prev, [colKey]: true }));
    } else {
      // if apply resulted in empty parent filters, remove the flag
      setShowOnlyApplied((prev) => {
        const copy = { ...prev };
        delete copy[colKey];
        return copy;
      });
    }

    toggleFilter(null);
    setSearchTerm("");
    setDropdownPos(null);
  };

  // Clear filters from parent (external) -> also clear showOnlyApplied immediately
  const clearAllParent = (colKey) => {
    if (typeof clearFilter === "function") {
      clearFilter(colKey);
    } else {
      (filters[colKey] || []).slice().forEach((v) => handleCheckboxChange(colKey, v));
    }

    // remove any temporary UI state for this column
    setTempFilters((prev) => {
      const copy = { ...prev };
      delete copy[colKey];
      return copy;
    });

    // IMPORTANT: remove the "show only applied" flag so the dropdown will show all options
    setShowOnlyApplied((prev) => {
      const copy = { ...prev };
      delete copy[colKey];
      return copy;
    });
  };

  const isActive = (colKey) => Array.isArray(filters[colKey]) && filters[colKey].length > 0;

  const computeFixedPos = (colKey, dropdownWidth = 200) => {
    const th = thRefs.current[colKey];
    if (!th) {
      setDropdownPos(null);
      return;
    }
    const r = th.getBoundingClientRect();
    let left = r.left + r.width / 2 - dropdownWidth / 2;
    left = Math.min(Math.max(left, 8), window.innerWidth - dropdownWidth - 8);
    const spaceBelow = window.innerHeight - r.bottom;
    const spaceAbove = r.top;
    const openUp = spaceBelow < 200 && spaceAbove > spaceBelow;
    const top = openUp ? undefined : Math.min(window.innerHeight - 8 - 40, r.bottom + 8);
    const bottom = openUp
      ? Math.min(window.innerHeight - 8 - 40, window.innerHeight - r.top + 8)
      : undefined;
    setDropdownPos({ left, top, bottom, width: dropdownWidth, openUp });
  };

  /* ---------- single render helper ---------- */
  function renderCellContent(col, row, rIdx) {
    if (typeof col.render === "function") {
      const res = col.render(row[col.key], row, rIdx);
      if (typeof res === "string" || typeof res === "number") {
        if (
          priceKeys.has(col.key) ||
          (col.label && String(col.label).toLowerCase().includes("price"))
        )
          return rupeeFormat(res);
        return String(res);
      }
      return res;
    }
    const raw = row[col.key];
    if (raw === null || raw === undefined || raw === "") return "-";
    if (
      priceKeys.has(col.key) ||
      (col.label && String(col.label).toLowerCase().includes("price"))
    )
      return rupeeFormat(raw);
    return String(raw);
  }

  /* ---------- UI ---------- */
  return (
    <div
      ref={containerRef}
      style={{
        // background: "#fff",
        // borderRadius: 8,
        // padding: 8,
        // boxShadow: "0 6px 18px rgba(15,23,42,0.04)",
      }}
    >
      <table
        style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Outfit, sans-serif" }}
      >
        <thead>
          <tr style={{ background: "#fafbfd", height: 44 }}>
            {columns.map((col) => {
              const isPrice =
                priceKeys.has(col.key) ||
                (col.label && String(col.label).toLowerCase().includes("price"));
              return (
                <th
                  key={col.key}
                  ref={(el) => (thRefs.current[col.key] = el)}
                  className="tutils-th"
                  style={{
                    borderBottom: "1px solid #eef2f6",
                    fontWeight: 600,
                    textAlign: isPrice ? "right" : "left",
                    position: "relative",
                    paddingRight: isPrice ? 16 : 12,
                    paddingLeft: 12,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      justifyContent: isPrice ? "flex-end" : "flex-start",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: 220,
                      }}
                    >
                      {col.label}
                    </span>

                    {col.canFilter !== false && shouldShowFilter(col.label) && resolveUnique(col.key).length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (openFilter === col.key) {
                            // close dropdown
                            setTempFilters((p) => {
                              const c = { ...p };
                              delete c[col.key];
                              return c;
                            });
                            toggleFilter(null);
                            setSearchTerm("");
                            setDropdownPos(null);
                          } else {
                            initTempFromParent(col.key);
                            toggleFilter(col.key);
                            setTimeout(() => computeFixedPos(col.key, 200), 0);
                          }
                        }}
                        style={{ background: "transparent", border: "none", padding: 6, cursor: "pointer" }}
                        aria-label={`Filter ${col.label}`}
                      >
                        <FilledFunnel active={isActive(col.key)} />
                      </button>
                    )}
                  </div>

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
                        maxHeight: "calc(100vh - 40px)",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div style={{ padding: 8 }}>
                        <input
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search..."
                          style={{
                            width: "90%",
                            padding: "7px 10px",
                            borderRadius: 6,
                            border: "1px solid #e6eef8",
                            fontSize: 13,
                          }}
                        />
                      </div>

                      {(() => {
                        // If showOnlyApplied[col.key] is true, show tempFor (initialized from parent filters)
                        // Otherwise show full resolveUnique list.
                        const sourceList = showOnlyApplied[col.key] ? tempFor(col.key) : resolveUnique(col.key);
                        const allOptions = sourceList.filter((val) => String(val).toLowerCase().includes(searchTerm.toLowerCase()));
                        const allChecked = allOptions.length > 0 && tempFor(col.key).length > 0 && tempFor(col.key).length === allOptions.length;

                        return (
                          <div style={{ display: "flex", justifyContent: "space-between", padding: "0 8px 6px 8px" }}>
                            <button
                              onClick={() => selectAllVisibleTemp(col.key, allOptions)}
                              style={{
                                background: "transparent",
                                border: "none",
                                color: "#2563eb",
                                fontWeight: allChecked ? 700 : 600,
                                cursor: "pointer",
                                fontSize: 13,
                              }}
                            >
                              Select All
                            </button>
                            <button
                              onClick={() => clearTempAll(col.key)}
                              style={{ background: "transparent", border: "none", color: "#2563eb", cursor: "pointer", fontSize: 13 }}
                            >
                              Clear All
                            </button>
                          </div>
                        );
                      })()}

                      <div className="tutils-options-scroll" style={{ padding: "6px 8px 64px 8px" }}>
                        {(showOnlyApplied[col.key] ? tempFor(col.key) : resolveUnique(col.key))
                          .filter((val) => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
                          .map((val, i) => (
                            <label
                              key={i}
                              style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 6px", borderRadius: 6, cursor: "pointer", fontSize: 13 }}
                            >
                              <input
                                type="checkbox"
                                checked={tempFor(col.key).includes(val)}
                                onChange={() => toggleTempValue(col.key, val)}
                                style={{ width: 16, height: 16, accentColor: "#2563eb" }}
                              />
                              <span className="tutils-ellipsis" style={{ maxWidth: 160 }}>
                                {String(val)}
                              </span>
                            </label>
                          ))}
                        {(showOnlyApplied[col.key] ? tempFor(col.key) : resolveUnique(col.key))
                          .filter((val) => String(val).toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                          <div style={{ padding: 8, color: "#64748b", fontSize: 13 }}>
                            {showOnlyApplied[col.key] ? "No applied filters" : "No options"}
                          </div>
                        )}
                      </div>

                      <div
                        className="tutils-dropdown-footer"
                        style={{ borderTop: "1px solid #eef2f6", padding: 8, background: "#fff" }}
                      >
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                          <button
                            onClick={() => cancelFor(col.key)}
                            style={{ padding: "7px 10px", borderRadius: 6, border: "1px solid #e6eef8", background: "#fff", cursor: "pointer", fontSize: 13 }}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => applyFor(col.key)}
                            style={{ padding: "7px 12px", borderRadius: 6, border: "none", background: "#2563eb", color: "#fff", cursor: "pointer", fontSize: 13 }}
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {(paginatedData || []).length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="tutils-td" style={{ textAlign: "center", padding: 18, color: "#64748b" }}>
                No records found
              </td>
            </tr>
          ) : (
            (paginatedData || []).map((row, rIdx) => {
              const globalIndex = startIndex + rIdx;
              return (
                <tr
                  key={rIdx}
                  style={{
                    height: 44,
                    background: rIdx % 2 === 0 ? "#fff" : "#fbfdff",
                    borderBottom: "1px solid #f1f5f9",
                    cursor: onRowClick ? "pointer" : "default",
                  }}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((col, cIdx) => {
                    const isPrice = priceKeys.has(col.key) || (col.label && String(col.label).toLowerCase().includes("price"));
                    const cellValue =
                      col.key === "serialNo" || col.key === "serial" || String(col.label || "").toLowerCase().includes("s.no")
                        ? globalIndex + 1
                        : renderCellContent(col, row, rIdx);

                    const align = isNumeric(cellValue) ? "center" : "left";

                    return (
                      <td
                        key={cIdx}
                        className="tutils-td"
                        style={{
                          textAlign: align,
                          paddingLeft: 12,
                          paddingRight: 12,
                          verticalAlign: "middle",
                          maxWidth: col.maxWidth || undefined,
                          whiteSpace: col.wrap === false ? "nowrap" : "normal",
                        }}
                      >
                        {cellValue}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Pagination below table */}
      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
    </div>
  );
}

export { Pagination };
