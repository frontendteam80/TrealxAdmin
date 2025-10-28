//  import React, { useEffect, useState } from "react";
// import Sidebar from "../../components/Sidebar.jsx";
// import { useApi } from "../../API/Api.js";
// import Table from "../../Utils/Table.jsx";
// import SearchBar from "../../Utils/SearchBar.jsx";
 
// export default function AgentDetails() {
//   const [agentDetails, setAgentDetails] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { fetchData } = useApi();
 
//   // Search state
//   const [searchTerm, setSearchTerm] = useState("");
 
//   // Filter state
//   const [filters, setFilters] = useState({
//     name: "",
//     location: "",
//     associatedPartner: "",
//     propertyType: ""
//   });
 
//   useEffect(() => {
//     async function load() {
//       try {
//         const data = await fetchData("CRMData");
//         const mappedData = (data || []).map((item, index) => ({
//           S_No: index + 1,
//           Name: item.Name,
//           MobileNumber: item.MobileNumber,
//           EMail: item.EMail,
//           Builder_CP_Agent: item.Builder_CP_Agent,
//           Locality: item.Locality,
//           PropertyTypes: item.PropertyTypes,
//           RefferedBy: item.RefferedBy,
//         }));
//         setAgentDetails(mappedData);
//         console.log("Agent Details:", mappedData);
//       } catch (err) {
//         setError(err.message || "Error loading AgentDetails");
//       } finally {
//         setLoading(false);
//       }
//     }
//     load();
//   }, [fetchData]);
 
//   // Table columns
//   const columns = [
//     { key: "S_No", label: "S.No" },
//     { key: "Name", label: "Name" },
//     { key: "MobileNumber", label: "Mobile Number" },
//     { key: "EMail", label: "Email" },
//     { key: "Builder_CP_Agent", label: "Associated Partner" },
//     { key: "Locality", label: "Locality" },
//     { key: "PropertyTypes", label: "Property Types" },
//     { key: "RefferedBy", label: "Referred By" },
//   ];
 
//   // Filtered data: search + selected filters
//   const filteredData = agentDetails.filter(item => {
//     if (
//       !searchTerm &&
//       // !filters.name &&
//       !filters.location &&
//       !filters.associatedPartner &&
//       !filters.propertyType
//     ) return true;
 
//     const lowerSearch = searchTerm.toLowerCase();
 
//     return (
//       // (!filters.name || item.Name === filters.name) &&
//       (!filters.location || item.Locality === filters.location) &&
//       (!filters.associatedPartner || item.Builder_CP_Agent === filters.associatedPartner) &&
//       (!filters.propertyType || item.PropertyTypes === filters.propertyType) &&
//       (
//         !searchTerm ||
//         item.Name?.toLowerCase().includes(lowerSearch) ||
//         item.Locality?.toLowerCase().includes(lowerSearch) ||
//         item.Builder_CP_Agent?.toLowerCase().includes(lowerSearch) ||
//         (item.S_No && item.S_No.toString().includes(lowerSearch))
//       )
//     );
//   });
 
//   if (error) return <div>Error: {error}</div>;
 
//   return (
//     <div className="dashboard-container" style={{ display: "flex", backgroundColor: "#fff" }}>
//       <Sidebar />
//       <div
//         className="buyers-content"
//         style={{
//           flex: 1,
//           position: "relative",
//           minHeight: "100vh",
//           overflowX: "auto",
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
//           <h2 style={{ margin: 0 }}>CRM Data</h2>
//           <div style={{ fontWeight: "bold", fontSize: "1.1rem", color: "#d4af37" }}>
//             Kiran Reddy Pallaki
//           </div>
//         </div>
 
//         {/* Search + Filter Controls */}
//         <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
//           <SearchBar
//             value={searchTerm}
//             onChange={setSearchTerm}
//             onSubmit={() => console.log("Search triggered for:", searchTerm)}
//           />
 
//           {/* <select
//             onChange={e => setFilters(f => ({ ...f, name: e.target.value }))}
//             value={filters.name}
//           >
//             <option value="">Agent Name</option>
//             {[...new Set(agentDetails.map(a => a.Name))].map(name => (
//               <option key={name} value={name}>{name}</option>
//             ))}
//           </select> */}
 
//           <select
//             onChange={e => setFilters(f => ({ ...f, location: e.target.value }))}
//             value={filters.location}
//           >
//             <option value="">Location</option>
//             {[...new Set(agentDetails.map(a => a.Locality))].map(loc => (
//               <option key={loc} value={loc}>{loc}</option>
//             ))}
//           </select>
 
//           <select
//             onChange={e => setFilters(f => ({ ...f, associatedPartner: e.target.value }))}
//             value={filters.associatedPartner}
//           >
//             <option value="">Associated Partner</option>
//             {[...new Set(agentDetails.map(a => a.Builder_CP_Agent))].map(partner => (
//               <option key={partner} value={partner}>{partner}</option>
//             ))}
//           </select>
 
//           <select
//             onChange={e => setFilters(f => ({ ...f, propertyType: e.target.value }))}
//             value={filters.propertyType}
//           >
//             <option value="">Property Type</option>
//             {[...new Set(agentDetails.map(a => a.PropertyTypes))].map(type => (
//               <option key={type} value={type}>{type}</option>
//             ))}
//           </select>
 
//           {/* Display Selected Filter Pills */}
//           <div style={{ display: "flex", gap: 8, marginLeft: 8, flexWrap: "wrap" }}>
//             {Object.entries(filters).map(([key, value]) =>
//               value ? (
//                 <span
//                   key={key}
//                   style={{
//                     background: "#d4af37",
//                     color: "#fff",
//                     borderRadius: 12,
//                     padding: "2px 8px",
//                     fontSize: "0.85rem",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 4,
//                     cursor: "default",
//                     height:"32"
//                   }}
//                 >
//                   {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
//                   <button
//                     onClick={() => setFilters(f => ({ ...f, [key]: "" }))}
//                     style={{
//                       background: "transparent",
//                       border: "none",
//                       color: "#fff",
//                       cursor: "pointer",
//                       fontWeight: "bold",
//                       fontSize: "1rem",
//                       lineHeight: 1,
//                     }}
//                     aria-label={`Remove ${key} filter`}
//                   >
//                     &times;
//                   </button>
//                 </span>
//               ) : null
//             )}
//           </div>
//         </div>
 
//         {/* Table or Loading */}
//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           <Table columns={columns} data={filteredData} rowsPerPage={15} />
//         )}
//       </div>
//     </div>
//   );
// }
 
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import { useApi } from "../../API/Api.js";
import Table from "../../Utils/Table.jsx";
import SearchBar from "../../Utils/SearchBar.jsx"; // import the reusable SearchBar
 
 
const TABS = {
  COMPANY: "company",
  PROJECTS: "projects",
  PROPERTIES: "properties"
};
 
 
function SimpleModal({ open, onClose, children }) {
  if (!open) return null;
 
  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: "#fff",
          padding: 24,
          borderRadius: 8,
          minWidth: 320,
          maxWidth: 600,
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "0 2px 12px rgba(0,0,0,0.3)"
        }}
      >
        {children}
      </div>
    </div>
  );
}
 
function ProjectDetailsModal({ open, onClose, project, TableComponent }) {
  if (!project) return null;
 
  const modalColumns = [
    { label: "Type", key: "PropertyType" },
    { label: "Status", key: "PropertyStatus" },
    { label: "Bedrooms", key: "Bedrooms" },
    { label: "Facing", key: "Facing" }
  ];
 
  return (
    <SimpleModal open={open} onClose={onClose}>
      <h2 style={{ marginTop: 0, marginBottom: 12, color: "#d4af37" }}>
        {project.ProjectName || project.projectname}
      </h2>
      <div><strong>Description:</strong> {project.Description || project.description || "Not specified"}</div>
      <div><strong>Price Range:</strong> {project.AmountWithUnit || project.amountwithunit || "N/A"}</div>
      <div style={{ marginTop: 18 }}>
        <TableComponent columns={modalColumns} data={[project]} rowsPerPage={1} />
      </div>
    </SimpleModal>
  );
}
 
 
export default function ProjectsDetails() {
  const [activeTab, setActiveTab] = useState(TABS.COMPANY);
 
  // Separate states for raw datasets
  const [companyData, setCompanyData] = useState([]);
  const [projectsData, setProjectsData] = useState([]);
  const [propertiesData, setPropertiesData] = useState([]);
 
  // Filtered data states
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
 
  const [searchQuery, setSearchQuery] = useState("");
  const { fetchData } = useApi();
 
  const companyColumns = [
    { label: "S.No", key: "serialNo", render: (_, __, idx) => idx + 1 },
    { label: "Company Name", key: "CompanyName" },
    { label: "No.of Projects", key: "Projects" },
    { label: "OperatingCities", key: "OperatingCities" },
    {
      label: "Operating Since", key: "OperatingSince",
      render: (val) => {
        if (!val) return "N/A";
        const year = val.toString().split("-")[0];
        return year || "N/A";
      }
    },
    { label: "ReadyToMove", key: "ReadyToMove" },
    { label: "UnderConstruction", key: "UnderConstruction" },
  ];
 
  const projectColumns = [
    { label: "S.No", key: "serialNo", render: (_, __, idx) => idx + 1 },
    { label: "Project Name", key: "ProjectName" },
    { label: "ProjectID", key: "ProjectID" },
    { label: "CustomProjectTypes", key: "CustomProjectTypes" },
    { label: "Status", key: "ProjectStatus" },
    { label: "Locality", key: "Locality" },
  ];
 
  const propertyColumns = [
    { label: "S.No", key: "serialNo", render: (_, __, idx) => idx + 1 },
    { label: "ProjectName", key: "projectname" },
    { label: "Property ID", key: "PropertyID" },
    { label: "Property Name", key: "PropertyName" },
    { label: "Price", key: "AmountWithUnit" },
    { label: "Type", key: "PropertyType" },
    { label: "Status", key: "propertystatus" },
    { label: "Bedrooms", key: "Bedrooms" },
    { label: "Facing", key: "Facing" }
  ];
 
  // Fetch all data once on mount
  useEffect(() => {
    setLoading(true);
    setError(null);
 
    Promise.all([
      fetchData("Company_Data"),
      fetchData("Projectdata"),
      fetchData("property_Data_Info")
    ])
      .then(([companyRes, projectRes, propertyRes]) => {
        const cData = companyRes || [];
        const pData = projectRes || [];
        const prData = propertyRes || [];
 
        setCompanyData(cData);
        setProjectsData(pData);
        setPropertiesData(prData);
 
        setFilteredCompanies(cData);
        setFilteredProjects(pData);
        setFilteredProperties(prData);
      })
      .catch(err => {
        setError(err.message || "Error loading data");
        setCompanyData([]);
        setProjectsData([]);
        setPropertiesData([]);
        setFilteredCompanies([]);
        setFilteredProjects([]);
        setFilteredProperties([]);
      })
      .finally(() => setLoading(false));
  }, [fetchData]);
 
  // Filter all datasets on search query change
  useEffect(() => {
    if (!searchQuery) {
      setFilteredCompanies(companyData);
      setFilteredProjects(projectsData);
      setFilteredProperties(propertiesData);
      return;
    }
    const lowerQuery = searchQuery.toLowerCase();
 
    const filterCompanies = companyData.filter(item =>
      (item.CompanyName && item.CompanyName.toLowerCase().includes(lowerQuery)) ||
      (item.CompanyID && item.CompanyID.toString().toLowerCase().includes(lowerQuery)) ||
      (item.ReraNumber && item.ReraNumber.toLowerCase().includes(lowerQuery))
    );
 
    const filterProjects = projectsData.filter(item =>
      (item.ProjectName && item.ProjectName.toLowerCase().includes(lowerQuery)) ||
      (item.ProjectID && item.ProjectID.toString().toLowerCase().includes(lowerQuery)) ||
      (item.ReraNumber && item.ReraNumber.toLowerCase().includes(lowerQuery))
    );
 
    const filterProperties = propertiesData.filter(item =>
      (item.PropertyName && item.PropertyName.toLowerCase().includes(lowerQuery)) ||
      (item.PropertyID && item.PropertyID.toString().toLowerCase().includes(lowerQuery)) ||
      (item.ReraNumber && item.ReraNumber.toLowerCase().includes(lowerQuery))
    );
 
    setFilteredCompanies(filterCompanies);
    setFilteredProjects(filterProjects);
    setFilteredProperties(filterProperties);
  }, [searchQuery, companyData, projectsData, propertiesData]);
 
  // Decide which filtered data and columns to show based on active tab
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
 
  return (
    <div className="dashboard-container" style={{ display: "flex", backgroundColor: "#fff" }}>
      <Sidebar />
      <div
        className="buyers-content"
        style={{
          flex: 1,
          position: "relative",
          minHeight: "100vh",
          overflowX: "auto",
          padding: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <h2 style={{ margin: 0 }}>Listing Data</h2>
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
 
        {/* Line with tabs on left and search bar on right */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 5 }}>
            <button
              onClick={() => setActiveTab(TABS.COMPANY)}
              style={activeTab === TABS.COMPANY ? styles.activeTab : styles.tab}
            >
              Companies
            </button>
            <button
              onClick={() => setActiveTab(TABS.PROJECTS)}
              style={activeTab === TABS.PROJECTS ? styles.activeTab : styles.tab}
            >
              Projects
            </button>
            <button
              onClick={() => setActiveTab(TABS.PROPERTIES)}
              style={activeTab === TABS.PROPERTIES ? styles.activeTab : styles.tab}
            >
              Properties
            </button>
          </div>
 
          <div style={{ maxWidth: 400, width: "100%" }}>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSubmit={() => { /* optional if you want to handle submit separately */ }}
            />
          </div>
        </div>
 
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        {!loading && !error && (
          <Table
            columns={currentColumns}
            data={currentData}
            rowsPerPage={19}
          />
        )}
 
        <ProjectDetailsModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          project={selectedProject}
          TableComponent={Table}
        />
      </div>
    </div>
  );
}
 
 
const styles = {
  tab: {
    padding: "8px 15px",
    cursor: "pointer",
    border: "1px solid #e0e0e0",
    outline: "none",
    fontSize: "15px",
    fontWeight: "500",
    color: "#333",
    transition: "all 0.01s ease",
    height: "32px",
  },
  activeTab: {
    padding: "8px 15px",
    cursor: "pointer",
    color: "#d4af37",
    border: "2px solid",
    outline: "none",
    fontWeight: "bold",
    fontSize: "15px",
    transition: "all 0.01s ease",
    height: "32px",
  }
};
 
 