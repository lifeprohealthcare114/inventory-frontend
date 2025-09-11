import React, { useState } from "react";
import WarehouseTable from "./WarehousesTable";
import WarehouseModal from "./WarehouseModal";
import WarehouseDeleteModal from "../DeleteConfirmModal";
import { Card, Row, Col } from "react-bootstrap";
import { useDataContext } from "../../context/DataContext";

export default function Warehouses() {
  const { warehouses, addWarehouse, editWarehouse, removeWarehouse } = useDataContext();

  const [showModal, setShowModal] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [deleteWarehouse, setDeleteWarehouse] = useState(null);

  const handleSave = async (warehouse) => {
    if (selectedWarehouse) {
      await editWarehouse(selectedWarehouse.id, warehouse);
    } else {
      await addWarehouse(warehouse);
    }
    setShowModal(false);
    setSelectedWarehouse(null);
  };

  const handleDelete = async () => {
    if (deleteWarehouse) {
      await removeWarehouse(deleteWarehouse.id);
      setDeleteWarehouse(null);
    }
  };

  const totalCapacity = warehouses.reduce((sum, w) => sum + (w.capacity || 0), 0);
  const totalItems = warehouses.reduce((sum, w) => sum + (w.itemsCount || 0), 0);
  const totalValue = warehouses.reduce((sum, w) => sum + (w.value || 0), 0);

  return (
    <div>
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

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Warehouses</h3>
        <button
          className="btn btn-primary"
          onClick={() => {
            setSelectedWarehouse(null);
            setShowModal(true);
          }}
        >
          + Add Warehouse
        </button>
      </div>

      <WarehouseTable
        warehouses={warehouses}
        onEdit={(w) => {
          setSelectedWarehouse(w);
          setShowModal(true);
        }}
        onDelete={(w) => setDeleteWarehouse(w)}
      />

      <WarehouseModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setSelectedWarehouse(null);
        }}
        onSave={handleSave}
        warehouse={selectedWarehouse}
      />

      <WarehouseDeleteModal
        show={!!deleteWarehouse}
        onClose={() => setDeleteWarehouse(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
