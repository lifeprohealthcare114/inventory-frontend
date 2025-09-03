import React, { useState } from "react";
import PurchaseOrdersTable from "./PurchaseOrdersTable";
import PurchaseOrderModal from "./PurchaseOrderModal";
import DeleteConfirmModal from "../DeleteConfirmModal";
import { Card, Row, Col, Button } from "react-bootstrap";

export default function PurchaseOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleAdd = () => {
    setSelectedOrder(null);
    setShowModal(true);
  };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleDelete = (order) => {
    setSelectedOrder(order);
    setShowDeleteModal(true);
  };

  const saveOrder = (order) => {
    if (selectedOrder) {
      setOrders(orders.map((o) => (o.id === order.id ? order : o)));
    } else {
      setOrders([...orders, { ...order, id: Date.now() }]);
    }
    setShowModal(false);
  };

  const deleteOrder = () => {
    setOrders(orders.filter((o) => o.id !== selectedOrder.id));
    setShowDeleteModal(false);
  };

  return (
    <Card>
      <Card.Header>
        <Row className="align-items-center">
          <Col><h5>Purchase Orders</h5></Col>
          <Col className="text-end">
            <Button variant="primary" onClick={handleAdd}>Add Order</Button>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        <PurchaseOrdersTable
          orders={orders}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card.Body>

      {showModal && (
        <PurchaseOrderModal
          show={showModal}
          onHide={() => setShowModal(false)}
          onSave={saveOrder}
          order={selectedOrder}
        />
      )}

     {showDeleteModal && (
  <DeleteConfirmModal
    show={showDeleteModal}
    onClose={() => setShowDeleteModal(false)}
    onConfirm={deleteOrder}
  />
)}

    </Card>
  );
}
