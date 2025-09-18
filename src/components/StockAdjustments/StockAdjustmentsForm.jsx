// src/components/Stock/StockAdjustmentForm.jsx
import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { fetchItems, fetchWarehouses, createStockAdjustment } from "../../api/api";

export default function StockAdjustmentForm({ show, onClose, onSaved }) {
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [form, setForm] = useState({
    itemId: "",
    warehouseId: "",
    type: "Damage",
    quantity: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Normalize API response
  const normalizeAdjustment = (adj) => ({
    id: adj.id,
    date: adj.date,
    itemId: adj.itemId ?? adj.item_id,
    itemName: adj.itemName ?? adj.itemName ?? "",
    warehouseId: adj.warehouseId ?? adj.warehouse_id,
    warehouseName: adj.warehouseName ?? adj.warehouseName ?? "",
    type: adj.type,
    quantity: adj.quantity ?? 0,
    notes: adj.notes ?? "",
    status: adj.status ?? "PENDING",
  });

  useEffect(() => {
    if (!show) return;

    fetchItems()
      .then((res) => setItems(res.data || []))
      .catch((err) => console.error("Failed to load items:", err));

    fetchWarehouses()
      .then((res) => setWarehouses(res.data || []))
      .catch((err) => console.error("Failed to load warehouses:", err));
  }, [show]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async () => {
    if (!form.itemId || !form.warehouseId || !form.quantity) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const payload = {
        item_id: Number(form.itemId),
        warehouse_id: Number(form.warehouseId),
        type: form.type,
        quantity: Number(form.quantity),
        notes: form.notes,
      };

      const res = await createStockAdjustment(payload);

      // Pass the new normalized adjustment back to parent
      onSaved && onSaved(normalizeAdjustment(res.data || res));

      // Close modal and reset form
      setForm({
        itemId: "",
        warehouseId: "",
        type: "Damage",
        quantity: "",
        notes: "",
      });
      onClose();
    } catch (err) {
      console.error("Failed to create adjustment:", err);
      setError(err.response?.data?.message || err.message || "Unknown error");
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
        {error && <div className="alert alert-danger">{error}</div>}
        <Form>
          <Row className="g-2">
            {/* Item */}
            <Col md={12}>
              <Form.Group>
                <Form.Label>Item</Form.Label>
                <Form.Select name="itemId" value={form.itemId} onChange={onChange}>
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
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={submit}
          disabled={loading || !form.itemId || !form.warehouseId || !form.quantity}
        >
          {loading ? <Spinner size="sm" animation="border" /> : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
