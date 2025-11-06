 import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar.jsx";
import { useApi } from "../../API/Api.js";
import Table, { Pagination } from "../../Utils/Table.jsx";
<<<<<<< HEAD
import { Search, Filter, ArrowLeft } from "lucide-react";
=======
import { Search } from "lucide-react";
>>>>>>> 575ef5d (newupdate)

const TABS = {
  COMPANY: "company",
  PROJECTS: "projects",
  PROPERTIES: "properties",
};

<<<<<<< HEAD
// Simple Modal component unchanged
=======
// ---------- Simple Modal ----------
>>>>>>> 575ef5d (newupdate)
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
<<<<<<< HEAD
          overflowY: "auto",
=======
          //overflowY: "auto",
>>>>>>> 575ef5d (newupdate)
          boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

<<<<<<< HEAD
// Modal for project details unchanged
=======
// ---------- Modal for Project Details ----------
>>>>>>> 575ef5d (newupdate)
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

<<<<<<< HEAD
=======
// ---------- Main Component ----------
>>>>>>> 575ef5d (newupdate)
export default function ProjectsDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const defaultTabFromDashboard = location.state?.defaultTab || TABS.COMPANY;
  const fromDashboard = location.state?.fromDashboard || false;

<<<<<<< HEAD
=======
  const { fetchData } = useApi();

>>>>>>> 575ef5d (newupdate)
  const [activeTab, setActiveTab] = useState(defaultTabFromDashboard);
  const [companyData, setCompanyData] = useState([]);
  const [projectsData, setProjectsData] = useState([]);
  const [propertiesData, setPropertiesData] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
<<<<<<< HEAD
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { fetchData } = useApi();
=======
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [openFilter, setOpenFilter] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
>>>>>>> 575ef5d (newupdate)

  const [page, setPage] = useState(1);
  const rowsPerPage = 15;

<<<<<<< HEAD
  const [openFilter, setOpenFilter] = useState(null);
  const [filters, setFilters] = useState({});
  const [filterSearchValue, setFilterSearchValue] = useState("");

  const toggleFilter = (key) => {
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

  const clearFilter = (key) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
    setOpenFilter(null);
  };

  const applyFilter = () => {
    let dataToFilter = [];
    if (activeTab === TABS.COMPANY) dataToFilter = companyData;
    else if (activeTab === TABS.PROJECTS) dataToFilter = projectsData;
    else dataToFilter = propertiesData;

    const filtered = dataToFilter.filter((item) =>
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
    let sourceData = [];
    if (activeTab === TABS.COMPANY) sourceData = filteredCompanies;
    else if (activeTab === TABS.PROJECTS) sourceData = filteredProjects;
    else sourceData = filteredProperties;

    return Array.from(
      new Set(sourceData.map((item) => item[key]).filter((val) => val != null))
    );
  };

  const renderHeaderWithFilter = (label, key) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
      }}
    >
      <span>{label}</span>
      <Filter
        size={14}
        style={{
          cursor: "pointer",
          color: openFilter === key ? "#22253b" : "#adb1bd",
        }}
        onClick={(e) => {
          e.stopPropagation();
          toggleFilter(key);
        }}
      />
    </div>
  );

  const companyColumns = [
    { label: renderHeaderWithFilter("S.No", "serialNo"), key: "serialNo", render: (_, __, idx) => idx + 1 },
    { label: renderHeaderWithFilter("Company Name", "CompanyName"), key: "CompanyName" },
    { label: renderHeaderWithFilter("Projects", "TotalProjects"), key: "TotalProjects" },
    {
      label: renderHeaderWithFilter("OperatingCities", "OperatingCities"),
      key: "OperatingCities",
      render: (val) => {
        if (!val) return "N/A";
        const citiesArray = val.split(",").map((city) => city.trim());
        if (citiesArray.length <= 2) {
          return val;
        }
        const displayCities = citiesArray.slice(0, 2).join(", ") + ", ...";
        return <span title={citiesArray.join(", ")}>{displayCities}</span>;
      },
    },
    { label: renderHeaderWithFilter("Operating Since", "OperatingSince"), key: "OperatingYear" },
    { label: renderHeaderWithFilter("ReadyToMove", "ReadyToMove"), key: "ReadyToMove" },
    { label: renderHeaderWithFilter("UnderConstruction", "UnderConstruction"), key: "UnderConstruction" },
  ];

  const projectColumns = [
    { label: renderHeaderWithFilter("S.No", "serialNo"), key: "serialNo", render: (_, __, idx) => idx + 1 },
    { label: renderHeaderWithFilter("Project Name", "ProjectName"), key: "ProjectName" },
    { label: renderHeaderWithFilter("ProjectID", "ProjectID"), key: "ProjectID" },
    { label: renderHeaderWithFilter("CustomProjectTypes", "CustomProjectTypes"), key: "CustomProjectTypes" },
    { label: renderHeaderWithFilter("Status", "ProjectStatus"), key: "ProjectStatus" },
    { label: renderHeaderWithFilter("Locality", "Locality"), key: "Locality" },
  ];

  const propertyColumns = [
    { label: renderHeaderWithFilter("S.No", "serialNo"), key: "serialNo", render: (_, __, idx) => idx + 1 },
    { label: renderHeaderWithFilter("ProjectName", "projectname"), key: "projectname" },
    { label: renderHeaderWithFilter("Property ID", "PropertyID"), key: "PropertyID" },
    { label: renderHeaderWithFilter("Property Name", "PropertyName"), key: "PropertyName" },
    { label: renderHeaderWithFilter("Price", "AmountWithUnit"), key: "AmountWithUnit" },
    { label: renderHeaderWithFilter("Type", "PropertyType"), key: "PropertyType" },
    { label: renderHeaderWithFilter("Status", "propertystatus"), key: "propertystatus" },
    { label: renderHeaderWithFilter("Bedrooms", "Bedrooms"), key: "Bedrooms" },
    { label: renderHeaderWithFilter("Facing", "Facing"), key: "Facing" },
  ];

=======
  // ---------- Fetch All Data ----------
>>>>>>> 575ef5d (newupdate)
  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetchData("Company_Data"),
      fetchData("Projectdata"),
      fetchData("property_Data_Info"),
    ])
      .then(([cRes, pRes, prRes]) => {
        setCompanyData(cRes || []);
        setProjectsData(pRes || []);
        setPropertiesData(prRes || []);
        setFilteredCompanies(cRes || []);
        setFilteredProjects(pRes || []);
        setFilteredProperties(prRes || []);
      })
      .catch((err) => setError(err.message || "Error loading data"))
      .finally(() => setLoading(false));
  }, [fetchData]);

<<<<<<< HEAD
=======
  // ---------- Search ----------
>>>>>>> 575ef5d (newupdate)
  useEffect(() => {
    const lower = searchQuery.trim().toLowerCase();
    if (!lower) {
      setFilteredCompanies(companyData);
      setFilteredProjects(projectsData);
      setFilteredProperties(propertiesData);
      return;
    }
    const filterBySearch = (data, keys) =>
      data.filter((item) =>
        keys.some(
          (key) =>
            item[key] && item[key].toString().toLowerCase().includes(lower)
        )
      );
    setFilteredCompanies(
      filterBySearch(companyData, ["CompanyName", "CompanyID"])
    );
    setFilteredProjects(
      filterBySearch(projectsData, ["ProjectName", "ProjectID"])
    );
    setFilteredProperties(
      filterBySearch(propertiesData, ["PropertyName", "PropertyID"])
    );
  }, [searchQuery, companyData, projectsData, propertiesData]);

<<<<<<< HEAD
=======
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
>>>>>>> 575ef5d (newupdate)
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

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return currentData.slice(start, start + rowsPerPage);
  }, [currentData, page]);

  const totalPages = Math.ceil(currentData.length / rowsPerPage);

<<<<<<< HEAD
  return (
    <div style={{ display: "flex", backgroundColor: "#fff" }}>
      {/* Sidebar container */}
=======
  // ---------- Render ----------
  return (
    <div style={{ display: "flex", backgroundColor: "#fff" }}>
>>>>>>> 575ef5d (newupdate)
      <div style={{ flexShrink: 0 }}>
        <Sidebar />
      </div>

<<<<<<< HEAD
      {/* Main content container */}
      <div style={{ flex: 1, padding: 24, marginLeft: "180px", minHeight: "100vh" }}>
        {fromDashboard && (
          <div style={{ marginBottom: 15 }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                display: "flex",
                alignItems: "center",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#333",
                fontSize: "15px",
                fontWeight: "500",
              }}
            >
                Back
            </button>
          </div>
        )}

        {/* Tabs & Search */}
=======
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
>>>>>>> 575ef5d (newupdate)
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
<<<<<<< HEAD
            marginBottom: 20,
          }}
        >
          {/* Tabs */}
          <div style={{ display: "flex", gap: 2 }}>
=======
            marginBottom: 14,
          }}
        >
          <div style={{ display: "flex", gap: 4 }}>
>>>>>>> 575ef5d (newupdate)
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
<<<<<<< HEAD
                  onMouseEnter={(e) => {
                    if (!isActive) e.target.style.color = "#000";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.target.style.color = "#666";
                  }}
=======
>>>>>>> 575ef5d (newupdate)
                  style={{
                    backgroundColor: isActive ? "#fff" : "#f0f0f0",
                    color: isActive ? "#2c3e50" : "#666",
                    border: "none",
<<<<<<< HEAD
                    outline: "none",
                    cursor: "pointer",
                    padding: "10px 14px",
                    marginLeft: "1px",
                    fontSize: "13px",
=======
                    cursor: "pointer",
                    padding: "6px 9px",
                    fontSize: "12px",
>>>>>>> 575ef5d (newupdate)
                    fontWeight: isActive ? 600 : 500,
                    borderBottom: isActive
                      ? "3px solid #2c3e50"
                      : "3px solid transparent",
<<<<<<< HEAD
                    transition: "background-color 0.3s ease, color 0.3s ease",
                    // borderTopLeftRadius: 6,
                    // borderTopRightRadius: 6,
=======
                    borderTopLeftRadius: 3,
                    borderTopRightRadius: 3,
>>>>>>> 575ef5d (newupdate)
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

<<<<<<< HEAD
          {/* Search */}
          <div style={{ position: "relative", width: 160 }}>
            <Search
              size={16}
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9ca3af",
=======
          <div style={{ position: "relative", width: 200}}>
            <Search
              size={16}
              color="#adb1bd"
              style={{
                position: "absolute",
                left: 9,
                top: "50%",
                transform: "translateY(-50%)",
>>>>>>> 575ef5d (newupdate)
              }}
            />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
<<<<<<< HEAD
                width: "130px",
=======
                width: "170px",
>>>>>>> 575ef5d (newupdate)
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

<<<<<<< HEAD
        {/* Table */}
=======
        {/* Table and Pagination */}
>>>>>>> 575ef5d (newupdate)
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: "red" }}>Error: {error}</p>
        ) : (
          <>
            <Table
              columns={currentColumns}
              paginatedData={paginatedData}
<<<<<<< HEAD
=======
              page={page}
              rowsPerPage={rowsPerPage}
>>>>>>> 575ef5d (newupdate)
              openFilter={openFilter}
              toggleFilter={toggleFilter}
              filters={filters}
              handleCheckboxChange={handleCheckboxChange}
<<<<<<< HEAD
              searchValue={filterSearchValue}
              setSearchValue={setFilterSearchValue}
=======
>>>>>>> 575ef5d (newupdate)
              uniqueValues={uniqueValues}
              clearFilter={clearFilter}
              applyFilter={applyFilter}
              onRowClick={(row) => {
                setSelectedProject(row);
                setModalOpen(true);
              }}
            />
            {totalPages > 1 && (
              <Pagination page={page} setPage={setPage} totalPages={totalPages} />
            )}
          </>
        )}

<<<<<<< HEAD
=======
        {/* Modal */}
>>>>>>> 575ef5d (newupdate)
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
