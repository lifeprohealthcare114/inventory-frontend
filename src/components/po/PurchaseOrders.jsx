import React, { useState } from "react";
import PurchaseOrdersTable from "./PurchaseOrdersTable";
import PurchaseOrderModal from "./PurchaseOrderModal";
import DeleteConfirmModal from "../DeleteConfirmModal";
import { Card, Row, Col, Button } from "react-bootstrap";
import { useDataContext } from "../../context/DataContext";

export default function PurchaseOrders() {
  const { purchaseOrders, addPurchaseOrder, editPurchaseOrder, removePurchaseOrder } = useDataContext();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Utility: auto-generate PO Number
  const generatePONumber = () => {
    const count = purchaseOrders.length + 1;
    return `PO-${new Date().getFullYear()}-${String(count).padStart(3, "0")}`;
  };

  const handleSave = async (order) => {
    const totalAmount = (order.quantity || 0) * (order.price || 0);

    if (selectedOrder) {
      // ✅ Update existing order (send ID)
      await editPurchaseOrder(selectedOrder.id, { ...order, totalAmount });
    } else {
      // ✅ New order → no fake ID, backend generates one
      const newOrder = {
        ...order,
        id: undefined, // let backend assign
        poNumber: order.poNumber?.trim() || generatePONumber(),
        totalAmount,
      };
      await addPurchaseOrder(newOrder);
    }

    setSelectedOrder(null);
    setShowModal(false);
  };

  const handleDelete = async () => {
    if (selectedOrder) {
      await removePurchaseOrder(selectedOrder.id);
      setSelectedOrder(null);
      setShowDeleteModal(false);
    }
  };

  return (
    <Card>
      <Card.Header>
        <Row className="align-items-center">
          <Col><h5>Purchase Orders</h5></Col>
          <Col className="text-end">
            <Button variant="primary" onClick={() => setShowModal(true)}>+ Add Order</Button>
          </Col>
        </Row>
      </Card.Header>

      <Card.Body>
        <PurchaseOrdersTable
          orders={purchaseOrders}
          onEdit={(order) => {
            setSelectedOrder(order);
            setShowModal(true);
          }}
          onDelete={(order) => {
            setSelectedOrder(order);
            setShowDeleteModal(true);
          }}
        />
      </Card.Body>

      {showModal && (
        <PurchaseOrderModal
          show={showModal}
          onHide={() => {
            setShowModal(false);
            setSelectedOrder(null);
          }}
          onSave={handleSave}
          order={selectedOrder}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          show={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
        />
      )}
    </Card>
  );
}
