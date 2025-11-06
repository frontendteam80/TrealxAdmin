//  // src/components/SearchBar.jsx
// import React from "react";
// import { Search } from "lucide-react"; // npm install lucide-react

// const SearchBar = ({ value, onChange, onSubmit }) => (
//   <form
//     onSubmit={(e) => {
//       e.preventDefault();
//       onSubmit?.(e);
//     }}
//     className="relative w-[450px]" // increased width
//   >
//     {/* Search Input */}
//     <input
//       type="text"
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       placeholder="Search by location, Associated Partner, ID..."
//       className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 shadow-sm"
//       style={{ height: "42px" }}
//     />

//     {/* Search Icon inside box */}
//     <Search
//       size={18}
//       className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
//     />
//   </form>
// );

// export default SearchBar;
 // src/components/SearchBar.jsx
import React from "react";
import { Search } from "lucide-react";

const SearchBar = ({ value, onChange, onSubmit }) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      onSubmit?.(e);
    }}
    style={{
      position: "relative",
      width: "320px", // Match your image or parent width
      // margin: "0 auto",
    }}
  >
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search..."
      style={{
        width: "100%",
        height: "38px",
        paddingLeft: "34px",
        paddingRight: "10px",
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: "8px",
        fontSize: "16px",
        color: "#333",
        outline: "none",
        boxSizing: "border-box",
        transition: "border-color 0.15s",
      }}
    />
    <Search
      size={20}
      style={{
        position: "absolute",
        left: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        color: "#939393",
        pointerEvents: "none",
      }}
    />
  </form>
);

export default SearchBar;
