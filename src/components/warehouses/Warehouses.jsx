import React, { useEffect } from "react";
import WarehouseTable from "./WarehousesTable";
import WarehouseModal from "./WarehouseModal";
import WarehouseDeleteModal from "../DeleteConfirmModal";
import { Card, Row, Col, InputGroup, Form, Button, Spinner } from "react-bootstrap";
import { useDataContext } from "../../context/DataContext";

export default function Warehouses() {
  const {
    warehouses,
    warehousesPage,
    setWarehousesPage,
    warehousesTotalPages,
    warehousesSearch,
    setWarehousesSearch,
    addWarehouse,
    editWarehouse,
    removeWarehouse,
    reload,
    loading,
  } = useDataContext();

  const [showModal, setShowModal] = React.useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = React.useState(null);
  const [deleteWarehouse, setDeleteWarehouse] = React.useState(null);

  // Reload whenever page or search changes
  useEffect(() => {
    reload();
  }, [reload, warehousesPage, warehousesSearch]);

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

  // Stats totals
  const totalCapacity = warehouses.reduce((sum, w) => sum + (w.capacity || 0), 0);
  const totalItems = warehouses.reduce((sum, w) => sum + (w.itemsCount || 0), 0);
  const totalValue = warehouses.reduce((sum, w) => sum + (w.value || 0), 0);

  return (
    <div>
      {/* Stats */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="p-3 shadow-sm text-center">
            <h6>Total Warehouses</h6>
            <h4>{warehouses.length}</h4>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="p-3 shadow-sm text-center">
            <h6>Total Capacity</h6>
            <h4>{totalCapacity}</h4>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="p-3 shadow-sm text-center">
            <h6>Total Items</h6>
            <h4>{totalItems}</h4>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="p-3 shadow-sm text-center">
            <h6>Total Value</h6>
            <h4>₹{totalValue}</h4>
          </Card>
        </Col>
      </Row>

      {/* Header + Search */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Warehouses</h3>
        <Button
          onClick={() => {
            setSelectedWarehouse(null);
            setShowModal(true);
          }}
        >
          + Add Warehouse
        </Button>
      </div>

      <InputGroup className="mb-3" style={{ maxWidth: 300 }}>
        <Form.Control
          placeholder="Search warehouses..."
          value={warehousesSearch}
          onChange={(e) => {
            setWarehousesSearch(e.target.value);
            setWarehousesPage(0);
          }}
        />
        <Button onClick={reload}>Search</Button>
      </InputGroup>

      {/* Table */}
      {loading ? (
        <div className="text-center my-3">
          <Spinner animation="border" />
        </div>
      ) : (
        <WarehouseTable
          warehouses={warehouses}
          onEdit={(w) => {
            setSelectedWarehouse(w);
            setShowModal(true);
          }}
          onDelete={(w) => setDeleteWarehouse(w)}
        />
      )}

      {/* Pagination */}
      {warehousesTotalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-2">
          <Button
            size="sm"
            disabled={warehousesPage === 0}
            onClick={() => setWarehousesPage((p) => Math.max(p - 1, 0))}
          >
            Prev
          </Button>
          <span>
            Page {warehousesPage + 1} / {warehousesTotalPages}
          </span>
          <Button
            size="sm"
            disabled={warehousesPage + 1 >= warehousesTotalPages}
            onClick={() => setWarehousesPage((p) => Math.min(p + 1, warehousesTotalPages - 1))}
          >
            Next
          </Button>
        </div>
      )}

      {/* Modals */}
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
