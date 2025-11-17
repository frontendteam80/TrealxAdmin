 // src/pages/Leads/LeadsManagement.jsx
import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import BackButton from "../../Utils/Backbutton.jsx";
import Table, { Pagination } from "../../Utils/Table.jsx";
import SearchBar from "../../Utils/SearchBar.jsx";
import { Eye } from "lucide-react";
import { useApi } from "../../API/Api.js";

function Spinner() {
  return (
    <div style={{ padding: 24, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          width: 36,
          height: 36,
          border: "4px solid #e6e6e6",
          borderTop: "4px solid #111",
          borderRadius: "50%",
          animation: "spin 0.85s linear infinite",
        }}
      />
      <style>{`@keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }`}</style>
    </div>
  );
}

export default function LeadsManagement() {
  const { fetchData, postData } = useApi();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [openFilter, setOpenFilter] = useState(null);

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [searchValue, setSearchValue] = useState("");

  // slide panel
  const [selectedLead, setSelectedLead] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  // small style block:
  // - hide visible scrollbars (keeps scrolling)
  // - remove table wrapper background and box-shadow
  // - ensure table container doesn't create its own scroll
  const localStyles = `
    /* remove visible scrollbars (still scrollable) */
    html, body, #root { scrollbar-width: none; -ms-overflow-style: none; }
    html::-webkit-scrollbar, body::-webkit-scrollbar, .no-scrollbar::-webkit-scrollbar { display: none; }
    /* helper class to remove backgrounds around table wrapper */
    .table-transparent { background: transparent !important; box-shadow: none !important; }
    /* ensure our main area doesn't show internal scrollbars */
    .leads-main { overflow-y: auto; -webkit-overflow-scrolling: touch; }
    .leads-table-area { overflow: visible !important; }
    /* make slide panel fixed width and not affect layout */
    .leads-panel { transition: width 220ms ease; overflow: hidden; }
  `;

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetchData("LeadData");
        const arr = Array.isArray(res) ? res : res?.data ?? [];
        if (!mounted) return;
        setData(arr);
        setFilteredData(arr);
      } catch (err) {
        console.error("Leads fetch failed:", err);
        if (mounted) {
          setData([]);
          setFilteredData([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, [fetchData]);

  // apply filters + search
  useEffect(() => {
    let result = Array.isArray(data) ? [...data] : [];
    Object.keys(filters).forEach((k) => {
      const vals = filters[k];
      if (Array.isArray(vals) && vals.length > 0) {
        result = result.filter((r) => vals.includes(r[k]));
      }
    });

    if (searchValue && searchValue.trim()) {
      const q = searchValue.trim().toLowerCase();
      result = result.filter((row) =>
        ["LeadID", "LeadName", "PropertyID", "LeadSource", "status", "LeadStage", "Notes"]
          .some((k) => row[k] && String(row[k]).toLowerCase().includes(q))
      );
    }

    setFilteredData(result);
    setPage(1);
  }, [data, filters, searchValue]);

  const uniqueValues = (key) => Array.from(new Set(filteredData.map((r) => r[key]).filter(Boolean)));

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

  const STATUS_FLOW = ["New", "Contacted", "SiteVisited", "Converted", "Lost"];
  const canMoveTo = (fromStatus) => {
    if (!fromStatus) return ["New"];
    if (fromStatus === "New") return ["Contacted"];
    if (fromStatus === "Contacted") return ["SiteVisited"];
    if (fromStatus === "SiteVisited") return ["Converted", "Lost"];
    return [];
  };

  const columns = [
    {
      label: "S.No",
      key: "sno",
      canFilter: false,
      render: (_, __, idx) => (page - 1) * rowsPerPage + (idx + 1),
    },
    { label: "Lead ID", key: "LeadID" },
    { label: "Lead Name", key: "LeadName" },
    { label: "Property ID", key: "PropertyID" },
    {
      label: "Lead Date",
      key: "LeadDate",
      render: (v) => (v ? new Date(v).toLocaleDateString("en-GB") : "-"),
    },
    { label: "Source", key: "LeadSource" },
    {
      label: "Visit Scheduled",
      key: "VisitScheduled",
      render: (v) => (v ? new Date(v).toLocaleDateString("en-GB") : "-"),
    },
    { label: "Stage", key: "LeadStage" },
    {
      label: "Action",
      key: "action",
      canFilter: false,
      render: (_, row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedLead(row);
            setPanelOpen(true);
          }}
          aria-label="View notes"
          title="View notes"
          style={{ background: "transparent", border: "none", cursor: "pointer", padding: 6 }}
        >
          <Eye size={18} />
        </button>
      ),
    },
  ];

  // Provide paginatedData to control pagination ourselves.
  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page]);

  // update lead status (attempt server save, fallback local)
  const updateLeadStatus = async (lead, newStatus) => {
    if (!lead) return;
    setBusy(true);
    const wrapped = { action: "Lead/UpdateStatus", data: JSON.stringify({ LeadID: lead.LeadID, NewStatus: newStatus }) };

    try {
      // Try using postData if provided by your API helper
      if (typeof postData === "function") {
        // some useApi implementations expect (route,payload) - adjust if yours differs
        await postData("Lead/UpdateStatus", wrapped);
      } else {
        const url = "https://imsdev.akrais.com:8444/AKRARealityLTAPI/api/data";
        const headers = { "Content-Type": "application/json", Accept: "application/json" };
        const token = typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;
        if (token) headers.Authorization = `Bearer ${token}`;
        const resp = await fetch(url, {
          method: "POST",
          headers,
          credentials: "include",
          body: JSON.stringify(wrapped),
        });
        if (!resp.ok) {
          const text = await resp.text();
          throw new Error(`Server returned ${resp.status}: ${text || "(empty)"}`);
        }
      }

      // refresh; if refresh fails then update local copy
      try {
        const refreshed = await fetchData("LeadData");
        const arr = Array.isArray(refreshed) ? refreshed : refreshed?.data ?? [];
        setData(arr);
      } catch {
        setData((prev) => prev.map((p) => (p.LeadID === lead.LeadID ? { ...p, status: newStatus, LeadStage: newStatus } : p)));
      }

      setSelectedLead((s) => (s && s.LeadID === lead.LeadID ? { ...s, status: newStatus, LeadStage: newStatus } : s));
      alert("Status updated");
    } catch (err) {
      console.error("Status update failed:", err);
      alert("Failed to update status — check console");
    } finally {
      setBusy(false);
    }
  };

  const closePanel = () => {
    setPanelOpen(false);
    setSelectedLead(null);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <style>{localStyles}</style>

      <Sidebar />

      <main className="leads-main" style={{ flex: 1, padding: 20, marginLeft: "180px" }}>
        <div style={{ marginBottom: 12 }}>
          <BackButton onClick={() => window.history.back()} label="Back" />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <h2 style={{ margin: 0, fontSize: "1.05rem" }}>Leads Management</h2>
          <div style={{ width: 340, minWidth: 220 }}>
            <SearchBar value={searchValue} onChange={setSearchValue} onSubmit={() => setPage(1)} pageLabel="Leads" />
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div className="leads-table-area table-transparent" style={{ minHeight: 120 }}>
              {loading ? (
                <Spinner />
              ) : (
                <>
                  {/* IMPORTANT: do NOT pass page/setPage to Table => prevents Table from rendering its own pagination */}
                  <div className="leads-table-holder table-transparent">
                    <Table
                      columns={columns}
                      paginatedData={paginatedData}
                      filters={filters}
                      openFilter={openFilter}
                      toggleFilter={toggleFilter}
                      handleCheckboxChange={handleCheckboxChange}
                      uniqueValues={uniqueValues}
                      clearFilter={clearFilter}
                      hasActiveFilter={(k) => Array.isArray(filters[k]) && filters[k].length > 0}
                      // do NOT forward page,setPage,rowsPerPage,totalCount to avoid internal pagination
                      // page={page} setPage={setPage} rowsPerPage={rowsPerPage} totalCount={filteredData.length}
                    />
                  </div>

                  {/* single external pagination */}
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Pagination page={page} setPage={setPage} totalPages={Math.max(1, Math.ceil(filteredData.length / rowsPerPage))} />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* right slide panel (fixed width; no overlay) */}
          <aside className="leads-panel" style={{
            width: panelOpen ? 420 : 0,
            transition: "width 220ms ease",
            overflow: "hidden",
            boxSizing: "border-box",
            background: "#fff",
            borderRadius: panelOpen ? 8 : 0,
            boxShadow: panelOpen ? "-6px 0 20px rgba(0,0,0,0.06)" : "none",
          }}>
            {panelOpen && selectedLead && (
              <div style={{ height: "100%", display: "flex", flexDirection: "column", padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div>
                    <strong style={{ fontSize: 16 }}>{selectedLead.LeadName || "Lead details"}</strong>
                    <div style={{ fontSize: 12, color: "#666" }}>{`Lead ID: ${selectedLead.LeadID || "-"}`}</div>
                  </div>
                  <div>
                    <button onClick={closePanel} style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: 18 }} aria-label="Close panel" title="Close">×</button>
                  </div>
                </div>

                <div style={{ flex: 1, paddingRight: 6 }}>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>Notes</div>
                    <div style={{ whiteSpace: "pre-wrap", color: "#111" }}>{selectedLead.Notes || "-"}</div>
                  </div>

                  <div style={{ marginTop: 8 }}>
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>Status</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {STATUS_FLOW.map((s) => {
                        const isCurrent = (selectedLead.status === s) || (selectedLead.LeadStage === s);
                        return (
                          <div key={s} style={{
                              padding: "6px 10px",
                              borderRadius: 8,
                              border: isCurrent ? "1px solid #111" : "1px solid #e6e6e6",
                              background: isCurrent ? "#111" : "#fff",
                              color: isCurrent ? "#fff" : "#111",
                              fontSize: 13,
                              fontWeight: isCurrent ? 700 : 500,
                          }}>{s}</div>
                        );
                      })}
                    </div>

                    <div style={{ marginTop: 12 }}>
                      <div style={{ fontSize: 13, marginBottom: 8, color: "#444" }}>Move status to:</div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {canMoveTo(selectedLead.status || selectedLead.LeadStage).map((target) => (
                          <button key={target} onClick={() => updateLeadStatus(selectedLead, target)} disabled={busy}
                            style={{
                              padding: "8px 12px",
                              borderRadius: 8,
                              border: "1px solid rgba(0,0,0,0.08)",
                              background: busy ? "#e5e7eb" : "#111",
                              color: "#fff",
                              cursor: busy ? "not-allowed" : "pointer",
                              fontWeight: 600,
                            }}>
                            {busy ? "Working..." : `Set ${target}`}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: 18, fontSize: 13, color: "#444" }}>
                    <div><strong>Source:</strong> {selectedLead.LeadSource ?? "-"}</div>
                    <div><strong>Visit Scheduled:</strong> {selectedLead.VisitScheduled ? new Date(selectedLead.VisitScheduled).toLocaleDateString("en-GB") : "-"}</div>
                    <div><strong>Visit Status:</strong> {selectedLead.VisitStatus ?? "-"}</div>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
