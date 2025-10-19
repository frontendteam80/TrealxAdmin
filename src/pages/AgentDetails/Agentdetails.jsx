 import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import { useApi } from "../../API/Api.js";
import Table from "../../components/Table.jsx";
 
export default function AgentDetails() {
  const [agentDetails, setAgentDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fetchData } = useApi();
 
  // Single search filter state
  const [searchTerm, setSearchTerm] = useState("");
 
  useEffect(() => {
    async function load() {
      try {
        const data = await fetchData("AgentsDetails");
        const mappedData = (data || []).map((item, index) => ({
          sno: index + 1,
          AgentId: item.ID,
          Name: item.Name,
          MobileNumber: item.MobileNumber,
          Email: item.Email,
          RelationshipType: item.AgentOrBuilderOrCP,
          Locality: item.Locality,
          PropertyType: item.PropertyType,
          ReferredBy: item.RefferedBy,
        }));
        setAgentDetails(mappedData);
        console.log("Agent Details:", mappedData); // Debug: check what data is present
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
    { key: "sno", label: "S.No" },
    { key: "AgentId", label: "Associate ID" },
    { key: "Name", label: "Name" },
    { key: "MobileNumber", label: "Mobile Number" },
    { key: "Email", label: "Email" },
    { key: "RelationshipType", label: "AssociatedPartner" },
    { key: "Locality", label: "Locality" },
    { key: "PropertyType", label: "Property Types" },
    { key: "ReferredBy", label: "Referred By" },
  ];
 
  // Safe filter logic: handles empty/null fields and blank search
  const filteredData = agentDetails.filter((item) => {
    if (!searchTerm) return true; // show all if search is empty
 
    const lowerSearch = searchTerm.toLowerCase();
    const agentId =
      item.AgentId !== undefined && item.AgentId !== null
        ? item.AgentId.toString().toLowerCase()
        : "";
    const relationType =
      item.RelationshipType !== undefined && item.RelationshipType !== null
        ? item.RelationshipType.toLowerCase()
        : "";
 
    return agentId.includes(lowerSearch) || relationType.includes(lowerSearch);
  });
 
  if (error) return <div>Error: {error}</div>;
 
  return (
    <div
      className="dashboard-container"
      style={{ display: "flex", backgroundColor: "#fff" }}
    >
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
          <h2 style={{ margin: 0 }}>CRM Data</h2>
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
 
        {/* Single Search Bar */}
        <div
          style={{
            marginBottom: "16px",
          }}
        >
          <input
            type="text"
            placeholder="Search by Agent ID or Relationship Type"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "6px 10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              width: "300px",
            }}
          />
        </div>
 
        {/* Table or Loading */}
        {loading ? (
          <p>Loading....</p>
        ) : (
          <Table columns={columns} data={filteredData} rowsPerPage={15} />
        )}
      </div>
    </div>
  );
}
 
 