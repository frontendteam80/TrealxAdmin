import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Sidebar from "../../components/Sidebar.jsx";
import ProjectDetailsTabsComponent from "./ProjectDetailsTabsComponent.jsx";
import AgentDetailsTable from "./AgentDetailsTable.jsx";
import { useApi } from "../../API/Api.js";
import { LoadScript } from "@react-google-maps/api";
import Table from "../../Utils/Table.jsx";
import { Filter } from "lucide-react";

const SIDEBAR_WIDTH = 220;
const PAGE_PADDING = 20;
const GOOGLE_MAPS_API_KEY = "AIzaSyAGGzyx5AhGJIfBbzbz9ZeWWyjdGu7Elf0";

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

  // Filter states and search in filter dropdown
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

  // Helper to find id from multiple keys
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
      } catch (e) {
        setDisplayData([]);
      }
      setLoading(false);
    }
    loadData();
  }, [activeTab, fetchData]);

  // Detail click and loading project details logic omitted for brevity (reuse your existing code)

  // Filter handlers
  const toggleFilterHandler = (key) => {
    setOpenFilter((prev) => (prev === key ? null : key));
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
    setOpenFilter(null); // Close dropdown; filtering is reactive
    setCurrentPage(1); // Reset to first page on filter apply
  };

  // Filtering data based on current filters
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

  // Header with filter UI
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
                <label key={val} style={{ display: "block", marginBottom: 4, cursor: "pointer" }}>
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

  // Example columns configuration using header filter UI
  const columnsConfig = {
    Tours: [
      { label:  "FullName", key: "FullName" },
      { label: renderHeaderWithFilter("Phone", "PhoneNo"), key: "PhoneNo" },
      { label: renderHeaderWithFilter("Email", "Email"), key: "Email" },
      { label: renderHeaderWithFilter("ScheduledAt", "ScheduledAt"), key: "ScheduledAt" },
      { label: renderHeaderWithFilter("TimeSlot", "TimeSlot"), key: "TimeSlot" },
      { label: renderHeaderWithFilter("ProjectID", "ProjectID"), key: "ProjectID" },
      { label: renderHeaderWithFilter("PropertyID", "PropertyID"), key: "PropertyID" },
      {
        label: "Action",
        key: "action",
        render: (_, row) => (
          <button className="details-btn" onClick={() => handleDetailsClick(row)}>Details</button>
        ),
      },
    ],
    // Add other tabs similarly...
  };

  // Get unique values for filters
  const uniqueValues = (key) => {
    return Array.from(
      new Set(
        (displayData || [])
          .map((item) => (item[key] != null ? item[key] : "N/A"))
          .filter((val) => val !== "")
      )
    ).sort((a, b) => a.toString().localeCompare(b.toString()));
  };

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
      <div className="dashboard-container" style={{ display: "flex", marginLeft: 180 }}>
        <Sidebar />
        <div
          className="buyers-content"
          style={{ flex: 1, position: "relative", minHeight: "100vh", overflowX: "hidden", padding: 24 }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ margin: 0, fontWeight: 400 }}>Social Activity</h2>
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
            {/* Modal contents */}
          </Modal>
        </div>
      </div>
    </LoadScript>
  );
}
