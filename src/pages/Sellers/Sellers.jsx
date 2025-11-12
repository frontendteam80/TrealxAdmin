 // src/pages/Sellers/Sellers.jsx
import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import Table, { Pagination } from "../../Utils/Table.jsx";
import SearchBar from "../../Utils/SearchBar.jsx";
import { useApi } from "../../API/Api.js";

/* small helper to show truncated addresses */
function LocationCell({ value }) {
  const [showAll, setShowAll] = useState(false);
  if (!value || typeof value !== "string") return <>N/A</>;
  const locations = value.split(",").map((item) => item.trim());
  const firstLocation = locations[0];
  const hasMore = locations.length > 1;
  return (
    <span
      style={{
        cursor: hasMore ? "pointer" : "default",
        color: "#111",
      }}
      onClick={() => hasMore && setShowAll(!showAll)}
      title={hasMore ? (showAll ? "Click to collapse" : "Click to expand full address") : ""}
    >
      {showAll ? locations.join(", ") : (
        <>
          {firstLocation}
          {hasMore ? ",..." : ""}
        </>
      )}
    </span>
  );
}

function Spinner({ size = 36 }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
      <div
        style={{
          width: size,
          height: size,
          border: `${Math.max(3, Math.round(size / 12))}px solid #e5e7eb`,
          borderTop: `${Math.max(3, Math.round(size / 12))}px solid #111827`,
          borderRadius: "50%",
          animation: "spin 0.9s linear infinite",
        }}
      />
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function Sellers() {
  const { fetchData } = useApi();
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const rowsPerPage = 15;

  // Search + filters
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({}); // { colKey: [values...] }
  const [openFilter, setOpenFilter] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const data = await fetchData("SellersDetails");
        const arr = Array.isArray(data) ? data : data?.data || [];
        if (!mounted) return;
        setSellers(arr);
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || "Error loading sellers");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [fetchData]);

  // helper: unique values for a column based on full sellers array
  const uniqueValues = (key) => {
    const vals = sellers
      .map((r) => r?.[key])
      .filter((v) => v !== undefined && v !== null && String(v).trim() !== "");
    return Array.from(new Set(vals.map((v) => (typeof v === "string" ? v.trim() : v))));
  };

  // handle checkbox toggles from Table filter dropdown
  const handleCheckboxChange = (key, value) => {
    setFilters((prev) => {
      const prevVals = prev[key] || [];
      const next = prevVals.includes(value) ? prevVals.filter((v) => v !== value) : [...prevVals, value];
      return { ...prev, [key]: next };
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

  const applyFilter = () => {
    // just close filter, parent already uses `filters` to derive results
    setOpenFilter(null);
  };

  // Derived filteredSellers considering search + column filters
  const filteredSellers = useMemo(() => {
    let arr = Array.isArray(sellers) ? sellers.slice() : [];

    // apply column filters first
    if (filters && Object.keys(filters).length > 0) {
      arr = arr.filter((item) => {
        return Object.entries(filters).every(([colKey, vals]) => {
          if (!Array.isArray(vals) || vals.length === 0) return true;
          const cell = item?.[colKey];
          if (typeof cell === "boolean") {
            return vals.includes(cell);
          }
          if (cell === null || cell === undefined || String(cell).trim() === "") return false;
          const cellStr = String(cell).trim().toLowerCase();
          return vals.some((v) => String(v).trim().toLowerCase() === cellStr);
        });
      });
    }

    // then apply global search
    if (searchValue && searchValue.trim()) {
      const lower = searchValue.trim().toLowerCase();
      arr = arr.filter((row) =>
        Object.values(row).some((val) => val && String(val).toLowerCase().includes(lower))
      );
    }

    return arr;
  }, [sellers, filters, searchValue]);

  // keep page within bounds when filtered length changes
  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filteredSellers.length / rowsPerPage));
    if (page > totalPages) setPage(totalPages);
    if (page < 1) setPage(1);
  }, [filteredSellers.length, page]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredSellers.slice(start, start + rowsPerPage);
  }, [filteredSellers, page]);

  const columns = useMemo(() => [
    {
      label: "S.No",
      key: "serialNo",
      render: (_, __, idx) => (page - 1) * rowsPerPage + idx + 1,
      canFilter: false,
    },
    { label: "Seller Id", key: "Sellerid" },
    { label: "Seller Name", key: "SellerName" },
    {
      label: "Residential Address",
      key: "ResidentialAddress",
      render: (val) => <LocationCell value={val} />,
    },
    {
      label: "Owner",
      key: "IslegalOwner",
      render: (val) => (val ? "yes" : "no"),
    },
    {
  label: "Contact Number",
  key: "ContactNumber",
  render: (val) => (
    <div style={{ textAlign: "center"}}>
      {val || "-"}
    </div>
  ),
},
    { label: "Email", key: "Email" },
  ], [page]);

  const totalPages = Math.ceil(filteredSellers.length / rowsPerPage);

  if (error) return <div style={{ padding: 24, color: "red" }}>Error: {error}</div>;

  return (
    <div className="dashboard-container" style={{ display: "flex", backgroundColor: "#fff" }}>
      <Sidebar />
      <div
        className="buyers-content"
        style={{
          flex: 1,
          minHeight: "100vh",
          padding: 24,
         // marginLeft: "180px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden", // prevent page-level scroll
        }}
      >
        {/* Heading + Search bar in one row (SearchBar is reusable) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              margin: 0,
              color: "#222",
              fontSize: "1.05rem",
              fontWeight: "600",
            }}
          >
            Sellers
          </h2>

          <div style={{ width: 260 }}>
            <SearchBar
              value={searchValue}
              onChange={(v) => { setSearchValue(v); setPage(1); }}
              onSubmit={() => setPage(1)}
              pageLabel="Sellers"
            />
          </div>
        </div>

        <div style={{ borderRadius: 8, background: "#fff", padding: 6, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          {loading ? (
            <Spinner />
          ) : (
            <>
              <div>
                <Table
                  columns={columns}
                  paginatedData={paginatedData}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  setPage={setPage}
                  data={filteredSellers} // Table may use this for deriving unique values if needed
                  filters={filters}
                  openFilter={openFilter}
                  toggleFilter={toggleFilter}
                  handleCheckboxChange={handleCheckboxChange}
                  uniqueValues={(k) => uniqueValues(k)}
                  clearFilter={clearFilter}
                  applyFilter={applyFilter}
                  totalCount={filteredSellers.length}
                />
              </div>

              {totalPages > 1 && (
                <div style={{ padding: "10px 0" }}>
                  <Pagination page={page} setPage={setPage} totalPages={totalPages} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
