<<<<<<< HEAD
 import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import { useApi } from "../../API/Api.js";

const AgentPanel = () => {
  const { fetchData } = useApi();
  const [agentData, setAgentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
=======
 import React, { useEffect, useState, useMemo } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import { useApi } from "../../API/Api.js";
import Table, { Pagination } from "../../Utils/Table.jsx"; // ✅ unified global table

export default function AgentPanel() {
  const { fetchData } = useApi();

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({});
  const [openFilter, setOpenFilter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 15;
>>>>>>> 575ef5d (newupdate)

  // ✅ Fetch API data
  useEffect(() => {
<<<<<<< HEAD
    async function load() {
      try {
        const response = await fetchData("AgentPanel");
        let agents = [];
        if (Array.isArray(response)) agents = response;
        else if (response && Array.isArray(response.data)) agents = response.data;
        setAgentData(agents.map((item, idx) => ({ ...item, serialNo: idx + 1 })));
      } catch (err) {
        setError(err.message || "Error loading agent data");
        setAgentData([]);
=======
    async function loadData() {
      try {
        setLoading(true);
        const response = await fetchData("AgentPanel");
        let agents = [];

        if (Array.isArray(response)) agents = response;
        else if (response && Array.isArray(response.data)) agents = response.data;

        const formatted = agents.map((item, idx) => ({
          serialNo: idx + 1,
          ...item,
        }));

        setData(formatted);
        setFilteredData(formatted);
      } catch (err) {
        setError(err.message || "Error loading agent data");
        setData([]);
>>>>>>> 575ef5d (newupdate)
      } finally {
        setLoading(false);
      }
    }
<<<<<<< HEAD
    load();
  }, [fetchData]);

  const columns = [
    { key: "serialNo", label: "S.No" },
    { key: "AgentName", label: "Agent Name" },
    { key: "TotalListings", label: "Total Listings" },
    { key: "AvgListingTime", label: "Avg Listing Time" },
    { key: "ApprovalRate", label: "Approval Rate" },
    { key: "ActiveListings", label: "Active Listings" },
    { key: "InActiveListings", label: "Inactive Listings" },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: 24 }}>
        <h2>Agent Panel</h2>

        {/* Inline Table (No Pagination) */}
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "16px",
              background: "#fff",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            <thead style={{ backgroundColor: "#f5f5f5" }}>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    style={{
                      textAlign: "left",
                      padding: "10px",
                      borderBottom: "1px solid #ddd",
                      fontWeight: "bold",
                    }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {agentData.length > 0 ? (
                agentData.map((row, idx) => (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: "1px solid #eee",
                      backgroundColor: idx % 2 === 0 ? "#fafafa" : "#fff",
                    }}
                  >
                    {columns.map((col) => (
                      <td key={col.key} style={{ padding: "10px" }}>
                        {row[col.key] ?? "-"}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} style={{ textAlign: "center", padding: "12px" }}>
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
=======
    loadData();
  }, [fetchData]);

  // ✅ Filtering logic
  useEffect(() => {
    let result = [...data];
    Object.keys(filters).forEach((key) => {
      const selected = filters[key];
      if (selected && selected.length > 0) {
        result = result.filter((row) => selected.includes(row[key]));
      }
    });
    setFilteredData(result);
    setPage(1);
  }, [filters, data]);

  const getUniqueValues = (key) =>
    [...new Set(data.map((item) => item[key]).filter(Boolean))];

  const handleCheckboxChange = (columnKey, value) => {
    setFilters((prev) => {
      const existing = prev[columnKey] || [];
      return existing.includes(value)
        ? { ...prev, [columnKey]: existing.filter((v) => v !== value) }
        : { ...prev, [columnKey]: [...existing, value] };
    });
  };

  const toggleFilter = (key) => {
    setOpenFilter((prev) => (prev === key ? null : key));
  };

  const clearFilter = (key) => {
    setFilters((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
    setOpenFilter(null);
  };

  const hasActiveFilter = (key) => filters[key]?.length > 0;

  // ✅ Pagination logic
  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // ✅ Unified column structure
  const columns = [
    { label: "S.No", key: "serialNo", canFilter: false },
    { label: "Agent Name", key: "AgentName" },
    { label: "Total Listings", key: "TotalListings" },
    { label: "Avg Listing Time", key: "AvgListingTime" },
    { label: "Approval Rate", key: "ApprovalRate" },
    { label: "Active Listings", key: "ActiveListings" },
    { label: "Inactive Listings", key: "InActiveListings" },
  ];

  if (loading)
    return (
      <div style={{ marginLeft: "200px", padding: 30, fontWeight: 500 }}>
        Loading...
      </div>
    );

  if (error)
    return (
      <div style={{ color: "red", marginLeft: "200px", padding: 30 }}>
        {error}
      </div>
    );

  return (
    <div style={{ display: "flex", background: "#f9fafb", minHeight: "100vh" }}>
      <Sidebar />
      <main
        style={{
          flex: 1,
          padding: 24,
          marginLeft: "180px",
          background: "#f9fafb",
        }}
      >
        <h2
          style={{
            color: "#1e293b",
            fontWeight: 600,
            marginBottom: 14,
            fontSize: "1.3rem",
          }}
        >
          Agent Panel
        </h2>

        {/* ✅ Reusable Table (same look as Active Listings) */}
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 10,
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          }}
        >
          <Table
            columns={columns}
            paginatedData={paginatedData}
            filters={filters}
            openFilter={openFilter}
            toggleFilter={toggleFilter}
            handleCheckboxChange={handleCheckboxChange}
            uniqueValues={getUniqueValues}
            clearFilter={clearFilter}
            hasActiveFilter={hasActiveFilter}
            applyFilter={() => {}}
          />

          {totalPages > 1 && (
            <Pagination
              page={page}
              setPage={setPage}
              totalPages={totalPages}
            />
          )}
>>>>>>> 575ef5d (newupdate)
        </div>
      </main>
    </div>
  );
};

export default AgentPanel;
