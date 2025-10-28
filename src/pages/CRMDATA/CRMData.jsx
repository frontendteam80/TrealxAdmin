//  import React, { useEffect, useState } from "react";
// import Sidebar from "../../components/Sidebar.jsx";
// import { useApi } from "../../API/Api.js";
// import Table from "../../Utils/Table.jsx";
// import formatAmount from "../../Utils/formatAmount.js";
 
// function LocationCell({ value }) {
//   const [showAll, setShowAll] = useState(false);
 
//   if (!value || typeof value !== "string") return <>null</>;
 
//   const locations = value.split(",");
//   const firstLocation = locations[0];
//   const remaining = locations.slice(1).join(", ");
 
//   return (
//     <span
//       style={{
//         cursor: remaining ? "pointer" : "default",
//         textDecoration: remaining ? "none" : "none",
//         color: remaining ? "black" : "black",
//       }}
//       onClick={() => remaining && setShowAll(!showAll)}
//       title={showAll ? "Click to collapse" : "Click to expand full address"}
//     >
//       {showAll ? value : (
//         <>
//           {firstLocation}
//           {remaining ? ",..." : ""}
//         </>
//       )}
//     </span>
//   );
// }
 
// export default function Buyers() {
//   const [buyers, setBuyers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { fetchData } = useApi();
 
//   useEffect(() => {
//     async function load() {
//       try {
//         const data = await fetchData("Buyer_info");
//         setBuyers(data || []);
//       } catch (err) {
//         setError(err.message || "Error loading buyers");
//       } finally {
//         setLoading(false);
//       }
//     }
//     load();
//   }, [fetchData]);
 
//   const columns = [
//     {
//       label: "S.No",
//       key: "serialNo",
//       render: (_, __, index) => index + 1,
//     },
//     { key: "BuyerID", label: "BuyerID" },
//     { label: "Buyer Name", key: "BuyerName" },
//     { label: "ContactNumber", key: "ContactNumber" },
//     { label: "Email", key: "Email" },
//     {
//       label: "Preferred Location",
//       key: "PreferredLocations",
//       render: (val) => <LocationCell value={val} />,
//     },
//     { label: "Property Types", key: "PropertyTypes" },
//     {
//       label: "Budget",
//       key: "BudgetMin",
//       render: (_, row) => {
//         const minAmount = formatAmount(row.BudgetMin);
//         const maxAmount = formatAmount(row.BudgetMax);
//         return `${minAmount} - ${maxAmount}`;
//       },
//     },
//     { label: "Timeline", key: "Timeline" },
//     { label: "Payment Mode", key: "PaymentMode" },
//   ];
 
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
//           // maxWidth: "calc(100vw - 260px)",
//           overflowX: "auto",
//           padding: 24,
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             marginBottom: 20,
//           }}
//         >
//           <h2 style={{ margin: 0 }}>Buyers</h2>
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
 
//         {loading ? <p>Loading...</p> : <Table columns={columns} data={buyers} rowsPerPage={15} />}
//       </div>
//     </div>
//   );
// }
 
 
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import { useApi } from "../../API/Api.js";
import Table from "../../Utils/Table.jsx";
import SearchBar from "../../Utils/SearchBar.jsx";
 
export default function AgentDetails() {
  const [agentDetails, setAgentDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fetchData } = useApi();
 
  // Search state
  const [searchTerm, setSearchTerm] = useState("");
 
  // Filter state
  const [filters, setFilters] = useState({
    name: "",
    location: "",
    associatedPartner: "",
    propertyType: ""
  });
 
  useEffect(() => {
    async function load() {
      try {
        const data = await fetchData("CRMData");
        const mappedData = (data || []).map((item, index) => ({
          S_No: index + 1,
          Name: item.Name,
          MobileNumber: item.MobileNumber,
          EMail: item.EMail,
          Builder_CP_Agent: item.Builder_CP_Agent,
          Locality: item.Locality,
          PropertyTypes: item.PropertyTypes,
          RefferedBy: item.RefferedBy,
        }));
        setAgentDetails(mappedData);
        console.log("Agent Details:", mappedData);
      } catch (err) {
        setError(err.message || "Error loading AgentDetails");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [fetchData]);
 
  // Table columns
  const columns = [
    { key: "S_No", label: "S.No" },
    { key: "Name", label: "Name" },
    { key: "MobileNumber", label: "Mobile Number" },
    { key: "EMail", label: "Email" },
    { key: "Builder_CP_Agent", label: "Associated Partner" },
    { key: "Locality", label: "Locality" },
    { key: "PropertyTypes", label: "Property Types" },
    { key: "RefferedBy", label: "Referred By" },
  ];
 
  // Filtered data: search + selected filters
  const filteredData = agentDetails.filter(item => {
    if (
      !searchTerm &&
      // !filters.name &&
      !filters.location &&
      !filters.associatedPartner &&
      !filters.propertyType
    ) return true;
 
    const lowerSearch = searchTerm.toLowerCase();
 
    return (
      // (!filters.name || item.Name === filters.name) &&
      (!filters.location || item.Locality === filters.location) &&
      (!filters.associatedPartner || item.Builder_CP_Agent === filters.associatedPartner) &&
      (!filters.propertyType || item.PropertyTypes === filters.propertyType) &&
      (
        !searchTerm ||
        item.Name?.toLowerCase().includes(lowerSearch) ||
        item.Locality?.toLowerCase().includes(lowerSearch) ||
        item.Builder_CP_Agent?.toLowerCase().includes(lowerSearch) ||
        (item.S_No && item.S_No.toString().includes(lowerSearch))
      )
    );
  });
 
  if (error) return <div>Error: {error}</div>;
 
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
        {/* Header Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <h2 style={{ margin: 0 }}>CRM Data</h2>
          <div style={{ fontWeight: "bold", fontSize: "1.1rem", color: "#d4af37" }}>
            Kiran Reddy Pallaki
          </div>
        </div>
 
        {/* Search + Filter Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onSubmit={() => console.log("Search triggered for:", searchTerm)}
          />
 
          {/* <select
            onChange={e => setFilters(f => ({ ...f, name: e.target.value }))}
            value={filters.name}
          >
            <option value="">Agent Name</option>
            {[...new Set(agentDetails.map(a => a.Name))].map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select> */}
 
          <select
            onChange={e => setFilters(f => ({ ...f, location: e.target.value }))}
            value={filters.location}
          >
            <option value="">Location</option>
            {[...new Set(agentDetails.map(a => a.Locality))].map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
 
          <select
            onChange={e => setFilters(f => ({ ...f, associatedPartner: e.target.value }))}
            value={filters.associatedPartner}
          >
            <option value="">Associated Partner</option>
            {[...new Set(agentDetails.map(a => a.Builder_CP_Agent))].map(partner => (
              <option key={partner} value={partner}>{partner}</option>
            ))}
          </select>
 
          <select
            onChange={e => setFilters(f => ({ ...f, propertyType: e.target.value }))}
            value={filters.propertyType}
          >
            <option value="">Property Type</option>
            {[...new Set(agentDetails.map(a => a.PropertyTypes))].map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
 
          {/* Display Selected Filter Pills */}
          <div style={{ display: "flex", gap: 8, marginLeft: 8, flexWrap: "wrap" }}>
            {Object.entries(filters).map(([key, value]) =>
              value ? (
                <span
                  key={key}
                  style={{
                    background: "#d4af37",
                    color: "#fff",
                    borderRadius: 12,
                    padding: "2px 8px",
                    fontSize: "0.85rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    cursor: "default",
                    height:"32"
                  }}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                  <button
                    onClick={() => setFilters(f => ({ ...f, [key]: "" }))}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#fff",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      lineHeight: 1,
                    }}
                    aria-label={`Remove ${key} filter`}
                  >
                    &times;
                  </button>
                </span>
              ) : null
            )}
          </div>
        </div>
 
        {/* Table or Loading */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Table columns={columns} data={filteredData} rowsPerPage={15} />
        )}
      </div>
    </div>
  );
}
 