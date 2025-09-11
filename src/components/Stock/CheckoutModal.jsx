import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE = "http://localhost:8080/api";

export default function CheckoutModal({ show, onHide, onSave, stockLevels }) {
  const [form, setForm] = useState({
    referenceNo: "",
    item: "",
    person: "",
    quantity: 1,
    location: "",
    batchNo: "",
    expiryDate: "",
  });

  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setForm({
      referenceNo: "",
      item: items[0]?.name || "",
      person: "",
      quantity: 1,
      location: warehouses[0]?.name || "",
      batchNo: "",
      expiryDate: "",
    });
    setError("");
  };

  useEffect(() => {
    if (!show) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [itemsRes, warehousesRes] = await Promise.all([
          axios.get(`${API_BASE}/items`),
          axios.get(`${API_BASE}/warehouses`)
        ]);
        setItems(itemsRes.data);
        setWarehouses(warehousesRes.data);
        setForm(prev => ({
          ...prev,
          item: itemsRes.data[0]?.name || "",
          location: warehousesRes.data[0]?.name || "",
        }));
      } catch (err) {
        console.error("Failed to fetch dropdown data", err);
        setError("Failed to load items or warehouses.");
        toast.error("Failed to load dropdown data!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [show]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.item || !form.person || !form.location || !form.quantity) {
      setError("Item, Person, Warehouse, and Quantity are required.");
      return;
    }

    // Stock validation
    const key = `${form.item}|${form.location}`;
    const availableStock = stockLevels?.[key] || 0;
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
            <Form.Group className="mb-2">
              <Form.Label>Reference No.</Form.Label>
              <Form.Control name="referenceNo" value={form.referenceNo} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Item *</Form.Label>
              <Form.Select name="item" value={form.item} onChange={handleChange}>
                {items.map(i => <option key={i.id} value={i.name}>{i.name}</option>)}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Person *</Form.Label>
              <Form.Control name="person" value={form.person} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Quantity</Form.Label>
              <Form.Control type="number" name="quantity" value={form.quantity} onChange={handleChange} />
              <Form.Text className="text-muted">
                Available: {stockLevels[`${form.item}|${form.location}`] || 0}
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Warehouse</Form.Label>
              <Form.Select name="location" value={form.location} onChange={handleChange}>
                {warehouses.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Batch No.</Form.Label>
              <Form.Control name="batchNo" value={form.batchNo} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Expiry Date</Form.Label>
              <Form.Control type="date" name="expiryDate" value={form.expiryDate} onChange={handleChange} />
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => { onHide(); resetForm(); }}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading || !!error}>Checkout</Button>
      </Modal.Footer>
    </Modal>
  );
}
