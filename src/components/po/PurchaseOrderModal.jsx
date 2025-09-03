import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function PurchaseOrderModal({ show, onHide, onSave, order }) {
  const [formData, setFormData] = useState({
    supplier: "",
    item: "",
    quantity: "",
    price: "",
    date: ""
  });

  useEffect(() => {
    if (order) setFormData(order);
  }, [order]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{order ? "Edit Order" : "Add Order"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Supplier</Form.Label>
            <Form.Control type="text" name="supplier" value={formData.supplier} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Item</Form.Label>
            <Form.Control type="text" name="item" value={formData.item} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control type="number" name="price" value={formData.price} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control type="date" name="date" value={formData.date} onChange={handleChange} required />
          </Form.Group>

          <div className="text-end">
            <Button variant="secondary" onClick={onHide} className="me-2">Cancel</Button>
            <Button variant="primary" type="submit">{order ? "Update" : "Add"}</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
