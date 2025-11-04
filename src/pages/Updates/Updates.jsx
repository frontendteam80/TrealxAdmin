 import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar.jsx";
import { useApi } from "../../API/Api.js";
import DataTable, { Pagination } from "../../Utils/Table.jsx";
import { Search, ArrowLeft } from "lucide-react";
import "./Updates.scss";

function formatDate(dateString) {
  if (!dateString) return "—";
  if (dateString.includes("T")) {
    const d = new Date(dateString);
    if (!isNaN(d)) {
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yy = d.getFullYear();
      return `${dd}-${mm}-${yy}`;
    }
  }
  const parts = dateString.split("-");
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${String(day).padStart(2, "0")}-${String(month).padStart(2, "0")}-${year}`;
  }
  return dateString;
}

export default function Updates() {
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

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const resp = await fetchData("PriceUpdatesDetails");
        const arr = Array.isArray(resp) ? resp : resp?.data || [];
        if (!cancelled) {
          setData(arr);
          setFilteredData(arr);
          setPage(1);
        }
      } catch (err) {
        if (!cancelled) setError(err?.message || "Failed to fetch updates");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [fetchData]);

  useEffect(() => {
    let result = [...data];
    Object.keys(filters).forEach((key) => {
      const selected = filters[key];
      if (selected && selected.length > 0 && !selected.includes("All")) {
        result = result.filter((row) => selected.includes(row[key]));
      }
    });

    if (searchValue.trim() !== "") {
      const lowerSearch = searchValue.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some(
          (val) =>
            val &&
            String(val).toLowerCase().includes(lowerSearch)
        )
      );
    }

    setFilteredData(result);
    setPage(1);
  }, [filters, data, searchValue]);

  const columns = [
    { key: "serial", label: "S.No", render: (_, __, idx) => idx + 1 + (page - 1) * rowsPerPage },
    { key: "ProjectID", label: "ID" },
    { key: "ProjectName", label: "Project Name" },
    { key: "Locality", label: "Locality" },
    { key: "NewPriceRange", label: "New Price" },
    { key: "NewUpdatedDate", label: "New Updated Date", render: (v) => formatDate(v) },
    { key: "UpdatedBy", label: "Updated By" },
    {
      key: "action",
      label: "Action",
      render: (_, row) => (
        <button
          className="action-button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/price-history/${row.ProjectID}`);
          }}
        >
          Click
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

  const handleCheckboxChange = (key, value) =>
    setFilters((prev) => {
      const current = prev[key] || [];
      if (value === "All") return { ...prev, [key]: ["All"] };
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current.filter((v) => v !== "All"), value];
      return { ...prev, [key]: updated };
    });

  const clearFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: [] }));
    setOpenFilter(null);
  };

  const applyFilter = () => setOpenFilter(null);

  const uniqueValues = (key) => Array.from(new Set(data.map((d) => d[key]).filter(Boolean)));

  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));

  const Spinner = () => (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
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
        {`@keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }`}
      </style>
    </div>
  );

  const extraDetails = selectedRow
    ? Object.entries(selectedRow).filter(([key]) => !mainKeys.includes(key) && selectedRow[key] !== null && selectedRow[key] !== undefined)
    : [];

  return (
    <div className="dashboard-container" style={{ display: "flex" }}>
      <Sidebar />
      <main className="main-content" style={{ flex: 1, padding: 24,marginLeft: "180px" }}>
        
        {/* ✅ Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            display: "flex",
            alignItems: "center",
            background: "transparent",
            border: "none",
            color: "#121212",
            cursor: "pointer",
            marginBottom: 10,
            fontSize: "1rem",
          }}
        >
         Back
        </button>

        {/* Heading and Search Bar Row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16}}>
          <h2 style={{ margin: 0, color: "#222" }}>Updates</h2>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: 6,
              padding: "4px 8px",
              width: 260,
            }}
          >
            <Search size={18} color="#555" style={{ marginRight: 4 }} />
            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: "0.9rem",
                background: "transparent",
              }}
            />
          </div>
        </div>

        {loading ? (
          <Spinner />
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <div style={{ borderRadius: 8, overflow: "hidden", background: "#fff" }}>
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
      </main>
    </div>
  );
}
