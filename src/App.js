import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./components/Dashboard";
import ItemsAssets from "./components/itemsassets/ItemsAssets";
import Categories from "./components/categories/Categories";
import Warehouses from "./components/warehouses/Warehouses";
import PurchaseOrders from "./components/po/PurchaseOrders"; 
import StockDashboard from "./components/Stock/StockDashboard"; 
import Supplier from "./components/supplier/Supplier";
import DataProvider from "./context/DataContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
                <Route path="/stock" element={<StockDashboard />} />
                <Route path="/suppliers" element={<Supplier />} />
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
