import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE = "http://localhost:8080/api";

export default function IssueStockModal({ show, onHide, onSave, stockLevels }) {
  const [form, setForm] = useState({
    referenceNo: "",
    batchNo: "",
    expiryDate: "",
    item: "",
    location: "",
    quantity: 0,
    department: "",
    purpose: "",
    remarks: "",
  });

  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setForm({
      referenceNo: "",
      batchNo: "",
      expiryDate: "",
      item: items[0]?.name || "",
      location: warehouses[0]?.name || "",
      quantity: 0,
      department: departments[0]?.name || "",
      purpose: "",
      remarks: "",
    });
    setError("");
  };

  useEffect(() => {
    if (!show) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [itemsRes, warehousesRes, departmentsRes] = await Promise.all([
          axios.get(`${API_BASE}/items`),
          axios.get(`${API_BASE}/warehouses`),
          axios.get(`${API_BASE}/departments`),
        ]);
        setItems(itemsRes.data);
        setWarehouses(warehousesRes.data);
        setDepartments(departmentsRes.data);
        setForm(prev => ({
          ...prev,
          item: itemsRes.data[0]?.name || "",
          location: warehousesRes.data[0]?.name || "",
          department: departmentsRes.data[0]?.name || ""
        }));
      } catch (err) {
        console.error("Failed to fetch dropdown data", err);
        setError("Failed to load items, warehouses, or departments.");
        toast.error("Failed to load dropdown data!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [show]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.item || !form.location || !form.quantity || !form.department) {
      setError("Item, Warehouse, Quantity, and Department are required.");
      return;
    }

    // Stock validation
    const key = `${form.item}|${form.location}`;
    const availableStock = stockLevels?.[key] || 0;
    if (Number(form.quantity) > availableStock) {
      setError(`Cannot issue more than available stock (${availableStock}).`);
      toast.error(`Cannot issue more than available stock (${availableStock}).`);
      return;
    }

    onSave({ ...form, type: "ISSUE" });
    toast.success("Stock issued successfully!");
    onHide();
    resetForm();
  };

  return (
    <Modal show={show} onHide={() => { onHide(); resetForm(); }} centered>
      <Modal.Header closeButton>
        <Modal.Title>Issue Stock</Modal.Title>
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
              <Form.Label>Batch No.</Form.Label>
              <Form.Control name="batchNo" value={form.batchNo} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Expiry Date</Form.Label>
              <Form.Control type="date" name="expiryDate" value={form.expiryDate} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Item *</Form.Label>
              <Form.Select name="item" value={form.item} onChange={handleChange}>
                {items.map(i => <option key={i.id} value={i.name}>{i.name}</option>)}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Warehouse *</Form.Label>
              <Form.Select name="location" value={form.location} onChange={handleChange}>
                {warehouses.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Quantity *</Form.Label>
              <Form.Control type="number" name="quantity" value={form.quantity} onChange={handleChange} />
              <Form.Text className="text-muted">
                Available: {stockLevels[`${form.item}|${form.location}`] || 0}
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Department *</Form.Label>
              <Form.Select name="department" value={form.department} onChange={handleChange}>
                {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Purpose</Form.Label>
              <Form.Control name="purpose" value={form.purpose} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Remarks</Form.Label>
              <Form.Control as="textarea" rows={2} name="remarks" value={form.remarks} onChange={handleChange} />
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => { onHide(); resetForm(); }}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading || !!error}>Issue</Button>
      </Modal.Footer>
    </Modal>
  );
}
