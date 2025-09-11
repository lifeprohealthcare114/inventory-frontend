import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

// Utility: auto-generate PO Number
const generatePONumber = () => {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `PO-${year}-${rand}`;
};

export default function PurchaseOrderModal({ show, onHide, onSave, order }) {
  const [formData, setFormData] = useState({
    poNumber: "",
    supplier: "",
    item: "",
    quantity: "",
    price: "",
    orderDate: "",
    expectedDate: "",
    status: "Draft",
    notes: "",
  });

  useEffect(() => {
    if (order) {
      setFormData(order);
    } else {
      setFormData({
        poNumber: generatePONumber(),
        supplier: "",
        item: "",
        quantity: "",
        price: "",
        orderDate: new Date().toISOString().split("T")[0],
        expectedDate: "",
        status: "Draft",
        notes: "",
      });
    }
  }, [order]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalPO = formData.poNumber || generatePONumber();
    const totalAmount = (formData.quantity || 0) * (formData.price || 0);
    onSave({ ...formData, poNumber: finalPO, totalAmount });
  };

  const totalAmount = (formData.quantity || 0) * (formData.price || 0);

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{order ? "Edit Purchase Order" : "Add Purchase Order"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>PO Number</Form.Label>
            <Form.Control
              type="text"
              name="poNumber"
              value={formData.poNumber}
              onChange={handleChange}
              placeholder="Auto-generated if left blank"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Supplier</Form.Label>
            <Form.Control
              type="text"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Item</Form.Label>
            <Form.Control
              type="text"
              name="item"
              value={formData.item}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Total Amount</Form.Label>
                <Form.Control type="number" value={totalAmount} readOnly />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Order Date</Form.Label>
                <Form.Control
                  type="date"
                  name="orderDate"
                  value={formData.orderDate}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Expected Delivery Date</Form.Label>
                <Form.Control
                  type="date"
                  name="expectedDate"
                  value={formData.expectedDate}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option>Draft</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Received</option>
              <option>Cancelled</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional details"
            />
          </Form.Group>

          <div className="text-end">
            <Button variant="secondary" onClick={onHide} className="me-2">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {order ? "Update" : "Add"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
