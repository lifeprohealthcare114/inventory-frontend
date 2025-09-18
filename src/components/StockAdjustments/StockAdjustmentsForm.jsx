// src/components/StockAdjustments/StockAdjustmentsForm.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Modal, Button, Form, Row, Col, Spinner, InputGroup } from "react-bootstrap";
import { fetchItemsPaginated, fetchWarehousesPaginated, createStockAdjustment } from "../../api/api";

export default function StockAdjustmentForm({ show, onClose, onSaved }) {
  const [form, setForm] = useState({
    itemId: "",
    warehouseId: "",
    type: "Damage",
    quantity: "",
    notes: "",
  });

  // Items
  const [items, setItems] = useState([]);
  const [itemLoading, setItemLoading] = useState(false);
  const [itemPage, setItemPage] = useState(0);
  const [itemTotalPages, setItemTotalPages] = useState(0);
  const [itemSearchValue, setItemSearchValue] = useState("");

  // Warehouses
  const [warehouses, setWarehouses] = useState([]);
  const [warehouseLoading, setWarehouseLoading] = useState(false);
  const [warehousePage, setWarehousePage] = useState(0);
  const [warehouseTotalPages, setWarehouseTotalPages] = useState(0);
  const [warehouseSearchValue, setWarehouseSearchValue] = useState("");

  // Error & submitting
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  // ---------------- Fetch Items ----------------
  const loadItems = useCallback(async () => {
    if (!show) return;
    setItemLoading(true);
    try {
      const res = await fetchItemsPaginated({
        page: itemPage,
        size: 10,
        search: itemSearchValue,
        sortField: "name",
        sortDir: "asc",
      });
      setItems(res.data.content || []);
      setItemTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error("Failed to load items:", err);
      setItems([]);
    } finally {
      setItemLoading(false);
    }
  }, [show, itemPage, itemSearchValue]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // ---------------- Fetch Warehouses ----------------
  const loadWarehouses = useCallback(async () => {
    if (!show) return;
    setWarehouseLoading(true);
    try {
      const res = await fetchWarehousesPaginated({
        page: warehousePage,
        size: 10,
        search: warehouseSearchValue,
        sortField: "name",
        sortDir: "asc",
      });
      setWarehouses(res.data.content || []);
      setWarehouseTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error("Failed to load warehouses:", err);
      setWarehouses([]);
    } finally {
      setWarehouseLoading(false);
    }
  }, [show, warehousePage, warehouseSearchValue]);

  useEffect(() => {
    loadWarehouses();
  }, [loadWarehouses]);

  // ---------------- Form Handlers ----------------
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async () => {
    if (!form.itemId || !form.warehouseId || !form.quantity) {
      setError("Please fill all required fields.");
      return;
    }

    setSubmitting(true);
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
      onSaved && onSaved(normalizeAdjustment(res.data || res));

      // Reset form
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
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
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
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Search item..."
                    value={itemSearchValue}
                    onChange={(e) => { setItemSearchValue(e.target.value); setItemPage(0); }}
                  />
                </InputGroup>
                <Form.Select
                  name="itemId"
                  value={form.itemId}
                  onChange={onChange}
                  disabled={itemLoading || items.length === 0}
                  className="mt-1"
                >
                  <option value="">Select item</option>
                  {items.map((i) => (
                    <option key={i.id} value={i.id}>{i.name}</option>
                  ))}
                </Form.Select>
                {itemLoading && <Spinner animation="border" size="sm" className="mt-1" />}
                {itemTotalPages > 1 && (
                  <div className="d-flex justify-content-between mt-1">
                    <Button size="sm" disabled={itemPage === 0} onClick={() => setItemPage(itemPage - 1)}>Prev</Button>
                    <span>Page {itemPage + 1} / {itemTotalPages}</span>
                    <Button size="sm" disabled={itemPage + 1 >= itemTotalPages} onClick={() => setItemPage(itemPage + 1)}>Next</Button>
                  </div>
                )}
              </Form.Group>
            </Col>

            {/* Warehouse */}
            <Col md={12}>
              <Form.Group>
                <Form.Label>Warehouse</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Search warehouse..."
                    value={warehouseSearchValue}
                    onChange={(e) => { setWarehouseSearchValue(e.target.value); setWarehousePage(0); }}
                  />
                </InputGroup>
                <Form.Select
                  name="warehouseId"
                  value={form.warehouseId}
                  onChange={onChange}
                  disabled={warehouseLoading || warehouses.length === 0}
                  className="mt-1"
                >
                  <option value="">Select warehouse</option>
                  {warehouses.map((w) => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </Form.Select>
                {warehouseLoading && <Spinner animation="border" size="sm" className="mt-1" />}
                {warehouseTotalPages > 1 && (
                  <div className="d-flex justify-content-between mt-1">
                    <Button size="sm" disabled={warehousePage === 0} onClick={() => setWarehousePage(warehousePage - 1)}>Prev</Button>
                    <span>Page {warehousePage + 1} / {warehouseTotalPages}</span>
                    <Button size="sm" disabled={warehousePage + 1 >= warehouseTotalPages} onClick={() => setWarehousePage(warehousePage + 1)}>Next</Button>
                  </div>
                )}
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
        <Button variant="secondary" onClick={onClose} disabled={submitting}>Cancel</Button>
        <Button variant="primary" onClick={submit} disabled={submitting || !form.itemId || !form.warehouseId || !form.quantity}>
          {submitting ? <Spinner size="sm" animation="border" /> : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
