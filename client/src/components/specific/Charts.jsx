import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import React from "react";
import { Doughnut, Line } from "react-chartjs-2";
import { getLast7Days } from "../../lib/features";
import { purple, purpleLight } from "../constants/color";

ChartJS.register(
  CategoryScale,
  Tooltip,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
  ArcElement,
  Legend
);

export const LineChart = ({ value = [] }) => {
  const labels = getLast7Days();
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: "Chart.js Line Chart",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
    },
  };
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Chats",
        data: value,
        borderColor: purple,
        backgroundColor: purpleLight,
      },
    ],
  };
  return <Line data={data} />;
};

const doughChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: "top",
    },
    title: {
      display: false,
      // text: "Chart.js Doughnut Chart",
    },
  },
  cutout: "120",
};
export const DoughnutChart = ({ value = [], labels = [] }) => {
  const data = {
    labels: labels,
    datasets: [
      {
        offsets: 30,
        label: "Total Chats vs Group Chats",
        data: value,
        backgroundColor: [`rgba(75,12,192,0.5)`, `rgba(75,12,192,0.2)`],
        // backgroundColor: [green, orange],
        // borderColor: [green, orange],
        borderColor: [`rgba(75,12,192,1)`, `rgba(75,12,192,0.5)`],
        hoverBackgroundColor: [`rgba(75,12,192,0.2)`, `rgba(75,12,192,0.5)`],
      },
    ],
  };
  return <Doughnut data={data} options={doughChartOptions} style={{zIndex: 10}}/>;
  console.log(value, labels);
};
