 // src/pages/ExpiredListings/ExpiredListings.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import BackButton from "../../Utils/Backbutton.jsx";
import SearchBar from "../../Utils/SearchBar.jsx";
import Table, { Pagination } from "../../Utils/Table.jsx";
import { Eye, X, Bell, RefreshCcw, Trash2 } from "lucide-react";
import { useApi } from "../../API/Api.js";

/* ---------------- Spinner ---------------- */
const Spinner = () => (
  <div style={{ padding: 30, display: "flex", justifyContent: "center" }}>
    <div
      style={{
        width: 36,
        height: 36,
        border: "4px solid #eee",
        borderTop: "4px solid #111",
        borderRadius: "50%",
        animation: "spin 0.9s linear infinite"
      }}
    />
    <style>{`@keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }`}</style>
  </div>
);

/* ---------------- Main Component ---------------- */
export default function ExpiredListings() {
  const { fetchData, postData } = useApi();

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({}); // parent filter state
  const [openFilter, setOpenFilter] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const [openRowId, setOpenRowId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMeta, setConfirmMeta] = useState({});
  const [busy, setBusy] = useState(false);

  const containerRef = useRef(null);

  /* Load Data */
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetchData("ExpiredProperty_Details");
        const arr = Array.isArray(res) ? res : res?.data ?? [];
        if (mounted) {
          setData(arr);
          setFilteredData(arr);
          setPage(1);
        }
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, [fetchData]);

  /* Filter + Search + Column Filters */
  useEffect(() => {
    let result = [...data];

    // Apply column filters (filters object may contain keys with arrays of values)
    if (filters && Object.keys(filters).length) {
      result = result.filter((row) => {
        return Object.entries(filters).every(([key, val]) => {
          // ignore empty filters
          if (val === null || val === undefined || (Array.isArray(val) && val.length === 0) || val === "") {
            return true;
          }
          const cell = row[key];
          if (cell === null || cell === undefined) return false;

          // if parent stores an array of allowed values
          if (Array.isArray(val)) {
            const cellStr = String(cell).toLowerCase();
            return val.some(v => String(v).toLowerCase() === cellStr);
          }

          // boolean/number exact compare
          if (typeof val === "boolean" || typeof val === "number") {
            return cell === val;
          }

          // string: exact or substring match (case-insensitive)
          const filterStr = String(val).toLowerCase();
          const cellStr = String(cell).toLowerCase();
          return cellStr === filterStr || cellStr.includes(filterStr);
        });
      });
    }

    // Apply text search
    if (searchValue && searchValue.trim()) {
      const q = searchValue.toLowerCase();
      result = result.filter(r =>
        (r.Propertyid && String(r.Propertyid).toLowerCase().includes(q)) ||
        (r.PropertyName && String(r.PropertyName).toLowerCase().includes(q)) ||
        (r.PropertyCity && String(r.PropertyCity).toLowerCase().includes(q))
      );
    }

    setFilteredData(result);
    setPage(1);
  }, [data, searchValue, filters]);

  // unique values for filter dropdowns should come from raw `data` (not filteredData)
  const uniqueValues = (key) =>
    Array.from(new Set((data || []).map(d => d[key]).filter(Boolean)));

  const toggleFilter = (key) => setOpenFilter((prev) => (prev === key ? null : key));

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredData.slice(start, end).map((r, i) => ({
      ...r,
      serialNo: start + i + 1
    }));
  }, [filteredData, page]);

  /* ---------- ACTION HANDLERS ---------- */

  // when user clicks Notify/Renew/Delete in the action popup
  const handleAction = (e, actionKey, row) => {
    if (e && typeof e.stopPropagation === "function") e.stopPropagation();

    setConfirmMeta({
      actionKey,
      record: row,
      title:
        actionKey === "notify"
          ? "Notify Agent"
          : actionKey === "renew"
          ? "Renew Listing"
          : "Delete Listing",
      message:
        actionKey === "delete"
          ? `Are you sure you want to permanently delete ${row.PropertyName}?`
          : `Are you sure you want to ${actionKey} this listing?`,
    });
    setConfirmOpen(true);
    // close the action popup
    setOpenRowId(null);
  };

  // Called when user confirms the action in the confirm dialog
  const performAction = async () => {
    if (!confirmMeta || !confirmMeta.actionKey || !confirmMeta.record) {
      setConfirmOpen(false);
      return;
    }

    setBusy(true);
    try {
      const { actionKey, record } = confirmMeta;
      // adapt API routes/payload according to your backend
      let apiRoute = "";
      let payload = { Propertyid: record.Propertyid, ...((record && record.PropertyName) ? { PropertyName: record.PropertyName } : {}) };

      if (actionKey === "notify") {
        apiRoute = "Notify_Agent";
      } else if (actionKey === "renew") {
        apiRoute = "Renew_Listing";
      } else if (actionKey === "delete") {
        apiRoute = "Delete_Property";
      } else {
        apiRoute = "ExpiredProperty_Action";
      }

      if (typeof postData === "function") {
        await postData(apiRoute, payload);
      }

      // Refresh data after action
      const refreshed = await fetchData("ExpiredProperty_Details");
      const arr = Array.isArray(refreshed) ? refreshed : refreshed?.data ?? [];
      setData(arr);
      setFilteredData(arr);
      setPage(1);

      setConfirmOpen(false);
      setConfirmMeta({});
    } catch (err) {
      console.error("performAction failed", err);
      // optionally show toast / error UI
    } finally {
      setBusy(false);
    }
  };

  /* Close popup when clicking outside action popup */
  useEffect(() => {
    function handleOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpenRowId(null);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  /* ---------- Columns ---------- */
  const actionStyle = {
    width: "100%",
    textAlign: "left",
    padding: "8px 12px",
    background: "none",
    border: "none",
    borderBottom: "1px solid #f4f4f4",
    fontSize: 13,
    cursor: "pointer",
    display: "flex",
    alignItems: "center"
  };

  const columns = [
    { label: "S.No", key: "serialNo" },
    { label: "Property ID", key: "Propertyid" },
    { label: "Property Name", key: "PropertyName" },
    { label: "Address", key: "PropertyAddress1" },
    { label: "Zip", key: "propertyZipCode" },
    { label: "City", key: "PropertyCity" },
    { label: "Status", key: "PropertyStatus" },
    {
      label: "Expired",
      key: "ExpiredDate",
      render: (v) => (v ? new Date(v).toLocaleDateString("en-GB") : "-")
    },
    {
      label: "Action",
      key: "action",
      canFilter: false, // explicitly non-filterable
      render: (_, row) => {
        const isOpen = openRowId === row.Propertyid;
        return (
          <div style={{ position: "relative" }} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenRowId((prev) => (prev === row.Propertyid ? null : row.Propertyid));
              }}
              style={{ background: "none", border: "none", cursor: "pointer" }}
              aria-label="Open actions"
            >
              <Eye size={18} />
            </button>

            {isOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: 28,
                  zIndex: 50,
                  background: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  width: 190,
                  boxShadow: "0 6px 20px rgba(0,0,0,0.12)"
                }}
                onClick={(e) => e.stopPropagation()}
                ref={containerRef}
              >
                <div style={{ textAlign: "right", padding: "4px 6px" }}>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setOpenRowId(null); }}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer"
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleAction(e, "notify", row)}
                  style={actionStyle}
                >
                  <Bell size={15} style={{ marginRight: 6 }} /> Notify Agent
                </button>

                <button
                  type="button"
                  onClick={(e) => handleAction(e, "renew", row)}
                  style={actionStyle}
                >
                  <RefreshCcw size={15} style={{ marginRight: 6 }} /> Renew
                </button>

                <button
                  type="button"
                  onClick={(e) => handleAction(e, "delete", row)}
                  style={{ ...actionStyle, color: "#d30000" }}
                >
                  <Trash2 size={15} style={{ marginRight: 6 }} /> Delete
                </button>
              </div>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <div style={{ display: "flex", background: "#f8fafc", minHeight: "100vh" }}>
      <Sidebar />

      <main
        style={{
          flex: 1,
          padding: 20,
          marginLeft: "180px",
          overflow: "auto",
        }}
      >
        {/* hide visible scrollbar visually (content can still scroll) */}
        <style>{`
          main::-webkit-scrollbar { width: 0; height: 0; }
          main { scrollbar-width: none; -ms-overflow-style: none; }
        `}</style>

        <BackButton label="Back" onClick={() => window.history.back()} />

        {/* Heading + Search: title left, search right */}
        <div style={{ marginTop: 12, marginBottom: 12 }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12
          }}>
            <div>
              <h2 style={{ margin: 0 }}>Expired Listings</h2>
              <div style={{ color: "#666", fontSize: 13, marginTop: 6 }}></div>
            </div>

            <div style={{ minWidth: 280, maxWidth: 420 }}>
              <SearchBar
                value={searchValue}
                onChange={setSearchValue}
                placeholder="Search by ID, name or city..."
              />
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div style={{ overflow: "visible" }}>
          {loading ? (
            <Spinner />
          ) : (
            <>
              <Table
                columns={columns}
                paginatedData={paginatedData}
                data={filteredData}
                filters={filters}
                setFilters={setFilters} // important: allow Table to set filters directly
                openFilter={openFilter}
                toggleFilter={toggleFilter}
                uniqueValues={uniqueValues}
                page={page}
                setPage={setPage}
                rowsPerPage={rowsPerPage}
                totalCount={filteredData.length}
              />

              {/* If you use the exported Pagination, it's already in Table.jsx */}
            </>
          )}
        </div>

        {/* Confirm modal: call performAction when user confirms.
            NOTE: keep your modal implementation — just ensure confirmOpen/confirmMeta map to it and Confirm calls performAction().
            Example quick inline confirm (replace with your modal if present): */}
        {confirmOpen && (
          <div
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.35)",
              zIndex: 11000
            }}
            onClick={() => setConfirmOpen(false)}
          >
            <div style={{ width: 420, background: "#fff", borderRadius: 8, padding: 18 }} onClick={(e) => e.stopPropagation()}>
              <h3 style={{ marginTop: 0 }}>{confirmMeta.title}</h3>
              <div style={{ color: "#374151", marginBottom: 16 }}>{confirmMeta.message}</div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button type="button" onClick={() => setConfirmOpen(false)} style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #e6eef8", background: "#fff" }}>
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={performAction}
                  disabled={busy}
                  style={{ padding: "8px 12px", borderRadius: 6, border: "none", background: "#2563eb", color: "#fff" }}
                >
                  {busy ? "Processing..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* END OF FILE */
