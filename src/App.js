import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./components/Dashboard";
import ItemsAssets from "./components/itemsassets/ItemsAssets";
import Categories from "./components/categories/Categories";
import Warehouses from "./components/warehouses/Warehouses";
import PurchaseOrders from "./components/po/PurchaseOrders";
import Supplier from "./components/supplier/Supplier";
import DataProvider from "./context/DataContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 🔹 Stock imports
import StockMovementList from "./components/StockMovements/StockMovementList";
import StockMovementModal from "./components/StockMovements/StockMovementModal";
import StockAdjustmentList from "./components/StockAdjustments/StockAdjustmentsList";
import StockAdjustmentForm from "./components/StockAdjustments/StockAdjustmentsForm";
import LowStockList from "./components/Alerts/LowStockList";
import ReorderModal from "./components/Alerts/ReorderModal";

// 🔹 Issuance & Consumption (Tabs)
import IssueReturnConsumptionTabs from "./components/IssueReturn/IssueReturnConsumptionTabs";
import IssueForm from "./components/IssueReturn/IssueForm";
import ConsumptionForm from "./components/IssueReturn/ConsumptionForm";

export default function App() {
  return (
    <DataProvider>
      <Router>
        <div className="app-root d-flex">
          {/* Sidebar on the left */}
          <Sidebar />

          {/* Main content area */}
          <div className="main-content flex-fill">
            <Topbar />

            {/* Page content wrapper */}
            <div className="p-4">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/items" element={<ItemsAssets />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/warehouses" element={<Warehouses />} />
                <Route path="/purchase-orders" element={<PurchaseOrders />} />
                <Route path="/suppliers" element={<Supplier />} />

                {/* 🔹 Stock Movement */}
                <Route path="/stock-movements" element={<StockMovementList />} />
                <Route path="/stock-movement/:id" element={<StockMovementModal />} />

                {/* 🔹 Stock Adjustments */}
                <Route path="/stock-adjustments" element={<StockAdjustmentList />} />
                <Route path="/stock-adjustment/new" element={<StockAdjustmentForm />} />
                <Route path="/stock-adjustment/:id" element={<StockAdjustmentForm />} />

                {/* 🔹 Low Stock Alerts */}
                <Route path="/alerts/low-stock" element={<LowStockList />} />
                <Route path="/alerts/reorder" element={<ReorderModal />} />

                {/* 🔹 Issuance & Consumption Tabs */}
                <Route path="/issue-consumption" element={<IssueReturnConsumptionTabs />} />
                <Route path="/issue-consumption/issue/new" element={<IssueForm />} />
                <Route path="/issue-consumption/consumption/new" element={<ConsumptionForm />} />
              </Routes>
            </div>

            {/* Global toast notifications */}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </div>
        </div>
      </Router>
    </DataProvider>
  );
}
