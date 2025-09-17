// src/components/Stock/StockAdjustmentForm.jsx
import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import {
  fetchItems,
  fetchWarehouses,
  createStockAdjustment,
} from "../../api/api";

export default function StockAdjustmentForm({ show, onClose, onSaved }) {
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [form, setForm] = useState({
    itemId: "",
    warehouseId: "",
    type: "Damage",
    quantity: 0,
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  // Load items & warehouses when modal opens
  useEffect(() => {
    if (show) {
      fetchItems()
        .then((res) => setItems(res.data))
        .catch(console.error);

      fetchWarehouses()
        .then((res) => setWarehouses(res.data))
        .catch(console.error);
    }
  }, [show]);

  const onChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async () => {
    setLoading(true);
    try {
      await createStockAdjustment({
        ...form,
        itemId: Number(form.itemId),
        warehouseId: Number(form.warehouseId),
        quantity: Number(form.quantity),
      });

      onSaved && onSaved();
      onClose();
      setForm({
        itemId: "",
        warehouseId: "",
        type: "Damage",
        quantity: 0,
        notes: "",
      });
    } catch (err) {
      console.error("Failed to create adjustment:", err);
      alert(
        "Failed to create adjustment: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>New Stock Adjustment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="g-2">
            {/* Item */}
            <Col md={12}>
              <Form.Group>
                <Form.Label>Item</Form.Label>
                <Form.Select
                  name="itemId"
                  value={form.itemId}
                  onChange={onChange}
                >
                  <option value="">Select item</option>
                  {items.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Warehouse */}
            <Col md={12}>
              <Form.Group>
                <Form.Label>Warehouse</Form.Label>
                <Form.Select
                  name="warehouseId"
                  value={form.warehouseId}
                  onChange={onChange}
                >
                  <option value="">Select warehouse</option>
                  {warehouses.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Type */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Type</Form.Label>
                <Form.Select name="type" value={form.type} onChange={onChange}>
                  <option>Damage</option>
                  <option>Lost</option>
                  <option>Return</option>
                  <option>Correction</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Quantity */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  min={1}
                  value={form.quantity}
                  onChange={onChange}
                />
              </Form.Group>
            </Col>

            {/* Notes */}
            <Col md={12}>
              <Form.Group>
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  name="notes"
                  value={form.notes}
                  onChange={onChange}
                  rows={3}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={submit}
          disabled={loading || !form.itemId || !form.warehouseId || !form.quantity}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
