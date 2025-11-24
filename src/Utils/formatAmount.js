export default function formatAmount(val) {
  if (val === null || val === undefined) return "";
  let num = typeof val === "string" ? parseFloat(val.replace(/[^0-9.]/g, "")) : val;
  if (isNaN(num)) return "";
  let unit = "";
  let value = num;
  if (num >= 10000000) {
    value = (num / 10000000).toFixed(2);
    unit = " Cr";
  } else if (num >= 100000) {
    value = (num / 100000).toFixed(2);
    unit = " L";
  } else if (num >= 1000) {
    value = (num / 1000).toFixed(2);
    unit = " K";
  } else {
    value = num.toString();
  }
  // Remove trailing ".00"
  if (value.endsWith(".00")) value = value.slice(0, -3);
  return `₹${value}${unit}`;
}
