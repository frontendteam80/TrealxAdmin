 import React from "react";
import Table,{Pagination} from "../../Utils/Table.jsx";
 
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
 
      <Table  columns={columns} paginatedData={agents} rowsPerPage={7} />
    </div>
  );
}
 