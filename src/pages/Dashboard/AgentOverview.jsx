import React, { useEffect, useState } from "react";
import Table from "./Table.jsx";

export default function UserFeedback() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchUserFeedback = async () => {
      try {
        const res = await fetch(
          "https://imsdev.akrais.com:8444/AKRARealityLTAPI/api/data?requestParamType=UserFeedback",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InByYXNhbm5ha3Vra2FkYXB1MTNAZ21haWwuY29tIiwic3ViIjoiYjE5OTgzNjA1ZTg4NDIzY2EzOWJhYWIyYjI2MWJlNzYiLCJyb2xlIjoiQWdlbnQiLCJuYmYiOjE3NTgyNzA1MzQsImV4cCI6MTc1ODM1NjkzNCwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MTIwIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo1MTIwIn0.xjTmtXo_sq4orbSvaNryapM3kYXVrpyJqkES1agdXLESmIqvibpoZS1UvlTfbD3E-TX2bnyPaqyj9s4akbmbpQ 
 `,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch User Feedback");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserFeedback();
  }, []);

  return (
    <Table
      title="User Feedback"
      data={data}
      columns={[
        "AgentName",
        "AverageRatings",
        "Complaints",
        "AgentResponseTime",
      ]}
    />
  );
}
