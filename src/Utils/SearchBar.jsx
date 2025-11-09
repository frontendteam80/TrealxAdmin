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
import { Search } from "lucide-react"; // npm install lucide-react

const SearchBar = ({ value, onChange, onSubmit }) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      onSubmit?.(e);
    }}
    style={{ position: "relative", width: "100%",  }} // max width as in image
  >
    {/* Input */}
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search..."
      style={{
        padding: "8px 38px", // enough for icon, matches image spacing
        // paddingRight: "12px",
        // height: "38px",
        // width: "150px",
        border: "1.5px solid #222", // slightly darker border as per image
        borderRadius: "8px",
        fontSize: "16px",
        color: "#212121",
        background: "#fff",
        outline: "none",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        transition: "border-color 0.2s",
      }}
      className="searchbar-input" // optional: for further CSS targeting
    />

    {/* Icon */}
    <Search
      size={19}
      style={{
        position: "absolute",
        left: "12px",
        top: "50%",
        transform: "translateY(-50%)",
        color: "#636363",
        pointerEvents: "none",
        opacity: 0.85,
      }}
    />
  </form>
);

export default SearchBar;
