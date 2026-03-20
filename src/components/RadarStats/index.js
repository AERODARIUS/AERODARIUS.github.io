import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const chartThemePalette = {
  light: {
    fill: "rgba(17, 76, 95, 0.16)",
    border: "#114c5f",
    point: "#0f766e",
    text: "#16202b",
    muted: "#5a6774",
    grid: "rgba(22, 32, 43, 0.12)",
  },
  dark: {
    fill: "rgba(107, 216, 194, 0.16)",
    border: "#6bd8c2",
    point: "#9ae6da",
    text: "#e7eef6",
    muted: "#a7b6c6",
    grid: "rgba(216, 230, 242, 0.16)",
  },
};

const RadarChart = ({ theme = "light" }) => {
  const palette = chartThemePalette[theme] || chartThemePalette.light;
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
        backgroundColor: palette.fill,
        borderColor: palette.border,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 4,
        pointBackgroundColor: palette.point,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      r: {
        suggestedMin: 0,
        suggestedMax: 100,
        angleLines: {
          color: palette.grid,
        },
        grid: {
          color: palette.grid,
        },
        pointLabels: {
          color: palette.text,
          font: {
            family: "IBM Plex Mono",
            size: 12,
          },
        },
        ticks: {
          color: palette.muted,
          backdropColor: "transparent",
          font: {
            family: "IBM Plex Mono",
            size: 10,
          },
        },
      },
    },
  };

  return (
    <div
      className="radar-stats"
      role="img"
      aria-label="Radar chart summarizing Dario Cruz's skill areas across frontend, backend, DevOps, Salesforce, data science and AI, Firebase, and QA and testing."
    >
      <Radar data={data} options={options} />
    </div>
  );
};

export default RadarChart;
