<<<<<<< HEAD
// // // // import React, { useState, useEffect, useMemo } from "react";
// // // // import { createPortal } from "react-dom";
// // // // import { useNavigate } from "react-router-dom";
// // // // import Sidebar from "../../components/Sidebar.jsx";
// // // // import ProjectDetailsTabsComponent from "./ProjectDetailsTabsComponent.jsx";
// // // // import AgentDetailsTable from "./AgentDetailsTable.jsx";
// // // // import { useApi } from "../../API/Api.js";
// // // // import { LoadScript } from "@react-google-maps/api";
// // // // import { Pagination } from "../../Utils/Table.jsx";

// // // // const GOOGLE_MAPS_API_KEY = "AIzaSyAGGzyx5AhGJIfBbzbz9ZeWWyjdGu7Elf0";

// // // // // ✅ Reusable Modal
// // // // function Modal({ children, open, onClose }) {
// // // //   if (!open) return null;
// // // //   return createPortal(
// // // //     <div
// // // //       onClick={onClose}
// // // //       style={{
// // // //         position: "fixed",
// // // //         inset: 0,
// // // //         backgroundColor: "rgba(0,0,0,0.45)",
// // // //         zIndex: 1000,
// // // //         display: "flex",
// // // //         justifyContent: "center",
// // // //         alignItems: "center",
// // // //       }}
// // // //     >
// // // //       <div
// // // //         onClick={(e) => e.stopPropagation()}
// // // //         style={{
// // // //           marginLeft: "220px",
// // // //           width: "calc(100vw - 260px)",
// // // //           maxWidth: 1400,
// // // //           background: "#fff",
// // // //           borderRadius: 10,
// // // //           padding: 24,
// // // //           boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
// // // //           overflowY: "auto",
// // // //           maxHeight: "85vh",
// // // //         }}
// // // //       >
// // // //         {children}
// // // //       </div>
// // // //     </div>,
// // // //     document.body
// // // //   );
// // // // }

// // // // // ✅ Spinner
// // // // const Spinner = () => (
// // // //   <div
// // // //     style={{
// // // //       display: "flex",
// // // //       justifyContent: "center",
// // // //       alignItems: "center",
// // // //       height: "70vh",
// // // //     }}
// // // //   >
// // // //     <div
// // // //       style={{
// // // //         width: 48,
// // // //         height: 48,
// // // //         border: "5px solid #ddd",
// // // //         borderTop: "5px solid #2c3e50",
// // // //         borderRadius: "50%",
// // // //         animation: "spin 1s linear infinite",
// // // //       }}
// // // //     />
// // // //     <style>
// // // //       {`
// // // //         @keyframes spin {
// // // //           from { transform: rotate(0deg); }
// // // //           to { transform: rotate(360deg); }
// // // //         }
// // // //       `}
// // // //     </style>
// // // //   </div>
// // // // );

// // // // export default function SocialActivity() {
// // // //   const navigate = useNavigate();
// // // //   const { fetchData } = useApi();

// // // //   const [activeTab, setActiveTab] = useState("Tours");
// // // //   const [displayData, setDisplayData] = useState([]);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [selectedRow, setSelectedRow] = useState(null);
// // // //   const [projectDetail, setProjectDetail] = useState(null);
// // // //   const [agentList, setAgentList] = useState([]);
// // // //   const [shareUnit, setShareUnit] = useState(null);
// // // //   const [agentsOpen, setAgentsOpen] = useState(false);
// // // //   const [page, setPage] = useState(1);
// // // //   const rowsPerPage = 10;

// // // //   const listParamTypes = {
// // // //     Tours: "ToursDetails",
// // // //     "Request Info": "RequestinfoDetails",
// // // //     "Shared Properties": "SharePropertyDetails",
// // // //   };

// // // //   const projectInfoParamTypes = {
// // // //     Tours: "ToursPropertyDetails",
// // // //     "Request Info": "RequestInfoPropertyDetails",
// // // //     "Shared Properties": "SharedPropertyDetails",
// // // //   };

// // // //   const getId = (obj, keys) => {
// // // //     for (const key of keys) if (obj[key] !== undefined) return obj[key];
// // // //     return null;
// // // //   };

// // // //   // ✅ Fetch list data
// // // //   useEffect(() => {
// // // //     async function loadData() {
// // // //       try {
// // // //         setLoading(true);
// // // //         setPage(1);
// // // //         const res = await fetchData(listParamTypes[activeTab]);
// // // //         setDisplayData(Array.isArray(res) ? res : res?.data || []);
// // // //       } catch {
// // // //         setDisplayData([]);
// // // //       } finally {
// // // //         setLoading(false);
// // // //       }
// // // //     }
// // // //     loadData();
// // // //   }, [activeTab, fetchData]);

// // // //   // ✅ Handle project details
// // // //   const handleDetailsClick = async (row) => {
// // // //     setSelectedRow(row);
// // // //     setProjectDetail(null);
// // // //     setAgentsOpen(false);

// // // //     const projectId = getId(row, ["ProjectID", "ProjectId", "projectId"]);
// // // //     const propertyId = getId(row, ["PropertyID", "PropertyId", "propertyId"]);
// // // //     if (!projectId || !propertyId) return;

// // // //     try {
// // // //       const allUnits = await fetchData(projectInfoParamTypes[activeTab]);
// // // //       const units = Array.isArray(allUnits) ? allUnits : allUnits?.data || [];

// // // //       const currentProjectUnits = units.filter(
// // // //         (u) =>
// // // //           String(getId(u, ["ProjectID", "ProjectId", "projectId"])) ===
// // // //           String(projectId)
// // // //       );

// // // //       const specificUnit = currentProjectUnits.find(
// // // //         (u) =>
// // // //           String(getId(u, ["PropertyID", "PropertyId", "propertyId"])) ===
// // // //           String(propertyId)
// // // //       );
// // // //       if (!specificUnit) return;

// // // //       setProjectDetail({
// // // //         details: {
// // // //           name: currentProjectUnits[0]?.ProjectName || `Project #${projectId}`,
// // // //           location:
// // // //             currentProjectUnits[0]?.Locality ||
// // // //             currentProjectUnits[0]?.Location ||
// // // //             "N/A",
// // // //           description:
// // // //             currentProjectUnits[0]?.ProjectDescription || "No Description",
// // // //         },
// // // //         latitude: parseFloat(currentProjectUnits[0]?.Latitude) || 0,
// // // //         longitude: parseFloat(currentProjectUnits[0]?.Longitude) || 0,
// // // //         units: currentProjectUnits.map((u) => ({
// // // //           type: u.Type ?? "N/A",
// // // //           price: u.Price ?? "N/A",
// // // //           area: u.Area ?? "N/A",
// // // //           bhk: u.BHK ?? "N/A",
// // // //           facing: u.Facing ?? "N/A",
// // // //           id: getId(u, ["PropertyID", "PropertyId", "propertyId"]),
// // // //           projectId,
// // // //         })),
// // // //       });
// // // //     } catch {
// // // //       setProjectDetail(null);
// // // //     }
// // // //   };

// // // //   // ✅ Columns for each tab
// // // //   const columnsConfig = {
// // // //     Tours: [
// // // //       { label: "Full Name", key: "FullName" },
// // // //       { label: "Phone", key: "PhoneNo" },
// // // //       { label: "Email", key: "Email" },
// // // //       { label: "Scheduled At", key: "ScheduledAt" },
// // // //       { label: "Time Slot", key: "Timeslot" },
// // // //       { label: "Project ID", key: "ProjectID" },
// // // //       { label: "Property ID", key: "PropertyID" },
// // // //       {
// // // //         label: "Action",
// // // //         key: "action",
// // // //         render: (_, row) => (
// // // //           <button
// // // //             onClick={() => handleDetailsClick(row)}
// // // //             style={{
// // // //               color: "#0d0c0c",
// // // //               border: "none",
// // // //               borderRadius: 6,
// // // //               padding: "4px 10px",
// // // //               cursor: "pointer",
// // // //               backgroundColor: "#ebedf0",
// // // //             }}
// // // //           >
// // // //             Details
// // // //           </button>
// // // //         ),
// // // //       },
// // // //     ],
// // // //     "Request Info": [
// // // //       { label: "Message", key: "Message" },
// // // //       { label: "Email", key: "Email" },
// // // //       { label: "Phone", key: "PhoneNo" },
// // // //       { label: "Project ID", key: "ProjectID" },
// // // //       { label: "Property ID", key: "PropertyID" },
// // // //       {
// // // //         label: "Action",
// // // //         key: "action",
// // // //         render: (_, row) => (
// // // //           <button
// // // //             onClick={() => handleDetailsClick(row)}
// // // //             style={{
// // // //               color: "#fff",
// // // //               border: "none",
// // // //               borderRadius: 6,
// // // //               padding: "4px 10px",
// // // //               cursor: "pointer",
// // // //               backgroundColor: "#bcc0c5",
// // // //             }}
// // // //           >
// // // //             Details
// // // //           </button>
// // // //         ),
// // // //       },
// // // //     ],
// // // //     "Shared Properties": [
// // // //       { label: "Name", key: "Name" },
// // // //       { label: "Email", key: "Email" },
// // // //       { label: "Phone", key: "PhoneNo" },
// // // //       { label: "Message", key: "Message" },
// // // //       { label: "Channel", key: "Channel" },
// // // //       { label: "Project ID", key: "ProjectID" },
// // // //       { label: "Property ID", key: "PropertyID" },
// // // //       {
// // // //         label: "Action",
// // // //         key: "action",
// // // //         render: (_, row) => (
// // // //           <button
// // // //             onClick={() => handleDetailsClick(row)}
// // // //             style={{
// // // //               color: "#fff",
// // // //               border: "none",
// // // //               borderRadius: 6,
// // // //               padding: "4px 10px",
// // // //               cursor: "pointer",
// // // //               backgroundColor: "#54575b",
// // // //             }}
// // // //           >
// // // //             Details
// // // //           </button>
// // // //         ),
// // // //       },
// // // //     ],
// // // //   };

// // // //   const paginatedData = useMemo(() => {
// // // //     const start = (page - 1) * rowsPerPage;
// // // //     return displayData.slice(start, start + rowsPerPage);
// // // //   }, [displayData, page]);

// // // //   const totalPages = Math.ceil(displayData.length / rowsPerPage);

// // // //   // ✅ FIX: main content spacing adjusted
// // // //   return (
// // // //     <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
// // // //       <div style={{ display: "flex", minHeight: "100vh", background: "#fff" }}>
// // // //         <Sidebar />
// // // //         <div
// // // //           style={{
// // // //             flex: 1,
// // // //             marginLeft: "190px",
// // // //             padding: "20px 30px",
// // // //             background: "#fff",
// // // //           }}
// // // //         >
// // // //           {/* ✅ Back Button */}
// // // //           <button
// // // //             onClick={() => navigate("/dashboard")}
// // // //             style={{
// // // //               background: "none",
// // // //               color: "#2c3e50",
// // // //               border: "none",
// // // //               display: "flex",
// // // //               alignItems: "center",
// // // //               gap: 6,
// // // //               cursor: "pointer",
// // // //               fontWeight: 500,
// // // //               marginBottom: 10,
// // // //             }}
// // // //           >
// // // //             Back
// // // //           </button>

// // // //           <h2 style={{ marginBottom: 16, color: "#22253b" }}>Social Activity</h2>

// // // //           {/* ✅ Tabs */}
// // // //           <div
// // // //             style={{
// // // //               display: "flex",
// // // //               gap: 2,
// // // //               marginBottom: 20,
// // // //             }}
// // // //           >
// // // //             {Object.keys(listParamTypes).map((tab) => {
// // // //               const isActive = activeTab === tab;
// // // //               return (
// // // //                 <button
// // // //                   key={tab}
// // // //                   onClick={() => {
// // // //                     setActiveTab(tab);
// // // //                     setPage(1);
// // // //                   }}
// // // //                   style={{
// // // //                     backgroundColor: isActive ? "#fff" : "#f0f0f0",
// // // //                     color: isActive ? "#2c3e50" : "#666",
// // // //                     border: "none",
// // // //                     outline: "none",
// // // //                     cursor: "pointer",
// // // //                     padding: "10px 14px",
// // // //                     fontSize: "13px",
// // // //                     fontWeight: isActive ? 600 : 500,
// // // //                     borderBottom: isActive
// // // //                       ? "3px solid #2c3e50"
// // // //                       : "3px solid transparent",
// // // //                     borderTopLeftRadius: 6,
// // // //                     borderTopRightRadius: 6,
// // // //                     transition: "0.3s ease",
// // // //                   }}
// // // //                   onMouseEnter={(e) => {
// // // //                     if (!isActive) e.target.style.color = "#000";
// // // //                   }}
// // // //                   onMouseLeave={(e) => {
// // // //                     if (!isActive) e.target.style.color = "#666";
// // // //                   }}
// // // //                 >
// // // //                   {tab}
// // // //                 </button>
// // // //               );
// // // //             })}
// // // //           </div>

// // // //           {/* ✅ Table */}
// // // //           {loading ? (
// // // //             <Spinner />
// // // //           ) : (
// // // //             <>
// // // //               <div
// // // //                 style={{
// // // //                   background: "#fff",
// // // //                   borderRadius: 10,
// // // //                   boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
// // // //                   overflow: "hidden",
// // // //                   padding: "10px 0",
// // // //                 }}
// // // //               >
// // // //                 <table
// // // //                   style={{
// // // //                     width: "100%",
// // // //                     borderCollapse: "collapse",
// // // //                     textAlign: "center",
// // // //                   }}
// // // //                 >
// // // //                   <thead>
// // // //                     <tr style={{ background: "#f9fafb" }}>
// // // //                       {columnsConfig[activeTab].map((col) => (
// // // //                         <th
// // // //                           key={col.key}
// // // //                           style={{
// // // //                             padding: "8px 10px",
// // // //                             fontWeight: 600,
// // // //                             fontSize: "0.85rem",
// // // //                             borderBottom: "1px solid #e5e7eb",
// // // //                             color: "#374151",
// // // //                           }}
// // // //                         >
// // // //                           {col.label}
// // // //                         </th>
// // // //                       ))}
// // // //                     </tr>
// // // //                   </thead>
// // // //                   <tbody>
// // // //                     {paginatedData.length === 0 ? (
// // // //                       <tr>
// // // //                         <td
// // // //                           colSpan={columnsConfig[activeTab].length}
// // // //                           style={{
// // // //                             padding: 20,
// // // //                             color: "#666",
// // // //                             textAlign: "center",
// // // //                           }}
// // // //                         >
// // // //                           No data available
// // // //                         </td>
// // // //                       </tr>
// // // //                     ) : (
// // // //                       paginatedData.map((row, idx) => (
// // // //                         <tr
// // // //                           key={idx}
// // // //                           style={{
// // // //                             height: 36,
// // // //                             borderBottom: "1px solid #f1f1f1",
// // // //                             backgroundColor:
// // // //                               idx % 2 === 0 ? "#fff" : "#fafafa",
// // // //                             fontSize: "0.84rem",
// // // //                           }}
// // // //                         >
// // // //                           {columnsConfig[activeTab].map((col) => (
// // // //                             <td
// // // //                               key={col.key}
// // // //                               style={{
// // // //                                 padding: "6px 8px",
// // // //                                 color: "#333",
// // // //                               }}
// // // //                             >
// // // //                               {col.render
// // // //                                 ? col.render(row[col.key], row, idx)
// // // //                                 : row[col.key] || "-"}
// // // //                             </td>
// // // //                           ))}
// // // //                         </tr>
// // // //                       ))
// // // //                     )}
// // // //                   </tbody>
// // // //                 </table>
// // // //               </div>

// // // //               {totalPages > 1 && (
// // // //                 <Pagination page={page} setPage={setPage} totalPages={totalPages} />
// // // //               )}
// // // //             </>
// // // //           )}

// // // //           {/* ✅ Modal Section */}
// // // //           <Modal
// // // //             open={!!selectedRow}
// // // //             onClose={() => {
// // // //               setSelectedRow(null);
// // // //               setProjectDetail(null);
// // // //               setAgentsOpen(false);
// // // //             }}
// // // //           >
// // // //             <div style={{ display: "flex", gap: 24 }}>
// // // //               <div style={{ flex: 2 }}>
// // // //                 <ProjectDetailsTabsComponent
// // // //                   data={projectDetail}
// // // //                   initialTab="Details"
// // // //                   onClose={() => setSelectedRow(null)}
// // // //                   onRequestShare={(unit) => {
// // // //                     fetchData("Agentinfo")
// // // //                       .then((agents) => {
// // // //                         setAgentList(agents || []);
// // // //                         setShareUnit(unit);
// // // //                         setAgentsOpen(true);
// // // //                       })
// // // //                       .catch(() => alert("Failed to fetch agents."));
// // // //                   }}
// // // //                   currentPropertyId={selectedRow?.PropertyID}
// // // //                 />
// // // //               </div>
// // // //               {agentsOpen && (
// // // //                 <div
// // // //                   style={{
// // // //                     flex: 1,
// // // //                     borderLeft: "1px solid #e5e7eb",
// // // //                     paddingLeft: 16,
// // // //                   }}
// // // //                 >
// // // //                   <AgentDetailsTable
// // // //                     agents={agentList}
// // // //                     shareUnit={shareUnit}
// // // //                     onClose={() => setAgentsOpen(false)}
// // // //                   />
// // // //                 </div>
// // // //               )}
// // // //             </div>
// // // //           </Modal>
// // // //         </div>
// // // //       </div>
// // // //     </LoadScript>
// // // //   );
// // // // }
// // // import React, { useState, useEffect, useMemo } from "react";
// // // import { createPortal } from "react-dom";
// // // import { useNavigate } from "react-router-dom";
// // // import Sidebar from "../../components/Sidebar.jsx";
// // // import ProjectDetailsTabsComponent from "./ProjectDetailsTabsComponent.jsx";
// // // import AgentDetailsTable from "./AgentDetailsTable.jsx";
// // // import { useApi } from "../../API/Api.js";
// // // import { LoadScript } from "@react-google-maps/api";
// // // import { Pagination } from "../../Utils/Table.jsx";
// // // import { Filter } from "lucide-react";

// // // const GOOGLE_MAPS_API_KEY = "AIzaSyAGGzyx5AhGJIfBbzbz9ZeWWyjdGu7Elf0";

// // // function HeaderWithFilter({
// // //   label,
// // //   columnKey,
// // //   openFilter,
// // //   toggleFilter,
// // //   searchValue,
// // //   setSearchValue,
// // //   uniqueValues,
// // //   filters,
// // //   handleCheckboxChange,
// // //   clearFilter,
// // //   applyFilter,
// // // }) {
// // //   return (
// // //     <div style={{ display: "flex", alignItems: "center", gap: 4, position: "relative" }}>
// // //       <span>{label}</span>
// // //       <Filter
// // //         size={14}
// // //         style={{ cursor: "pointer", color: openFilter === columnKey ? "#22253b" : "#adb1bd" }}
// // //         onClick={(e) => {
// // //           e.stopPropagation();
// // //           toggleFilter(columnKey);
// // //           setSearchValue("");
// // //         }}
// // //       />
// // //       {openFilter === columnKey && (
// // //         <div
// // //           style={{
// // //             position: "absolute",
// // //             top: 30,
// // //             right: 0,
// // //             background: "#fff",
// // //             border: "1px solid #ccc",
// // //             boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
// // //             borderRadius: 4,
// // //             width: 180,
// // //             maxHeight: 220,
// // //             overflowY: "auto",
// // //             zIndex: 1000,
// // //             padding: 8,
// // //             textAlign: "left",
// // //           }}
// // //           onClick={(e) => e.stopPropagation()}
// // //         >
// // //           <input
// // //             type="text"
// // //             placeholder={`Search ${label}`}
// // //             value={searchValue}
// // //             onChange={(e) => setSearchValue(e.target.value)}
// // //             style={{ width: "100%", padding: 4, marginBottom: 8, borderRadius: 4, border: "1px solid #ddd", fontSize: 13 }}
// // //           />
// // //           <div style={{ maxHeight: 130, overflowY: "auto" }}>
// // //             {uniqueValues(columnKey)
// // //               .filter((val) => val?.toString().toLowerCase().includes(searchValue.toLowerCase()))
// // //               .map((val) => (
// // //                 <label key={val} style={{ display: "block", fontSize: 13, padding: 2 }}>
// // //                   <input
// // //                     type="checkbox"
// // //                     checked={(filters[columnKey] || []).includes(val)}
// // //                     onChange={() => handleCheckboxChange(columnKey, val)}
// // //                     style={{ marginRight: 6 }}
// // //                   />
// // //                   {val.toString()}
// // //                 </label>
// // //               ))}
// // //           </div>
// // //           <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
// // //             <button onClick={() => clearFilter(columnKey)} style={{ fontSize: 12, background: "none", border: "none", color: "#888", cursor: "pointer" }}>
// // //               Clear
// // //             </button>
// // //             <button onClick={applyFilter} style={{ fontSize: 12, backgroundColor: "#2c3e50", border: "none", color: "#fff", padding: "4px 8px", borderRadius: 4, cursor: "pointer" }}>
// // //               Apply
// // //             </button>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // // export default function SocialActivity() {
// // //   const { fetchData } = useApi();
// // //   const navigate = useNavigate();

// // //   const [activeTab, setActiveTab] = useState("Tours");
// // //   const [displayData, setDisplayData] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [selectedRow, setSelectedRow] = useState(null);
// // //   const [projectDetail, setProjectDetail] = useState(null);
// // //   const [agentList, setAgentList] = useState([]);
// // //   const [shareUnit, setShareUnit] = useState(null);
// // //   const [agentsOpen, setAgentsOpen] = useState(false);
// // //   const [page, setPage] = useState(1);
// // //   const rowsPerPage = 10;
// // //   const [openFilter, setOpenFilter] = useState(null);
// // //   const [filters, setFilters] = useState({});
// // //   const [searchValue, setSearchValue] = useState("");

// // //   const listParamTypes = {
// // //     Tours: "ToursDetails",
// // //     "Request Info": "RequestinfoDetails",
// // //     "Shared Properties": "SharePropertyDetails",
// // //   };

// // //   const projectInfoParamTypes = {
// // //     Tours: "ToursPropertyDetails",
// // //     "Request Info": "RequestInfoPropertyDetails",
// // //     "Shared Properties": "SharedPropertyDetails",
// // //   };

// // //   const columnsConfig = {
// // //     Tours: [
// // //       { label: "Full Name", key: "FullName" },
// // //       { label: "Phone", key: "PhoneNo" },
// // //       { label: "Email", key: "Email" },
// // //       { label: "Scheduled At", key: "ScheduledAt" },
// // //       { label: "Time Slot", key: "TimeSlot" },
// // //       { label: "Project ID", key: "ProjectID" },
// // //       { label: "Property ID", key: "PropertyID" },
// // //       {
// // //         label: "Action",
// // //         key: "action",
// // //         render: (_, row) => (
// // //           <button
// // //             onClick={() => handleDetailsClick(row)}
// // //             style={{
// // //               color: "#0d0c0c",
// // //               border: "none",
// // //               borderRadius: 6,
// // //               padding: "4px 10px",
// // //               cursor: "pointer",
// // //               backgroundColor: "#ebedf0",
// // //             }}
// // //           >
// // //             Details
// // //           </button>
// // //         ),
// // //       },
// // //     ],
// // //     "Request Info": [
// // //       { label: "Message", key: "Message" },
// // //       { label: "Email", key: "Email" },
// // //       { label: "Phone", key: "PhoneNo" },
// // //       { label: "Project ID", key: "ProjectID" },
// // //       { label: "Property ID", key: "PropertyID" },
// // //       {
// // //         label: "Action",
// // //         key: "action",
// // //         render: (_, row) => (
// // //           <button
// // //             onClick={() => handleDetailsClick(row)}
// // //             style={{
// // //               color: "#fff",
// // //               border: "none",
// // //               borderRadius: 6,
// // //               padding: "4px 10px",
// // //               cursor: "pointer",
// // //               backgroundColor: "#bcc0c5",
// // //             }}
// // //           >
// // //             Details
// // //           </button>
// // //         ),
// // //       },
// // //     ],
// // //     "Shared Properties": [
// // //       { label: "Name", key: "Name" },
// // //       { label: "Email", key: "Email" },
// // //       { label: "Phone", key: "PhoneNo" },
// // //       { label: "Message", key: "Message" },
// // //       { label: "Channel", key: "Channel" },
// // //       { label: "Project ID", key: "ProjectID" },
// // //       { label: "Property ID", key: "PropertyID" },
// // //       {
// // //         label: "Action",
// // //         key: "action",
// // //         render: (_, row) => (
// // //           <button
// // //             onClick={() => handleDetailsClick(row)}
// // //             style={{
// // //               color: "#fff",
// // //               border: "none",
// // //               borderRadius: 6,
// // //               padding: "4px 10px",
// // //               cursor: "pointer",
// // //               backgroundColor: "#54575b",
// // //             }}
// // //           >
// // //             Details
// // //           </button>
// // //         ),
// // //       },
// // //     ],
// // //   };

// // //   const getId = (obj, keys) => keys.find((k) => obj[k] !== undefined && obj[k] !== null);

// // //   useEffect(() => {
// // //     async function loadData() {
// // //       try {
// // //         setLoading(true);
// // //         setPage(1);
// // //         const res = await fetchData(listParamTypes[activeTab]);
// // //         setDisplayData(Array.isArray(res) ? res : res?.data || []);
// // //       } catch {
// // //         setDisplayData([]);
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     }
// // //     loadData();
// // //   }, [activeTab, fetchData]);

// // //   async function handleDetailsClick(row) {
// // //     setSelectedRow(row);
// // //     setProjectDetail(null);
// // //     setAgentsOpen(false);
// // //     setAgentList([]);
// // //     setShareUnit(null);

// // //     const projectId = getId(row, ["ProjectID", "ProjectId", "projectId"]);
// // //     const propertyId = getId(row, ["PropertyID", "PropertyId", "propertyId"]);

// // //     if (!projectId || !propertyId) return;

// // //     try {
// // //       const allUnits = await fetchData(projectInfoParamTypes[activeTab]);
// // //       const units = Array.isArray(allUnits) ? allUnits : allUnits?.data || [];
// // //       const currentProjectUnits = units.filter(
// // //         (u) => String(getId(u, ["ProjectID", "ProjectId", "projectId"])) === String(projectId)
// // //       );

// // //       setProjectDetail({
// // //         details: {
// // //           name: currentProjectUnits[0]?.ProjectName || `Project #${projectId}`,
// // //           location:
// // //             currentProjectUnits[0]?.Locality || currentProjectUnits[0]?.Location || "N/A",
// // //           description: currentProjectUnits[0]?.ProjectDescription || "No Description",
// // //           ZipCode: currentProjectUnits[0]?.ZipCode || "N/A",
// // //         },
// // //         latitude: parseFloat(currentProjectUnits[0]?.Latitude) || 0,
// // //         longitude: parseFloat(currentProjectUnits[0]?.Longitude) || 0,
// // //         units: currentProjectUnits.map((u) => ({
// // //           type: u.Type ?? "N/A",
// // //           price: u.Price ?? "N/A",
// // //           area: u.Area ?? "N/A",
// // //           bhk: u.BHK ?? "N/A",
// // //           facing: u.Facing ?? "N/A",
// // //           id: getId(u, ["PropertyID", "PropertyId", "propertyId"]),
// // //           projectId,
// // //         })),
// // //         allPricesOfProject: currentProjectUnits.map((el) => el.Price).filter(Boolean),
// // //         facts: {
// // //           projectId,
// // //           projectType: currentProjectUnits[0]?.ProjectType || "N/A",
// // //           status: currentProjectUnits[0]?.Status || "N/A",
// // //           area: currentProjectUnits[0]?.Area || "N/A",
// // //           bedrooms: currentProjectUnits[0]?.Bedrooms || "N/A",
// // //           bathrooms: currentProjectUnits[0]?.Bathrooms || "N/A",
// // //           facings: currentProjectUnits[0]?.Facings || "N/A",
// // //           unitCount: currentProjectUnits.length,
// // //         },
// // //       });
// // //     } catch {
// // //       setProjectDetail(null);
// // //     }
// // //   }

// // //   const toggleFilter = (key) => {
// // //     setOpenFilter((prev) => (prev === key ? null : key));
// // //     setSearchValue("");
// // //   };

// // //   const handleCheckboxChange = (key, val) => {
// // //     setFilters((prev) => {
// // //       const current = prev[key] || [];
// // //       const newVals = current.includes(val) ? current.filter((v) => v !== val) : [...current, val];
// // //       return { ...prev, [key]: newVals };
// // //     });
// // //   };

// // //   const clearFilter = (key) => {
// // //     setFilters((prev) => ({ ...prev, [key]: [] }));
// // //     setOpenFilter(null);
// // //   };

// // //   const applyFilter = () => {
// // //     setOpenFilter(null);
// // //   };

// // //   const uniqueValues = (key) => {
// // //     const vals = displayData.map((item) => item[key]).filter(Boolean);
// // //     return Array.from(new Set(vals));
// // //   };

// // //   const filteredData = useMemo(() => {
// // //     if (Object.keys(filters).length === 0) return displayData;
// // //     return displayData.filter((item) =>
// // //       Object.entries(filters).every(([key, values]) => {
// // //         if (!values.length) return true;
// // //         return values.includes(item[key]);
// // //       })
// // //     );
// // //   }, [displayData, filters]);

// // //   const paginatedData = useMemo(() => {
// // //     const start = (page - 1) * rowsPerPage;
// // //     return filteredData.slice(start, start + rowsPerPage);
// // //   }, [filteredData, page, rowsPerPage]);

// // //   const columnsWithFilters = columnsConfig[activeTab].map((col) => ({
// // //     ...col,
// // //     label: (
// // //       <HeaderWithFilter
// // //         label={col.label}
// // //         columnKey={col.key}
// // //         openFilter={openFilter}
// // //         toggleFilter={toggleFilter}
// // //         searchValue={searchValue}
// // //         setSearchValue={setSearchValue}
// // //         uniqueValues={uniqueValues}
// // //         filters={filters}
// // //         handleCheckboxChange={handleCheckboxChange}
// // //         clearFilter={clearFilter}
// // //         applyFilter={applyFilter}
// // //       />
// // //     ),
// // //   }));

// // //   return (
// // //     <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
// // //       <div style={{ display: "flex", minHeight: "100vh", background: "#fff" }}>
// // //         <Sidebar />
// // //         <div style={{ flex: 1, marginLeft: "190px", padding: "20px 30px", background: "#fff" }}>
// // //           <button
// // //             onClick={() => navigate("/dashboard")}
// // //             style={{
// // //               background: "none",
// // //               color: "#2c3e50",
// // //               border: "none",
// // //               display: "flex",
// // //               alignItems: "center",
// // //               gap: 6,
// // //               cursor: "pointer",
// // //               fontWeight: 500,
// // //               marginBottom: 10,
// // //             }}
// // //           >
// // //             Back
// // //           </button>

// // //           <h2 style={{ marginBottom: 16, color: "#22253b" }}>Social Activity</h2>

// // //           <div style={{ display: "flex", gap: 2, marginBottom: 20 }}>
// // //             {Object.keys(listParamTypes).map((tab) => {
// // //               const isActive = activeTab === tab;
// // //               return (
// // //                 <button
// // //                   key={tab}
// // //                   onClick={() => {
// // //                     setActiveTab(tab);
// // //                     setPage(1);
// // //                   }}
// // //                   style={{
// // //                     backgroundColor: isActive ? "#fff" : "#f0f0f0",
// // //                     color: isActive ? "#2c3e50" : "#666",
// // //                     border: "none",
// // //                     outline: "none",
// // //                     cursor: "pointer",
// // //                     padding: "10px 14px",
// // //                     fontSize: "13px",
// // //                     fontWeight: isActive ? 600 : 500,
// // //                     borderBottom: isActive ? "3px solid #2c3e50" : "3px solid transparent",
// // //                     borderTopLeftRadius: 6,
// // //                     borderTopRightRadius: 6,
// // //                     transition: "0.3s ease",
// // //                   }}
// // //                   onMouseEnter={(e) => {
// // //                     if (!isActive) e.target.style.color = "#000";
// // //                   }}
// // //                   onMouseLeave={(e) => {
// // //                     if (!isActive) e.target.style.color = "#666";
// // //                   }}
// // //                 >
// // //                   {tab}
// // //                 </button>
// // //               );
// // //             })}
// // //           </div>

// // //           {loading ? (
// // //             <div
// // //               style={{
// // //                 display: "flex",
// // //                 justifyContent: "center",
// // //                 alignItems: "center",
// // //                 height: "70vh",
// // //               }}
// // //             >
// // //               <div
// // //                 style={{
// // //                   width: 48,
// // //                   height: 48,
// // //                   border: "5px solid #ddd",
// // //                   borderTop: "5px solid #2c3e50",
// // //                   borderRadius: "50%",
// // //                   animation: "spin 1s linear infinite",
// // //                 }}
// // //               />
// // //               <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
// // //             </div>
// // //           ) : (
// // //             <>
// // //               <div
// // //                 style={{
// // //                   background: "#fff",
// // //                   borderRadius: 10,
// // //                   boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
// // //                   overflow: "hidden",
// // //                   padding: "10px 0",
// // //                 }}
// // //               >
// // //                 <table
// // //                   style={{
// // //                     width: "100%",
// // //                     borderCollapse: "collapse",
// // //                     textAlign: "center",
// // //                   }}
// // //                 >
// // //                   <thead>
// // //                     <tr style={{ background: "#f9fafb" }}>
// // //                       {columnsWithFilters.map((col) => (
// // //                         <th
// // //                           key={col.key}
// // //                           style={{
// // //                             padding: "8px 10px",
// // //                             fontWeight: 600,
// // //                             fontSize: "0.85rem",
// // //                             borderBottom: "1px solid #e5e7eb",
// // //                             color: "#374151",
// // //                           }}
// // //                         >
// // //                           {col.label}
// // //                         </th>
// // //                       ))}
// // //                     </tr>
// // //                   </thead>
// // //                   <tbody>
// // //                     {paginatedData.length === 0 ? (
// // //                       <tr>
// // //                         <td
// // //                           colSpan={columnsWithFilters.length}
// // //                           style={{ padding: 20, color: "#666", textAlign: "center" }}
// // //                         >
// // //                           No data available
// // //                         </td>
// // //                       </tr>
// // //                     ) : (
// // //                       paginatedData.map((row, idx) => (
// // //                         <tr
// // //                           key={idx}
// // //                           style={{
// // //                             height: 36,
// // //                             borderBottom: "1px solid #f1f1f1",
// // //                             backgroundColor: idx % 2 === 0 ? "#fff" : "#fafafa",
// // //                             fontSize: "0.84rem",
// // //                           }}
// // //                         >
// // //                           {columnsWithFilters.map((col) => (
// // //                             <td
// // //                               key={col.key}
// // //                               style={{ padding: "6px 8px", color: "#333" }}
// // //                             >
// // //                               {col.render
// // //                                 ? col.render(row[col.key], row, idx)
// // //                                 : row[col.key] || "-"}
// // //                             </td>
// // //                           ))}
// // //                         </tr>
// // //                       ))
// // //                     )}
// // //                   </tbody>
// // //                 </table>
// // //               </div>

// // //               {Math.ceil(filteredData.length / rowsPerPage) > 1 && (
// // //                 <Pagination
// // //                   page={page}
// // //                   setPage={setPage}
// // //                   totalPages={Math.ceil(filteredData.length / rowsPerPage)}
// // //                 />
// // //               )}
// // //             </>
// // //           )}

// // //           {projectDetail && (
// // //             <Modal open={!!projectDetail} onClose={() => setProjectDetail(null)}>
// // //               <div style={{ display: "flex", gap: 24 }}>
// // //                 <div style={{ flex: 2 }}>
// // //                   <ProjectDetailsTabsComponent
// // //                     data={projectDetail}
// // //                     initialTab="Details"
// // //                     onClose={() => setProjectDetail(null)}
// // //                     onRequestShare={(unit) => {
// // //                       fetchData("Agentinfo")
// // //                         .then((agents) => {
// // //                           setAgentList(agents || []);
// // //                           setShareUnit(unit);
// // //                           setAgentsOpen(true);
// // //                         })
// // //                         .catch(() => alert("Failed to fetch agents."));
// // //                     }}
// // //                     currentPropertyId={selectedRow?.PropertyID}
// // //                   />
// // //                 </div>
// // //                 {agentsOpen && (
// // //                   <div
// // //                     style={{ flex: 1, borderLeft: "1px solid #e5e7eb", paddingLeft: 16 }}
// // //                   >
// // //                     <AgentDetailsTable
// // //                       agents={agentList}
// // //                       shareUnit={shareUnit}
// // //                       onClose={() => setAgentsOpen(false)}
// // //                     />
// // //                   </div>
// // //                 )}
// // //               </div>
// // //             </Modal>
// // //           )}
// // //         </div>
// // //       </div>
// // //     </LoadScript>
// // //   );
// // // }

// // // function Modal({ children, open, onClose }) {
// // //   if (!open) return null;
// // //   return createPortal(
// // //     <div
// // //       onClick={onClose}
// // //       style={{
// // //         position: "fixed",
// // //         inset: 0,
// // //         backgroundColor: "rgba(0,0,0,0.45)",
// // //         zIndex: 1000,
// // //         display: "flex",
// // //         justifyContent: "center",
// // //         alignItems: "center",
// // //       }}
// // //     >
// // //       <div
// // //         onClick={(e) => e.stopPropagation()}
// // //         style={{
// // //           marginLeft: "220px",
// // //           width: "calc(100vw - 260px)",
// // //           maxWidth: 1400,
// // //           background: "#fff",
// // //           borderRadius: 10,
// // //           padding: 24,
// // //           boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
// // //           overflowY: "auto",
// // //           maxHeight: "85vh",
// // //         }}
// // //       >
// // //         {children}
// // //       </div>
// // //     </div>,
// // //     document.body
// // //   );
// // // }
// // import React, { useState, useEffect } from "react";
// // import { createPortal } from "react-dom";
// // import Sidebar from "../../components/Sidebar.jsx";
// // import ProjectDetailsTabsComponent from "./ProjectDetailsTabsComponent.jsx";
// // import AgentDetailsTable from "./AgentDetailsTable.jsx";
// // import { useApi } from "../../API/Api.js";
// // import { LoadScript } from "@react-google-maps/api";
// // import Table from "../../Utils/Table.jsx";

// // const SIDEBAR_WIDTH = 220;
// // const PAGE_PADDING = 20;
// // const GOOGLE_MAPS_API_KEY = "AIzaSyAGGzyx5AhGJIfBbzbz9ZeWWyjdGu7Elf0";

// // function Modal({ children, open, onClose }) {
// //   if (!open) return null;

// //   return createPortal(
// //     <div
// //       className="modal-overlay"
// //       onClick={onClose}
// //       style={{
// //         position: "fixed",
// //         inset: 0,
// //         backgroundColor: "rgba(0,0,0,0.3)",
// //         zIndex: 9999,
// //         display: "flex",
// //         justifyContent: "center",
// //         alignItems: "center",
// //       }}
// //     >
// //       <div
// //         style={{
// //           marginLeft: `${SIDEBAR_WIDTH + PAGE_PADDING}px`,
// //           marginRight: `${PAGE_PADDING}px`,
// //           width: `calc(100vw - ${SIDEBAR_WIDTH + PAGE_PADDING * 2}px)`,
// //           maxWidth: 1400,
// //           maxHeight: "80vh",
// //           padding: 24,
// //           display: "flex",
// //           gap: 24,
// //           overflow: "auto",
// //           position: "relative",
// //           background: "#fff",
// //           borderRadius: 12,
// //           boxShadow: "0 16px 40px rgba(0,0,0,.18)",
// //           boxSizing: "border-box",
// //         }}
// //         onClick={(e) => e.stopPropagation()}
// //       >
// //         {children}
// //       </div>
// //     </div>,
// //     document.body
// //   );
// // }

// // export default function SocialActivity() {
// //   const [activeTab, setActiveTab] = useState("Tours");
// //   const [displayData, setDisplayData] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const { fetchData } = useApi();

// //   const [currentPage, setCurrentPage] = useState(1);
// //   const rowsPerPage = 12;
// //   const [selectedRow, setSelectedRow] = useState(null);
// //   const [projectDetail, setProjectDetail] = useState(null);
// //   const [agentList, setAgentList] = useState([]);
// //   const [shareUnit, setShareUnit] = useState(null);
// //   const [agentsOpen, setAgentsOpen] = useState(false);

// //   const listParamTypes = {
// //     "Tours": "ToursDetails",
// //     "Request Info": "RequestinfoDetails",
// //     "Shared Properties": "SharePropertyDetails",
// //   };

// //   const projectInfoParamTypes = {
// //     "Tours": "ToursPropertyDetails",
// //     "Request Info": "RequestInfoPropertyDetails",
// //     "Shared Properties": "SharedPropertyDetails",
// //   };

// //   // Helper to resolve row id
// //   function getId(obj, keys) {
// //     for (const key of keys) if (obj[key] !== undefined) return obj[key];
// //     return null;
// //   }

// //   // Display fallback for null or undefined
// //   const displayValue = (val) => (val === null || val === undefined ? "null" : val);

// //   useEffect(() => {
// //     const loadData = async () => {
// //       setLoading(true);
// //       try {
// //         const paramtype = listParamTypes[activeTab] || "";
// //         const data = await fetchData(paramtype);
// //         setDisplayData(data || []);
// //         setCurrentPage(1);
// //         setSelectedRow(null);
// //         setProjectDetail(null);
// //         setAgentsOpen(false);
// //       } catch {
// //         setDisplayData([]);
// //       }
// //       setLoading(false);
// //     };
// //     loadData();
// //   }, [activeTab, fetchData]);

// //   const handleDetailsClick = async (row) => {
// //     setSelectedRow(row);
// //     setProjectDetail(null);
// //     setAgentsOpen(false);

// //     const projectId = getId(row, ["ProjectID", "ProjectId", "projectId", "projectid"]);
// //     const propertyId = getId(row, ["PropertyID", "PropertyId", "propertyId", "propertyid"]);
// //     if (!projectId || !propertyId) return;

// //     try {
// //       const paramtype = projectInfoParamTypes[activeTab];
// //       if (!paramtype) return;
// //       const allUnits = await fetchData(paramtype);

// //       const currentProjectUnits = allUnits.filter(
// //         (item) => String(getId(item, ["ProjectID", "ProjectId", "projectId", "projectid"])) === String(projectId)
// //       );
// //       if (currentProjectUnits.length === 0) return;

// //       const specificUnit = currentProjectUnits.find(
// //         (unit) => String(getId(unit, ["PropertyID", "PropertyId", "propertyId", "propertyid"])) === String(propertyId)
// //       );
// //       if (!specificUnit) return;

// //       setProjectDetail({
// //         details: {
// //           name: currentProjectUnits[0]?.ProjectName || `Project #${projectId}`,
// //           location:
// //             currentProjectUnits[0]?.Locality ||
// //             currentProjectUnits[0]?.Location ||
// //             currentProjectUnits[0]?.GeoLocation ||
// //             "N/A",
// //           ZipCode: currentProjectUnits[0]?.ZipCode || "N/A",
// //           description: currentProjectUnits[0]?.ProjectDescription || "Project description here ...",
// //         },
// //         latitude: parseFloat(currentProjectUnits[0]?.Latitude) || 0,
// //         longitude: parseFloat(currentProjectUnits[0]?.Longitude) || 0,
// //         units: currentProjectUnits.map((Unit) => ({
// //           type: Unit.Type ?? "N/A",
// //           price: Unit.Price ?? "N/A",
// //           area: Unit.Area ?? "N/A",
// //           facing: Unit.Facing ?? "N/A",
// //           bhk: Unit.BHK ?? "N/A",
// //           bath: Unit.Bath ?? "N/A",
// //           id: getId(Unit, ["PropertyID", "PropertyId", "propertyId", "propertyid"]),
// //           projectId,
// //         })),
// //         allPricesOfProject: currentProjectUnits
// //           .map((u) =>
// //             typeof u.Price === "string"
// //               ? parseFloat(u.Price.replace(/[^0-9.]/g, ""))
// //               : u.Price
// //           )
// //           .filter((val) => typeof val === "number" && !isNaN(val)),
// //         facts: {
// //           projectId,
// //           projectType: currentProjectUnits[0]?.PropertyType ?? "N/A",
// //           status: "N/A",
// //           area: specificUnit.Area,
// //           bedrooms: specificUnit.BHK,
// //           bathrooms: specificUnit.Bath,
// //           facings: specificUnit.Facing,
// //           unitCount: 1,
// //         },
// //         amenities: [],
// //         highlights: [],
// //         locationMap: true,
// //       });
// //     } catch (e) {
// //       setProjectDetail(null);
// //     }
// //   };

// //   // Columns config per tab
// //   const columnsConfig = {
// //     Tours: [
// //       { label: " Full Name", key: "FullName" },
// //       { label: "Phone", key: "PhoneNo" },
// //       { label: "Email", key: "Email" },
// //       { label: "ScheduledAt", key: "ScheduledAt" },
// //       { label: "TimeSlot", key: "TimeSlot" },
// //       { label: "ProjectID", key: "ProjectID" },
// //       { label: "PropertyID", key: "PropertyID" },
// //       {
// //         label: "Action",
// //         key: "action",
// //         render: (_, row) => (
// //           <button className="details-btn" onClick={() => handleDetailsClick(row)}>Details</button>
// //         ),
// //       },
// //     ],
// //     "Request Info": [
// //       { label: "Message", key: "Message" },
// //       { label: "Email", key: "Email" },
// //       { label: "Phone", key: "PhoneNo" },
// //       { label: "ProjectId", key: "ProjectID" },
// //       { label: "PropertyId", key: "PropertyID" },
// //       {
// //         label: "Action",
// //         key: "action",
// //         render: (_, row) => (
// //           <button className="details-btn" onClick={() => handleDetailsClick(row)}>Details</button>
// //         ),
// //       },
// //     ],
// //     "Shared Properties": [
// //       { label: "Name", key: "Name" },
// //       { label: "Email", key: "Email" },
// //       { label: "Phone", key: "PhoneNo" },
// //       { label: "Message", key: "Message" },
// //       { label: "Channel", key: "Channel" },
// //       { label: "ProjectId", key: "ProjectID" },
// //       { label: "PropertyId", key: "PropertyID" },
// //       {
// //         label: "Action",
// //         key: "action",
// //         render: (_, row) => (
// //           <button className="details-btn" onClick={() => handleDetailsClick(row)}>Details</button>
// //         ),
// //       },
// //     ],
// //   };

// //   return (
// //     <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
// //       <div className="dashboard-container" style={{ display: "flex" }}>
// //          <Sidebar />
// //           <div
// //         className="buyers-content"
// //         style={{
// //           flex: 1,
// //           position: "relative",
// //           minHeight: "100vh",
// //           // maxWidth: "calc(100vw - 260px)",
// //           overflowX: "hidden",
// //           padding: 24,
// //         }}
// //       >
// //         {/* Header Section */}
// //         <div
// //           style={{
// //             display: "flex",
// //             alignItems: "center",
// //             justifyContent: "space-between",
// //             marginBottom: 20,
// //           }}
// //         >
// //           <h2 style={{ margin: 0 }}>Social Activity</h2>
// //           <div
// //             style={{
// //               fontWeight: "bold",
// //               fontSize: "1.1rem",
// //               color: "#d4af37",
// //             }}
// //           >
// //             Kiran Reddy Pallaki
// //           </div>
// //         </div>

// //           <div style={{ marginBottom: 16 }}>
// //             {Object.keys(listParamTypes).map((tab) => (
// //               <button
// //                 key={tab}
// //                 onClick={() => setActiveTab(tab)}
// //                 style={{
// //                   // marginRight: 8,
// //                   padding: "8px 15px",
// //                   // borderRadius: 7,
// //                   fontWeight: 500,
// //                   fontSize: 15,
// //                   border: activeTab === tab ? "1px solid #d4af37":"1px solid #f0f0f0",
// //                   backgroundColor: activeTab === tab ? "#f0f0f0" : "#f0f0f0",
// //                   color: activeTab === tab ? "#d4af37" : "#121212",
// //                   cursor: "pointer",
// //                 }}
// //               >
// //                 {tab}
// //               </button>
// //             ))}
// //           </div>

// //           {loading ? (
// //             <p>Loading...</p>
// //           ) : (
// //             <Table
// //               columns={columnsConfig[activeTab]}
// //               data={displayData}
// //               rowsPerPage={rowsPerPage}
// //               // optional: pass setCurrentPage and currentPage if lifting state needed
// //             />
// //           )}

// //           <Modal
// //             open={!!selectedRow}
// //             onClose={() => {
// //               setSelectedRow(null);
// //               setProjectDetail(null);
// //               setAgentsOpen(false);
// //             }}
// //           >
// //             <div style={{ display: "flex", width: "100%", gap: 24 }}>
// //               <div
// //                 style={{
// //                   flex: 2,
// //                   overflowY: "auto",
// //                   paddingRight: 8,
// //                   minWidth: 360,
// //                   maxHeight: "calc(80vh - 48px)",
// //                 }}
// //               >
// //                 <ProjectDetailsTabsComponent
// //                   data={projectDetail}
// //                   initialTab="Details"
// //                   onClose={() => {
// //                     setSelectedRow(null);
// //                     setProjectDetail(null);
// //                     setAgentsOpen(false);
// //                   }}
// //                   onRequestShare={(unit) => {
// //                     fetchData("Agentinfo")
// //                       .then((agents) => {
// //                         setAgentList(agents || []);
// //                         setShareUnit(unit);
// //                         setAgentsOpen(true);
// //                       })
// //                       .catch(() => alert("Could not fetch agent list."));
// //                   }}
// //                   currentPropertyId={selectedRow?.PropertyID ?? selectedRow?.propertyId}
// //                 />
// //               </div>

// //               {agentsOpen && (
// //                 <div
// //                   style={{
// //                     flex: 1,
// //                     borderLeft: "1px solid #e5e7eb",
// //                     paddingLeft: 16,
// //                     overflowY: "auto",
// //                     maxHeight: "calc(80vh - 48px)",
// //                     minWidth: 300,
// //                   }}
// //                 >
// //                   <AgentDetailsTable agents={agentList} shareUnit={shareUnit} onClose={() => setAgentsOpen(false)} />
// //                 </div>
// //               )}
// //             </div>
// //           </Modal>
// //         </div>
// //       </div>
// //     </LoadScript>
// //   );
// // }
// import React, { useState, useEffect } from "react";
// import { createPortal } from "react-dom";
// import Sidebar from "../../components/Sidebar.jsx";
// import ProjectDetailsTabsComponent from "./ProjectDetailsTabsComponent.jsx";
// import AgentDetailsTable from "./AgentDetailsTable.jsx";
// import { useApi } from "../../API/Api.js";
// import { LoadScript } from "@react-google-maps/api";
// import Table from "../../Utils/Table.jsx";

// const SIDEBAR_WIDTH = 220;
// const PAGE_PADDING = 20;
// const GOOGLE_MAPS_API_KEY = "AIzaSyAGGzyx5AhGJIfBbzbz9ZeWWyjdGu7Elf0";

// function Modal({ children, open, onClose }) {
//   if (!open) return null;

//   return createPortal(
//     <div
//       className="modal-overlay"
//       onClick={onClose}
//       style={{
//         position: "fixed",
//         inset: 0,
//         backgroundColor: "rgba(0,0,0,0.3)",
//         zIndex: 9999,
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <div
//         style={{
//           marginLeft: `${SIDEBAR_WIDTH + PAGE_PADDING}px`,
//           marginRight: `${PAGE_PADDING}px`,
//           width: `calc(100vw - ${SIDEBAR_WIDTH + PAGE_PADDING * 2}px)`,
//           maxWidth: 1400,
//           maxHeight: "80vh",
//           padding: 24,
//           display: "flex",
//           gap: 24,
//           overflow: "auto",
//           position: "relative",
//           background: "#fff",
//           borderRadius: 12,
//           boxShadow: "0 16px 40px rgba(0,0,0,.18)",
//           boxSizing: "border-box",
//         }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         {children}
//       </div>
//     </div>,
//     document.body
//   );
// }

// export default function SocialActivity() {
//   const [activeTab, setActiveTab] = useState("Tours");
//   const [displayData, setDisplayData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const { fetchData } = useApi();

//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 12;
//   const [selectedRow, setSelectedRow] = useState(null);
//   const [projectDetail, setProjectDetail] = useState(null);
//   const [agentList, setAgentList] = useState([]);
//   const [shareUnit, setShareUnit] = useState(null);
//   const [agentsOpen, setAgentsOpen] = useState(false);

//   const listParamTypes = {
//     "Tours": "ToursDetails",
//     "Request Info": "RequestinfoDetails",
//     "Shared Properties": "SharePropertyDetails",
//   };

//   const projectInfoParamTypes = {
//     "Tours": "ToursPropertyDetails",
//     "Request Info": "RequestInfoPropertyDetails",
//     "Shared Properties": "SharedPropertyDetails",
//   };

//   // Helper to resolve row id
//   function getId(obj, keys) {
//     for (const key of keys) if (obj[key] !== undefined) return obj[key];
//     return null;
//   }

//   // Display fallback for null or undefined
//   const displayValue = (val) => (val === null || val === undefined ? "null" : val);

//   useEffect(() => {
//     const loadData = async () => {
//       setLoading(true);
//       try {
//         const paramtype = listParamTypes[activeTab] || "";
//         const data = await fetchData(paramtype);
//         setDisplayData(data || []);
//         setCurrentPage(1);
//         setSelectedRow(null);
//         setProjectDetail(null);
//         setAgentsOpen(false);
//       } catch {
//         setDisplayData([]);
//       }
//       setLoading(false);
//     };
//     loadData();
//   }, [activeTab, fetchData]);

//   const handleDetailsClick = async (row) => {
//     setSelectedRow(row);
//     setProjectDetail(null);
//     setAgentsOpen(false);

//     const projectId = getId(row, ["ProjectID", "ProjectId", "projectId", "projectid"]);
//     const propertyId = getId(row, ["PropertyID", "PropertyId", "propertyId", "propertyid"]);
//     if (!projectId || !propertyId) return;

//     try {
//       const paramtype = projectInfoParamTypes[activeTab];
//       if (!paramtype) return;
//       const allUnits = await fetchData(paramtype);

//       const currentProjectUnits = allUnits.filter(
//         (item) => String(getId(item, ["ProjectID", "ProjectId", "projectId", "projectid"])) === String(projectId)
//       );
//       if (currentProjectUnits.length === 0) return;

//       const specificUnit = currentProjectUnits.find(
//         (unit) => String(getId(unit, ["PropertyID", "PropertyId", "propertyId", "propertyid"])) === String(propertyId)
//       );
//       if (!specificUnit) return;

//       setProjectDetail({
//         details: {
//           name: currentProjectUnits[0]?.ProjectName || `Project #${projectId}`,
//           location:
//             currentProjectUnits[0]?.Locality ||
//             currentProjectUnits[0]?.Location ||
//             currentProjectUnits[0]?.GeoLocation ||
//             "N/A",
//           ZipCode: currentProjectUnits[0]?.ZipCode || "N/A",
//           description: currentProjectUnits[0]?.ProjectDescription || "Project description here ...",
//         },
//         latitude: parseFloat(currentProjectUnits[0]?.Latitude) || 0,
//         longitude: parseFloat(currentProjectUnits[0]?.Longitude) || 0,
//         units: currentProjectUnits.map((Unit) => ({
//           type: Unit.Type ?? "N/A",
//           price: Unit.Price ?? "N/A",
//           area: Unit.Area ?? "N/A",
//           facing: Unit.Facing ?? "N/A",
//           bhk: Unit.BHK ?? "N/A",
//           bath: Unit.Bath ?? "N/A",
//           id: getId(Unit, ["PropertyID", "PropertyId", "propertyId", "propertyid"]),
//           projectId,
//         })),
//         allPricesOfProject: currentProjectUnits
//           .map((u) =>
//             typeof u.Price === "string"
//               ? parseFloat(u.Price.replace(/[^0-9.]/g, ""))
//               : u.Price
//           )
//           .filter((val) => typeof val === "number" && !isNaN(val)),
//         facts: {
//           projectId,
//           projectType: currentProjectUnits[0]?.PropertyType ?? "N/A",
//           status: "N/A",
//           area: specificUnit.Area,
//           bedrooms: specificUnit.BHK,
//           bathrooms: specificUnit.Bath,
//           facings: specificUnit.Facing,
//           unitCount: 1,
//         },
//         amenities: [],
//         highlights: [],
//         locationMap: true,
//       });
//     } catch (e) {
//       setProjectDetail(null);
//     }
//   };

//   // Columns config per tab
//   const columnsConfig = {
//     Tours: [
//       { label: " Full Name", key: "FullName" },
//       { label: "Phone", key: "PhoneNo" },
//       { label: "Email", key: "Email" },
//       { label: "ScheduledAt", key: "ScheduledAt" },
//       { label: "TimeSlot", key: "TimeSlot" },
//       { label: "ProjectID", key: "ProjectID" },
//       { label: "PropertyID", key: "PropertyID" },
//       {
//         label: "Action",
//         key: "action",
//         render: (_, row) => (
//           <button className="details-btn" onClick={() => handleDetailsClick(row)}>Details</button>
//         ),
//       },
//     ],
//     "Request Info": [
//       { label: "Message", key: "Message" },
//       { label: "Email", key: "Email" },
//       { label: "Phone", key: "PhoneNo" },
//       { label: "ProjectId", key: "ProjectID" },
//       { label: "PropertyId", key: "PropertyID" },
//       {
//         label: "Action",
//         key: "action",
//         render: (_, row) => (
//           <button className="details-btn" onClick={() => handleDetailsClick(row)}>Details</button>
//         ),
//       },
//     ],
//     "Shared Properties": [
//       { label: "Name", key: "Name" },
//       { label: "Email", key: "Email" },
//       { label: "Phone", key: "PhoneNo" },
//       { label: "Message", key: "Message" },
//       { label: "Channel", key: "Channel" },
//       { label: "ProjectId", key: "ProjectID" },
//       { label: "PropertyId", key: "PropertyID" },
//       {
//         label: "Action",
//         key: "action",
//         render: (_, row) => (
//           <button className="details-btn" onClick={() => handleDetailsClick(row)}>Details</button>
//         ),
//       },
//     ],
//   };

//   return (
//     <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
//       <div className="dashboard-container" style={{ display: "flex",marginLeft:180 }}>
//          <Sidebar />
//           <div
//         className="buyers-content"
//         style={{
//           flex: 1,
//           position: "relative",
//           minHeight: "100vh",
//           // maxWidth: "calc(100vw - 260px)",
//           overflowX: "hidden",
//           padding: 24,
//         }}
//       >
//         {/* Header Section */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             marginBottom: 20,
//           }}
//         >
//           <h2 style={{ margin: 0 }}>Social Activity</h2>
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

//           <div style={{ marginBottom: 16 }}>
//             {Object.keys(listParamTypes).map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 style={{
//                   // marginRight: 8,
//                   padding: "8px 15px",
//                   // borderRadius: 7,
//                   fontWeight:activeTab === tab ?600:500,
//                   fontSize: "13px",
//                   border: "none",
//                   backgroundColor: activeTab === tab ? "#fff" : "#f0f0f0",
//                   color: activeTab === tab ? "#2c3e50" : "#666",
//                   cursor: "pointer",
//                   borderBottom:activeTab === tab?"3px solid #2c3e50":"3px solid transparent",
//                   transition:"background-color 0.3s ease,color 0.3s ease",
//                 }}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>

//           {loading ? (
//             <p>Loading...</p>
//           ) : (
//             <Table
//               columns={columnsConfig[activeTab]}
//               paginatedData={displayData}
//               rowsPerPage={rowsPerPage}
//               // optional: pass setCurrentPage and currentPage if lifting state needed
//             />
//           )}

//           <Modal
//             open={!!selectedRow}
//             onClose={() => {
//               setSelectedRow(null);
//               setProjectDetail(null);
//               setAgentsOpen(false);
//             }}
//           >
//             <div style={{ display: "flex", width: "100%", gap: 24 }}>
//               <div
//                 style={{
//                   flex: 2,
//                   overflowY: "auto",
//                   paddingRight: 8,
//                   minWidth: 360,
//                   maxHeight: "calc(80vh - 48px)",
//                 }}
//               >
//                 <ProjectDetailsTabsComponent
//                   data={projectDetail}
//                   initialTab="Details"
//                   onClose={() => {
//                     setSelectedRow(null);
//                     setProjectDetail(null);
//                     setAgentsOpen(false);
//                   }}
//                   onRequestShare={(unit) => {
//                     fetchData("Agentinfo")
//                       .then((agents) => {
//                         setAgentList(agents || []);
//                         setShareUnit(unit);
//                         setAgentsOpen(true);
//                       })
//                       .catch(() => alert("Could not fetch agent list."));
//                   }}
//                   currentPropertyId={selectedRow?.PropertyID ?? selectedRow?.propertyId}
//                 />
//               </div>

//               {agentsOpen && (
//                 <div
//                   style={{
//                     flex: 1,
//                     borderLeft: "1px solid #e5e7eb",
//                     paddingLeft: 16,
//                     overflowY: "auto",
//                     maxHeight: "calc(80vh - 48px)",
//                     minWidth: 300,
//                   }}
//                 >
//                   <AgentDetailsTable agents={agentList} shareUnit={shareUnit} onClose={() => setAgentsOpen(false)} />
//                 </div>
//               )}
//             </div>
//           </Modal>
//         </div>
//       </div>
//     </LoadScript>
//   );
// }
import React, { useState, useEffect } from "react";
=======
 import React, { useState, useEffect, useMemo } from "react";
>>>>>>> 575ef5d (newupdate)
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar.jsx";
import ProjectDetailsTabsComponent from "./ProjectDetailsTabsComponent.jsx";
import AgentDetailsTable from "./AgentDetailsTable.jsx";
import { useApi } from "../../API/Api.js";
import { LoadScript } from "@react-google-maps/api";
<<<<<<< HEAD
import Table from "../../Utils/Table.jsx";
import { Filter } from "lucide-react";
=======
import { Pagination } from "../../Utils/Table.jsx";
>>>>>>> 575ef5d (newupdate)

const GOOGLE_MAPS_API_KEY = "AIzaSyAGGzyx5AhGJIfBbzbz9ZeWWyjdGu7Elf0";

// ✅ Reusable Modal
function Modal({ children, open, onClose }) {
  if (!open) return null;
  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.45)",
        zIndex: 1000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          marginLeft: "220px",
          width: "calc(100vw - 260px)",
          maxWidth: 1400,
          background: "#fff",
          borderRadius: 10,
          padding: 24,
          boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
          overflowY: "auto",
          maxHeight: "85vh",
        }}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

// ✅ Spinner
const Spinner = () => (
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
        width: 48,
        height: 48,
        border: "5px solid #ddd",
        borderTop: "5px solid #2c3e50",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    />
    <style>
      {`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
);

export default function SocialActivity() {
  const navigate = useNavigate();
  const { fetchData } = useApi();

  const [activeTab, setActiveTab] = useState("Tours");
  const [displayData, setDisplayData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);
  const [projectDetail, setProjectDetail] = useState(null);
  const [agentList, setAgentList] = useState([]);
  const [shareUnit, setShareUnit] = useState(null);
  const [agentsOpen, setAgentsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Filter related states
  const [openFilter, setOpenFilter] = useState(null);
  const [filters, setFilters] = useState({});
  const [filterSearchValue, setFilterSearchValue] = useState("");

  const listParamTypes = {
    Tours: "ToursDetails",
    "Request Info": "RequestinfoDetails",
    "Shared Properties": "SharePropertyDetails",
  };

  const projectInfoParamTypes = {
    Tours: "ToursPropertyDetails",
    "Request Info": "RequestInfoPropertyDetails",
    "Shared Properties": "SharedPropertyDetails",
  };

  const getId = (obj, keys) => {
    for (const key of keys) if (obj[key] !== undefined) return obj[key];
    return null;
  };

  // ✅ Fetch list data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setPage(1);
        const res = await fetchData(listParamTypes[activeTab]);
        setDisplayData(Array.isArray(res) ? res : res?.data || []);
      } catch {
        setDisplayData([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [activeTab, fetchData]);

  // ✅ Handle project details
  const handleDetailsClick = async (row) => {
    setSelectedRow(row);
    setProjectDetail(null);
    setAgentsOpen(false);

    const projectId = getId(row, ["ProjectID", "ProjectId", "projectId"]);
    const propertyId = getId(row, ["PropertyID", "PropertyId", "propertyId"]);
    if (!projectId || !propertyId) return;

    try {
      const allUnits = await fetchData(projectInfoParamTypes[activeTab]);
      const units = Array.isArray(allUnits) ? allUnits : allUnits?.data || [];

<<<<<<< HEAD
      const currentProjectUnits = allUnits.filter(
        (item) =>
          String(getId(item, ["ProjectID", "ProjectId", "projectId", "projectid"])) ===
=======
      const currentProjectUnits = units.filter(
        (u) =>
          String(getId(u, ["ProjectID", "ProjectId", "projectId"])) ===
>>>>>>> 575ef5d (newupdate)
          String(projectId)
      );

      const specificUnit = currentProjectUnits.find(
<<<<<<< HEAD
        (unit) =>
          String(getId(unit, ["PropertyID", "PropertyId", "propertyId", "propertyid"])) ===
=======
        (u) =>
          String(getId(u, ["PropertyID", "PropertyId", "propertyId"])) ===
>>>>>>> 575ef5d (newupdate)
          String(propertyId)
      );
      if (!specificUnit) return;

      setProjectDetail({
        details: {
          name: currentProjectUnits[0]?.ProjectName || `Project #${projectId}`,
          location:
            currentProjectUnits[0]?.Locality ||
            currentProjectUnits[0]?.Location ||
            "N/A",
          description:
            currentProjectUnits[0]?.ProjectDescription || "No Description",
        },
        latitude: parseFloat(currentProjectUnits[0]?.Latitude) || 0,
        longitude: parseFloat(currentProjectUnits[0]?.Longitude) || 0,
        units: currentProjectUnits.map((u) => ({
          type: u.Type ?? "N/A",
          price: u.Price ?? "N/A",
          area: u.Area ?? "N/A",
          bhk: u.BHK ?? "N/A",
          facing: u.Facing ?? "N/A",
          id: getId(u, ["PropertyID", "PropertyId", "propertyId"]),
          projectId,
        })),
<<<<<<< HEAD
        allPricesOfProject: currentProjectUnits
          .map((u) =>
            typeof u.Price === "string" ? parseFloat(u.Price.replace(/[^0-9.]/g, "")) : u.Price
          )
          .filter((val) => typeof val === "number" && !isNaN(val)),
        facts: {
          projectId,
          projectType: currentProjectUnits[0]?.PropertyType ?? "N/A",
          status: "N/A",
          area: specificUnit.Area,
          bedrooms: specificUnit.BHK,
          bathrooms: specificUnit.Bath,
          facings: specificUnit.Facing,
          unitCount: 1,
        },
        amenities: [],
        highlights: [],
        locationMap: true,
=======
>>>>>>> 575ef5d (newupdate)
      });
    } catch {
      setProjectDetail(null);
    }
  };

<<<<<<< HEAD
  // Filter handlers
  const toggleFilterHandler = (key) => {
    setOpenFilter((prev) => (prev === key ? null : key));
    setFilterSearchValue("");
  };

  const handleCheckboxChange = (key, value) => {
    setFilters((prev) => {
      const prevVals = prev[key] || [];
      const newVals = prevVals.includes(value)
        ? prevVals.filter((v) => v !== value)
        : [...prevVals, value];
      return { ...prev, [key]: newVals };
    });
  };

  const clearFilterHandler = (key) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
    setOpenFilter(null);
  };

  const applyFilterHandler = () => {
    setOpenFilter(null);
  };

  const uniqueValues = (key) => {
    const sourceData = displayData || [];
    return Array.from(
      new Set(
        sourceData
          .map((item) => (item[key] != null ? item[key] : "N/A"))
          .filter((val) => val !== "")
      )
    ).sort((a, b) => a.toString().localeCompare(b.toString()));
  };

  const filterByColumns = (data) => {
    if (!Object.keys(filters).length) return data;
    return data.filter((item) =>
      Object.entries(filters).every(([key, values]) => {
        if (!values.length) return true;
        const itemVal = item[key] != null ? item[key] : "N/A";
        return values.includes(itemVal);
      })
    );
  };

  // Function to wrap header labels with filter UI
  const renderHeaderWithFilter = (label, key) => (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
          cursor: "pointer",
          userSelect: "none",
        }}
        onClick={(e) => {
          e.stopPropagation();
          toggleFilterHandler(key);
        }}
      >
        <span>{label}</span>
        <Filter
          size={14}
          color={openFilter === key ? "#22253b" : "#adb1bd"}
          style={{ flexShrink: 0 }}
        />
      </div>
      {openFilter === key && (
        <div
          style={{
            position: "absolute",
            backgroundColor: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            marginTop: 4,
            padding: 10,
            borderRadius: 4,
            maxHeight: 250,
            overflowY: "auto",
            zIndex: 1000,
            minWidth: 160,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="text"
            placeholder={`Search ${label}`}
            value={filterSearchValue}
            onChange={(e) => setFilterSearchValue(e.target.value)}
            style={{
              width: "100%",
              marginBottom: 8,
              padding: 6,
              fontSize: 14,
              borderRadius: 4,
              border: "1px solid #ddd",
            }}
          />
          <div style={{ maxHeight: 180, overflowY: "auto" }}>
            {uniqueValues(key)
              .filter((val) =>
                val.toString().toLowerCase().includes(filterSearchValue.toLowerCase())
              )
              .map((val) => (
                <label
                  key={val}
                  style={{ display: "block", marginBottom: 4, cursor: "pointer" }}
                >
                  <input
                    type="checkbox"
                    checked={(filters[key] || []).includes(val)}
                    onChange={() => handleCheckboxChange(key, val)}
                    style={{ marginRight: 6 }}
                  />
                  {val}
                </label>
              ))}
          </div>
          <div style={{ marginTop: 8, textAlign: "right" }}>
            <button
              onClick={() => clearFilterHandler(key)}
              style={{
                marginRight: 8,
                backgroundColor: "#eee",
                border: "none",
                padding: "5px 8px",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Clear
            </button>
            <button
              onClick={applyFilterHandler}
              style={{
                backgroundColor: "#2c3e50",
                color: "#fff",
                border: "none",
                padding: "5px 8px",
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

  // Columns with filter headers for each tab
  const columnsConfig = {
    Tours: [
      { label: renderHeaderWithFilter("Full Name", "FullName"), key: "FullName" },
      { label: renderHeaderWithFilter("Phone", "PhoneNo"), key: "PhoneNo" },
      { label: renderHeaderWithFilter("Email", "Email"), key: "Email" },
      { label: renderHeaderWithFilter("ScheduledAt", "ScheduledAt"), key: "ScheduledAt" },
      { label: renderHeaderWithFilter("TimeSlot", "TimeSlot"), key: "TimeSlot" },
      { label: renderHeaderWithFilter("ProjectID", "ProjectID"), key: "ProjectID" },
      { label: renderHeaderWithFilter("PropertyID", "PropertyID"), key: "PropertyID" },
=======
  // ✅ Columns for each tab
  const columnsConfig = {
    Tours: [
      { label: "Full Name", key: "FullName" },
      { label: "Phone", key: "PhoneNo" },
      { label: "Email", key: "Email" },
      { label: "Scheduled At", key: "ScheduledAt" },
      { label: "Time Slot", key: "Timeslot" },
      { label: "Project ID", key: "ProjectID" },
      { label: "Property ID", key: "PropertyID" },
>>>>>>> 575ef5d (newupdate)
      {
        label: "Action",
        key: "action",
        render: (_, row) => (
<<<<<<< HEAD
          <button className="details-btn" onClick={() => handleDetailsClick(row)}>
=======
          <button
            onClick={() => handleDetailsClick(row)}
            style={{
              color: "#0d0c0c",
              border: "none",
              borderRadius: 6,
              padding: "4px 10px",
              cursor: "pointer",
              backgroundColor: "#ebedf0",
            }}
          >
>>>>>>> 575ef5d (newupdate)
            Details
          </button>
        ),
      },
    ],
    "Request Info": [
<<<<<<< HEAD
      { label: renderHeaderWithFilter("Message", "Message"), key: "Message" },
      { label: renderHeaderWithFilter("Email", "Email"), key: "Email" },
      { label: renderHeaderWithFilter("Phone", "PhoneNo"), key: "PhoneNo" },
      { label: renderHeaderWithFilter("ProjectId", "ProjectID"), key: "ProjectID" },
      { label: renderHeaderWithFilter("PropertyId", "PropertyID"), key: "PropertyID" },
=======
      { label: "Message", key: "Message" },
      { label: "Email", key: "Email" },
      { label: "Phone", key: "PhoneNo" },
      { label: "Project ID", key: "ProjectID" },
      { label: "Property ID", key: "PropertyID" },
>>>>>>> 575ef5d (newupdate)
      {
        label: "Action",
        key: "action",
        render: (_, row) => (
<<<<<<< HEAD
          <button className="details-btn" onClick={() => handleDetailsClick(row)}>
=======
          <button
            onClick={() => handleDetailsClick(row)}
            style={{
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "4px 10px",
              cursor: "pointer",
              backgroundColor: "#bcc0c5",
            }}
          >
>>>>>>> 575ef5d (newupdate)
            Details
          </button>
        ),
      },
    ],
    "Shared Properties": [
<<<<<<< HEAD
      { label: renderHeaderWithFilter("Name", "Name"), key: "Name" },
      { label: renderHeaderWithFilter("Email", "Email"), key: "Email" },
      { label: renderHeaderWithFilter("Phone", "PhoneNo"), key: "PhoneNo" },
      { label: renderHeaderWithFilter("Message", "Message"), key: "Message" },
      { label: renderHeaderWithFilter("Channel", "Channel"), key: "Channel" },
      { label: renderHeaderWithFilter("ProjectId", "ProjectID"), key: "ProjectID" },
      { label: renderHeaderWithFilter("PropertyId", "PropertyID"), key: "PropertyID" },
=======
      { label: "Name", key: "Name" },
      { label: "Email", key: "Email" },
      { label: "Phone", key: "PhoneNo" },
      { label: "Message", key: "Message" },
      { label: "Channel", key: "Channel" },
      { label: "Project ID", key: "ProjectID" },
      { label: "Property ID", key: "PropertyID" },
>>>>>>> 575ef5d (newupdate)
      {
        label: "Action",
        key: "action",
        render: (_, row) => (
<<<<<<< HEAD
          <button className="details-btn" onClick={() => handleDetailsClick(row)}>
=======
          <button
            onClick={() => handleDetailsClick(row)}
            style={{
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "4px 10px",
              cursor: "pointer",
              backgroundColor: "#54575b",
            }}
          >
>>>>>>> 575ef5d (newupdate)
            Details
          </button>
        ),
      },
    ],
  };

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return displayData.slice(start, start + rowsPerPage);
  }, [displayData, page]);

  const totalPages = Math.ceil(displayData.length / rowsPerPage);

  // ✅ FIX: main content spacing adjusted
  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
<<<<<<< HEAD
      <div className="dashboard-container" style={{ display: "flex", marginLeft: 180 }}>
=======
      <div style={{ display: "flex", minHeight: "100vh", background: "#fff" }}>
>>>>>>> 575ef5d (newupdate)
        <Sidebar />
        <div
          className="buyers-content"
          style={{
            flex: 1,
<<<<<<< HEAD
            position: "relative",
            minHeight: "100vh",
            overflowX: "hidden",
            padding: 24,
          }}
        >
          {/* Header Section */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <h2 style={{ margin: 0,fontweight:400 }}>Social Activity</h2>
            <div
              style={{
                fontWeight: "bold",
                fontSize: "1.1rem",
                color: "#d4af37",
              }}
            >
              Kiran Reddy Pallaki
            </div>
          </div>

          <div style={{ marginBottom: 16,gap:"2px",display:"flex", }}>
            {Object.keys(listParamTypes).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  
                  padding: "8px 15px",
                  fontWeight: activeTab === tab ? 600 : 500,
                  fontSize: "13px",
                  border: "none",
                  backgroundColor: activeTab === tab ? "#fff" : "#f0f0f0",
                  color: activeTab === tab ? "#2c3e50" : "#666",
                  cursor: "pointer",
                  borderBottom: activeTab === tab ? "3px solid #2c3e50" : "3px solid transparent",
                  transition: "background-color 0.3s ease,color 0.3s ease",
                  marginRight:"1px #fff"
=======
            marginLeft: "190px",
            padding: "20px 30px",
            background: "#fff",
          }}
        >
          {/* ✅ Back Button */}
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
              marginBottom: 10,
            }}
          >
            Back
          </button>

            <h2
          style={{
            marginBottom: 14,
            color: "#222",
            fontSize: "1.05rem",
            fontWeight: "600",
          }}
        >
        Social Activity
        </h2>

          {/* ✅ Tabs */}
          <div
            style={{
              display: "flex",
              gap: 2,
              marginBottom: 20,
            }}
          >
            {Object.keys(listParamTypes).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setPage(1);
                  }}
                  style={{
                    backgroundColor: isActive ? "#fff" : "#f0f0f0",
                    color: isActive ? "#2c3e50" : "#666",
                    border: "none",
                    outline: "none",
                    cursor: "pointer",
                    padding: "10px 14px",
                    fontSize: "13px",
                    fontWeight: isActive ? 600 : 500,
                    borderBottom: isActive
                      ? "3px solid #2c3e50"
                      : "3px solid transparent",
                    borderTopLeftRadius: 6,
                    borderTopRightRadius: 6,
                    transition: "0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.target.style.color = "#000";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.target.style.color = "#666";
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* ✅ Table */}
          {loading ? (
            <Spinner />
          ) : (
            <>
              <div
                style={{
                  background: "#fff",
                  borderRadius: 10,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                  overflow: "hidden",
                  padding: "10px 0",
>>>>>>> 575ef5d (newupdate)
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    textAlign: "center",
                  }}
                >
                  <thead>
                    <tr style={{ background: "#f9fafb" }}>
                      {columnsConfig[activeTab].map((col) => (
                        <th
                          key={col.key}
                          style={{
                            padding: "8px 10px",
                            fontWeight: 600,
                            fontSize: "0.85rem",
                            borderBottom: "1px solid #e5e7eb",
                            color: "#374151",
                          }}
                        >
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.length === 0 ? (
                      <tr>
                        <td
                          colSpan={columnsConfig[activeTab].length}
                          style={{
                            padding: 20,
                            color: "#666",
                            textAlign: "center",
                          }}
                        >
                          No data available
                        </td>
                      </tr>
                    ) : (
                      paginatedData.map((row, idx) => (
                        <tr
                          key={idx}
                          style={{
                            height: 36,
                            borderBottom: "1px solid #f1f1f1",
                            backgroundColor:
                              idx % 2 === 0 ? "#fff" : "#fafafa",
                            fontSize: "0.84rem",
                          }}
                        >
                          {columnsConfig[activeTab].map((col) => (
                            <td
                              key={col.key}
                              style={{
                                padding: "6px 8px",
                                color: "#333",
                              }}
                            >
                              {col.render
                                ? col.render(row[col.key], row, idx)
                                : row[col.key] || "-"}
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

<<<<<<< HEAD
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Table
              columns={columnsConfig[activeTab]}
              paginatedData={filterByColumns(displayData)}
              rowsPerPage={rowsPerPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
=======
              {totalPages > 1 && (
                <Pagination page={page} setPage={setPage} totalPages={totalPages} />
              )}
            </>
>>>>>>> 575ef5d (newupdate)
          )}

          {/* ✅ Modal Section */}
          <Modal
            open={!!selectedRow}
            onClose={() => {
              setSelectedRow(null);
              setProjectDetail(null);
              setAgentsOpen(false);
            }}
          >
            <div style={{ display: "flex", gap: 24 }}>
              <div style={{ flex: 2 }}>
                <ProjectDetailsTabsComponent
                  data={projectDetail}
                  initialTab="Details"
                  onClose={() => setSelectedRow(null)}
                  onRequestShare={(unit) => {
                    fetchData("Agentinfo")
                      .then((agents) => {
                        setAgentList(agents || []);
                        setShareUnit(unit);
                        setAgentsOpen(true);
                      })
                      .catch(() => alert("Failed to fetch agents."));
                  }}
<<<<<<< HEAD
                  currentPropertyId={
                    selectedRow?.PropertyID ?? selectedRow?.propertyId
                  }
=======
                  currentPropertyId={selectedRow?.PropertyID}
>>>>>>> 575ef5d (newupdate)
                />
              </div>
              {agentsOpen && (
                <div
                  style={{
                    flex: 1,
                    borderLeft: "1px solid #e5e7eb",
                    paddingLeft: 16,
                  }}
                >
                  <AgentDetailsTable
                    agents={agentList}
                    shareUnit={shareUnit}
                    onClose={() => setAgentsOpen(false)}
                  />
                </div>
              )}
            </div>
          </Modal>
        </div>
      </div>
    </LoadScript>
  );
}
