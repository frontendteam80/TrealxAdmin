// src/components/SearchBar.jsx
import React from "react";
// import "./SearchBar.css";
 
const SearchBar = ({ value, onChange, onSubmit }) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      onSubmit?.(e);
    }}
    className="flex items-center gap-2 w-full max-w-md border rounded-lg px-3 py-0 bg-white"
  >
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search by location,Associatedpartner,id..."
      className="flex-1 outline-none text-gray-700 px-3"
      style={{height:32}}
    />
    <button
      type="submit"
      className="bg-blue-600 text-white px-3  rounded hover:bg-blue-700"
      style={{height:32}}
    >
      Search
    </button>
  </form>
);
 
 
export default SearchBar;
 