import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const SupplierModal = ({ onClose, onSave, supplier }) => {
  const [formData, setFormData] = useState({
    supplierCode: "",
    name: "",
    contactPerson: "",
    phone: "",
    email: "",
    taxId: "",
    gstNumber: "",
    paymentTerms: "",
    address: "",
    website: "",
    bankDetails: "",
    status: "Active",
    notes: "",
  });

  useEffect(() => {
    if (supplier) {
      // only copy editable fields, exclude createdAt/updatedAt
      setFormData({
        id: supplier.id,
        supplierCode: supplier.supplierCode || "",
        name: supplier.name || "",
        contactPerson: supplier.contactPerson || "",
        phone: supplier.phone || "",
        email: supplier.email || "",
        taxId: supplier.taxId || "",
        gstNumber: supplier.gstNumber || "",
        paymentTerms: supplier.paymentTerms || "",
        address: supplier.address || "",
        website: supplier.website || "",
        bankDetails: supplier.bankDetails || "",
        status: supplier.status || "Active",
        notes: supplier.notes || "",
      });
    } else {
      setFormData({
        supplierCode: "",
        name: "",
        contactPerson: "",
        phone: "",
        email: "",
        taxId: "",
        gstNumber: "",
        paymentTerms: "",
        address: "",
        website: "",
        bankDetails: "",
        status: "Active",
        notes: "",
      });
    }
  }, [supplier]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.contactPerson || !formData.phone || !formData.email || !formData.address) {
      alert("Please fill in all required fields (*)");
      return;
    }

    let payload = { ...formData };

    // 🚨 strip out id on create
    if (!supplier) {
      delete payload.id;
    }

    onSave(payload);
  };

  return (
    <Modal show onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{supplier ? "Edit Supplier" : "Add New Supplier"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="supplierCode">
            <Form.Control
              type="text"
              name="supplierCode"
              placeholder="Supplier Code (e.g. SUP001)"
              value={formData.supplierCode}
              onChange={handleChange}
            />
          </Form.Group>

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

          <Form.Group className="mb-3" controlId="gstNumber">
            <Form.Control
              type="text"
              name="gstNumber"
              placeholder="GST / VAT Number"
              value={formData.gstNumber}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="taxId">
            <Form.Control
              type="text"
              name="taxId"
              placeholder="Tax ID / PAN"
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

          <Form.Group className="mb-3" controlId="website">
            <Form.Control
              type="text"
              name="website"
              placeholder="Website / Portal Link"
              value={formData.website}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="bankDetails">
            <Form.Control
              as="textarea"
              rows={2}
              name="bankDetails"
              placeholder="Bank Details (Account, IFSC, etc.)"
              value={formData.bankDetails}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="status">
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Form.Select>
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
