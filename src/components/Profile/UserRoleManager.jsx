// import { useState, useEffect } from "react";

// const dummyUsers = [
//   { id: 1, name: "John Doe", email: "john@acme.com", role: "Admin", status: "Active" },
//   { id: 2, name: "Jane Boss", email: "jane@acme.com", role: "Super Admin", status: "Active" },
//   { id: 3, name: "Mark Smith", email: "mark@acme.com", role: "User", status: "Inactive" },
// ];

// export default function UserRoleManager() {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     setUsers(dummyUsers);
//   }, []);

//   const roles = ["User", "Admin", "Super Admin"];

//   const handleRoleChange = (id, newRole) => {
//     setUsers((prevUsers) =>
//       prevUsers.map((user) => (user.id === id ? { ...user, role: newRole } : user))
//     );
//   };

//   return (
//     <section style={{ padding: 20 }}>
//       <h2>User Role Management</h2>
//       <table border="1" cellPadding="8" cellSpacing="0" style={{ borderCollapse: "collapse", width: "100%" }}>
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Role</th>
//             <th>Status</th>
//             <th>Change Role</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map(({ id, name, email, role, status }) => (
//             <tr key={id}>
//               <td>{name}</td>
//               <td>{email}</td>
//               <td>{role}</td>
//               <td>{status}</td>
//               <td>
//                 <select value={role} onChange={(e) => handleRoleChange(id, e.target.value)}>
//                   {roles.map((r) => (
//                     <option key={r} value={r}>{r}</option>
//                   ))}
//                 </select>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </section>
//   );
// }
