import React, { useState } from "react";
import WarehouseTable from "./WarehousesTable";
import WarehouseModal from "./WarehouseModal";
import WarehouseDeleteModal from "../DeleteConfirmModal";
import { Card, Row, Col } from "react-bootstrap";

export default function Warehouses() {
  // Dummy sample warehouses
  const [warehouses, setWarehouses] = useState([
    {
      id: 1,
      name: "Central Warehouse",
      location: "New Delhi",
      manager: "Rajesh Kumar",
      contact: "9876543210",
      capacity: 5000,
      itemsCount: 1200,
      value: 250000,
      status: "Active",
    },
    {
      id: 2,
      name: "South Hub",
      location: "Chennai",
      manager: "Anita Singh",
      contact: "9988776655",
      capacity: 3000,
      itemsCount: 800,
      value: 150000,
      status: "Active",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editWarehouse, setEditWarehouse] = useState(null);
  const [deleteWarehouse, setDeleteWarehouse] = useState(null);

  // Add or update
  const handleSave = (warehouse) => {
    if (editWarehouse) {
      setWarehouses(
        warehouses.map((w) => (w.id === editWarehouse.id ? warehouse : w))
      );
    } else {
      setWarehouses([...warehouses, { ...warehouse, id: Date.now() }]);
    }
    setShowModal(false);
    setEditWarehouse(null);
  };

  // Delete
  const handleDelete = () => {
    setWarehouses(warehouses.filter((w) => w.id !== deleteWarehouse.id));
    setDeleteWarehouse(null);
  };

  // Stats
  const totalCapacity = warehouses.reduce((sum, w) => sum + w.capacity, 0);
  const totalItems = warehouses.reduce((sum, w) => sum + w.itemsCount, 0);
  const totalValue = warehouses.reduce((sum, w) => sum + w.value, 0);

  return (
    <div>
      {/* 📊 Stats Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="p-3 shadow-sm">
            <h6>Total Warehouses</h6>
            <h4>{warehouses.length}</h4>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="p-3 shadow-sm">
            <h6>Total Capacity</h6>
            <h4>{totalCapacity}</h4>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="p-3 shadow-sm">
            <h6>Total Items</h6>
            <h4>{totalItems}</h4>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="p-3 shadow-sm">
            <h6>Total Value</h6>
            <h4>₹{totalValue}</h4>
          </Card>
        </Col>
      </Row>

      {/* Table */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Warehouses</h3>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditWarehouse(null);
            setShowModal(true);
          }}
        >
          + Add Warehouse
        </button>
      </div>

      <WarehouseTable
        warehouses={warehouses}
        onEdit={(w) => {
          setEditWarehouse(w);
          setShowModal(true);
        }}
        onDelete={(w) => setDeleteWarehouse(w)}
      />

      {/* Add/Edit Modal */}
      <WarehouseModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setEditWarehouse(null);
        }}
        onSave={handleSave}
        warehouse={editWarehouse}
      />

      {/* Delete Modal */}
    <WarehouseDeleteModal
  show={!!deleteWarehouse} // true if something selected
  onClose={() => setDeleteWarehouse(null)}
  onConfirm={handleDelete}
/>

    </div>
  );
}
