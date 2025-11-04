 
 
//  import React, { useEffect, useState } from "react";
// import Sidebar from "../../components/Sidebar.jsx";
// import DataTable from "../../Utils/Table.jsx";
// import formatAmount from "../../Utils/formatAmount.js";
// import { useApi } from "../../API/Api.js"; // Your hook

// function LocationCell({ value }) {
//   const [showAll, setShowAll] = useState(false);
//   if (!value || typeof value !== "string") return <>null</>;
//   const locations = value.split(",");
//   const firstLocation = locations[0];
//   const remaining = locations.slice(1).join(", ");
//   return (
//     <span
//       style={{
//         cursor: remaining ? "pointer" : "default",
//         color: "black",
//       }}
//       onClick={() => remaining && setShowAll(!showAll)}
//       title={showAll ? "Click to collapse" : "Click to expand full address"}
//     >
//       {showAll ? value : (
//         <>
//           {firstLocation}
//           {remaining ? ",..." : ""}
//         </>
//       )}
//     </span>
//   );
// }

// export default function Buyers() {
//   const { fetchData } = useApi();
//   const [buyers, setBuyers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     async function load() {
//       try {
//         const data = await fetchData("Buyer_info");
//         setBuyers(Array.isArray(data) ? data : data.data || []);
//       } catch (err) {
//         setError(err.message || "Error loading buyers");
//       } finally {
//         setLoading(false);
//       }
//     }
//     load();
//   }, [fetchData]);

//   const columns = [
//     {
//       label: "S.No",
//       key: "serialNo",
//       render: (_, __, index) => index + 1,
//     },
//     { key: "BuyerID", label: "BuyerID" },
//     { label: "Buyer Name", key: "BuyerName" },
//     { label: "ContactNumber", key: "ContactNumber" },
//     { label: "Email", key: "Email" },
//     {
//       label: "Preferred Location",
//       key: "PreferredLocations",
//       render: (val) => <LocationCell value={val} />,
//     },
//     { label: "Property Types", key: "PropertyTypes" },
//     {
//       label: "Budget",
//       key: "BudgetMin",
//       render: (_, row) => {
//         const minAmount = formatAmount(row.BudgetMin);
//         const maxAmount = formatAmount(row.BudgetMax);
//         return `${minAmount} - ${maxAmount}`;
//       },
//     },
//     { label: "Timeline", key: "Timeline" },
//     { label: "Payment Mode", key: "PaymentMode" },
//   ];

//   if (error) return <div>Error: {error}</div>;
//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="dashboard-container" style={{ display: "flex", backgroundColor: "#fff" }}>
//       <Sidebar />
//       <div style={{ flex: 1, minHeight: "100vh", overflowX: "auto", padding: 24, marginLeft: "180px" }}>
//         <h2>Buyers</h2>
//         <DataTable columns={columns} paginatedData={buyers} rowsPerPage={15} />
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState, useMemo } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import DataTable from "../../Utils/Table.jsx";
import formatAmount from "../../Utils/formatAmount.js";
import { useApi } from "../../API/Api.js";
import { Filter, Search } from "lucide-react";

// Filter UI in header for columns
function HeaderWithFilter({ label, columnKey, openFilter, toggleFilter, filterSearchValue, setFilterSearchValue, uniqueValues, filters, handleCheckboxChange, clearFilter, applyFilter }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "center" }}>
      <span>{label}</span>
      <Filter
        size={14}
        style={{ cursor: "pointer", color: openFilter === columnKey ? "#22253b" : "#adb1bd" }}
        onClick={e => {
          e.stopPropagation();
          toggleFilter(columnKey);
          setFilterSearchValue("");
        }}
      />
      {openFilter === columnKey && (
        <div
          style={{
            position: "absolute",
            top: 30,
            background: "#fff",
            border: "1px solid #ccc",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            borderRadius: 4,
            width: 180,
            maxHeight: 220,
            overflowY: "auto",
            zIndex: 1000,
            padding: 8,
          }}
          onClick={e => e.stopPropagation()}
        >
          <input
            type="text"
            placeholder={`Search ${label}`}
            value={filterSearchValue}
            onChange={e => setFilterSearchValue(e.target.value)}
            style={{
              width: "100%",
              padding: "4px 8px",
              marginBottom: 8,
              borderRadius: 4,
              border: "1px solid #ddd",
              fontSize: 13,
            }}
          />
          <div style={{ maxHeight: 130, overflowY: "auto" }}>
            {uniqueValues(columnKey)
              .filter(val => val?.toString().toLowerCase().includes(filterSearchValue.toLowerCase()))
              .map(val => (
                <label key={val} style={{ display: "block", fontSize: 13, padding: "2px 0" }}>
                  <input
                    type="checkbox"
                    checked={filters[columnKey]?.includes(val) || false}
                    onChange={() => handleCheckboxChange(columnKey, val)}
                    style={{ marginRight: 6 }}
                  />
                  {val.toString()}
                </label>
              ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <button
              onClick={() => clearFilter(columnKey)}
              style={{ fontSize: 12, background: "none", border: "none", color: "#888", cursor: "pointer" }}
            >
              Clear
            </button>
            <button
              onClick={applyFilter}
              style={{
                fontSize: 12,
                backgroundColor: "#2c3e50",
                border: "none",
                color: "#fff",
                padding: "4px 8px",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function LocationCell({ value }) {
  const [showAll, setShowAll] = useState(false);
  if (!value || typeof value !== "string") return <>null</>;
  const locations = value.split(",");
  const firstLocation = locations[0];
  const remaining = locations.slice(1).join(", ");
  return (
    <span
      style={{
        cursor: remaining ? "pointer" : "default",
        color: "black",
      }}
      onClick={() => remaining && setShowAll(!showAll)}
      title={showAll ? "Click to collapse" : "Click to expand full address"}
    >
      {showAll ? value : <>
        {firstLocation}
        {remaining ? ",..." : ""}
      </>}
    </span>
  );
}

export default function Buyers() {
  const { fetchData } = useApi();
  const [buyers, setBuyers] = useState([]);
  const [filteredBuyers, setFilteredBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const rowsPerPage = 15;

  // Filter states
  const [openFilter, setOpenFilter] = useState(null);
  const [filters, setFilters] = useState({});
  const [filterSearchValue, setFilterSearchValue] = useState("");

  // Toggle filter dropdown for column
  const toggleFilter = (key) => {
    setOpenFilter((prev) => (prev === key ? null : key));
    setFilterSearchValue("");
  };

  // Checkbox change in filter
  const handleCheckboxChange = (key, value) => {
    setFilters((prev) => {
      const prevVals = prev[key] || [];
      const newVals = prevVals.includes(value) ? prevVals.filter((v) => v !== value) : [...prevVals, value];
      return { ...prev, [key]: newVals };
    });
  };

  // Clear filter for a column
  const clearFilter = (key) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
    setOpenFilter(null);
  };

  // Apply filter function
  const applyFilter = () => {
    let filtered = buyers.filter((item) =>
      Object.entries(filters).every(([key, values]) =>
        !values.length ? true : values.includes(item[key])
      )
    );
    setFilteredBuyers(filtered);
    setOpenFilter(null);
    setPage(1);
  };

  // Unique values for filter options per column
  const uniqueValues = (key) => {
    const vals = buyers.map(item => item[key]).filter(val => val != null);
    // For comma separated string like PreferredLocations, split and flatten
    if (key === "PreferredLocations") {
      return Array.from(new Set(vals.flatMap(v => v.split(",").map(s => s.trim()))));
    }
    return Array.from(new Set(vals));
  };

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchData("Buyer_info");
        const dataArr = Array.isArray(data) ? data : data.data || [];
        setBuyers(dataArr);
        setFilteredBuyers(dataArr);
      } catch (err) {
        setError(err.message || "Error loading buyers");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [fetchData]);

  // Columns with header filters integrated
  const columns = [
    {
      label: <HeaderWithFilter
        label="S.No"
        columnKey="serialNo"
        openFilter={openFilter}
        toggleFilter={toggleFilter}
        filterSearchValue={filterSearchValue}
        setFilterSearchValue={setFilterSearchValue}
        uniqueValues={uniqueValues}
        filters={filters}
        handleCheckboxChange={handleCheckboxChange}
        clearFilter={clearFilter}
        applyFilter={applyFilter}
      />,
      key: "serialNo",
      render: (_, __, index) => index + 1,
    },
    {
      key: "BuyerID", label: <HeaderWithFilter
        label="BuyerID"
        columnKey="BuyerID"
        openFilter={openFilter}
        toggleFilter={toggleFilter}
        filterSearchValue={filterSearchValue}
        setFilterSearchValue={setFilterSearchValue}
        uniqueValues={uniqueValues}
        filters={filters}
        handleCheckboxChange={handleCheckboxChange}
        clearFilter={clearFilter}
        applyFilter={applyFilter}
      />
    },
    {
      label: <HeaderWithFilter
        label="Buyer Name"
        columnKey="BuyerName"
        openFilter={openFilter}
        toggleFilter={toggleFilter}
        filterSearchValue={filterSearchValue}
        setFilterSearchValue={setFilterSearchValue}
        uniqueValues={uniqueValues}
        filters={filters}
        handleCheckboxChange={handleCheckboxChange}
        clearFilter={clearFilter}
        applyFilter={applyFilter}
      />,
      key: "BuyerName"
    },
    {
      label: <HeaderWithFilter
        label="ContactNumber"
        columnKey="ContactNumber"
        openFilter={openFilter}
        toggleFilter={toggleFilter}
        filterSearchValue={filterSearchValue}
        setFilterSearchValue={setFilterSearchValue}
        uniqueValues={uniqueValues}
        filters={filters}
        handleCheckboxChange={handleCheckboxChange}
        clearFilter={clearFilter}
        applyFilter={applyFilter}
      />,
      key: "ContactNumber"
    },
    {
      label: <HeaderWithFilter
        label="Email"
        columnKey="Email"
        openFilter={openFilter}
        toggleFilter={toggleFilter}
        filterSearchValue={filterSearchValue}
        setFilterSearchValue={setFilterSearchValue}
        uniqueValues={uniqueValues}
        filters={filters}
        handleCheckboxChange={handleCheckboxChange}
        clearFilter={clearFilter}
        applyFilter={applyFilter}
      />,
      key: "Email"
    },
    {
      label: <HeaderWithFilter
        label="Preferred Location"
        columnKey="PreferredLocations"
        openFilter={openFilter}
        toggleFilter={toggleFilter}
        filterSearchValue={filterSearchValue}
        setFilterSearchValue={setFilterSearchValue}
        uniqueValues={uniqueValues}
        filters={filters}
        handleCheckboxChange={handleCheckboxChange}
        clearFilter={clearFilter}
        applyFilter={applyFilter}
      />,
      key: "PreferredLocations",
      render: (val) => <LocationCell value={val} />,
    },
    {
      label: <HeaderWithFilter
        label="Property Types"
        columnKey="PropertyTypes"
        openFilter={openFilter}
        toggleFilter={toggleFilter}
        filterSearchValue={filterSearchValue}
        setFilterSearchValue={setFilterSearchValue}
        uniqueValues={uniqueValues}
        filters={filters}
        handleCheckboxChange={handleCheckboxChange}
        clearFilter={clearFilter}
        applyFilter={applyFilter}
      />,
      key: "PropertyTypes"
    },
    {
      label: <HeaderWithFilter
        label="Budget"
        columnKey="BudgetMin"
        openFilter={openFilter}
        toggleFilter={toggleFilter}
        filterSearchValue={filterSearchValue}
        setFilterSearchValue={setFilterSearchValue}
        uniqueValues={(key) => {
          // Provide unique string values for budget ranges by formatting amounts
          const vals = buyers.map(b => `${formatAmount(b.BudgetMin)} - ${formatAmount(b.BudgetMax)}`);
          return Array.from(new Set(vals));
        }}
        filters={filters}
        handleCheckboxChange={handleCheckboxChange}
        clearFilter={clearFilter}
        applyFilter={applyFilter}
      />,
      key: "BudgetMin",
      render: (_, row) => {
        const minAmount = formatAmount(row.BudgetMin);
        const maxAmount = formatAmount(row.BudgetMax);
        return `${minAmount} - ${maxAmount}`;
      },
    },
    {
      label: <HeaderWithFilter
        label="Timeline"
        columnKey="Timeline"
        openFilter={openFilter}
        toggleFilter={toggleFilter}
        filterSearchValue={filterSearchValue}
        setFilterSearchValue={setFilterSearchValue}
        uniqueValues={uniqueValues}
        filters={filters}
        handleCheckboxChange={handleCheckboxChange}
        clearFilter={clearFilter}
        applyFilter={applyFilter}
      />,
      key: "Timeline"
    },
    {
      label: <HeaderWithFilter
        label="Payment Mode"
        columnKey="PaymentMode"
        openFilter={openFilter}
        toggleFilter={toggleFilter}
        filterSearchValue={filterSearchValue}
        setFilterSearchValue={setFilterSearchValue}
        uniqueValues={uniqueValues}
        filters={filters}
        handleCheckboxChange={handleCheckboxChange}
        clearFilter={clearFilter}
        applyFilter={applyFilter}
      />,
      key: "PaymentMode"
    },
  ];

  // Pagination logic for filtered data
  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredBuyers.slice(start, start + rowsPerPage);
  }, [filteredBuyers, page]);

  return (
    <div className="dashboard-container" style={{ display: "flex", backgroundColor: "#fff", position: "relative" }}>
      <Sidebar />
      <div style={{ flex: 1, minHeight: "100vh", overflowX: "auto", padding: 24, marginLeft: "180px" }}>
        <h2>Buyers</h2>

        {error && <div style={{ color: "red" }}>Error: {error}</div>}
        {loading && <div>Loading...</div>}
        {!loading && !error && (
          <>
            <DataTable columns={columns} paginatedData={paginatedData} rowsPerPage={rowsPerPage} />
            <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button 
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                style={{ padding: "6px 12px", cursor: page <= 1 ? "not-allowed" : "pointer" }}
              >
                Previous
              </button>
              <span>Page {page} of {Math.ceil(filteredBuyers.length / rowsPerPage)}</span>
              <button
                disabled={page >= Math.ceil(filteredBuyers.length / rowsPerPage)}
                onClick={() => setPage(p => Math.min(p + 1, Math.ceil(filteredBuyers.length / rowsPerPage)))}
                style={{ padding: "6px 12px", cursor: page >= Math.ceil(filteredBuyers.length / rowsPerPage) ? "not-allowed" : "pointer" }}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
