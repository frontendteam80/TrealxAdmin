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
    className="relative w-[450px]" // increased width
  >
    {/* Search Input */}
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search by location, Associated Partner, ID..."
      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 shadow-sm"
      style={{ height: "42px" }}
    />
 
    {/* Search Icon inside box */}
    <Search
      size={18}
      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
    />
  </form>
);
 
export default SearchBar;