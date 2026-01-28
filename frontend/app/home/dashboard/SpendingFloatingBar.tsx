"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

type SpendingData = {
  month: string;
  amount: number;
};

const spendingTrends: SpendingData[] = [
  { month: "Jan", amount: 38000 },
  { month: "Feb", amount: 42000 },
  { month: "Mar", amount: 35000 },
  { month: "Apr", amount: 48000 },
  { month: "May", amount: 42300 },
];

const data = {
  labels: spendingTrends.map((item) => item.month),
  datasets: [
    {
      label: "Monthly Spend",
      // Floating bar → [start, end]
      data: spendingTrends.map((item) => [0, item.amount]),
      backgroundColor: (ctx: any) => {
        const index = ctx.dataIndex;
        return index === spendingTrends.length - 1
          ? "rgba(139, 92, 246, 0.9)" // violet (current month)
          : "rgba(203, 213, 225, 0.9)"; // slate
      },
      borderRadius: 12,
      borderSkipped: false,
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
    tooltip: {
      callbacks: {
        label: (ctx: any) =>
          `₹${ctx.raw[1].toLocaleString()}`,
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        color: "#e5e7eb",
      },
      ticks: {
        callback: (value: any) => `₹${value / 1000}k`,
      },
    },
  },
};

export default function SpendingFloatingBar() {
  return (
    <div className="h-64 w-full">
      <Bar data={data} options={options} />
    </div>
  );
}
