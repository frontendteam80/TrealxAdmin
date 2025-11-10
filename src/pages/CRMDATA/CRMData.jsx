 // src/pages/AgentDetails/AgentDetails.jsx
import React, { useEffect, useState, useMemo, useRef } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import { useApi } from "../../API/Api.js";
import { useNavigate } from "react-router-dom";
import DataTable, { Pagination } from "../../Utils/Table.jsx";

export default function AgentDetails() {
  const { fetchData } = useApi();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({});
  const [openFilter, setOpenFilter] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 11;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const filterRef = useRef(null);

  // ✅ Fetch data
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

  // ✅ Filter + Search Logic
  useEffect(() => {
    let result = [...data];

    // Apply filters
    Object.keys(filters).forEach((key) => {
      const selected = filters[key];
      if (selected && selected.length > 0 && !selected.includes("All")) {
        result = result.filter((row) => selected.includes(row[key]));
      }
    });

    // Apply search
    if (searchValue) {
      const lower = searchValue.toLowerCase();
      result = result.filter(
        (r) =>
          r.Name?.toLowerCase().includes(lower) ||
          r.Locality?.toLowerCase().includes(lower) ||
          r.Role?.toLowerCase().includes(lower) ||
          r.PropertyTypes?.toLowerCase().includes(lower) ||
          r.RefferedBy?.toLowerCase().includes(lower)
      );
    }

    setFilteredData(result);
    setPage(1);
  }, [filters, searchValue, data]);

  // ✅ Columns (no filter in S.No)
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

  // ✅ Pagination logic
  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page]);

  // ✅ Filter toggle logic
  const toggleFilter = (key) => {
    if (openFilter === key) setOpenFilter(null);
    else setOpenFilter(key);
  };

  // ✅ Filter checkbox logic
  const handleCheckboxChange = (key, value) =>
    setFilters((prev) => {
      const current = prev[key] || [];
      if (value === "All") return { ...prev, [key]: ["All"] };
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current.filter((v) => v !== "All"), value];
      return { ...prev, [key]: updated };
    });

  // ✅ Clear and Apply filter
  const clearFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: [] }));
    setFilteredData(data);
    setOpenFilter(null);
  };

  const applyFilter = () => {
    setOpenFilter(null);
  };

  // ✅ Unique values for filters
  const uniqueValues = (key) =>
    Array.from(new Set(data.map((d) => d[key]).filter(Boolean)));

  // ✅ Handle outside click to close filters
  useEffect(() => {
    function handleClickOutside(e) {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setOpenFilter(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));

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
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg);}
          to { transform: rotate(360deg);}
        }
      `}</style>
    </div>
  );

  const extraDetails = selectedRow
    ? Object.entries(selectedRow).filter(
        ([key]) => !mainKeys.includes(key) && selectedRow[key] !== null
      )
    : [];

  return (
    <div className="dashboard-container" style={{ display: "flex",height: "100vh",
        overflow: "hidden", }}>
      <Sidebar />
      <div style={{ flex: 1, padding: 20,marginLeft: "180px" }}>
        {/* ✅ Back Button */}
        <button
          onClick={() => navigate(-1)} // go back properly
          style={{
            background: "#fff",
            border: "1px solid #e8e0e0ff",
            borderRadius: 8,
            padding: "6px 14px",
            cursor: "pointer",
            fontSize: "0.9rem",
            color: "#121212",
            //transition: "transform 0.2s, box-shadow 0.2s",
           // marginBottom: 10,
          }}
        >
          Back
        </button>

        <main className="main-content" style={{ flex: 1, padding: 24 }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <h2 style={{ margin: 0 }}>CRM Data</h2>
            <div
              style={{
                fontWeight: "bold",
                fontSize: "1.1rem",
                color: "#d4af37",
              }}
            >
              Kiran Reddy Pallaki
            </div>
          </div>

          {/* Table Section */}
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
              ref={filterRef}
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

          {/* Slide Panel */}
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
                <style>{`
                  @keyframes slideIn {
                    from { transform: translateX(100%);}
                    to { transform: translateX(0);}
                  }
                `}</style>

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

                <h3 style={{ marginTop: 0, marginBottom: 12 }}>
                  {selectedRow.Name ?? "Agent Details"}
                </h3>

                <div style={{ marginBottom: 12 }}>
                  <div><strong>Name:</strong> {selectedRow.Name ?? "-"}</div>
                  <div><strong>Mobile:</strong> {selectedRow.MobileNumber ?? "-"}</div>
                  <div><strong>Email:</strong> {selectedRow.EMail ?? "-"}</div>
                  <div><strong>Locality:</strong> {selectedRow.Locality ?? "-"}</div>
                  <div><strong>Partner:</strong> {selectedRow.Role ?? "-"}</div>
                  <div><strong>Property Type:</strong> {selectedRow.PropertyTypes ?? "-"}</div>
                  <div><strong>Referred By:</strong> {selectedRow.RefferedBy ?? "-"}</div>
                </div>

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
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
