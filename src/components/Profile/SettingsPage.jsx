// import { useState } from "react";

// export default function SettingsPage() {
//   // Hardcoded/default settings data
//   const [notificationEnabled, setNotificationEnabled] = useState(true);
//   const [theme, setTheme] = useState("light");

//   return (
//     <section style={{ padding: 20 }}>
//       <h2>Settings</h2>
//       <div>
//         <label>
//           <input
//             type="checkbox"
//             checked={notificationEnabled}
//             onChange={() => setNotificationEnabled((prev) => !prev)}
//           />
//           Enable notifications
//         </label>
//       </div>
//       <div style={{ marginTop: 10 }}>
//         <label>
//           Theme:
//           <select value={theme} onChange={(e) => setTheme(e.target.value)} style={{ marginLeft: 10 }}>
//             <option value="light">Light</option>
//             <option value="dark">Dark</option>
//           </select>
//         </label>
//       </div>
//     </section>
//   );
// }
