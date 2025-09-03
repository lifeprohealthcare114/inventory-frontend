import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const SupplierModal = ({ onClose, onSave, supplier }) => {
  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    phone: "",
    email: "",
    taxId: "",
    paymentTerms: "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    if (supplier) {
      setFormData(supplier);
    }
  }, [supplier]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.contactPerson || !formData.phone || !formData.email || !formData.address) {
      alert("Please fill in all required fields");
      return;
    }
    onSave(formData);
  };

  return (
    <Modal show onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{supplier ? "Edit Supplier" : "Add New Supplier"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="name">
            <Form.Control
              type="text"
              name="name"
              placeholder="Supplier Name *"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="contactPerson">
            <Form.Control
              type="text"
              name="contactPerson"
              placeholder="Contact Person *"
              value={formData.contactPerson}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="phone">
            <Form.Control
              type="text"
              name="phone"
              placeholder="Phone Number *"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Control
              type="email"
              name="email"
              placeholder="Email *"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="taxId">
            <Form.Control
              type="text"
              name="taxId"
              placeholder="Tax ID"
              value={formData.taxId}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="paymentTerms">
            <Form.Control
              type="text"
              name="paymentTerms"
              placeholder="Payment Terms (e.g., Net 30)"
              value={formData.paymentTerms}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="address">
            <Form.Control
              as="textarea"
              rows={2}
              name="address"
              placeholder="Address *"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="notes">
            <Form.Control
              as="textarea"
              rows={2}
              name="notes"
              placeholder="Notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {supplier ? "Update Supplier" : "Add Supplier"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SupplierModal;
