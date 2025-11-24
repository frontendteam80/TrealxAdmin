 // src/pages/AgentDetails/AgentDetails.jsx
import React, { useEffect, useState, useMemo, useRef } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import { useApi } from "../../API/Api.js";
import { useNavigate } from "react-router-dom";
import DataTable, { Pagination } from "../../Utils/Table.jsx";
import SearchBar from "../../Utils/SearchBar.jsx";
import { Eye } from "lucide-react";

/**
 * AgentDetails (fixed)
 *
 * Changes made:
 * - Removed the "Buyers / Sellers" tab from the UI (keeps everything else intact).
 * - Kept the pagination / filter fixes from previous iteration.
 * - Drop-in replacement for your previous AgentDetails.jsx
 */

export default function AgentDetails() {
  const { fetchData } = useApi();
  const navigate = useNavigate();

  const [raw, setRaw] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // activeTab options: agents | builders | profs
  const [activeTab, setActiveTab] = useState("agents");
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({});
  const [openFilter, setOpenFilter] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const [selected, setSelected] = useState(null);
  const [detailTab, setDetailTab] = useState("profile");
  const panelRef = useRef(null);
  const filterRef = useRef(null);

  // stable ref for fetchData to avoid effect re-trigger when fetchData identity changes
  const fetchDataRef = useRef(fetchData);
  useEffect(() => {
    fetchDataRef.current = fetchData;
  }, [fetchData]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const resp = await fetchDataRef.current("CRMData");
        const arr = Array.isArray(resp) ? resp : resp?.data ?? [];
        if (!cancelled) setRaw(Array.isArray(arr) ? arr : []);
      } catch (err) {
        if (!cancelled) setError(err?.message || "Failed to load CRMData");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => (cancelled = true);
  }, []); // run once on mount

  const v = (obj, ...keys) => {
    for (const k of keys) {
      if (!obj) break;
      if (Object.prototype.hasOwnProperty.call(obj, k) && obj[k] !== undefined && obj[k] !== null) return obj[k];
      const lower = k.toLowerCase();
      for (const kk of Object.keys(obj || {})) if (kk.toLowerCase() === lower) return obj[kk];
    }
    return undefined;
  };

  function detectType(item) {
    const role = String(v(item, "Role", "role", "type", "contactType", "Category", "category") || "").toLowerCase();
    if (role.includes("agent")) return "agent";
    if (role.includes("builder")) return "builder";
    if (role.includes("buyer") || role.includes("seller") || role.includes("client") || role.includes("customer")) return "buyer";
    if (role.includes("loan") || role.includes("law") || role.includes("ca") || role.includes("document") || role.includes("notary")) return "pro";
    if (Number(v(item, "ListingsCount", "listings_count", "total_listings", "Listings") || 0) > 0) return "agent";
    if (Number(v(item, "ProjectCount", "ProjectCount") || 0) > 0) return "builder";
    return "buyer";
  }

  const mapped = useMemo(() => {
    return (raw || []).map((it, idx) => {
      const type = detectType(it);
      return {
        id: v(it, "id", "contact_id", "AgentID") ?? `C-${idx + 1}`,
        S_No: idx + 1,
        Name: String(v(it, "Name", "name", "fullName") || "").trim(),
        Phone: String(v(it, "MobileNumber", "mobile", "phone", "contactNumber") || ""),
        Email: String(v(it, "EMail", "email") || ""),
        City: String(v(it, "Locality", "city") || ""),
        KYCStatus: v(it, "KYCStatus", "kyc_status", "KYC") || "Pending",
        Listings: Number(v(it, "ListingsCount", "listings_count", "total_listings") || 0),
        Rating: v(it, "Rating", "rating") ?? null,
        Projects: Number(v(it, "ProjectCount", "ProjectCount") || 0),
        ProjectsApproved: Number(v(it, "ApprovedProjects", "approved_projects") || 0),
        ProjectsUnderConstruction: Number(v(it, "UnderConstruction", "under_construction") || 0),
        Preference: v(it, "Preference", "preference") || "",
        Budget: v(it, "Budget", "budget") || "",
        Profession: v(it, "Role", "profession") || "",
        LicenseID: v(it, "LicenseID", "license_id") || "",
        ActiveDeals: Number(v(it, "ActiveDeals", "active_deals") || 0),
        NextFollowUp: v(it, "NextFollowUp", "next_follow_up", "FollowUpDate", "followUpDate") || v(it, "FollowUpDate"),
        LastContacted: v(it, "LastContacted", "last_contacted", "lastContact") || null,
        __raw: it,
        contactType: type,
      };
    });
  }, [raw]);

  const agents = mapped.filter((r) => r.contactType === "agent");
  const builders = mapped.filter((r) => r.contactType === "builder");
  const profs = mapped.filter((r) => r.contactType === "pro");

  const dataForTab = useMemo(() => {
    if (activeTab === "agents") return agents;
    if (activeTab === "builders") return builders;
    if (activeTab === "profs") return profs;
    return [];
  }, [activeTab, agents, builders, profs]);

  // filters + search: compute filtered list (DO NOT reset page here)
  const [filtered, setFiltered] = useState([]);
  useEffect(() => {
    let list = Array.isArray(dataForTab) ? [...dataForTab] : [];
    Object.keys(filters).forEach((k) => {
      const sel = filters[k];
      if (Array.isArray(sel) && sel.length) list = list.filter((r) => sel.includes(String(r[k] ?? "")));
    });
    if (searchValue && searchValue.trim()) {
      const q = searchValue.trim().toLowerCase();
      list = list.filter((r) => {
        return (
          (r.Name || "").toLowerCase().includes(q) ||
          (r.Phone || "").toLowerCase().includes(q) ||
          (r.Email || "").toLowerCase().includes(q) ||
          (r.City || "").toLowerCase().includes(q) ||
          (String(r.Listings || "") + String(r.Projects || "") + String(r.Preference || "") + String(r.Profession || "")).toLowerCase().includes(q)
        );
      });
    }
    setFiltered(list);
    // IMPORTANT: do not call setPage(1) here because it interferes with user pagination clicks.
    // We will reset page in a dedicated effect below when inputs that should reset pagination change.
  }, [dataForTab, filters, searchValue, activeTab]);

  // Reset page to 1 only when inputs that should reset pagination change.
  useEffect(() => {
    // Reset page when switching tabs, changing search, changing filters, OR when dataset size changes.
    setPage(1);
    // close any open column filter dropdown when switching major inputs
    setOpenFilter(null);
  }, [activeTab, searchValue, JSON.stringify(filters), dataForTab.length]);

  const paginated = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page]);

  // action menu state (which row id is open)
  const [openActionFor, setOpenActionFor] = useState(null);
  const actionMenuRef = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (!actionMenuRef.current) return;
      if (!actionMenuRef.current.contains(e.target)) setOpenActionFor(null);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // action implementations (stubs)
  function handleAction(actionType, row) {
    setOpenActionFor(null);
    if (!row) return;
    switch (actionType) {
      case "approve":
        alert(`Approved ${row.Name || row.id}`);
        setRaw((r) => r.map((x) => (String(v(x, "id", "contact_id", "AgentID")) === String(row.id) ? { ...x, Approved: true } : x)));
        break;
      case "suspend":
        alert(`Suspended ${row.Name || row.id}`);
        setRaw((r) => r.map((x) => (String(v(x, "id", "contact_id", "AgentID")) === String(row.id) ? { ...x, Suspended: true } : x)));
        break;
      case "assignArea": {
        const area = window.prompt("Enter area to assign:");
        if (area) alert(`Assigned area "${area}" to ${row.Name || row.id}`);
        break;
      }
      case "sendAlert": {
        const msg = window.prompt("Enter message to send:");
        if (msg) alert(`Sent alert to ${row.Name || row.id}: ${msg}`);
        break;
      }
      case "approveBuilder":
        alert(`Builder approved: ${row.Name || row.id}`);
        break;
      case "assignManager": {
        const m = window.prompt("Manager ID:");
        if (m) alert(`Assigned manager ${m} to ${row.Name || row.id}`);
        break;
      }
      case "markPremium":
        alert(`Marked premium: ${row.Name || row.id}`);
        break;
      case "assignAgent": {
        const aid = window.prompt("Agent ID to assign:");
        if (aid) alert(`Assigned agent ${aid} to ${row.Name || row.id}`);
        break;
      }
      case "sendOffers": {
        const text = window.prompt("Offer message:");
        if (text) alert(`Sent offers to ${row.Name || row.id}`);
        break;
      }
      case "assignToDeal": {
        const did = window.prompt("Deal ID:");
        if (did) alert(`Assigned ${row.Name || row.id} to Deal ${did}`);
        break;
      }
      case "approvePartner":
        alert(`Partner approved: ${row.Name || row.id}`);
        break;
      default:
        alert(`Action ${actionType} clicked for ${row.Name || row.id}`);
    }
  }

  // columns with Eye as action trigger (Eye opens drawer and toggles menu)
  const agentColumns = [
    { key: "S_No", label: "S.No", noFilter: true, render: (_, __, idx) => (page - 1) * rowsPerPage + idx + 1 },
    { key: "Name", label: "Name" },
    { key: "Phone", label: "Phone" },
    { key: "City", label: "City" },
    { key: "KYCStatus", label: "KYC Status" },
    { key: "Listings", label: "Listings" },
    { key: "Rating", label: "Rating" },
    {
      key: "action",
      label: "Action",
      canFilter: false,
      render: (_, row) => (
        <div style={{ position: "relative" }} ref={openActionFor === row.id ? actionMenuRef : null}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // preserve previous drawer logic:
              setSelected((p) => (p && p.id === row.id ? null : row));
              setDetailTab("profile");
              // toggle action menu for this row
              setOpenActionFor((p) => (p === row.id ? null : row.id));
            }}
            style={{ background: "transparent", border: "none", padding: 6, cursor: "pointer" }}
            title="View & Actions"
          >
            <Eye size={18} />
          </button>

          {openActionFor === row.id && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 34,
                background: "#fff",
                boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
                borderRadius: 8,
                zIndex: 4000,
                minWidth: 180,
                padding: 8,
              }}
            >
              <button onClick={() => handleAction("approve", row)} style={actionItemStyle}>Approve</button>
              <button onClick={() => handleAction("suspend", row)} style={actionItemStyle}>Suspend</button>
              <button onClick={() => handleAction("assignArea", row)} style={actionItemStyle}>Assign Area</button>
              <button onClick={() => handleAction("sendAlert", row)} style={actionItemStyle}>Send Alert</button>
            </div>
          )}
        </div>
      ),
    },
  ];

  const builderColumns = [
    { key: "S_No", label: "S.No", noFilter: true, render: (_, __, idx) => (page - 1) * rowsPerPage + idx + 1 },
    { key: "Name", label: "Name" },
    { key: "Phone", label: "Contact" },
    { key: "City", label: "City" },
    { key: "ProjectCount", label: "Projects Count" },
    { key: "ProjectsApproved", label: "Approved" },
    { key: "ProjectsUnderConstruction", label: "Under Construction" },
    {
      key: "action",
      label: "Action",
      canFilter: false,
      render: (_, row) => (
        <div style={{ position: "relative" }} ref={openActionFor === row.id ? actionMenuRef : null}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelected((p) => (p && p.id === row.id ? null : row));
              setDetailTab("projects");
              setOpenActionFor((p) => (p === row.id ? null : row.id));
            }}
            style={{ background: "transparent", border: "none", padding: 6, cursor: "pointer" }}
          >
            <Eye size={18} />
          </button>

          {openActionFor === row.id && (
            <div style={{ position: "absolute", right: 0, top: 34, background: "#fff", boxShadow: "0 6px 18px rgba(0,0,0,0.12)", borderRadius: 8, zIndex: 4000, minWidth: 180, padding: 8 }}>
              <button onClick={() => handleAction("approveBuilder", row)} style={actionItemStyle}>Approve Builder</button>
              <button onClick={() => handleAction("assignManager", row)} style={actionItemStyle}>Assign Manager</button>
              <button onClick={() => handleAction("markPremium", row)} style={actionItemStyle}>Mark Premium</button>
            </div>
          )}
        </div>
      ),
    },
  ];

  const profColumns = [
    { key: "S_No", label: "S.No", noFilter: true, render: (_, __, idx) => (page - 1) * rowsPerPage + idx + 1 },
    { key: "Profession", label: "Profession" },
    { key: "Name", label: "Name" },
    { key: "City", label: "City" },
    { key: "LicenseID", label: "License ID" },
    { key: "ActiveDeals", label: "Active Deals" },
    {
      key: "action",
      label: "Action",
      canFilter: false,
      render: (_, row) => (
        <div style={{ position: "relative" }} ref={openActionFor === row.id ? actionMenuRef : null}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelected((p) => (p && p.id === row.id ? null : row));
              setDetailTab("profile");
              setOpenActionFor((p) => (p === row.id ? null : row.id));
            }}
            style={{ background: "transparent", border: "none", padding: 6, cursor: "pointer" }}
          >
            <Eye size={18} />
          </button>

          {openActionFor === row.id && (
            <div style={{ position: "absolute", right: 0, top: 34, background: "#fff", boxShadow: "0 6px 18px rgba(0,0,0,0.12)", borderRadius: 8, zIndex: 4000, minWidth: 180, padding: 8 }}>
              <button onClick={() => handleAction("assignToDeal", row)} style={actionItemStyle}>Assign to Deal</button>
              <button onClick={() => handleAction("approvePartner", row)} style={actionItemStyle}>Approve Partner</button>
              <button onClick={() => handleAction("suspend", row)} style={actionItemStyle}>Suspend</button>
            </div>
          )}
        </div>
      ),
    },
  ];

  const columns = activeTab === "agents" ? agentColumns : activeTab === "builders" ? builderColumns : profColumns;

  // filter handlers
  const toggleFilter = (key) => setOpenFilter((prev) => (prev === key ? null : key));
  const handleCheckboxChange = (key, value) =>
    setFilters((prev) => {
      const current = prev[key] || [];
      if (value === "All") return { ...prev, [key]: ["All"] };
      const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current.filter((v) => v !== "All"), value];
      return { ...prev, [key]: updated };
    });

  const clearFilter = (key) => {
    setFilters((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
    setOpenFilter(null);
  };

  const applyFilter = () => setOpenFilter(null);
  const uniqueValues = (key) => Array.from(new Set((dataForTab || []).map((d) => d[key]).filter(Boolean)));

  // close detail drawer on outside click (unchanged)
  useEffect(() => {
    function onDoc(e) {
      if (!panelRef.current) return;
      if (selected && !panelRef.current.contains(e.target)) setSelected(null);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [selected]);

  const extraDetails = selected ? Object.entries(selected.__raw || {}).slice(0, 50) : [];

  const counts = {
    agents: agents.length,
    builders: builders.length,
    profs: profs.length,
  };

  return (
    <div className="dashboard-container" style={{ display: "flex",height: "100vh",
        overflow: "hidden", }}>
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <style>{`
        .crm-table-wrap { width: 100%; }
        .crm-table-wrap, .crm-table-wrap * { -ms-overflow-style: none; scrollbar-width: none; }
        .crm-table-wrap ::-webkit-scrollbar { display: none !important; }
        .table-root { max-height: none !important; }
      `}</style>

      <Sidebar />
      <main style={{ flex: 1, padding: 20, marginLeft: "180px" }}>
        <div style={{ marginBottom: 12 }}>
          <button onClick={() => navigate(-1)} style={{ background: "#fff", border: "1px solid #e8e0e0", borderRadius: 8, padding: "6px 14px", cursor: "pointer" }}>
            Back
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ marginTop: 0 }}>
              <div style={{ display: "flex", gap: 4 }}>
                {[
                  { key: "agents", label: "Agents", count: counts.agents },
                  { key: "builders", label: "Builders", count: counts.builders },
                  { key: "profs", label: "Professionals", count: counts.profs },
                ].map((t) => {
                  const isActive = activeTab === t.key;
                  return (
                    <button
                      key={t.key}
                      onClick={() => {
                        setActiveTab(t.key);
                        setSelected(null);
                        setPage(1);
                      }}
                      style={{
                        padding: "8px 15px",
                        fontWeight: isActive ? 600 : 500,
                        fontSize: "13px",
                        border: "none",
                        backgroundColor: isActive ? "#fff" : "#f0f0f0",
                        color: isActive ? "#2c3e50" : "#666",
                        cursor: "pointer",
                        borderBottom: isActive ? "3px solid #2c3e50" : "3px solid transparent",
                        transition: "background-color 0.2s ease",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        borderRadius: 6,
                      }}
                    >
                      <span>{t.label}</span>
                      <span
                        style={{
                          background: isActive ? "#e9eef6" : "#eaeaea",
                          padding: "2px 8px",
                          borderRadius: 999,
                          fontWeight: 700,
                          fontSize: 12,
                          color: isActive ? "#2c3e50" : "#444",
                        }}
                      >
                        {t.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{ minWidth: 280, maxWidth: 420 }}>
            <SearchBar
              value={searchValue}
              onChange={setSearchValue}
              placeholder={
                activeTab === "agents"
                  ? "Search agents..."
                  : activeTab === "builders"
                  ? "Search builders..."
                  : "Search professionals..."
              }
            />
          </div>
        </div>

        <div ref={filterRef} style={{ borderRadius: 8 }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>
          ) : error ? (
            <div style={{ color: "red" }}>{error}</div>
          ) : (
            <>
              <div className="crm-table-wrap" style={{ position: "relative" }}>
                <DataTable
                  columns={columns}
                  data={dataForTab}
                  paginatedData={paginated}
                  openFilter={openFilter}
                  toggleFilter={toggleFilter}
                  filters={filters}
                  handleCheckboxChange={handleCheckboxChange}
                  uniqueValues={uniqueValues}
                  clearFilter={clearFilter}
                  applyFilter={applyFilter}
                  onRowClick={(row) => {
                    setSelected(row);
                    setDetailTab("profile");
                  }}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  setPage={setPage}
                  totalCount={filtered.length}
                />
              </div>
            </>
          )}
        </div>

        {selected && (
          <aside
            ref={panelRef}
            style={{
              position: "fixed",
              right: 18,
              top: 90,
              width: 520,
              maxHeight: "78vh",
              background: "#fff",
              boxShadow: "0 12px 40px rgba(2,6,23,0.12)",
              borderRadius: 10,
              padding: 16,
              zIndex: 3000,
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h3 style={{ margin: "0 0 6px 0" }}>{selected.Name || selected.id}</h3>
                <div style={{ color: "#666", fontSize: 13 }}>{selected.City || "-"} • {selected.contactType}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {/* Keep previous drawer action buttons (unchanged) */}
                {selected.contactType === "agent" && (
                  <>
                    <button onClick={() => handleAction("approve", selected)} style={btnStyleSuccess}>
                      Approve
                    </button>
                    <button onClick={() => handleAction("suspend", selected)} style={btnStyleDanger}>
                      Suspend
                    </button>
                    <button onClick={() => handleAction("assignArea", selected)} style={btnStyle}>
                      Assign Area
                    </button>
                    <button onClick={() => handleAction("sendAlert", selected)} style={btnStyle}>
                      Send Alert
                    </button>
                  </>
                )}
                {selected.contactType === "builder" && (
                  <>
                    <button onClick={() => handleAction("approveBuilder", selected)} style={btnStyleSuccess}>
                      Approve Builder
                    </button>
                    <button onClick={() => handleAction("assignManager", selected)} style={btnStyle}>
                      Assign Manager
                    </button>
                    <button onClick={() => handleAction("markPremium", selected)} style={btnStyle}>
                      Mark Premium
                    </button>
                  </>
                )}
                {selected.contactType === "buyer" && (
                  <>
                    <button onClick={() => handleAction("assignAgent", selected)} style={btnStyle}>
                      Assign Agent
                    </button>
                    <button onClick={() => handleAction("sendOffers", selected)} style={btnStyle}>
                      Send Offers
                    </button>
                  </>
                )}
                {selected.contactType === "pro" && (
                  <>
                    <button onClick={() => handleAction("assignToDeal", selected)} style={btnStyle}>
                      Assign to Deal
                    </button>
                    <button onClick={() => handleAction("approvePartner", selected)} style={btnStyleSuccess}>
                      Approve Partner
                    </button>
                    <button onClick={() => handleAction("suspend", selected)} style={btnStyleDanger}>
                      Suspend
                    </button>
                  </>
                )}
                <button onClick={() => setSelected(null)} style={{ background: "transparent", border: "none", fontSize: 18, cursor: "pointer", color: "#777" }}>
                  ×
                </button>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              {["profile", selected.contactType === "agent" ? "listings" : selected.contactType === "builder" ? "projects" : selected.contactType === "buyer" ? "saved" : "notes", "notes"].map((t) => (
                <button
                  key={t}
                  onClick={() => setDetailTab(t)}
                  style={{ padding: "6px 10px", borderRadius: 8, background: detailTab === t ? "#2563eb" : "#fff", color: detailTab === t ? "#fff" : "#111", border: "1px solid #eef2f6" }}
                >
                  {t === "profile" ? "Profile" : t === "listings" ? "Listings" : t === "projects" ? "Projects" : t === "saved" ? "Saved Properties" : "Notes"}
                </button>
              ))}
            </div>

            <div style={{ marginTop: 12 }}>
              {detailTab === "profile" && (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <div>
                      <strong>Phone</strong>
                      <div style={{ color: "#444" }}>{selected.Phone || "-"}</div>
                    </div>
                    <div>
                      <strong>Email</strong>
                      <div style={{ color: "#444" }}>{selected.Email || "-"}</div>
                    </div>
                    <div>
                      <strong>City</strong>
                      <div style={{ color: "#444" }}>{selected.City || "-"}</div>
                    </div>
                    {selected.contactType === "agent" && (
                      <div>
                        <strong>KYC</strong>
                        <div style={{ color: "#444" }}>{selected.KYCStatus}</div>
                      </div>
                    )}
                    {selected.contactType === "agent" && (
                      <div>
                        <strong>Listings</strong>
                        <div style={{ color: "#444" }}>{selected.Listings}</div>
                      </div>
                    )}
                    {selected.contactType === "builder" && (
                      <div>
                        <strong>Projects</strong>
                        <div style={{ color: "#444" }}>{selected.Projects}</div>
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <h4 style={{ marginTop: 0 }}>Additional Information</h4>
                    {extraDetails.length === 0 ? (
                      <div style={{ color: "#666" }}>No extra details</div>
                    ) : (
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <tbody>
                          {extraDetails.map(([k, val]) => (
                            <tr key={k}>
                              <td style={{ width: "40%", padding: 6, fontWeight: 700 }}>{k}</td>
                              <td style={{ padding: 6 }}>{String(val)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {detailTab === "listings" && selected.contactType === "agent" && (
                <div>
                  <h4>Listings</h4>
                  {Array.isArray(v(selected.__raw, "Listings", "listings", "AgentListings")) && (v(selected.__raw, "Listings", "listings", "AgentListings") || []).length > 0 ? (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr>
                          <th style={{ padding: 8 }}>ID</th>
                          <th style={{ padding: 8 }}>Title</th>
                          <th style={{ padding: 8 }}>City</th>
                          <th style={{ padding: 8 }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(v(selected.__raw, "Listings", "listings", "AgentListings") || []).map((l, i) => (
                          <tr key={i}>
                            <td style={{ padding: 8 }}>{l.id ?? l.PropertyID}</td>
                            <td style={{ padding: 8 }}>{l.title ?? l.PropertyName}</td>
                            <td style={{ padding: 8 }}>{l.city ?? l.PropertyCity}</td>
                            <td style={{ padding: 8 }}>{l.status ?? l.PropertyStatus}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div style={{ color: "#666" }}>No listings in raw payload. Implement server-side endpoint to fetch listings per agent.</div>
                  )}
                </div>
              )}

              {detailTab === "projects" && selected.contactType === "builder" && (
                <div>
                  <h4>Projects</h4>
                  {Array.isArray(v(selected.__raw, "Projects")) && (v(selected.__raw, "Projects") || []).length > 0 ? (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr>
                          <th style={{ padding: 8 }}>ID</th>
                          <th style={{ padding: 8 }}>Name</th>
                          <th style={{ padding: 8 }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(v(selected.__raw, "Projects") || []).map((p, i) => (
                          <tr key={i}>
                            <td style={{ padding: 8 }}>{p.id}</td>
                            <td style={{ padding: 8 }}>{p.name}</td>
                            <td style={{ padding: 8 }}>{p.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div style={{ color: "#666" }}>No projects in raw payload.</div>
                  )}
                </div>
              )}

              {detailTab === "saved" && selected.contactType === "buyer" && (
                <div>
                  <h4>Saved Properties</h4>
                  {Array.isArray(v(selected.__raw, "SavedProperties")) && (v(selected.__raw, "SavedProperties") || []).length > 0 ? (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr>
                          <th style={{ padding: 8 }}>ID</th>
                          <th style={{ padding: 8 }}>Title</th>
                          <th style={{ padding: 8 }}>City</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(v(selected.__raw, "SavedProperties") || []).map((s, i) => (
                          <tr key={i}>
                            <td style={{ padding: 8 }}>{s.id ?? s.PropertyID}</td>
                            <td style={{ padding: 8 }}>{s.title ?? s.PropertyName}</td>
                            <td style={{ padding: 8 }}>{s.city ?? s.PropertyCity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div style={{ color: "#666" }}>No saved properties.</div>
                  )}
                </div>
              )}

              {detailTab === "notes" && (
                <div>
                  <h4>Notes</h4>
                  <div style={{ color: "#666" }}>Notes.</div>
                </div>
              )}
            </div>
          </aside>
        )}
      </main>
    </div>
  );
}

/* small button styles used inline (reused) */
const btnStyle = { padding: "8px 10px", borderRadius: 8, background: "#eef2ff", border: "1px solid #dfe7ff", cursor: "pointer" };
const btnStyleSuccess = { padding: "8px 10px", borderRadius: 8, background: "#e6ffed", border: "1px solid #d1f6de", cursor: "pointer" };
const btnStyleDanger = { padding: "8px 10px", borderRadius: 8, background: "#fff3f2", border: "1px solid #ffd1d1", cursor: "pointer" };

const actionItemStyle = {
  display: "block",
  width: "100%",
  textAlign: "left",
  padding: "8px 10px",
  border: "none",
  background: "transparent",
  cursor: "pointer",
  borderRadius: 6,
};
