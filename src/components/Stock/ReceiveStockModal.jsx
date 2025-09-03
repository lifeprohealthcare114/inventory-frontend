import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function ReceiveStockModal({ show, onHide, onSave }) {
  const [form, setForm] = useState({
    item: "",
    location: "",
    quantity: 0,
    supplier: "",
    remarks: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    onSave({ ...form, type: "Receive" });
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Receive Stock</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Item *</Form.Label>
            <Form.Control name="item" onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Warehouse *</Form.Label>
            <Form.Control name="location" onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Quantity *</Form.Label>
            <Form.Control type="number" name="quantity" onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Supplier</Form.Label>
            <Form.Control name="supplier" onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Remarks</Form.Label>
            <Form.Control as="textarea" rows={2} name="remarks" onChange={handleChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>Receive</Button>
      </Modal.Footer>
    </Modal>
  );
}
