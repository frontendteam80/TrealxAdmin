//  // src/pages/Updates/Updates.jsx
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Sidebar from "../../components/Sidebar.jsx";
// import { useApi } from "../../API/Api.js";
// import "./Updates.scss";

// function formatDate(dateString) {
//   if (!dateString) return "—";
//   const [day, month, year] = dateString.split("-");
//   return `${day.padStart(2, "0")}-${month.padStart(2, "0")}-${year}`;
// }

// export default function Updates() {
//   const [priceUpdates, setPriceUpdates] = useState([]);
//   const { fetchData } = useApi();
//   const navigate = useNavigate();

//   useEffect(() => {
//     async function loadData() {
//       const updates = await fetchData("PriceUpdatesDetails");
//       setPriceUpdates(updates || []);
//     }
//     loadData();
//   }, [fetchData]);

//   const handleClick = (projectID) => {
//     navigate(`/price-history/${projectID}`);
//   };

//   return (
//     <div className="dashboard-container">
//       <Sidebar />
//       <main className="main-content">
//         {/* Profile name aligned to top-right */}
//         {/* <div
//         className="buyers-content"
//         style={{
//           flex: 1,
//           position: "relative",
//           minHeight: "100vh",
//           maxWidth: "calc(100vw - 260px)",
//           overflowX: "auto",
//           // padding: 24,
//         }}
//       > */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             marginBottom: 20,
//           }}
//         >
//           <h2 style={{ margin: 0 }}>Updates</h2>
//           <div
//             style={{
//               fontWeight: "bold",
//               fontSize: "1.1rem",
//               color: "#d4af37",
//             }}
//           >
//             Prasanna Kukkadapu
//           </div>
//         </div>
        

//         <div className="table-section">
//           <table className="updates-table">
//             <thead>
//               <tr>
//                 <th className="serial">S.No</th> {/* Serial Number */}
//                 <th>ID</th>
//                 <th>Project Name</th>
//                 <th>Locality</th>
//                 <th>New Price</th>
//                 <th>New Updated Date</th>
//                 <th>Updated By</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {priceUpdates.length > 0 ? (
//                 priceUpdates.map((update, index) => (
//                   <tr key={update.ProjectID}>
//                     <td className="serial">{index + 1}</td> {/* Serial number */}
//                     <td>{update.ProjectID}</td>
//                     <td>{update.ProjectName}</td>
//                     <td>{update.Locality}</td>
//                     <td>{update.NewPriceRange}</td>
//                     <td>{formatDate(update.NewUpdatedDate)}</td>
//                     <td>{update.UpdatedBy}</td>
//                     <td>
//                       <button
//                         className="action-button"
//                         onClick={() => handleClick(update.ProjectID)}
//                       >
//                         Click
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="8" style={{ textAlign: "center", padding: "12px" }}>
//                     Data loading...
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//         {/* </div> */}
//       </main>
//     </div>
    
//   );
// }
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
 import Sidebar from "../../components/Sidebar.jsx";
import { useApi } from "../../API/Api.js";
//import Table from "../../Utils/Table.jsx";
import Table from "../../Utils/Table.jsx";
import "./Updates.scss";
 
function formatDate(dateString) {
  if (!dateString) return "—";
  const [day, month, year] = dateString.split("-");
  return `${day.padStart(2, "0")}-${month.padStart(2, "0")}-${year}`;
}
 
export default function Updates() {
  const [priceUpdates, setPriceUpdates] = useState([]);
  const { fetchData } = useApi();
  const navigate = useNavigate();
 
  useEffect(() => {
    async function loadData() {
      const updates = await fetchData("PriceUpdatesDetails");
      setPriceUpdates(updates || []);
    }
    loadData();
  }, [fetchData]);
 
  const columns = [
    { key: "serial", label: "S.No", render: (v, row, idx) => idx + 1 },
    { key: "ProjectID", label: "ID" },
    { key: "ProjectName", label: "Project Name" },
    { key: "Locality", label: "Locality" },
    { key: "NewPriceRange", label: "New Price" },
    {
      key: "NewUpdatedDate",
      label: "New Updated Date",
      render: formatDate
    },
    { key: "UpdatedBy", label: "Updated By" },
    {
      key: "action",
      label: "Action",
      render: (v, row) => (
        <button
          className="action-button"
          onClick={() => navigate(`/price-history/${row.ProjectID}`)}
        >
          Click
        </button>
      )
    }
  ];
 
  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <h2 style={{ margin: 0 }}>Updates</h2>
          <div
            style={{
              fontWeight: "bold",
              fontSize: "1.1rem",
              color: "#d4af37",
            }}
          >
            Prasanna Kukkadapu
          </div>
        </div>
        <div className="table-section">
          <Table
            columns={columns}
            data={priceUpdates}
            rowsPerPage={10}
          />
        </div>
      </main>
    </div>
  );
}
 