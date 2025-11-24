 // src/pages/Deals/DealsManagement.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import BackButton from "../../Utils/Backbutton.jsx";
import SearchBar from "../../Utils/SearchBar.jsx";
import Table, { Pagination } from "../../Utils/Table.jsx";
import { Eye } from "lucide-react";
import { useApi } from "../../API/Api.js";

/* ---------- Helper functions ---------- */
function toNumber(v) {
  if (v === null || v === undefined || v === "") return 0;
  const n = typeof v === "number" ? v : Number(String(v).replace(/[,₹\s]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function formatRupeeShort(value) {
  const n = toNumber(value);
  if (n === 0) return "₹ 0";
  if (Math.abs(n) >= 1e7) return `₹ ${(n / 1e7).toFixed(2)} Cr`;
  if (Math.abs(n) >= 1e5) return `₹ ${(n / 1e5).toFixed(2)} L`;
  return `₹ ${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

/* ---------- Small spinner ---------- */
function Spinner() {
  return (
    <div style={{ padding: 28, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          width: 36,
          height: 36,
          border: "4px solid #eaeef2",
          borderTop: "4px solid #111",
          borderRadius: "50%",
          animation: "spin 0.9s linear infinite",
        }}
      />
      <style>{`@keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }`}</style>
    </div>
  );
}

/* ---------- Main Component ---------- */
export default function DealsManagement() {
  const { fetchData, postData } = useApi();
  const fileInputRef = useRef(null);

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({});
  const [openFilter, setOpenFilter] = useState(null);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [searchValue, setSearchValue] = useState("");

  // slide modal
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [busy, setBusy] = useState(false);

  // UI state inside modal (controlled inputs)
  const [draftStage, setDraftStage] = useState("");
  const [draftAgent, setDraftAgent] = useState("");
  const [draftRemarks, setDraftRemarks] = useState("");
  const [uploading, setUploading] = useState(false);

  // agent list (load once)
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    loadDeals();
    loadAgents();
  }, []); // eslint-disable-line

  const loadDeals = async () => {
    try {
      setLoading(true);
      const res = await fetchData("DealRequest");
      const arr = Array.isArray(res) ? res : res?.data ?? [];
      setData(arr);
      setFilteredData(arr);
    } catch (err) {
      console.error("Deals fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadAgents = async () => {
    // try to load list of agents to populate dropdown; if your API uses a different key change it
    try {
      const res = await fetchData("AgentList");
      const arr = Array.isArray(res) ? res : res?.data ?? [];
      setAgents(arr);
    } catch (err) {
      console.warn("Failed to load agents list", err);
      setAgents([]);
    }
  };

  /* ---------- Filters & search ---------- */
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
        [
          "Deal_ID",
          "BuyerName",
          "SellerName",
          "PropertyID",
          "PropertyName",
          "AgentName",
          "Stage",
          "Status",
          "Remarks",
        ].some((k) => row[k] && String(row[k]).toLowerCase().includes(q))
      );
    }
    setFilteredData(result);
    setPage(1);
  }, [data, filters, searchValue]);

  const uniqueValues = (key) =>
    Array.from(new Set(filteredData.map((r) => r[key]).filter(Boolean)));
  const toggleFilter = (key) => setOpenFilter((p) => (p === key ? null : key));
  const handleCheckboxChange = (key, val) =>
    setFilters((p) => {
      const cur = p[key] || [];
      return cur.includes(val)
        ? { ...p, [key]: cur.filter((x) => x !== val) }
        : { ...p, [key]: [...cur, val] };
    });
  const clearFilter = (key) => {
    const copy = { ...filters };
    delete copy[key];
    setFilters(copy);
    setOpenFilter(null);
  };

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page]);

  const openModalFor = (deal) => {
    setSelectedDeal(deal);
    // initialize drafts from selectedDeal
    setDraftStage(deal?.Stage ?? "");
    setDraftAgent(deal?.AgentID ?? deal?.AgentName ?? "");
    setDraftRemarks("");
  };
  const closeModal = () => {
    setSelectedDeal(null);
    setDraftRemarks("");
    setDraftAgent("");
    setDraftStage("");
  };

  /* ---------- API wrapper for updates (uses postData if available else fallback) ---------- */
  async function apiUpdateDeal(patch) {
    // expected API name per your confirmation: "Deal/Update"
    const payload = { Deal_ID: patch.Deal_ID, ...patch };
    // try postData from useApi
    if (typeof postData === "function") {
      try {
        const resp = await postData("Deal/Update", payload);
        return resp;
      } catch (err) {
        console.warn("postData failed:", err);
        // fallback to fetch below
      }
    }

    // fallback call to canonical wrapper endpoint
    const url = "https://imsdev.akrais.com:8444/AKRARealityLTAPI/api/data";
    const body = { action: "Deal/Update", data: JSON.stringify(payload) };
    const headers = { "Content-Type": "application/json", Accept: "application/json" };
    try {
      const token = typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;
      if (token) headers.Authorization = `Bearer ${token}`;
      const resp = await fetch(url, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify(body),
      });
      const text = await resp.text();
      const parsed = text ? JSON.parse(text) : null;
      if (!resp.ok) {
        throw new Error(`Server ${resp.status}: ${text || "(empty)"}`);
      }
      return parsed;
    } catch (err) {
      console.error("apiUpdateDeal fallback failed:", err);
      throw err;
    }
  }

  /* ---------- updateDeal (keeps your original name) ---------- */
  const updateDeal = async (dealId, patch) => {
    setBusy(true);
    try {
      // always include Deal_ID so apiUpdateDeal receives consistent shape
      await apiUpdateDeal({ Deal_ID: dealId, ...patch });

      // update UI locally (best-effort)
      const updated = data.map((deal) => (deal.Deal_ID === dealId ? { ...deal, ...patch } : deal));
      setData(updated);
      setFilteredData(updated);
      setSelectedDeal((s) => (s && s.Deal_ID === dealId ? { ...s, ...patch } : s));

      // append timeline entry for stage/status/remarks updates
      if (selectedDeal && (patch.Stage || patch.Status || patch.Remarks)) {
        const entry = {
          id: Date.now(),
          action:
            patch.Remarks
              ? `Remark added: ${patch.Remarks}`
              : patch.Stage
              ? `Stage changed to ${patch.Stage}`
              : patch.Status
              ? `Status changed to ${patch.Status}`
              : "Updated",
          date: new Date().toISOString(),
          actor: "web-ui",
        };
        // update selectedDeal.timeline and local data arrays
        setSelectedDeal((s) => (s ? { ...s, Timeline: [entry, ...(s.Timeline || [])] } : s));
        setData((prev) =>
          prev.map((d) =>
            d.Deal_ID === dealId ? { ...d, Timeline: [entry, ...(d.Timeline || [])] } : d
          )
        );
        setFilteredData((prev) =>
          prev.map((d) =>
            d.Deal_ID === dealId ? { ...d, Timeline: [entry, ...(d.Timeline || [])] } : d
          )
        );
      }

      window.alert("Deal updated successfully ✅");
    } catch (err) {
      console.error("Deal update failed:", err);
      window.alert(`Failed to update deal — ${err?.message || "check console."}`);
    } finally {
      setBusy(false);
    }
  };

  /* ---------- Agent reassign handler (calls updateDeal) ---------- */
  const handleAgentAssign = async () => {
    if (!selectedDeal) return;
    const agentValue = draftAgent;
    if (!agentValue) {
      alert("Select an agent to assign.");
      return;
    }
    // patch shape uses AgentID if available; keep AgentName also to display in UI
    const patch = { AgentID: agentValue, AgentName: agents.find(a => String(a.id) === String(agentValue))?.name ?? agentValue };
    await updateDeal(selectedDeal.Deal_ID, patch);
  };

  /* ---------- Stage change handler (calls updateDeal) ---------- */
  const handleStageChange = async () => {
    if (!selectedDeal) return;
    if (!draftStage) {
      alert("Select a stage.");
      return;
    }
    await updateDeal(selectedDeal.Deal_ID, { Stage: draftStage });
  };

  /* ---------- Add remarks handler ---------- */
  const handleAddRemarks = async () => {
    if (!selectedDeal) return;
    const note = (draftRemarks || "").trim();
    if (!note) {
      alert("Enter remarks to save.");
      return;
    }
    // We append remarks to existing Remarks field (server-side may store differently)
    const newRemarks = [selectedDeal.Remarks, note].filter(Boolean).join("\n");
    await updateDeal(selectedDeal.Deal_ID, { Remarks: newRemarks });
    setDraftRemarks("");
  };

  /* ---------- Upload document handler ---------- */
  const handleUploadDocument = async (file) => {
    if (!selectedDeal || !file) return;
    setUploading(true);
    try {
      // Prefer postData wrapper if available
      if (typeof postData === "function") {
        // If your postData supports file uploads adjust accordingly;
        // we'll attempt to send { Deal_ID, filename, fileContentBase64 } as fallback if server expects JSON.
        // But first try a FormData approach via fetch (below) if postData cannot accept file.
        // So try postData calling a known action — if it fails we'll fallback to fetch.
        try {
          // attempt to convert small file to base64 (if server expects JSON)
          const base64 = await toBase64(file);
          await postData("Deal/UploadDocument", { Deal_ID: selectedDeal.Deal_ID, FileName: file.name, FileBase64: base64 });
          // append timeline entry
          const entry = { id: Date.now(), action: `Uploaded document: ${file.name}`, date: new Date().toISOString(), actor: "web-ui" };
          setSelectedDeal((s) => (s ? { ...s, Timeline: [entry, ...(s.Timeline || [])] } : s));
          setData((prev) => prev.map((d) => (d.Deal_ID === selectedDeal.Deal_ID ? { ...d, Timeline: [entry, ...(d.Timeline || [])] } : d)));
          setFilteredData((prev) => prev.map((d) => (d.Deal_ID === selectedDeal.Deal_ID ? { ...d, Timeline: [entry, ...(d.Timeline || [])] } : d)));
          window.alert("Document uploaded successfully ✅");
          setUploading(false);
          return;
        } catch (err) {
          console.warn("postData file upload attempt failed, falling back to fetch", err);
          // continue to fetch fallback below
        }
      }

      // Fallback: send multipart/form-data to canonical wrapper endpoint
      const url = "https://imsdev.akrais.com:8444/AKRARealityLTAPI/api/data";
      const token = typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;
      const form = new FormData();
      // Many backends expect file + metadata; adapt if your backend differs
      form.append("action", "Deal/UploadDocument");
      form.append("Deal_ID", selectedDeal.Deal_ID);
      form.append("file", file, file.name);

      const resp = await fetch(url, {
        method: "POST",
        body: form,
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const txt = await resp.text();
      let parsed;
      try { parsed = txt ? JSON.parse(txt) : txt; } catch { parsed = txt; }

      if (!resp.ok) {
        throw new Error(`Server ${resp.status}: ${typeof parsed === "string" ? parsed : JSON.stringify(parsed)}`);
      }

      const entry = { id: Date.now(), action: `Uploaded document: ${file.name}`, date: new Date().toISOString(), actor: "web-ui" };
      setSelectedDeal((s) => (s ? { ...s, Timeline: [entry, ...(s.Timeline || [])] } : s));
      setData((prev) => prev.map((d) => (d.Deal_ID === selectedDeal.Deal_ID ? { ...d, Timeline: [entry, ...(d.Timeline || [])] } : d)));
      setFilteredData((prev) => prev.map((d) => (d.Deal_ID === selectedDeal.Deal_ID ? { ...d, Timeline: [entry, ...(d.Timeline || [])] } : d)));
      window.alert("Document uploaded successfully ✅ (server accepted)");
    } catch (err) {
      console.error("Document upload failed:", err);
      window.alert(`Failed to upload document — ${err?.message || "check console"}`);
    } finally {
      setUploading(false);
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  /* ---------- Columns ---------- */
  const columns = [
    { label: "S.No", key: "serialNo", canFilter: false, render: (_, __, idx) => (page - 1) * rowsPerPage + (idx + 1) },
    { label: "Deal ID", key: "Deal_ID" },
    { label: "Buyer", key: "BuyerName" },
    { label: "Seller", key: "SellerName" },
    { label: "Property ID", key: "PropertyID" },
    { label: "Property Name", key: "PropertyName" },
    { label: "Agent", key: "AgentName" },
    { label: "Stage", key: "Stage" },
    { label: "Status", key: "Status" },
    { label: "Value", key: "Value", render: (v) => formatRupeeShort(v) },
    {
      label: "Action",
      key: "action",
      canFilter: false,
      render: (_, row) => (
        <button
          onClick={(e) => { e.stopPropagation(); openModalFor(row); }}
          title="View details"
          aria-label="View details"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 6,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Eye size={18} />
        </button>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#fff" }}>
      <Sidebar />

      <main style={{ flex: 1, padding: 20, marginLeft: "180px", boxSizing: "border-box" }}>
        <div style={{ marginBottom: 12 }}>
          <BackButton onClick={() => window.history.back()} label="Back" />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h2 style={{ margin: 0, fontSize: "1.05rem", color: "#111" }}>Deals Management</h2>

          <div style={{ width: 320, minWidth: 200 }}>
            <SearchBar value={searchValue} onChange={setSearchValue} onSubmit={() => setPage(1)} pageLabel="Deals" />
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            {loading ? (
              <Spinner />
            ) : (
              <>
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
                  rowsPerPage={rowsPerPage}
                  totalCount={filteredData.length}
                />
                <div style={{ marginTop: 10, display: "flex", justifyContent: "center" }}>
                  <Pagination page={page} setPage={setPage} totalPages={Math.max(1, Math.ceil(filteredData.length / rowsPerPage))} />
                </div>
              </>
            )}
          </div>

        </div>
      </main>

      {/* ---------- Modal Popup ---------- */}
      {selectedDeal && (
        <div className="deal-modal-overlay" onClick={closeModal}>
          <div className="deal-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{selectedDeal.PropertyName || "Deal details"}</div>
                <div style={{ fontSize: 12, color: "#666" }}>{`Deal: ${selectedDeal.Deal_ID || "-"}`}</div>
              </div>

              <div>
                <button onClick={closeModal} aria-label="Close" style={{ border: "none", background: "transparent", fontSize: 20, cursor: "pointer", padding: "4px 8px" }}>×</button>
              </div>
            </div>

            <hr style={{ margin: "12px 0" }} />

            <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 13, color: "#444", fontWeight: 700, marginBottom: 6 }}>Summary</div>
                <div style={{ fontSize: 13, color: "#222", marginBottom: 4 }}><strong>Buyer:</strong> {selectedDeal.BuyerName ?? "-"}</div>
                <div style={{ fontSize: 13, color: "#222", marginBottom: 4 }}><strong>Seller:</strong> {selectedDeal.SellerName ?? "-"}</div>
                <div style={{ fontSize: 13, color: "#222" }}><strong>Agent:</strong> {selectedDeal.AgentName ?? "-"}</div>
              </div>

              <div>
                <div style={{ fontSize: 13, color: "#444", fontWeight: 700, marginBottom: 6 }}>Dates</div>
                <div style={{ fontSize: 13, color: "#222", marginBottom: 4 }}><strong>Inquiry:</strong> {selectedDeal.InquiryDate ? new Date(selectedDeal.InquiryDate).toLocaleDateString("en-GB") : "-"}</div>
                <div style={{ fontSize: 13, color: "#222", marginBottom: 4 }}><strong>Site Visit:</strong> {selectedDeal.SiteVisitDate ? new Date(selectedDeal.SiteVisitDate).toLocaleDateString("en-GB") : "-"}</div>
                <div style={{ fontSize: 13, color: "#222" }}><strong>Offer:</strong> {selectedDeal.OfferDate ? new Date(selectedDeal.OfferDate).toLocaleDateString("en-GB") : "-"}</div>
              </div>
            </section>

            <section style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
                <div style={{ minWidth: 120 }}>
                  <div style={{ fontSize: 13, color: "#444", fontWeight: 700, marginBottom: 6 }}>Stage</div>
                  <select value={draftStage} onChange={(e) => setDraftStage(e.target.value)} style={{ width: "100%", padding: 8, borderRadius: 6 }}>
                    <option value="">-- Select stage --</option>
                    <option value="Inquiry">Inquiry</option>
                    <option value="Site Visit">Site Visit</option>
                    <option value="Offer">Offer</option>
                    <option value="Agreement">Agreement</option>
                    <option value="Closure">Closure</option>
                  </select>
                </div>

                <div style={{ minWidth: 220 }}>
                  <div style={{ fontSize: 13, color: "#444", fontWeight: 700, marginBottom: 6 }}>Reassign Agent</div>
                  <select value={draftAgent} onChange={(e) => setDraftAgent(e.target.value)} style={{ width: "100%", padding: 8, borderRadius: 6 }}>
                    <option value="">-- Select agent --</option>
                    {/* Agents list loaded from API if available */}
                    {agents.map((a) => (
                      <option key={a.id ?? a.AgentID ?? a.UserID} value={a.id ?? a.AgentID ?? a.UserID}>
                        {a.name ?? a.AgentName ?? (a.FirstName ? `${a.FirstName} ${a.LastName || ""}` : String(a.id ?? a.AgentID ?? a.UserID))}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                <button disabled={busy} onClick={handleStageChange} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.06)", background: busy ? "#f0f0f0" : "#1f2937", color: "#fff", cursor: busy ? "not-allowed" : "pointer", fontWeight: 600 }}>
                  {busy ? "Working..." : "Save Stage"}
                </button>

                <button disabled={busy} onClick={handleAgentAssign} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.06)", background: busy ? "#f0f0f0" : "#0b63ff", color: "#fff", cursor: busy ? "not-allowed" : "pointer", fontWeight: 600 }}>
                  {busy ? "Working..." : "Assign Agent"}
                </button>
              </div>
            </section>

            <section style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 13, color: "#444", fontWeight: 700, marginBottom: 6 }}>Remarks</div>
              <textarea value={draftRemarks} onChange={(e) => setDraftRemarks(e.target.value)} placeholder="Add a remark..." rows={3} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #e6e6e6" }} />
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button disabled={busy} onClick={handleAddRemarks} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.06)", background: busy ? "#f0f0f0" : "#059669", color: "#fff", cursor: busy ? "not-allowed" : "pointer", fontWeight: 600 }}>
                  {busy ? "Working..." : "Save Remark"}
                </button>

                <label style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", borderRadius: 8, padding: "6px 10px", border: "1px dashed #cbd5e1", cursor: "pointer" }}>
                  <input ref={fileInputRef} type="file" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUploadDocument(f); e.target.value = ""; }} />
                  <span style={{ color: "#111", fontWeight: 600 }}>{uploading ? "Uploading..." : "Upload Document"}</span>
                </label>
              </div>
            </section>

            <section style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 13, color: "#444", fontWeight: 700, marginBottom: 6 }}>Financials</div>
              <div style={{ fontSize: 13, color: "#222", marginBottom: 4 }}><strong>Value:</strong> {formatRupeeShort(selectedDeal.Value)}</div>
              <div style={{ fontSize: 13, color: "#222" }}><strong>Commission:</strong> {formatRupeeShort(selectedDeal.Commission)}</div>
            </section>

            <section style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 13, color: "#444", fontWeight: 700, marginBottom: 6 }}>Stage & Status</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                <div style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e6e6e6", fontSize: 13 }}>{selectedDeal.Stage || "-"}</div>
                <div style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e6e6e6", fontSize: 13 }}>{selectedDeal.Status || "-"}</div>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button disabled={busy} onClick={() => updateDeal(selectedDeal.Deal_ID, { Stage: "Negotiation" })} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.06)", background: busy ? "#f0f0f0" : "#111827", color: "#fff", cursor: busy ? "not-allowed" : "pointer", fontWeight: 600 }}>
                  {busy ? "Working..." : "Set Negotiation"}
                </button>

                <button disabled={busy} onClick={() => updateDeal(selectedDeal.Deal_ID, { Stage: "Agreement" })} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.06)", background: busy ? "#f0f0f0" : "#0b63ff", color: "#fff", cursor: busy ? "not-allowed" : "pointer", fontWeight: 600 }}>
                  {busy ? "Working..." : "Set Agreement"}
                </button>

                <button disabled={busy} onClick={() => updateDeal(selectedDeal.Deal_ID, { Status: "Closed", ClosureDate: new Date().toISOString() })} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.06)", background: busy ? "#f0f0f0" : "#059669", color: "#fff", cursor: busy ? "not-allowed" : "pointer", fontWeight: 600 }}>
                  {busy ? "Working..." : "Close Deal"}
                </button>
              </div>
            </section>

            <section>
              <div style={{ fontSize: 13, color: "#444", fontWeight: 700, marginBottom: 6 }}>Remarks</div>
              <div style={{ fontSize: 13, color: "#222", whiteSpace: "pre-wrap", marginBottom: 8 }}>{selectedDeal.Remarks || "-"}</div>
            </section>

            <section style={{ marginTop: 12 }}>
              <div style={{ fontSize: 13, color: "#444", fontWeight: 700, marginBottom: 8 }}>Timeline</div>
              <div style={{ maxHeight: 160, overflowY: "auto", paddingRight: 8 }}>
                {(selectedDeal.Timeline || []).length === 0 ? (
                  <div style={{ color: "#777", fontSize: 13 }}>No events yet</div>
                ) : (
                  (selectedDeal.Timeline || []).map((t) => (
                    <div key={t.id || `${t.date}-${t.action}`} style={{ marginBottom: 8, padding: 8, borderRadius: 8, background: "#fbfbfb", border: "1px solid #f0f0f0" }}>
                      <div style={{ fontSize: 13, color: "#111", fontWeight: 700 }}>{t.action}</div>
                      <div style={{ fontSize: 12, color: "#666" }}>{new Date(t.date).toLocaleString()}</div>
                      <div style={{ fontSize: 12, color: "#888" }}>{t.actor ? `By: ${t.actor}` : ""}</div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <style>{`
              .deal-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.45);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                animation: fadeIn 0.2s ease-in;
              }
              .deal-modal {
                background: #fff;
                border-radius: 12px;
                padding: 20px;
                width: 760px;
                max-height: 92vh;
                overflow-y: auto;
                box-shadow: 0 8px 25px rgba(0,0,0,0.25);
                animation: scaleIn 0.25s ease-out;
              }
              @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
              @keyframes scaleIn { from { transform: scale(0.98); opacity: 0; } to { transform: scale(1); opacity: 1; } }
              @media (max-width: 900px) {
                .deal-modal { width: 95%; padding: 16px; }
              }
            `}</style>
          </div>
        </div>
      )}
    </div>
  );
}
