
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import SearchBar from "../../Utils/SearchBar.jsx";
import Table, { Pagination } from "../../Utils/Table.jsx";
import { useApi } from "../../API/Api.js";
import { Eye } from "lucide-react";

// const pageLabels = {
//   COMPANY: "Companies",
//   PROJECTS: "Projects",
//   PROPERTIES: "Properties",
// };
// const currentPageLabel =pageLabels[activeTab] ||"";

export default function ProjectsDetails() {
  const { fetchData } = useApi();

  const [activeTab, setActiveTab] = useState("COMPANY");
  const pageLabels = {
  COMPANY: "Companies",
  PROJECTS: "Projects",
  PROPERTIES: "Properties",
};
const currentPageLabel =pageLabels[activeTab] ||"";

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
            {Object.keys(pageLabels).map((tab) => {
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
                  {pageLabels[tab]}
                </button>
              );
            })}
          </div>

          <div style={{ minWidth: 150, flex: "0 1 auto" }}>
            <SearchBar value={searchQuery} onChange={setSearchQuery} onSubmit={() => { }}pageLabel={currentPageLabel} />
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
