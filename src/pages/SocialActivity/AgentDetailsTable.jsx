// import React from "react";

// export default function AgentDetailsTable({ agents, shareUnit, onClose }) {
//   return (
//     <div>
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
//         <h3 style={{ margin: 0 }}>Agent Details</h3>
//         <button
//           onClick={onClose}
//           style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, fontWeight: "bold" }}
//           title="Close"
//         >
//           &times;
//         </button>
//       </div>
//       <div style={{ marginBottom: 12 }}>
//         <strong>Property:</strong> {shareUnit?.type} (ID: {shareUnit?.id})
//       </div>
//       <table style={{ width: "100%", borderCollapse: "collapse" }}>
//         <thead>
//           <tr>
//             <th>Associate Name</th>
//             <th>Mobile Number</th>
//             <th>Projects Associated</th>
//             <th>Specialization</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {(agents || []).map((agent) => (
//             <tr key={agent.AgentsDataID}>
//               <td>{agent.AssociateName}</td>
//               <td>{agent.MobileNumber}</td>
//               <td>{agent.projectsAssociated}</td>
//               <td>{agent.SpecializedInPropertyType}</td>
//               <td>
//                 <button
//                   style={{
//                     padding: "3px 8px",
//                     background: "#024f4f",
//                     color: "#fff",
//                     border: "none",
//                     borderRadius: 5,
//                     cursor: "pointer",
//                   }}
//                   onClick={() => {
//                     const shareUrl = `${window.location.origin}/details/${shareUnit?.id}?project=${shareUnit?.projectId || ""}`;
//                     navigator.clipboard.writeText(`Agent:${agent.AssociateName}, Property: ${shareUrl}`);
//                     alert(`Shared with ${agent.AssociateName}!\n\nProperty: ${shareUrl}`);
//                   }}
//                 >
//                   Share
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
import React from "react";
import Table from "../../components/Table.jsx"; // path to your reusable table component

export default function AgentDetailsTable({ agents = [], shareUnit, onClose }) {
  const columns = [
    { key: "AssociateName", label: "Associate Name" },
    { key: "MobileNumber", label: "Mobile Number" },
    { key: "projectsAssociated", label: "Projects Associated" },
    { key: "SpecializedInPropertyType", label: "Specialization" },
    {
      key: "action",
      label: "Action",
      render: (_, agent) => (
        <button
          style={{
            padding: "3px 8px",
            background: "#024f4f",
            color: "#fff",
            border: "none",
            borderRadius: 5,
            cursor: "pointer"
          }}
          onClick={() => {
            const shareUrl = `${window.location.origin}/details/${shareUnit?.id}?project=${shareUnit?.projectId || ""}`;
            navigator.clipboard.writeText(
              `Agent: ${agent.AssociateName}, Property: ${shareUrl}`
            );
            alert(`Shared with ${agent.AssociateName}!\n\nProperty: ${shareUrl}`);
          }}
        >
          Share
        </button>
      )
    }
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12
        }}
      >
        <h3 style={{ margin: 0 }}>Agent Details</h3>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 20,
            fontWeight: "bold"
          }}
          title="Close"
        >
          &times;
        </button>
      </div>

      <div style={{ marginBottom: 12 }}>
        <strong>Property:</strong> {shareUnit?.type} (ID: {shareUnit?.id})
      </div>

      <Table  columns={columns} data={agents} rowsPerPage={7} />
    </div>
  );
}
