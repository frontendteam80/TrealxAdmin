
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
        background: "rgb(247, 250, 253)",
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
