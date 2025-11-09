//  import React, { useEffect, useState, useMemo } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import Sidebar from "../../components/Sidebar.jsx";
// import { useApi } from "../../API/Api.js";
// import Table, { Pagination } from "../../Utils/Table.jsx";
// import { Search } from "lucide-react";

// const TABS = {
//   COMPANY: "company",
//   PROJECTS: "projects",
//   PROPERTIES: "properties",
// };

// // ---------- Simple Modal ----------
// function SimpleModal({ open, onClose, children }) {
//   if (!open) return null;
//   return (
//     <div
//       style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         backgroundColor: "rgba(0,0,0,0.5)",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         zIndex: 9999,
//       }}
//       onClick={onClose}
//     >
//       <div
//         onClick={(e) => e.stopPropagation()}
//         style={{
//           backgroundColor: "#fff",
//           padding: 24,
//           borderRadius: 8,
//           minWidth: 320,
//           maxWidth: 600,
//           maxHeight: "80vh",
//           //overflowY: "auto",
//           boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
//         }}
//       >
//         {children}
//       </div>
//     </div>
//   );
// }

// // ---------- Modal for Project Details ----------
// function ProjectDetailsModal({ open, onClose, project, TableComponent }) {
//   if (!project) return null;
//   const modalColumns = [
//     { label: "Type", key: "PropertyType" },
//     { label: "Status", key: "PropertyStatus" },
//     { label: "Bedrooms", key: "Bedrooms" },
//     { label: "Facing", key: "Facing" },
//   ];
//   return (
//     <SimpleModal open={open} onClose={onClose}>
//       <h2 style={{ marginTop: 0, marginBottom: 12, color: "#22253b" }}>
//         {project.ProjectName || project.projectname}
//       </h2>
//       <div>
//         <strong>Description:</strong>{" "}
//         {project.Description || project.description || "Not specified"}
//       </div>
//       <div>
//         <strong>Price Range:</strong>{" "}
//         {project.AmountWithUnit || project.amountwithunit || "N/A"}
//       </div>
//       <div style={{ marginTop: 18 }}>
//         <TableComponent
//           columns={modalColumns}
//           paginatedData={[project]}
//           rowsPerPage={1}
//         />
//       </div>
//     </SimpleModal>
//   );
// }

// // ---------- Main Component ----------
// export default function ProjectsDetails() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const defaultTabFromDashboard = location.state?.defaultTab || TABS.COMPANY;
//   const fromDashboard = location.state?.fromDashboard || false;

//   const { fetchData } = useApi();

//   const [activeTab, setActiveTab] = useState(defaultTabFromDashboard);
//   const [companyData, setCompanyData] = useState([]);
//   const [projectsData, setProjectsData] = useState([]);
//   const [propertiesData, setPropertiesData] = useState([]);
//   const [filteredCompanies, setFilteredCompanies] = useState([]);
//   const [filteredProjects, setFilteredProjects] = useState([]);
//   const [filteredProperties, setFilteredProperties] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filters, setFilters] = useState({});
//   const [openFilter, setOpenFilter] = useState(null);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const [page, setPage] = useState(1);
//   const rowsPerPage = 15;

//   // ---------- Fetch All Data ----------
//   useEffect(() => {
//     setLoading(true);
//     setError(null);
//     Promise.all([
//       fetchData("Company_Data"),
//       fetchData("Projectdata"),
//       fetchData("property_Data_Info"),
//     ])
//       .then(([cRes, pRes, prRes]) => {
//         setCompanyData(cRes || []);
//         setProjectsData(pRes || []);
//         setPropertiesData(prRes || []);
//         setFilteredCompanies(cRes || []);
//         setFilteredProjects(pRes || []);
//         setFilteredProperties(prRes || []);
//       })
//       .catch((err) => setError(err.message || "Error loading data"))
//       .finally(() => setLoading(false));
//   }, [fetchData]);

//   // ---------- Search ----------
//   useEffect(() => {
//     const lower = searchQuery.trim().toLowerCase();
//     if (!lower) {
//       setFilteredCompanies(companyData);
//       setFilteredProjects(projectsData);
//       setFilteredProperties(propertiesData);
//       return;
//     }
//     const filterBySearch = (data, keys) =>
//       data.filter((item) =>
//         keys.some(
//           (key) =>
//             item[key] && item[key].toString().toLowerCase().includes(lower)
//         )
//       );
//     setFilteredCompanies(
//       filterBySearch(companyData, ["CompanyName", "CompanyID"])
//     );
//     setFilteredProjects(
//       filterBySearch(projectsData, ["ProjectName", "ProjectID"])
//     );
//     setFilteredProperties(
//       filterBySearch(propertiesData, ["PropertyName", "PropertyID"])
//     );
//   }, [searchQuery, companyData, projectsData, propertiesData]);

//   // ---------- Filter Helpers ----------
//   const toggleFilter = (key) => {
//     setOpenFilter((prev) => (prev === key ? null : key));
//   };

//   const handleCheckboxChange = (key, value) => {
//     setFilters((prev) => {
//       const prevVals = prev[key] || [];
//       const newVals = prevVals.includes(value)
//         ? prevVals.filter((v) => v !== value)
//         : [...prevVals, value];
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
//     let source =
//       activeTab === TABS.COMPANY
//         ? companyData
//         : activeTab === TABS.PROJECTS
//         ? projectsData
//         : propertiesData;

//     const filtered = source.filter((item) =>
//       Object.entries(filters).every(([key, values]) =>
//         !values.length ? true : values.includes(item[key])
//       )
//     );

//     if (activeTab === TABS.COMPANY) setFilteredCompanies(filtered);
//     else if (activeTab === TABS.PROJECTS) setFilteredProjects(filtered);
//     else setFilteredProperties(filtered);

//     setOpenFilter(null);
//   };

//   const uniqueValues = (key) => {
//     let source =
//       activeTab === TABS.COMPANY
//         ? filteredCompanies
//         : activeTab === TABS.PROJECTS
//         ? filteredProjects
//         : filteredProperties;
//     return Array.from(
//       new Set(source.map((item) => item[key]).filter((val) => val != null))
//     );
//   };

//   // ---------- Columns ----------
//   const companyColumns = [
//     { label: "S.No", key: "serialNo", canFilter: false },
//     { label: "Company Name", key: "CompanyName" },
//     { label: "Projects", key: "TotalProjects" },
//     { label: "Operating Cities", key: "OperatingCities", render: (val) => {
//         if (!val) return "N/A";
//         const cities = val.split(",").map((city) => city.trim());
//         if (cities.length <= 2) return val;
//         const visible = cities.slice(0, 2).join(", ");
//         const remaining = cities.slice(2).join(", ");
//         return <span title={remaining}>{visible}, ...</span>;
//       }, },
//     { label: "Operating Since", key: "OperatingYear" },
//     { label: "Ready To Move", key: "ReadyToMove" },
//     { label: "Under Construction", key: "UnderConstruction" },
//   ];

//   const projectColumns = [
//     { label: "S.No", key: "serialNo", canFilter: false },
//     { label: "Project Name", key: "ProjectName" },
//     { label: "Project ID", key: "ProjectID" },
//     { label: "Custom Type", key: "CustomProjectTypes" },
//     { label: "Status", key: "ProjectStatus" },
//     { label: "Locality", key: "Locality" },
//   ];

//   const propertyColumns = [
//     { label: "S.No", key: "serialNo", canFilter: false },
//     { label: "Project Name", key: "projectname" },
//     { label: "Property ID", key: "PropertyID" },
//     { label: "Property Name", key: "PropertyName" },
//     {
//       label: "Price",
//       key: "AmountWithUnit",
//       render: (val) =>
//         val ? (String(val).includes("₹") ? val : `₹ ${val}`) : "-",
//     },
//     { label: "Type", key: "PropertyType" },
//     { label: "Status", key: "propertystatus" },
//     { label: "Bedrooms", key: "Bedrooms" },
//     { label: "Facing", key: "Facing" },
//   ];

//   // ---------- Pick Data for Current Tab ----------
//   let currentData, currentColumns;
//   if (activeTab === TABS.COMPANY) {
//     currentData = filteredCompanies;
//     currentColumns = companyColumns;
//   } else if (activeTab === TABS.PROJECTS) {
//     currentData = filteredProjects;
//     currentColumns = projectColumns;
//   } else {
//     currentData = filteredProperties;
//     currentColumns = propertyColumns;
//   }

//   const paginatedData = useMemo(() => {
//     const start = (page - 1) * rowsPerPage;
//     return currentData.slice(start, start + rowsPerPage);
//   }, [currentData, page]);

//   const totalPages = Math.ceil(currentData.length / rowsPerPage);

//   // ---------- Render ----------
//   return (
//     <div style={{ display: "flex", backgroundColor: "#fff" }}>
//       <div style={{ flexShrink: 0 }}>
//         <Sidebar />
//       </div>

//       <div
//         style={{
//           flex: 1,
//           padding: 20,
//           marginLeft: "180px",
//           minHeight: "100vh",
//         }}
//       >
//         {/* Back button and heading (stacked vertically) */}
//         {fromDashboard && (
//           <div style={{ marginBottom: 10 }}>
//             <button
//               onClick={() => navigate(-1)}
//               style={{
//                 background: "#fff",
//                 border: "1px solid #ccc",
//                 borderRadius: 8,
//                 padding: "6px 14px",
//                 cursor: "pointer",
//                 fontSize: "0.8rem",
//                 color: "#121212",
//                 marginBottom: 6,
//               }}
//             >
//               Back
//             </button>
//             <h2
//               style={{
//                 color: "#222",
//                 fontSize: "1.2rem",
//                 fontWeight: 600,
//                 margin: 0,
//               }}
//             >
//               Projects Details
//             </h2>
//           </div>
//         )}

//         {/* Tabs and Search */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginBottom: 14,
//           }}
//         >
//           <div style={{ display: "flex", gap: 4 }}>
//             {Object.entries(TABS).map(([key, val]) => {
//               const label = key.charAt(0) + key.slice(1).toLowerCase();
//               const isActive = activeTab === val;
//               return (
//                 <button
//                   key={key}
//                   onClick={() => {
//                     setActiveTab(val);
//                     setPage(1);
//                   }}
//                   style={{
//                     backgroundColor: isActive ? "#fff" : "#f0f0f0",
//                     color: isActive ? "#2c3e50" : "#666",
//                     border: "none",
//                     cursor: "pointer",
//                     padding: "6px 9px",
//                     fontSize: "12px",
//                     fontWeight: isActive ? 600 : 500,
//                     borderBottom: isActive
//                       ? "3px solid #2c3e50"
//                       : "3px solid transparent",
//                     borderTopLeftRadius: 3,
//                     borderTopRightRadius: 3,
//                   }}
//                 >
//                   {label}
//                 </button>
//               );
//             })}
//           </div>

//           <div style={{ position: "relative", width: 200}}>
//             <Search
//               size={16}
//               color="#adb1bd"
//               style={{
//                 position: "absolute",
//                 left: 9,
//                 top: "50%",
//                 transform: "translateY(-50%)",
//               }}
//             />
//             <input
//               type="text"
//               placeholder="Search"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               style={{
//                 width: "170px",
//                 padding: "8px 12px 8px 34px",
//                 borderRadius: 8,
//                 border: "1px solid #e5e7eb",
//                 fontSize: 14,
//                 background: "#f9fafb",
//                 color: "#111827",
//               }}
//             />
//           </div>
//         </div>

//         {/* Table and Pagination */}
//         {loading ? (
//           <p>Loading...</p>
//         ) : error ? (
//           <p style={{ color: "red" }}>Error: {error}</p>
//         ) : (
//           <>
//             <Table
//               columns={currentColumns}
//               paginatedData={paginatedData}
//               page={page}
//               rowsPerPage={rowsPerPage}
//               openFilter={openFilter}
//               toggleFilter={toggleFilter}
//               filters={filters}
//               handleCheckboxChange={handleCheckboxChange}
//               uniqueValues={uniqueValues}
//               clearFilter={clearFilter}
//               applyFilter={applyFilter}
//               onRowClick={(row) => {
//                 setSelectedProject(row);
//                 setModalOpen(true);
//               }}
//             />
//             {totalPages > 1 && (
//               <Pagination page={page} setPage={setPage} totalPages={totalPages} />
//             )}
//           </>
//         )}

//         {/* Modal */}
//         <ProjectDetailsModal
//           open={modalOpen}
//           onClose={() => setModalOpen(false)}
//           project={selectedProject}
//           TableComponent={Table}
//         />
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import SearchBar from "../../Utils/SearchBar.jsx";
import Table, { Pagination } from "../../Utils/Table.jsx";
import { useApi } from "../../API/Api.js";
import { Eye } from "lucide-react";

const listParamTypes = {
  COMPANY: "Companies",
  PROJECTS: "Projects",
  PROPERTIES: "Properties",
};

export default function ProjectsDetails() {
  const { fetchData } = useApi();

  const [activeTab, setActiveTab] = useState("COMPANY");

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
  const [projectSidebarOpen, setProjectSidebarOpen] = useState(false);

  // Pagination and search
  const rowsPerPage = 10;
  const [companyPage, setCompanyPage] = useState(1);
  const [projectPage, setProjectPage] = useState(1);
  const [propertyPage, setPropertyPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Filters if applicable (example structure)
  const [filters, setFilters] = useState({});
  const [openFilter, setOpenFilter] = useState(null);

  const toggleFilter = (key) => {
    setOpenFilter((prev) => (prev === key ? null : key));
  };

  // Checkbox filter handler example
  const handleCheckboxChange = (key, value) => {
    setFilters((prev) => {
      const prevVals = prev[key] || [];
      return {
        ...prev,
        [key]: prevVals.includes(value)
          ? prevVals.filter((v) => v !== value)
          : [...prevVals, value],
      };
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

  // Apply filters; update filtered data arrays based on current filters
  const applyFilter = () => {
    const filterData = (data) =>
      data.filter((item) =>
        Object.entries(filters).every(([key, values]) => {
          if (!values || values.length === 0) return true;
          const itemVal = item[key];
          if (typeof itemVal === "string") {
            // If filter value is in a comma-separated string value, check includes
            const arr = itemVal.split(",").map((s) => s.trim());
            return values.some((v) => arr.includes(v));
          }
          return values.includes(itemVal);
        })
      );

    setFilteredCompanies(filterData(companyData));
    setFilteredProjects(filterData(projectsData));
    setFilteredProperties(filterData(propertiesData));
    setCompanyPage(1);
    setProjectPage(1);
    setPropertyPage(1);
    setOpenFilter(null);
  };

  // Unique values helper for filters
  const uniqueValues = (key, dataset) => {
    const vals = (dataset || []).map((item) => item[key]).filter((v) => v != null);
    if (key === "OperatingCities") {
      return Array.from(new Set(vals.flatMap((v) => String(v).split(",").map((s) => s.trim())))).filter(Boolean);
    }
    return Array.from(new Set(vals));
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([fetchData("Company_Data"), fetchData("Projectdata"), fetchData("property_Data_Info")])
      .then(([companyRes, projectRes, propertyRes]) => {
        const cData = Array.isArray(companyRes) ? companyRes : [];
        const pData = Array.isArray(projectRes) ? projectRes : [];
        const prData = Array.isArray(propertyRes) ? propertyRes : [];

        setCompanyData(cData);
        setProjectsData(pData);
        setPropertiesData(prData);

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

  // Handle search query changes to filter data accordingly
  useEffect(() => {
    if (!searchQuery) {
      setFilteredCompanies(companyData);
      setFilteredProjects(projectsData);
      setFilteredProperties(propertiesData);
      return;
    }
    const lower = searchQuery.toLowerCase();
    const filterByFields = (data, fields) =>
      (data || []).filter((item) =>
        fields.some((f) => item[f] && String(item[f]).toLowerCase().includes(lower))
      );

    setFilteredCompanies(filterByFields(companyData, ["CompanyName", "CompanyID", "ReraNumber"]));
    setFilteredProjects(filterByFields(projectsData, ["ProjectName", "ProjectID", "ReraNumber"]));
    setFilteredProperties(filterByFields(propertiesData, ["PropertyName", "PropertyID", "ReraNumber"]));
  }, [searchQuery, companyData, projectsData, propertiesData]);

  // Reset page on tab change and close sidebars
  useEffect(() => {
    if (activeTab === "COMPANY") setCompanyPage(1);
    else if (activeTab === "PROJECTS") setProjectPage(1);
    else setPropertyPage(1);
    setCompanySidebarOpen(false);
    setProjectSidebarOpen(false);
  }, [activeTab]);

  // Apply filters whenever they update
  useEffect(() => {
    applyFilter();
  }, [filters]);

  // Define columns for each tab
  const companyColumns = [
    { label: "S.No", key: "serialNo", render: (_, __, idx) => (companyPage - 1) * rowsPerPage + idx + 1 },
    { label: "Company Name", key: "CompanyName" },
    { label: "No.of Projects", key: "TotalProjects" },
    { label: "Operating Cities", key: "OperatingCities" },
    { label: "Operating Since", key: "OperatingYear" },
    { label: "ReadyToMove", key: "ReadyToMove" },
    { label: "UnderConstruction", key: "UnderConstruction" },
    {
      label: "More",
      key: "more",
      canFilter: false,
      render: (_, company) => (
        <Eye size={16} style={{ cursor: "pointer" }} title="More details" onClick={() => {
          setSelectedCompany(company);
          setCompanySidebarOpen(true);
        }} />
      )
    },
  ];

  const projectColumns = [
    { label: "S.No", key: "serialNo", render: (_, __, idx) => (projectPage - 1) * rowsPerPage + idx + 1 },
    { label: "ProjectID", key: "ProjectID" },
    { label: "Project Name", key: "ProjectName" },
    { label: "Project Status", key: "ProjectStatus" },
    { label: "RERA Number", key: "RERA" },
    { label: "Locality", key: "Locality" },
    {
      label: "More",
      key: "more",
      canFilter: false,
      render: (_, project) => (
        <Eye size={16} style={{ cursor: "pointer" }} title="More details" onClick={() => {
          setSelectedProject(project);
          setProjectSidebarOpen(true);
        }} />
      )
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

  // Select data and state depending on active tab
  let currentColumns, currentData, currentPage, setCurrentPage;
  switch (activeTab) {
    case "PROJECTS":
      currentColumns = projectColumns;
      currentData = filteredProjects;
      currentPage = projectPage;
      setCurrentPage = setProjectPage;
      break;
    case "PROPERTIES":
      currentColumns = propertyColumns;
      currentData = filteredProperties;
      currentPage = propertyPage;
      setCurrentPage = setPropertyPage;
      break;
    default: // COMPANY tab
      currentColumns = companyColumns;
      currentData = filteredCompanies;
      currentPage = companyPage;
      setCurrentPage = setCompanyPage;
  }

  // Paginate current data
  const currentPaginated = currentData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPageCount = Math.ceil(currentData.length / rowsPerPage);

  return (
    <div className="dashboard-container" style={{ display: "flex", backgroundColor: "#fff", height: "100vh", overflow: "hidden" }}>
      <Sidebar />
      <div style={{ flex: 1, position: "relative", maxHeight: "100vh", padding: 24, boxSizing: "border-box", marginLeft: "180px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontWeight: 600,fontSize:"1.05rem" }}>Listing Data</h2>
          <div style={{ fontWeight: "bold", fontSize: "1.1rem", color: "#d4af37" }}>Kiran Reddy Pallaki</div>
        </div>

        {/* Tabs + Global Search */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 16, flexWrap: "wrap", width: "100%" }}>
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
                    borderBottom: isActive ? "3px solid #2c3e50" : "3px solid transparent",
                    transition: "background-color 0.2s ease",
                  }}
                >
                  {listParamTypes[tab]}
                </button>
              );
            })}
          </div>

          <div style={{ minWidth: 150, flex: "0 1 auto" }}>
            <SearchBar value={searchQuery} onChange={setSearchQuery} onSubmit={() => { }} />
          </div>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && (
          <>
            <Table
              columns={currentColumns}
              paginatedData={currentPaginated}
              page={currentPage}
              setPage={setCurrentPage}
              rowsPerPage={rowsPerPage}
              totalCount={currentData.length}
              filters={filters}
              openFilter={openFilter}
              toggleFilter={toggleFilter}
              handleCheckboxChange={handleCheckboxChange}
              clearFilter={clearFilter}
              applyFilter={applyFilter}
              uniqueValues={(key) => uniqueValues(key, activeTab === "COMPANY" ? companyData : activeTab === "PROJECTS" ? projectsData : propertiesData)}
            />
            {/* <Pagination page={currentPage} setPage={setCurrentPage} totalPages={totalPageCount} /> */}
          </>
        )}

        {/* Sidebars for details */}
        {/* Placeholder for your sidebar components - provide these if needed */}
        {companySidebarOpen && selectedCompany && (
          <CompanyDetailsSidebar open={companySidebarOpen} onClose={() => setCompanySidebarOpen(false)} company={selectedCompany} />
        )}
        {projectSidebarOpen && selectedProject && (
          <ProjectDetailsSidebar open={projectSidebarOpen} onClose={() => setProjectSidebarOpen(false)} project={selectedProject} />
        )}
      </div>
    </div>
  );
}

// Define your sidebars or import as needed;
// minimal placeholders below:
function CompanyDetailsSidebar({ open, onClose, company }) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", right: 0, top: 0, width: 360, height: "100vh", background: "#fff", boxShadow: "-2px 0 10px rgba(0,0,0,0.1)", padding: 20 }}>
      <button onClick={onClose}>Close</button>
      <h3>{company.CompanyName}</h3>
      {/* render details */}
    </div>
  );
}

function ProjectDetailsSidebar({ open, onClose, project }) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", right: 0, top: 0, width: 460, height: "100vh", background: "#fff", boxShadow: "-2px 0 10px rgba(0,0,0,0.1)", padding: 20 }}>
      <button onClick={onClose}>Close</button>
      <h3>{project.ProjectName}</h3>
      {/* render details */}
    </div>
  );
}
