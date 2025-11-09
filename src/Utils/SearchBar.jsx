
import React from "react";
import { Search } from "lucide-react"; // npm install lucide-react

const SearchBar = ({ value, onChange, onSubmit,pageLabel }) => (
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
      placeholder={`Search ${pageLabel || "..."}`}
      style={{
        padding: "8px 38px", // enough for icon, matches image spacing
        // paddingRight: "12px",
        // height: "38px",
        // width: "150px",
        border: "1.5px solid #222", // slightly darker border as per image
        borderRadius: "8px",
        fontSize: "16px",
        color: "#212121",
        background:" rgb(247, 250, 253)",
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
