 
 
// // // //  import React, { useEffect, useState } from "react";
// // // // import Sidebar from "../../components/Sidebar.jsx";
// // // // import DataTable from "../../Utils/Table.jsx";
// // // // import formatAmount from "../../Utils/formatAmount.js";
// // // // import { useApi } from "../../API/Api.js"; // Your hook

// // // // function LocationCell({ value }) {
// // // //   const [showAll, setShowAll] = useState(false);
// // // //   if (!value || typeof value !== "string") return <>null</>;
// // // //   const locations = value.split(",");
// // // //   const firstLocation = locations[0];
// // // //   const remaining = locations.slice(1).join(", ");
// // // //   return (
// // // //     <span
// // // //       style={{
// // // //         cursor: remaining ? "pointer" : "default",
// // // //         color: "black",
// // // //       }}
// // // //       onClick={() => remaining && setShowAll(!showAll)}
// // // //       title={showAll ? "Click to collapse" : "Click to expand full address"}
// // // //     >
// // // //       {showAll ? value : (
// // // //         <>
// // // //           {firstLocation}
// // // //           {remaining ? ",..." : ""}
// // // //         </>
// // // //       )}
// // // //     </span>
// // // //   );
// // // // }

// // // // export default function Buyers() {
// // // //   const { fetchData } = useApi();
// // // //   const [buyers, setBuyers] = useState([]);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [error, setError] = useState(null);

// // // //   useEffect(() => {
// // // //     async function load() {
// // // //       try {
// // // //         const data = await fetchData("Buyer_info");
// // // //         setBuyers(Array.isArray(data) ? data : data.data || []);
// // // //       } catch (err) {
// // // //         setError(err.message || "Error loading buyers");
// // // //       } finally {
// // // //         setLoading(false);
// // // //       }
// // // //     }
// // // //     load();
// // // //   }, [fetchData]);

// // // //   const columns = [
// // // //     {
// // // //       label: "S.No",
// // // //       key: "serialNo",
// // // //       render: (_, __, index) => index + 1,
// // // //     },
// // // //     { key: "BuyerID", label: "BuyerID" },
// // // //     { label: "Buyer Name", key: "BuyerName" },
// // // //     { label: "ContactNumber", key: "ContactNumber" },
// // // //     { label: "Email", key: "Email" },
// // // //     {
// // // //       label: "Preferred Location",
// // // //       key: "PreferredLocations",
// // // //       render: (val) => <LocationCell value={val} />,
// // // //     },
// // // //     { label: "Property Types", key: "PropertyTypes" },
// // // //     {
// // // //       label: "Budget",
// // // //       key: "BudgetMin",
// // // //       render: (_, row) => {
// // // //         const minAmount = formatAmount(row.BudgetMin);
// // // //         const maxAmount = formatAmount(row.BudgetMax);
// // // //         return `${minAmount} - ${maxAmount}`;
// // // //       },
// // // //     },
// // // //     { label: "Timeline", key: "Timeline" },
// // // //     { label: "Payment Mode", key: "PaymentMode" },
// // // //   ];

// // // //   if (error) return <div>Error: {error}</div>;
// // // //   if (loading) return <div>Loading...</div>;

// // // //   return (
// // // //     <div className="dashboard-container" style={{ display: "flex", backgroundColor: "#fff" }}>
// // // //       <Sidebar />
// // // //       <div style={{ flex: 1, minHeight: "100vh", overflowX: "auto", padding: 24, marginLeft: "180px" }}>
// // // //         <h2>Buyers</h2>
// // // //         <DataTable columns={columns} paginatedData={buyers} rowsPerPage={15} />
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }
// // // import React, { useEffect, useState, useMemo } from "react";
// // // import Sidebar from "../../components/Sidebar.jsx";
// // // import DataTable from "../../Utils/Table.jsx";
// // // import { Pagination } from "../../Utils/Table.jsx"; // <-- Import your custom Pagination
// // // import formatAmount from "../../Utils/formatAmount.js";
// // // import { useApi } from "../../API/Api.js";
// // // import { Filter } from "lucide-react";

// // // // Column header filter UI
// // // function HeaderWithFilter({
// // //   label,
// // //   columnKey,
// // //   openFilter,
// // //   toggleFilter,
// // //   filterSearchValue,
// // //   setFilterSearchValue,
// // //   uniqueValues,
// // //   filters,
// // //   handleCheckboxChange,
// // //   clearFilter,
// // //   applyFilter,
// // // }) {
// // //   return (
// // //     <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "center", position: "relative" }}>
// // //       <span>{label}</span>
// // //       <Filter
// // //         size={14}
// // //         style={{ cursor: "pointer", color: openFilter === columnKey ? "#22253b" : "#adb1bd" }}
// // //         onClick={e => {
// // //           e.stopPropagation();
// // //           toggleFilter(columnKey);
// // //           setFilterSearchValue("");
// // //         }}
// // //       />
// // //       {openFilter === columnKey && (
// // //         <div
// // //           style={{
// // //             position: "absolute",
// // //             top: 30,
// // //             background: "#fff",
// // //             border: "1px solid #ccc",
// // //             boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
// // //             borderRadius: 4,
// // //             width: 180,
// // //             maxHeight: 220,
// // //             overflowY: "auto",
// // //             zIndex: 1000,
// // //             padding: 8,
// // //           }}
// // //           onClick={e => e.stopPropagation()}
// // //         >
// // //           <input
// // //             type="text"
// // //             placeholder={`Search ${label}`}
// // //             value={filterSearchValue}
// // //             onChange={e => setFilterSearchValue(e.target.value)}
// // //             style={{
// // //               width: "100%",
// // //               padding: "4px 8px",
// // //               marginBottom: 8,
// // //               borderRadius: 4,
// // //               border: "1px solid #ddd",
// // //               fontSize: 13,
// // //             }}
// // //           />
// // //           <div style={{ maxHeight: 130, overflowY: "auto" }}>
// // //             {uniqueValues(columnKey)
// // //               .filter(val => val?.toString().toLowerCase().includes(filterSearchValue.toLowerCase()))
// // //               .map(val => (
// // //                 <label key={val} style={{ display: "block", fontSize: 13, padding: "2px 0" }}>
// // //                   <input
// // //                     type="checkbox"
// // //                     checked={filters[columnKey]?.includes(val) || false}
// // //                     onChange={() => handleCheckboxChange(columnKey, val)}
// // //                     style={{ marginRight: 6 }}
// // //                   />
// // //                   {val.toString()}
// // //                 </label>
// // //               ))}
// // //           </div>
// // //           <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
// // //             <button
// // //               onClick={() => clearFilter(columnKey)}
// // //               style={{ fontSize: 12, background: "none", border: "none", color: "#888", cursor: "pointer" }}
// // //             >
// // //               Clear
// // //             </button>
// // //             <button
// // //               onClick={applyFilter}
// // //               style={{
// // //                 fontSize: 12,
// // //                 backgroundColor: "#2c3e50",
// // //                 border: "none",
// // //                 color: "#fff",
// // //                 padding: "4px 8px",
// // //                 borderRadius: 4,
// // //                 cursor: "pointer",
// // //               }}
// // //             >
// // //               Apply
// // //             </button>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // // // Improved LocationCell showing "N/A"
// // // function LocationCell({ value }) {
// // //   const [showAll, setShowAll] = useState(false);
// // //   if (!value || typeof value !== "string" || value.trim() === "" || value === "null") {
// // //     return <>N/A</>;
// // //   }
// // //   const locations = value.split(",").map(loc => loc.trim()).filter(Boolean);
// // //   if (locations.length === 0) return <>N/A</>;
// // //   const firstLocation = locations[0];
// // //   const remaining = locations.slice(1).join(", ");
// // //   return (
// // //     <span
// // //       style={{
// // //         cursor: remaining ? "pointer" : "default",
// // //         color: "black",
// // //       }}
// // //       onClick={() => remaining && setShowAll(!showAll)}
// // //       title={showAll ? "Click to collapse" : "Click to expand full address"}
// // //     >
// // //       {showAll ? locations.join(", ") : (
// // //         <>
// // //           {firstLocation}
// // //           {remaining ? ",..." : ""}
// // //         </>
// // //       )}
// // //     </span>
// // //   );
// // // }

// // // export default function Buyers() {
// // //   const { fetchData } = useApi();
// // //   const [buyers, setBuyers] = useState([]);
// // //   const [filteredBuyers, setFilteredBuyers] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState(null);

// // //   // Pagination
// // //   const [page, setPage] = useState(1);
// // //   const rowsPerPage = 15;

// // //   // Filter states
// // //   const [openFilter, setOpenFilter] = useState(null);
// // //   const [filters, setFilters] = useState({});
// // //   const [filterSearchValue, setFilterSearchValue] = useState("");

// // //   const toggleFilter = (key) => {
// // //     setOpenFilter((prev) => (prev === key ? null : key));
// // //     setFilterSearchValue("");
// // //   };

// // //   const handleCheckboxChange = (key, value) => {
// // //     setFilters((prev) => {
// // //       const prevVals = prev[key] || [];
// // //       const newVals = prevVals.includes(value) ? prevVals.filter((v) => v !== value) : [...prevVals, value];
// // //       return { ...prev, [key]: newVals };
// // //     });
// // //   };

// // //   const clearFilter = (key) => {
// // //     setFilters((prev) => {
// // //       const newFilters = { ...prev };
// // //       delete newFilters[key];
// // //       return newFilters;
// // //     });
// // //     setOpenFilter(null);
// // //   };

// // //   // Filter on apply
// // //   const applyFilter = () => {
// // //     let filtered = buyers.filter((item) =>
// // //       Object.entries(filters).every(([key, values]) => {
// // //         // For PreferredLocations, support comma-separated values
// // //         if (!values.length) return true;
// // //         if (key === "PreferredLocations" && typeof item[key] === "string") {
// // //           const arr = item[key].split(",").map((v) => v.trim());
// // //           return values.some((v) => arr.includes(v));
// // //         }
// // //         return values.includes(item[key]);
// // //       })
// // //     );
// // //     setFilteredBuyers(filtered);
// // //     setOpenFilter(null);
// // //     setPage(1);
// // //   };

// // //   // Unique values per column
// // //   const uniqueValues = (key) => {
// // //     const vals = buyers.map(item => item[key]).filter(val => val != null && val !== "null");
// // //     // For PreferredLocations, split and flatten
// // //     if (key === "PreferredLocations") {
// // //       return Array.from(new Set(vals.flatMap(v => v.split(",").map(s => s.trim())))).filter(Boolean);
// // //     }
// // //     return Array.from(new Set(vals));
// // //   };

// // //   useEffect(() => {
// // //     async function load() {
// // //       try {
// // //         const data = await fetchData("Buyer_info");
// // //         const dataArr = Array.isArray(data) ? data : data.data || [];
// // //         setBuyers(dataArr);
// // //         setFilteredBuyers(dataArr);
// // //       } catch (err) {
// // //         setError(err.message || "Error loading buyers");
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     }
// // //     load();
// // //   }, [fetchData]);

// // //   // Columns with header filters and LocationCell
// // //   const columns = [
// // //     {
// // //       label: <HeaderWithFilter
// // //         label="S.No"
// // //         columnKey="serialNo"
// // //         openFilter={openFilter}
// // //         toggleFilter={toggleFilter}
// // //         filterSearchValue={filterSearchValue}
// // //         setFilterSearchValue={setFilterSearchValue}
// // //         uniqueValues={uniqueValues}
// // //         filters={filters}
// // //         handleCheckboxChange={handleCheckboxChange}
// // //         clearFilter={clearFilter}
// // //         applyFilter={applyFilter}
// // //       />,
// // //       key: "serialNo",
// // //       render: (_, __, index) => index + 1,
// // //     },
// // //     {
// // //       key: "BuyerID", label: <HeaderWithFilter
// // //         label="BuyerID"
// // //         columnKey="BuyerID"
// // //         openFilter={openFilter}
// // //         toggleFilter={toggleFilter}
// // //         filterSearchValue={filterSearchValue}
// // //         setFilterSearchValue={setFilterSearchValue}
// // //         uniqueValues={uniqueValues}
// // //         filters={filters}
// // //         handleCheckboxChange={handleCheckboxChange}
// // //         clearFilter={clearFilter}
// // //         applyFilter={applyFilter}
// // //       />
// // //     },
// // //     {
// // //       label: <HeaderWithFilter
// // //         label="Buyer Name"
// // //         columnKey="BuyerName"
// // //         openFilter={openFilter}
// // //         toggleFilter={toggleFilter}
// // //         filterSearchValue={filterSearchValue}
// // //         setFilterSearchValue={setFilterSearchValue}
// // //         uniqueValues={uniqueValues}
// // //         filters={filters}
// // //         handleCheckboxChange={handleCheckboxChange}
// // //         clearFilter={clearFilter}
// // //         applyFilter={applyFilter}
// // //       />,
// // //       key: "BuyerName"
// // //     },
// // //     {
// // //       label: <HeaderWithFilter
// // //         label="ContactNumber"
// // //         columnKey="ContactNumber"
// // //         openFilter={openFilter}
// // //         toggleFilter={toggleFilter}
// // //         filterSearchValue={filterSearchValue}
// // //         setFilterSearchValue={setFilterSearchValue}
// // //         uniqueValues={uniqueValues}
// // //         filters={filters}
// // //         handleCheckboxChange={handleCheckboxChange}
// // //         clearFilter={clearFilter}
// // //         applyFilter={applyFilter}
// // //       />,
// // //       key: "ContactNumber"
// // //     },
// // //     {
// // //       label: <HeaderWithFilter
// // //         label="Email"
// // //         columnKey="Email"
// // //         openFilter={openFilter}
// // //         toggleFilter={toggleFilter}
// // //         filterSearchValue={filterSearchValue}
// // //         setFilterSearchValue={setFilterSearchValue}
// // //         uniqueValues={uniqueValues}
// // //         filters={filters}
// // //         handleCheckboxChange={handleCheckboxChange}
// // //         clearFilter={clearFilter}
// // //         applyFilter={applyFilter}
// // //       />,
// // //       key: "Email"
// // //     },
// // //     {
// // //       label: <HeaderWithFilter
// // //         label="Preferred Location"
// // //         columnKey="PreferredLocations"
// // //         openFilter={openFilter}
// // //         toggleFilter={toggleFilter}
// // //         filterSearchValue={filterSearchValue}
// // //         setFilterSearchValue={setFilterSearchValue}
// // //         uniqueValues={uniqueValues}
// // //         filters={filters}
// // //         handleCheckboxChange={handleCheckboxChange}
// // //         clearFilter={clearFilter}
// // //         applyFilter={applyFilter}
// // //       />,
// // //       key: "PreferredLocations",
// // //       render: (val) => <LocationCell value={val} />,
// // //     },
// // //     {
// // //       label: <HeaderWithFilter
// // //         label="Property Types"
// // //         columnKey="PropertyTypes"
// // //         openFilter={openFilter}
// // //         toggleFilter={toggleFilter}
// // //         filterSearchValue={filterSearchValue}
// // //         setFilterSearchValue={setFilterSearchValue}
// // //         uniqueValues={uniqueValues}
// // //         filters={filters}
// // //         handleCheckboxChange={handleCheckboxChange}
// // //         clearFilter={clearFilter}
// // //         applyFilter={applyFilter}
// // //       />,
// // //       key: "PropertyTypes"
// // //     },
// // //     {
// // //       label: <HeaderWithFilter
// // //         label="Budget"
// // //         columnKey="BudgetMin"
// // //         openFilter={openFilter}
// // //         toggleFilter={toggleFilter}
// // //         filterSearchValue={filterSearchValue}
// // //         setFilterSearchValue={setFilterSearchValue}
// // //         uniqueValues={(key) => {
// // //           // Provide unique string values for budget ranges by formatting amounts
// // //           const vals = buyers.map(b => `${formatAmount(b.BudgetMin)} - ${formatAmount(b.BudgetMax)}`);
// // //           return Array.from(new Set(vals));
// // //         }}
// // //         filters={filters}
// // //         handleCheckboxChange={handleCheckboxChange}
// // //         clearFilter={clearFilter}
// // //         applyFilter={applyFilter}
// // //       />,
// // //       key: "BudgetMin",
// // //       render: (_, row) => {
// // //         const minAmount = formatAmount(row.BudgetMin);
// // //         const maxAmount = formatAmount(row.BudgetMax);
// // //         return `${minAmount} - ${maxAmount}`;
// // //       },
// // //     },
// // //     {
// // //       label: <HeaderWithFilter
// // //         label="Timeline"
// // //         columnKey="Timeline"
// // //         openFilter={openFilter}
// // //         toggleFilter={toggleFilter}
// // //         filterSearchValue={filterSearchValue}
// // //         setFilterSearchValue={setFilterSearchValue}
// // //         uniqueValues={uniqueValues}
// // //         filters={filters}
// // //         handleCheckboxChange={handleCheckboxChange}
// // //         clearFilter={clearFilter}
// // //         applyFilter={applyFilter}
// // //       />,
// // //       key: "Timeline"
// // //     },
// // //     {
// // //       label: <HeaderWithFilter
// // //         label="Payment Mode"
// // //         columnKey="PaymentMode"
// // //         openFilter={openFilter}
// // //         toggleFilter={toggleFilter}
// // //         filterSearchValue={filterSearchValue}
// // //         setFilterSearchValue={setFilterSearchValue}
// // //         uniqueValues={uniqueValues}
// // //         filters={filters}
// // //         handleCheckboxChange={handleCheckboxChange}
// // //         clearFilter={clearFilter}
// // //         applyFilter={applyFilter}
// // //       />,
// // //       key: "PaymentMode"
// // //     },
// // //   ];

// // //   // Pagination logic for filtered data
// // //   const paginatedData = useMemo(() => {
// // //     const start = (page - 1) * rowsPerPage;
// // //     return filteredBuyers.slice(start, start + rowsPerPage);
// // //   }, [filteredBuyers, page]);

// // //   return (
// // //     <div className="dashboard-container" style={{ display: "flex", backgroundColor: "#fff", position: "relative" }}>
// // //       <Sidebar />
// // //       <div style={{ flex: 1, minHeight: "100vh", overflowX: "auto", padding: 24, marginLeft: "180px" }}>
// // //         <h2>Buyers</h2>

// // //         {error && <div style={{ color: "red" }}>Error: {error}</div>}
// // //         {loading && <div>Loading...</div>}
// // //         {!loading && !error && (
// // //           <>
// // //             <DataTable columns={columns} paginatedData={paginatedData} rowsPerPage={rowsPerPage} />
// // //             <Pagination
// // //               page={page}
// // //               setPage={setPage}
// // //               totalPages={Math.max(1, Math.ceil(filteredBuyers.length / rowsPerPage))}
// // //             />
// // //           </>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // }
// import React, { useEffect, useState, useMemo } from "react";
// import Sidebar from "../../components/Sidebar.jsx";
// import Table from "../../Utils/Table.jsx";
// import { Pagination } from "../../Utils/Table.jsx";
// import SearchBar from "../../Utils/SearchBar.jsx";
// import formatAmount from "../../Utils/formatAmount.js";
// import { useApi } from "../../API/Api.js";
// import { Filter } from "lucide-react";

// // Column header filter UI
// function HeaderWithFilter({
//   label,
//   columnKey,
//   openFilter,
//   toggleFilter,
//   filterSearchValue,
//   setFilterSearchValue,
//   uniqueValues,
//   filters,
//   handleCheckboxChange,
//   clearFilter,
//   applyFilter,
//   showFilterIcon = true,
// }) {
//   return (
//     <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "center", position: "relative" }}>
//       <span>{label}</span>
//       <Filter
//         size={14}
//         style={{ cursor: "pointer", color: openFilter === columnKey ? "#22253b" : "#adb1bd" }}
//         onClick={e => {
//           e.stopPropagation();
//           toggleFilter(columnKey);
//           setFilterSearchValue("");
//         }}
//       />
//       {openFilter === columnKey && (
//         <div
//           style={{
//             position: "absolute",
//             top: 30,
//             background: "#fff",
//             border: "1px solid #ccc",
//             boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
//             borderRadius: 4,
//             width: 180,
//             maxHeight: 220,
//             overflowY: "auto",
//             zIndex: 1000,
//             padding: 8,
//           }}
//           onClick={e => e.stopPropagation()}
//         >
//           <input
//             type="text"
//             placeholder={`Search ${label}`}
//             value={filterSearchValue}
//             onChange={e => setFilterSearchValue(e.target.value)}
//             style={{
//               width: "100%",
//               padding: "4px 8px",
//               marginBottom: 8,
//               borderRadius: 4,
//               border: "1px solid #ddd",
//               fontSize: 13,
//             }}
//           />
//           <div style={{ maxHeight: 130, overflowY: "auto" }}>
//             {uniqueValues(columnKey)
//               .filter(val => val?.toString().toLowerCase().includes(filterSearchValue.toLowerCase()))
//               .map(val => (
//                 <label key={val} style={{ display: "block", fontSize: 13, padding: "2px 0" }}>
//                   <input
//                     type="checkbox"
//                     checked={filters[columnKey]?.includes(val) || false}
//                     onChange={() => handleCheckboxChange(columnKey, val)}
//                     style={{ marginRight: 6 }}
//                   />
//                   {val.toString()}
//                 </label>
//               ))}
//           </div>
//           <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
//             <button
//               onClick={() => clearFilter(columnKey)}
//               style={{ fontSize: 12, background: "none", border: "none", color: "#888", cursor: "pointer" }}
//             >
//               Clear
//             </button>
//             <button
//               onClick={applyFilter}
//               style={{
//                 fontSize: 12,
//                 backgroundColor: "#2c3e50",
//                 border: "none",
//                 color: "#fff",
//                 padding: "4px 8px",
//                 borderRadius: 4,
//                 cursor: "pointer",
//               }}
//             >
//               Apply
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // Improved LocationCell showing "N/A"
// function LocationCell({ value }) {
//   const [showAll, setShowAll] = useState(false);
//   if (!value || typeof value !== "string" || value.trim() === "" || value === "null") {
//     return <>N/A</>;
//   }
//   const locations = value.split(",").map(loc => loc.trim()).filter(Boolean);
//   if (locations.length === 0) return <>N/A</>;
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
//       {showAll ? locations.join(", ") : (
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
//   const [filteredBuyers, setFilteredBuyers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Pagination
//   const [page, setPage] = useState(1);
//   const rowsPerPage = 15;

//   // Search bar state
//   const [searchQuery, setSearchQuery] = useState("");

//   // Filter states
//   const [openFilter, setOpenFilter] = useState(null);
//   const [filters, setFilters] = useState({});
//   const [filterSearchValue, setFilterSearchValue] = useState("");

//   // Live search filtering logic
//   useEffect(() => {
//     if (!searchQuery) {
//       setFilteredBuyers(buyers);
//       return;
//     }
//     const lower = searchQuery.toLowerCase();
//     setFilteredBuyers(
//       buyers.filter(buyer =>
//         Object.values(buyer).some(
//           val =>
//             val &&
//             val.toString().toLowerCase().includes(lower)
//         )
//       )
//     );
//     setPage(1);
//   }, [searchQuery, buyers]);

//   // Toggle filter dropdown for column
//   const toggleFilter = (key) => {
//     setOpenFilter((prev) => (prev === key ? null : key));
//     setFilterSearchValue("");
//   };

//   const handleCheckboxChange = (key, value) => {
//     setFilters((prev) => {
//       const prevVals = prev[key] || [];
//       const newVals = prevVals.includes(value) ? prevVals.filter((v) => v !== value) : [...prevVals, value];
//       return { ...prev, [key]: newVals };
//     });
//   };

//   const clearFilter = (key) => {
//     setFilters((prev) => {
//       const newFilters = { ...prev };
//       delete newFilters[key];
//       return newFilters;
//     });
//     setOpenFilter(null);
//   };

//   // Filter on apply
//   const applyFilter = () => {
//     let filtered = buyers.filter((item) =>
//       Object.entries(filters).every(([key, values]) => {
//         // For PreferredLocations, support comma-separated values
//         if (!values.length) return true;
//         if (key === "PreferredLocations" && typeof item[key] === "string") {
//           const arr = item[key].split(",").map((v) => v.trim());
//           return values.some((v) => arr.includes(v));
//         }
//         return values.includes(item[key]);
//       })
//     );
//     setFilteredBuyers(filtered);
//     setOpenFilter(null);
//     setPage(1);
//   };

//   // Unique values per column
//   const uniqueValues = (key) => {
//     const vals = buyers.map(item => item[key]).filter(val => val != null && val !== "null");
//     if (key === "PreferredLocations") {
//       return Array.from(new Set(vals.flatMap(v => v.split(",").map(s => s.trim())))).filter(Boolean);
//     }
//     return Array.from(new Set(vals));
//   };

//   useEffect(() => {
//     async function load() {
//       try {
//         const data = await fetchData("Buyer_info");
//         const dataArr = Array.isArray(data) ? data : data.data || [];
//         setBuyers(dataArr);
//         setFilteredBuyers(dataArr);
//       } catch (err) {
//         setError(err.message || "Error loading buyers");
//       } finally {
//         setLoading(false);
//       }
//     }
//     load();
//   }, [fetchData]);

//   // Columns with header filters and LocationCell
//   const columns = [
//     {
//       label: <HeaderWithFilter
//         label="S.No"
//         columnKey="serialNo"
//         openFilter={openFilter}
//         toggleFilter={toggleFilter}
//         filterSearchValue={filterSearchValue}
//         setFilterSearchValue={setFilterSearchValue}
//         uniqueValues={uniqueValues}
//         filters={filters}
//         handleCheckboxChange={handleCheckboxChange}
//         clearFilter={clearFilter}
//         applyFilter={applyFilter}
//       />,
//       key: "serialNo",
//       render: (_, __, idx) => (page - 1) * rowsPerPage + idx + 1,

//     },
//     {
//       key: "BuyerID", label: <HeaderWithFilter
//         label="BuyerID"
//         columnKey="BuyerID"
//         openFilter={openFilter}
//         toggleFilter={toggleFilter}
//         filterSearchValue={filterSearchValue}
//         setFilterSearchValue={setFilterSearchValue}
//         uniqueValues={uniqueValues}
//         filters={filters}
//         handleCheckboxChange={handleCheckboxChange}
//         clearFilter={clearFilter}
//         applyFilter={applyFilter}
//       />
//     },
//     {
//       label: <HeaderWithFilter
//         label="Buyer Name"
//         columnKey="BuyerName"
//         openFilter={openFilter}
//         toggleFilter={toggleFilter}
//         filterSearchValue={filterSearchValue}
//         setFilterSearchValue={setFilterSearchValue}
//         uniqueValues={uniqueValues}
//         filters={filters}
//         handleCheckboxChange={handleCheckboxChange}
//         clearFilter={clearFilter}
//         applyFilter={applyFilter}
//       />,
//       key: "BuyerName"
//     },
//     {
//       label: <HeaderWithFilter
//         label="ContactNumber"
//         columnKey="ContactNumber"
//         openFilter={openFilter}
//         toggleFilter={toggleFilter}
//         filterSearchValue={filterSearchValue}
//         setFilterSearchValue={setFilterSearchValue}
//         uniqueValues={uniqueValues}
//         filters={filters}
//         handleCheckboxChange={handleCheckboxChange}
//         clearFilter={clearFilter}
//         applyFilter={applyFilter}
//       />,
//       key: "ContactNumber"
//     },
//     {
//       label: <HeaderWithFilter
//         label="Email"
//         columnKey="Email"
//         openFilter={openFilter}
//         toggleFilter={toggleFilter}
//         filterSearchValue={filterSearchValue}
//         setFilterSearchValue={setFilterSearchValue}
//         uniqueValues={uniqueValues}
//         filters={filters}
//         handleCheckboxChange={handleCheckboxChange}
//         clearFilter={clearFilter}
//         applyFilter={applyFilter}
//       />,
//       key: "Email"
//     },
//     {
//       label: <HeaderWithFilter
//         label="Preferred Location"
//         columnKey="PreferredLocations"
//         openFilter={openFilter}
//         toggleFilter={toggleFilter}
//         filterSearchValue={filterSearchValue}
//         setFilterSearchValue={setFilterSearchValue}
//         uniqueValues={uniqueValues}
//         filters={filters}
//         handleCheckboxChange={handleCheckboxChange}
//         clearFilter={clearFilter}
//         applyFilter={applyFilter}
//       />,
//       key: "PreferredLocations",
//       render: (val) => <LocationCell value={val} />,
//     },
//     {
//       label: <HeaderWithFilter
//         label="Property Types"
//         columnKey="PropertyTypes"
//         openFilter={openFilter}
//         toggleFilter={toggleFilter}
//         filterSearchValue={filterSearchValue}
//         setFilterSearchValue={setFilterSearchValue}
//         uniqueValues={uniqueValues}
//         filters={filters}
//         handleCheckboxChange={handleCheckboxChange}
//         clearFilter={clearFilter}
//         applyFilter={applyFilter}
//       />,
//       key: "PropertyTypes"
//     },
//     {
//       label: <HeaderWithFilter
//         label="Budget"
//         columnKey="BudgetMin"
//         openFilter={openFilter}
//         toggleFilter={toggleFilter}
//         filterSearchValue={filterSearchValue}
//         setFilterSearchValue={setFilterSearchValue}
//         uniqueValues={(key) => {
//           // Provide unique string values for budget ranges by formatting amounts
//           const vals = buyers.map(b => `${formatAmount(b.BudgetMin)} - ${formatAmount(b.BudgetMax)}`);
//           return Array.from(new Set(vals));
//         }}
//         filters={filters}
//         handleCheckboxChange={handleCheckboxChange}
//         clearFilter={clearFilter}
//         applyFilter={applyFilter}
//       />,
//       key: "BudgetMin",
//       render: (_, row) => {
//         const minAmount = formatAmount(row.BudgetMin);
//         const maxAmount = formatAmount(row.BudgetMax);
//         return `${minAmount} - ${maxAmount}`;
//       },
//     },
//     {
//       label: <HeaderWithFilter
//         label="Timeline"
//         columnKey="Timeline"
//         openFilter={openFilter}
//         toggleFilter={toggleFilter}
//         filterSearchValue={filterSearchValue}
//         setFilterSearchValue={setFilterSearchValue}
//         uniqueValues={uniqueValues}
//         filters={filters}
//         handleCheckboxChange={handleCheckboxChange}
//         clearFilter={clearFilter}
//         applyFilter={applyFilter}
//       />,
//       key: "Timeline"
//     },
//     {
//       label: <HeaderWithFilter
//         label="Payment Mode"
//         columnKey="PaymentMode"
//         openFilter={openFilter}
//         toggleFilter={toggleFilter}
//         filterSearchValue={filterSearchValue}
//         setFilterSearchValue={setFilterSearchValue}
//         uniqueValues={uniqueValues}
//         filters={filters}
//         handleCheckboxChange={handleCheckboxChange}
//         clearFilter={clearFilter}
//         applyFilter={applyFilter}
//       />,
//       key: "PaymentMode"
//     },
//   ];

//   // Pagination logic for filtered data
//   const paginatedData = useMemo(() => {
//     const start = (page - 1) * rowsPerPage;
//     return filteredBuyers.slice(start, start + rowsPerPage);
//   }, [filteredBuyers, page]);

//   return (
//     <div className="dashboard-container" style={{ display: "flex", backgroundColor: "#fff", position: "relative" }}>
//       <Sidebar />
//       <div
//         className="buyers-content"
//         style={{
//           flex: 1,
//           position: "relative",
//           minHeight: "100vh",
//           padding: 24,
//           overflowX: "hidden",
//           maxWidth: "100%",
//           boxSizing: "border-box",
//           marginLeft:"180px"
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
//           <h2 style={{ margin: 0,    fontweight: 400 }}>Buyers</h2>
//           <div style={{ fontWeight: "bold", fontSize: "1.1rem", color: "#d4af37" }}>Kiran Reddy Pallaki</div>
//         </div>
//         {/* Global Search bar */}
//         <div style={{display:"flex",justifyContent:"flex-end", marginBottom: 16 }}>
//           <SearchBar
//             value={searchQuery}
//             onChange={setSearchQuery}
//             onSubmit={() => {}}
//             style={{width:320,margin:0}}
//           />
//         </div>

//         {error && <div style={{ color: "red" }}>Error: {error}</div>}
//         {loading && <div>Loading...</div>}
//         {!loading && !error && (
//           <>
//             <Table
//   columns={columns}
//   paginatedData={paginatedData}
//   rowsPerPage={rowsPerPage}
//   uniqueValues={uniqueValues}
//   openFilter={openFilter}
//   toggleFilter={toggleFilter}
//   filters={filters}
//   handleCheckboxChange={handleCheckboxChange}
//   clearFilter={clearFilter}
//   applyFilter={applyFilter}
//   searchValue={filterSearchValue}
//   setSearchValue={setFilterSearchValue}
// />

//             <Pagination
//               page={page}
//               setPage={setPage}
//               totalPages={Math.max(1, Math.ceil(filteredBuyers.length / rowsPerPage))}
//             />
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
// // import React, { useEffect, useState, useMemo } from "react";
// // import Sidebar from "../../components/Sidebar.jsx";
// // import Table from "../../Utils/Table.jsx";
// // import { Pagination } from "../../Utils/Table.jsx";
// // import SearchBar from "../../Utils/SearchBar.jsx";
// // import formatAmount from "../../Utils/formatAmount.js";
// // import { useApi } from "../../API/Api.js";

// // // LocationCell with expand-collapse and fallback to "N/A"
// // function LocationCell({ value }) {
// //   const [showAll, setShowAll] = useState(false);
// //   if (!value || typeof value !== "string" || value.trim() === "" || value === "null") {
// //     return <>N/A</>;
// //   }
// //   const locations = value.split(",").map(loc => loc.trim()).filter(Boolean);
// //   if (locations.length === 0) return <>N/A</>;
// //   const firstLocation = locations[0];
// //   const remaining = locations.slice(1).join(", ");
// //   return (
// //     <span
// //       style={{
// //         cursor: remaining ? "pointer" : "default",
// //         color: "black",
// //       }}
// //       onClick={() => remaining && setShowAll(!showAll)}
// //       title={showAll ? "Click to collapse" : "Click to expand full address"}
// //     >
// //       {showAll ? locations.join(", ") : (
// //         <>
// //           {firstLocation}
// //           {remaining ? ",..." : ""}
// //         </>
// //       )}
// //     </span>
// //   );
// // }

// // export default function Buyers() {
// //   const { fetchData } = useApi();
// //   const [buyers, setBuyers] = useState([]);
// //   const [filteredBuyers, setFilteredBuyers] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   // Pagination state
// //   const [page, setPage] = useState(1);
// //   const rowsPerPage = 15;

// //   // Global search input state
// //   const [searchQuery, setSearchQuery] = useState("");

// //   // Filter states — main filters and temporary selections
// //   const [filters, setFilters] = useState({});
// //   const [tempFilters, setTempFilters] = useState({});
// //   const [openFilter, setOpenFilter] = useState(null);
// //   const [filterSearchValue, setFilterSearchValue] = useState("");

// //   // Load buyers data once on mount
// //   useEffect(() => {
// //     async function load() {
// //       try {
// //         const data = await fetchData("Buyer_info");
// //         const arr = Array.isArray(data) ? data : (data?.data || []);
// //         setBuyers(arr);
// //         setFilteredBuyers(arr);
// //       } catch (err) {
// //         setError(err.message || "Error loading buyers");
// //       } finally {
// //         setLoading(false);
// //       }
// //     }
// //     load();
// //   }, [fetchData]);

// //   // Apply global search filtering on buyers data
// //   useEffect(() => {
// //     if (!searchQuery) {
// //       setFilteredBuyers(buyers);
// //       return;
// //     }
// //     const lower = searchQuery.toLowerCase();
// //     setFilteredBuyers(
// //       buyers.filter(buyer =>
// //         Object.values(buyer).some(val =>
// //           val && val.toString().toLowerCase().includes(lower)
// //         )
// //       )
// //     );
// //     setPage(1);
// //   }, [searchQuery, buyers]);

// //   // Apply column filters whenever filters object changes
// //   useEffect(() => {
// //     console.log("Filters changed:", filters);
// //     if (Object.keys(filters).length === 0) {
// //       setFilteredBuyers(buyers);
// //       setPage(1);
// //       return;
// //     }
// //     const filtered = buyers.filter(item =>
// //       Object.entries(filters).every(([key, values]) => {
// //         if (!values.length) return true;
// //         if (key === "PreferredLocations" && typeof item[key] === "string") {
// //           const arr = item[key].split(",").map(v => v.trim());
// //           return values.some(v => arr.includes(v));
// //         }
// //         if (key === "BudgetMin" && typeof item["BudgetMin"] !== "undefined" && typeof item["BudgetMax"] !== "undefined") {
// //           const budgetStr = `${formatAmount(item["BudgetMin"])} - ${formatAmount(item["BudgetMax"])}`;
// //           return values.includes(budgetStr);
// //         }
// //         return values.includes(item[key]);
// //       })
// //     );
// //     console.log("Filtered count:", filtered.length);
// //     setFilteredBuyers(filtered);
// //     setPage(1);
// //   }, [filters, buyers]);

// //   // Open filter dropdown: initialize tempFilters for that column from filters
// //   const toggleFilter = (key) => {
// //     if (openFilter === key) {
// //       setOpenFilter(null);
// //       setTempFilters(prev => {
// //         const copy = { ...prev };
// //         delete copy[key];
// //         return copy;
// //       });
// //       setFilterSearchValue("");
// //     } else {
// //       setTempFilters(prev => ({
// //         ...prev,
// //         [key]: filters[key] ? [...filters[key]] : [],
// //       }));
// //       setOpenFilter(key);
// //       setFilterSearchValue("");
// //     }
// //   };

// //   // Update temporary filter selections on checkbox toggle
// //   const handleTempCheckboxChange = (key, value) => {
// //     setTempFilters(prev => {
// //       const cur = prev[key] || [];
// //       const next = cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value];
// //       const updated = { ...prev, [key]: next };
// //       console.log("TempFilters update:", updated);
// //       return updated;
// //     });
// //   };

// //   // When user clicks "Apply", copy tempFilters to filters to trigger real filtering
// //   const applyFilter = () => {
// //     console.log("Applying filters:", tempFilters);
// //     setFilters(tempFilters);
// //     setOpenFilter(null);
// //     setFilterSearchValue("");
// //   };

// //   // Clear filter for a column: remove from filters and reset tempFilters for that key
// //   const clearFilter = (key) => {
// //     setFilters(prevFilters => {
// //       const newFilters = { ...prevFilters };
// //       delete newTemp[key];
// //       return newFilters;
// //     });
// //     // setOpenFilter(null);
// //     setTempFilters(prevTemp => {
// //       const newTemp = { ...prevTemp };
// //       delete newTemp[key];
// //       return newTemp;
// //     });
// //     setOpenFilter
// //     setFilterSearchValue("");
// //     setPage(1);
// //   };

// //   // Get unique values per column for filter checkbox options
// //   const uniqueValues = (key) => {
// //     const vals = buyers.map(item => item[key]).filter(val => val != null && val !== "null");
// //     if (key === "PreferredLocations") {
// //       return Array.from(new Set(
// //         vals.flatMap(v => typeof v === "string" ? v.split(",").map(s => s.trim()) : [])
// //       )).filter(Boolean);
// //     }
// //     if (key === "BudgetMin") {
// //       return Array.from(new Set(
// //         buyers.map(b =>
// //           `${formatAmount(b.BudgetMin)} - ${formatAmount(b.BudgetMax)}`
// //         )
// //       ));
// //     }
// //     return Array.from(new Set(vals));
// //   };

// //   // Define columns for Table (without filter UI here)
// //   const columns = [
// //     {
// //       key: "serialNo",
// //       label: "S.No",
// //       render: (_, __, idx) => (page - 1) * rowsPerPage + idx + 1,
// //     },
// //     { key: "BuyerID", label: "BuyerID" },
// //     { key: "BuyerName", label: "Buyer Name" },
// //     { key: "ContactNumber", label: "Contact Number" },
// //     { key: "Email", label: "Email" },
// //     { key: "PreferredLocations", label: "Preferred Location", render: val => <LocationCell value={val} /> },
// //     { key: "PropertyTypes", label: "Property Types" },
// //     {
// //       key: "BudgetMin",
// //       label: "Budget",
// //       render: (_, row) => `${formatAmount(row.BudgetMin)} - ${formatAmount(row.BudgetMax)}`,
// //     },
// //     { key: "Timeline", label: "Timeline" },
// //     { key: "PaymentMode", label: "Payment Mode" },
// //   ];

// //   // Compute paginated data slice
// //   const paginatedData = useMemo(() => {
// //     const start = (page - 1) * rowsPerPage;
// //     return filteredBuyers.slice(start, start + rowsPerPage);
// //   }, [filteredBuyers, page]);

// //   return (
// //     <div className="dashboard-container" style={{ display: "flex", backgroundColor: "#fff", position: "relative" }}>
// //       <Sidebar />
// //       <div
// //         className="buyers-content"
// //         style={{
// //           flex: 1,
// //           position: "relative",
// //           minHeight: "100vh",
// //           padding: 24,
// //           overflowX: "hidden",
// //           maxWidth: "100%",
// //           boxSizing: "border-box",
// //           marginLeft: "180px"
// //         }}
// //       >
// //         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
// //           <h2 style={{ margin: 0 }}>Buyers</h2>
// //           <div style={{ fontWeight: "bold", fontSize: "1.1rem", color: "#d4af37" }}>Kiran Reddy Pallaki</div>
// //         </div>

// //         {/* Global Search bar */}
// //         <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
// //           <SearchBar
// //             value={searchQuery}
// //             onChange={setSearchQuery}
// //             onSubmit={() => { }}
// //             style={{ width: 320, margin: 0 }}
// //           />
// //         </div>

// //         {error && <div style={{ color: "red" }}>Error: {error}</div>}
// //         {loading && <div>Loading...</div>}

// //         {!loading && !error && (
// //           <>
// //             <Table
// //               columns={columns}
// //               paginatedData={paginatedData}
// //               uniqueValues={uniqueValues}
// //               openFilter={openFilter}
// //               toggleFilter={toggleFilter}
// //               filters={filters}
// //               handleCheckboxChange={handleTempCheckboxChange}
// //               clearFilter={clearFilter}
// //               applyFilter={applyFilter}
// //               searchValue={filterSearchValue}
// //               setSearchValue={setFilterSearchValue}
// //             />
// //             <Pagination
// //               page={page}
// //               setPage={setPage}
// //               totalPages={Math.max(1, Math.ceil(filteredBuyers.length / rowsPerPage))}
// //             />
// //           </>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }
// src/pages/Buyers/Buyers.jsx
import React, { useEffect, useState, useMemo } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import Table, { Pagination } from "../../Utils/Table.jsx";
import SearchBar from "../../Utils/SearchBar.jsx";
import formatAmount from "../../Utils/formatAmount.js";
import { useApi } from "../../API/Api.js";

function LocationCell({ value }) {
  const [showAll, setShowAll] = useState(false);
  if (!value || typeof value !== "string" || value.trim() === "" || value === "null") {
    return <>N/A</>;
  }
  const locations = value.split(",").map((s) => s.trim()).filter(Boolean);
  if (!locations.length) return <>N/A</>;
  const first = locations[0];
  const more = locations.slice(1).join(", ");
  return (
    <span
      onClick={() => more && setShowAll((s) => !s)}
      title={showAll ? "Click to collapse" : "Click to expand full address"}
      style={{ cursor: more ? "pointer" : "default", color: "#111" }}
    >
      {showAll ? locations.join(", ") : (first + (more ? ",..." : ""))}
    </span>
  );
}

export default function Buyers() {
  const { fetchData } = useApi();
  const [buyers, setBuyers] = useState([]);
  const [filteredBuyers, setFilteredBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const rowsPerPage = 15;
  const [searchQuery, setSearchQuery] = useState("");

  const [openFilter, setOpenFilter] = useState(null);
  const [filters, setFilters] = useState({});
  const [filterSearchValue, setFilterSearchValue] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchData("Buyer_info");
        const arr = Array.isArray(data) ? data : data.data || [];
        setBuyers(arr);
        setFilteredBuyers(arr);
      } catch (err) {
        setError(err.message || "Error loading buyers");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [fetchData]);

  const toggleFilter = (key) => {
    setOpenFilter((p) => (p === key ? null : key));
    setFilterSearchValue("");
  };

  const handleCheckboxChange = (key, value) => {
    setFilters((prev) => {
      const current = prev[key] || [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: next };
    });
  };

  const clearFilter = (key) => {
    setFilters((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
    setOpenFilter(null);
  };

  const uniqueValues = (key) => {
    if (!buyers?.length) return [];
    if (key === "PreferredLocations") {
      const all = buyers.flatMap((b) =>
        b.PreferredLocations ? b.PreferredLocations.split(",").map((s) => s.trim()) : []
      );
      return Array.from(new Set(all.filter(Boolean)));
    }
    if (key === "BudgetMin") {
      const vals = buyers.map(
        (b) => `${formatAmount(b.BudgetMin)} - ${formatAmount(b.BudgetMax)}`
      );
      return Array.from(new Set(vals));
    }
    return Array.from(
      new Set(buyers.map((b) => b[key]).filter((v) => v !== null && v !== undefined))
    );
  };

  const applyFilter = () => {
    let out = buyers.filter((item) =>
      Object.entries(filters).every(([key, values]) => {
        if (!values.length) return true;
        if (key === "PreferredLocations") {
          const arr = item[key]?.split(",").map((v) => v.trim());
          return values.some((v) => arr.includes(v));
        }
        if (key === "BudgetMin") {
          const label = `${formatAmount(item.BudgetMin)} - ${formatAmount(item.BudgetMax)}`;
          return values.includes(label);
        }
        return values.includes(item[key]);
      })
    );

    const lower = searchQuery.toLowerCase();
    if (lower) {
      out = out.filter((row) =>
        Object.values(row).some(
          (v) => v && v.toString().toLowerCase().includes(lower)
        )
      );
    }

    setFilteredBuyers(out);
    setOpenFilter(null);
    setPage(1);
  };

  useEffect(() => {
    if (!searchQuery) {
      setFilteredBuyers(buyers);
      return;
    }
    const lower = searchQuery.toLowerCase();
    setFilteredBuyers(
      buyers.filter((row) =>
        Object.values(row).some(
          (v) => v && v.toString().toLowerCase().includes(lower)
        )
      )
    );
    setPage(1);
  }, [searchQuery, buyers]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredBuyers.slice(start, start + rowsPerPage);
  }, [filteredBuyers, page]);

  const columns = [
    { label: "S.No", key: "serialNo", render: (_, __, idx) => (page - 1) * rowsPerPage + idx + 1 },
    { label: "BuyerID", key: "BuyerID" },
    { label: "Buyer Name", key: "BuyerName" },
    { label: "ContactNumber", key: "ContactNumber" },
    { label: "Email", key: "Email" },
    { label: "Preferred Location", key: "PreferredLocations", render: (v) => <LocationCell value={v} /> },
    { label: "Property Types", key: "PropertyTypes" },
    {
      label: "Budget",
      key: "BudgetMin",
      render: (_, row) => `${formatAmount(row.BudgetMin)} - ${formatAmount(row.BudgetMax)}`,
    },
    { label: "Timeline", key: "Timeline" },
    { label: "Payment Mode", key: "PaymentMode" },
  ];

  if (error) return <div>Error: {error}</div>;
  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ display: "flex", backgroundColor: "#fff" }}>
      <Sidebar />
      <div style={{ flex: 1, minHeight: "100vh", padding: 24, marginLeft: "180px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <h2 style={{ margin: 0, fontWeight: 400 }}>Buyers</h2>
          <div style={{ fontWeight: 700, fontSize: "1.05rem", color: "#d4af37" }}>Kiran Reddy Pallaki</div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
          <SearchBar value={searchQuery} onChange={setSearchQuery} onSubmit={() => {}} />
          {/* <div style={{ color: "#6b7280", fontSize: 14 }}>{filteredBuyers.length} records</div> */}
        </div>

        <Table
          columns={columns}
          paginatedData={paginatedData}
          page={page}
          rowsPerPage={rowsPerPage}
          openFilter={openFilter}
          toggleFilter={toggleFilter}
          filters={filters}
          handleCheckboxChange={handleCheckboxChange}
          clearFilter={clearFilter}
          applyFilter={applyFilter}
          uniqueValues={uniqueValues}
          searchValue={filterSearchValue}
          setSearchValue={setFilterSearchValue}
        />

        <Pagination
          page={page}
          setPage={setPage}
          totalPages={Math.max(1, Math.ceil(filteredBuyers.length / rowsPerPage))}
        />
      </div>
    </div>
  );
}
