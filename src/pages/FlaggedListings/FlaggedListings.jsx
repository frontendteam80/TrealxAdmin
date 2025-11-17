 import React, { useEffect, useMemo, useRef, useState, useContext } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import BackButton from "../../Utils/Backbutton.jsx";
import Table, { Pagination } from "../../Utils/Table.jsx";
import { Eye } from "lucide-react";
import { useApi } from "../../API/Api.js";

/* -------------------- Toast -------------------- */
const ToastContext = React.createContext(null);
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const push = (msg, type = "info", ttl = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), ttl);
  };
  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div style={{
        position: "fixed",
        right: 16,
        bottom: 16,
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        gap: 8
      }}>
        {toasts.map((t) => (
          <div key={t.id} style={{
            padding: "10px 14px",
            borderRadius: 10,
            minWidth: 200,
            background: t.type === "error" ? "#ffe8e8" : t.type === "success" ? "#e6ffed" : "#fff",
            color: t.type === "error" ? "#8b1111" : t.type === "success" ? "#065f46" : "#111",
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
            fontSize: 14
          }}>{t.msg}</div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
function useToast() {
  return useContext(ToastContext);
}

/* -------------------- Confirm Modal -------------------- */
function ConfirmModal({ open, title, message, onCancel, onConfirm, busy }) {
  if (!open) return null;
  return (
    <div onClick={onCancel} style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.35)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: 380,
        background: "#fff",
        borderRadius: 10,
        padding: 20,
        boxShadow: "0 10px 30px rgba(0,0,0,0.25)"
      }}>
        <h3 style={{ margin: "0 0 10px 0" }}>{title}</h3>
        <p style={{ marginBottom: 16 }}>{message}</p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={onCancel} style={{ padding: "8px 12px", borderRadius: 6 }}>Cancel</button>
          <button onClick={onConfirm} disabled={busy} style={{
            padding: "8px 12px",
            borderRadius: 6,
            background: busy ? "#ccc" : "#111",
            color: "#fff",
            border: "none",
            cursor: busy ? "not-allowed" : "pointer"
          }}>
            {busy ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------- Spinner -------------------- */
const Spinner = () => (
  <div style={{ padding: 40, display: "flex", justifyContent: "center" }}>
    <div style={{
      width: 40,
      height: 40,
      border: "4px solid #eee",
      borderTop: "4px solid #111",
      borderRadius: "50%",
      animation: "spin 1s linear infinite"
    }} />
    <style>{`@keyframes spin { from {transform: rotate(0deg);} to {transform: rotate(360deg);} }`}</style>
  </div>
);

/* -------------------- FlaggedListings Page -------------------- */
export default function FlaggedListingsWrapper() {
  // Wrap page in ToastProvider so page and children can use toasts.
  return (
    <ToastProvider>
      <FlaggedListings />
    </ToastProvider>
  );
}

function FlaggedListings() {
  const { fetchData, postData } = useApi();
  const toast = useToast();

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({});
  const [openFilter, setOpenFilter] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [loading, setLoading] = useState(true);

  // slide panel id
  const [openRowId, setOpenRowId] = useState(null);

  // confirm modal
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMeta, setConfirmMeta] = useState({});
  const [busy, setBusy] = useState(false);

  const panelRef = useRef(null);

  // load initial data
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const res = await fetchData("FlaggedListing"); // server key used elsewhere
        const arr = Array.isArray(res) ? res : res?.data ?? [];
        if (mounted) {
          setData(arr);
          setFilteredData(arr);
        }
      } catch (err) {
        console.error("Failed to fetch flagged listings", err);
        toast.push("Failed to load flagged listings", "error");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, [fetchData, toast]);

  // close slide panel when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (!panelRef.current) return;
      if (openRowId && !panelRef.current.contains(e.target)) {
        setOpenRowId(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openRowId]);

  // filter application
  useEffect(() => {
    let result = [...data];
    Object.keys(filters).forEach((k) => {
      const vals = filters[k];
      if (vals?.length) result = result.filter((r) => vals.includes(r[k]));
    });
    setFilteredData(result);
    setPage(1);
  }, [filters, data]);

  // get unique values for filters:
  // when a column's filter is open, show values from full dataset (so user can see all options),
  // otherwise show values constrained by currently active filters (relevant options only)
  const getUniqueValues = (key) => {
    const source = openFilter === key ? data : filteredData;
    return Array.from(new Set((source || []).map((r) => r[key]).filter(Boolean)));
  };

  const toggleFilter = (key) => setOpenFilter((p) => (p === key ? null : key));
  const handleCheckboxChange = (key, val) =>
    setFilters((p) => {
      const cur = p[key] || [];
      return cur.includes(val) ? { ...p, [key]: cur.filter((x) => x !== val) } : { ...p, [key]: [...cur, val] };
    });
  const clearFilter = (key) => {
    const copy = { ...filters };
    delete copy[key];
    setFilters(copy);
    setOpenFilter(null);
  };

  // prepare confirm modal meta then open modal
  const handleAction = (actionKey, row) => {
    setConfirmMeta({
      actionKey,
      record: row,
      title:
        actionKey === "markSafe" ? "Mark Safe"
          : actionKey === "suspendAgent" ? "Suspend Agent"
          : "Remove Listing",
      message:
        actionKey === "markSafe" ? "Do you want to mark this listing as safe?"
        : actionKey === "suspendAgent" ? "Do you want to suspend this agent?"
        : "Do you want to remove this listing permanently?",
    });
    setConfirmOpen(true);
    // close slide panel after confirming action selection (modal will show)
    setOpenRowId(null);
  };

  // perform action — server-backed; uses postData when available
  const performAction = async (actionKey, record) => {
    setBusy(true);
    const payload = {
      FlagID: record.FlagID,
      PropertyID: record.PropertyID,
      Action: actionKey,
      Actor: "web-ui",
    };

    try {
      if (typeof postData === "function") {
        // postData wrapper expected to call relevant endpoint with action name
        await postData("Flagged/PerformAction", payload);
      } else {
        // fallback: use AKRARealityLTAPI/api/data wrapper
        const url = "https://imsdev.akrais.com:8444/AKRARealityLTAPI/api/data";
        const body = { action: "Flagged/PerformAction", data: JSON.stringify(payload) };
        const headers = { "Content-Type": "application/json", Accept: "application/json" };
        const token = localStorage.getItem("token");
        if (token) headers.Authorization = `Bearer ${token}`;

        const resp = await fetch(url, {
          method: "POST",
          headers,
          credentials: "include",
          body: JSON.stringify(body),
        });

        if (!resp.ok) {
          const txt = await resp.text().catch(() => "");
          let parsed = txt;
          try { parsed = txt ? JSON.parse(txt) : txt; } catch (e) {}
          const serverMsg = parsed && parsed.Errors ? JSON.stringify(parsed.Errors) : (typeof parsed === "string" ? parsed : `Server returned ${resp.status}`);
          throw new Error(serverMsg || `Server returned ${resp.status}`);
        }
      }

      toast.push("Action completed successfully", "success");

      // refresh dataset
      try {
        const refreshed = await fetchData("FlaggedListing");
        const arr = Array.isArray(refreshed) ? refreshed : refreshed?.data ?? [];
        setData(arr);
        setFilteredData(arr);
      } catch (refreshErr) {
        console.warn("Refresh after action failed", refreshErr);
      }
    } catch (err) {
      console.error("performAction failed", err);
      toast.push(String(err.message || "Action failed"), "error");
    } finally {
      setBusy(false);
      setConfirmOpen(false);
    }
  };

  // Table columns
  const columns = [
    {
      label: "S.No",
      key: "serial",
      canFilter: false,
      render: (_, __, i) => (page - 1) * rowsPerPage + (i + 1),
    },
    { label: "Property ID", key: "PropertyID" },
    { label: "Property Name", key: "PropertyName" },
    { label: "Reported By", key: "ReportIssuedBy" },
    { label: "Reason", key: "Reason" },
    { label: "Flag Type", key: "FlagType" },
    {
      label: "Issue Date",
      key: "IssueDate",
      render: (v) => (v ? new Date(v).toLocaleDateString("en-GB") : "-"),
    },
    {
      label: "Action",
      key: "action",
      canFilter: false,
      render: (_, row) => (
        <button
          onClick={(e) => { e.stopPropagation(); setOpenRowId((p) => (String(p) === String(row.FlagID) ? null : row.FlagID)); }}
          style={{ background: "transparent", border: "none", cursor: "pointer", padding: 6 }}
          aria-label={`Actions for ${row.FlagID}`}
        >
          <Eye size={18} />
        </button>
      ),
    },
  ];

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return (filteredData || []).slice(start, start + rowsPerPage);
  }, [filteredData, page]);

  return (
    <div style={{ display: "flex", background: "transparent", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: 20, marginLeft: "180px" }}>
        <div style={{ marginBottom: 10 }}>
          <BackButton onClick={() => window.history.back()} label="Back" />
        </div>

        <h2 style={{ fontSize: "1.1rem", marginBottom: 12, color: "#111" }}>Flagged Listings</h2>

        <div style={{ borderRadius: 10, padding: 0 }}>
          {loading ? (
            <Spinner />
          ) : (
            <div style={{ display: "flex", gap: 12 }}>
              {/* Table area */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <Table
                  columns={columns}
                  paginatedData={paginatedData}
                  filters={filters}
                  openFilter={openFilter}
                  toggleFilter={toggleFilter}
                  handleCheckboxChange={handleCheckboxChange}
                  uniqueValues={getUniqueValues}
                  clearFilter={clearFilter}
                  hasActiveFilter={(k) => Array.isArray(filters[k]) && filters[k].length > 0}
                  page={page}
                  setPage={setPage}
                  rowsPerPage={rowsPerPage}
                  totalCount={filteredData.length}
                  applyFilter={() => setOpenFilter(null)}
                />

                {/* Pagination only on right (no left 'showing' text) */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                  <Pagination page={page} setPage={setPage} totalPages={Math.ceil(filteredData.length / rowsPerPage)} />
                </div>
              </div>

              {/* Slide panel (no overlay). Width toggles open/close. */}
              <aside ref={panelRef} style={{
                width: openRowId ? 320 : 0,
                overflow: "hidden",
                transition: "width 180ms ease",
                borderLeft: openRowId ? "1px solid #eee" : "none",
                boxSizing: "border-box"
              }}>
                {openRowId ? (() => {
                  const row = data.find((r) => String(r.FlagID) === String(openRowId));
                  if (!row) return <div style={{ padding: 12 }}>No details</div>;
                  return (
                    <div style={{ padding: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontWeight: 700 }}>Actions</div>
                        <button onClick={() => setOpenRowId(null)} style={{ background: "transparent", border: "none", cursor: "pointer" }}>✕</button>
                      </div>

                      <div style={{ marginTop: 10 }}>
                        <div style={{ fontWeight: 700 }}>{row.PropertyName}</div>
                        <div style={{ color: "#666", fontSize: 13, marginTop: 6 }}>Flag: {row.FlagType}</div>

                        <div style={{ marginTop: 12 }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <button onClick={() => handleAction("markSafe", row)} style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #e6e6e6", background: "#f7fafc", cursor: "pointer", fontWeight: 700 }}>Mark Safe</button>
                            <button onClick={() => handleAction("suspendAgent", row)} style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #e6e6e6", background: "#fff3cd", cursor: "pointer", fontWeight: 700 }}>Suspend Agent</button>
                            <button onClick={() => handleAction("removeListing", row)} style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #f5c2c2", background: "#ffeaea", cursor: "pointer", fontWeight: 700, color: "#b91c1c" }}>Remove Listing</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })() : null}
              </aside>
            </div>
          )}
        </div>

        <ConfirmModal
          open={confirmOpen}
          title={confirmMeta.title}
          message={confirmMeta.message}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={() => performAction(confirmMeta.actionKey, confirmMeta.record)}
          busy={busy}
        />
      </main>
    </div>
  );
}
