import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // ✅ React Query
import { AuthProvider } from "./auth/AuthContext.jsx";
import App from "./App.jsx";
import "./styles/layout.scss";

// ✅ Initialize React Query client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // ✅ React Query
// import { AuthProvider } from "./auth/AuthContext.jsx";
// import App from "./App.jsx";
// import "./styles/layout.scss";

// // ✅ Ensure correct theme before React mounts
// const savedTheme = localStorage.getItem("theme") || "light";
// if (savedTheme === "dark") {
//   document.body.classList.add("dark-theme");
// } else {
//   document.body.classList.remove("dark-theme");
// }

// // ✅ Initialize React Query client
// const queryClient = new QueryClient();

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <AuthProvider>
//         <QueryClientProvider client={queryClient}>
//           <App />
//         </QueryClientProvider>
//       </AuthProvider>
//     </BrowserRouter>
//   </React.StrictMode>
// );
