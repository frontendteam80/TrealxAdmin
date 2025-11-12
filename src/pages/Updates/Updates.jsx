 // src/pages/Updates/Updates.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar.jsx";
import { useApi } from "../../API/Api.js";
import DataTable from "../../Utils/Table.jsx"; // your DataTable (Table.jsx default export)
import BackButton from "../../Utils/Backbutton.jsx";
import SearchBar from "../../Utils/SearchBar.jsx";
import { Eye } from "lucide-react";
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
  const parts = String(dateString).split("-");
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${String(day).padStart(2, "0")}-${String(month).padStart(2, "0")}-${year}`;
  }
  return String(dateString);
}

export default function Updates() {
  const { fetchData } = useApi();
  const navigate = useNavigate();

  const [data, setData] = useState([]); // full original dataset
  const [filteredData, setFilteredData] = useState([]); // data after filters + search
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

  // apply column filters + global search -> produce filteredData
  useEffect(() => {
    let result = Array.isArray(data) ? [...data] : [];

    // apply column filters first (AND across columns)
    Object.keys(filters).forEach((key) => {
      const selected = filters[key];
      if (selected && selected.length > 0 && !selected.includes("All")) {
        result = result.filter((row) => selected.includes(row[key]));
      }
    });

    // then global search across all fields
    if (searchValue && searchValue.trim() !== "") {
      const lowerSearch = searchValue.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some(
          (val) => val && String(val).toLowerCase().includes(lowerSearch)
        )
      );
    }

    setFilteredData(result);
    setPage(1);
  }, [filters, data, searchValue]);

  // Columns config (Action uses Eye icon and navigates)
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
      render: (_, row) => {
        const projectId = row?.ProjectID;
        return (
          <span
            onClick={(e) => {
              e.stopPropagation();
              if (!projectId) {
                console.warn("Missing ProjectID for row", row);
                return;
              }
              navigate(`/price-history/${encodeURIComponent(projectId)}`);
            }}
            role="button"
            aria-label="View price history"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                if (row?.ProjectID) navigate(`/price-history/${encodeURIComponent(row.ProjectID)}`);
              }
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              padding: 4,
              margin: 0,
              lineHeight: 0,
              color: "#1b2337",
            }}
          >
            <Eye size={16} />
          </span>
        );
      },
    },
  ];

  const mainKeys = columns.map((c) => c.key);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page]);

  // toggle dropdown filter
  const toggleFilter = (key) => {
    setOpenFilter(openFilter === key ? null : key);
    // clear small search in header when switching filter to keep UX consistent
    setSearchValue((s) => s);
  };

  // checkbox change for filters (keeps parent's filters state)
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

  // IMPORTANT: uniqueValues must use the currently filtered dataset so other column dropdowns
  // show only values relevant to the active filtered dataset (as you requested).
  const uniqueValues = (key) => Array.from(new Set(filteredData.map((d) => d[key]).filter(Boolean)));

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
      <style>{`@keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }`}</style>
    </div>
  );

  const extraDetails = selectedRow
    ? Object.entries(selectedRow).filter(([key]) => !mainKeys.includes(key) && selectedRow[key] !== null && selectedRow[key] !== undefined)
    : [];

  return (
    <div className="dashboard-container" style={{ display: "flex" }}>
      <Sidebar />
      <main className="main-content" style={{ flex: 1, padding: 24 }}>
        {/* Back button (reusable) */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <BackButton onClick={() => navigate("/dashboard")} label="Back" style={{ padding: "6px 10px", fontSize: "0.9rem" }} />
        </div>

        {/* Header + Search (same row) */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, marginBottom: 15 }}>
          <h2 style={{ color: "#222", margin: 0 }}>Price Updates</h2>

          <div style={{ width: 300 }}>
            <SearchBar value={searchValue} onChange={setSearchValue} onSubmit={() => setPage(1)} pageLabel="Price Updates" />
          </div>
        </div>

        {loading ? (
          <Spinner />
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <div style={{ borderRadius: 8, overflow: "hidden", background: "#fff" }}>
            {/* Pass filteredData as `data` so dropdowns in other columns are constrained */}
            <DataTable
              columns={columns}
              data={filteredData}
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
              page={page}
              setPage={setPage}
              rowsPerPage={rowsPerPage}
              totalCount={filteredData.length}
            />
            {/* Removed duplicate Pagination below — table shows pagination internally */}
          </div>
        )}
      </main>
    </div>
  );
}
