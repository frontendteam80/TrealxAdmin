 
// import React, { useEffect, useState } from "react";
// import Sidebar from "../../components/Sidebar.jsx";
// import Table from "../../Utils/Table.jsx";
// import { useApi } from "../../API/Api.js";

// function LocationCell({ value }) {
//   const [showAll, setShowAll] = useState(false);
//   if (!value || typeof value !== "string") return null;
//   const locations = value.split(",").map(item => item.trim());
//   const firstLocation = locations[0];
//   const hasMore = locations.length > 1;
//   return (
//     <span
//       style={{
//         cursor: hasMore ? "pointer" : "default",
//         color: hasMore ? "black" : "black",
//       }}
//       onClick={() => hasMore && setShowAll(!showAll)}
//       title={hasMore ? (showAll ? "Click to collapse" : "Click to expand full address") : ""}
//     >
//       {showAll
//         ? locations.join(", ")
//         : (
//           <>
//             {firstLocation}
//             {hasMore ? ",..." : ""}
//           </>
//         )
//       }
//     </span>
//   );
// }

// export default function Sellers() {
//   const [sellers, setSellers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { fetchData } = useApi();

//   useEffect(() => {
//     async function load() {
//       try {
//         const data = await fetchData("SellersDetails");
//         // Defensive: always map in a serial number
//         const arr = Array.isArray(data) ? data : data.data || [];
//         setSellers(arr.map((row, idx) => ({
//           ...row,
//           serialNo: idx + 1
//         })));
//       } catch (err) {
//         setError(err.message || "Error loading sellers");
//       } finally {
//         setLoading(false);
//       }
//     }
//     load();
//   }, [fetchData]);

//   const columns = [
//     { label: "S.No", key: "serialNo" },
//     { label: "Seller Id", key: "Sellerid" },
//     { label: "Seller Name", key: "SellerName" },
//     { 
//       label: "Residential Address",
//       key: "ResidentialAddress",
//       render: (val) => <LocationCell value={val} />
//     },
//     {
//       label: "Owner",
//       key: "IslegalOwner",
//       render: (val) => val ? "yes" : "no",
//     },
//     { label: "Contact Number", key: "ContactNumber" },
//     { label: "Email", key: "Email" },
//   ];

//   if (error) return <div>Error: {error}</div>;
//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="dashboard-container" style={{ display: "flex", backgroundColor: "#fff" }}>
//       <Sidebar />
//       <div
//         className="buyers-content"
//         style={{
//           flex: 1,
//           minHeight: "100vh",
//           overflowX: "auto",
//           padding: 24,
//           marginLeft: "180px"
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             marginBottom: 20,
//            // marginLeft: "180px",
//           }}
//         >
//           <h2 style={{ margin: 0 }}>Sellers</h2>
//           <div
//             style={{
//               fontWeight: "bold",
//               fontSize: "1.1rem",
//               color: "#d4af37",
//             }}
//           >
//             Kiran Reddy Pallaki
//           </div>
//         </div>
//         <Table columns={columns} paginatedData={sellers} rowsPerPage={15} />
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState, useMemo } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import Table from "../../Utils/Table.jsx";
import { Filter } from "lucide-react";
import { useApi } from "../../API/Api.js";

function LocationCell({ value }) {
  const [showAll, setShowAll] = useState(false);
  if (!value || typeof value !== "string") return null;
  const locations = value.split(",").map(item => item.trim());
  const firstLocation = locations[0];
  const hasMore = locations.length > 1;
  return (
    <span
      style={{ cursor: hasMore ? "pointer" : "default", color: "black" }}
      onClick={() => hasMore && setShowAll(!showAll)}
      title={hasMore ? (showAll ? "Click to collapse" : "Click to expand full address") : ""}
    >
      {showAll ? locations.join(", ") : <>
        {firstLocation}
        {hasMore ? ",..." : ""}
      </>}
    </span>
  );
}

// Filter header with dropdown rendered only here
function HeaderWithFilter({
  label,
  columnKey,
  openFilter,
  toggleFilter,
  filterSearchValue,
  setFilterSearchValue,
  uniqueValues,
  filters,
  handleCheckboxChange,
  clearFilter,
  applyFilter,
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "center", position: "relative" }}>
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
            right: 0,
            background: "#fff",
            border: "1px solid #ccc",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            borderRadius: 4,
            width: 180,
            maxHeight: 220,
            overflowY: "auto",
            zIndex: 1000,
            padding: 8,
            textAlign: "left",
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

export default function Sellers() {
  const { fetchData } = useApi();
  const [sellers, setSellers] = useState([]);
  const [filteredSellers, setFilteredSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const rowsPerPage = 15;

  const [openFilter, setOpenFilter] = useState(null);
  const [filters, setFilters] = useState({});
  const [filterSearchValue, setFilterSearchValue] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchData("SellersDetails");
        const arr = Array.isArray(data) ? data : data.data || [];
        const numberedData = arr.map((row, idx) => ({
          ...row,
          serialNo: idx + 1,
        }));
        setSellers(numberedData);
        setFilteredSellers(numberedData);
      } catch (err) {
        setError(err.message || "Error loading sellers");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [fetchData]);

  const toggleFilter = (key) => {
    setOpenFilter(prev => (prev === key ? null : key));
    setFilterSearchValue("");
  };

  const handleCheckboxChange = (key, value) => {
    setFilters(prev => {
      const prevVals = prev[key] || [];
      const newVals = prevVals.includes(value) ? prevVals.filter(v => v !== value) : [...prevVals, value];
      return { ...prev, [key]: newVals };
    });
  };

  const clearFilter = (key) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
    setOpenFilter(null);
  };

  const applyFilter = () => {
    const filtered = sellers.filter(item =>
      Object.entries(filters).every(([key, values]) => {
        if (!values.length) return true;
        if (key === "ResidentialAddress") {
          const splitAddr = item[key]?.split(",").map(s => s.trim()) || [];
          return values.some(v => splitAddr.includes(v));
        }
        if (key === "IslegalOwner") {
          return values.includes(item[key] ? "yes" : "no");
        }
        return values.includes(item[key]);
      })
    );
    setFilteredSellers(filtered);
    setOpenFilter(null);
    setPage(1);
  };

  const uniqueValues = (key) => {
    if (!sellers.length) return [];
    if (key === "ResidentialAddress") {
      return Array.from(new Set(sellers.flatMap(row => row.ResidentialAddress ? row.ResidentialAddress.split(",").map(s => s.trim()) : [])));
    }
    if (key === "IslegalOwner") {
      return ["yes", "no"];
    }
    return Array.from(new Set(sellers.map(row => row[key]).filter(Boolean)));
  };

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredSellers.slice(start, start + rowsPerPage);
  }, [filteredSellers, page]);

  // Use HeaderWithFilter to render filter icons and dropdowns ONLY here
  const columns = [
    {
      label: (
        <HeaderWithFilter
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
        />
      ),
      key: "serialNo",
    },
    {
      label: (
        <HeaderWithFilter
          label="Seller Id"
          columnKey="Sellerid"
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
      ),
      key: "Sellerid",
    },
    {
      label: (
        <HeaderWithFilter
          label="Seller Name"
          columnKey="SellerName"
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
      ),
      key: "SellerName",
    },
    {
      label: (
        <HeaderWithFilter
          label="Residential Address"
          columnKey="ResidentialAddress"
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
      ),
      key: "ResidentialAddress",
      render: val => <LocationCell value={val} />,
    },
    {
      label: (
        <HeaderWithFilter
          label="Owner"
          columnKey="IslegalOwner"
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
      ),
      key: "IslegalOwner",
      render: val => (val ? "yes" : "no"),
    },
    {
      label: (
        <HeaderWithFilter
          label="Contact Number"
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
        />
      ),
      key: "ContactNumber",
    },
    {
      label: (
        <HeaderWithFilter
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
        />
      ),
      key: "Email",
    },
  ];

  if (error) return <div>Error: {error}</div>;
  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard-container" style={{ display: "flex", backgroundColor: "#fff", position: "relative" }}>
      <Sidebar />
      <div style={{ flex: 1, minHeight: "100vh", overflowX: "auto", padding: 24, marginLeft: "180px" }}>
        <h2>Sellers</h2>

        <Table
          columns={columns}
          paginatedData={paginatedData}
          rowsPerPage={rowsPerPage}
          // Do NOT pass any filter dropdown props here to avoid duplicate dropdowns
          // Only pass filtering relevant props needed by Table for highlighting etc if any
          filters={filters}
          handleCheckboxChange={handleCheckboxChange}
        />

        <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            disabled={page === 1}
            style={{ padding: "6px 12px", cursor: page === 1 ? "not-allowed" : "pointer" }}
          >
            Previous
          </button>
          <span>Page {page} of {Math.ceil(filteredSellers.length / rowsPerPage)}</span>
          <button
            onClick={() => setPage(p => Math.min(p + 1, Math.ceil(filteredSellers.length / rowsPerPage)))}
            disabled={page === Math.ceil(filteredSellers.length / rowsPerPage)}
            style={{ padding: "6px 12px", cursor: page === Math.ceil(filteredSellers.length / rowsPerPage) ? "not-allowed" : "pointer" }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
