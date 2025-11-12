 // src/Utils/BackButton.jsx
import React from "react";

/**
 * Reusable BackButton — text-only, no icon.
 * Props:
 *  - onClick?: Function
 *  - to?: String (optional path)
 *  - label?: String (button text)
 *  - style?: inline style overrides
 */
export default function BackButton({ onClick, to, label = "Back", style = {} }) {
  const handleClick = (e) => {
    if (onClick) return onClick(e);
    if (to) {
      window.location.href = to;
    } else {
      window.history.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      aria-label="Back"
      style={{
        display: "inline-block",
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: "6px 14px",
        cursor: "pointer",
        color: "#121212",
        fontSize: "0.9rem",
        fontWeight: 600,
        ...style,
      }}
    >
      {label}
    </button>
  );
}
