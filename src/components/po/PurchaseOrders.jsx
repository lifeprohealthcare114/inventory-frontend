import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Button, Form, Spinner, Alert, Pagination, Table } from "react-bootstrap";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import PurchaseOrderModal from "./PurchaseOrderModal";
import { fetchPurchaseOrdersPaginated, deletePurchaseOrder } from "../../api/api";
import axios from "axios";

export default function PurchaseOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10); // page size selector added
  const [totalPages, setTotalPages] = useState(0);

  // Search & Sort
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("orderDate");
  const [sortDir, setSortDir] = useState("desc");

  // Load orders
  const loadOrders = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const { data } = await fetchPurchaseOrdersPaginated({ page, size, search, sortField, sortDir });
      setOrders(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Failed to fetch purchase orders:", err);
      setErrorMsg(err?.response?.data?.message || "❌ Failed to fetch purchase orders.");
    } finally {
      setLoading(false);
    }
  }, [page, size, search, sortField, sortDir]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await deletePurchaseOrder(id);
      await loadOrders();
    } catch (err) {
      console.error("Failed to delete purchase order:", err);
      setErrorMsg("❌ Failed to delete purchase order.");
    }
  };

  const handleReceive = async (order) => {
    if (!window.confirm(`Mark PO ${order.poNumber} as Received?`)) return;
    try {
      await axios.put(`http://localhost:8080/api/purchase-orders/${order.id}/receive`);
      await loadOrders();
    } catch (err) {
      console.error("Failed to mark as received:", err);
      setErrorMsg(err?.response?.data?.message || "❌ Failed to mark order as received.");
    }
  };

  const handleSave = async () => {
    setShowModal(false);
    setSelectedOrder(null);
    await loadOrders();
  };

  const handleSortToggle = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="ms-1" />;
    return sortDir === "asc" ? <FaSortUp className="ms-1" /> : <FaSortDown className="ms-1" />;
  };

  return (
    <Container>
      <h2 className="my-4">Purchase Orders</h2>

      <Row className="mb-3 align-items-center">
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Search by PO number, supplier, item..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          />
        </Col>

        <Col md={2}>
          <Form.Select value={size} onChange={(e) => { setSize(Number(e.target.value)); setPage(0); }}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </Form.Select>
        </Col>

        <Col md="auto" className="ms-auto text-end">
          <Button onClick={() => setShowModal(true)}>+ Add Purchase Order</Button>
        </Col>
      </Row>

      {loading && (
        <div className="text-center my-3">
          <Spinner animation="border" />
        </div>
      )}

      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

      {!loading && !errorMsg && (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th style={{ cursor: "pointer" }} onClick={() => handleSortToggle("poNumber")}>
                  PO Number {renderSortIcon("poNumber")}
                </th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSortToggle("supplierName")}>
                  Supplier {renderSortIcon("supplierName")}
                </th>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSortToggle("totalAmount")}>
                  Total {renderSortIcon("totalAmount")}
                </th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSortToggle("status")}>
                  Status {renderSortIcon("status")}
                </th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSortToggle("orderDate")}>
                  Order Date {renderSortIcon("orderDate")}
                </th>
                <th>Expected Date</th>
                <th>Received Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id || order.poNumber}>
                    <td>{order.poNumber}</td>
                    <td>{order.supplierName || "Unknown Supplier"}</td>
                    <td>{order.itemName || "Unknown Item"}</td>
                    <td>{order.quantity}</td>
                    <td>{Number(order.price).toFixed(2)}</td>
                    <td>{Number(order.totalAmount).toFixed(2)}</td>
                    <td>{order.status}</td>
                    <td>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "-"}</td>
                    <td>{order.expectedDate ? new Date(order.expectedDate).toLocaleDateString() : "-"}</td>
                    <td>{order.receivedDate ? new Date(order.receivedDate).toLocaleString() : "-"}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="me-2"
                        onClick={() => setSelectedOrder(order) || setShowModal(true)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        className="me-2"
                        onClick={() => handleDelete(order.id)}
                      >
                        Delete
                      </Button>
                      <Button
                        size="sm"
                        variant="success"
                        disabled={order.status === "Received"}
                        onClick={() => handleReceive(order)}
                      >
                        {order.status === "Received" ? "Received" : "Mark as Received"}
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="text-center">
                    No purchase orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* Pagination */}
          <div className="d-flex justify-content-center mt-3">
            <Pagination>
              <Pagination.First disabled={page === 0} onClick={() => setPage(0)} />
              <Pagination.Prev disabled={page === 0} onClick={() => setPage((p) => p - 1)} />
              {[...Array(totalPages).keys()].map((num) => (
                <Pagination.Item key={num} active={num === page} onClick={() => setPage(num)}>
                  {num + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next disabled={page === totalPages - 1} onClick={() => setPage((p) => p + 1)} />
              <Pagination.Last disabled={page === totalPages - 1} onClick={() => setPage(totalPages - 1)} />
            </Pagination>
          </div>
        </>
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
