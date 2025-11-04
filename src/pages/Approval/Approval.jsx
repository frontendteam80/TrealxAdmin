 // src/pages/Approval/Approval.jsx
import React, { useEffect, useState, useMemo } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../API/Api.js";
import DataTable, { Pagination } from "../../Utils/Table.jsx";

const show = (val) => (val === null || val === undefined || val === "" ? "-" : val);

export default function Approval() {
  const { fetchData } = useApi();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({});
  const [openFilter, setOpenFilter] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 15;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  // Fetch approval data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const response = await fetchData("ApprovalData");
        const arr = Array.isArray(response) ? response : response?.data || [];
        setData(arr);
        setFilteredData(arr);
      } catch (err) {
        setError(err?.message || "Failed to fetch approval data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [fetchData]);

  // Apply column filters (same logic as ActiveListings)
  useEffect(() => {
    let result = [...data];
    Object.keys(filters).forEach((key) => {
      const selected = filters[key];
      if (selected && selected.length > 0 && !selected.includes("All")) {
        result = result.filter((row) => selected.includes(row[key]));
      }
    });
    setFilteredData(result);
    setPage(1);
  }, [filters, data]);

  // Columns — keys must match API JSON exactly (PascalCase where used)
  const columns = [
    { label: "S.No", key: "serialNo", render: (_, __, idx) => idx + 1 },
    { label: "Property Name", key: "PropertyName" },
    { label: "Name", key: "FullName" },
    { label: "Project Name", key: "ProjectName" },
    { label: "Phone Number", key: "PhoneNumber" },
    { label: "Property Type", key: "PropertyType" },
    { label: "Amount", key: "Amount" },
    { label: "Status", key: "verificationStatus" },
    { label: "Added By", key: "AddedBy" },
    {
      label: "Action",
      key: "action",
      render: (_, row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedRow(row);
          }}
          style={{
            background: "#d0d9e2ff",
            color: "#121212",
            border: "none",
            padding: "6px 12px",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: "0.9rem",
          }}
        >
          View
        </button>
      ),
    },
  ];

  const mainKeys = columns.map((c) => c.key);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page]);

  const toggleFilter = (key) => {
    setOpenFilter(openFilter === key ? null : key);
    setSearchValue("");
  };

  const handleCheckboxChange = (key, value) => {
    setFilters((prev) => {
      const current = prev[key] || [];
      if (value === "All") return { ...prev, [key]: ["All"] };
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current.filter((v) => v !== "All"), value];
      return { ...prev, [key]: updated };
    });
  };

  const clearFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: [] }));
    setOpenFilter(null);
  };

  const applyFilter = () => setOpenFilter(null);
  const uniqueValues = (key) =>
    Array.from(new Set(data.map((d) => d[key]).filter(Boolean)));

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // Extra fields for slide panel: fields not in main table
  const extraDetails = selectedRow
    ? Object.entries(selectedRow).filter(
        ([key]) => !mainKeys.includes(key) && selectedRow[key] !== null && selectedRow[key] !== undefined
      )
    : [];

  // Spinner same as ActiveListings
  const Spinner = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "60vh",
      }}
    >
      <div
        style={{
          width: 45,
          height: 45,
          border: "5px solid #ccc",
          borderTop: "5px solid #252a2fff",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f9fafb" }}>
      <Sidebar />

      <div style={{ flex: 1, padding: 20 ,marginLeft: "180px"}}>
        {/* Back */}
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            background: "#fff",
            border: "#121212",
            borderRadius: 8,
            padding: "6px 14px",
            cursor: "pointer",
            fontSize: "0.9rem",
            color: "#121212",
            marginBottom: 10,
          }}
        >
          Back
        </button>

        <h2 style={{ marginBottom: 20, color: "#222" }}>Waiting For Approval</h2>

        {loading ? (
          <Spinner />
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <div
            style={{
              borderRadius: 8,
              overflow: "hidden",
              background: "#fff",
            }}
          >
            <DataTable
              columns={columns}
              data={data}
              paginatedData={paginatedData}
              openFilter={openFilter}
              toggleFilter={toggleFilter}
              filters={filters}
              handleCheckboxChange={handleCheckboxChange}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              uniqueValues={uniqueValues}
              clearFilter={clearFilter}
              applyFilter={applyFilter}
              onRowClick={setSelectedRow}
            />

            <Pagination page={page} setPage={setPage} totalPages={totalPages} />
          </div>
        )}

        {/* Slide panel: shows fields not present in main table (extraDetails) + approve/reject/pending UI */}
        {selectedRow && (
          <>
            <div
              onClick={() => setSelectedRow(null)}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.4)",
                zIndex: 998,
              }}
            />

            <div
              style={{
                position: "fixed",
                top: 0,
                right: 0,
                width: "420px",
                height: "100%",
                background: "#fff",
                zIndex: 999,
                padding: 20,
                overflowY: "auto",
                boxShadow: "-2px 0 12px rgba(0,0,0,0.15)",
                transform: "translateX(0)",
                animation: "slideIn 0.3s ease-out",
              }}
            >
              <style>
                {`
                  @keyframes slideIn {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                  }
                `}
              </style>

              <button
                onClick={() => setSelectedRow(null)}
                style={{
                  float: "right",
                  fontSize: 24,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
                aria-label="Close"
              >
                ×
              </button>

              {selectedRow.ImageUrl && (
                <div style={{ marginBottom: 16 }}>
                  <img
                    src={String(selectedRow.ImageUrl).replace(/[\[\]"']/g, "")}
                    alt={selectedRow.PropertyName || "Image"}
                    style={{
                      width: "100%",
                      height: 200,
                      objectFit: "cover",
                      borderRadius: 6,
                    }}
                  />
                </div>
              )}

              <h3
                style={{
                  marginTop: 0,
                  marginBottom: 12,
                  fontSize: "1.1rem",
                  color: "#121212",
                }}
              >
                {selectedRow.PropertyName ? selectedRow.PropertyName : "Property Details"}
              </h3>

              <div style={{ marginBottom: 12 }}>
                <div><strong>Name:</strong> {show(selectedRow.FullName)}</div>
                <div><strong>Project:</strong> {show(selectedRow.ProjectName)}</div>
                <div><strong>Phone:</strong> {show(selectedRow.PhoneNumber)}</div>
                <div><strong>Type:</strong> {show(selectedRow.PropertyType)}</div>
                <div><strong>Status:</strong> {show(selectedRow.verificationStatus)}</div>
              </div>

              {/* Extra table for other fields (fields not present in main table) */}
              <div style={{ marginTop: 12 }}>
                <h4 style={{ marginBottom: 8 }}>More details</h4>
                {extraDetails.length === 0 ? (
                  <p style={{ color: "#666" }}>No additional details available.</p>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      {extraDetails.map(([key, val]) => (
                        <tr key={key}>
                          <td
                            style={{
                              fontWeight: 600,
                              padding: "6px 8px",
                              borderBottom: "1px solid #eee",
                              textTransform: "capitalize",
                              width: "40%",
                            }}
                          >
                            {key}
                          </td>
                          <td
                            style={{
                              padding: "6px 8px",
                              borderBottom: "1px solid #eee",
                              width: "60%",
                            }}
                          >
                            {String(val ?? "-")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Approve / Reject / Pending */}
              <div style={{ marginTop: 18 }}>
                <div style={{ marginBottom: 8, fontWeight: 700 }}>Approval / Rejection Notes</div>
                <ApprovalControls
                  currentRow={selectedRow}
                  saveLocal={(uid, payload) => {
                    // local persistence similar to previous code pattern
                    try {
                      const raw = localStorage.getItem("approvalComments");
                      const map = raw ? JSON.parse(raw) : {};
                      map[uid] = payload;
                      localStorage.setItem("approvalComments", JSON.stringify(map));
                      alert("Saved locally");
                    } catch {
                      alert("Could not save locally");
                    }
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * ApprovalControls component: small self-contained approve/reject/pending UI (kept inside same file)
 * - Shows radio options and textarea, and calls saveLocal(uid, payload)
 */
function ApprovalControls({ currentRow, saveLocal }) {
  const uid =
    currentRow?.UserID ?? currentRow?.UserId ?? currentRow?.PropertyID ?? "unknown";
  const [status, setStatus] = useState(currentRow?.verificationStatus ?? "");
  const [reason, setReason] = useState("");
  useEffectOnceOnMount(uid, setStatus, setReason);

  const onSave = () => {
    const payload = { status: status || "", reason: reason || "", savedAt: new Date().toISOString() };
    saveLocal(uid, payload);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        {["Approved", "Rejected", "Pending"].map((opt) => (
          <label key={opt} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input type="radio" name={`status_${uid}`} value={opt} checked={status === opt} onChange={() => setStatus(opt)} />
            <span>{opt}</span>
          </label>
        ))}
      </div>

      {(status === "Approved" || status === "Rejected" || status === "Pending") && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: "0.95rem", marginBottom: 6, fontWeight: 600 }}>
            {status === "Approved" ? "Reason for Approval" : status === "Rejected" ? "Reason for Rejection" : "Remarks for Pending"}
          </div>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Enter your comments here..." rows={4} style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd", resize: "vertical", fontSize: "0.95rem" }} />
        </div>
      )}

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onSave} style={{ background: "#007bff", color: "#fff", border: "none", padding: "8px 12px", borderRadius: 6, cursor: "pointer" }}>
          Save Note
        </button>
        <button onClick={() => { setStatus(""); setReason(""); }} style={{ background: "#fff", color: "#333", border: "1px solid #ddd", padding: "8px 12px", borderRadius: 6 }}>
          Reset
        </button>
      </div>
    </div>
  );
}

/** small helper to initialize approval controls from localStorage if present */
function useEffectOnceOnMount(uid, setStatus, setReason) {
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("approvalComments");
      const map = raw ? JSON.parse(raw) : {};
      if (map && map[uid]) {
        setStatus(map[uid].status || "");
        setReason(map[uid].reason || "");
      }
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);
}
