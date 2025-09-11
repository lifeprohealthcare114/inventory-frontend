import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE = "http://localhost:8080/api";

export default function ReceiveStockModal({ show, onHide, onSave }) {
  const [form, setForm] = useState({
    referenceNo: "",
    batchNo: "",
    expiryDate: "",
    item: "",
    location: "",
    quantity: 0,
    supplier: "",
    remarks: "",
  });

  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
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
      supplier: suppliers[0]?.name || "",
      remarks: "",
    });
    setError("");
  };

  useEffect(() => {
    if (!show) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [itemsRes, warehousesRes, suppliersRes] = await Promise.all([
          axios.get(`${API_BASE}/items`),
          axios.get(`${API_BASE}/warehouses`),
          axios.get(`${API_BASE}/suppliers`)
        ]);
        setItems(itemsRes.data);
        setWarehouses(warehousesRes.data);
        setSuppliers(suppliersRes.data);
        setForm(prev => ({
          ...prev,
          item: itemsRes.data[0]?.name || "",
          location: warehousesRes.data[0]?.name || "",
          supplier: suppliersRes.data[0]?.name || ""
        }));
      } catch (err) {
        console.error("Failed to fetch dropdown data", err);
        setError("Failed to load items, warehouses, or suppliers.");
        toast.error("Failed to load dropdown data!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [show]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.item || !form.location || !form.quantity) {
      setError("Item, Warehouse, and Quantity are required.");
      return;
    }

    onSave({ ...form, type: "RECEIVE" });
    toast.success("Stock received successfully!");
    onHide();
    resetForm();
  };

  return (
    <Modal show={show} onHide={() => { onHide(); resetForm(); }} centered>
      <Modal.Header closeButton>
        <Modal.Title>Receive Stock</Modal.Title>
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
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Supplier</Form.Label>
              <Form.Select name="supplier" value={form.supplier} onChange={handleChange}>
                {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </Form.Select>
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
        <Button variant="primary" onClick={handleSubmit} disabled={loading || !!error}>Receive</Button>
      </Modal.Footer>
    </Modal>
  );
}
