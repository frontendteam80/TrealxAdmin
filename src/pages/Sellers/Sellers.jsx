 
// // // import React, { useEffect, useState } from "react";
// // // import Sidebar from "../../components/Sidebar.jsx";
// // // import Table from "../../Utils/Table.jsx";
// // // import { useApi } from "../../API/Api.js";

// // // function LocationCell({ value }) {
// // //   const [showAll, setShowAll] = useState(false);
// // //   if (!value || typeof value !== "string") return null;
// // //   const locations = value.split(",").map(item => item.trim());
// // //   const firstLocation = locations[0];
// // //   const hasMore = locations.length > 1;
// // //   return (
// // //     <span
// // //       style={{
// // //         cursor: hasMore ? "pointer" : "default",
// // //         color: hasMore ? "black" : "black",
// // //       }}
// // //       onClick={() => hasMore && setShowAll(!showAll)}
// // //       title={hasMore ? (showAll ? "Click to collapse" : "Click to expand full address") : ""}
// // //     >
// // //       {showAll
// // //         ? locations.join(", ")
// // //         : (
// // //           <>
// // //             {firstLocation}
// // //             {hasMore ? ",..." : ""}
// // //           </>
// // //         )
// // //       }
// // //     </span>
// // //   );
// // // }

// // // export default function Sellers() {
// // //   const [sellers, setSellers] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState(null);
// // //   const { fetchData } = useApi();

// // //   useEffect(() => {
// // //     async function load() {
// // //       try {
// // //         const data = await fetchData("SellersDetails");
// // //         // Defensive: always map in a serial number
// // //         const arr = Array.isArray(data) ? data : data.data || [];
// // //         setSellers(arr.map((row, idx) => ({
// // //           ...row,
// // //           serialNo: idx + 1
// // //         })));
// // //       } catch (err) {
// // //         setError(err.message || "Error loading sellers");
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     }
// // //     load();
// // //   }, [fetchData]);

// // //   const columns = [
// // //     { label: "S.No", key: "serialNo" },
// // //     { label: "Seller Id", key: "Sellerid" },
// // //     { label: "Seller Name", key: "SellerName" },
// // //     { 
// // //       label: "Residential Address",
// // //       key: "ResidentialAddress",
// // //       render: (val) => <LocationCell value={val} />
// // //     },
// // //     {
// // //       label: "Owner",
// // //       key: "IslegalOwner",
// // //       render: (val) => val ? "yes" : "no",
// // //     },
// // //     { label: "Contact Number", key: "ContactNumber" },
// // //     { label: "Email", key: "Email" },
// // //   ];

// // //   if (error) return <div>Error: {error}</div>;
// // //   if (loading) return <div>Loading...</div>;

// // //   return (
// // //     <div className="dashboard-container" style={{ display: "flex", backgroundColor: "#fff" }}>
// // //       <Sidebar />
// // //       <div
// // //         className="buyers-content"
// // //         style={{
// // //           flex: 1,
// // //           minHeight: "100vh",
// // //           overflowX: "auto",
// // //           padding: 24,
// // //           marginLeft: "180px"
// // //         }}
// // //       >
// // //         <div
// // //           style={{
// // //             display: "flex",
// // //             alignItems: "center",
// // //             justifyContent: "space-between",
// // //             marginBottom: 20,
// // //            // marginLeft: "180px",
// // //           }}
// // //         >
// // //           <h2 style={{ margin: 0 }}>Sellers</h2>
// // //           <div
// // //             style={{
// // //               fontWeight: "bold",
// // //               fontSize: "1.1rem",
// // //               color: "#d4af37",
// // //             }}
// // //           >
// // //             Kiran Reddy Pallaki
// // //           </div>
// // //         </div>
// // //         <Table columns={columns} paginatedData={sellers} rowsPerPage={15} />
// // //       </div>
// // //     </div>
// // //   );
// // // }
// // import React, { useEffect, useState, useMemo } from "react";
// // import Sidebar from "../../components/Sidebar.jsx";
// // import Table from "../../Utils/Table.jsx";
// // import { Filter } from "lucide-react";
// // import { useApi } from "../../API/Api.js";

// // function LocationCell({ value }) {
// //   const [showAll, setShowAll] = useState(false);
// //   if (!value || typeof value !== "string") return null;
// //   const locations = value.split(",").map(item => item.trim());
// //   const firstLocation = locations[0];
// //   const hasMore = locations.length > 1;
// //   return (
// //     <span
// //       style={{ cursor: hasMore ? "pointer" : "default", color: "black" }}
// //       onClick={() => hasMore && setShowAll(!showAll)}
// //       title={hasMore ? (showAll ? "Click to collapse" : "Click to expand full address") : ""}
// //     >
// //       {showAll ? locations.join(", ") : <>
// //         {firstLocation}
// //         {hasMore ? ",..." : ""}
// //       </>}
// //     </span>
// //   );
// // }

// // // Filter header with dropdown rendered only here
// // function HeaderWithFilter({
// //   label,
// //   columnKey,
// //   openFilter,
// //   toggleFilter,
// //   filterSearchValue,
// //   setFilterSearchValue,
// //   uniqueValues,
// //   filters,
// //   handleCheckboxChange,
// //   clearFilter,
// //   applyFilter,
// // }) {
// //   return (
// //     <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "center", position: "relative" }}>
// //       <span>{label}</span>
// //       <Filter
// //         size={14}
// //         style={{ cursor: "pointer", color: openFilter === columnKey ? "#22253b" : "#adb1bd" }}
// //         onClick={e => {
// //           e.stopPropagation();
// //           toggleFilter(columnKey);
// //           setFilterSearchValue("");
// //         }}
// //       />
// //       {openFilter === columnKey && (
// //         <div
// //           style={{
// //             position: "absolute",
// //             top: 30,
// //             right: 0,
// //             background: "#fff",
// //             border: "1px solid #ccc",
// //             boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
// //             borderRadius: 4,
// //             width: 180,
// //             maxHeight: 220,
// //             overflowY: "auto",
// //             zIndex: 1000,
// //             padding: 8,
// //             textAlign: "left",
// //           }}
// //           onClick={e => e.stopPropagation()}
// //         >
// //           <input
// //             type="text"
// //             placeholder={`Search ${label}`}
// //             value={filterSearchValue}
// //             onChange={e => setFilterSearchValue(e.target.value)}
// //             style={{
// //               width: "100%",
// //               padding: "4px 8px",
// //               marginBottom: 8,
// //               borderRadius: 4,
// //               border: "1px solid #ddd",
// //               fontSize: 13,
// //             }}
// //           />
// //           <div style={{ maxHeight: 130, overflowY: "auto" }}>
// //             {uniqueValues(columnKey)
// //               .filter(val => val?.toString().toLowerCase().includes(filterSearchValue.toLowerCase()))
// //               .map(val => (
// //                 <label key={val} style={{ display: "block", fontSize: 13, padding: "2px 0" }}>
// //                   <input
// //                     type="checkbox"
// //                     checked={filters[columnKey]?.includes(val) || false}
// //                     onChange={() => handleCheckboxChange(columnKey, val)}
// //                     style={{ marginRight: 6 }}
// //                   />
// //                   {val.toString()}
// //                 </label>
// //               ))}
// //           </div>
// //           <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
// //             <button
// //               onClick={() => clearFilter(columnKey)}
// //               style={{ fontSize: 12, background: "none", border: "none", color: "#888", cursor: "pointer" }}
// //             >
// //               Clear
// //             </button>
// //             <button
// //               onClick={applyFilter}
// //               style={{
// //                 fontSize: 12,
// //                 backgroundColor: "#2c3e50",
// //                 border: "none",
// //                 color: "#fff",
// //                 padding: "4px 8px",
// //                 borderRadius: 4,
// //                 cursor: "pointer",
// //               }}
// //             >
// //               Apply
// //             </button>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // export default function Sellers() {
// //   const { fetchData } = useApi();
// //   const [sellers, setSellers] = useState([]);
// //   const [filteredSellers, setFilteredSellers] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   const [page, setPage] = useState(1);
// //   const rowsPerPage = 15;

// //   const [openFilter, setOpenFilter] = useState(null);
// //   const [filters, setFilters] = useState({});
// //   const [filterSearchValue, setFilterSearchValue] = useState("");

// //   useEffect(() => {
// //     async function load() {
// //       try {
// //         const data = await fetchData("SellersDetails");
// //         const arr = Array.isArray(data) ? data : data.data || [];
// //         const numberedData = arr.map((row, idx) => ({
// //           ...row,
// //           serialNo: idx + 1,
// //         }));
// //         setSellers(numberedData);
// //         setFilteredSellers(numberedData);
// //       } catch (err) {
// //         setError(err.message || "Error loading sellers");
// //       } finally {
// //         setLoading(false);
// //       }
// //     }
// //     load();
// //   }, [fetchData]);

// //   const toggleFilter = (key) => {
// //     setOpenFilter(prev => (prev === key ? null : key));
// //     setFilterSearchValue("");
// //   };

// //   const handleCheckboxChange = (key, value) => {
// //     setFilters(prev => {
// //       const prevVals = prev[key] || [];
// //       const newVals = prevVals.includes(value) ? prevVals.filter(v => v !== value) : [...prevVals, value];
// //       return { ...prev, [key]: newVals };
// //     });
// //   };

// //   const clearFilter = (key) => {
// //     setFilters(prev => {
// //       const newFilters = { ...prev };
// //       delete newFilters[key];
// //       return newFilters;
// //     });
// //     setOpenFilter(null);
// //   };

// //   const applyFilter = () => {
// //     const filtered = sellers.filter(item =>
// //       Object.entries(filters).every(([key, values]) => {
// //         if (!values.length) return true;
// //         if (key === "ResidentialAddress") {
// //           const splitAddr = item[key]?.split(",").map(s => s.trim()) || [];
// //           return values.some(v => splitAddr.includes(v));
// //         }
// //         if (key === "IslegalOwner") {
// //           return values.includes(item[key] ? "yes" : "no");
// //         }
// //         return values.includes(item[key]);
// //       })
// //     );
// //     setFilteredSellers(filtered);
// //     setOpenFilter(null);
// //     setPage(1);
// //   };

// //   const uniqueValues = (key) => {
// //     if (!sellers.length) return [];
// //     if (key === "ResidentialAddress") {
// //       return Array.from(new Set(sellers.flatMap(row => row.ResidentialAddress ? row.ResidentialAddress.split(",").map(s => s.trim()) : [])));
// //     }
// //     if (key === "IslegalOwner") {
// //       return ["yes", "no"];
// //     }
// //     return Array.from(new Set(sellers.map(row => row[key]).filter(Boolean)));
// //   };

// //   const paginatedData = useMemo(() => {
// //     const start = (page - 1) * rowsPerPage;
// //     return filteredSellers.slice(start, start + rowsPerPage);
// //   }, [filteredSellers, page]);

// //   // Use HeaderWithFilter to render filter icons and dropdowns ONLY here
// //   const columns = [
// //     {
// //       label: (
// //         <HeaderWithFilter
// //           label="S.No"
// //           columnKey="serialNo"
// //           openFilter={openFilter}
// //           toggleFilter={toggleFilter}
// //           filterSearchValue={filterSearchValue}
// //           setFilterSearchValue={setFilterSearchValue}
// //           uniqueValues={uniqueValues}
// //           filters={filters}
// //           handleCheckboxChange={handleCheckboxChange}
// //           clearFilter={clearFilter}
// //           applyFilter={applyFilter}
// //         />
// //       ),
// //       key: "serialNo",
// //     },
// //     {
// //       label: (
// //         <HeaderWithFilter
// //           label="Seller Id"
// //           columnKey="Sellerid"
// //           openFilter={openFilter}
// //           toggleFilter={toggleFilter}
// //           filterSearchValue={filterSearchValue}
// //           setFilterSearchValue={setFilterSearchValue}
// //           uniqueValues={uniqueValues}
// //           filters={filters}
// //           handleCheckboxChange={handleCheckboxChange}
// //           clearFilter={clearFilter}
// //           applyFilter={applyFilter}
// //         />
// //       ),
// //       key: "Sellerid",
// //     },
// //     {
// //       label: (
// //         <HeaderWithFilter
// //           label="Seller Name"
// //           columnKey="SellerName"
// //           openFilter={openFilter}
// //           toggleFilter={toggleFilter}
// //           filterSearchValue={filterSearchValue}
// //           setFilterSearchValue={setFilterSearchValue}
// //           uniqueValues={uniqueValues}
// //           filters={filters}
// //           handleCheckboxChange={handleCheckboxChange}
// //           clearFilter={clearFilter}
// //           applyFilter={applyFilter}
// //         />
// //       ),
// //       key: "SellerName",
// //     },
// //     {
// //       label: (
// //         <HeaderWithFilter
// //           label="Residential Address"
// //           columnKey="ResidentialAddress"
// //           openFilter={openFilter}
// //           toggleFilter={toggleFilter}
// //           filterSearchValue={filterSearchValue}
// //           setFilterSearchValue={setFilterSearchValue}
// //           uniqueValues={uniqueValues}
// //           filters={filters}
// //           handleCheckboxChange={handleCheckboxChange}
// //           clearFilter={clearFilter}
// //           applyFilter={applyFilter}
// //         />
// //       ),
// //       key: "ResidentialAddress",
// //       render: val => <LocationCell value={val} />,
// //     },
// //     {
// //       label: (
// //         <HeaderWithFilter
// //           label="Owner"
// //           columnKey="IslegalOwner"
// //           openFilter={openFilter}
// //           toggleFilter={toggleFilter}
// //           filterSearchValue={filterSearchValue}
// //           setFilterSearchValue={setFilterSearchValue}
// //           uniqueValues={uniqueValues}
// //           filters={filters}
// //           handleCheckboxChange={handleCheckboxChange}
// //           clearFilter={clearFilter}
// //           applyFilter={applyFilter}
// //         />
// //       ),
// //       key: "IslegalOwner",
// //       render: val => (val ? "yes" : "no"),
// //     },
// //     {
// //       label: (
// //         <HeaderWithFilter
// //           label="Contact Number"
// //           columnKey="ContactNumber"
// //           openFilter={openFilter}
// //           toggleFilter={toggleFilter}
// //           filterSearchValue={filterSearchValue}
// //           setFilterSearchValue={setFilterSearchValue}
// //           uniqueValues={uniqueValues}
// //           filters={filters}
// //           handleCheckboxChange={handleCheckboxChange}
// //           clearFilter={clearFilter}
// //           applyFilter={applyFilter}
// //         />
// //       ),
// //       key: "ContactNumber",
// //     },
// //     {
// //       label: (
// //         <HeaderWithFilter
// //           label="Email"
// //           columnKey="Email"
// //           openFilter={openFilter}
// //           toggleFilter={toggleFilter}
// //           filterSearchValue={filterSearchValue}
// //           setFilterSearchValue={setFilterSearchValue}
// //           uniqueValues={uniqueValues}
// //           filters={filters}
// //           handleCheckboxChange={handleCheckboxChange}
// //           clearFilter={clearFilter}
// //           applyFilter={applyFilter}
// //         />
// //       ),
// //       key: "Email",
// //     },
// //   ];

// //   if (error) return <div>Error: {error}</div>;
// //   if (loading) return <div>Loading...</div>;

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
// //           marginLeft:"180px"
// //         }}
// //       >
// //         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
// //           <h2 style={{ margin: 0 }}>Sellers</h2>
// //           <div style={{ fontWeight: "bold", fontSize: "1.1rem", color: "#d4af37" }}>Kiran Reddy Pallaki</div>
// //         </div>

// //         <Table
// //           columns={columns}
// //           paginatedData={paginatedData}
// //           rowsPerPage={rowsPerPage}
// //           // Do NOT pass any filter dropdown props here to avoid duplicate dropdowns
// //           // Only pass filtering relevant props needed by Table for highlighting etc if any
// //           filters={filters}
// //           handleCheckboxChange={handleCheckboxChange}
// //         />

// //         <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
// //           <button
// //             onClick={() => setPage(p => Math.max(p - 1, 1))}
// //             disabled={page === 1}
// //             style={{ padding: "6px 12px", cursor: page === 1 ? "not-allowed" : "pointer" }}
// //           >
// //             Previous
// //           </button>
// //           <span>Page {page} of {Math.ceil(filteredSellers.length / rowsPerPage)}</span>
// //           <button
// //             onClick={() => setPage(p => Math.min(p + 1, Math.ceil(filteredSellers.length / rowsPerPage)))}
// //             disabled={page === Math.ceil(filteredSellers.length / rowsPerPage)}
// //             style={{ padding: "6px 12px", cursor: page === Math.ceil(filteredSellers.length / rowsPerPage) ? "not-allowed" : "pointer" }}
// //           >
// //             Next
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// // import React, { useEffect, useState, useMemo } from "react";
// // import Sidebar from "../../components/Sidebar.jsx";
// // import Table from "../../Utils/Table.jsx";
// // import { Pagination } from "../../Utils/Table.jsx";
// // import SearchBar from "../../Utils/SearchBar.jsx";
// // import { Filter } from "lucide-react";
// // import { useApi } from "../../API/Api.js";

// // function LocationCell({ value }) {
// //   const [showAll, setShowAll] = useState(false);
// //   if (!value || typeof value !== "string") return <>-</>;
// //   const locations = value.split(",").map(item => item.trim());
// //   const firstLocation = locations[0];
// //   const hasMore = locations.length > 1;
// //   return (
// //     <span
// //       style={{ cursor: hasMore ? "pointer" : "default", color: "black" }}
// //       onClick={() => hasMore && setShowAll(!showAll)}
// //       title={hasMore ? (showAll ? "Click to collapse" : "Click to expand full address") : ""}
// //     >
// //       {showAll ? locations.join(", ") : <>
// //         {firstLocation}
// //         {hasMore ? ",..." : ""}
// //       </>}
// //     </span>
// //   );
// // }

// // function HeaderWithFilter({
// //   label,
// //   columnKey,
// //   openFilter,
// //   toggleFilter,
// //   filterSearchValue,
// //   setFilterSearchValue,
// //   uniqueValues,
// //   filters,
// //   handleCheckboxChange,
// //   clearFilter,
// //   applyFilter,
// // }) {
// //   return (
// //     <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "center", position: "relative" }}>
// //       <span>{label}</span>
// //       <Filter
// //         size={14}
// //         style={{ cursor: "pointer", color: openFilter === columnKey ? "#22253b" : "#adb1bd" }}
// //         onClick={e => {
// //           e.stopPropagation();
// //           toggleFilter(columnKey);
// //           setFilterSearchValue("");
// //         }}
// //       />
// //       {openFilter === columnKey && (
// //         <div
// //           style={{
// //             position: "absolute",
// //             top: 30,
// //             right: 0,
// //             background: "#fff",
// //             border: "1px solid #ccc",
// //             boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
// //             borderRadius: 4,
// //             width: 180,
// //             maxHeight: 220,
// //             overflowY: "auto",
// //             zIndex: 1000,
// //             padding: 8,
// //             textAlign: "left",
// //           }}
// //           onClick={e => e.stopPropagation()}
// //         >
// //           <input
// //             type="text"
// //             placeholder={`Search ${label}`}
// //             value={filterSearchValue}
// //             onChange={e => setFilterSearchValue(e.target.value)}
// //             style={{
// //               width: "100%",
// //               padding: "4px 8px",
// //               marginBottom: 8,
// //               borderRadius: 4,
// //               border: "1px solid #ddd",
// //               fontSize: 13,
// //             }}
// //           />
// //           <div style={{ maxHeight: 130, overflowY: "auto" }}>
// //             {uniqueValues(columnKey)
// //               .filter(val => val?.toString().toLowerCase().includes(filterSearchValue.toLowerCase()))
// //               .map(val => (
// //                 <label key={val} style={{ display: "block", fontSize: 13, padding: "2px 0" }}>
// //                   <input
// //                     type="checkbox"
// //                     checked={filters[columnKey]?.includes(val) || false}
// //                     onChange={() => handleCheckboxChange(columnKey, val)}
// //                     style={{ marginRight: 6 }}
// //                   />
// //                   {val.toString()}
// //                 </label>
// //               ))}
// //           </div>
// //           <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
// //             <button
// //               onClick={() => clearFilter(columnKey)}
// //               style={{ fontSize: 12, background: "none", border: "none", color: "#888", cursor: "pointer" }}
// //             >
// //               Clear
// //             </button>
// //             <button
// //               onClick={applyFilter}
// //               style={{
// //                 fontSize: 12,
// //                 backgroundColor: "#2c3e50",
// //                 border: "none",
// //                 color: "#fff",
// //                 padding: "4px 8px",
// //                 borderRadius: 4,
// //                 cursor: "pointer",
// //               }}
// //             >
// //               Apply
// //             </button>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // export default function Sellers() {
// //   const { fetchData } = useApi();
// //   const [sellers, setSellers] = useState([]);
// //   const [filteredSellers, setFilteredSellers] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   const [page, setPage] = useState(1);
// //   const rowsPerPage = 15;

// //   const [searchQuery, setSearchQuery] = useState("");

// //   const [openFilter, setOpenFilter] = useState(null);
// //   const [filters, setFilters] = useState({});
// //   const [filterSearchValue, setFilterSearchValue] = useState("");

// //   useEffect(() => {
// //     async function load() {
// //       try {
// //         const data = await fetchData("SellersDetails");
// //         const arr = Array.isArray(data) ? data : data.data || [];
// //         const numberedData = arr.map((row, idx) => ({
// //           ...row,
// //           serialNo: idx + 1,
// //         }));
// //         setSellers(numberedData);
// //         setFilteredSellers(numberedData);
// //       } catch (err) {
// //         setError(err.message || "Error loading sellers");
// //       } finally {
// //         setLoading(false);
// //       }
// //     }
// //     load();
// //   }, [fetchData]);

// //   useEffect(() => {
// //     if (!searchQuery) {
// //       setFilteredSellers(sellers);
// //       return;
// //     }
// //     const lower = searchQuery.toLowerCase();
// //     setFilteredSellers(
// //       sellers.filter(seller =>
// //         Object.values(seller).some(
// //           val => val && val.toString().toLowerCase().includes(lower)
// //         )
// //       )
// //     );
// //     setPage(1);
// //   }, [searchQuery, sellers]);

// //   const toggleFilter = (key) => {
// //     setOpenFilter(prev => (prev === key ? null : key));
// //     setFilterSearchValue("");
// //   };

// //   const handleCheckboxChange = (key, value) => {
// //     setFilters(prev => {
// //       const prevVals = prev[key] || [];
// //       const newVals = prevVals.includes(value) ? prevVals.filter(v => v !== value) : [...prevVals, value];
// //       return { ...prev, [key]: newVals };
// //     });
// //   };

// //   const clearFilter = (key) => {
// //     setFilters(prev => {
// //       const newFilters = { ...prev };
// //       delete newFilters[key];
// //       return newFilters;
// //     });
// //     setOpenFilter(null);
// //   };

// //   const applyFilter = () => {
// //     const filtered = sellers.filter(item =>
// //       Object.entries(filters).every(([key, values]) => {
// //         if (!values.length) return true;
// //         if (key === "ResidentialAddress") {
// //           const splitAddr = item[key]?.split(",").map(s => s.trim()) || [];
// //           return values.some(v => splitAddr.includes(v));
// //         }
// //         if (key === "IslegalOwner") {
// //           return values.includes(item[key] ? "yes" : "no");
// //         }
// //         return values.includes(item[key]);
// //       })
// //     );
// //     setFilteredSellers(filtered);
// //     setOpenFilter(null);
// //     setPage(1);
// //   };

// //   const uniqueValues = (key) => {
// //     if (!sellers.length) return [];
// //     if (key === "ResidentialAddress") {
// //       return Array.from(new Set(sellers.flatMap(row => row.ResidentialAddress ? row.ResidentialAddress.split(",").map(s => s.trim()) : [])));
// //     }
// //     if (key === "IslegalOwner") {
// //       return ["yes", "no"];
// //     }
// //     return Array.from(new Set(sellers.map(row => row[key]).filter(Boolean)));
// //   };

// //   const paginatedData = useMemo(() => {
// //     const start = (page - 1) * rowsPerPage;
// //     return filteredSellers.slice(start, start + rowsPerPage);
// //   }, [filteredSellers, page]);

// //   const columns = [
// //     {
// //       label: (
// //         <HeaderWithFilter
// //           label="S.No"
// //           columnKey="serialNo"
// //           openFilter={openFilter}
// //           toggleFilter={toggleFilter}
// //           filterSearchValue={filterSearchValue}
// //           setFilterSearchValue={setFilterSearchValue}
// //           uniqueValues={uniqueValues}
// //           filters={filters}
// //           handleCheckboxChange={handleCheckboxChange}
// //           clearFilter={clearFilter}
// //           applyFilter={applyFilter}
// //           showFilterIcon={false} // optionally hide icon for serial no
// //         />
// //       ),
// //       key: "serialNo",
// //       render: (_, __, idx) => (page - 1) * rowsPerPage + idx + 1,

// //     },
// //     {
// //       label: (
// //         <HeaderWithFilter
// //           label="Seller Id"
// //           columnKey="Sellerid"
// //           openFilter={openFilter}
// //           toggleFilter={toggleFilter}
// //           filterSearchValue={filterSearchValue}
// //           setFilterSearchValue={setFilterSearchValue}
// //           uniqueValues={uniqueValues}
// //           filters={filters}
// //           handleCheckboxChange={handleCheckboxChange}
// //           clearFilter={clearFilter}
// //           applyFilter={applyFilter}
// //         />
// //       ),
// //       key: "Sellerid",
// //     },
// //     {
// //       label: (
// //         <HeaderWithFilter
// //           label="Seller Name"
// //           columnKey="SellerName"
// //           openFilter={openFilter}
// //           toggleFilter={toggleFilter}
// //           filterSearchValue={filterSearchValue}
// //           setFilterSearchValue={setFilterSearchValue}
// //           uniqueValues={uniqueValues}
// //           filters={filters}
// //           handleCheckboxChange={handleCheckboxChange}
// //           clearFilter={clearFilter}
// //           applyFilter={applyFilter}
// //         />
// //       ),
// //       key: "SellerName",
// //     },
// //     {
// //       label: (
// //         <HeaderWithFilter
// //           label="Residential Address"
// //           columnKey="ResidentialAddress"
// //           openFilter={openFilter}
// //           toggleFilter={toggleFilter}
// //           filterSearchValue={filterSearchValue}
// //           setFilterSearchValue={setFilterSearchValue}
// //           uniqueValues={uniqueValues}
// //           filters={filters}
// //           handleCheckboxChange={handleCheckboxChange}
// //           clearFilter={clearFilter}
// //           applyFilter={applyFilter}
// //         />
// //       ),
// //       key: "ResidentialAddress",
// //       render: val => <LocationCell value={val} />,
// //     },
// //     {
// //       label: (
// //         <HeaderWithFilter
// //           label="Owner"
// //           columnKey="IslegalOwner"
// //           openFilter={openFilter}
// //           toggleFilter={toggleFilter}
// //           filterSearchValue={filterSearchValue}
// //           setFilterSearchValue={setFilterSearchValue}
// //           uniqueValues={uniqueValues}
// //           filters={filters}
// //           handleCheckboxChange={handleCheckboxChange}
// //           clearFilter={clearFilter}
// //           applyFilter={applyFilter}
// //         />
// //       ),
// //       key: "IslegalOwner",
// //       render: val => (val ? "yes" : "no"),
// //     },
// //     {
// //       label: (
// //         <HeaderWithFilter
// //           label="Contact Number"
// //           columnKey="ContactNumber"
// //           openFilter={openFilter}
// //           toggleFilter={toggleFilter}
// //           filterSearchValue={filterSearchValue}
// //           setFilterSearchValue={setFilterSearchValue}
// //           uniqueValues={uniqueValues}
// //           filters={filters}
// //           handleCheckboxChange={handleCheckboxChange}
// //           clearFilter={clearFilter}
// //           applyFilter={applyFilter}
// //         />
// //       ),
// //       key: "ContactNumber",
// //     },
// //     {
// //       label: (
// //         <HeaderWithFilter
// //           label="Email"
// //           columnKey="Email"
// //           openFilter={openFilter}
// //           toggleFilter={toggleFilter}
// //           filterSearchValue={filterSearchValue}
// //           setFilterSearchValue={setFilterSearchValue}
// //           uniqueValues={uniqueValues}
// //           filters={filters}
// //           handleCheckboxChange={handleCheckboxChange}
// //           clearFilter={clearFilter}
// //           applyFilter={applyFilter}
// //         />
// //       ),
// //       key: "Email",
// //     },
// //   ];

// //   return (
// //     <div style={{ display: "flex", backgroundColor: "#fff", position: "relative" }}>
// //       <Sidebar />
// //       <div style={{ flex: 1, minHeight: "100vh", overflowX: "hidden", padding: 24, marginLeft: "180px" }}>
// //         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
// //           <h2 style={{ margin: 0 ,fontweight:400}}>Sellers</h2>
// //           <div style={{ fontWeight: "bold", fontSize: "1.1rem", color: "#d4af37" }}>Kiran Reddy Pallaki</div>
// //         </div>

// //         <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
// //           <SearchBar
// //             value={searchQuery}
// //             onChange={setSearchQuery}
// //             onSubmit={() => {}}
// //             style={{ width: 320 }}
// //           />
// //         </div>

// //         {error && <div style={{ color: "red" }}>Error: {error}</div>}
// //         {loading && <div>Loading...</div>}

// //         {!loading && !error && (
// //           <>
// //             <Table
// //               columns={columns}
// //               paginatedData={paginatedData}
// //               rowsPerPage={rowsPerPage}
// //               filters={filters}
// //               handleCheckboxChange={handleCheckboxChange}
// //             />
// //             <Pagination
// //               page={page}
// //               setPage={setPage}
// //               totalPages={Math.max(1, Math.ceil(filteredSellers.length / rowsPerPage))}
// //             />
// //           </>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }
// import React, { useEffect, useState, useMemo } from "react";
// import Sidebar from "../../components/Sidebar.jsx";
// import Table, { Pagination } from "../../Utils/Table.jsx";
// import SearchBar from "../../Utils/SearchBar.jsx";
// import { useApi } from "../../API/Api.js";

// function LocationCell({ value }) {
//   const [showAll, setShowAll] = useState(false);
//   if (!value || typeof value !== "string") return <>-</>;
//   const locations = value.split(",").map(item => item.trim());
//   const firstLocation = locations[0];
//   const hasMore = locations.length > 1;
//   return (
//     <span
//       style={{ cursor: hasMore ? "pointer" : "default", color: "black" }}
//       onClick={() => hasMore && setShowAll(!showAll)}
//       title={hasMore ? (showAll ? "Click to collapse" : "Click to expand full address") : ""}
//     >
//       {showAll ? locations.join(", ") : <>
//         {firstLocation}
//         {hasMore ? ",..." : ""}
//       </>}
//     </span>
//   );
// }

// export default function Sellers() {
//   const { fetchData } = useApi();
//   const [sellers, setSellers] = useState([]);
//   const [filteredSellers, setFilteredSellers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [page, setPage] = useState(1);
//   const rowsPerPage = 15;

//   const [searchQuery, setSearchQuery] = useState("");

//   // Filter states and UI control
//   const [filters, setFilters] = useState({});
//   const [openFilter, setOpenFilter] = useState(null);
//   const [filterSearchValue, setFilterSearchValue] = useState("");

//   useEffect(() => {
//     async function load() {
//       try {
//         const data = await fetchData("SellersDetails");
//         const arr = Array.isArray(data) ? data : data.data || [];
//         const numberedData = arr.map((row, idx) => ({
//           ...row,
//           serialNo: idx + 1,
//         }));
//         setSellers(numberedData);
//         setFilteredSellers(numberedData);
//       } catch (err) {
//         setError(err.message || "Error loading sellers");
//       } finally {
//         setLoading(false);
//       }
//     }
//     load();
//   }, [fetchData]);

//   // Search filtering
//   useEffect(() => {
//     if (!searchQuery) {
//       setFilteredSellers(sellers);
//       return;
//     }
//     const lower = searchQuery.toLowerCase();
//     setFilteredSellers(
//       sellers.filter(seller =>
//         Object.values(seller).some(val =>
//           val && val.toString().toLowerCase().includes(lower)
//         )
//       )
//     );
//     setPage(1);
//   }, [searchQuery, sellers]);

//   // Paginate the filtered results
//   const paginatedData = useMemo(() => {
//     const start = (page - 1) * rowsPerPage;
//     return filteredSellers.slice(start, start + rowsPerPage);
//   }, [filteredSellers, page]);

//   // Provide unique values for filter dropdowns
//   const uniqueValues = (key) => {
//     if (!sellers.length) return [];
//     if (key === "ResidentialAddress") {
//       return Array.from(new Set(sellers.flatMap(row =>
//         row.ResidentialAddress ? row.ResidentialAddress.split(",").map(s => s.trim()) : []
//       )));
//     }
//     if (key === "IslegalOwner") {
//       return ["yes", "no"];
//     }
//     return Array.from(new Set(sellers.map(row => row[key]).filter(Boolean)));
//   };

//   // Change handler for filter checkbox toggles
//   const handleCheckboxChange = (key, value) => {
//     setFilters(prev => {
//       const prevVals = prev[key] || [];
//       const newVals = prevVals.includes(value) ? prevVals.filter(v => v !== value) : [...prevVals, value];
//       return { ...prev, [key]: newVals };
//     });
//   };

//   const toggleFilter = (key) => {
//     setOpenFilter(prev => (prev === key ? null : key));
//     setFilterSearchValue("");
//   };

//   const clearFilter = (key) => {
//     setFilters(prev => {
//       const newFilters = { ...prev };
//       delete newFilters[key];
//       return newFilters;
//     });
//     setOpenFilter(null);
//   };

//   // Filter data by checked filter options and update filteredSellers
//   const applyFilter = () => {
//     const filtered = sellers.filter(item =>
//       Object.entries(filters).every(([key, values]) => {
//         if (!values.length) return true;
//         if (key === "ResidentialAddress") {
//           // match if any selected filter value is part of address array
//           const splitAddr = item[key]?.split(",").map(s => s.trim()) || [];
//           return values.some(v => splitAddr.includes(v));
//         }
//         if (key === "IslegalOwner") {
//           return values.includes(item[key] ? "yes" : "no");
//         }
//         return values.includes(item[key]);
//       })
//     );
//     setFilteredSellers(filtered);
//     setOpenFilter(null);
//     setPage(1);
//   };

//   // Columns definition with filtering enabled for all except serial number
//   const columns = [
//     {
//       label: "S.No",
//       key: "serialNo",
//       render: (_, __, idx) => (page - 1) * rowsPerPage + idx + 1,
//       filterable: false,
//     },
//     { label: "Seller Id", key: "Sellerid", filterable: true },
//     { label: "Seller Name", key: "SellerName", filterable: true },
//     { label: "Residential Address", key: "ResidentialAddress", render: val => <LocationCell value={val} />, filterable: true },
//     { label: "Owner", key: "IslegalOwner", render: val => (val ? "yes" : "no"), filterable: true },
//     { label: "Contact Number", key: "ContactNumber", filterable: true },
//     { label: "Email", key: "Email", filterable: true },
//   ];

//   return (
//     <div style={{ display: "flex", backgroundColor: "#fff", position: "relative" }}>
//       <Sidebar />
//       <div style={{ flex: 1, minHeight: "100vh", overflowX: "hidden", padding: 24, marginLeft: "180px" }}>
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
//           <h2 style={{ margin: 0, fontWeight: 400 }}>Sellers</h2>
//           <div style={{ fontWeight: "bold", fontSize: "1.1rem", color: "#d4af37" }}>Kiran Reddy Pallaki</div>
//         </div>

//         <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
//           <SearchBar
//             value={searchQuery}
//             onChange={setSearchQuery}
//             onSubmit={() => { }}
//             style={{ width: 320 }}
//           />
//         </div>

//         {error && <div style={{ color: "red" }}>Error: {error}</div>}
//         {loading && <div>Loading...</div>}

//         {!loading && !error && (
//           <>
//             <Table
//               columns={columns}
//               paginatedData={paginatedData}
//               filters={filters}
//               handleCheckboxChange={handleCheckboxChange}
//               openFilter={openFilter}
//               toggleFilter={toggleFilter}
//               clearFilter={clearFilter}
//               applyFilter={applyFilter}
//               uniqueValues={uniqueValues}
//             />
//             <Pagination
//               page={page}
//               setPage={setPage}
//               totalPages={Math.max(1, Math.ceil(filteredSellers.length / rowsPerPage))}
//             />
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
// src/pages/Sellers/Sellers.jsx
import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import Table, { Pagination } from "../../Utils/Table.jsx";
import SearchBar from "../../Utils/SearchBar.jsx";
import { useApi } from "../../API/Api.js";

/* small cell that toggles long address */
function LocationCell({ value }) {
  const [showAll, setShowAll] = useState(false);
  if (!value || typeof value !== "string") return <>-</>;
  const locations = value.split(",").map((s) => s.trim()).filter(Boolean);
  const first = locations[0] ?? "-";
  const hasMore = locations.length > 1;
  return (
    <span
      title={hasMore ? (showAll ? "Click to collapse" : "Click to expand full address") : ""}
      onClick={() => hasMore && setShowAll((v) => !v)}
      style={{ cursor: hasMore ? "pointer" : "default", color: "#111" }}
    >
      {showAll ? locations.join(", ") : (first + (hasMore ? ",..." : ""))}
    </span>
  );
}

export default function Sellers() {
  const { fetchData } = useApi();

  const [sellers, setSellers] = useState([]); // full dataset
  const [filtered, setFiltered] = useState([]); // after filter + search
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // table pagination & search/filter UI state
  const [page, setPage] = useState(1);
  const rowsPerPage = 15;
  const [searchQuery, setSearchQuery] = useState("");

  const [openFilter, setOpenFilter] = useState(null);
  const [filters, setFilters] = useState({});
  const [filterSearchValue, setFilterSearchValue] = useState("");

  // --- fetch sellers once ---
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchData("SellersDetails");
        const arr = Array.isArray(res) ? res : (res && Array.isArray(res.data) ? res.data : []);
        // do not put serialNo here — Table will compute using page + rowsPerPage.
        if (!mounted) return;
        setSellers(arr);
        setFiltered(arr);
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || "Failed to load sellers");
        setSellers([]);
        setFiltered([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [fetchData]);

  // --- helper: toggle filter dropdown ---
  const toggleFilter = (key) => {
    setOpenFilter((p) => (p === key ? null : key));
    setFilterSearchValue("");
  };

  // --- filter checkbox handler (maintains arrays of selected values) ---
  const handleCheckboxChange = (key, value) => {
    setFilters((prev) => {
      const prevVals = Array.isArray(prev[key]) ? [...prev[key]] : [];
      return prevVals.includes(value)
        ? { ...prev, [key]: prevVals.filter((v) => v !== value) }
        : { ...prev, [key]: [...prevVals, value] };
    });
  };

  // --- clear a single column filter ---
  const clearFilter = (key) => {
    setFilters((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
    setOpenFilter(null);
  };

  // --- apply filters to full dataset (called when user clicks Apply in dropdown) ---
  const applyFilter = () => {
    // combine filters + existing search
    let out = [...sellers];

    Object.entries(filters).forEach(([k, vals]) => {
      if (!Array.isArray(vals) || vals.length === 0) return;
      // Special handling for ResidentialAddress (contains comma-separated values)
      if (k === "ResidentialAddress") {
        out = out.filter((row) => {
          const raw = row[k] || "";
          const parts = raw.split(",").map((s) => s.trim()).filter(Boolean);
          return vals.some((v) => parts.includes(v));
        });
      } else if (k === "IslegalOwner") {
        // in dataset this might be boolean or "Y"/"N" etc.
        out = out.filter((row) => {
          const val = row[k];
          const normalized = (val === true || val === "Y" || String(val).toLowerCase() === "yes" || val === 1) ? "yes" : "no";
          return vals.includes(normalized);
        });
      } else {
        out = out.filter((row) => vals.includes(row[k]));
      }
    });

    // also apply global search if any
    if (searchQuery && String(searchQuery).trim()) {
      const lower = searchQuery.toLowerCase();
      out = out.filter((row) =>
        Object.values(row).some(
          (v) => v !== null && v !== undefined && String(v).toLowerCase().includes(lower)
        )
      );
    }

    setFiltered(out);
    setOpenFilter(null);
    setPage(1);
  };

  // unique values helper required by Table: returns array for given column key (from full dataset)
  const uniqueValues = (key) => {
    if (!sellers || sellers.length === 0) return [];
    if (key === "ResidentialAddress") {
      const all = sellers.flatMap((r) => (r.ResidentialAddress ? String(r.ResidentialAddress).split(",").map(s => s.trim()) : []));
      return Array.from(new Set(all.filter(Boolean)));
    }
    if (key === "IslegalOwner") {
      // return yes/no representation
      return ["yes", "no"];
    }
    const list = sellers.map((r) => r[key]).filter((v) => v !== null && v !== undefined && String(v).trim() !== "");
    return Array.from(new Set(list));
  };

  // --- global search effect (applies to sellers + current filters) ---
  useEffect(() => {
    const lower = String(searchQuery || "").trim().toLowerCase();
    if (!lower) {
      // re-apply filters only
      let out = [...sellers];
      Object.entries(filters).forEach(([k, vals]) => {
        if (!Array.isArray(vals) || vals.length === 0) return;
        if (k === "ResidentialAddress") {
          out = out.filter((row) => {
            const parts = row[k] ? String(row[k]).split(",").map(s => s.trim()) : [];
            return vals.some((v) => parts.includes(v));
          });
        } else if (k === "IslegalOwner") {
          out = out.filter((row) => {
            const val = row[k];
            const normalized = (val === true || val === "Y" || String(val).toLowerCase() === "yes" || val === 1) ? "yes" : "no";
            return vals.includes(normalized);
          });
        } else {
          out = out.filter((row) => vals.includes(row[k]));
        }
      });
      setFiltered(out);
      setPage(1);
      return;
    }

    // filter by search across fields + filters
    let out = sellers.filter((row) =>
      Object.values(row).some(
        (v) => v !== null && v !== undefined && String(v).toLowerCase().includes(lower)
      )
    );

    // then apply column filters on top
    Object.entries(filters).forEach(([k, vals]) => {
      if (!Array.isArray(vals) || vals.length === 0) return;
      if (k === "ResidentialAddress") {
        out = out.filter((row) => {
          const parts = row[k] ? String(row[k]).split(",").map(s => s.trim()) : [];
          return vals.some((v) => parts.includes(v));
        });
      } else if (k === "IslegalOwner") {
        out = out.filter((row) => {
          const val = row[k];
          const normalized = (val === true || val === "Y" || String(val).toLowerCase() === "yes" || val === 1) ? "yes" : "no";
          return vals.includes(normalized);
        });
      } else {
        out = out.filter((row) => vals.includes(row[k]));
      }
    });

    setFiltered(out);
    setPage(1);
  }, [searchQuery, sellers, filters]);

  // paginated slice shown to Table
  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return (filtered || []).slice(start, start + rowsPerPage);
  }, [filtered, page]);

  // columns for Table: Table will show filter icon for columns unless it thinks label is serial/action
  const columns = [
    { label: "S.No", key: "serialNo", render: (_, __, idx) => (page - 1) * rowsPerPage + idx + 1, canFilter: false },
    { label: "Seller Id", key: "Sellerid" },
    { label: "Seller Name", key: "SellerName" },
    { label: "Residential Address", key: "ResidentialAddress", render: (v) => <LocationCell value={v} /> },
    { label: "Owner", key: "IslegalOwner", render: (v) => (v ? "yes" : "no") },
    { label: "Contact Number", key: "ContactNumber" },
    { label: "Email", key: "Email" },
  ];

  if (error) return <div style={{ padding: 24 }}>Error: {error}</div>;
  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

  return (
    <div style={{ display: "flex", backgroundColor: "#fff" }}>
      <Sidebar />
      <div style={{ flex: 1, minHeight: "100vh", padding: 24, marginLeft: "180px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <h2 style={{ margin: 0, fontWeight: 600 }}>Sellers</h2>
          <div style={{ fontWeight: 700, fontSize: "1.05rem", color: "#d4af37" }}>Kiran Reddy Pallaki</div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginBottom: 16 }}>
          <div style={{ minWidth: 260 }}>
            <SearchBar value={searchQuery} onChange={setSearchQuery} onSubmit={() => {}} />
          </div>

          {/* <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* small summary */}
            {/* <div style={{ color: "#6b7280" }}>{filtered.length.toLocaleString()} records</div>
          </div> */} 
        </div>

        <Table
          columns={columns}
          paginatedData={paginatedData}
          page={page}
          rowsPerPage={rowsPerPage}
          filters={filters}
          openFilter={openFilter}
          toggleFilter={toggleFilter}
          handleCheckboxChange={handleCheckboxChange}
          uniqueValues={uniqueValues}
          clearFilter={clearFilter}
          applyFilter={applyFilter}
          // choose a stable row key if available
          rowKey={(row, idx) => row?.Sellerid ?? `seller-${(page - 1) * rowsPerPage + idx}`}
          onRowClick={() => {}}
        />

        <Pagination
          page={page}
          setPage={setPage}
          totalPages={Math.max(1, Math.ceil((filtered || []).length / rowsPerPage))}
        />
      </div>
    </div>
  );
}
  