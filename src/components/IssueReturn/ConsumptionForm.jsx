// src/components/StockOperations/ConsumptionForm.jsx
import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { fetchItems, fetchWarehouses, createConsumption } from "../../api/api";

export default function ConsumptionForm({ show, onClose, onSaved }) {
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [form, setForm] = useState(initialForm());

  function initialForm() {
    return {
      itemId: "",
      warehouseId: "",
      quantity: 1,
      person: "",
      department: "",
      purpose: "",
    };
  }

  // Load items & warehouses when modal opens
  useEffect(() => {
    if (show) {
      fetchItems().then(r => setItems(r.data || [])).catch(console.error);
      fetchWarehouses().then(r => setWarehouses(r.data || [])).catch(console.error);
    }
  }, [show]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const submit = async () => {
    try {
      await createConsumption(form);
      if (onSaved) onSaved();
      setForm(initialForm());
      onClose();
    } catch (err) {
      console.error("Error logging consumption", err);
      alert("Failed to log consumption. Please try again.");
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Log Consumption / Usage</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="g-2">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Item</Form.Label>
                <Form.Select name="itemId" value={form.itemId} onChange={onChange}>
                  <option value="">Select item</option>
                  {items.map(i => (
                    <option key={i.id} value={i.id}>{i.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label>Warehouse</Form.Label>
                <Form.Select name="warehouseId" value={form.warehouseId} onChange={onChange}>
                  <option value="">Select warehouse</option>
                  {warehouses.map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={onChange}
                  min="1"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Person</Form.Label>
                <Form.Control
                  name="person"
                  value={form.person}
                  onChange={onChange}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Department</Form.Label>
                <Form.Control
                  name="department"
                  value={form.department}
                  onChange={onChange}
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label>Purpose</Form.Label>
                <Form.Control
                  as="textarea"
                  name="purpose"
                  value={form.purpose}
                  onChange={onChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button
          variant="primary"
          onClick={submit}
          disabled={!form.itemId || !form.person || !form.quantity}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
