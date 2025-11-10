 import React, { useEffect, useState, useMemo } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import DataTable,{Pagination} from "../../Utils/Table.jsx";
import formatAmount from "../../Utils/formatAmount.js";
import { useApi } from "../../API/Api.js";

function LocationCell({ value }) {
  const [showAll, setShowAll] = useState(false);
  if (!value || typeof value !== "string") return <>N/A</>;
  const locations = value.split(",").map((s) => s.trim());
  const first = locations[0];
  const rest = locations.slice(1).join(", ");
  return (
    <span
      style={{
        cursor: rest ? "pointer" : "default",
        color: "#111",
      }}
      onClick={() => rest && setShowAll((s) => !s)}
      title={showAll ? "Click to collapse" : "Click to expand full address"}
    >
      {showAll ? value : (
        <>
          {first}
          {rest ? ",..." : ""}
        </>
      )}
    </span>
  );
}

export default function Buyers() {
  const { fetchData } = useApi();
  const [buyers, setBuyers] = useState([]);
  const [filters, setFilters] = useState({});
  const [openFilter, setOpenFilter] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 15;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let canceled = false;
    async function load() {
      try {
        setLoading(true);
        const data = await fetchData("Buyer_info");
        const arr = Array.isArray(data) ? data : data?.data || [];
        if (!canceled) setBuyers(arr);
      } catch (err) {
        if (!canceled) setError(err.message || "Error loading buyers");
      } finally {
        if (!canceled) setLoading(false);
      }
    }
    load();
    return () => (canceled = true);
  }, [fetchData]);

  const handleCheckboxChange = (columnKey, value) => {
    setFilters((prev) => {
      const cur = Array.isArray(prev[columnKey]) ? [...prev[columnKey]] : [];
      return cur.includes(value)
        ? { ...prev, [columnKey]: cur.filter((v) => v !== value) }
        : { ...prev, [columnKey]: [...cur, value] };
    });
  };

  const toggleFilter = (key) => setOpenFilter((p) => (p === key ? null : key));
  const clearFilter = (key) => {
    setFilters((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
    setOpenFilter(null);
  };
  const applyFilter = () => setOpenFilter(null);
  const uniqueValues = (key) =>
    Array.from(new Set(buyers.map((b) => b[key]).filter(Boolean)));

  const filteredList = useMemo(() => {
    let list = [...buyers];
    Object.entries(filters).forEach(([key, vals]) => {
      if (vals?.length) list = list.filter((row) => vals.includes(row[key]));
    });
    if (searchValue.trim()) {
      const lower = searchValue.toLowerCase();
      list = list.filter((row) =>
        Object.values(row).some(
          (v) => v && String(v).toLowerCase().includes(lower)
        )
      );
    }
    return list;
  }, [buyers, filters, searchValue]);

  const totalPages = Math.max(1, Math.ceil(filteredList.length / rowsPerPage));
  const paginatedData = filteredList.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const columns = [
    {
      label: "S.No",
      key: "serialNo",
      canFilter: false,
      render: (_, __, i) => (page - 1) * rowsPerPage + i + 1,
    },
    { key: "BuyerID", label: "BuyerID" },
    { label: "Buyer Name", key: "BuyerName" },
    { label: "ContactNumber", key: "ContactNumber" },
    { label: "Email", key: "Email" },
    {
      label: "Preferred Location",
      key: "PreferredLocations",
      render: (val) => <LocationCell value={val} />,
    },
    { label: "Property Types", key: "PropertyTypes" },
    {
      label: "Budget",
      key: "BudgetMin",
      render: (_, row) =>
        `${formatAmount(row.BudgetMin)} - ${formatAmount(row.BudgetMax)}`,
    },
    { label: "Timeline", key: "Timeline" },
    { label: "Payment Mode", key: "PaymentMode" },
  ];

  const Spinner = (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "70vh",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          border: "4px solid #eee",
          borderTop: "4px solid #111",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <style>
        {`@keyframes spin {from{transform:rotate(0deg);}to{transform:rotate(360deg);}}`}
      </style>
    </div>
  );

  return (
    <div
      className="dashboard-container"
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden", // 🚫 No page scroll
        // backgroundColor: "#fff",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          padding: "20px 24px",
         
          boxSizing: "border-box",
          // 🚫 No inner scroll
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ✅ Heading + Search in same row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <h2
            style={{
              color: "#222",
              fontSize: "1.05rem",
              fontWeight: "600",
              margin: 0,
            }}
          >
            Buyers
          </h2>
           <div style={{ fontWeight: "bold", fontSize: "1.1rem", color: "#d4af37" }}>Kiran Reddy Pallaki</div>
          </div>
<div style={{display:"flex",justifyContent:"flex-end"}}>
          <input
            placeholder="Search buyers..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{
              
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              width: 240,
              background: "#f7fafd",
              fontSize: 14,
            }}
          />
         </div> 

        {/* ✅ Static Table (no scroll) */}
        <div
          style={{
            flex: 1,
            background: "#fff",
            borderRadius: 8,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {loading ? (
            Spinner
          ) : error ? (
            <div style={{ padding: 18, color: "red" }}>Error: {error}</div>
          ) : (
            <>
              <div>
                <DataTable
                  columns={columns}
                  paginatedData={paginatedData}
                  filters={filters}
                  openFilter={openFilter}
                  toggleFilter={toggleFilter}
                  handleCheckboxChange={handleCheckboxChange}
                  uniqueValues={uniqueValues}
                  clearFilter={clearFilter}
                  applyFilter={applyFilter}
                  page={page}
                  rowsPerPage={rowsPerPage}
                />
              </div>
              <div style={{ padding: "10px 0" }}>
                <Pagination
                  page={page}
                  setPage={setPage}
                  totalPages={totalPages}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
