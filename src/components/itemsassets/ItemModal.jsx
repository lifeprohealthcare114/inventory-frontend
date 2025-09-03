// ItemModal.jsx
import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

export default function ItemModal({ show, onClose, onSave, itemToEdit }) {
  const [form, setForm] = useState({
    id: "",
    name: "",
    category: "",
    description: "",
    warehouse: "",
    quantity: 0,
    price: 0,
    reorderLevel: 10,
    barcode: "",
    serialNumber: "",
    batchNumber: "",
    expiryDate: "",
  });

  useEffect(() => {
    if (itemToEdit) {
      setForm({
        id: itemToEdit.id || "",
        name: itemToEdit.name || "",
        category: itemToEdit.category || "",
        description: itemToEdit.description || "",
        warehouse: itemToEdit.warehouse || "",
        quantity: itemToEdit.quantity ?? 0,
        price: itemToEdit.price ?? 0,
        reorderLevel: itemToEdit.reorderLevel ?? 10,
        barcode: itemToEdit.barcode || "",
        serialNumber: itemToEdit.serialNumber || "",
        batchNumber: itemToEdit.batchNumber || "",
        expiryDate: itemToEdit.expiryDate || "",
      });
    } else {
      // reset
      setForm({
        id: "",
        name: "",
        category: "",
        description: "",
        warehouse: "",
        quantity: 0,
        price: 0,
        reorderLevel: 10,
        barcode: "",
        serialNumber: "",
        batchNumber: "",
        expiryDate: "",
      });
    }
  }, [itemToEdit, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.name?.trim()) return alert("Item name is required");
    if (!form.category?.trim()) return alert("Category is required");
    if (!form.warehouse?.trim()) return alert("Warehouse is required");

    // normalize numeric fields
    const payload = {
      ...form,
      quantity: Number(form.quantity || 0),
      price: Number(form.price || 0),
      reorderLevel: Number(form.reorderLevel || 0),
    };

    onSave(payload);
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{form.id ? "Edit Item" : "Add Item"}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row className="g-3">
            <Col md={8}>
              <Form.Group>
                <Form.Label>Item Name *</Form.Label>
                <Form.Control name="name" value={form.name} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={2} name="description" value={form.description} onChange={handleChange} />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Category *</Form.Label>
                <Form.Control name="category" value={form.category} onChange={handleChange} placeholder="Raw Materials, Finished Goods..." />
              </Form.Group>

              <Form.Group className="mt-2">
                <Form.Label>Warehouse *</Form.Label>
                <Form.Control name="warehouse" value={form.warehouse} onChange={handleChange} placeholder="Main Warehouse" />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mt-3">
                <Form.Label>Quantity *</Form.Label>
                <Form.Control type="number" name="quantity" value={form.quantity} onChange={handleChange} />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mt-3">
                <Form.Label>Price per unit *</Form.Label>
                <Form.Control type="number" name="price" value={form.price} onChange={handleChange} />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mt-3">
                <Form.Label>Reorder Level *</Form.Label>
                <Form.Control type="number" name="reorderLevel" value={form.reorderLevel} onChange={handleChange} />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mt-3">
                <Form.Label>Barcode</Form.Label>
                <Form.Control name="barcode" value={form.barcode} onChange={handleChange} />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mt-3">
                <Form.Label>Serial Number</Form.Label>
                <Form.Control name="serialNumber" value={form.serialNumber} onChange={handleChange} />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mt-3">
                <Form.Label>Batch Number</Form.Label>
                <Form.Control name="batchNumber" value={form.batchNumber} onChange={handleChange} />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mt-3">
                <Form.Label>Expiry Date</Form.Label>
                <Form.Control type="date" name="expiryDate" value={form.expiryDate} onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit">{form.id ? "Update Item" : "Add Item"}</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
