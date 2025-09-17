import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar d-flex flex-column p-0">
      <div className="brand d-flex align-items-center border-bottom p-3">
        <strong>Inventory ERP</strong>
      </div>

      <nav className="flex-column pt-3">
        <NavLink to="/" className="nav-link">Dashboard</NavLink>
        <NavLink to="/items" className="nav-link">Items & Assets</NavLink>
        <NavLink to="/categories" className="nav-link">Categories</NavLink>
        <NavLink to="/warehouses" className="nav-link">Warehouses</NavLink>
        <NavLink to="/purchase-orders" className="nav-link">Purchase Orders</NavLink>
        <NavLink to="/suppliers" className="nav-link">Suppliers</NavLink>

        {/* 🔹 Stock Management Section */}
        <div className="mt-3 px-3 text-muted small">Stock Management</div>
        <NavLink to="/stock-movements" className="nav-link">Stock Movements</NavLink>
        <NavLink to="/stock-adjustments" className="nav-link">Stock Adjustments</NavLink>
        <NavLink to="/alerts/low-stock" className="nav-link">Low Stock Alerts</NavLink>
        <NavLink to="/issue-consumption" className="nav-link">Issue & Consumption</NavLink>
      </nav>
    </div>
  );
}
