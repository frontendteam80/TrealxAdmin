// //  import React, { useState, useEffect, useMemo, useRef } from "react";
// // import Sidebar from "../../components/Sidebar.jsx";
// // import { useApi } from "../../API/Api.js";
// // import { useNavigate } from "react-router-dom";
// // import Table from "../../Utils/Table.jsx";

// // const formatAmount = (num) => {
// //   if (!num || isNaN(num)) return "-";
// //   const n = parseFloat(num);
// //   if (n >= 10000000) return (n / 10000000).toFixed(1).replace(/\.0$/, "") + " Cr";
// //   if (n >= 100000) return (n / 100000).toFixed(1).replace(/\.0$/, "") + " L";
// //   return n.toLocaleString("en-IN");
// // };

// // function Alerts() {
// //   const { fetchData } = useApi();
// //   const navigate = useNavigate();
// //   const filterRef = useRef();

// //   const [buyerAlerts, setBuyerAlerts] = useState([]);
// //   const [sellerAlerts, setSellerAlerts] = useState([]);
// //   const [view, setView] = useState("buyer");
// //   const [page, setPage] = useState(1);
// //   const [openFilter, setOpenFilter] = useState(null);
// //   const [filters, setFilters] = useState({});
// //   const [searchValue, setSearchValue] = useState("");
// //   const rowsPerPage = 15;

// //   useEffect(() => {
// //     const handleClickOutside = (e) => {
// //       if (filterRef.current && !filterRef.current.contains(e.target)) {
// //         setOpenFilter(null);
// //       }
// //     };
// //     document.addEventListener("mousedown", handleClickOutside);
// //     return () => document.removeEventListener("mousedown", handleClickOutside);
// //   }, []);

// //   function addSerials(arr) {
// //     return (Array.isArray(arr) ? arr : []).map((a, idx) => ({
// //       ...a,
// //       serialNo: idx + 1,
// //     }));
// //   }

// //   const fetchBuyerAlerts = async () => {
// //     const data = await fetchData("BuyerAlerts");
// //     setBuyerAlerts(addSerials(data || []));
// //   };

// //   const fetchSellerAlerts = async () => {
// //     const data = await fetchData("SellerAlerts");
// //     setSellerAlerts(addSerials(data || []));
// //   };

// //   useEffect(() => {
// //     fetchBuyerAlerts();
// //     fetchSellerAlerts();
// //   }, []);

// //   const toggleFilter = (key) => {
// //     setOpenFilter((prev) => (prev === key ? null : key));
// //     setSearchValue("");
// //   };

// //   const handleCheckboxChange = (key, value) => {
// //     setFilters((prev) => {
// //       const current = prev[key] || [];
// //       if (current.includes(value)) {
// //         return { ...prev, [key]: current.filter((v) => v !== value) };
// //       } else {
// //         return { ...prev, [key]: [...current, value] };
// //       }
// //     });
// //   };

// //   const applyFilter = () => setOpenFilter(null);
// //   const clearFilter = (key) => {
// //     setFilters((prev) => ({ ...prev, [key]: [] }));
// //     setOpenFilter(null);
// //   };

// //   const uniqueValues = (key) => {
// //     const data = view === "buyer" ? buyerAlerts : sellerAlerts;
// //     return [...new Set(data.map((item) => item[key]).filter(Boolean))];
// //   };

// //   const filteredData = useMemo(() => {
// //     const data = view === "buyer" ? buyerAlerts : sellerAlerts;
// //     return data.filter((item) =>
// //       Object.keys(filters).every((key) => {
// //         const selected = filters[key];
// //         if (!selected || selected.length === 0) return true;
// //         return selected.includes(item[key]);
// //       })
// //     );
// //   }, [view, buyerAlerts, sellerAlerts, filters]);

// //   const paginatedData = useMemo(() => {
// //     const start = (page - 1) * rowsPerPage;
// //     return filteredData.slice(start, start + rowsPerPage);
// //   }, [filteredData, page, rowsPerPage]);

// //   const buyerColumns = [
// //     { key: "serialNo", label: "S.No" },
// //     { key: "BuyerAlertID", label: "ID" },
// //     { key: "UserID", label: "UserID" },
// //     { key: "Location", label: "Location" },
// //     { key: "MinPrice", label: "Min Price", render: (val) => formatAmount(val) },
// //     { key: "MaxPrice", label: "Max Price", render: (val) => formatAmount(val) },
// //     { key: "PropertyType", label: "Property Type" },
// //     {
// //       key: "AlertDate",
// //       label: "Date",
// //       render: (val) => (val ? new Date(val).toLocaleDateString() : "-"),
// //     },
// //     { key: "AdditionalNotes", label: "Additional Notes" },
// //   ];

// //   const sellerColumns = [
// //     { key: "serialNo", label: "S.No" },
// //     { key: "SellerAlertID", label: "ID" },
// //     { key: "UserID", label: "UserID" },
// //     { key: "Location", label: "Location" },
// //     { key: "Price", label: "Price", render: (val) => formatAmount(val) },
// //     { key: "PropertyType", label: "Property Type" },
// //     {
// //       key: "AlertDate",
// //       label: "Date",
// //       render: (val) => (val ? new Date(val).toLocaleDateString() : "-"),
// //     },
// //     { key: "AdditionalNotes", label: "Additional Notes" },
// //   ];

// //   const columns = view === "buyer" ? buyerColumns : sellerColumns;

// //   return (
// //     <div style={{ display: "flex", background: "#fff" }}>
// //       {/* Wrap Sidebar with flexShrink: 0 */}
// //       <div style={{ flexShrink: 0 }}>
// //         <Sidebar />
// //       </div>

// //       {/* Main content with flex grow and minWidth 0 */}
// //       <div
// //         style={{
// //           flex: 1,
// //           backgroundColor: "#fff",
// //           minHeight: "100vh",
// //           padding: 24,
// //           marginLeft:"180px",
// //         }}
// //       >
// //         {/* Back Button */}
// //         <button
// //           onClick={() => navigate("/dashboard")}
// //           style={{
// //             background: "none",
// //             color: "#2c3e50",
// //             border: "none",
// //             display: "flex",
// //             alignItems: "center",
// //             gap: 6,
// //             cursor: "pointer",
// //             fontWeight: 500,
// //             marginBottom: 10,
// //           }}
// //         >
// //           Back
// //         </button>

// //         {/* Header and Create Alert button */}
// //         <div
// //           style={{
// //             display: "flex",
// //             justifyContent: "space-between",
// //             alignItems: "center",
// //             marginBottom: 16,
// //           }}
// //         >
// //           <h2 style={{ margin: 0, color: "#22253b" }}>Alerts & Matches</h2>
// //           <button
// //             onClick={() => navigate("/create-alert")}
// //             style={{
// //               color: "#121212",
// //               border: "1px solid #eed61d",
// //               borderRadius: 6,
// //               padding: "6px 12px",
// //               cursor: "pointer",
// //               background: "transparent",
// //               fontWeight: 500,
// //             }}
// //           >
// //             Create Alert
// //           </button>
// //         </div>

// //         {/* Tabs */}
// //         <div
// //           style={{
// //             display: "flex",
// //             gap: 2,
// //             marginBottom: 20,
// //           }}
// //         >
// //           {[
// //             { label: "Buyer Alerts", value: "buyer" },
// //             { label: "Seller Alerts", value: "seller" },
// //           ].map((tab) => {
// //             const isActive = view === tab.value;
// //             return (
// //               <button
// //                 key={tab.value}
// //                 onClick={() => {
// //                   setView(tab.value);
// //                   setPage(1);
// //                 }}
// //                 style={{
// //                   backgroundColor: isActive ? "#fff" : "#f0f0f0",
// //                   color: isActive ? "#2c3e50" : "#666",
// //                   border: "none",
// //                   outline: "none",
// //                   cursor: "pointer",
// //                   padding: "10px 14px",
// //                   fontSize: "13px",
// //                   fontWeight: isActive ? 600 : 500,
// //                   borderBottom: isActive
// //                     ? "3px solid #2c3e50"
// //                     : "3px solid transparent",
// //                   borderTopLeftRadius: 6,
// //                   borderTopRightRadius: 6,
// //                   transition: "0.3s ease",
// //                 }}
// //                 onMouseEnter={(e) => {
// //                   if (!isActive) e.target.style.color = "#000";
// //                 }}
// //                 onMouseLeave={(e) => {
// //                   if (!isActive) e.target.style.color = "#666";
// //                 }}
// //               >
// //                 {tab.label}
// //               </button>
// //             );
// //           })}
// //         </div>

// //         {/* Table */}
// //         <div ref={filterRef}>
// //           <Table
// //             columns={columns}
// //             paginatedData={paginatedData}
// //             openFilter={openFilter}
// //             toggleFilter={toggleFilter}
// //             filters={filters}
// //             handleCheckboxChange={handleCheckboxChange}
// //             searchValue={searchValue}
// //             setSearchValue={setSearchValue}
// //             uniqueValues={uniqueValues}
// //             clearFilter={clearFilter}
// //             applyFilter={applyFilter}
// //           />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default Alerts;
// import React, { useState, useEffect, useMemo, useRef } from "react";
// import Sidebar from "../../components/Sidebar.jsx";
// import { useApi } from "../../API/Api.js";
// import { useNavigate } from "react-router-dom";
// import Table from "../../Utils/Table.jsx";
// import { Filter } from "lucide-react";

// const formatAmount = (num) => {
//   if (!num || isNaN(num)) return "-";
//   const n = parseFloat(num);
//   if (n >= 10000000) return (n / 10000000).toFixed(1).replace(/\.0$/, "") + " Cr";
//   if (n >= 100000) return (n / 100000).toFixed(1).replace(/\.0$/, "") + " L";
//   return n.toLocaleString("en-IN");
// };

// function HeaderWithFilter({
//   label,
//   columnKey,
//   openFilter,
//   toggleFilter,
//   searchValue,
//   setSearchValue,
//   uniqueValues,
//   filters,
//   handleCheckboxChange,
//   clearFilter,
//   applyFilter,
// }) {
//   return (
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         gap: 4,
//         justifyContent: "center",
//         position: "relative",
//       }}
//     >
//       <span>{label}</span>
//       <Filter
//         size={14}
//         style={{
//           cursor: "pointer",
//           color: openFilter === columnKey ? "#22253b" : "#adb1bd",
//         }}
//         onClick={(e) => {
//           e.stopPropagation();
//           toggleFilter(columnKey);
//           setSearchValue("");
//         }}
//       />
//       {openFilter === columnKey && (
//         <div
//           style={{
//             position: "absolute",
//             top: 30,
//             right: 0,
//             background: "#fff",
//             border: "1px solid #ccc",
//             boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
//             borderRadius: 4,
//             width: 180,
//             maxHeight: 220,
//             overflowY: "auto",
//             zIndex: 1000,
//             padding: 8,
//             textAlign: "left",
//           }}
//           onClick={(e) => e.stopPropagation()}
//         >
//           <input
//             type="text"
//             placeholder={`Search ${label}`}
//             value={searchValue}
//             onChange={(e) => setSearchValue(e.target.value)}
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
//               .filter((val) =>
//                 val
//                   ?.toString()
//                   .toLowerCase()
//                   .includes(searchValue.toLowerCase())
//               )
//               .map((val) => (
//                 <label
//                   key={val}
//                   style={{ display: "block", fontSize: 13, padding: "2px 0" }}
//                 >
//                   <input
//                     type="checkbox"
//                     checked={(filters[columnKey] || []).includes(val)}
//                     onChange={() => handleCheckboxChange(columnKey, val)}
//                     style={{ marginRight: 6 }}
//                   />
//                   {val.toString()}
//                 </label>
//               ))}
//           </div>
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               marginTop: 8,
//             }}
//           >
//             <button
//               onClick={() => clearFilter(columnKey)}
//               style={{
//                 fontSize: 12,
//                 background: "none",
//                 border: "none",
//                 color: "#888",
//                 cursor: "pointer",
//               }}
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

// function Alerts() {
//   const { fetchData } = useApi();
//   const navigate = useNavigate();
//   const filterRef = useRef();

//   const [buyerAlerts, setBuyerAlerts] = useState([]);
//   const [sellerAlerts, setSellerAlerts] = useState([]);
//   const [view, setView] = useState("buyer");
//   const [page, setPage] = useState(1);
//   const [openFilter, setOpenFilter] = useState(null);
//   const [filters, setFilters] = useState({});
//   const [searchValue, setSearchValue] = useState("");
//   const rowsPerPage = 15;

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (filterRef.current && !filterRef.current.contains(e.target)) {
//         setOpenFilter(null);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const addSerials = (arr) =>
//     (Array.isArray(arr) ? arr : []).map((a, idx) => ({ ...a, serialNo: idx + 1 }));

//   const fetchBuyerAlerts = async () => {
//     const data = await fetchData("BuyerAlerts");
//     setBuyerAlerts(addSerials(data || []));
//   };

//   const fetchSellerAlerts = async () => {
//     const data = await fetchData("SellerAlerts");
//     setSellerAlerts(addSerials(data || []));
//   };

//   useEffect(() => {
//     fetchBuyerAlerts();
//     fetchSellerAlerts();
//   }, []);

//   const toggleFilter = (key) => {
//     setOpenFilter((prev) => (prev === key ? null : key));
//     setSearchValue("");
//   };

//   const handleCheckboxChange = (key, value) => {
//     setFilters((prev) => {
//       const current = prev[key] || [];
//       if (current.includes(value)) {
//         return { ...prev, [key]: current.filter((v) => v !== value) };
//       } else {
//         return { ...prev, [key]: [...current, value] };
//       }
//     });
//   };

//   const clearFilter = (key) => {
//     setFilters((prev) => ({ ...prev, [key]: [] }));
//     setOpenFilter(null);
//   };

//   const applyFilter = () => setOpenFilter(null);

//   const uniqueValues = (key) => {
//     const data = view === "buyer" ? buyerAlerts : sellerAlerts;
//     return [...new Set(data.map((item) => item[key]).filter(Boolean))];
//   };

//   const filteredData = useMemo(() => {
//     const data = view === "buyer" ? buyerAlerts : sellerAlerts;
//     return data.filter((item) =>
//       Object.keys(filters).every((key) => {
//         const selected = filters[key];
//         if (!selected || selected.length === 0) return true;
//         return selected.includes(item[key]);
//       })
//     );
//   }, [view, buyerAlerts, sellerAlerts, filters]);

//   const paginatedData = useMemo(() => {
//     const start = (page - 1) * rowsPerPage;
//     return filteredData.slice(start, start + rowsPerPage);
//   }, [filteredData, page, rowsPerPage]);

//   const sharedHeaderProps = {
//     openFilter,
//     toggleFilter,
//     searchValue,
//     setSearchValue,
//     uniqueValues,
//     filters,
//     handleCheckboxChange,
//     clearFilter,
//     applyFilter,
//   };

//   const buyerColumns = [
//     // { key: "serialNo", label: <HeaderWithFilter label="S.No" columnKey="serialNo" {...sharedHeaderProps} /> },
//     { key: "BuyerAlertID", label: <HeaderWithFilter label="ID" columnKey="BuyerAlertID" {...sharedHeaderProps} /> },
//     { key: "UserID", label: <HeaderWithFilter label="UserID" columnKey="UserID" {...sharedHeaderProps} /> },
//     { key: "Location", label: <HeaderWithFilter label="Location" columnKey="Location" {...sharedHeaderProps} /> },
//     { key: "MinPrice", label: <HeaderWithFilter label="Min Price" columnKey="MinPrice" {...sharedHeaderProps} />, render: (val) => formatAmount(val) },
//     { key: "MaxPrice", label: <HeaderWithFilter label="Max Price" columnKey="MaxPrice" {...sharedHeaderProps} />, render: (val) => formatAmount(val) },
//     { key: "PropertyType", label: <HeaderWithFilter label="Property Type" columnKey="PropertyType" {...sharedHeaderProps} /> },
//     { key: "AlertDate", label: <HeaderWithFilter label="Date" columnKey="AlertDate" {...sharedHeaderProps} />, render: (val) => (val ? new Date(val).toLocaleDateString() : "-") },
//     { key: "AdditionalNotes", label: <HeaderWithFilter label="Additional Notes" columnKey="AdditionalNotes" {...sharedHeaderProps} /> },
//   ];

//   const sellerColumns = [
//     // { key: "serialNo", label: <HeaderWithFilter label="S.No" columnKey="serialNo" {...sharedHeaderProps} /> },
//     { key: "SellerAlertID", label: <HeaderWithFilter label="ID" columnKey="SellerAlertID" {...sharedHeaderProps} /> },
//     { key: "UserID", label: <HeaderWithFilter label="UserID" columnKey="UserID" {...sharedHeaderProps} /> },
//     { key: "Location", label: <HeaderWithFilter label="Location" columnKey="Location" {...sharedHeaderProps} /> },
//     { key: "Price", label: <HeaderWithFilter label="Price" columnKey="Price" {...sharedHeaderProps} />, render: (val) => formatAmount(val) },
//     { key: "PropertyType", label: <HeaderWithFilter label="Property Type" columnKey="PropertyType" {...sharedHeaderProps} /> },
//     { key: "AlertDate", label: <HeaderWithFilter label="Date" columnKey="AlertDate" {...sharedHeaderProps} />, render: (val) => (val ? new Date(val).toLocaleDateString() : "-") },
//     { key: "AdditionalNotes", label: <HeaderWithFilter label="Additional Notes" columnKey="AdditionalNotes" {...sharedHeaderProps} /> },
//   ];

//   const columns = view === "buyer" ? buyerColumns : sellerColumns;

//   return (
//     <div style={{ display: "flex", background: "#fff" }}>
//       <div style={{ flexShrink: 0 }}>
//         <Sidebar />
//       </div>
//       <div
//         style={{ flex: 1, backgroundColor: "#fff", minHeight: "100vh", padding: 24, marginLeft: "180px", position: "relative" }}
//         ref={filterRef}
//       >
//         <button
//           onClick={() => navigate("/dashboard")}
//           style={{
//             background: "none",
//             color: "#2c3e50",
//             border: "none",
//             display: "flex",
//             alignItems: "center",
//             gap: 6,
//             cursor: "pointer",
//             fontWeight: 500,
//             marginBottom: 10,
//           }}
//         >
//           Back
//         </button>

//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
//           <h2 style={{ margin: 0, color: "#22253b",fontweight:400 }}>Alerts & Matches</h2>
//           <button
//             onClick={() => navigate("/create-alert")}
//             style={{
//               color: "#121212",
//               border: "1px solid #eed61d",
//               borderRadius: 6,
//               padding: "6px 12px",
//               cursor: "pointer",
//               background: "transparent",
//               fontWeight: 500,
//             }}
//           >
//             Create Alert
//           </button>
//         </div>

//         <div style={{ display: "flex", gap: 2, marginBottom: 20 }}>
//           {[{ label: "Buyer Alerts", value: "buyer" }, { label: "Seller Alerts", value: "seller" }].map((tab) => {
//             const isActive = view === tab.value;
//             return (
//               <button
//                 key={tab.value}
//                 onClick={() => {
//                   setView(tab.value);
//                   setPage(1);
//                 }}
//                 style={{
//                   backgroundColor: isActive ? "#fff" : "#f0f0f0",
//                   color: isActive ? "#2c3e50" : "#666",
//                   border: "none",
//                   outline: "none",
//                   cursor: "pointer",
//                   padding: "10px 14px",
//                   fontSize: "13px",
//                   fontWeight: isActive ? 600 : 500,
//                   borderBottom: isActive ? "3px solid #2c3e50" : "3px solid transparent",
//                   borderTopLeftRadius: 6,
//                   borderTopRightRadius: 6,
//                   transition: "0.3s ease",
//                 }}
//                 onMouseEnter={(e) => {
//                   if (!isActive) e.target.style.color = "#000";
//                 }}
//                 onMouseLeave={(e) => {
//                   if (!isActive) e.target.style.color = "#666";
//                 }}
//               >
//                 {tab.label}
//               </button>
//             );
//           })}
//         </div>

//         <Table columns={columns} paginatedData={paginatedData} />

//         <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//           <button
//             onClick={() => setPage((p) => Math.max(p - 1, 1))}
//             disabled={page === 1}
//             style={{ padding: "6px 12px", cursor: page === 1 ? "not-allowed" : "pointer" }}
//           >
//             Previous
//           </button>
//           <span>
//             Page {page} of {Math.ceil(filteredData.length / rowsPerPage)}
//           </span>
//           <button
//             onClick={() => setPage((p) => Math.min(p + 1, Math.ceil(filteredData.length / rowsPerPage)))}
//             disabled={page === Math.ceil(filteredData.length / rowsPerPage)}
//             style={{ padding: "6px 12px", cursor: page === Math.ceil(filteredData.length / rowsPerPage) ? "not-allowed" : "pointer" }}
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Alerts;
 import React, { useState, useEffect, useMemo, useRef } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import { useApi } from "../../API/Api.js";
import { useNavigate } from "react-router-dom";
import Table from "../../Utils/Table.jsx";
import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import { useApi } from "../../API/Api.js";
import { useNavigate } from "react-router-dom";
import Table, { Pagination } from "../../Utils/Table.jsx";
import SearchBar from "../../Utils/SearchBar.jsx";

// Format amount helper
const formatAmount = (num) => {
  if (!num || isNaN(num)) return "-";
  const n = parseFloat(num);
  if (n >= 10000000) return (n / 10000000).toFixed(1).replace(/\.0$/, "") + " Cr";
  if (n >= 100000) return (n / 100000).toFixed(1).replace(/\.0$/, "") + " L";
  return n.toLocaleString("en-IN");
};

function Alerts() {

export default function Alerts() {

  const { fetchData } = useApi();
  const navigate = useNavigate();

  const [buyerAlerts, setBuyerAlerts] = useState([]);
  const [sellerAlerts, setSellerAlerts] = useState([]);
  const [view, setView] = useState("buyer");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const rowsPerPage = 15;

  function addSerials(arr) {
    return (Array.isArray(arr) ? arr : []).map((a, idx) => ({
      ...a,
      serialNo: idx + 1,
    }));
  
  // filter states (used by Table)
  const [openFilter, setOpenFilter] = useState(null);
  const [filters, setFilters] = useState({});
  const [filterSearchValue, setFilterSearchValue] = useState("")

  // global search
  const [searchQuery, setSearchQuery] = useState("");

  // fetch alerts data
  useEffect(() => {
    async function load() {
      try {
        const [buyerRes, sellerRes] = await Promise.all([
          fetchData("BuyerAlerts"),
          fetchData("SellerAlerts"),
        ]);

        const addSerials = (arr) =>
          (Array.isArray(arr) ? arr : []).map((a, idx) => ({
            ...a,
            serialNo: idx + 1,
          }));

        setBuyerAlerts(addSerials(buyerRes || []));
        setSellerAlerts(addSerials(sellerRes || []));
      } catch (err) {
        setError(err.message || "Error loading alerts");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [fetchData]);

  // handle filters
  const toggleFilter = (key) => {
    setOpenFilter((prev) => (prev === key ? null : key));
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

  const applyFilter = () => setOpenFilter(null);
  const clearFilter = (key) => {
    setFilters((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
    setOpenFilter(null);
  };



  const uniqueValues = (key) => {
    const data = view === "buyer" ? buyerAlerts : sellerAlerts;
    return Array.from(
      new Set(data.map((item) => item[key]).filter((v) => v !== null && v !== undefined))
    );
  };

  const applyFilter = () => {
    setOpenFilter(null);
  };

  // combine filters + search
  const allData = view === "buyer" ? buyerAlerts : sellerAlerts;

  const filteredData = useMemo(() => {
    let result = allData.filter((item) =>
      Object.entries(filters).every(([key, values]) => {
        if (!values.length) return true;
        return values.includes(item[key]);
      })
    );

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((item) =>
        Object.values(item).some(
          (val) => val && val.toString().toLowerCase().includes(query)
        )
      );
    }

    return result;
  }, [allData, filters, searchQuery]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  const buyerColumns = [
    { key: "serialNo", label: "S.No" },
    { key: "BuyerAlertID", label: "ID" },
    { key: "UserID", label: "UserID" },
    { key: "Location", label: "Location" },
    { key: "MinPrice", label: "Min Price", render: (val) => formatAmount(val) },
    { key: "MaxPrice", label: "Max Price", render: (val) => formatAmount(val) },
    { key: "PropertyType", label: "Property Type" },
    {
      key: "AlertDate",
      label: "Date",
      render: (val) => (val ? new Date(val).toLocaleDateString() : "-"),
    },
    { key: "AdditionalNotes", label: "Additional Notes" },
  ];

  const sellerColumns = [
    { key: "serialNo", label: "S.No" },
    { key: "SellerAlertID", label: "ID" },
    { key: "UserID", label: "UserID" },
    { key: "Location", label: "Location" },
    { key: "Price", label: "Price", render: (val) => formatAmount(val) },
    { key: "PropertyType", label: "Property Type" },
    {
      key: "AlertDate",
      label: "Date",
      render: (val) => (val ? new Date(val).toLocaleDateString() : "-"),
    },
    { key: "AdditionalNotes", label: "Additional Notes" },
  ];

  const columns = view === "buyer" ? buyerColumns : sellerColumns;

  return (
    <div style={{ display: "flex", background: "#fff" }}>
  }, [filteredData, page]);

  // columns
  const columns =
    view === "buyer"
      ? [
          { label: "S.No", key: "serialNo", render: (_, __, idx) => (page - 1) * rowsPerPage + idx + 1 },
          { label: "ID", key: "BuyerAlertID" },
          { label: "User ID", key: "UserID" },
          { label: "Location", key: "Location" },
          { label: "Min Price", key: "MinPrice", render: (val) => formatAmount(val) },
          { label: "Max Price", key: "MaxPrice", render: (val) => formatAmount(val) },
          { label: "Property Type", key: "PropertyType" },
          { label: "Date", key: "AlertDate", render: (val) => (val ? new Date(val).toLocaleDateString() : "-") },
          { label: "Additional Notes", key: "AdditionalNotes" },
        ]
      : [
          { label: "S.No", key: "serialNo", render: (_, __, idx) => (page - 1) * rowsPerPage + idx + 1 },
          { label: "ID", key: "SellerAlertID" },
          { label: "User ID", key: "UserID" },
          { label: "Location", key: "Location" },
          { label: "Price", key: "Price", render: (val) => formatAmount(val) },
          { label: "Property Type", key: "PropertyType" },
          { label: "Date", key: "AlertDate", render: (val) => (val ? new Date(val).toLocaleDateString() : "-") },
          { label: "Additional Notes", key: "AdditionalNotes" },
        ];

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (error) return <div style={{ padding: 24, color: "red" }}>Error: {error}</div>;

  return (
    <div style={{ display: "flex", background: "#fff" }}>
      <Sidebar />
      <div
        style={{
          flex: 1,
          backgroundColor: "#fff",
          minHeight: "100vh",
          padding: 24,
          marginLeft: "180px",
          position: "relative",
        }}
      >
      {/* Wrap Sidebar with flexShrink: 0 */}
      <div style={{ flexShrink: 0 }}>
        <Sidebar />
      </div>

      {/* Main content with flex grow and minWidth 0 */}
      <div
        style={{
          flex: 1,
          backgroundColor: "#fff",
          minHeight: "100vh",
          padding: 24,
          marginLeft:"180px",
        }}
      >
        {/* Back Button */}

        {/* Back Button */}

        <button
          onClick={() => navigate("/dashboard")}
          style={{
            background: "none",
            color: "#2c3e50",
            border: "none",
            display: "flex",
            alignItems: "center",
            gap: 6,
            cursor: "pointer",
            fontWeight: 500,
            marginBottom: 8,
          }}
        >
          ← Back
        </button>

        {/* Header and Create Alert button */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
            <h2
          style={{
            marginBottom: 14,
            color: "#222",
            fontSize: "1.05rem",
            fontWeight: "600",
          }}
        >
          Alerts & Matches
        </h2>

        {/* Header Section */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h2 style={{ margin: 0, color: "#22253b", fontWeight: 600 }}>Alerts & Matches</h2>

          <button
            onClick={() => navigate("/create-alert")}
            style={{
              color: "#121212",
              border: "1px solid #eed61d",
              // borderRadius: 6,
              padding: "6px 12px",
              cursor: "pointer",
              background: "transparent",
              fontWeight: 500,
            }}
          >
            + Create Alert
          </button>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 2,
            marginBottom: 20,
          }}
        >
        {/* Tabs */}
        <div style={{ display: "flex", gap: 2, justifyContent:"space-between"}}>
          <div>
          {[
            { label: "Buyer Alerts", value: "buyer" },
            { label: "Seller Alerts", value: "seller" },
          ].map((tab) => {

            const isActive = view === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => {
                  setView(tab.value);
                  setPage(1);
                }}
                style={{
                  backgroundColor: isActive ? "#fff" : "#f0f0f0",
                  color: isActive ? "#2c3e50" : "#666",
                  border: "none",
                  cursor: "pointer",
                  padding: "10px 14px",
                  fontSize: "13px",
                  fontWeight: isActive ? 600 : 500,
                  borderBottom: isActive
                    ? "3px solid #2c3e50"
                    : "3px solid transparent",
                  borderTopLeftRadius: 6,
                  borderTopRightRadius: 6,
                }}
              >
                {tab.label}
              </button>
            );
          })}
          </div>
      

        {/* 🔍 Global Search Bar */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={() => {}}
            style={{ width: 320 }}
          />
        </div>
        {/* Table */}
        <div ref={filterRef}>
          <Table
            columns={columns}
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
          />

        </div>

        {/* Table */}
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

        {/* Pagination */}
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={Math.max(1, Math.ceil(filteredData.length / rowsPerPage))}
        />
      </div>
    </div>
  );
}
