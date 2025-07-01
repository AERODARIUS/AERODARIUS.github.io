import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

ChartJS.defaults.backgroundColor = "#f5f5f5";
ChartJS.defaults.borderColor = "#666";
ChartJS.defaults.color = "#ffffff";

const RadarChart = () => {
  const data = {
    labels: [
      "Frontend",
      "Backend",
      "DevOps",
      "Salesforce",
      "Data Science & AI/ML",
      "Firebase",
      "QA & Testing",
    ],
    datasets: [
      {
        label: "Skill set stats (%)",
        data: [90, 40, 30, 70, 20, 60, 30],
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(3, 41, 67, 0.7)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(3, 41, 67, 0.7)",
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      r: {
        ticks: {
          color: "#f9feff",
          backdropColor: "#1e1e28",
        },
        angleLines: { display: true },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
  };

  return <Radar data={data} options={options} />;
};

export default RadarChart;
