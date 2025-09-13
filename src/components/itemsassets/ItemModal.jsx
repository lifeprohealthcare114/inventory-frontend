import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const ItemModal = ({ show, handleClose, onSave, editItem, categories, suppliers, warehouses }) => {
  const [formData, setFormData] = useState({
    itemCode: "",
    name: "",
    description: "",
    quantity: 0,
    price: 0,
    reorderLevel: 10,
    status: "Active",
    categoryId: null,
    supplierId: null,
    warehouseId: null,
  });

  useEffect(() => {
    if (editItem) {
      setFormData({
        itemCode: editItem.itemCode || "",
        name: editItem.name || "",
        description: editItem.description || "",
        quantity: editItem.quantity || 0,
        price: editItem.price || 0,
        reorderLevel: editItem.reorderLevel || 10,
        status: editItem.status || "Active",
        categoryId: editItem.categoryId || editItem.category?.id || null,
        supplierId: editItem.supplierId || editItem.supplier?.id || null,
        warehouseId: editItem.warehouseId || editItem.warehouse?.id || null,
        id: editItem.id,
      });
    } else {
      setFormData({
        itemCode: "",
        name: "",
        description: "",
        quantity: 0,
        price: 0,
        reorderLevel: 10,
        status: "Active",
        categoryId: null,
        supplierId: null,
        warehouseId: null,
      });
    }
  }, [editItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("Id") ? (value ? Number(value) : null) : value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.itemCode || !formData.name || !formData.categoryId || !formData.supplierId || !formData.warehouseId) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      // Call onSave and wait for response (in case it's async API call)
      const savedItem = await onSave(formData);

      // Auto-close after saving
      handleClose();

      // If parent needs new item immediately (like PurchaseOrderModal), return it
      if (savedItem) {
        return savedItem;
      }
    } catch (err) {
      console.error("Error saving item:", err);
      alert("Failed to save item. Please try again.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{editItem ? "Edit Item" : "Add Item"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Item Code</Form.Label>
                <Form.Control
                  type="text"
                  name="itemCode"
                  value={formData.itemCode}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Item Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  name="categoryId"
                  value={formData.categoryId || ""}
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Supplier</Form.Label>
                <Form.Select
                  name="supplierId"
                  value={formData.supplierId || ""}
                  onChange={handleChange}
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Warehouse</Form.Label>
                <Form.Select
                  name="warehouseId"
                  value={formData.warehouseId || ""}
                  onChange={handleChange}
                >
                  <option value="">Select Warehouse</option>
                  {warehouses.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Group>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Unit Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Reorder Level</Form.Label>
                <Form.Control
                  type="number"
                  name="reorderLevel"
                  value={formData.reorderLevel}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ItemModal;
