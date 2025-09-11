import React, { useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import StatCard from "./StatCard";
import RecentTransactions from "./RecentTransactions";
import { useDataContext } from "../context/DataContext";

import ItemModal from "../components/itemsassets/ItemModal";
import SupplierModal from "../components/supplier/SupplierModal";
import PurchaseOrderModal from "../components/po/PurchaseOrderModal";

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
  const {
    items = [],
    categories = [],
    suppliers = [],
    purchaseOrders = [],
    stock = [],
    warehouses = [],
    addItem,
    addSupplier,
    addPurchaseOrder
  } = useDataContext() || {};

  const [activeModal, setActiveModal] = useState(null);

  const openModal = (name) => setActiveModal(name);
  const closeModal = () => setActiveModal(null);

  const isLoading =
    !items || !categories || !suppliers || !purchaseOrders || !stock || !warehouses;

  // ----------------- Charts -----------------
  const categoryNames = categories.map((c) => c.name);
  const categoryValues = categories.map((c) =>
    items
      .filter((i) => i.categoryId === c.id)
      .reduce((s, it) => s + Number(it.price || 0) * Number(it.quantity || 0), 0)
  );

  const barData = {
    labels: categoryNames.length ? categoryNames : ["No Data"],
    datasets: [
      {
        label: "Inventory Value",
        data: categoryValues.length ? categoryValues : [0],
        backgroundColor: "rgba(54,162,235,0.8)"
      }
    ]
  };

  const pieData = {
    labels: categoryNames.length ? categoryNames : ["No Data"],
    datasets: [
      {
        data: categories.length
          ? categories.map(
              (c) => items.filter((i) => i.categoryId === c.id).length
            )
          : [1],
        backgroundColor: ["#2b8bf2", "#23c27f", "#f5a623", "#ef4444", "#8b5cf6"]
      }
    ]
  };

  // ----------------- Transactions -----------------
  const transactions = [
    ...(purchaseOrders || []).map((po) => ({
      type: "PO",
      item: po.itemName || "N/A",
      qty: po.quantity,
      stock: po.status,
      date: po.date || "—",
      user: po.createdBy || "System"
    })),
    ...(stock || []).map((s) => ({
      type: s.type,
      item: s.itemName,
      qty: s.quantity,
      stock: s.balance,
      date: s.date,
      user: s.user || "System"
    }))
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // ----------------- Handlers -----------------
  const handleSaveItem = async (data) => {
    const payload = {
      ...data,
      quantity: Number(data.quantity),
      price: Number(data.price),
      categoryId: Number(data.categoryId),
      supplierId: Number(data.supplierId),
      warehouseId: Number(data.warehouseId)
    };
    await addItem?.(payload);
    closeModal();
  };

  const handleSaveSupplier = async (data) => {
    await addSupplier?.(data);
    closeModal();
  };

  const handleSavePO = async (data) => {
    await addPurchaseOrder?.(data);
    closeModal();
  };

  // ----------------- Render -----------------
  if (isLoading) {
    return (
      <div className="container-fluid text-center py-5">
        <h5>Loading dashboard...</h5>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Quick Actions */}
      <div className="d-flex gap-3 mb-3 flex-wrap">
        <button className="btn btn-primary" onClick={() => openModal("item")}>
          + Add Item
        </button>
        <button className="btn btn-light" onClick={() => openModal("po")}>
          + New PO
        </button>
        <button className="btn btn-light" onClick={() => openModal("supplier")}>
          + Add Supplier
        </button>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-3">
        <div className="col-md-2">
          <StatCard title="Total Items"><h4>{items.length}</h4></StatCard>
        </div>
        <div className="col-md-2">
          <StatCard title="Categories"><h4>{categories.length}</h4></StatCard>
        </div>
        <div className="col-md-2">
          <StatCard title="Suppliers"><h4>{suppliers.length}</h4></StatCard>
        </div>
        <div className="col-md-2">
          <StatCard title="Warehouses"><h4>{warehouses.length}</h4></StatCard>
        </div>
        <div className="col-md-2">
          <StatCard title="Purchase Orders"><h4>{purchaseOrders.length}</h4></StatCard>
        </div>
        <div className="col-md-2">
          <StatCard title="Stock Movements"><h4>{stock.length}</h4></StatCard>
        </div>
      </div>

      {/* Charts & Transactions */}
      <div className="row g-3">
        <div className="col-md-4">
          <StatCard title="Inventory Value by Category">
            <div className="card-chart" style={{ height: "250px" }}>
              <Bar
                data={barData}
                options={{
                  plugins: { legend: { display: false } },
                  maintainAspectRatio: false
                }}
              />
            </div>
          </StatCard>
        </div>
        <div className="col-md-4">
          <StatCard title="Category Distribution">
            <div className="card-chart" style={{ height: "250px" }}>
              <Pie
                data={pieData}
                options={{
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "bottom" } }
                }}
              />
            </div>
          </StatCard>
        </div>
        <div className="col-md-4">
          <RecentTransactions transactions={transactions} />
        </div>
      </div>

      {/* Modals */}
      {activeModal === "item" && (
        <ItemModal
          show={true}
          handleClose={closeModal}
          onSave={handleSaveItem}
          categories={categories}
          suppliers={suppliers}
          warehouses={warehouses}
        />
      )}
      {activeModal === "supplier" && (
        <SupplierModal
          show={true}
          onClose={closeModal}
          onSave={handleSaveSupplier}
        />
      )}
      {activeModal === "po" && (
        <PurchaseOrderModal
          show={true}
          onHide={closeModal}
          onSave={handleSavePO}
        />
      )}
    </div>
  );
}
