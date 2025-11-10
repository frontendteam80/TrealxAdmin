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

  // ✅ Fetch API data
  useEffect(() => {
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
      } finally {
        setLoading(false);
      }
    }
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
        </div>
      </main>
    </div>
  );
}
