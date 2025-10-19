 import React, { useEffect, useState } from "react";
import Table from "../components/Table.jsx";

export default function UserFeedback() {
  const [data, setData] = useState([]);

  const API_URL = "https://imsdev.akrais.com:8444/AKRARealityLTAPI/api/data";
  const TOKEN =
    " eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InByYXNhbm5ha3Vra2FkYXB1MTNAZ21haWwuY29tIiwic3ViIjoiYjE5OTgzNjA1ZTg4NDIzY2EzOWJhYWIyYjI2MWJlNzYiLCJyb2xlIjoiQWdlbnQiLCJuYmYiOjE3NTgyNzA1MzQsImV4cCI6MTc1ODM1NjkzNCwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MTIwIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo1MTIwIn0.xjTmtXo_sq4orbSvaNryapM3kYXVrpyJqkES1agdXLESmIqvibpoZS1UvlTfbD3E-TX2bnyPaqyj9s4akbmbpQ";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}?requestParamType=UserFeedback`, {
          headers: { Authorization: `Bearer ${TOKEN}` },
        });
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error fetching UserFeedback:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>User Feedback</h2>
      <Table
        columns={["AgentName", "AverageRatings", "Complaints", "AgentResponseTime"]}
        data={data}
      />
    </div>
  );
}
