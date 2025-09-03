import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar d-flex flex-column p-0">
      <div className="brand d-flex align-items-center border-bottom">
        Inventory ERP
      </div>
      <nav className="flex-column pt-3">
        <NavLink to="/" className="nav-link">
          Dashboard
        </NavLink>
        <NavLink to="/items" className="nav-link">
          Items & Assets
        </NavLink>
        <NavLink to="/categories" className="nav-link">
          Categories
        </NavLink>
        <NavLink to="/warehouses" className="nav-link">
          Warehouses
        </NavLink>
        <NavLink to="/purchase-orders" className="nav-link">
          Purchase Orders
        </NavLink>
        <NavLink to="/stock" className="nav-link">
          Stock
        </NavLink>
        <NavLink to="/suppliers" className="nav-link"> {/* ✅ New Menu Item */}
          Suppliers
        </NavLink>
        {/* <NavLink to="#" className="nav-link mt-auto">
          Settings
        </NavLink> */}
      </nav>
    </div>
  );
}
