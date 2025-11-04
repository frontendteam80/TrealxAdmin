 import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import { useApi } from "../../API/Api.js";

export default function UserFeedback() {
  const { fetchData } = useApi();
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      console.log("🔄 Fetching UserFeedback data...");
      try {
        const result = await fetchData("UserFeedBack");
        console.log("✅ Raw API Response:", result);

        let arr = [];
        if (Array.isArray(result)) arr = result;
        else if (Array.isArray(result?.data)) arr = result.data;
        else if (Array.isArray(result?.response)) arr = result.response;
        else console.warn("⚠️ Unexpected data format:", result);

        // Always map to unified structure
        arr = arr.map((item, idx) => ({
          sno: idx + 1,
          AgentName: item.AgentName || item.agent_name || item.name || "-",
          AverageRatings: item.AverageRatings || item.average_ratings || item.rating || "-",
          Complaints: item.Complaints || item.complaints || item.total_complaints || "-",
          AgentResponseTime: item.AgentResponseTime || item.agent_response_time || item.response_time || "-",
        }));

        console.log("📊 Parsed Data:", arr);
        setFeedbackData(arr);
      } catch (err) {
        console.error("❌ Error fetching data:", err);
        setError(err.message || "Failed to fetch feedback data");
        setFeedbackData([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [fetchData]);

  const columns = [
    { key: "sno", label: "S.No" },
    { key: "AgentName", label: "Agent Name" },
    { key: "AverageRatings", label: "Average Ratings" },
    { key: "Complaints", label: "Complaints" },
    { key: "AgentResponseTime", label: "Agent Response Time" },
  ];

  // --- UI ---
  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "20%" }}>Loading...</div>;
  }

  return (
    <div className="dashboard-container" style={{ display: "flex", backgroundColor: "#fff" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: 24 }}>
        <h2 style={{ marginBottom: 20 }}>User Feedback</h2>

        {error && (
          <div style={{ color: "red", marginBottom: 10, fontWeight: "bold" }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
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
              {feedbackData.length > 0 ? (
                feedbackData.map((row, idx) => (
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
                  <td
                    colSpan={columns.length}
                    style={{
                      textAlign: "center",
                      padding: "12px",
                      fontStyle: "italic",
                    }}
                  >
                    No feedback data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
