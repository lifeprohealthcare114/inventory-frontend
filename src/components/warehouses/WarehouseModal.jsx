import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function WarehouseModal({ show, onHide, onSave, warehouse }) {
  const [form, setForm] = useState({
    name: "",
    location: "",
    manager: "",
    contact: "",
    capacity: "",
    itemsCount: "",
    value: "",
    status: "Active",
  });

  useEffect(() => {
    if (warehouse) {
      setForm(warehouse);
    } else {
      setForm({
        name: "",
        location: "",
        manager: "",
        contact: "",
        capacity: "",
        itemsCount: "",
        value: "",
        status: "Active",
      });
    }
  }, [warehouse]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave({ ...form, id: warehouse ? warehouse.id : Date.now() });
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{warehouse ? "Edit Warehouse" : "Add Warehouse"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Warehouse Name</Form.Label>
            <Form.Control
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control
              name="location"
              value={form.location}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Manager</Form.Label>
            <Form.Control
              name="manager"
              value={form.manager}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Contact</Form.Label>
            <Form.Control
              name="contact"
              value={form.contact}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Capacity</Form.Label>
            <Form.Control
              type="number"
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Items Count</Form.Label>
            <Form.Control
              type="number"
              name="itemsCount"
              value={form.itemsCount}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Total Value (₹)</Form.Label>
            <Form.Control
              type="number"
              name="value"
              value={form.value}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Status</Form.Label>
            <Form.Select name="status" value={form.status} onChange={handleChange}>
              <option>Active</option>
              <option>Inactive</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {warehouse ? "Update" : "Add"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
