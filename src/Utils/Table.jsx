 // src/Utils/Table.jsx
import React, { useEffect, useRef, useState } from "react";
import "./Table.scss";

/* ---------- Small filled funnel SVG ---------- */
function FilledFunnel({ active = false, size = 14 }) {
  const fill = active ? "#2563eb" : "#9ca3af";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <path
        d="M3 5.5C3 4.6716 3.6716 4 4.5 4H19.5C20.3284 4 21 4.6716 21 5.5C21 5.9886 20.7548 6.4439 20.3466 6.7399L13 11.9V16.5C13 16.7761 12.7761 17 12.5 17H11.5C11.2239 17 11 16.7761 11 16.5V11.9L3.6534 6.7399C3.2452 6.4439 3 5.9886 3 5.5Z"
        fill={fill}
        stroke={fill}
        strokeWidth="0.4"
      />
    </svg>
  );
}

/* ---------- Pagination component ---------- (unchanged) */
function Pagination({ page, setPage, totalPages = 0 }) {
  if (!totalPages || totalPages <= 1) return null;

  const createPages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const arr = [1];
    if (page > 3) arr.push("...");
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    for (let i = start; i <= end; i++) arr.push(i);
    if (page < totalPages - 2) arr.push("...");
    arr.push(totalPages);
    return arr;
  };

  const pages = createPages();

  const baseStyle = {
    border: "1px solid #e8eef6",
    background: "#fff",
    color: "#1f2937",
    borderRadius: 8,
    padding: "6px 10px",
    minWidth: 34,
    height: 34,
    fontSize: 13,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const activeStyle = {
    ...baseStyle,
    background: "#f0f4ff",
    border: "1px solid #6b46c1",
    color: "#6b46c1",
    fontWeight: 700,
  };

  const disabledStyle = {
    ...baseStyle,
    color: "#9ca3af",
    background: "#fafbfd",
    cursor: "not-allowed",
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "8px 12px",
        borderTop: "1px solid #f1f5f9",
        marginTop: 8,
        flexWrap: "wrap",
      }}
    >
      <button
        onClick={() => setPage(Math.max(1, page - 1))}
        disabled={page === 1}
        style={page === 1 ? disabledStyle : baseStyle}
        aria-label="Previous"
      >
        ‹
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={String(p) + i} style={{ padding: "6px 10px", color: "#9ca3af" }}>
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => setPage(p)}
            style={p === page ? activeStyle : baseStyle}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => setPage(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        style={page === totalPages ? disabledStyle : baseStyle}
        aria-label="Next"
      >
        ›
      </button>

      <div style={{ marginLeft: 8, color: "#4b5563", fontSize: 13 }}>
        Page <strong style={{ margin: "0 6px" }}>{page}</strong> of {totalPages}
      </div>
    </div>
  );
}

/* ---------- inject CSS helpers once ---------- */
function injectHelpers() {
  if (document.getElementById("tutils-styles")) return;
  const css = `
    .tutils-td { padding: 6px 10px !important; font-size: 13px; vertical-align: middle; }
    .tutils-th { padding: 8px 12px !important; font-size: 13px; vertical-align: middle; }
    .tutils-options-scroll { max-height: 160px; overflow-y: auto; padding-right: 6px; }
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

/* ---------- detect numeric-ish values ---------- */
function isNumericLike(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === "number") return true;
  const s = String(value).trim();
  if (s === "") return false;
  return /^[\d\.,\-\s₹]+$/.test(s) && !/[a-zA-Z]/.test(s);
}

/* ---------- Main Table component ---------- */
export default function Table({
  data = [],
  columns = [],
  paginatedData = [],
  filters = {},
  setFilters,
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

  // keys treated as price
  const priceKeys = new Set([
    "AmountWithUnit",
    "Price",
    "DisplayAmount",
    "Amount",
    "DisplayPrice",
    "DisplayPriceRange",
  ]);

  // use totalCount when parent handles pagination, else fallback to data.length
  const computedTotal = totalCount || (data && data.length) || paginatedData.length || 0;
  const totalPages = rowsPerPage > 0 ? Math.max(1, Math.ceil(computedTotal / rowsPerPage)) : 1;
  const startIndex = Math.max(0, (Number(page) - 1) * Number(rowsPerPage));

  // close dropdown when click outside
  useEffect(() => {
    function onDoc(e) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target) && openFilter) {
        // when clicking outside, cancel the open filter's temp changes
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

  // lock body scroll when filter open (keeps dropdown visible)
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

  // IMPORTANT: use 'data' (parent filtered dataset) as the source for unique values when present.
  const resolveUnique = (colKey) => {
    if (typeof uniqueValues === "function") {
      const out = uniqueValues(colKey);
      if (Array.isArray(out) && out.length) return out;
    }

    const source = Array.isArray(data) && data.length ? data : (paginatedData || []);
    const list = source.map((r) => (r ? r[colKey] : undefined)).filter((v) => v !== undefined && v !== null && String(v).trim() !== "");
    const uniq = Array.from(new Set(list));

    const numeric = uniq.every((u) => !isNaN(Number(String(u).toString().replace(/[,₹\sCrcr]/g, ""))));
    if (numeric) {
      return uniq
        .map((u) => ({ raw: u, n: Number(String(u).toString().replace(/[,₹\sCrcr]/g, "")) }))
        .sort((a, b) => a.n - b.n)
        .map((x) => x.raw);
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
    setTempFilters((prev) => {
      const copy = { ...prev };
      delete copy[colKey];
      return copy;
    });
    toggleFilter(null);
    setSearchTerm("");
    setDropdownPos(null);
  };

  const applyFor = (colKey) => {
    const final = tempFilters[colKey] !== undefined ? tempFilters[colKey] : (Array.isArray(filters[colKey]) ? filters[colKey] : []);

    if (typeof setFilters === "function") {
      const copy = { ...filters };
      if (!final || (Array.isArray(final) && final.length === 0)) {
        delete copy[colKey];
      } else {
        copy[colKey] = Array.isArray(final) ? final : [final];
      }
      setFilters(copy);
    } else {
      const existing = Array.isArray(filters[colKey]) ? filters[colKey] : [];
      final.forEach((v) => {
        if (!existing.includes(v)) handleCheckboxChange(colKey, v);
      });
      existing.forEach((v) => {
        if (!final.includes(v)) handleCheckboxChange(colKey, v);
      });
      if (typeof applyFilter === "function") applyFilter();
    }

    // FIX: use colKey when clearing temp.
    setTempFilters((prev) => {
      const copy = { ...prev };
      delete copy[colKey];
      return copy;
    });
    toggleFilter(null);
    setSearchTerm("");
    setDropdownPos(null);
  };

  const clearAllParent = (colKey) => {
    if (typeof setFilters === "function") {
      const copy = { ...filters };
      delete copy[colKey];
      setFilters(copy);
    } else {
      if (typeof clearFilter === "function") {
        clearFilter(colKey);
      } else {
        (filters[colKey] || []).slice().forEach((v) => handleCheckboxChange(colKey, v));
      }
    }
    setTempFilters((prev) => {
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
    const bottom = openUp ? Math.min(window.innerHeight - 8 - 40, window.innerHeight - r.top + 8) : undefined;
    setDropdownPos({ left, top, bottom, width: dropdownWidth, openUp });
  };

  /* ---------- single render cell helper ---------- */
  function renderCellContent(col, row, rIdx) {
    if (typeof col.render === "function") {
      const res = col.render(row[col.key], row, rIdx);
      if (typeof res === "string" || typeof res === "number") {
        if (priceKeys.has(col.key) || (col.label && String(col.label).toLowerCase().includes("price"))) return rupeeFormat(res);
        return String(res);
      }
      return res;
    }
    const raw = row[col.key];
    if (raw === null || raw === undefined || raw === "") return "-";
    if (priceKeys.has(col.key) || (col.label && String(col.label).toLowerCase().includes("price"))) return rupeeFormat(raw);
    return String(raw);
  }

  /* ---------- UI ---------- */
  return (
    <div ref={containerRef} style={{ background: "#fff", borderRadius: 8, padding: 8, boxShadow: "0 6px 18px rgba(15,23,42,0.04)" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
          tableLayout: "auto", // keep auto, avoid forced truncation
        }}
      >
        <thead>
          <tr style={{ background: "#fafbfd", height: 40 }}>
            {columns.map((col) => {
              const isSerial = ["S_No", "serialNo", "serial"].includes(col.key) || String(col.label || "").toLowerCase().includes("s.no");
              const isAction = col.key === "action" || String(col.label || "").toLowerCase().includes("action");

              // give small consistent width for serial & action columns to prevent layout jump
              const thMinWidth = isSerial || isAction ? 64 : undefined;
              // reserve small space for icon only when not a small column
              const reservedForIcon = isSerial || isAction ? 20 : 28;

              return (
                <th
                  key={col.key}
                  ref={(el) => (thRefs.current[col.key] = el)}
                  className="tutils-th"
                  style={{
                    borderBottom: "1px solid #eef2f6",
                    fontWeight: 600,
                    textAlign: "center", // header centered
                    position: "relative",
                    padding: "8px 8px",
                    whiteSpace: "nowrap",
                    minWidth: thMinWidth,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", flexWrap: "nowrap" }}>
                    <span
                      style={{
                        display: "inline-block",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: isSerial || isAction ? "100%" : `calc(100% - ${reservedForIcon}px)`,
                        flex: "1 1 auto",
                        textAlign: "center",
                        paddingRight: isSerial || isAction ? 0 : 2,
                      }}
                    >
                      {col.label}
                    </span>

                    {col.canFilter !== false && shouldShowFilter(col.label) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (openFilter === col.key) {
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
                            setTimeout(() => computeFixedPos(col.key, 240), 0);
                          }
                        }}
                        style={{
                          background: "transparent",
                          border: "none",
                          padding: 4,          // reduced padding (icon closer)
                          marginLeft: 2,
                          cursor: "pointer",
                          flex: "0 0 auto",
                          alignSelf: "center",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        aria-label={`Filter ${col.label}`}
                      >
                        <FilledFunnel active={isActive(col.key)} size={14} />
                      </button>
                    )}
                  </div>

                  {/* fixed dropdown */}
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
                        <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." style={{ width: "90%", padding: "7px 10px", borderRadius: 6, border: "1px solid #e6eef8", fontSize: 13 }} />
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", padding: "0 8px 6px 8px" }}>
                        <button onClick={() => { const visible = resolveUnique(col.key).filter((v) => String(v).toLowerCase().includes(searchTerm.toLowerCase())); selectAllVisibleTemp(col.key, visible); }} style={{ background: "transparent", border: "none", color: "#2563eb", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>Select All</button>
                        <button onClick={() => clearTempAll(col.key)} style={{ background: "transparent", border: "none", color: "#2563eb", cursor: "pointer", fontSize: 13 }}>Clear All</button>
                      </div>

                      <div className="tutils-options-scroll" style={{ padding: "6px 8px 64px 8px" }}>
                        {resolveUnique(col.key).filter((v) => String(v).toLowerCase().includes(searchTerm.toLowerCase())).map((val, i) => {
                          const checked = tempFor(col.key).includes(val);
                          return (
                            <label key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 6px", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>
                              <input type="checkbox" checked={checked} onChange={() => toggleTempValue(col.key, val)} style={{ width: 16, height: 16, accentColor: "#2563eb" }} />
                              <span className="tutils-ellipsis" style={{ maxWidth: 160 }}>{String(val)}</span>
                            </label>
                          );
                        })}

                        {resolveUnique(col.key).filter((v) => String(v).toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                          <div style={{ padding: 8, color: "#64748b", fontSize: 13 }}>No options</div>
                        )}
                      </div>

                      <div className="tutils-dropdown-footer" style={{ borderTop: "1px solid #eef2f6", padding: 8, background: "#fff" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                          <button onClick={() => cancelFor(col.key)} style={{ padding: "7px 10px", borderRadius: 6, border: "1px solid #e6eef8", background: "#fff", cursor: "pointer", fontSize: 13 }}>Cancel</button>
                          <button onClick={() => applyFor(col.key)} style={{ padding: "7px 12px", borderRadius: 6, border: "none", background: "#2563eb", color: "#fff", cursor: "pointer", fontSize: 13 }}>Apply</button>
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
            <tr><td colSpan={columns.length} className="tutils-td" style={{ textAlign: "center", padding: 18, color: "#64748b" }}>Loading...</td></tr>
          ) : (
            (paginatedData || []).map((row, rIdx) => {
              const globalIndex = startIndex + rIdx;
              return (
                <tr key={rIdx} style={{ height: 40, background: rIdx % 2 === 0 ? "#fff" : "#fbfdff", borderBottom: "1px solid #f1f5f9", cursor: onRowClick ? "pointer" : "default" }} onClick={onRowClick ? () => onRowClick(row) : undefined}>
                  {columns.map((col, cIdx) => {
                    const isSerial = ["S_No", "serialNo", "serial"].includes(col.key) || String(col.label || "").toLowerCase().includes("s.no");
                    const cellValue = isSerial ? globalIndex + 1 : renderCellContent(col, row, rIdx);
                    // Force center alignment everywhere
                    return (
                      <td
                        key={cIdx}
                        className="tutils-td"
                        style={{
                          textAlign: "center",            // BODY centered
                          paddingLeft: 12,
                          paddingRight: 12,
                          verticalAlign: "middle",
                          minWidth: isSerial || col.key === "action" ? 64 : undefined,
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

      {/* Pagination at bottom (driven by computedTotal) */}
      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
    </div>
  );
}

export { Pagination };
