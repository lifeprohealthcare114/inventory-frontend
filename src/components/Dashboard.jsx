import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import StatCard from "./StatCard";
import RecentTransactions from "./RecentTransactions";

// Register needed chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const barData = {
    labels: ["Raw Materials", "Finished Goods", "Tools & Equipment", "Stationery"],
    datasets: [
      {
        label: "Inventory Value",
        data: [42000, 32000, 18000, 5000],
        backgroundColor: "rgba(54,162,235,0.8)",
      },
    ],
  };

  const pieData = {
    labels: ["Raw Materials", "Finished Goods", "Tools & Equipment", "Stationery"],
    datasets: [
      {
        data: [40, 31, 22, 7],
        backgroundColor: ["#2b8bf2", "#23c27f", "#f5a623", "#ef4444"],
      },
    ],
  };

  return (
    <div className="container-fluid">
      <div className="d-flex gap-3 mb-3">
        <button className="btn btn-primary">+ Add Item</button>
        <button className="btn btn-light">+ New PO</button>
        <button className="btn btn-light">+ Stock Issue</button>
        <button className="btn btn-light">+ Stock Receipt</button>
          <button className="btn btn-light">+ Add Supplier</button>   
        <button className="btn btn-outline-primary">+ Bulk Import</button>
      </div>

      <div className="row g-3">
        <div className="col-md-4">
          <StatCard title="Inventory Value by Category">
            <div className="card-chart">
              <Bar
                data={barData}
                options={{
                  plugins: { legend: { display: false } },
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </StatCard>
        </div>

        <div className="col-md-4">
          <StatCard title="Category Distribution">
            <div className="card-chart">
              <Pie
                data={pieData}
                options={{
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "bottom" } },
                }}
              />
            </div>
          </StatCard>
        </div>

        <div className="col-md-4">
          <RecentTransactions />
        </div>

        <div className="col-12 mt-3">
          <div className="card p-4">
            <h5>Monthly Trends</h5>
            <div className="row mt-3">
              <div className="col-md-4">
                <div className="card p-3">
                  <h6>Jan</h6>
                  <div>Purchases: <strong>$25,000</strong></div>
                  <div>Sales: <strong>$18,000</strong></div>
                  <div>Adjustments: <strong>$2,000</strong></div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card p-3">
                  <h6>Feb</h6>
                  <div>Purchases: <strong>$30,000</strong></div>
                  <div>Sales: <strong>$22,000</strong></div>
                  <div>Adjustments: <strong>$1,500</strong></div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card p-3">
                  <h6>Mar</h6>
                  <div>Purchases: <strong>$28,000</strong></div>
                  <div>Sales: <strong>$25,000</strong></div>
                  <div>Adjustments: <strong>$1,200</strong></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
