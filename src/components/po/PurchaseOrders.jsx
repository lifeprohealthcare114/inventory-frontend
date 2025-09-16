import React, { useEffect, useState } from "react";
import { Button, Container, Spinner, Alert } from "react-bootstrap";
import { useDataContext } from "../../context/DataContext";
import PurchaseOrderModal from "./PurchaseOrderModal";
import PurchaseOrdersTable from "./PurchaseOrdersTable";
import axios from "axios";

export default function PurchaseOrders() {
  const {
    purchaseOrders,
    loading,
    error,
    reload,
    addPurchaseOrder,
    editPurchaseOrder,
    removePurchaseOrder,
  } = useDataContext();

  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    reload();
  }, [reload]);

  const handleSave = async (order) => {
    setErrorMsg("");
    try {
      if (order.id) {
        await editPurchaseOrder(order.id, order);
      } else {
        await addPurchaseOrder(order);
      }
      setShowModal(false);
      setSelectedOrder(null);
    } catch (err) {
      console.error("Failed to save purchase order:", err);
      setErrorMsg(err?.response?.data?.message || "❌ Failed to save purchase order.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await removePurchaseOrder(id);
    } catch (err) {
      console.error("Failed to delete purchase order:", err);
      setErrorMsg("❌ Failed to delete purchase order.");
    }
  };

  // ✅ New function: Mark PO as Received
  const handleReceive = async (order) => {
    if (!window.confirm(`Mark PO ${order.poNumber} as Received?`)) return;
    try {
      await axios.put(`http://localhost:8080/api/purchase-orders/${order.id}/receive`);
      await reload(); // refresh list + items
    } catch (err) {
      console.error("Failed to mark as received:", err);
      setErrorMsg(err?.response?.data?.message || "❌ Failed to mark order as received.");
    }
  };

  return (
    <Container>
      <h2 className="my-4">Purchase Orders</h2>

      <div className="mb-3 text-end">
        <Button onClick={() => setShowModal(true)}>+ Add Purchase Order</Button>
      </div>

      {loading && (
        <div className="text-center my-3">
          <Spinner animation="border" />
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

      {!loading && !error && (
        <PurchaseOrdersTable
          orders={purchaseOrders}
          onEdit={(order) => {
            setSelectedOrder(order);
            setShowModal(true);
          }}
          onDelete={(order) => handleDelete(order.id)}
          onReceive={handleReceive}   // ✅ pass new handler
        />
      )}

      <PurchaseOrderModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setSelectedOrder(null);
        }}
        onSave={handleSave}
        order={selectedOrder}
      />
    </Container>
  );
}
