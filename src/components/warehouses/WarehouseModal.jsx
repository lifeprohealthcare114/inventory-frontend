import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function WarehouseModal({ show, onHide, onSave, warehouse }) {
  const [form, setForm] = useState({
    warehouseCode: "",
    name: "",
    location: "",
    manager: "",
    contact: "",
    capacity: 0,
    itemsCount: 0,
    value: 0,
    type: "Main",
    associatedItems: "",
    notes: "",
    status: "Active",
  });

  useEffect(() => {
    if (warehouse) {
      setForm({
        ...warehouse,
        capacity: warehouse.capacity || 0,
        itemsCount: warehouse.itemsCount || 0,
        value: warehouse.value || 0,
      });
    } else {
      setForm({
        warehouseCode: "",
        name: "",
        location: "",
        manager: "",
        contact: "",
        capacity: 0,
        itemsCount: 0,
        value: 0,
        type: "Main",
        associatedItems: "",
        notes: "",
        status: "Active",
      });
    }
  }, [warehouse]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Convert numeric fields
    if (["capacity", "itemsCount", "value"].includes(name)) {
      setForm({ ...form, [name]: Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = () => {
    if (!form.warehouseCode || !form.name) {
      alert("Warehouse Code and Name are required");
      return;
    }

    const payload = { ...form };
    if (warehouse) payload.id = warehouse.id; // include ID only for edits

    onSave(payload);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{warehouse ? "Edit Warehouse" : "Add Warehouse"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Warehouse Code</Form.Label>
            <Form.Control
              name="warehouseCode"
              value={form.warehouseCode}
              onChange={handleChange}
              placeholder="e.g. WH001"
              required
            />
          </Form.Group>
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
          <Form.Group className="mb-3">
            <Form.Label>Type</Form.Label>
            <Form.Select name="type" value={form.type} onChange={handleChange}>
              <option>Main</option>
              <option>Distribution</option>
              <option>Cold Storage</option>
              <option>Transit</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Associated Items</Form.Label>
            <Form.Control
              name="associatedItems"
              value={form.associatedItems}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="notes"
              value={form.notes}
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
