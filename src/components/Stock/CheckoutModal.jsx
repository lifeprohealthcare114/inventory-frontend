import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function CheckoutModal({ show, onHide, onSave }) {
  const [form, setForm] = useState({
    item: "",
    person: "",
    quantity: 1,
    location: "Main Warehouse",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Checkout Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Item *</Form.Label>
            <Form.Control name="item" onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Person *</Form.Label>
            <Form.Control name="person" onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Quantity</Form.Label>
            <Form.Control type="number" name="quantity" defaultValue={1} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Warehouse</Form.Label>
            <Form.Control name="location" defaultValue="Main Warehouse" onChange={handleChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>Checkout</Button>
      </Modal.Footer>
    </Modal>
  );
}
