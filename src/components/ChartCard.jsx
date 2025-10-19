 import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
    Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "./ChartCard.scss";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

export default function ChartCard({ title, subtitle, dataPoints, color }) {
  const labels = ["Mar", "May", "Jul", "Sep", "Nov", "Dec"]; // adjust as needed

  const data = {
    labels,
    datasets: [
      {
        label: title,
        data: dataPoints,
        backgroundColor: "transparent",
        borderColor: color,
        pointBackgroundColor: color,
        borderWidth: 2,
        fill: true,   // no fill under the line
        tension: 0,    // straight line
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#344767" },
      },
      y: {
        grid: { color: "#e0e0e0" },
        ticks: { color: "#344767" },
      },
    },
  };

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h4>{title}</h4>
        {subtitle && <span className="subtitle">{subtitle}</span>}
      </div>
      <Line data={data} options={options} />
    </div>
  );
}
