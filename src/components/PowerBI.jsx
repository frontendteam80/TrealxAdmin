export default function PowerBIDashboard() {
  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>My Power BI Dashboard</h2>

      <iframe
        title="Sales & Customer Dashboard"
        width="100%"
        height="600"
        style={{ border: "0", borderRadius: "10px" }}
        src="https://app.powerbi.com/reportEmbed?reportId=4ed9259f-1373-4bfe-a445-4a55-9ddd-17062a14136a&actionBarEnabled=true&reportCopilotInEmbed=true"
        allowFullScreen={true}
      ></iframe>
    </div>
  );
}
