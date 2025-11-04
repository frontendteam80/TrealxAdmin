 import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import { useApi } from "../../API/Api.js";

const AgentPanel = () => {
  const { fetchData } = useApi();
  const [agentData, setAgentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetchData("AgentPanel");
        let agents = [];
        if (Array.isArray(response)) agents = response;
        else if (response && Array.isArray(response.data)) agents = response.data;
        setAgentData(agents.map((item, idx) => ({ ...item, serialNo: idx + 1 })));
      } catch (err) {
        setError(err.message || "Error loading agent data");
        setAgentData([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [fetchData]);

  const columns = [
    { key: "serialNo", label: "S.No" },
    { key: "AgentName", label: "Agent Name" },
    { key: "TotalListings", label: "Total Listings" },
    { key: "AvgListingTime", label: "Avg Listing Time" },
    { key: "ApprovalRate", label: "Approval Rate" },
    { key: "ActiveListings", label: "Active Listings" },
    { key: "InActiveListings", label: "Inactive Listings" },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: 24 }}>
        <h2>Agent Panel</h2>

        {/* Inline Table (No Pagination) */}
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "16px",
              background: "#fff",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            <thead style={{ backgroundColor: "#f5f5f5" }}>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    style={{
                      textAlign: "left",
                      padding: "10px",
                      borderBottom: "1px solid #ddd",
                      fontWeight: "bold",
                    }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {agentData.length > 0 ? (
                agentData.map((row, idx) => (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: "1px solid #eee",
                      backgroundColor: idx % 2 === 0 ? "#fafafa" : "#fff",
                    }}
                  >
                    {columns.map((col) => (
                      <td key={col.key} style={{ padding: "10px" }}>
                        {row[col.key] ?? "-"}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} style={{ textAlign: "center", padding: "12px" }}>
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AgentPanel;
