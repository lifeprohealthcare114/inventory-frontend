import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import Select from "react-select";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE = "http://localhost:8080/api";

export default function CheckoutModal({ show, onHide, onSave, stockLevels = {} }) {
  const [form, setForm] = useState({
    referenceNo: "",
    itemId: null,
    itemName: "",
    person: "",
    quantity: 1,
    location: "",
    batchNo: "",
    expiryDate: "",
  });

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset form
  const resetForm = () => {
    setForm({
      referenceNo: "",
      itemId: items[0]?.id || null,
      itemName: items[0]?.name || "",
      person: "",
      quantity: 1,
      location: items[0]?.stock?.[0]?.warehouse || "",
      batchNo: items[0]?.stock?.[0]?.batchNo || "",
      expiryDate: items[0]?.stock?.[0]?.expiryDate || "",
    });
    setError("");
  };

  // Fetch items
  useEffect(() => {
    if (!show) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const itemsRes = await axios.get(`${API_BASE}/items`);
        const fetchedItems = itemsRes.data || [];
        setItems(fetchedItems);

        if (fetchedItems.length > 0) {
          const firstItem = fetchedItems[0];
          const firstStock = firstItem.stock?.[0] || {};
          setForm(prev => ({
            ...prev,
            itemId: firstItem.id,
            itemName: firstItem.name,
            location: firstStock.warehouse || "",
            batchNo: firstStock.batchNo || "",
            expiryDate: firstStock.expiryDate || "",
            quantity: 1
          }));
        }
      } catch (err) {
        console.error("Failed to fetch items", err);
        setError("Failed to load items.");
        toast.error("Failed to load items!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [show]);

  // Item change
  const handleItemChange = (selected) => {
    if (!selected) return;

    const selectedItem = items.find(i => i.id === selected.value);
    const firstStock = selectedItem?.stock?.[0] || {};

    setForm(prev => ({
      ...prev,
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      location: firstStock.warehouse || "",
      batchNo: firstStock.batchNo || "",
      expiryDate: firstStock.expiryDate || "",
      quantity: 1
    }));
  };

  // Warehouse change
  const handleWarehouseChange = (e) => {
    const warehouse = e.target.value;
    const selectedItem = items.find(i => i.id === form.itemId);
    const stockInfo = selectedItem?.stock?.find(s => s.warehouse === warehouse) || {};

    setForm(prev => ({
      ...prev,
      location: warehouse,
      batchNo: stockInfo.batchNo || "",
      expiryDate: stockInfo.expiryDate || "",
      quantity: 1
    }));
  };

  // Input change
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Submit
  const handleSubmit = () => {
    if (!form.itemId || !form.person || !form.location || !form.quantity) {
      setError("Item, Person, Warehouse, and Quantity are required.");
      return;
    }

    const key = `${form.itemName}|${form.location}`;
    const availableStock = stockLevels[key] ?? 0;

    if (Number(form.quantity) > availableStock) {
      setError(`Cannot checkout more than available stock (${availableStock}).`);
      toast.error(`Cannot checkout more than available stock (${availableStock}).`);
      return;
    }

    onSave({
      ...form,
      type: "ISSUE",
      department: form.person,
      purpose: `Checked out to ${form.person}`,
    });

    toast.success("Item checked out successfully!");
    onHide();
    resetForm();
  };

  const selectedItem = items.find(i => i.id === form.itemId);

  return (
    <Modal show={show} onHide={() => { onHide(); resetForm(); }} centered>
      <Modal.Header closeButton>
        <Modal.Title>Checkout Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && <Spinner animation="border" />}
        {error && <Alert variant="danger">{error}</Alert>}
        {!loading && !error && (
          <Form>
            {/* Reference No */}
            <Form.Group className="mb-2">
              <Form.Label>Reference No.</Form.Label>
              <Form.Control
                name="referenceNo"
                value={form.referenceNo}
                onChange={handleChange}
              />
            </Form.Group>

            {/* Item */}
            <Form.Group className="mb-2">
              <Form.Label>Item *</Form.Label>
              <Select
                options={items.map(i => ({ value: i.id, label: i.name }))}
                value={form.itemId ? { value: form.itemId, label: form.itemName } : null}
                onChange={handleItemChange}
                isSearchable
                placeholder="Select item..."
              />
            </Form.Group>

            {/* Person */}
            <Form.Group className="mb-2">
              <Form.Label>Person *</Form.Label>
              <Form.Control
                name="person"
                value={form.person}
                onChange={handleChange}
              />
            </Form.Group>

            {/* Quantity */}
            <Form.Group className="mb-2">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                min={1}
                max={selectedItem?.stock?.find(s => s.warehouse === form.location)?.quantity || 1}
              />
              <Form.Text className="text-muted">
                Available: {selectedItem?.stock?.find(s => s.warehouse === form.location)?.quantity || 0}
              </Form.Text>
            </Form.Group>

            {/* Warehouse */}
            <Form.Group className="mb-2">
              <Form.Label>Warehouse</Form.Label>
              {selectedItem?.stock?.length > 1 ? (
                <Form.Select
                  name="location"
                  value={form.location}
                  onChange={handleWarehouseChange}
                >
                  {selectedItem.stock.map(s => (
                    <option key={s.warehouse} value={s.warehouse}>
                      {s.warehouse}
                    </option>
                  ))}
                </Form.Select>
              ) : (
                <Form.Control
                  value={form.location || selectedItem?.stock?.[0]?.warehouse || ""}
                  disabled
                />
              )}
            </Form.Group>

            {/* Batch No */}
            <Form.Group className="mb-2">
              <Form.Label>Batch No.</Form.Label>
              <Form.Control
                name="batchNo"
                value={form.batchNo}
                disabled
              />
            </Form.Group>

            {/* Expiry Date */}
            <Form.Group className="mb-2">
              <Form.Label>Expiry Date</Form.Label>
              <Form.Control
                type="date"
                name="expiryDate"
                value={form.expiryDate}
                disabled
              />
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => { onHide(); resetForm(); }}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          Checkout
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
