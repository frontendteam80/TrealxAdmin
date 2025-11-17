 // src/pages/AgentDetails/AgentDetails.jsx
import React, { useEffect, useState, useMemo, useRef } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import { useApi } from "../../API/Api.js";
import { useNavigate } from "react-router-dom";
import DataTable from "../../Utils/Table.jsx"; // your table component
import SearchBar from "../../Utils/SearchBar.jsx"; // shared search bar used on other pages

export default function AgentDetails() {
  const { fetchData } = useApi();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({});
  const [openFilter, setOpenFilter] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const filterRef = useRef(null);

  // Fetch data
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const resp = await fetchData("CRMData");
        const arr = Array.isArray(resp) ? resp : resp?.data || [];
        const mapped = arr.map((item, idx) => ({
          S_No: idx + 1,
          Name: item.Name,
          MobileNumber: item.MobileNumber,
          EMail: item.EMail,
          Role: item.Role,
          Locality: item.Locality,
          PropertyTypes: item.PropertyTypes,
          RefferedBy: item.RefferedBy,
          __raw: item, // keep original payload for details
        }));
        if (!cancelled) {
          setData(mapped);
          setFilteredData(mapped);
          setPage(1);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to fetch agent data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [fetchData]);

  // Apply filters + search
  useEffect(() => {
    let result = Array.isArray(data) ? [...data] : [];

    // column filters
    Object.keys(filters).forEach((key) => {
      const selected = filters[key];
      if (selected && selected.length > 0 && !selected.includes("All")) {
        result = result.filter((row) => selected.includes(row[key]));
      }
    });

    // search across multiple columns
    if (searchValue && searchValue.trim()) {
      const q = searchValue.trim().toLowerCase();
      result = result.filter(
        (r) =>
          (r.Name && r.Name.toLowerCase().includes(q)) ||
          (r.Locality && r.Locality.toLowerCase().includes(q)) ||
          (r.Role && r.Role.toLowerCase().includes(q)) ||
          (r.PropertyTypes && r.PropertyTypes.toLowerCase().includes(q)) ||
          (r.RefferedBy && r.RefferedBy.toLowerCase().includes(q)) ||
          (r.MobileNumber && String(r.MobileNumber).toLowerCase().includes(q)) ||
          (r.EMail && r.EMail.toLowerCase().includes(q))
      );
    }

    setFilteredData(result);
    // reset to first page on filter/search change
    setPage(1);
  }, [data, filters, searchValue]);

  // Columns
  const columns = [
    { key: "S_No", label: "S.No", noFilter: true },
    { key: "Name", label: "Name" },
    { key: "MobileNumber", label: "Mobile Number" },
    { key: "EMail", label: "Email" },
    { key: "Role", label: "Associated Partner" },
    { key: "Locality", label: "Locality" },
    { key: "PropertyTypes", label: "Property Types" },
    { key: "RefferedBy", label: "Referred By" },
  ];

  const mainKeys = columns.map((c) => c.key);

  // Paginated dataset (table can also accept this if it expects pre-paginated rows)
  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page]);

  // Filter helpers
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

  // Unique values for filters (derived from currently filtered dataset so options stay relevant)
  const uniqueValues = (key) => Array.from(new Set(filteredData.map((d) => d[key]).filter(Boolean)));

  // Close filter when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setOpenFilter(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Spinner
  const Spinner = () => (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "40vh" }}>
      <div style={{ width: 40, height: 40, border: "5px solid #e6e6e6", borderTop: "5px solid #111", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      <style>{`@keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }`}</style>
    </div>
  );

  // Extra details from original raw object
  const extraDetails = selectedRow
    ? Object.entries(selectedRow.__raw || {})
        .filter(([key]) => !mainKeys.includes(key) && selectedRow.__raw[key] !== null && selectedRow.__raw[key] !== "")
        .slice(0, 50)
    : [];

  return (
    <div className="dashboard-container" style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: 20 }}>
        {/* Back button + header row with SearchBar */}
        {/* Back Button */}
<button
  onClick={() => navigate(-1)}
  style={{
    background: "#fff",
    border: "1px solid #e8e0e0",
    borderRadius: 8,
    padding: "6px 14px",
    cursor: "pointer",
    fontSize: "0.9rem",
    color: "#121212",
  }}
>
  Back
</button>

{/* Heading + Search */}
<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,   // added space below Back button
    marginBottom: 12,
  }}
>
  <h2 style={{ margin: 0 }}>CRM Data</h2>

  <div style={{ width: 320 }}>
    <SearchBar
      value={searchValue}
      onChange={setSearchValue}
      onSubmit={() => setPage(1)}
      placeholder="Search agents, locality, email..."
    />
  </div>
</div>
 

        <main style={{ flex: 1 }}>
          <div ref={filterRef} style={{ borderRadius: 8, overflow: "hidden" }}>
            {loading ? (
              <Spinner />
            ) : error ? (
              <div style={{ color: "red" }}>{error}</div>
            ) : (
              <>
                {/* Pass page, setPage, rowsPerPage so DataTable can control paging (and render pagination once) */}
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
                  onRowClick={(row) => setSelectedRow(row)}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  setPage={setPage}
                  totalCount={filteredData.length}
                />
                {/* NOTE: No duplicate/inline Pagination rendered here — DataTable should render pagination itself once */}
              </>
            )}
          </div>

          {/* Right-side details panel (no full overlay; compact, scrolls internally if necessary) */}
          {selectedRow && (
            <div
              style={{
                position: "fixed",
                right: 18,
                top: 90,
                width: 380,
                maxHeight: "78vh",
                background: "#fff",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                borderRadius: 10,
                padding: 18,
                zIndex: 2000,
                overflowY: "auto",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3 style={{ margin: "0 0 6px 0" }}>{selectedRow.Name ?? "Agent Details"}</h3>
                  <div style={{ color: "#666", fontSize: 13 }}>Details for selected agent</div>
                </div>
                <button
                  onClick={() => setSelectedRow(null)}
                  title="Close"
                  style={{ background: "transparent", border: "none", fontSize: 18, cursor: "pointer", color: "#777" }}
                >
                  ×
                </button>
              </div>

              <div style={{ marginTop: 12, lineHeight: 1.6 }}>
                <div><strong>Mobile:</strong> {selectedRow.MobileNumber || "-"}</div>
                <div><strong>Email:</strong> {selectedRow.EMail || "-"}</div>
                <div><strong>Partner:</strong> {selectedRow.Role || "-"}</div>
                <div><strong>Locality:</strong> {selectedRow.Locality || "-"}</div>
                <div><strong>Property Types:</strong> {selectedRow.PropertyTypes || "-"}</div>
                <div><strong>Referred By:</strong> {selectedRow.RefferedBy || "-"}</div>
              </div>

              <div style={{ marginTop: 12 }}>
                <h4 style={{ margin: "8px 0 10px 0" }}>More details</h4>
                {extraDetails.length === 0 ? (
                  <div style={{ color: "#666", fontSize: 13 }}>No extra details available.</div>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      {extraDetails.map(([k, v]) => (
                        <tr key={k}>
                          <td style={{ width: "45%", padding: "6px 8px", fontWeight: 600, borderBottom: "1px solid #f2f2f2" }}>{k}</td>
                          <td style={{ padding: "6px 8px", borderBottom: "1px solid #f2f2f2" }}>{String(v)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
