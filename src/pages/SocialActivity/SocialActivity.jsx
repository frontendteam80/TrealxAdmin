 import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Sidebar from "../../components/Sidebar.jsx";
import ProjectDetailsTabsComponent from "./ProjectDetailsTabsComponent.jsx";
import AgentDetailsTable from "./AgentDetailsTable.jsx";
import { useApi } from "../../API/Api.js";
import { LoadScript } from "@react-google-maps/api";
import Table from "../../Utils/Table.jsx";
import { Filter } from "lucide-react";
import { Eye } from "lucide-react";
 
 
const SIDEBAR_WIDTH = 220;
const PAGE_PADDING = 20;
const GOOGLE_MAPS_API_KEY = "AIzaSyAGGzyx5AhGJIfBbzbz9ZeWWyjdGu7Elf0";
 
// Modal component
function Modal({ children, open, onClose }) {
  if (!open) return null;
  return createPortal(
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.3)",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          marginLeft: `${SIDEBAR_WIDTH + PAGE_PADDING}px`,
          marginRight: `${PAGE_PADDING}px`,
          width: `calc(100vw - ${SIDEBAR_WIDTH + PAGE_PADDING * 2}px)`,
          maxWidth: 1400,
          maxHeight: "80vh",
          padding: 24,
          display: "flex",
          gap: 24,
          overflow: "auto",
          position: "relative",
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 16px 40px rgba(0,0,0,.18)",
          boxSizing: "border-box",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
 
export default function SocialActivity() {
  const [activeTab, setActiveTab] = useState("Tours");
  const [displayData, setDisplayData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { fetchData } = useApi();
 
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 12;
  const [selectedRow, setSelectedRow] = useState(null);
  const [projectDetail, setProjectDetail] = useState(null);
  const [agentList, setAgentList] = useState([]);
  const [shareUnit, setShareUnit] = useState(null);
  const [agentsOpen, setAgentsOpen] = useState(false);
 
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
 
  function getId(obj, keys) {
    for (const key of keys) if (obj[key] !== undefined) return obj[key];
    return null;
  }
 
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const paramtype = listParamTypes[activeTab] || "";
        const data = await fetchData(paramtype);
        setDisplayData(data || []);
        setCurrentPage(1);
        setSelectedRow(null);
        setProjectDetail(null);
        setAgentsOpen(false);
      } catch {
        setDisplayData([]);
      }
      setLoading(false);
    }
    loadData();
  }, [activeTab, fetchData]);
 
  const handleDetailsClick = async (row) => {
    setSelectedRow(row);
    setProjectDetail(null);
    setAgentsOpen(false);
 
    const projectId = getId(row, ["ProjectID", "ProjectId", "projectId", "projectid"]);
    const propertyId = getId(row, ["PropertyID", "PropertyId", "propertyId", "propertyid"]);
    if (!projectId || !propertyId) return;
 
    try {
      const paramtype = projectInfoParamTypes[activeTab];
      if (!paramtype) return;
      const allUnits = await fetchData(paramtype);
 
      const currentProjectUnits = allUnits.filter(
        (item) => String(getId(item, ["ProjectID", "ProjectId", "projectId", "projectid"])) === String(projectId)
      );
      if (currentProjectUnits.length === 0) return;
 
      const specificUnit = currentProjectUnits.find(
        (unit) => String(getId(unit, ["PropertyID", "PropertyId", "propertyId", "propertyid"])) === String(propertyId)
      );
      if (!specificUnit) return;
 
      setProjectDetail({
        details: {
          name: currentProjectUnits[0]?.ProjectName || `Project #${projectId}`,
          location: currentProjectUnits[0]?.Locality || currentProjectUnits[0]?.Location || currentProjectUnits[0]?.GeoLocation || "N/A",
          ZipCode: currentProjectUnits[0]?.ZipCode || "N/A",
          description: currentProjectUnits[0]?.ProjectDescription || "Project description here ...",
        },
        latitude: parseFloat(currentProjectUnits[0]?.Latitude) || 0,
        longitude: parseFloat(currentProjectUnits[0]?.Longitude) || 0,
        units: currentProjectUnits.map((Unit) => ({
          type: Unit.Type ?? "N/A",
          price: Unit.Price ?? "N/A",
          area: Unit.Area ?? "N/A",
          facing: Unit.Facing ?? "N/A",
          bhk: Unit.BHK ?? "N/A",
          bath: Unit.Bath ?? "N/A",
          id: getId(Unit, ["PropertyID", "PropertyId", "propertyId", "propertyid"]),
          projectId,
        })),
        allPricesOfProject: currentProjectUnits
          .map((u) => typeof u.Price === "string" ? parseFloat(u.Price.replace(/[^0-9.]/g, "")) : u.Price)
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
      });
    } catch (e) {
      setProjectDetail(null);
    }
  };
 
  const toggleFilterHandler = (key) => {
    setOpenFilter(openFilter === key ? null : key);
    setFilterSearchValue("");
  };
 
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
 
  const clearFilterHandler = (key) => {
    setFilters((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
    setOpenFilter(null);
  };
 
  const applyFilterHandler = () => {
    setOpenFilter(null);
    setCurrentPage(1);
  };
 
  const uniqueValues = (key) => {
    return Array.from(
      new Set(
        (displayData || [])
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
 
  // You can add filter UI in table headers by creating renderHeaderWithFilter, omitted for brevity here
 
  const columnsConfig = {
    Tours: [
      { label: "FullName", key: "FullName" },
      { label: "PhoneNo", key: "PhoneNo" },
      { label: "Email", key: "Email" },
      { label: "ScheduledAt", key: "ScheduledAt" },
      { label: "TimeSlot", key: "TimeSlot" },
      { label: "ProjectID", key: "ProjectID" },
      { label: "PropertyID", key: "PropertyID" },
      {
  label: "Action",
  key: "action",
  render: (_, row) => (
    <button
      onClick={() => handleDetailsClick(row)}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: 32,
        borderRadius: 6,
        transition: "background-color 0.2s ease",
      }}
      title="View Details"
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
    >
      <Eye size={18} color="#374151" />
    </button>
  ),
},
 
    ],
    "Request Info": [
      { label: "Message", key: "Message" },
      { label: "Email", key: "Email" },
      { label: "PhoneNo", key: "PhoneNo" },
      { label: "ProjectID", key: "ProjectID" },
      { label: "PropertyID", key: "PropertyID" },
      {
  label: "Action",
  key: "action",
  render: (_, row) => (
    <button
      onClick={() => handleDetailsClick(row)}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: 32,
        borderRadius: 6,
        transition: "background-color 0.2s ease",
      }}
      title="View Details"
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
    >
      <Eye size={18} color="#374151" />
    </button>
  ),
},
 
    ],
    "Shared Properties": [
      { label: "Name", key: "Name" },
      { label: "Email", key: "Email" },
      { label: "PhoneNo", key: "PhoneNo" },
      { label: "Message", key: "Message" },
      { label: "Channel", key: "Channel" },
      { label: "ProjectID", key: "ProjectID" },
      { label: "PropertyID", key: "PropertyID" },
     {
  label: "Action",
  key: "action",
  render: (_, row) => (
    <button
      onClick={() => handleDetailsClick(row)}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: 32,
        borderRadius: 6,
        transition: "background-color 0.2s ease",
      }}
      title="View Details"
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
    >
      <Eye size={18} color="#374151" />
    </button>
  ),
},
 
    ],
  };
 
  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
      <div className="dashboard-container" style={{ display: "flex",height:"100vh",overflow:"hidden" }}>
        <Sidebar />
        <div
          className="buyers-content"
          style={{ flex: 1, position: "relative", padding: 24 }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ margin: 0, fontWeight: 600,fontSize:"1.05rem"}}>Social Activity</h2>
            <div style={{ fontWeight: "bold", fontSize: "1.1rem", color: "#d4af37" }}>Kiran Reddy Pallaki</div>
          </div>
 
          <div style={{ marginBottom: 16, gap: "2px", display: "flex" }}>
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
                }}
              >
                {tab}
              </button>
            ))}
          </div>
 
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Table
              columns={columnsConfig[activeTab]}
              paginatedData={filterByColumns(displayData)}
              rowsPerPage={rowsPerPage}
              page={currentPage}
              setPage={setCurrentPage}
              filters={filters}
              openFilter={openFilter}
              toggleFilter={toggleFilterHandler}
              handleCheckboxChange={handleCheckboxChange}
              clearFilter={clearFilterHandler}
              applyFilter={applyFilterHandler}
              totalCount={filterByColumns(displayData).length}
              onRowClick={handleDetailsClick}
            />
          )}
 
          <Modal
            open={!!selectedRow}
            onClose={() => {
              setSelectedRow(null);
              setProjectDetail(null);
              setAgentsOpen(false);
            }}
          >
            <div style={{ display: "flex", width: "100%", gap: 24 }}>
              {/* Modal content goes here */}
              <div
                style={{
                  flex: 2,
                  overflowY: "auto",
                  paddingRight: 8,
                  minWidth: 360,
                  maxHeight: "calc(80vh - 48px)",
                }}
              >
                <ProjectDetailsTabsComponent
                  data={projectDetail}
                  initialTab="Details"
                  onClose={() => {
                    setSelectedRow(null);
                    setProjectDetail(null);
                    setAgentsOpen(false);
                  }}
                  onRequestShare={(unit) => {
                    fetchData("Agentinfo")
                      .then((agents) => {
                        setAgentList(agents || []);
                        setShareUnit(unit);
                        setAgentsOpen(true);
                      })
                      .catch(() => alert("Could not fetch agent list."));
                  }}
                  currentPropertyId={selectedRow?.PropertyID ?? selectedRow?.propertyId}
                />
              </div>
 
              {agentsOpen && (
                <div
                  style={{
                    flex: 1,
                    borderLeft: "1px solid #e5e7eb",
                    paddingLeft: 16,
                    overflowY: "auto",
                    maxHeight: "calc(80vh - 48px)",
                    minWidth: 300,
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