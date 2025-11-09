// // // // //  import React, { useEffect, useState, useMemo } from "react";
// // // // // import { useLocation, useNavigate } from "react-router-dom";
// // // // // import Sidebar from "../../components/Sidebar.jsx";
// // // // // import { useApi } from "../../API/Api.js";
// // // // // import Table, { Pagination } from "../../Utils/Table.jsx";
// // // // // import { Search, Filter, ArrowLeft } from "lucide-react";

// // // // // const TABS = {
// // // // //   COMPANY: "company",
// // // // //   PROJECTS: "projects",
// // // // //   PROPERTIES: "properties",
// // // // // };

// // // // // // Simple Modal component unchanged
// // // // // function SimpleModal({ open, onClose, children }) {
// // // // //   if (!open) return null;
// // // // //   return (
// // // // //     <div
// // // // //       style={{
// // // // //         position: "fixed",
// // // // //         top: 0,
// // // // //         left: 0,
// // // // //         right: 0,
// // // // //         bottom: 0,
// // // // //         backgroundColor: "rgba(0,0,0,0.5)",
// // // // //         display: "flex",
// // // // //         justifyContent: "center",
// // // // //         alignItems: "center",
// // // // //         zIndex: 9999,
// // // // //       }}
// // // // //       onClick={onClose}
// // // // //     >
// // // // //       <div
// // // // //         onClick={(e) => e.stopPropagation()}
// // // // //         style={{
// // // // //           backgroundColor: "#fff",
// // // // //           padding: 24,
// // // // //           borderRadius: 8,
// // // // //           minWidth: 320,
// // // // //           maxWidth: 600,
// // // // //           maxHeight: "80vh",
// // // // //           overflowY: "auto",
// // // // //           boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
// // // // //         }}
// // // // //       >
// // // // //         {children}
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // // // Modal for project details unchanged
// // // // // function ProjectDetailsModal({ open, onClose, project, TableComponent }) {
// // // // //   if (!project) return null;
// // // // //   const modalColumns = [
// // // // //     { label: "Type", key: "PropertyType" },
// // // // //     { label: "Status", key: "PropertyStatus" },
// // // // //     { label: "Bedrooms", key: "Bedrooms" },
// // // // //     { label: "Facing", key: "Facing" },
// // // // //   ];
// // // // //   return (
// // // // //     <SimpleModal open={open} onClose={onClose}>
// // // // //       <h2 style={{ marginTop: 0, marginBottom: 12, color: "#22253b" }}>
// // // // //         {project.ProjectName || project.projectname}
// // // // //       </h2>
// // // // //       <div>
// // // // //         <strong>Description:</strong>{" "}
// // // // //         {project.Description || project.description || "Not specified"}
// // // // //       </div>
// // // // //       <div>
// // // // //         <strong>Price Range:</strong>{" "}
// // // // //         {project.AmountWithUnit || project.amountwithunit || "N/A"}
// // // // //       </div>
// // // // //       <div style={{ marginTop: 18 }}>
// // // // //         <TableComponent
// // // // //           columns={modalColumns}
// // // // //           paginatedData={[project]}
// // // // //           rowsPerPage={1}
// // // // //         />
// // // // //       </div>
// // // // //     </SimpleModal>
// // // // //   );
// // // // // }

// // // // // export default function ProjectsDetails() {
// // // // //   const navigate = useNavigate();
// // // // //   const location = useLocation();
// // // // //   const defaultTabFromDashboard = location.state?.defaultTab || TABS.COMPANY;
// // // // //   const fromDashboard = location.state?.fromDashboard || false;

// // // // //   const [activeTab, setActiveTab] = useState(defaultTabFromDashboard);
// // // // //   const [companyData, setCompanyData] = useState([]);
// // // // //   const [projectsData, setProjectsData] = useState([]);
// // // // //   const [propertiesData, setPropertiesData] = useState([]);
// // // // //   const [filteredCompanies, setFilteredCompanies] = useState([]);
// // // // //   const [filteredProjects, setFilteredProjects] = useState([]);
// // // // //   const [filteredProperties, setFilteredProperties] = useState([]);
// // // // //   const [loading, setLoading] = useState(false);
// // // // //   const [error, setError] = useState(null);
// // // // //   const [selectedProject, setSelectedProject] = useState(null);
// // // // //   const [modalOpen, setModalOpen] = useState(false);
// // // // //   const [searchQuery, setSearchQuery] = useState("");
// // // // //   const { fetchData } = useApi();

// // // // //   const [page, setPage] = useState(1);
// // // // //   const rowsPerPage = 15;

// // // // //   const [openFilter, setOpenFilter] = useState(null);
// // // // //   const [filters, setFilters] = useState({});
// // // // //   const [filterSearchValue, setFilterSearchValue] = useState("");

// // // // //   const toggleFilter = (key) => {
// // // // //     setOpenFilter((prev) => (prev === key ? null : key));
// // // // //     setFilterSearchValue("");
// // // // //   };

// // // // //   const handleCheckboxChange = (key, value) => {
// // // // //     setFilters((prev) => {
// // // // //       const prevVals = prev[key] || [];
// // // // //       const newVals = prevVals.includes(value)
// // // // //         ? prevVals.filter((v) => v !== value)
// // // // //         : [...prevVals, value];
// // // // //       return { ...prev, [key]: newVals };
// // // // //     });
// // // // //   };

// // // // //   const clearFilter = (key) => {
// // // // //     setFilters((prev) => {
// // // // //       const newFilters = { ...prev };
// // // // //       delete newFilters[key];
// // // // //       return newFilters;
// // // // //     });
// // // // //     setOpenFilter(null);
// // // // //   };

// // // // //   const applyFilter = () => {
// // // // //     let dataToFilter = [];
// // // // //     if (activeTab === TABS.COMPANY) dataToFilter = companyData;
// // // // //     else if (activeTab === TABS.PROJECTS) dataToFilter = projectsData;
// // // // //     else dataToFilter = propertiesData;

// // // // //     const filtered = dataToFilter.filter((item) =>
// // // // //       Object.entries(filters).every(([key, values]) =>
// // // // //         !values.length ? true : values.includes(item[key])
// // // // //       )
// // // // //     );

// // // // //     if (activeTab === TABS.COMPANY) setFilteredCompanies(filtered);
// // // // //     else if (activeTab === TABS.PROJECTS) setFilteredProjects(filtered);
// // // // //     else setFilteredProperties(filtered);

// // // // //     setOpenFilter(null);
// // // // //   };

// // // // //   const uniqueValues = (key) => {
// // // // //     let sourceData = [];
// // // // //     if (activeTab === TABS.COMPANY) sourceData = filteredCompanies;
// // // // //     else if (activeTab === TABS.PROJECTS) sourceData = filteredProjects;
// // // // //     else sourceData = filteredProperties;

// // // // //     return Array.from(
// // // // //       new Set(sourceData.map((item) => item[key]).filter((val) => val != null))
// // // // //     );
// // // // //   };

// // // // //   const renderHeaderWithFilter = (label, key) => (
// // // // //     <div
// // // // //       style={{
// // // // //         display: "flex",
// // // // //         alignItems: "center",
// // // // //         justifyContent: "center",
// // // // //         gap: 5,
// // // // //       }}
// // // // //     >
// // // // //       <span>{label}</span>
// // // // //       <Filter
// // // // //         size={14}
// // // // //         style={{
// // // // //           cursor: "pointer",
// // // // //           color: openFilter === key ? "#22253b" : "#adb1bd",
// // // // //         }}
// // // // //         onClick={(e) => {
// // // // //           e.stopPropagation();
// // // // //           toggleFilter(key);
// // // // //         }}
// // // // //       />
// // // // //     </div>
// // // // //   );

// // // // //   const companyColumns = [
// // // // //     { label: renderHeaderWithFilter("S.No", "serialNo"), key: "serialNo", render: (_, __, idx) => idx + 1 },
// // // // //     { label: renderHeaderWithFilter("Company Name", "CompanyName"), key: "CompanyName" },
// // // // //     { label: renderHeaderWithFilter("Projects", "TotalProjects"), key: "TotalProjects" },
// // // // //     {
// // // // //       label: renderHeaderWithFilter("OperatingCities", "OperatingCities"),
// // // // //       key: "OperatingCities",
// // // // //       render: (val) => {
// // // // //         if (!val) return "N/A";
// // // // //         const citiesArray = val.split(",").map((city) => city.trim());
// // // // //         if (citiesArray.length <= 2) {
// // // // //           return val;
// // // // //         }
// // // // //         const displayCities = citiesArray.slice(0, 2).join(", ") + ", ...";
// // // // //         return <span title={citiesArray.join(", ")}>{displayCities}</span>;
// // // // //       },
// // // // //     },
// // // // //     { label: renderHeaderWithFilter("Operating Since", "OperatingSince"), key: "OperatingYear" },
// // // // //     { label: renderHeaderWithFilter("ReadyToMove", "ReadyToMove"), key: "ReadyToMove" },
// // // // //     { label: renderHeaderWithFilter("UnderConstruction", "UnderConstruction"), key: "UnderConstruction" },
// // // // //   ];

// // // // //   const projectColumns = [
// // // // //     { label: renderHeaderWithFilter("S.No", "serialNo"), key: "serialNo", render: (_, __, idx) => idx + 1 },
// // // // //     { label: renderHeaderWithFilter("Project Name", "ProjectName"), key: "ProjectName" },
// // // // //     { label: renderHeaderWithFilter("ProjectID", "ProjectID"), key: "ProjectID" },
// // // // //     { label: renderHeaderWithFilter("CustomProjectTypes", "CustomProjectTypes"), key: "CustomProjectTypes" },
// // // // //     { label: renderHeaderWithFilter("Status", "ProjectStatus"), key: "ProjectStatus" },
// // // // //     { label: renderHeaderWithFilter("Locality", "Locality"), key: "Locality" },
// // // // //   ];

// // // // //   const propertyColumns = [
// // // // //     { label: renderHeaderWithFilter("S.No", "serialNo"), key: "serialNo", render: (_, __, idx) => idx + 1 },
// // // // //     { label: renderHeaderWithFilter("ProjectName", "projectname"), key: "projectname" },
// // // // //     { label: renderHeaderWithFilter("Property ID", "PropertyID"), key: "PropertyID" },
// // // // //     { label: renderHeaderWithFilter("Property Name", "PropertyName"), key: "PropertyName" },
// // // // //     { label: renderHeaderWithFilter("Price", "AmountWithUnit"), key: "AmountWithUnit" },
// // // // //     { label: renderHeaderWithFilter("Type", "PropertyType"), key: "PropertyType" },
// // // // //     { label: renderHeaderWithFilter("Status", "propertystatus"), key: "propertystatus" },
// // // // //     { label: renderHeaderWithFilter("Bedrooms", "Bedrooms"), key: "Bedrooms" },
// // // // //     { label: renderHeaderWithFilter("Facing", "Facing"), key: "Facing" },
// // // // //   ];

// // // // //   useEffect(() => {
// // // // //     setLoading(true);
// // // // //     setError(null);
// // // // //     Promise.all([
// // // // //       fetchData("Company_Data"),
// // // // //       fetchData("Projectdata"),
// // // // //       fetchData("property_Data_Info"),
// // // // //     ])
// // // // //       .then(([cRes, pRes, prRes]) => {
// // // // //         setCompanyData(cRes || []);
// // // // //         setProjectsData(pRes || []);
// // // // //         setPropertiesData(prRes || []);
// // // // //         setFilteredCompanies(cRes || []);
// // // // //         setFilteredProjects(pRes || []);
// // // // //         setFilteredProperties(prRes || []);
// // // // //       })
// // // // //       .catch((err) => setError(err.message || "Error loading data"))
// // // // //       .finally(() => setLoading(false));
// // // // //   }, [fetchData]);

// // // // //   useEffect(() => {
// // // // //     const lower = searchQuery.trim().toLowerCase();
// // // // //     if (!lower) {
// // // // //       setFilteredCompanies(companyData);
// // // // //       setFilteredProjects(projectsData);
// // // // //       setFilteredProperties(propertiesData);
// // // // //       return;
// // // // //     }
// // // // //     const filterBySearch = (data, keys) =>
// // // // //       data.filter((item) =>
// // // // //         keys.some(
// // // // //           (key) =>
// // // // //             item[key] && item[key].toString().toLowerCase().includes(lower)
// // // // //         )
// // // // //       );
// // // // //     setFilteredCompanies(
// // // // //       filterBySearch(companyData, ["CompanyName", "CompanyID"])
// // // // //     );
// // // // //     setFilteredProjects(
// // // // //       filterBySearch(projectsData, ["ProjectName", "ProjectID"])
// // // // //     );
// // // // //     setFilteredProperties(
// // // // //       filterBySearch(propertiesData, ["PropertyName", "PropertyID"])
// // // // //     );
// // // // //   }, [searchQuery, companyData, projectsData, propertiesData]);

// // // // //   let currentData, currentColumns;
// // // // //   if (activeTab === TABS.COMPANY) {
// // // // //     currentData = filteredCompanies;
// // // // //     currentColumns = companyColumns;
// // // // //   } else if (activeTab === TABS.PROJECTS) {
// // // // //     currentData = filteredProjects;
// // // // //     currentColumns = projectColumns;
// // // // //   } else {
// // // // //     currentData = filteredProperties;
// // // // //     currentColumns = propertyColumns;
// // // // //   }

// // // // //   const paginatedData = useMemo(() => {
// // // // //     const start = (page - 1) * rowsPerPage;
// // // // //     return currentData.slice(start, start + rowsPerPage);
// // // // //   }, [currentData, page]);

// // // // //   const totalPages = Math.ceil(currentData.length / rowsPerPage);

// // // // //   return (
// // // // //     <div style={{ display: "flex", backgroundColor: "#fff" }}>
// // // // //       {/* Sidebar container */}
// // // // //       <div style={{ flexShrink: 0 }}>
// // // // //         <Sidebar />
// // // // //       </div>

// // // // //       {/* Main content container */}
// // // // //       <div style={{ flex: 1, padding: 24, marginLeft: "180px", minHeight: "100vh" }}>
// // // // //         {fromDashboard && (
// // // // //           <div style={{ marginBottom: 15 }}>
// // // // //             <button
// // // // //               onClick={() => navigate(-1)}
// // // // //               style={{
// // // // //                 display: "flex",
// // // // //                 alignItems: "center",
// // // // //                 background: "none",
// // // // //                 border: "none",
// // // // //                 cursor: "pointer",
// // // // //                 color: "#333",
// // // // //                 fontSize: "15px",
// // // // //                 fontWeight: "500",
// // // // //               }}
// // // // //             >
// // // // //                 Back
// // // // //             </button>
// // // // //           </div>
// // // // //         )}

// // // // //         {/* Tabs & Search */}
// // // // //         <div
// // // // //           style={{
// // // // //             display: "flex",
// // // // //             justifyContent: "space-between",
// // // // //             alignItems: "center",
// // // // //             marginBottom: 20,
// // // // //           }}
// // // // //         >
// // // // //           {/* Tabs */}
// // // // //           <div style={{ display: "flex", gap: 2 }}>
// // // // //             {Object.entries(TABS).map(([key, val]) => {
// // // // //               const label = key.charAt(0) + key.slice(1).toLowerCase();
// // // // //               const isActive = activeTab === val;
// // // // //               return (
// // // // //                 <button
// // // // //                   key={key}
// // // // //                   onClick={() => {
// // // // //                     setActiveTab(val);
// // // // //                     setPage(1);
// // // // //                   }}
// // // // //                   onMouseEnter={(e) => {
// // // // //                     if (!isActive) e.target.style.color = "#000";
// // // // //                   }}
// // // // //                   onMouseLeave={(e) => {
// // // // //                     if (!isActive) e.target.style.color = "#666";
// // // // //                   }}
// // // // //                   style={{
// // // // //                     backgroundColor: isActive ? "#fff" : "#f0f0f0",
// // // // //                     color: isActive ? "#2c3e50" : "#666",
// // // // //                     border: "none",
// // // // //                     outline: "none",
// // // // //                     cursor: "pointer",
// // // // //                     padding: "10px 14px",
// // // // //                     marginLeft: "1px",
// // // // //                     fontSize: "13px",
// // // // //                     fontWeight: isActive ? 600 : 500,
// // // // //                     borderBottom: isActive
// // // // //                       ? "3px solid #2c3e50"
// // // // //                       : "3px solid transparent",
// // // // //                     transition: "background-color 0.3s ease, color 0.3s ease",
// // // // //                     // borderTopLeftRadius: 6,
// // // // //                     // borderTopRightRadius: 6,
// // // // //                   }}
// // // // //                 >
// // // // //                   {label}
// // // // //                 </button>
// // // // //               );
// // // // //             })}
// // // // //           </div>

// // // // //           {/* Search */}
// // // // //           <div style={{ position: "relative", width: 160 }}>
// // // // //             <Search
// // // // //               size={16}
// // // // //               style={{
// // // // //                 position: "absolute",
// // // // //                 left: 12,
// // // // //                 top: "50%",
// // // // //                 transform: "translateY(-50%)",
// // // // //                 color: "#9ca3af",
// // // // //               }}
// // // // //             />
// // // // //             <input
// // // // //               type="text"
// // // // //               placeholder="Search"
// // // // //               value={searchQuery}
// // // // //               onChange={(e) => setSearchQuery(e.target.value)}
// // // // //               style={{
// // // // //                 width: "130px",
// // // // //                 padding: "8px 12px 8px 34px",
// // // // //                 borderRadius: 8,
// // // // //                 border: "1px solid #e5e7eb",
// // // // //                 fontSize: 14,
// // // // //                 background: "#f9fafb",
// // // // //                 color: "#111827",
// // // // //               }}
// // // // //             />
// // // // //           </div>
// // // // //         </div>

// // // // //         {/* Table */}
// // // // //         {loading ? (
// // // // //           <p>Loading...</p>
// // // // //         ) : error ? (
// // // // //           <p style={{ color: "red" }}>Error: {error}</p>
// // // // //         ) : (
// // // // //           <>
// // // // //             <Table
// // // // //               columns={currentColumns}
// // // // //               paginatedData={paginatedData}
// // // // //               openFilter={openFilter}
// // // // //               toggleFilter={toggleFilter}
// // // // //               filters={filters}
// // // // //               handleCheckboxChange={handleCheckboxChange}
// // // // //               searchValue={filterSearchValue}
// // // // //               setSearchValue={setFilterSearchValue}
// // // // //               uniqueValues={uniqueValues}
// // // // //               clearFilter={clearFilter}
// // // // //               applyFilter={applyFilter}
// // // // //               onRowClick={(row) => {
// // // // //                 setSelectedProject(row);
// // // // //                 setModalOpen(true);
// // // // //               }}
// // // // //             />
// // // // //             {totalPages > 1 && (
// // // // //               <Pagination page={page} setPage={setPage} totalPages={totalPages} />
// // // // //             )}
// // // // //           </>
// // // // //         )}

// // // // //         <ProjectDetailsModal
// // // // //           open={modalOpen}
// // // // //           onClose={() => setModalOpen(false)}
// // // // //           project={selectedProject}
// // // // //           TableComponent={Table}
// // // // //         />
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // }
// // // // import React, { useEffect, useState } from "react";
// // // // import Sidebar from "../../components/Sidebar.jsx";
// // // // import { useApi } from "../../API/Api.js";
// // // // import Table from "../../Utils/Table.jsx";
// // // // import SearchBar from "../../Utils/SearchBar.jsx";

// // // // const TABS = {
// // // //   COMPANY: "company",
// // // //   PROJECTS: "projects",
// // // //   PROPERTIES: "properties"
// // // // };

// // // // // Sidebar for company details
// // // // function CompanyDetailsSidebar({ open, onClose, company }) {
// // // //   if (!open || !company) return null;
// // // //   return (
// // // //     <div
// // // //       style={{
// // // //         position: "fixed",
// // // //         top: 0,
// // // //         right: 0,
// // // //         width: "350px",
// // // //         height: "100vh",
// // // //         backgroundColor: "white",
// // // //         boxShadow: "-2px 0 8px rgba(0,0,0,0.1)",
// // // //         padding: 20,
// // // //         zIndex: 10000,
// // // //         overflowY: "auto",
// // // //         transition: "transform 0.3s ease",
// // // //         transform: open ? "translateX(0)" : "translateX(100%)",
// // // //       }}
// // // //     >
// // // //       <button
// // // //         onClick={onClose}
// // // //         style={{
// // // //           marginBottom: "12px",
// // // //           backgroundColor: "#d4af37",
// // // //           color: "white",
// // // //           border: "none",
// // // //           borderRadius: "4px",
// // // //           padding: "6px 12px",
// // // //           cursor: "pointer",
// // // //           float: "right",
// // // //         }}
// // // //       >
// // // //         Close
// // // //       </button>
// // // //       <h2 style={{ marginTop: 0, color: "#d4af37", gridColumn: "span 2", marginBottom: 12 }}>{company.CompanyName}</h2>
// // // //       <div
// // // //         style={{
// // // //           display: "grid",
// // // //           gridTemplateColumns: "1fr 1fr",
// // // //           gap: "8px 10px",
// // // //           alignItems: "center",
// // // //         }}
// // // //       >
// // // //         <div style={{ fontWeight: 600 }}>Company Short Name</div><div>{company.CompanyShortName || "N/A"}</div>
// // // //         <div style={{ fontWeight: 600 }}>Address 1</div><div>{company.Address1 || "N/A"}</div>
// // // //         <div style={{ fontWeight: 600 }}>Address 2</div><div>{company.Address2 || "N/A"}</div>
// // // //         <div style={{ fontWeight: 600 }}>Latitude</div><div>{company.Latitude || "N/A"}</div>
// // // //         <div style={{ fontWeight: 600 }}>Longitude</div><div>{company.Longitude || "N/A"}</div>
// // // //         <div style={{ fontWeight: 600 }}>Locality</div><div>{company.Locality || "N/A"}</div>
// // // //         <div style={{ fontWeight: 600 }}>Tier</div><div>{company.Tier || "N/A"}</div>
// // // //         <div style={{ fontWeight: 600 }}>Operating Since</div>
// // // //         <div>{company.OperatingSince ? company.OperatingSince.split("T")[0] : "N/A"}</div>
// // // //         <div style={{ fontWeight: 600 }}>Residential</div><div>{company.Residential === "Y" ? "Yes" : "No"}</div>
// // // //         <div style={{ fontWeight: 600 }}>Apartments</div><div>{company.Apartments === "Y" ? "Yes" : "No"}</div>
// // // //         <div style={{ fontWeight: 600 }}>Villas</div><div>{company.Villas === "Y" ? "Yes" : "No"}</div>
// // // //         <div style={{ fontWeight: 600 }}>Commercial</div><div>{company.Commercial === "Y" ? "Yes" : "No"}</div>
// // // //         <div style={{ fontWeight: 600 }}>Plots</div><div>{company.Plots === "Y" ? "Yes" : "No"}</div>
// // // //         <div style={{ fontWeight: 600 }}>Farm Lands</div><div>{company.FarmLands === "Y" ? "Yes" : "No"}</div>
// // // //         <div style={{ fontWeight: 600 }}>Upcoming</div><div>{company.Upcoming || "N/A"}</div>
// // // //         <div style={{ fontWeight: 600 }}>Ready To Move</div><div>{company.ReadyToMove || "N/A"}</div>
// // // //         <div style={{ fontWeight: 600 }}>Under Construction</div><div>{company.UnderConstruction || "N/A"}</div>
// // // //         <div style={{ fontWeight: 600 }}>Completed</div><div>{company.Completed || "N/A"}</div>
// // // //         <div style={{ fontWeight: 600 }}>Operating Cities</div><div>{company.OperatingCities || "N/A"}</div>
// // // //         <div style={{ fontWeight: 600 }}>Project Count</div><div>{company.ProjectCount || "N/A"}</div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // // Sidebar for project details
// // // // function ProjectDetailsSidebar({ open, onClose, project }) {
// // // //   if (!open || !project) return null;
// // // //   return (
// // // //     <div
// // // //       style={{
// // // //         position: "fixed",
// // // //         top: 0,
// // // //         right: 0,
// // // //         width: "450px",
// // // //         maxwidth:"90vw",
// // // //         height: "100vh",
// // // //         backgroundColor: "white",
// // // //         boxShadow: "-2px 0 8px rgba(0,0,0,0.1)",
// // // //         padding: 20,
// // // //         zIndex: 10000,
// // // //         overflowY: "auto",
// // // //         transition: "transform 0.3s ease",
// // // //         transform: open ? "translateX(0)" : "translateX(100%)",
// // // //       }}
// // // //     >
// // // //       <button
// // // //         onClick={onClose}
// // // //         style={{
// // // //           marginBottom: "12px",
// // // //           backgroundColor: "#d4af37",
// // // //           color: "white",
// // // //           border: "none",
// // // //           borderRadius: "4px",
// // // //           padding: "6px 12px",
// // // //           cursor: "pointer",
// // // //           float: "right",
// // // //         }}
// // // //       >
// // // //         Close
// // // //       </button>
// // // //       <h2 style={{ marginTop: 0, color: "#d4af37", gridColumn: "span 2", marginBottom: 12 }}>{project.ProjectName}</h2>
// // // //       <div
// // // //         style={{
// // // //           display: "grid",
// // // //           gridTemplateColumns: "1fr 1fr",
// // // //           gap: "8px 10px",
// // // //           alignItems: "center",
// // // //         }}
// // // //       >
// // // //         <div style={{ fontWeight: 600 }}>Company Name</div><div>{project.CompanyName || "N/A"}</div>
// // // //         <div style={{ fontWeight: 600 }}>Project ID</div><div>{project.ProjectID || "N/A"}</div>
// // // //         <div style={{ fontWeight: 600 }}>Address1</div><div>{project.Address1 || "N/A"}</div>
// // // //         <div style={{ fontWeight: 600 }}>Project Status</div><div>{project.ProjectStatus || "N/A"}</div>
// // // //         <div style={{ fontWeight: 600 }}>Custom Project Types</div><div>{project.CustomProjectTypes || "N/A"}</div>
// // // //         <div style={{ fontWeight: 600 }}>City</div><div>{project.city || "N/A"}</div>
// // // //         <div style={{ fontWeight: 600 }}>Project Description</div><div>{project.ProjectDescription || "N/A"}</div>
// // // //         <div style={{ fontWeight: 600 }}>Amenities</div><div>{project.Amenities || "N/A"}</div>
// // // //         <div style={{ fontWeight: 600 }}>RERA</div><div>{project.RERA || "N/A"}</div>
// // // //         <div style={{ fontWeight: 600 }}>Locality</div><div>{project.Locality || "N/A"}</div>
// // // //         <div style={{ fontWeight: 600 }}>Geolocation</div><div>{project.Geolocation || "N/A"}</div>
// // // //          <div style={{ fontWeight: 600 }}>Properties For Sale</div><div>{project.PropertiesForSale || "N/A"}</div> 
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // export default function ProjectsDetails() {
// // // //   const [activeTab, setActiveTab] = useState(TABS.COMPANY);
// // // //   const [companyData, setCompanyData] = useState([]);
// // // //   const [projectsData, setProjectsData] = useState([]);
// // // //   const [propertiesData, setPropertiesData] = useState([]);
// // // //   const [filteredCompanies, setFilteredCompanies] = useState([]);
// // // //   const [filteredProjects, setFilteredProjects] = useState([]);
// // // //   const [filteredProperties, setFilteredProperties] = useState([]);
// // // //   const [loading, setLoading] = useState(false);
// // // //   const [error, setError] = useState(null);
// // // //   const [selectedCompany, setSelectedCompany] = useState(null);
// // // //   const [companySidebarOpen, setCompanySidebarOpen] = useState(false);
// // // //   const [selectedProject, setSelectedProject] = useState(null);
// // // //   const [projectSidebarOpen, setProjectSidebarOpen] = useState(false);
// // // //   const [searchQuery, setSearchQuery] = useState("");
// // // //   const { fetchData } = useApi();

// // // //   // Company Table Columns
// // // //   const companyColumns = [
// // // //     { label: "S.No", key: "serialNo", render: (_, __, idx) => idx + 1 },
// // // //     { label: "Company Name", key: "CompanyName" },
// // // //     { label: "No.of Projects", key: "TotalProjects" },
// // // //     { label: "OperatingCities", key: "OperatingCities" },
// // // //     {
// // // //       label: "Operating Since", key: "OperatingYear",
// // // //       render: (val) => {
// // // //         if (!val) return "N/A";
// // // //         const year = val.toString().split("-")[0];
// // // //         return year || "N/A";
// // // //       }
// // // //     },
// // // //     { label: "ReadyToMove", key: "ReadyToMove" },
// // // //     { label: "UnderConstruction", key: "UnderConstruction" },
// // // //     {
// // // //       label: "More",
// // // //       key: "more",
// // // //       render: (_, company) => (
// // // //         <button
// // // //           onClick={() => {
// // // //             setSelectedCompany(company);
// // // //             setCompanySidebarOpen(true);
// // // //           }}
// // // //           style={{
// // // //             backgroundColor: "#121212",
// // // //             color: "#fff",
// // // //             border: "none",
// // // //             borderRadius: "4px",
// // // //             padding: "6px 12px",
// // // //             cursor: "pointer",
// // // //           }}
// // // //         >
// // // //           More
// // // //         </button>
// // // //       )
// // // //     }
// // // //   ];

// // // //   // Projects Table Columns
// // // //   const projectColumns = [
// // // //     { label: "S.No", key: "serialNo", render: (_, __, idx) => idx + 1 },
// // // //     { label: "Project Name", key: "ProjectName" },
// // // //     { label: "Project Status", key: "ProjectStatus" },
// // // //     { label: "Custom Project Types", key: "CustomProjectTypes" },
// // // //     { label: "Locality", key: "Locality" },
    
// // // //     {
// // // //       label: "More", key: "more", render: (_, project) => (
// // // //         <button
// // // //           onClick={() => {
// // // //             setSelectedProject(project);
// // // //             setProjectSidebarOpen(true);
// // // //           }}
// // // //           style={{
// // // //             backgroundColor: "#121212",
// // // //             color: "#fff",
// // // //             border: "none",
// // // //             borderRadius: "4px",
// // // //             padding: "6px 12px",
// // // //             cursor: "pointer",
// // // //           }}
// // // //         >
// // // //           More
// // // //         </button>
// // // //       )
// // // //     }
// // // //   ];

// // // //   const propertyColumns = [
// // // //     { label: "S.No", key: "serialNo", render: (_, __, idx) => idx + 1 },
// // // //     { label: "ProjectName", key: "projectname" },
// // // //     { label: "Property ID", key: "PropertyID" },
// // // //     { label: "Property Name", key: "PropertyName" },
// // // //     { label: "Price", key: "AmountWithUnit" },
// // // //     { label: "Type", key: "PropertyType" },
// // // //     { label: "Status", key: "propertystatus" },
// // // //     { label: "Bedrooms", key: "Bedrooms" },
// // // //     { label: "Facing", key: "Facing" }
// // // //   ];

// // // //   useEffect(() => {
// // // //     setLoading(true);
// // // //     setError(null);
// // // //     Promise.all([
// // // //       fetchData("Company_Data"),
// // // //       fetchData("Projectdata"),
// // // //       fetchData("property_Data_Info")
// // // //     ])
// // // //       .then(([companyRes, projectRes, propertyRes]) => {
// // // //         const cData = companyRes || [];
// // // //         const pData = projectRes || [];
// // // //         const prData = propertyRes || [];
// // // //         setCompanyData(cData);
// // // //         setProjectsData(pData);
// // // //         setPropertiesData(prData);
// // // //         setFilteredCompanies(cData);
// // // //         setFilteredProjects(pData);
// // // //         setFilteredProperties(prData);
// // // //       })
// // // //       .catch(err => {
// // // //         setError(err.message || "Error loading data");
// // // //         setCompanyData([]);
// // // //         setProjectsData([]);
// // // //         setPropertiesData([]);
// // // //         setFilteredCompanies([]);
// // // //         setFilteredProjects([]);
// // // //         setFilteredProperties([]);
// // // //       })
// // // //       .finally(() => setLoading(false));
// // // //   }, [fetchData]);

// // // //   useEffect(() => {
// // // //     if (!searchQuery) {
// // // //       setFilteredCompanies(companyData);
// // // //       setFilteredProjects(projectsData);
// // // //       setFilteredProperties(propertiesData);
// // // //       return;
// // // //     }
// // // //     const lowerQuery = searchQuery.toLowerCase();

// // // //     const filterCompanies = companyData.filter(item =>
// // // //       (item.CompanyName && item.CompanyName.toLowerCase().includes(lowerQuery)) ||
// // // //       (item.CompanyID && item.CompanyID.toString().toLowerCase().includes(lowerQuery)) ||
// // // //       (item.ReraNumber && item.ReraNumber.toLowerCase().includes(lowerQuery))
// // // //     );
// // // //     const filterProjects = projectsData.filter(item =>
// // // //       (item.ProjectName && item.ProjectName.toLowerCase().includes(lowerQuery)) ||
// // // //       (item.ProjectID && item.ProjectID.toString().toLowerCase().includes(lowerQuery)) ||
// // // //       (item.ReraNumber && item.ReraNumber.toLowerCase().includes(lowerQuery))
// // // //     );
// // // //     const filterProperties = propertiesData.filter(item =>
// // // //       (item.PropertyName && item.PropertyName.toLowerCase().includes(lowerQuery)) ||
// // // //       (item.PropertyID && item.PropertyID.toString().toLowerCase().includes(lowerQuery)) ||
// // // //       (item.ReraNumber && item.ReraNumber.toLowerCase().includes(lowerQuery))
// // // //     );
// // // //     setFilteredCompanies(filterCompanies);
// // // //     setFilteredProjects(filterProjects);
// // // //     setFilteredProperties(filterProperties);
// // // //   }, [searchQuery, companyData, projectsData, propertiesData]);

// // // //   let currentData, currentColumns;
// // // //   if (activeTab === TABS.COMPANY) {
// // // //     currentData = filteredCompanies;
// // // //     currentColumns = companyColumns;
// // // //   } else if (activeTab === TABS.PROJECTS) {
// // // //     currentData = filteredProjects;
// // // //     currentColumns = projectColumns;
// // // //   } else {
// // // //     currentData = filteredProperties;
// // // //     currentColumns = propertyColumns;
// // // //   }

// // // //   return (
// // // //     <div className="dashboard-container" style={{ display: "flex", backgroundColor: "#fff",marginLeft:"180px" }}>
// // // //       <Sidebar />
// // // //       <div
// // // //         className="buyers-content"
// // // //         style={{
// // // //           flex: 1,
// // // //           position: "relative",
// // // //           minHeight: "100vh",
// // // //           padding: 24,
// // // //           overflowx:"hidden",
// // // //           maxWidth:"100%",
// // // //           boxSizing:"border-box"
// // // //         }}
// // // //       >
// // // //         <div
// // // //           style={{
// // // //             display: "flex",
// // // //             alignItems: "center",
// // // //             justifyContent: "space-between",
// // // //             marginBottom: 20,
// // // //           }}
// // // //         >
// // // //           <h2 style={{ margin: 0 }}>Listing Data</h2>
// // // //           <div
// // // //             style={{
// // // //               fontWeight: "bold",
// // // //               fontSize: "1.1rem",
// // // //               color: "#d4af37",
// // // //             }}
// // // //           >
// // // //             Kiran Reddy Pallaki
// // // //           </div>
// // // //         </div>
// // // //         {/* Tabs and search bar */}
// // // //         <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, gap: 10,flexWrap:"wrap",alignItem:"center" }}>
// // // //           <div style={{ display: "flex",flexWrap:"wrap" }}>
// // // //             <button
// // // //               onClick={() => setActiveTab(TABS.COMPANY)}
// // // //               style={activeTab === TABS.COMPANY ? styles.activeTab : styles.tab}
// // // //             >
// // // //               Companies
// // // //             </button>
// // // //             <button
// // // //               onClick={() => {
// // // //               setActiveTab(TABS.PROJECTS)
// // // //               setCompanySidebarOpen(false);
// // // //               setProjectSidebarOpen(false);
// // // //               }}
// // // //               style={activeTab === TABS.PROJECTS ? styles.activeTab : styles.tab}
// // // //             >
// // // //               Projects
// // // //             </button>
// // // //             <button
// // // //               onClick={() => {
// // // //                 setActiveTab(TABS.PROPERTIES)
// // // //               setCompanySidebarOpen(false);
// // // //             setProjectSidebarOpen(false);}}
// // // //               style={activeTab === TABS.PROPERTIES ? styles.activeTab : styles.tab}
// // // //             >
// // // //               Properties
// // // //             </button>
// // // //           </div>
// // // //           <div style={{ minWidth: 150,maxWidth:300,flex:"0 1 auto" }}>
// // // //             <SearchBar
// // // //               value={searchQuery}
// // // //               onChange={setSearchQuery}
// // // //               onSubmit={() => { }}
// // // //             />
// // // //           </div>
// // // //         </div>
// // // //         {loading && <p>Loading...</p>}
// // // //         {error && <p style={{ color: "red" }}>Error: {error}</p>}
// // // //         {!loading && !error && (
// // // //           <Table
// // // //             columns={currentColumns}
// // // //             paginatedData={currentData}
// // // //             rowsPerPage={13}
// // // //           />
// // // //         )}
// // // //         <CompanyDetailsSidebar
// // // //           open={companySidebarOpen}
// // // //           onClose={() => setCompanySidebarOpen(false)}
// // // //           company={selectedCompany}
// // // //         />
// // // //         <ProjectDetailsSidebar
// // // //           open={projectSidebarOpen}
// // // //           onClose={() => setProjectSidebarOpen(false)}
// // // //           project={selectedProject}
// // // //         />
// // // //       </div>
// // // //     </div>
    
// // // //   );
// // // // }

// // // // const styles = {
// // // //   tab: {
// // // //     padding: "8px 15px",
// // // //     cursor: "pointer",
// // // //     border: "1px solid #e0e0e0",
// // // //     outline: "none",
// // // //     fontSize: "15px",
// // // //     fontWeight: "500",
// // // //     color: "#333",
// // // //     transition: "all 0.01s ease",
// // // //     height: "32px",
// // // //   },
// // // //   activeTab: {
// // // //     padding: "8px 15px",
// // // //     cursor: "pointer",
// // // //     color: "#d4af37",
// // // //     border: "2px solid #d4af37",
// // // //     borderRadius: "8px",
// // // //     outline: "none",
// // // //     fontWeight: "bold",
// // // //     fontSize: "15px",
// // // //     transition: "all 0.01s ease",
// // // //     height: "32px",
// // // //   }
// // // // };
// // // import React, { useEffect, useState } from "react";
// // // import Sidebar from "../../components/Sidebar.jsx";
// // // import { useApi } from "../../API/Api.js";
// // // import Table from "../../Utils/Table.jsx";
// // // import SearchBar from "../../Utils/SearchBar.jsx";

// // // // Example param types for tabs; update as per your actual usage or import
// // // const listParamTypes = {
// // //   COMPANY: "Companies",
// // //   PROJECTS: "Projects",
// // //   PROPERTIES: "Properties"
// // // };

// // // export default function ProjectsDetails() {
// // //   const [activeTab, setActiveTab] = useState("COMPANY");
// // //   const [companyData, setCompanyData] = useState([]);
// // //   const [projectsData, setProjectsData] = useState([]);
// // //   const [propertiesData, setPropertiesData] = useState([]);
// // //   const [filteredCompanies, setFilteredCompanies] = useState([]);
// // //   const [filteredProjects, setFilteredProjects] = useState([]);
// // //   const [filteredProperties, setFilteredProperties] = useState([]);
// // //   const [loading, setLoading] = useState(false);
// // //   const [error, setError] = useState(null);
// // //   const [selectedCompany, setSelectedCompany] = useState(null);
// // //   const [companySidebarOpen, setCompanySidebarOpen] = useState(false);
// // //   const [selectedProject, setSelectedProject] = useState(null);
// // //   const [projectSidebarOpen, setProjectSidebarOpen] = useState(false);
// // //   const [searchQuery, setSearchQuery] = useState("");
// // //   const { fetchData } = useApi();

// // //   // Company Table Columns
// // //   const companyColumns = [
// // //     { label: "S.No", key: "serialNo", render: (_, __, idx) => idx + 1 },
// // //     { label: "Company Name", key: "CompanyName" },
// // //     { label: "No.of Projects", key: "TotalProjects" },
// // //     { label: "OperatingCities", key: "OperatingCities" },
// // //     {
// // //       label: "Operating Since", key: "OperatingYear",
// // //       render: (val) => {
// // //         if (!val) return "N/A";
// // //         const year = val.toString().split("-")[0];
// // //         return year || "N/A";
// // //       }
// // //     },
// // //     { label: "ReadyToMove", key: "ReadyToMove" },
// // //     { label: "UnderConstruction", key: "UnderConstruction" },
// // //     {
// // //       label: "More",
// // //       key: "more",
// // //       render: (_, company) => (
// // //         <button
// // //           onClick={() => {
// // //             setSelectedCompany(company);
// // //             setCompanySidebarOpen(true);
// // //           }}
// // //           style={{
// // //             backgroundColor: "#121212",
// // //             color: "#fff",
// // //             border: "none",
// // //             borderRadius: "4px",
// // //             padding: "6px 12px",
// // //             cursor: "pointer",
// // //           }}
// // //         >
// // //           More
// // //         </button>
// // //       )
// // //     }
// // //   ];

// // //   // Projects Table Columns
// // //   const projectColumns = [
// // //     { label: "S.No", key: "serialNo", render: (_, __, idx) => idx + 1 },
// // //     { label: "Project Name", key: "ProjectName" },
// // //     { label: "Project Status", key: "ProjectStatus" },
// // //     { label: "Custom Project Types", key: "CustomProjectTypes" },
// // //     { label: "Locality", key: "Locality" },
// // //     {
// // //       label: "More", key: "more", render: (_, project) => (
// // //         <button
// // //           onClick={() => {
// // //             setSelectedProject(project);
// // //             setProjectSidebarOpen(true);
// // //           }}
// // //           style={{
// // //             backgroundColor: "#121212",
// // //             color: "#fff",
// // //             border: "none",
// // //             borderRadius: "4px",
// // //             padding: "6px 12px",
// // //             cursor: "pointer",
// // //           }}
// // //         >
// // //           More
// // //         </button>
// // //       )
// // //     }
// // //   ];

// // //   const propertyColumns = [
// // //     { label: "S.No", key: "serialNo", render: (_, __, idx) => idx + 1 },
// // //     { label: "ProjectName", key: "projectname" },
// // //     { label: "Property ID", key: "PropertyID" },
// // //     { label: "Property Name", key: "PropertyName" },
// // //     { label: "Price", key: "AmountWithUnit" },
// // //     { label: "Type", key: "PropertyType" },
// // //     { label: "Status", key: "propertystatus" },
// // //     { label: "Bedrooms", key: "Bedrooms" },
// // //     { label: "Facing", key: "Facing" }
// // //   ];

// // //   useEffect(() => {
// // //     setLoading(true);
// // //     setError(null);
// // //     Promise.all([
// // //       fetchData("Company_Data"),
// // //       fetchData("Projectdata"),
// // //       fetchData("property_Data_Info")
// // //     ])
// // //       .then(([companyRes, projectRes, propertyRes]) => {
// // //         const cData = companyRes || [];
// // //         const pData = projectRes || [];
// // //         const prData = propertyRes || [];
// // //         setCompanyData(cData);
// // //         setProjectsData(pData);
// // //         setPropertiesData(prData);
// // //         setFilteredCompanies(cData);
// // //         setFilteredProjects(pData);
// // //         setFilteredProperties(prData);
// // //       })
// // //       .catch(err => {
// // //         setError(err.message || "Error loading data");
// // //         setCompanyData([]);
// // //         setProjectsData([]);
// // //         setPropertiesData([]);
// // //         setFilteredCompanies([]);
// // //         setFilteredProjects([]);
// // //         setFilteredProperties([]);
// // //       })
// // //       .finally(() => setLoading(false));
// // //   }, [fetchData]);

// // //   useEffect(() => {
// // //     if (!searchQuery) {
// // //       setFilteredCompanies(companyData);
// // //       setFilteredProjects(projectsData);
// // //       setFilteredProperties(propertiesData);
// // //       return;
// // //     }
// // //     const lowerQuery = searchQuery.toLowerCase();

// // //     const filterCompanies = companyData.filter(item =>
// // //       (item.CompanyName && item.CompanyName.toLowerCase().includes(lowerQuery)) ||
// // //       (item.CompanyID && item.CompanyID.toString().toLowerCase().includes(lowerQuery)) ||
// // //       (item.ReraNumber && item.ReraNumber.toLowerCase().includes(lowerQuery))
// // //     );
// // //     const filterProjects = projectsData.filter(item =>
// // //       (item.ProjectName && item.ProjectName.toLowerCase().includes(lowerQuery)) ||
// // //       (item.ProjectID && item.ProjectID.toString().toLowerCase().includes(lowerQuery)) ||
// // //       (item.ReraNumber && item.ReraNumber.toLowerCase().includes(lowerQuery))
// // //     );
// // //     const filterProperties = propertiesData.filter(item =>
// // //       (item.PropertyName && item.PropertyName.toLowerCase().includes(lowerQuery)) ||
// // //       (item.PropertyID && item.PropertyID.toString().toLowerCase().includes(lowerQuery)) ||
// // //       (item.ReraNumber && item.ReraNumber.toLowerCase().includes(lowerQuery))
// // //     );
// // //     setFilteredCompanies(filterCompanies);
// // //     setFilteredProjects(filterProjects);
// // //     setFilteredProperties(filterProperties);
// // //   }, [searchQuery, companyData, projectsData, propertiesData]);

// // //   let currentData, currentColumns;
// // //   if (activeTab === "COMPANY") {
// // //     currentData = filteredCompanies;
// // //     currentColumns = companyColumns;
// // //   } else if (activeTab === "PROJECTS") {
// // //     currentData = filteredProjects;
// // //     currentColumns = projectColumns;
// // //   } else {
// // //     currentData = filteredProperties;
// // //     currentColumns = propertyColumns;
// // //   }

// // //   return (
// // //     <div className="dashboard-container" style={{ display: "flex", backgroundColor: "#fff", marginLeft: "180px" }}>
// // //       <Sidebar />
// // //       <div
// // //         className="buyers-content"
// // //         style={{
// // //           flex: 1,
// // //           position: "relative",
// // //           minHeight: "100vh",
// // //           padding: 24,
// // //           overflowX: "hidden",
// // //           maxWidth: "100%",
// // //           boxSizing: "border-box"
// // //         }}
// // //       >
// // //         <div
// // //           style={{
// // //             display: "flex",
// // //             alignItems: "center",
// // //             justifyContent: "space-between",
// // //             marginBottom: 20,
// // //           }}
// // //         >
// // //           <h2 style={{ margin: 0 }}>Listing Data</h2>
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
// // //         {/* *** TAB BAR REPLACEMENT HERE *** */}
// // //         <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, gap: 10, flexWrap: "wrap", alignItems: "center" }}>
// // //           <div style={{ marginBottom: 16, gap: "2px", display: "flex" }}>
// // //             {Object.keys(listParamTypes).map((tab) => (
// // //               <button
// // //                 key={tab}
// // //                 onClick={() => {
// // //                   setActiveTab(tab);
// // //                   setCompanySidebarOpen(false);
// // //                   setProjectSidebarOpen(false);
// // //                 }}
// // //                 style={{
// // //                   padding: "8px 15px",
// // //                   fontWeight: activeTab === tab ? 600 : 500,
// // //                   fontSize: "13px",
// // //                   border: "none",
// // //                   backgroundColor: activeTab === tab ? "#fff" : "#f0f0f0",
// // //                   color: activeTab === tab ? "#2c3e50" : "#666",
// // //                   cursor: "pointer",
// // //                   borderBottom: activeTab === tab ? "3px solid #2c3e50" : "3px solid transparent",
// // //                   transition: "background-color 0.3s ease,color 0.3s ease",
// // //                   marginRight: "1px"
// // //                 }}
// // //               >
// // //                 {listParamTypes[tab]}
// // //               </button>
// // //             ))}
// // //           </div>
// // //           <div style={{ minWidth: 150, maxWidth: 300, flex: "0 1 auto" }}>
// // //             <SearchBar
// // //               value={searchQuery}
// // //               onChange={setSearchQuery}
// // //               onSubmit={() => { }}
// // //             />
// // //           </div>
// // //         </div>
// // //         {loading && <p>Loading...</p>}
// // //         {error && <p style={{ color: "red" }}>Error: {error}</p>}
// // //         {!loading && !error && (
// // //           <Table
// // //             columns={currentColumns}
// // //             paginatedData={currentData}
// // //             rowsPerPage={13}
// // //           />
// // //         )}
// // //         <CompanyDetailsSidebar
// // //           open={companySidebarOpen}
// // //           onClose={() => setCompanySidebarOpen(false)}
// // //           company={selectedCompany}
// // //         />
// // //         <ProjectDetailsSidebar
// // //           open={projectSidebarOpen}
// // //           onClose={() => setProjectSidebarOpen(false)}
// // //           project={selectedProject}
// // //         />
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // // --- CompanyDetailsSidebar and ProjectDetailsSidebar ---

// // // function CompanyDetailsSidebar({ open, onClose, company }) {
// // //   if (!open || !company) return null;
// // //   return (
// // //     <div
// // //       style={{
// // //         position: "fixed",
// // //         top: 0,
// // //         right: 0,
// // //         width: "350px",
// // //         height: "100vh",
// // //         backgroundColor: "white",
// // //         boxShadow: "-2px 0 8px rgba(0,0,0,0.1)",
// // //         padding: 20,
// // //         zIndex: 10000,
// // //         overflowY: "auto",
// // //         transition: "transform 0.3s ease",
// // //         transform: open ? "translateX(0)" : "translateX(100%)",
// // //       }}
// // //     >
// // //       <button
// // //         onClick={onClose}
// // //         style={{
// // //           marginBottom: "12px",
// // //           backgroundColor: "#d4af37",
// // //           color: "white",
// // //           border: "none",
// // //           borderRadius: "4px",
// // //           padding: "6px 12px",
// // //           cursor: "pointer",
// // //           float: "right",
// // //         }}
// // //       >
// // //         Close
// // //       </button>
// // //       <h2 style={{ marginTop: 0, color: "#", gridColumn: "span 2", marginBottom: 12 }}>{company.CompanyName}</h2>
// // //       <div
// // //         style={{
// // //           display: "grid",
// // //           gridTemplateColumns: "1fr 1fr",
// // //           gap: "8px 10px",
// // //           alignItems: "center",
// // //         }}
// // //       >
// // //         <div style={{ fontWeight: 600 }}>Company Short Name</div><div>{company.CompanyShortName || "N/A"}</div>
// // //         <div style={{ fontWeight: 600 }}>Address 1</div><div>{company.Address1 || "N/A"}</div>
// // //         <div style={{ fontWeight: 600 }}>Address 2</div><div>{company.Address2 || "N/A"}</div>
// // //         {/* <div style={{ fontWeight: 600 }}>Latitude</div><div>{company.Latitude || "N/A"}</div>
// // //         <div style={{ fontWeight: 600 }}>Longitude</div><div>{company.Longitude || "N/A"}</div> */}
// // //         <div style={{ fontWeight: 600 }}>Locality</div><div>{company.Locality || "N/A"}</div>
// // //         <div style={{ fontWeight: 600 }}>Tier</div><div>{company.Tier || "N/A"}</div>
// // //         <div style={{ fontWeight: 600 }}>Operating Since</div>
// // //         <div>{company.OperatingSince ? company.OperatingSince.split("T")[0] : "N/A"}</div>
// // //         <div style={{ fontWeight: 600 }}>Residential</div><div>{company.Residential === "Y" ? "Yes" : "No"}</div>
// // //         <div style={{ fontWeight: 600 }}>Apartments</div><div>{company.Apartments === "Y" ? "Yes" : "No"}</div>
// // //         <div style={{ fontWeight: 600 }}>Villas</div><div>{company.Villas === "Y" ? "Yes" : "No"}</div>
// // //         <div style={{ fontWeight: 600 }}>Commercial</div><div>{company.Commercial === "Y" ? "Yes" : "No"}</div>
// // //         <div style={{ fontWeight: 600 }}>Plots</div><div>{company.Plots === "Y" ? "Yes" : "No"}</div>
// // //         <div style={{ fontWeight: 600 }}>Farm Lands</div><div>{company.FarmLands === "Y" ? "Yes" : "No"}</div>
// // //         <div style={{ fontWeight: 600 }}>Upcoming</div><div>{company.Upcoming || "N/A"}</div>
// // //         <div style={{ fontWeight: 600 }}>Ready To Move</div><div>{company.ReadyToMove || "N/A"}</div>
// // //         <div style={{ fontWeight: 600 }}>Under Construction</div><div>{company.UnderConstruction || "N/A"}</div>
// // //         <div style={{ fontWeight: 600 }}>Completed</div><div>{company.Completed || "N/A"}</div>
// // //         <div style={{ fontWeight: 600 }}>Operating Cities</div><div>{company.OperatingCities || "N/A"}</div>
// // //         <div style={{ fontWeight: 600 }}>Project Count</div><div>{company.ProjectCount || "N/A"}</div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // function ProjectDetailsSidebar({ open, onClose, project }) {
// // //   if (!open || !project) return null;
// // //   return (
// // //     <div
// // //       style={{
// // //         position: "fixed",
// // //         top: 0,
// // //         right: 0,
// // //         width: "450px",
// // //         maxWidth: "90vw",
// // //         height: "100vh",
// // //         backgroundColor: "white",
// // //         boxShadow: "-2px 0 8px rgba(0,0,0,0.1)",
// // //         padding: 20,
// // //         zIndex: 10000,
// // //         overflowY: "auto",
// // //         transition: "transform 0.3s ease",
// // //         transform: open ? "translateX(0)" : "translateX(100%)",
// // //       }}
// // //     >
// // //       <button
// // //         onClick={onClose}
// // //         style={{
// // //           marginBottom: "12px",
// // //           backgroundColor: "#d4af37",
// // //           color: "white",
// // //           border: "none",
// // //           borderRadius: "4px",
// // //           padding: "6px 12px",
// // //           cursor: "pointer",
// // //           float: "right",
// // //         }}
// // //       >
// // //         Close
// // //       </button>
// // //       <h2 style={{ marginTop: 0, color: "#d4af37", gridColumn: "span 2", marginBottom: 12 }}>{project.ProjectName}</h2>
// // //       <div
// // //         style={{
// // //           display: "grid",
// // //           gridTemplateColumns: "1fr 1fr",
// // //           gap: "8px 10px",
// // //           alignItems: "center",
// // //         }}
// // //       >
// // //         <div style={{ fontWeight: 600 }}>Company Name</div><div>{project.CompanyName || "N/A"}</div>
// // //         <div style={{ fontWeight: 600 }}>Project ID</div><div>{project.ProjectID || "N/A"}</div>
// // //         <div style={{ fontWeight: 600 }}>Address1</div><div>{project.Address1 || "N/A"}</div>
// // //         <div style={{ fontWeight: 600 }}>Project Status</div><div>{project.ProjectStatus || "N/A"}</div>
// // //         <div style={{ fontWeight: 600 }}>Custom Project Types</div><div>{project.CustomProjectTypes || "N/A"}</div>
// // //         <div style={{ fontWeight: 600 }}>City</div><div>{project.city || "N/A"}</div>
// // //         <div style={{ fontWeight: 600 }}>Project Description</div><div>{project.ProjectDescription || "N/A"}</div>
// // //         <div style={{ fontWeight: 600 }}>Amenities</div><div>{project.Amenities || "N/A"}</div>
// // //         <div style={{ fontWeight: 600 }}>RERA</div><div>{project.RERA || "N/A"}</div>
// // //         <div style={{ fontWeight: 600 }}>Locality</div><div>{project.Locality || "N/A"}</div>
// // //         <div style={{ fontWeight: 600 }}>Geolocation</div><div>{project.Geolocation || "N/A"}</div>
// // //         <div style={{ fontWeight: 600 }}>Properties For Sale</div><div>{project.PropertiesForSale || "N/A"}</div>
// // //       </div>
// // //     </div>
// // //   );
// // // }
// // import React, { useEffect, useState } from "react";
// // import Sidebar from "../../components/Sidebar.jsx";
// // import { useApi } from "../../API/Api.js";
// // import Table from "../../Utils/Table.jsx";
// // import SearchBar from "../../Utils/SearchBar.jsx";
// // import { Pagination } from "../../Utils/Table.jsx"; // Import Pagination component


// // const listParamTypes = {
// //   COMPANY: "Companies",
// //   PROJECTS: "Projects",
// //   PROPERTIES: "Properties",
// // };

// // export default function ProjectsDetails() {
// //   const [activeTab, setActiveTab] = useState("COMPANY");
// //   const [companyData, setCompanyData] = useState([]);
// //   const [projectsData, setProjectsData] = useState([]);
// //   const [propertiesData, setPropertiesData] = useState([]);
// //   const [filteredCompanies, setFilteredCompanies] = useState([]);
// //   const [filteredProjects, setFilteredProjects] = useState([]);
// //   const [filteredProperties, setFilteredProperties] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [selectedCompany, setSelectedCompany] = useState(null);
// //   const [companySidebarOpen, setCompanySidebarOpen] = useState(false);
// //   const [selectedProject, setSelectedProject] = useState(null);
// //   const [projectSidebarOpen, setProjectSidebarOpen] = useState(false);
// //   const [searchQuery, setSearchQuery] = useState("");
// //   const { fetchData } = useApi();

// //   // Pagination states
// //   const [companyPage, setCompanyPage] = useState(1);
// //   const [projectPage, setProjectPage] = useState(1);
// //   const [propertyPage, setPropertyPage] = useState(1);
// //   const rowsPerPage = 13;

// //   // Table column definitions
// //   const companyColumns = [
// //     { label: "S.No", key: "serialNo", render: (_, __, idx) => idx + 1 },
// //     { label: "Company Name", key: "CompanyName" },
// //     { label: "No.of Projects", key: "TotalProjects" },
// //     { label: "OperatingCities", key: "OperatingCities",
// //       render: (val) => {
// //     if (!val) return "N/A";
// //     const cities = val.split(",").map(city => city.trim());
// //     if (cities.length <= 2) return val;
// //     const visible = cities.slice(0, 2).join(", ");
// //     const remaining = cities.slice(2).join(", ");
// //     return (
// //       <span title={remaining}>
// //         {visible}, ...
// //       </span>
// //     );
// //   }
// //      },
// //     {
// //       label: "Operating Since",
// //       key: "OperatingYear",
// //       render: (val) => {
// //         if (!val) return "N/A";
// //         const year = val.toString().split("-")[0];
// //         return year || "N/A";
// //       },
// //     },
// //     { label: "ReadyToMove", key: "ReadyToMove" },
// //     { label: "UnderConstruction", key: "UnderConstruction" },
// //     {
// //       label: "More",
// //       key: "more",
// //       render: (_, company) => (
// //         <button
// //           onClick={() => {
// //             setSelectedCompany(company);
// //             setCompanySidebarOpen(true);
// //           }}
// //           style={{
// //             backgroundColor: "#121212",
// //             color: "#fff",
// //             border: "none",
// //             borderRadius: "4px",
// //             padding: "6px 12px",
// //             cursor: "pointer",
// //           }}
// //         >
// //           More
// //         </button>
// //       ),
// //     },
// //   ];

// //   const projectColumns = [
// //     { label: "S.No", key: "serialNo", render: (_, __, idx) => idx + 1 },
// //     { label: "Project Name", key: "ProjectName" },
// //     { label: "Project Status", key: "ProjectStatus" },
// //     { label: "Custom Project Types", key: "CustomProjectTypes" },
// //     { label: "Locality", key: "Locality" },
// //     {
// //       label: "More",
// //       key: "more",
// //       render: (_, project) => (
// //         <button
// //           onClick={() => {
// //             setSelectedProject(project);
// //             setProjectSidebarOpen(true);
// //           }}
// //           style={{
// //             backgroundColor: "#121212",
// //             color: "#fff",
// //             border: "none",
// //             borderRadius: "4px",
// //             padding: "6px 12px",
// //             cursor: "pointer",
// //           }}
// //         >
// //           More
// //         </button>
// //       ),
// //     },
// //   ];

// //   const propertyColumns = [
// //     { label: "S.No", key: "serialNo", render: (_, __, idx) => idx + 1 },
// //     { label: "ProjectName", key: "projectname" },
// //     { label: "Property ID", key: "PropertyID" },
// //     { label: "Property Name", key: "PropertyName" },
// //     { label: "Price", key: "AmountWithUnit" },
// //     { label: "Type", key: "PropertyType" },
// //     { label: "Status", key: "propertystatus" },
// //     { label: "Bedrooms", key: "Bedrooms" },
// //     { label: "Facing", key: "Facing" },
// //   ];

// //   // Fetch data once on mount
// //   useEffect(() => {
// //     setLoading(true);
// //     setError(null);
// //     Promise.all([
// //       fetchData("Company_Data"),
// //       fetchData("Projectdata"),
// //       fetchData("property_Data_Info"),
// //     ])
// //       .then(([companyRes, projectRes, propertyRes]) => {
// //         const cData = companyRes || [];
// //         const pData = projectRes || [];
// //         const prData = propertyRes || [];
// //         setCompanyData(cData);
// //         setProjectsData(pData);
// //         setPropertiesData(prData);
// //         setFilteredCompanies(cData);
// //         setFilteredProjects(pData);
// //         setFilteredProperties(prData);
// //       })
// //       .catch((err) => {
// //         setError(err.message || "Error loading data");
// //         setCompanyData([]);
// //         setProjectsData([]);
// //         setPropertiesData([]);
// //         setFilteredCompanies([]);
// //         setFilteredProjects([]);
// //         setFilteredProperties([]);
// //       })
// //       .finally(() => setLoading(false));
// //   }, [fetchData]);

// //   // Filtering logic based on search query
// //   useEffect(() => {
// //     if (!searchQuery) {
// //       setFilteredCompanies(companyData);
// //       setFilteredProjects(projectsData);
// //       setFilteredProperties(propertiesData);
// //       return;
// //     }
// //     const lowerQuery = searchQuery.toLowerCase();

// //     const filterCompanies = companyData.filter(
// //       (item) =>
// //         (item.CompanyName && item.CompanyName.toLowerCase().includes(lowerQuery)) ||
// //         (item.CompanyID && item.CompanyID.toString().toLowerCase().includes(lowerQuery)) ||
// //         (item.ReraNumber && item.ReraNumber.toLowerCase().includes(lowerQuery))
// //     );
// //     const filterProjects = projectsData.filter(
// //       (item) =>
// //         (item.ProjectName && item.ProjectName.toLowerCase().includes(lowerQuery)) ||
// //         (item.ProjectID && item.ProjectID.toString().toLowerCase().includes(lowerQuery)) ||
// //         (item.ReraNumber && item.ReraNumber.toLowerCase().includes(lowerQuery))
// //     );
// //     const filterProperties = propertiesData.filter(
// //       (item) =>
// //         (item.PropertyName && item.PropertyName.toLowerCase().includes(lowerQuery)) ||
// //         (item.PropertyID && item.PropertyID.toString().toLowerCase().includes(lowerQuery)) ||
// //         (item.ReraNumber && item.ReraNumber.toLowerCase().includes(lowerQuery))
// //     );

// //     setFilteredCompanies(filterCompanies);
// //     setFilteredProjects(filterProjects);
// //     setFilteredProperties(filterProperties);
// //   }, [searchQuery, companyData, projectsData, propertiesData]);

// //   // Reset current page when tab changes
// //   useEffect(() => {
// //     if (activeTab === "COMPANY") setCompanyPage(1);
// //     else if (activeTab === "PROJECTS") setProjectPage(1);
// //     else setPropertyPage(1);

// //     // Also close open sidebars on tab change
// //     setCompanySidebarOpen(false);
// //     setProjectSidebarOpen(false);
// //   }, [activeTab]);

// //   // Reset page when filtered data changes for current tab
// //   useEffect(() => {
// //     if (activeTab === "COMPANY") setCompanyPage(1);
// //   }, [filteredCompanies, activeTab]);

// //   useEffect(() => {
// //     if (activeTab === "PROJECTS") setProjectPage(1);
// //   }, [filteredProjects, activeTab]);

// //   useEffect(() => {
// //     if (activeTab === "PROPERTIES") setPropertyPage(1);
// //   }, [filteredProperties, activeTab]);

// //   // Pagination data slicing and setting current page/setter references
// //   let currentData, currentColumns, currentPage, setCurrentPage;

// //   if (activeTab === "COMPANY") {
// //     currentPage = companyPage;
// //     setCurrentPage = setCompanyPage;
// //     currentColumns = companyColumns;
// //     currentData = filteredCompanies.slice(
// //       (companyPage - 1) * rowsPerPage,
// //       companyPage * rowsPerPage
// //     );
// //   } else if (activeTab === "PROJECTS") {
// //     currentPage = projectPage;
// //     setCurrentPage = setProjectPage;
// //     currentColumns = projectColumns;
// //     currentData = filteredProjects.slice(
// //       (projectPage - 1) * rowsPerPage,
// //       projectPage * rowsPerPage
// //     );
// //   } else {
// //     currentPage = propertyPage;
// //     setCurrentPage = setPropertyPage;
// //     currentColumns = propertyColumns;
// //     currentData = filteredProperties.slice(
// //       (propertyPage - 1) * rowsPerPage,
// //       propertyPage * rowsPerPage
// //     );
// //   }

// //   return (
// //     <div className="dashboard-container" style={{ display: "flex", backgroundColor: "#fff", marginLeft: "180px" }}>
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
// //         }}
// //       >
// //         <div
// //           style={{
// //             display: "flex",
// //             alignItems: "center",
// //             justifyContent: "space-between",
// //             marginBottom: 20,
// //           }}
// //         >
// //           <h2 style={{ margin: 0 }}>Listing Data</h2>
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

// //         <div
// //           style={{
// //             display: "flex",
// //             justifyContent: "space-between",
// //             marginBottom: 16,
// //             gap: 10,
// //             flexWrap: "wrap",
// //             alignItems: "center",
// //           }}
// //         >
// //           <div style={{ marginBottom: 16, gap: "2px", display: "flex" }}>
// //             {Object.keys(listParamTypes).map((tab) => (
// //               <button
// //                 key={tab}
// //                 onClick={() => setActiveTab(tab)}
// //                 style={{
// //                   padding: "8px 15px",
// //                   fontWeight: activeTab === tab ? 600 : 500,
// //                   fontSize: "13px",
// //                   border: "none",
// //                   backgroundColor: activeTab === tab ? "#fff" : "#f0f0f0",
// //                   color: activeTab === tab ? "#2c3e50" : "#666",
// //                   cursor: "pointer",
// //                   borderBottom: activeTab === tab ? "3px solid #2c3e50" : "3px solid transparent",
// //                   transition: "background-color 0.3s ease,color 0.3s ease",
// //                   marginRight: "1px",
// //                 }}
// //               >
// //                 {listParamTypes[tab]}
// //               </button>
// //             ))}
// //           </div>

// //           <div style={{ minWidth: 150, maxWidth: 300, flex: "0 1 auto" }}>
// //             <SearchBar value={searchQuery} onChange={setSearchQuery} onSubmit={() => {}} />
// //           </div>
// //         </div>

// //         {loading && <p>Loading...</p>}
// //         {error && <p style={{ color: "red" }}>Error: {error}</p>}

// //         {!loading && !error && (
// //           <>
// //             <Table columns={currentColumns} paginatedData={currentData} rowsPerPage={rowsPerPage} />
// //             <Pagination
// //               page={currentPage}
// //               setPage={setCurrentPage}
// //               totalPages={Math.ceil(
// //                 activeTab === "COMPANY"
// //                   ? filteredCompanies.length / rowsPerPage
// //                   : activeTab === "PROJECTS"
// //                   ? filteredProjects.length / rowsPerPage
// //                   : filteredProperties.length / rowsPerPage
// //               )}
// //             />
// //           </>
// //         )}

// //         <CompanyDetailsSidebar open={companySidebarOpen} onClose={() => setCompanySidebarOpen(false)} company={selectedCompany} />

// //         <ProjectDetailsSidebar open={projectSidebarOpen} onClose={() => setProjectSidebarOpen(false)} project={selectedProject} />
// //       </div>
// //     </div>
// //   );
// // }

// // // --- CompanyDetailsSidebar and ProjectDetailsSidebar ---

// // function CompanyDetailsSidebar({ open, onClose, company }) {
// //   if (!open || !company) return null;
// //   return (
// //     <div
// //       style={{
// //         position: "fixed",
// //         top: 0,
// //         right: 0,
// //         width: "350px",
// //         height: "100vh",
// //         backgroundColor: "white",
// //         boxShadow: "-2px 0 8px rgba(0,0,0,0.1)",
// //         padding: 20,
// //         zIndex: 10000,
// //         overflowY: "auto",
// //         transition: "transform 0.3s ease",
// //         transform: open ? "translateX(0)" : "translateX(100%)",
// //       }}
// //     >
// //       <button
// //         onClick={onClose}
// //         style={{
// //           marginBottom: "12px",
// //           backgroundColor: "#d4af37",
// //           color: "white",
// //           border: "none",
// //           borderRadius: "4px",
// //           padding: "6px 12px",
// //           cursor: "pointer",
// //           float: "right",
// //         }}
// //       >
// //         Close
// //       </button>
// //       <h2 style={{ marginTop: 0, color: "#", gridColumn: "span 2", marginBottom: 12 }}>{company.CompanyName}</h2>
// //       <div
// //         style={{
// //           display: "grid",
// //           gridTemplateColumns: "1fr 1fr",
// //           gap: "8px 10px",
// //           alignItems: "center",
// //         }}
// //       >
// //         <div style={{ fontWeight: 600 }}>Company Short Name</div>
// //         <div>{company.CompanyShortName || "N/A"}</div>
// //         <div style={{ fontWeight: 600 }}>Address 1</div>
// //         <div>{company.Address1 || "N/A"}</div>
// //         <div style={{ fontWeight: 600 }}>Address 2</div>
// //         <div>{company.Address2 || "N/A"}</div>
// //         <div style={{ fontWeight: 600 }}>Locality</div>
// //         <div>{company.Locality || "N/A"}</div>
// //         <div style={{ fontWeight: 600 }}>Tier</div>
// //         <div>{company.Tier || "N/A"}</div>
// //         <div style={{ fontWeight: 600 }}>Operating Since</div>
// //         <div>{company.OperatingSince ? company.OperatingSince.split("T")[0] : "N/A"}</div>
// //         <div style={{ fontWeight: 600 }}>Residential</div>
// //         <div>{company.Residential === "Y" ? "Yes" : "No"}</div>
// //         <div style={{ fontWeight: 600 }}>Apartments</div>
// //         <div>{company.Apartments === "Y" ? "Yes" : "No"}</div>
// //         <div style={{ fontWeight: 600 }}>Villas</div>
// //         <div>{company.Villas === "Y" ? "Yes" : "No"}</div>
// //         <div style={{ fontWeight: 600 }}>Commercial</div>
// //         <div>{company.Commercial === "Y" ? "Yes" : "No"}</div>
// //         <div style={{ fontWeight: 600 }}>Plots</div>
// //         <div>{company.Plots === "Y" ? "Yes" : "No"}</div>
// //         <div style={{ fontWeight: 600 }}>Farm Lands</div>
// //         <div>{company.FarmLands === "Y" ? "Yes" : "No"}</div>
// //         <div style={{ fontWeight: 600 }}>Upcoming</div>
// //         <div>{company.Upcoming || "N/A"}</div>
// //         <div style={{ fontWeight: 600 }}>Ready To Move</div>
// //         <div>{company.ReadyToMove || "N/A"}</div>
// //         <div style={{ fontWeight: 600 }}>Under Construction</div>
// //         <div>{company.UnderConstruction || "N/A"}</div>
// //         <div style={{ fontWeight: 600 }}>Completed</div>
// //         <div>{company.Completed || "N/A"}</div>
// //         <div style={{ fontWeight: 600 }}>Operating Cities</div>
// //         <div>{company.OperatingCities || "N/A"}</div>
// //         <div style={{ fontWeight: 600 }}>Project Count</div>
// //         <div>{company.ProjectCount || "N/A"}</div>
// //       </div>
// //     </div>
// //   );
// // }

// // function ProjectDetailsSidebar({ open, onClose, project }) {
// //   if (!open || !project) return null;
// //   return (
// //     <div
// //       style={{
// //         position: "fixed",
// //         top: 0,
// //         right: 0,
// //         width: "450px",
// //         maxWidth: "90vw",
// //         height: "100vh",
// //         backgroundColor: "white",
// //         boxShadow: "-2px 0 8px rgba(0,0,0,0.1)",
// //         padding: 20,
// //         zIndex: 10000,
// //         overflowY: "auto",
// //         transition: "transform 0.3s ease",
// //         transform: open ? "translateX(0)" : "translateX(100%)",
// //       }}
// //     >
// //       <button
// //         onClick={onClose}
// //         style={{
// //           marginBottom: "12px",
// //           backgroundColor: "#d4af37",
// //           color: "white",
// //           border: "none",
// //           borderRadius: "4px",
// //           padding: "6px 12px",
// //           cursor: "pointer",
// //           float: "right",
// //         }}
// //       >
// //         Close
// //       </button>
// //       <h2 style={{ marginTop: 0, color: "#d4af37", gridColumn: "span 2", marginBottom: 12 }}>{project.ProjectName}</h2>
// //       <div
// //         style={{
// //           display: "grid",
// //           gridTemplateColumns: "1fr 1fr",
// //           gap: "8px 10px",
// //           alignItems: "center",
// //         }}
// //       >
// //         <div style={{ fontWeight: 600 }}>Company Name</div>
// //         <div>{project.CompanyName || "N/A"}</div>
// //         <div style={{ fontWeight: 600 }}>Project ID</div>
// //         <div>{project.ProjectID || "N/A"}</div>
// //         <div style={{ fontWeight: 600 }}>Address1</div>
// //         <div>{project.Address1 || "N/A"}</div>
// //         <div style={{ fontWeight: 600 }}>Project Status</div>
// //         <div>{project.ProjectStatus || "N/A"}</div>
// //         <div style={{ fontWeight: 600 }}>Custom Project Types</div>
// //         <div>{project.CustomProjectTypes || "N/A"}</div>
// //         <div style={{ fontWeight: 600 }}>City</div>
// //         <div>{project.city || "N/A"}</div>
// //         <div style={{ fontWeight: 600 }}>Project Description</div>
// //         <div>{project.ProjectDescription || "N/A"}</div>
// //         <div style={{ fontWeight: 600 }}>Amenities</div>
// //         <div>{project.Amenities || "N/A"}</div>
// //         <div style={{ fontWeight: 600 }}>RERA</div>
// //         <div>{project.RERA || "N/A"}</div>
// //         <div style={{ fontWeight: 600 }}>Locality</div>
// //         <div>{project.Locality || "N/A"}</div>
// //         <div style={{ fontWeight: 600 }}>Geolocation</div>
// //         <div>{project.Geolocation || "N/A"}</div>
// //         <div style={{ fontWeight: 600 }}>Properties For Sale</div>
// //         <div>{project.PropertiesForSale || "N/A"}</div>
// //       </div>
// //     </div>
// //   );
// // }
// import React, { useEffect, useState } from "react";
// import Sidebar from "../../components/Sidebar.jsx";
// import { useApi } from "../../API/Api.js";
// import Table from "../../Utils/Table.jsx";
// import SearchBar from "../../Utils/SearchBar.jsx";
// import { Pagination } from "../../Utils/Table.jsx"; // Your Pagination component
// import { Filter } from "lucide-react";

// // Header with filter UI
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
// }) {
//   return (
//     <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "center", position: "relative" }}>
//       <span>{label}</span>
//       <Filter
//         size={14}
//         style={{ cursor: "pointer", color: openFilter === columnKey ? "#22253b" : "#adb1bd" }}
//         onClick={(e) => {
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
//           onClick={(e) => e.stopPropagation()}
//         >
//           <input
//             type="text"
//             placeholder={`Search ${label}`}
//             value={filterSearchValue}
//             onChange={(e) => setFilterSearchValue(e.target.value)}
//             style={{
//               width: "100%",
//               padding: "4px 8px",
//               marginBottom: 8,
//               borderRadius: 4,
//               border: "1px solid #ddd",
//               fontSize: 13,
//             }}
//           />
//           <div style={{ maxHeight: 150, overflowY: "auto" }}>
//             {uniqueValues(columnKey)
//               .filter((val) => val?.toString().toLowerCase().includes(filterSearchValue.toLowerCase()))
//               .map((val) => (
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

// const listParamTypes = {
//   COMPANY: "Companies",
//   PROJECTS: "Projects",
//   PROPERTIES: "Properties",
// };

// export default function ProjectsDetails() {
//   const [activeTab, setActiveTab] = useState("COMPANY");
//   const [companyData, setCompanyData] = useState([]);
//   const [projectsData, setProjectsData] = useState([]);
//   const [propertiesData, setPropertiesData] = useState([]);
//   const [filteredCompanies, setFilteredCompanies] = useState([]);
//   const [filteredProjects, setFilteredProjects] = useState([]);
//   const [filteredProperties, setFilteredProperties] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [selectedCompany, setSelectedCompany] = useState(null);
//   const [companySidebarOpen, setCompanySidebarOpen] = useState(false);
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [projectSidebarOpen, setProjectSidebarOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const { fetchData } = useApi();

//   // Pagination states
//   const [companyPage, setCompanyPage] = useState(1);
//   const [projectPage, setProjectPage] = useState(1);
//   const [propertyPage, setPropertyPage] = useState(1);
//   const rowsPerPage = 15;

//   // Filter states and handlers
//   const [openFilter, setOpenFilter] = useState(null);
//   const [filters, setFilters] = useState({});
//   const [filterSearchValue, setFilterSearchValue] = useState("");

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

//   const applyFilter = () => {
//     const filterData = (data) =>
//       data.filter((item) =>
//         Object.entries(filters).every(([key, values]) => {
//           if (!values.length) return true;
//           const itemVal = item[key];
//           // For OperatingCities (CSV), check if any filter value matches
//           if (key === "OperatingCities" && typeof itemVal === "string") {
//             const arr = itemVal.split(",").map((s) => s.trim());
//             return values.some((v) => arr.includes(v));
//           }
//           return values.includes(itemVal);
//         })
//       );
//     setFilteredCompanies(filterData(companyData));
//     setFilteredProjects(filterData(projectsData));
//     setFilteredProperties(filterData(propertiesData));
//     setOpenFilter(null);
//     setCompanyPage(1);
//     setProjectPage(1);
//     setPropertyPage(1);
//   };

//   // Unique values extractor for filters
//   const uniqueValues = (key, dataset) => {
//     const vals = dataset.map((item) => item[key]).filter((v) => v != null);
//     if (key === "OperatingCities") {
//       return Array.from(new Set(vals.flatMap((v) => v.split(",").map((s) => s.trim()))));
//     }
//     return Array.from(new Set(vals));
//   };

//   // Fetch data once on mount
//   useEffect(() => {
//     setLoading(true);
//     setError(null);
//     Promise.all([fetchData("Company_Data"), fetchData("Projectdata"), fetchData("property_Data_Info")])
//       .then(([companyRes, projectRes, propertyRes]) => {
//         const cData = companyRes || [];
//         const pData = projectRes || [];
//         const prData = propertyRes || [];
//         setCompanyData(cData);
//         setProjectsData(pData);
//         setPropertiesData(prData);
//         setFilteredCompanies(cData);
//         setFilteredProjects(pData);
//         setFilteredProperties(prData);
//       })
//       .catch((err) => {
//         setError(err.message || "Error loading data");
//         setCompanyData([]);
//         setProjectsData([]);
//         setPropertiesData([]);
//         setFilteredCompanies([]);
//         setFilteredProjects([]);
//         setFilteredProperties([]);
//       })
//       .finally(() => setLoading(false));
//   }, [fetchData]);

//   // Filtering logic based on search query
//   useEffect(() => {
//     if (!searchQuery) {
//       setFilteredCompanies(companyData);
//       setFilteredProjects(projectsData);
//       setFilteredProperties(propertiesData);
//       return;
//     }
//     const lowerQuery = searchQuery.toLowerCase();

//     const filterCompanies = companyData.filter(
//       (item) =>
//         (item.CompanyName && item.CompanyName.toLowerCase().includes(lowerQuery)) ||
//         (item.CompanyID && item.CompanyID.toString().toLowerCase().includes(lowerQuery)) ||
//         (item.ReraNumber && item.ReraNumber.toLowerCase().includes(lowerQuery))
//     );
//     const filterProjects = projectsData.filter(
//       (item) =>
//         (item.ProjectName && item.ProjectName.toLowerCase().includes(lowerQuery)) ||
//         (item.ProjectID && item.ProjectID.toString().toLowerCase().includes(lowerQuery)) ||
//         (item.ReraNumber && item.ReraNumber.toLowerCase().includes(lowerQuery))
//     );
//     const filterProperties = propertiesData.filter(
//       (item) =>
//         (item.PropertyName && item.PropertyName.toLowerCase().includes(lowerQuery)) ||
//         (item.PropertyID && item.PropertyID.toString().toLowerCase().includes(lowerQuery)) ||
//         (item.ReraNumber && item.ReraNumber.toLowerCase().includes(lowerQuery))
//     );

//     setFilteredCompanies(filterCompanies);
//     setFilteredProjects(filterProjects);
//     setFilteredProperties(filterProperties);
//   }, [searchQuery, companyData, projectsData, propertiesData]);

//   // Reset current page when tab changes and close sidebars
//   useEffect(() => {
//     if (activeTab === "COMPANY") setCompanyPage(1);
//     else if (activeTab === "PROJECTS") setProjectPage(1);
//     else setPropertyPage(1);

//     setCompanySidebarOpen(false);
//     setProjectSidebarOpen(false);
//   }, [activeTab]);

//   // Reset page when filtered data changes for current tab
//   useEffect(() => {
//     if (activeTab === "COMPANY") setCompanyPage(1);
//   }, [filteredCompanies, activeTab]);

//   useEffect(() => {
//     if (activeTab === "PROJECTS") setProjectPage(1);
//   }, [filteredProjects, activeTab]);

//   useEffect(() => {
//     if (activeTab === "PROPERTIES") setPropertyPage(1);
//   }, [filteredProperties, activeTab]);

//   // Columns for each tab with filtering

//   const companyColumns = [
//     {
//       label: (
//         <HeaderWithFilter
//           label="S.No"
//           columnKey="serialNo"
//           openFilter={openFilter}
//           toggleFilter={toggleFilter}
//           filterSearchValue={filterSearchValue}
//           setFilterSearchValue={setFilterSearchValue}
//           uniqueValues={() => []}
//           filters={filters}
//           handleCheckboxChange={handleCheckboxChange}
//           clearFilter={clearFilter}
//           applyFilter={applyFilter}
//         />
//       ),
//       key: "serialNo",
//      render: (_, __, idx) => (companyPage - 1) * rowsPerPage + idx + 1,


//     },
//     {
//       label: (
//         <HeaderWithFilter
//           label="Company Name"
//           columnKey="CompanyName"
//           openFilter={openFilter}
//           toggleFilter={toggleFilter}
//           filterSearchValue={filterSearchValue}
//           setFilterSearchValue={setFilterSearchValue}
//           uniqueValues={() => uniqueValues("CompanyName", companyData)}
//           filters={filters}
//           handleCheckboxChange={handleCheckboxChange}
//           clearFilter={clearFilter}
//           applyFilter={applyFilter}
//         />
//       ),
//       key: "CompanyName",
//     },
//     {
//       label: (
//         <HeaderWithFilter
//           label="No.of Projects"
//           columnKey="TotalProjects"
//           openFilter={openFilter}
//           toggleFilter={toggleFilter}
//           filterSearchValue={filterSearchValue}
//           setFilterSearchValue={setFilterSearchValue}
//           uniqueValues={() => uniqueValues("TotalProjects", companyData)}
//           filters={filters}
//           handleCheckboxChange={handleCheckboxChange}
//           clearFilter={clearFilter}
//           applyFilter={applyFilter}
//         />
//       ),
//       key: "TotalProjects",
//     },
//     {
//       label: (
//         <HeaderWithFilter
//           label="Operating Cities"
//           columnKey="OperatingCities"
//           openFilter={openFilter}
//           toggleFilter={toggleFilter}
//           filterSearchValue={filterSearchValue}
//           setFilterSearchValue={setFilterSearchValue}
//           uniqueValues={() => uniqueValues("OperatingCities", companyData)}
//           filters={filters}
//           handleCheckboxChange={handleCheckboxChange}
//           clearFilter={clearFilter}
//           applyFilter={applyFilter}
//         />
//       ),
//       key: "OperatingCities",
//       render: (val) => {
//         if (!val) return "N/A";
//         const cities = val.split(",").map((city) => city.trim());
//         if (cities.length <= 2) return val;
//         const visible = cities.slice(0, 2).join(", ");
//         const remaining = cities.slice(2).join(", ");
//         return <span title={remaining}>{visible}, ...</span>;
//       },
//     },
//     {
//       label: (
//         <HeaderWithFilter
//           label="Operating Since"
//           columnKey="OperatingYear"
//           openFilter={openFilter}
//           toggleFilter={toggleFilter}
//           filterSearchValue={filterSearchValue}
//           setFilterSearchValue={setFilterSearchValue}
//           uniqueValues={() => uniqueValues("OperatingYear", companyData)}
//           filters={filters}
//           handleCheckboxChange={handleCheckboxChange}
//           clearFilter={clearFilter}
//           applyFilter={applyFilter}
//         />
//       ),
//       key: "OperatingYear",
//       render: (val) => {
//         if (!val) return "N/A";
//         const year = val.toString().split("-")[0];
//         return year || "N/A";
//       },
//     },
//     {
//       label: (
//         <HeaderWithFilter
//           label="ReadyToMove"
//           columnKey="ReadyToMove"
//           openFilter={openFilter}
//           toggleFilter={toggleFilter}
//           filterSearchValue={filterSearchValue}
//           setFilterSearchValue={setFilterSearchValue}
//           uniqueValues={() => uniqueValues("ReadyToMove", companyData)}
//           filters={filters}
//           handleCheckboxChange={handleCheckboxChange}
//           clearFilter={clearFilter}
//           applyFilter={applyFilter}
//         />
//       ),
//       key: "ReadyToMove",
//     },
//     {
//       label: (
//         <HeaderWithFilter
//           label="UnderConstruction"
//           columnKey="UnderConstruction"
//           openFilter={openFilter}
//           toggleFilter={toggleFilter}
//           filterSearchValue={filterSearchValue}
//           setFilterSearchValue={setFilterSearchValue}
//           uniqueValues={() => uniqueValues("UnderConstruction", companyData)}
//           filters={filters}
//           handleCheckboxChange={handleCheckboxChange}
//           clearFilter={clearFilter}
//           applyFilter={applyFilter}
//         />
//       ),
//       key: "UnderConstruction",
//     },
//     {
//       label: "More",
//       key: "more",
//       render: (_, company) => (
//         <button
//           onClick={() => {
//             setSelectedCompany(company);
//             setCompanySidebarOpen(true);
//           }}
//           style={{
//             backgroundColor: "#121212",
//             color: "#fff",
//             border: "none",
//             borderRadius: "4px",
//             padding: "6px 12px",
//             cursor: "pointer",
//           }}
//         >
//           More
//         </button>
//       ),
//     },
//   ];

//   // Similarly define projectColumns and propertyColumns with HeaderWithFilter for their columns,
//   // using uniqueValues for that dataset and key

//   // For brevity, here just example for projectColumns with filters on few columns:
//   const projectColumns = [
//     {
//       label: (
//         <HeaderWithFilter
//           label="S.No"
//           columnKey="serialNo"
//           openFilter={openFilter}
//           toggleFilter={toggleFilter}
//           filterSearchValue={filterSearchValue}
//           setFilterSearchValue={setFilterSearchValue}
//           uniqueValues={() => []}
//           filters={filters}
//           handleCheckboxChange={handleCheckboxChange}
//           clearFilter={clearFilter}
//           applyFilter={applyFilter}
//         />
//       ),
//       key: "serialNo",
//      render: (_, __, idx) => (projectPage - 1) * rowsPerPage + idx + 1,


//     },
//     {
//       label: (
//         <HeaderWithFilter
//           label="Project Name"
//           columnKey="ProjectName"
//           openFilter={openFilter}
//           toggleFilter={toggleFilter}
//           filterSearchValue={filterSearchValue}
//           setFilterSearchValue={setFilterSearchValue}
//           uniqueValues={() => uniqueValues("ProjectName", projectsData)}
//           filters={filters}
//           handleCheckboxChange={handleCheckboxChange}
//           clearFilter={clearFilter}
//           applyFilter={applyFilter}
//         />
//       ),
//       key: "ProjectName",
//     },
//     {
//       label: (
//         <HeaderWithFilter
//           label="Project Status"
//           columnKey="ProjectStatus"
//           openFilter={openFilter}
//           toggleFilter={toggleFilter}
//           filterSearchValue={filterSearchValue}
//           setFilterSearchValue={setFilterSearchValue}
//           uniqueValues={() => uniqueValues("ProjectStatus", projectsData)}
//           filters={filters}
//           handleCheckboxChange={handleCheckboxChange}
//           clearFilter={clearFilter}
//           applyFilter={applyFilter}
//         />
//       ),
//       key: "ProjectStatus",
//     },
//     {
//       label: (
//         <HeaderWithFilter
//           label="Custom Project Types"
//           columnKey="CustomProjectTypes"
//           openFilter={openFilter}
//           toggleFilter={toggleFilter}
//           filterSearchValue={filterSearchValue}
//           setFilterSearchValue={setFilterSearchValue}
//           uniqueValues={() => uniqueValues("CustomProjectTypes", projectsData)}
//           filters={filters}
//           handleCheckboxChange={handleCheckboxChange}
//           clearFilter={clearFilter}
//           applyFilter={applyFilter}
//         />
//       ),
//       key: "CustomProjectTypes",
//     },
//     {
//       label: (
//         <HeaderWithFilter
//           label="Locality"
//           columnKey="Locality"
//           openFilter={openFilter}
//           toggleFilter={toggleFilter}
//           filterSearchValue={filterSearchValue}
//           setFilterSearchValue={setFilterSearchValue}
//           uniqueValues={() => uniqueValues("Locality", projectsData)}
//           filters={filters}
//           handleCheckboxChange={handleCheckboxChange}
//           clearFilter={clearFilter}
//           applyFilter={applyFilter}
//         />
//       ),
//       key: "Locality",
//     },
//     {
//       label: "More",
//       key: "more",
//       render: (_, project) => (
//         <button
//           onClick={() => {
//             setSelectedProject(project);
//             setProjectSidebarOpen(true);
//           }}
//           style={{
//             backgroundColor: "#121212",
//             color: "#fff",
//             border: "none",
//             borderRadius: "4px",
//             padding: "6px 12px",
//             cursor: "pointer",
//           }}
//         >
//           More
//         </button>
//       ),
//     },
//   ];

//   // Property columns similarly...
//   const propertyColumns = [
//     {
//       label: (
//         <HeaderWithFilter
//           label="S.No"
//           columnKey="serialNo"
//           openFilter={openFilter}
//           toggleFilter={toggleFilter}
//           filterSearchValue={filterSearchValue}
//           setFilterSearchValue={setFilterSearchValue}
//           uniqueValues={() => []}
//           filters={filters}
//           handleCheckboxChange={handleCheckboxChange}
//           clearFilter={clearFilter}
//           applyFilter={applyFilter}
//         />
//       ),
//       key: "serialNo",
//      render: (_, __, idx) => (propertyPage - 1) * rowsPerPage + idx + 1,


//     },
//     {
//       label: (
//         <HeaderWithFilter
//           label="Project Name"
//           columnKey="projectname"
//           openFilter={openFilter}
//           toggleFilter={toggleFilter}
//           filterSearchValue={filterSearchValue}
//           setFilterSearchValue={setFilterSearchValue}
//           uniqueValues={() => uniqueValues("projectname", propertiesData)}
//           filters={filters}
//           handleCheckboxChange={handleCheckboxChange}
//           clearFilter={clearFilter}
//           applyFilter={applyFilter}
//         />
//       ),
//       key: "projectname",
//     },
//     {
//       label: (
//         <HeaderWithFilter
//           label="Property ID"
//           columnKey="PropertyID"
//           openFilter={openFilter}
//           toggleFilter={toggleFilter}
//           filterSearchValue={filterSearchValue}
//           setFilterSearchValue={setFilterSearchValue}
//           uniqueValues={() => uniqueValues("PropertyID", propertiesData)}
//           filters={filters}
//           handleCheckboxChange={handleCheckboxChange}
//           clearFilter={clearFilter}
//           applyFilter={applyFilter}
//         />
//       ),
//       key: "PropertyID",
//     },
//     {
//       label: (
//         <HeaderWithFilter
//           label="Property Name"
//           columnKey="PropertyName"
//           openFilter={openFilter}
//           toggleFilter={toggleFilter}
//           filterSearchValue={filterSearchValue}
//           setFilterSearchValue={setFilterSearchValue}
//           uniqueValues={() => uniqueValues("PropertyName", propertiesData)}
//           filters={filters}
//           handleCheckboxChange={handleCheckboxChange}
//           clearFilter={clearFilter}
//           applyFilter={applyFilter}
//         />
//       ),
//       key: "PropertyName",
//     },
//     {
//       label: (
//         <HeaderWithFilter
//           label="Price"
//           columnKey="AmountWithUnit"
//           openFilter={openFilter}
//           toggleFilter={toggleFilter}
//           filterSearchValue={filterSearchValue}
//           setFilterSearchValue={setFilterSearchValue}
//           uniqueValues={() => uniqueValues("AmountWithUnit", propertiesData)}
//           filters={filters}
//           handleCheckboxChange={handleCheckboxChange}
//           clearFilter={clearFilter}
//           applyFilter={applyFilter}
//         />
//       ),
//       key: "AmountWithUnit",
//     },
//     {
//       label: (
//         <HeaderWithFilter
//           label="Type"
//           columnKey="PropertyType"
//           openFilter={openFilter}
//           toggleFilter={toggleFilter}
//           filterSearchValue={filterSearchValue}
//           setFilterSearchValue={setFilterSearchValue}
//           uniqueValues={() => uniqueValues("PropertyType", propertiesData)}
//           filters={filters}
//           handleCheckboxChange={handleCheckboxChange}
//           clearFilter={clearFilter}
//           applyFilter={applyFilter}
//         />
//       ),
//       key: "PropertyType",
//     },
//     {
//       label: (
//         <HeaderWithFilter
//           label="Status"
//           columnKey="propertystatus"
//           openFilter={openFilter}
//           toggleFilter={toggleFilter}
//           filterSearchValue={filterSearchValue}
//           setFilterSearchValue={setFilterSearchValue}
//           uniqueValues={() => uniqueValues("propertystatus", propertiesData)}
//           filters={filters}
//           handleCheckboxChange={handleCheckboxChange}
//           clearFilter={clearFilter}
//           applyFilter={applyFilter}
//         />
//       ),
//       key: "propertystatus",
//     },
//     {
//       label: (
//         <HeaderWithFilter
//           label="Bedrooms"
//           columnKey="Bedrooms"
//           openFilter={openFilter}
//           toggleFilter={toggleFilter}
//           filterSearchValue={filterSearchValue}
//           setFilterSearchValue={setFilterSearchValue}
//           uniqueValues={() => uniqueValues("Bedrooms", propertiesData)}
//           filters={filters}
//           handleCheckboxChange={handleCheckboxChange}
//           clearFilter={clearFilter}
//           applyFilter={applyFilter}
//         />
//       ),
//       key: "Bedrooms",
//     },
//     {
//       label: (
//         <HeaderWithFilter
//           label="Facing"
//           columnKey="Facing"
//           openFilter={openFilter}
//           toggleFilter={toggleFilter}
//           filterSearchValue={filterSearchValue}
//           setFilterSearchValue={setFilterSearchValue}
//           uniqueValues={() => uniqueValues("Facing", propertiesData)}
//           filters={filters}
//           handleCheckboxChange={handleCheckboxChange}
//           clearFilter={clearFilter}
//           applyFilter={applyFilter}
//         />
//       ),
//       key: "Facing",
//     },
//   ];

//   // Determine current tab data
//   let currentData, currentColumns, currentPage, setCurrentPage;

//   if (activeTab === "COMPANY") {
//     currentPage = companyPage;
//     setCurrentPage = setCompanyPage;
//     currentColumns = companyColumns;
//     currentData = filteredCompanies.slice((companyPage - 1) * rowsPerPage, companyPage * rowsPerPage);
//   } else if (activeTab === "PROJECTS") {
//     currentPage = projectPage;
//     setCurrentPage = setProjectPage;
//     currentColumns = projectColumns;
//     currentData = filteredProjects.slice((projectPage - 1) * rowsPerPage, projectPage * rowsPerPage);
//   } else {
//     currentPage = propertyPage;
//     setCurrentPage = setPropertyPage;
//     currentColumns = propertyColumns;
//     currentData = filteredProperties.slice((propertyPage - 1) * rowsPerPage, propertyPage * rowsPerPage);
//   }

//   return (
//     <div className="dashboard-container" style={{ display: "flex", backgroundColor: "#fff", marginLeft: "180px" }}>
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
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
//           <h2 style={{ margin: 0,fontweight:400 }}>Listing Data</h2>
//           <div style={{ fontWeight: "bold", fontSize: "1.1rem", color: "#d4af37" }}>Kiran Reddy Pallaki</div>
//         </div>

//         {/* Tabs */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             marginBottom: 16,
//             gap: 10,
//             flexWrap: "wrap",
//             alignItems: "center",
//           }}
//         >
//           <div style={{ marginBottom: 16, gap: "2px", display: "flex" }}>
//             {Object.keys(listParamTypes).map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 style={{
//                   padding: "8px 15px",
//                   fontWeight: activeTab === tab ? 600 : 500,
//                   fontSize: "13px",
//                   border: "none",
//                   backgroundColor: activeTab === tab ? "#fff" : "#f0f0f0",
//                   color: activeTab === tab ? "#2c3e50" : "#666",
//                   cursor: "pointer",
//                   borderBottom: activeTab === tab ? "3px solid #2c3e50" : "3px solid transparent",
//                   transition: "background-color 0.3s ease,color 0.3s ease",
//                   marginRight: "1px",
//                 }}
//               >
//                 {listParamTypes[tab]}
//               </button>
//             ))}
//           </div>

//           <div style={{ minWidth: 150, maxWidth: 350, flex: "0 1 auto" }}>
//             <SearchBar value={searchQuery} onChange={setSearchQuery} onSubmit={() => {}} />
//           </div>
//         </div>

//         {loading && <p>Loading...</p>}
//         {error && <p style={{ color: "red" }}>Error: {error}</p>}

//         {!loading && !error && (
//           <>
//             <Table columns={currentColumns} paginatedData={currentData} rowsPerPage={rowsPerPage} />
//             <Pagination
//               page={currentPage}
//               setPage={setCurrentPage}
//               totalPages={Math.ceil(
//                 activeTab === "COMPANY"
//                   ? filteredCompanies.length / rowsPerPage
//                   : activeTab === "PROJECTS"
//                   ? filteredProjects.length / rowsPerPage
//                   : filteredProperties.length / rowsPerPage
//               )}
//             />
//           </>
//         )}

//         {/* Sidebars */}
//         <CompanyDetailsSidebar open={companySidebarOpen} onClose={() => setCompanySidebarOpen(false)} company={selectedCompany} />
//         <ProjectDetailsSidebar open={projectSidebarOpen} onClose={() => setProjectSidebarOpen(false)} project={selectedProject} />
//       </div>
//     </div>
//   );
// }

// // Company Details Sidebar component unchanged
// function CompanyDetailsSidebar({ open, onClose, company }) {
//   if (!open || !company) return null;
//   return (
//     <div
//       style={{
//         position: "fixed",
//         top: 0,
//         right: 0,
//         width: "350px",
//         height: "100vh",
//         backgroundColor: "white",
//         boxShadow: "-2px 0 8px rgba(0,0,0,0.1)",
//         padding: 20,
//         zIndex: 10000,
//         overflowY: "auto",
//         transition: "transform 0.3s ease",
//         transform: open ? "translateX(0)" : "translateX(100%)",
//       }}
//     >
//       <button
//         onClick={onClose}
//         style={{
//           marginBottom: "12px",
//           backgroundColor: "#d4af37",
//           color: "white",
//           border: "none",
//           borderRadius: "4px",
//           padding: "6px 12px",
//           cursor: "pointer",
//           float: "right",
//         }}
//       >
//         Close
//       </button>
//       <h2 style={{ marginTop: 0, gridColumn: "span 2", marginBottom: 12 }}>{company.CompanyName}</h2>
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "1fr 1fr",
//           gap: "8px 10px",
//           alignItems: "center",
//         }}
//       >
//         <div style={{ fontWeight: 600 }}>Company Short Name</div>
//         <div>{company.CompanyShortName || "N/A"}</div>
//         <div style={{ fontWeight: 600 }}>Address 1</div>
//         <div>{company.Address1 || "N/A"}</div>
//         <div style={{ fontWeight: 600 }}>Address 2</div>
//         <div>{company.Address2 || "N/A"}</div>
//         <div style={{ fontWeight: 600 }}>Locality</div>
//         <div>{company.Locality || "N/A"}</div>
//         <div style={{ fontWeight: 600 }}>Tier</div>
//         <div>{company.Tier || "N/A"}</div>
//         <div style={{ fontWeight: 600 }}>Operating Since</div>
//         <div>{company.OperatingSince ? company.OperatingSince.split("T")[0] : "N/A"}</div>
//         <div style={{ fontWeight: 600 }}>Residential</div>
//         <div>{company.Residential === "Y" ? "Yes" : "No"}</div>
//         <div style={{ fontWeight: 600 }}>Apartments</div>
//         <div>{company.Apartments === "Y" ? "Yes" : "No"}</div>
//         <div style={{ fontWeight: 600 }}>Villas</div>
//         <div>{company.Villas === "Y" ? "Yes" : "No"}</div>
//         <div style={{ fontWeight: 600 }}>Commercial</div>
//         <div>{company.Commercial === "Y" ? "Yes" : "No"}</div>
//         <div style={{ fontWeight: 600 }}>Plots</div>
//         <div>{company.Plots === "Y" ? "Yes" : "No"}</div>
//         <div style={{ fontWeight: 600 }}>Farm Lands</div>
//         <div>{company.FarmLands === "Y" ? "Yes" : "No"}</div>
//         <div style={{ fontWeight: 600 }}>Upcoming</div>
//         <div>{company.Upcoming || "N/A"}</div>
//         <div style={{ fontWeight: 600 }}>Ready To Move</div>
//         <div>{company.ReadyToMove || "N/A"}</div>
//         <div style={{ fontWeight: 600 }}>Under Construction</div>
//         <div>{company.UnderConstruction || "N/A"}</div>
//         <div style={{ fontWeight: 600 }}>Completed</div>
//         <div>{company.Completed || "N/A"}</div>
//         <div style={{ fontWeight: 600 }}>Operating Cities</div>
//         <div>{company.OperatingCities || "N/A"}</div>
//         <div style={{ fontWeight: 600 }}>Project Count</div>
//         <div>{company.Proje || "N/A"}</div>
//       </div>
//     </div>
//   );
// }

// // Project Details Sidebar component unchanged
// function ProjectDetailsSidebar({ open, onClose, project }) {
//   if (!open || !project) return null;
//   return (
//     <div
//       style={{
//         position: "fixed",
//         top: 0,
//         right: 0,
//         width: "450px",
//         maxWidth: "90vw",
//         height: "100vh",
//         backgroundColor: "white",
//         boxShadow: "-2px 0 8px rgba(0,0,0,0.1)",
//         padding: 20,
//         zIndex: 10000,
//         overflowY: "auto",
//         transition: "transform 0.3s ease",
//         transform: open ? "translateX(0)" : "translateX(100%)",
//       }}
//     >
//       <button
//         onClick={onClose}
//         style={{
//           marginBottom: "12px",
//           backgroundColor: "#d4af37",
//           color: "white",
//           border: "none",
//           borderRadius: "4px",
//           padding: "6px 12px",
//           cursor: "pointer",
//           float: "right",
//         }}
//       >
//         Close
//       </button>
//       <h2 style={{ marginTop: 0, color: "#d4af37", gridColumn: "span 2", marginBottom: 12 }}>{project.ProjectName}</h2>
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "1fr 1fr",
//           gap: "8px 10px",
//           alignItems: "center",
//         }}
//       >
//         <div style={{ fontWeight: 600 }}>Company Name</div>
//         <div>{project.CompanyName || "N/A"}</div>
//         <div style={{ fontWeight: 600 }}>Project ID</div>
//         <div>{project.ProjectID || "N/A"}</div>
//         <div style={{ fontWeight: 600 }}>Address1</div>
//         <div>{project.Address1 || "N/A"}</div>
//         <div style={{ fontWeight: 600 }}>Project Status</div>
//         <div>{project.ProjectStatus || "N/A"}</div>
//         <div style={{ fontWeight: 600 }}>Custom Project Types</div>
//         <div>{project.CustomProjectTypes || "N/A"}</div>
//         <div style={{ fontWeight: 600 }}>City</div>
//         <div>{project.city || "N/A"}</div>
//         <div style={{ fontWeight: 600 }}>Project Description</div>
//         <div>{project.ProjectDescription || "N/A"}</div>
//         <div style={{ fontWeight: 600 }}>Amenities</div>
//         <div>{project.Amenities || "N/A"}</div>
//         <div style={{ fontWeight: 600 }}>RERA</div>
//         <div>{project.RERA || "N/A"}</div>
//         <div style={{ fontWeight: 600 }}>Locality</div>
//         <div>{project.Locality || "N/A"}</div>
//         <div style={{ fontWeight: 600 }}>Geolocation</div>
//         <div>{project.Geolocation || "N/A"}</div>
//         <div style={{ fontWeight: 600 }}>Properties For Sale</div>
//         <div>{project.PropertiesForSale || "N/A"}</div>
//       </div>
//     </div>
//   );
// }
// src/pages/Projects/ProjectsDetails.jsx
import React, { useEffect, useState, useMemo } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import SearchBar from "../../Utils/SearchBar.jsx";
import Table, { Pagination } from "../../Utils/Table.jsx";
import { Search } from "lucide-react";

import { useApi } from "../../API/Api.js";


const listParamTypes = {
  COMPANY: "Companies",
  PROJECTS: "Projects",
  PROPERTIES: "Properties",
};

// ---------- Simple Modal ----------
function SimpleModal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#fff",
          padding: 24,
          borderRadius: 8,
          minWidth: 320,
          maxWidth: 600,
          maxHeight: "80vh",
          //overflowY: "auto",
          boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ---------- Modal for Project Details ----------
function ProjectDetailsModal({ open, onClose, project, TableComponent }) {
  if (!project) return null;
  const modalColumns = [
    { label: "Type", key: "PropertyType" },
    { label: "Status", key: "PropertyStatus" },
    { label: "Bedrooms", key: "Bedrooms" },
    { label: "Facing", key: "Facing" },
  ];
  return (
    <SimpleModal open={open} onClose={onClose}>
      <h2 style={{ marginTop: 0, marginBottom: 12, color: "#22253b" }}>
        {project.ProjectName || project.projectname}
      </h2>
      <div>
        <strong>Description:</strong>{" "}
        {project.Description || project.description || "Not specified"}
      </div>
      <div>
        <strong>Price Range:</strong>{" "}
        {project.AmountWithUnit || project.amountwithunit || "N/A"}
      </div>
      <div style={{ marginTop: 18 }}>
        <TableComponent
          columns={modalColumns}
          paginatedData={[project]}
          rowsPerPage={1}
        />
      </div>
    </SimpleModal>
  );
}

// ---------- Main Component ----------

export default function ProjectsDetails() {
  const { fetchData } = useApi();

  const [activeTab, setActiveTab] = useState("COMPANY");

  const { fetchData } = useApi();

  const [activeTab, setActiveTab] = useState(defaultTabFromDashboard);

  const [companyData, setCompanyData] = useState([]);
  const [projectsData, setProjectsData] = useState([]);
  const [propertiesData, setPropertiesData] = useState([]);

  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companySidebarOpen, setCompanySidebarOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [openFilter, setOpenFilter] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [projectSidebarOpen, setProjectSidebarOpen] = useState(false);


  // search + pagination + filters
  const [searchQuery, setSearchQuery] = useState("");
  const rowsPerPage = 15;
  const [companyPage, setCompanyPage] = useState(1);
  const [projectPage, setProjectPage] = useState(1);
  const [propertyPage, setPropertyPage] = useState(1);

  // ---------- Fetch All Data ----------

  // fetch all three datasets on mount

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([fetchData("Company_Data"), fetchData("Projectdata"), fetchData("property_Data_Info")])
      .then(([companyRes, projectRes, propertyRes]) => {
        const cData = Array.isArray(companyRes) ? companyRes : companyRes || [];
        const pData = Array.isArray(projectRes) ? projectRes : projectRes || [];
        const prData = Array.isArray(propertyRes) ? propertyRes : propertyRes || [];

        setCompanyData(cData);
        setProjectsData(pData);
        setPropertiesData(prData);

        // initial filtered = full
        setFilteredCompanies(cData);
        setFilteredProjects(pData);
        setFilteredProperties(prData);
      })
      .catch((err) => {
        setError(err?.message || "Error loading data");
        setCompanyData([]);
        setProjectsData([]);
        setPropertiesData([]);
        setFilteredCompanies([]);
        setFilteredProjects([]);
        setFilteredProperties([]);
      })
      .finally(() => setLoading(false));
  }, [fetchData]);

  // ---------- Search ----------

  // search across dataset -> update filtered lists

  useEffect(() => {
    if (!searchQuery) {
      setFilteredCompanies(companyData);
      setFilteredProjects(projectsData);
      setFilteredProperties(propertiesData);
      return;
    }
    const lower = searchQuery.toLowerCase();

    const filterByFields = (data, matchFields = []) =>
      (data || []).filter((item) =>
        matchFields.some((f) => item[f] && String(item[f]).toLowerCase().includes(lower))
      );

    setFilteredCompanies(filterByFields(companyData, ["CompanyName", "CompanyID", "ReraNumber"]));
    setFilteredProjects(filterByFields(projectsData, ["ProjectName", "ProjectID", "ReraNumber"]));
    setFilteredProperties(filterByFields(propertiesData, ["PropertyName", "PropertyID", "ReraNumber"]));
  }, [searchQuery, companyData, projectsData, propertiesData]);

  // ---------- Filter Helpers ----------
  const toggleFilter = (key) => {
    setOpenFilter((prev) => (prev === key ? null : key));
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

  const clearFilter = (key) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
    setOpenFilter(null);
  };

  const applyFilter = () => {
    let source =
      activeTab === TABS.COMPANY
        ? companyData
        : activeTab === TABS.PROJECTS
        ? projectsData
        : propertiesData;

    const filtered = source.filter((item) =>
      Object.entries(filters).every(([key, values]) =>
        !values.length ? true : values.includes(item[key])
      )
    );

    if (activeTab === TABS.COMPANY) setFilteredCompanies(filtered);
    else if (activeTab === TABS.PROJECTS) setFilteredProjects(filtered);
    else setFilteredProperties(filtered);

    setOpenFilter(null);
  };

  const uniqueValues = (key) => {
    let source =
      activeTab === TABS.COMPANY
        ? filteredCompanies
        : activeTab === TABS.PROJECTS
        ? filteredProjects
        : filteredProperties;
    return Array.from(
      new Set(source.map((item) => item[key]).filter((val) => val != null))
    );
  };

  // ---------- Columns ----------
  const companyColumns = [
    { label: "S.No", key: "serialNo", canFilter: false },
    { label: "Company Name", key: "CompanyName" },
    { label: "Projects", key: "TotalProjects" },
    { label: "Operating Cities", key: "OperatingCities", render: (val) => {
        if (!val) return "N/A";
        const cities = val.split(",").map((city) => city.trim());
        if (cities.length <= 2) return val;
        const visible = cities.slice(0, 2).join(", ");
        const remaining = cities.slice(2).join(", ");
        return <span title={remaining}>{visible}, ...</span>;
      }, },
    { label: "Operating Since", key: "OperatingYear" },
    { label: "Ready To Move", key: "ReadyToMove" },
    { label: "Under Construction", key: "UnderConstruction" },
  ];

  const projectColumns = [
    { label: "S.No", key: "serialNo", canFilter: false },
    { label: "Project Name", key: "ProjectName" },
    { label: "Project ID", key: "ProjectID" },
    { label: "Custom Type", key: "CustomProjectTypes" },
    { label: "Status", key: "ProjectStatus" },
    { label: "Locality", key: "Locality" },
  ];

  const propertyColumns = [
    { label: "S.No", key: "serialNo", canFilter: false },
    { label: "Project Name", key: "projectname" },
    { label: "Property ID", key: "PropertyID" },
    { label: "Property Name", key: "PropertyName" },
    {
      label: "Price",
      key: "AmountWithUnit",
      render: (val) =>
        val ? (String(val).includes("₹") ? val : `₹ ${val}`) : "-",
    },
    { label: "Type", key: "PropertyType" },
    { label: "Status", key: "propertystatus" },
    { label: "Bedrooms", key: "Bedrooms" },
    { label: "Facing", key: "Facing" },
  ];

  // ---------- Pick Data for Current Tab ----------
  let currentData, currentColumns;
  if (activeTab === TABS.COMPANY) {
    currentData = filteredCompanies;
    currentColumns = companyColumns;
  } else if (activeTab === TABS.PROJECTS) {
    currentData = filteredProjects;
    currentColumns = projectColumns;
  } else {
    currentData = filteredProperties;
    currentColumns = propertyColumns;
  }

  // reset page & sidebars when active tab changes
  useEffect(() => {
    if (activeTab === "COMPANY") setCompanyPage(1);
    else if (activeTab === "PROJECTS") setProjectPage(1);
    else setPropertyPage(1);


    setCompanySidebarOpen(false);
    setProjectSidebarOpen(false);
  }, [activeTab]);

  // reset page when filtered data for the active tab changes
  useEffect(() => {
    if (activeTab === "COMPANY") setCompanyPage(1);
  }, [filteredCompanies, activeTab]);

  // ---------- Render ----------
  return (
    <div style={{ display: "flex", backgroundColor: "#fff" }}>
      <div style={{ flexShrink: 0 }}>
        <Sidebar />
      </div>

      <div
        style={{
          flex: 1,
          padding: 20,
          marginLeft: "180px",
          minHeight: "100vh",
        }}
      >
        {/* Back button and heading (stacked vertically) */}
        {fromDashboard && (
          <div style={{ marginBottom: 10 }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: 8,
                padding: "6px 14px",
                cursor: "pointer",
                fontSize: "0.8rem",
                color: "#121212",
                marginBottom: 6,
              }}
            >
              Back
            </button>
            <h2
              style={{
                color: "#222",
                fontSize: "1.2rem",
                fontWeight: 600,
                margin: 0,
              }}
            >
              Projects Details
            </h2>
          </div>
        )}

        {/* Tabs and Search */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <div style={{ display: "flex", gap: 4 }}>
            {Object.entries(TABS).map(([key, val]) => {
              const label = key.charAt(0) + key.slice(1).toLowerCase();
              const isActive = activeTab === val;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setActiveTab(val);
                    setPage(1);
                  }}

  useEffect(() => {
    if (activeTab === "PROJECTS") setProjectPage(1);
  }, [filteredProjects, activeTab]);

  useEffect(() => {
    if (activeTab === "PROPERTIES") setPropertyPage(1);
  }, [filteredProperties, activeTab]);

  // ---------- Columns (use plain string labels so Table.jsx's filter logic won't error) ----------
  // Table.jsx will still render the funnel icon and dropdown for filterable columns.
  const companyColumns = [
    { label: "S.No", key: "serialNo", render: (_, __, idx) => (companyPage - 1) * rowsPerPage + idx + 1 },
    { label: "Company Name", key: "CompanyName" },
    { label: "No.of Projects", key: "TotalProjects" },
    {
      label: "Operating Cities",
      key: "OperatingCities",
      render: (val) => {
        if (!val) return "N/A";
        const cities = String(val).split(",").map((c) => c.trim());
        if (cities.length <= 2) return String(val);
        return <span title={cities.slice(2).join(", ")}>{cities.slice(0, 2).join(", ")}, ...</span>;
      },
    },
    {
      label: "Operating Since",
      key: "OperatingYear",
      render: (val) => {
        if (!val) return "N/A";
        return String(val).split("-")[0] || String(val);
      },
    },
    { label: "ReadyToMove", key: "ReadyToMove" },
    { label: "UnderConstruction", key: "UnderConstruction" },
    {
      label: "More",
      key: "more",
      canFilter: false,
      render: (_, company) => (
        <button
          onClick={() => {
            setSelectedCompany(company);
            setCompanySidebarOpen(true);
          }}
          style={{
            backgroundColor: "#121212",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            padding: "6px 12px",
            cursor: "pointer",
          }}
        >
          More
        </button>
      ),
    },
  ];

  const projectColumns = [
    { label: "S.No", key: "serialNo", render: (_, __, idx) => (projectPage - 1) * rowsPerPage + idx + 1 },
    { label: "Project Name", key: "ProjectName" },
    { label: "Project Status", key: "ProjectStatus" },
    { label: "Custom Project Types", key: "CustomProjectTypes" },
    { label: "Locality", key: "Locality" },
    {
      label: "More",
      key: "more",
      canFilter: false,
      render: (_, project) => (
        <button
          onClick={() => {
            setSelectedProject(project);
            setProjectSidebarOpen(true);
          }}
          style={{
            backgroundColor: "#121212",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            padding: "6px 12px",
            cursor: "pointer",
          }}
        >
          More
        </button>
      ),
    },
  ];

  const propertyColumns = [
    { label: "S.No", key: "serialNo", render: (_, __, idx) => (propertyPage - 1) * rowsPerPage + idx + 1 },
    { label: "Project Name", key: "projectname" },
    { label: "Property ID", key: "PropertyID" },
    { label: "Property Name", key: "PropertyName" },
    { label: "Price", key: "AmountWithUnit" },
    { label: "Type", key: "PropertyType" },
    { label: "Status", key: "propertystatus" },
    { label: "Bedrooms", key: "Bedrooms" },
    { label: "Facing", key: "Facing" },
  ];

  // choose current data & columns & page set
  let currentColumns = companyColumns;
  let currentData = filteredCompanies;
  let currentPage = companyPage;
  let setCurrentPage = setCompanyPage;

  if (activeTab === "PROJECTS") {
    currentColumns = projectColumns;
    currentData = filteredProjects;
    currentPage = projectPage;
    setCurrentPage = setProjectPage;
  } else if (activeTab === "PROPERTIES") {
    currentColumns = propertyColumns;
    currentData = filteredProperties;
    currentPage = propertyPage;
    setCurrentPage = setPropertyPage;
  }

  // slice for table's paginatedData
  const currentPaginated = currentData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className="dashboard-container" style={{ display: "flex", backgroundColor: "#fff" }}>
      <Sidebar />
      <div style={{ flex: 1, position: "relative", minHeight: "100vh", padding: 24, boxSizing: "border-box", marginLeft: "180px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontWeight: 400 }}>Listing Data</h2>
          <div style={{ fontWeight: "bold", fontSize: "1.1rem", color: "#d4af37" }}>Kiran Reddy Pallaki</div>
        </div>

        {/* Tabs + Global Search */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 4 }}>
            {Object.keys(listParamTypes).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}

                  style={{
                    padding: "8px 15px",
                    fontWeight: isActive ? 600 : 500,
                    fontSize: "13px",
                    border: "none",
                    backgroundColor: isActive ? "#fff" : "#f0f0f0",
                    color: isActive ? "#2c3e50" : "#666",
                    cursor: "pointer",
                    padding: "6px 9px",
                    fontSize: "12px",
                    fontWeight: isActive ? 600 : 500,
                    borderBottom: isActive
                      ? "3px solid #2c3e50"
                      : "3px solid transparent",
                    borderTopLeftRadius: 3,
                    borderTopRightRadius: 3,

                    cursor: "pointer",
                    borderBottom: isActive ? "3px solid #2c3e50" : "3px solid transparent",
                    transition: "background-color 0.2s ease",

                  }}
                >
                  {listParamTypes[tab]}
                </button>
              );
            })}
          </div>

          <div style={{ position: "relative", width: 200}}>
            <Search
              size={16}
              color="#adb1bd"
              style={{
                position: "absolute",
                left: 9,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "170px",
                padding: "8px 12px 8px 34px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                fontSize: 14,
                background: "#f9fafb",
                color: "#111827",
              }}
            />
          </div>
        </div>

        {/* Table and Pagination */}
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: "red" }}>Error: {error}</p>
        ) : (
          <>
            <Table
              columns={currentColumns}
              paginatedData={paginatedData}
              page={page}
              rowsPerPage={rowsPerPage}

          <div style={{ minWidth: 150, maxWidth: 360, flex: "0 1 auto" }}>
            <SearchBar value={searchQuery} onChange={setSearchQuery} onSubmit={() => {}} />
          </div>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && (
          <>
            <Table
              columns={currentColumns}
              paginatedData={currentPaginated}
              rowsPerPage={rowsPerPage}
              page={currentPage}
              // pass dataset-aware uniqueValues function required by Table
              uniqueValues={(key) => {
                // choose dataset depending on current tab
                const ds = activeTab === "COMPANY" ? companyData : activeTab === "PROJECTS" ? projectsData : propertiesData;
                return uniqueValues(key, ds);
              }}

              openFilter={openFilter}
              toggleFilter={toggleFilter}
              filters={filters}
              handleCheckboxChange={handleCheckboxChange}
              uniqueValues={uniqueValues}

              clearFilter={clearFilter}
              applyFilter={applyFilter}
              searchValue={filterSearchValue}
              setSearchValue={setFilterSearchValue}
              onRowClick={() => {}}
            />

            <Pagination
              page={currentPage}
              setPage={setCurrentPage}
              totalPages={Math.ceil(currentData.length / rowsPerPage)}
            />
          </>
        )}

        {/* Modal */}
        <ProjectDetailsModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          project={selectedProject}
          TableComponent={Table}
        />

        {/* Sidebars */}
        <CompanyDetailsSidebar open={companySidebarOpen} onClose={() => setCompanySidebarOpen(false)} company={selectedCompany} />
        <ProjectDetailsSidebar open={projectSidebarOpen} onClose={() => setProjectSidebarOpen(false)} project={selectedProject} />
      </div>
    </div>
  );
}

/* -------------------- Sidebars (unchanged) -------------------- */

function CompanyDetailsSidebar({ open, onClose, company }) {
  if (!open || !company) return null;
  return (
    <div style={{
      position: "fixed", top: 0, right: 0, width: "350px", height: "100vh",
      backgroundColor: "white", boxShadow: "-2px 0 8px rgba(0,0,0,0.1)", padding: 20, zIndex: 10000, overflowY: "auto",
      transition: "transform 0.3s ease", transform: open ? "translateX(0)" : "translateX(100%)"
    }}>
      <button onClick={onClose} style={{ marginBottom: 12, backgroundColor: "#d4af37", color: "white", border: "none", borderRadius: 4, padding: "6px 12px", cursor: "pointer", float: "right" }}>
        Close
      </button>
      <h2 style={{ marginTop: 0, marginBottom: 12 }}>{company.CompanyName}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 10px", alignItems: "center" }}>
        <div style={{ fontWeight: 600 }}>Company Short Name</div><div>{company.CompanyShortName || "N/A"}</div>
        <div style={{ fontWeight: 600 }}>Address 1</div><div>{company.Address1 || "N/A"}</div>
        <div style={{ fontWeight: 600 }}>Address 2</div><div>{company.Address2 || "N/A"}</div>
        <div style={{ fontWeight: 600 }}>Locality</div><div>{company.Locality || "N/A"}</div>
        <div style={{ fontWeight: 600 }}>Tier</div><div>{company.Tier || "N/A"}</div>
        <div style={{ fontWeight: 600 }}>Operating Since</div><div>{company.OperatingSince ? company.OperatingSince.split("T")[0] : "N/A"}</div>
        <div style={{ fontWeight: 600 }}>Operating Cities</div><div>{company.OperatingCities || "N/A"}</div>
      </div>
    </div>
  );
}

function ProjectDetailsSidebar({ open, onClose, project }) {
  if (!open || !project) return null;
  return (
    <div style={{
      position: "fixed", top: 0, right: 0, width: "450px", maxWidth: "90vw", height: "100vh",
      backgroundColor: "white", boxShadow: "-2px 0 8px rgba(0,0,0,0.1)", padding: 20, zIndex: 10000, overflowY: "auto",
      transition: "transform 0.3s ease", transform: open ? "translateX(0)" : "translateX(100%)"
    }}>
      <button onClick={onClose} style={{ marginBottom: 12, backgroundColor: "#d4af37", color: "white", border: "none", borderRadius: 4, padding: "6px 12px", cursor: "pointer", float: "right" }}>
        Close
      </button>
      <h2 style={{ marginTop: 0, color: "#d4af37", marginBottom: 12 }}>{project.ProjectName}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 10px", alignItems: "center" }}>
        <div style={{ fontWeight: 600 }}>Company Name</div><div>{project.CompanyName || "N/A"}</div>
        <div style={{ fontWeight: 600 }}>Project ID</div><div>{project.ProjectID || "N/A"}</div>
        <div style={{ fontWeight: 600 }}>Project Status</div><div>{project.ProjectStatus || "N/A"}</div>
        <div style={{ fontWeight: 600 }}>Custom Project Types</div><div>{project.CustomProjectTypes || "N/A"}</div>
        <div style={{ fontWeight: 600 }}>Locality</div><div>{project.Locality || "N/A"}</div>

      </div>
    </div>
  );
}
