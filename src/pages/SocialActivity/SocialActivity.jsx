// import React, { useState, useEffect, memo } from "react";
// import { createPortal } from "react-dom";
// import Sidebar from "../../components/Sidebar.jsx";
// import formatAmount  from "../../Utils/formatAmount.js";
// import { useApi } from "../../API/Api.js";
// import {
//   MdApartment, MdCheckCircle, MdBedroomParent, MdOutlineViewDay,
//   MdStraighten, MdOutlineWc, MdOutlineWaves, MdLocationOn, MdShare
// } from "react-icons/md";
// import {
//   GoogleMap, LoadScript, Marker, InfoWindow, useJsApiLoader
// } from "@react-google-maps/api";

// import "./SocialActivity.css";
// import AgentDetailsTable from "./AgentDetailsTable.jsx";
// import ProjectDetailsTabsComponent from "./ProjectDetailsTabsComponent.jsx";


// const detailTabs = ["Details", "Facts & Features", "Amenities", "Highlights", "Location"];
// const GOOGLE_MAPS_API_KEY = "AIzaSyAGGzyx5AhGJIfBbzbz9ZeWWyjdGu7Elf0";

// const SIDEBAR_WIDTH = 220;
// const PAGE_PADDING = 20;

// function Modal({ children, open, onClose }) {
//   if (!open) return null;

//   return createPortal(
//     <div className="modal-overlay" onClick={onClose}>
//       <div
//         className="modal-content"
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
//   function getId(obj, keys) {
//     for (const key of keys) if (obj[key] !== undefined) return obj[key];
//     return null;
//   }

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
//     Tours: "ToursDetails",
//     "Request Info": "RequestinfoDetails",
//     "Shared Properties": "SharePropertyDetails",
//   };

//   const projectInfoParamTypes = {
//     Tours: "ToursPropertyDetails",
//     "Request Info": "RequestInfoPropertyDetails",
//     "Shared Properties": "SharedPropertyDetails",
//   };

//   const indexOfLastRow = currentPage * rowsPerPage;
//   const indexOfFirstRow = indexOfLastRow - rowsPerPage;
//   const currentRows = displayData.slice(indexOfFirstRow, indexOfLastRow);

//   const openAgentPanel = (unit) => {
//     fetchData("Agentinfo")
//       .then((agents) => {
//         setAgentList(agents || []);
//         setShareUnit(unit);
//         setAgentsOpen(true);
//       })
//       .catch(() => alert("Could not fetch agent list."));
//   };

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
//           minPrice: Math.min(...currentProjectUnits.map((u) => parseFloat(u.Price) || 0)),
//           maxPrice: Math.max(...currentProjectUnits.map((u) => parseFloat(u.Price) || 0)),
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
//         units: currentProjectUnits.map(Unit => (
//           {
//             type: Unit.Type ?? "N/A",
//             price: Unit.Price ?? "N/A",
//             area: Unit.Area ?? "N/A",
//             facing: Unit.Facing ?? "N/A",
//             bhk: Unit.BHK ?? "N/A",
//             bath: Unit.Bath ?? "N/A",
//             id: getId(Unit, ["PropertyID", "PropertyId", "propertyId", "propertyid"]),
//             projectId,
//           })),
        
//         allPriceofproject:currentProjectUnits.map(u =>
//           typeof u.Price === "string"
//           ?parseFloat(u.Price.replace(/[^0-9.]/g/""))
//           :u.Price
//         ).filter(val=> typeof val ==="number"&& !isNaN(val)),
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

//   const displayValue = (val) => (val === null || val === undefined ? "null" : val);

//   return (
//     <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
//       <div className="dashboard-container">
//         <Sidebar />
//         <div
//           style={{
//             maxWidth: `calc(100vw - ${SIDEBAR_WIDTH + PAGE_PADDING * 2}px)`,
//             overflowX: "auto",
//             padding: `${PAGE_PADDING}px`,
//             flex: 1,
//             position: "relative",
//             zIndex: 1,
//           }}
//         >
//           <div style={{ flex: 1, position: "relative" }}>
//             <div
//               style={{
//                 position: "absolute",
//                 top: "10px",
//                 right: "40px",
//                 margin: "10px 20px",
//                 fontWeight: "bold",
//                 fontSize: "1.1rem",
//                 color: "#d4af37",
//                 zIndex: 2,
//               }}
//             >
//               Kiran Reddy Pallaki
//             </div>
//             <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 16 }}>SocialActivity</h2>

//             <div style={{ marginBottom: 16 }}>
//               {["Tours", "Request Info", "Shared Properties"].map((tab) => (
//                 <button
//                   key={tab}
//                   onClick={() => setActiveTab(tab)}
//                   style={{
//                     marginRight: 8,
//                     padding: "8px 15px",
//                     borderRadius: 7,
//                     fontWeight: 500,
//                     fontSize: 15,
//                     border: "1px solid #222",
//                     backgroundColor: activeTab === tab ? "#fff" : "#fff",
//                     color: activeTab === tab ? "#b8860b" : "#121212",
//                     cursor: "pointer",
//                   }}
//                 >
//                   {tab}
//                 </button>
//               ))}
//             </div>

//             {loading ? (
//               <p>Loading...</p>
//             ) : (
//               <table
//                 style={{
//                   width: "100%",
//                   margintop:10,
//                   borderCollapse: "collapse",
//                   borderSpacing: "0 10px",
//                   borderRadius: "10px",
//                   backgroundColor: "transparent",
//                   fontFamily: "inherit",
//                 }}
//               >
//                 <thead>
//                   <tr>
//                     {activeTab === "Tours" && (
//                       <>
//                         <th>Full Name</th>
//                         <th>Phone</th>
//                         <th>Email</th>
//                         <th>ScheduledAt</th>
//                         <th>TimeSlot</th>
//                         <th>ProjectID</th>
//                         <th>PropertyID</th>
//                         <th>Action</th>
//                       </>
//                     )}
//                     {activeTab === "Request Info" && (
//                       <>
//                         <th>Message</th>
//                         <th>Email</th>
//                         <th>Phone</th>
//                         <th>ProjectId</th>
//                         <th>PropertyId</th>
//                         <th>Action</th>
//                       </>
//                     )}
//                     {activeTab === "Shared Properties" && (
//                       <>
//                         <th>Name</th>
//                         <th>Email</th>
//                         <th>Phone</th>
//                         <th>Message</th>
//                         <th>Channel</th>
//                         <th>ProjectId</th>
//                         <th>PropertyId</th>
//                         <th>Action</th>
//                       </>
//                     )}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {currentRows.length > 0 ? (
//                     currentRows.map((row, idx) => {
//                       const key=row.PropertyId ||row.ProjectId||row.id||row.Email;
//                       return(
//                       <tr key={row.PropertyID } style={{ borderBottom: "1px solid #ddd" }}>
//                         {activeTab === "Tours" && (
//                           <>
//                             <td>{displayValue(row.Fullname ?? row.FullName)}</td>
//                             <td>{displayValue(row.PhoneNo)}</td>
//                             <td>{displayValue(row.Email)}</td>
//                             <td>{displayValue(row.ScheduledAt)}</td>
//                             <td>{displayValue(row.Timeslot ?? row.TimeSlot)}</td>
//                             <td>{displayValue(row.Projectid ?? row.ProjectID)}</td>
//                             <td>{displayValue(row.Propertyid ?? row.PropertyID)}</td>
//                             <td>
//                               <button onClick={() => handleDetailsClick(row)}>Details</button>
//                             </td>
//                           </>
//                         )}
//                         {activeTab === "Request Info" && (
//                           <>
//                             <td>{displayValue(row.Message)}</td>
//                             <td>{displayValue(row.Email)}</td>
//                             <td>{displayValue(row.PhoneNo)}</td>
//                             <td>{displayValue(row.ProjectID ?? row.ProjectId)}</td>
//                             <td>{displayValue(row.PropertyID ?? row.PropertyId)}</td>
//                             <td>
//                               <button onClick={() => handleDetailsClick(row)}>Details</button>
//                             </td>
//                           </>
//                         )}
//                         {activeTab === "Shared Properties" && (
//                           <>
//                             <td>{displayValue(row.Name)}</td>
//                             <td>{displayValue(row.Email)}</td>
//                             <td>{displayValue(row.PhoneNo)}</td>
//                             <td>{displayValue(row.Message)}</td>
//                             <td>{displayValue(row.Channel)}</td>
//                             <td>{displayValue(row.ProjectID ?? row.ProjectId)}</td>
//                             <td>{displayValue(row.PropertyID ?? row.PropertyId)}</td>
//                             <td>
//                               <button onClick={() => handleDetailsClick(row)}>Details</button>
//                             </td>
//                           </>
//                         )}
//                       </tr>
//                     );
//                     })
//                   ) : (
//                     <tr>
//                       <td
//                         colSpan={
//                           activeTab === "Tours" ? 8 : activeTab === "Request Info" ? 6 : 8
//                         }
//                         style={{ textAlign: "center", padding: 20 }}
//                       >
//                         No data available
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             )}

//             <div style={{ marginTop: 16, textAlign: "center" }}>
//               <button
//                 onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//                 disabled={currentPage === 1}
//                 style={{ marginRight: 8 }}
//               >
//                 Previous
//               </button>
//               <span>
//                 Page {currentPage} of {Math.ceil(displayData.length / rowsPerPage)}
//               </span>
//               <button
//                 onClick={() =>
//                   setCurrentPage((p) =>
//                     Math.min(p + 1, Math.ceil(displayData.length / rowsPerPage))
//                   )
//                 }
//                 disabled={currentPage >= Math.ceil(displayData.length / rowsPerPage)}
//                 style={{ marginLeft: 8 }}
//               >
//                 Next
//               </button>
//             </div>
//           </div>

//           <Modal
//             open={!!selectedRow}
//             onClose={() => {
//               setSelectedRow(null);
//               setProjectDetail(null);
//               setAgentsOpen(false);
//             }}
//           >
//             <div style={{ display: "flex", width: "100%", gap: 24 }}>
//               <div style={{ flex: 2, overflowY: "auto", paddingRight: 8, minWidth: 360, maxHeight: "calc(80vh - 48px)" }}>
//                 <ProjectDetailsTabsComponent
//                   data={projectDetail}
//                   initialTab="Details"
//                   onClose={() => {
//                     setSelectedRow(null);
//                     setProjectDetail(null);
//                     setAgentsOpen(false);
//                   }}
//                   onRequestShare={openAgentPanel}
//                   currentPropertyId={selectedRow?.PropertyID ?? selectedRow?.proprtyId}
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
//                   <AgentDetailsTable
//                     agents={agentList}
//                     shareUnit={shareUnit}
//                     onClose={() => setAgentsOpen(false)}
//                   />
//                 </div>
//               )}
//             </div>
//           </Modal>
//         </div>
//       </div>
//     </LoadScript>
//   );
// }

// const FavoriteButton = memo(({ unitId, isFavorite, toggleFavorite }) => (
//   <button
//     style={{
//       background: "none",
//       border: "none",
//       cursor: "pointer",
//       fontSize: 22,
//       color: isFavorite ? "#d81b60" : "#aaa",
//     }}
//     onClick={(e) => {
//       e.stopPropagation();
//       toggleFavorite(unitId);
//     }}
//     aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
//     title={isFavorite ? "Remove from favorites" : "Add to favorites"}
//   >
//     {isFavorite ? "♥" : "♡"}
//   </button>
// ));
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Sidebar from "../../components/Sidebar.jsx";
import ProjectDetailsTabsComponent from "./ProjectDetailsTabsComponent.jsx";
import AgentDetailsTable from "./AgentDetailsTable.jsx";
import { useApi } from "../../API/Api.js";
import { LoadScript } from "@react-google-maps/api";
import Table from "../../components/Table.jsx";

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

  // Helper to resolve row id
  function getId(obj, keys) {
    for (const key of keys) if (obj[key] !== undefined) return obj[key];
    return null;
  }

  // Display fallback for null or undefined
  const displayValue = (val) => (val === null || val === undefined ? "null" : val);

  useEffect(() => {
    const loadData = async () => {
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
    };
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
          location:
            currentProjectUnits[0]?.Locality ||
            currentProjectUnits[0]?.Location ||
            currentProjectUnits[0]?.GeoLocation ||
            "N/A",
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
          .map((u) =>
            typeof u.Price === "string"
              ? parseFloat(u.Price.replace(/[^0-9.]/g, ""))
              : u.Price
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
      });
    } catch (e) {
      setProjectDetail(null);
    }
  };

  // Columns config per tab
  const columnsConfig = {
    Tours: [
      { label: " Full Name", key: "FullName" },
      { label: "Phone", key: "PhoneNo" },
      { label: "Email", key: "Email" },
      { label: "ScheduledAt", key: "ScheduledAt" },
      { label: "TimeSlot", key: "Timeslot" },
      { label: "ProjectID", key: "ProjectID" },
      { label: "PropertyID", key: "PropertyID" },
      {
        label: "Action",
        key: "action",
        render: (_, row) => (
          <button onClick={() => handleDetailsClick(row)}>Details</button>
        ),
      },
    ],
    "Request Info": [
      { label: "Message", key: "Message" },
      { label: "Email", key: "Email" },
      { label: "Phone", key: "PhoneNo" },
      { label: "ProjectId", key: "ProjectID" },
      { label: "PropertyId", key: "PropertyID" },
      {
        label: "Action",
        key: "action",
        render: (_, row) => (
          <button onClick={() => handleDetailsClick(row)}>Details</button>
        ),
      },
    ],
    "Shared Properties": [
      { label: "Name", key: "Name" },
      { label: "Email", key: "Email" },
      { label: "Phone", key: "PhoneNo" },
      { label: "Message", key: "Message" },
      { label: "Channel", key: "Channel" },
      { label: "ProjectId", key: "ProjectID" },
      { label: "PropertyId", key: "PropertyID" },
      {
        label: "Action",
        key: "action",
        render: (_, row) => (
          <button onClick={() => handleDetailsClick(row)}>Details</button>
        ),
      },
    ],
  };

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
      <div className="dashboard-container" style={{ display: "flex" }}>
         <Sidebar />
          <div
        className="buyers-content"
        style={{
          flex: 1,
          position: "relative",
          minHeight: "100vh",
          // maxWidth: "calc(100vw - 260px)",
          overflowX: "auto",
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
          <h2 style={{ margin: 0 }}>Social Activity</h2>
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

          <div style={{ marginBottom: 16 }}>
            {Object.keys(listParamTypes).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  marginRight: 8,
                  padding: "8px 15px",
                  borderRadius: 7,
                  fontWeight: 500,
                  fontSize: 15,
                  border: "1px solid #222",
                  backgroundColor: activeTab === tab ? "#fff" : "#fff",
                  color: activeTab === tab ? "#b8860b" : "#121212",
                  cursor: "pointer",
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
              data={displayData}
              rowsPerPage={rowsPerPage}
              // optional: pass setCurrentPage and currentPage if lifting state needed
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
                  <AgentDetailsTable agents={agentList} shareUnit={shareUnit} onClose={() => setAgentsOpen(false)} />
                </div>
              )}
            </div>
          </Modal>
        </div>
      </div>
    </LoadScript>
  );
}
