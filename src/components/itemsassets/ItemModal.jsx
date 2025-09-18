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
    minimumStockLevel: null,
    status: "Active",
    categoryId: null,
    supplierId: null,
    warehouseId: null,
    barcode: "",
    serialNumber: "",
    batchNumber: "",
    expiryDate: "",
  });

  useEffect(() => {
    if (editItem) {
      setFormData({
        id: editItem.id,
        itemCode: editItem.itemCode || "",
        name: editItem.name || "",
        description: editItem.description || "",
        quantity: editItem.quantity ?? 0,
        price: editItem.price || 0,
        reorderLevel: editItem.reorderLevel || 10,
        minimumStockLevel: editItem.minimumStockLevel ?? editItem.reorderLevel ?? 10,
        status: editItem.status || "Active",
        categoryId: editItem.categoryId || editItem.category?.id || null,
        supplierId: editItem.supplierId || editItem.supplier?.id || null,
        warehouseId: editItem.warehouseId || editItem.warehouse?.id || null,
        barcode: editItem.barcode || "",
        serialNumber: editItem.serialNumber || "",
        batchNumber: editItem.batchNumber || "",
        expiryDate: editItem.expiryDate || "",
      });
    } else {
      setFormData({
        itemCode: "",
        name: "",
        description: "",
        quantity: 0,
        price: 0,
        reorderLevel: 10,
        minimumStockLevel: null,
        status: "Active",
        categoryId: null,
        supplierId: null,
        warehouseId: null,
        barcode: "",
        serialNumber: "",
        batchNumber: "",
        expiryDate: "",
      });
    }
  }, [editItem, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.endsWith("Id")
        ? (value ? Number(value) : null)
        : (["quantity", "price", "reorderLevel", "minimumStockLevel"].includes(name)
          ? (value === "" ? "" : Number(value))
          : value),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.itemCode || !formData.name || !formData.categoryId || !formData.supplierId || !formData.warehouseId) {
      alert("Please fill in all required fields.");
      return;
    }

    if (formData.quantity < 0) {
      alert("Quantity cannot be negative.");
      return;
    }

    try {
      const payload = { ...formData };
      if (!editItem) delete payload.id; // Ensure new item doesn't send an id

      const savedItem = await onSave(payload);
      handleClose();
      return savedItem;
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
          {/* Row 1: Item Code & Name */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Item Code</Form.Label>
                <Form.Control type="text" name="itemCode" value={formData.itemCode} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Item Name</Form.Label>
                <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>

          {/* Row 2: Category, Supplier, Warehouse */}
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select name="categoryId" value={formData.categoryId ?? ""} onChange={handleChange}>
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Supplier</Form.Label>
                <Form.Select name="supplierId" value={formData.supplierId ?? ""} onChange={handleChange}>
                  <option value="">Select Supplier</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Warehouse</Form.Label>
                <Form.Select name="warehouseId" value={formData.warehouseId ?? ""} onChange={handleChange}>
                  <option value="">Select Warehouse</option>
                  {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Description */}
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={2} name="description" value={formData.description} onChange={handleChange} />
          </Form.Group>

          {/* Row 3: Quantity, Price, Reorder Level, Minimum Stock Level */}
          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control type="number" name="quantity" value={formData.quantity} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Unit Price</Form.Label>
                <Form.Control type="number" name="price" value={formData.price} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Reorder Level</Form.Label>
                <Form.Control type="number" name="reorderLevel" value={formData.reorderLevel} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Minimum Stock Level</Form.Label>
                <Form.Control type="number" name="minimumStockLevel" value={formData.minimumStockLevel ?? ""} onChange={handleChange} />
                <Form.Text className="text-muted">
                  Optional — used for low-stock alerts. If blank, Reorder Level is used.
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          {/* Row 4: Barcode, Serial Number, Batch Number */}
          <Row>
            <Col md={4}><Form.Group className="mb-3"><Form.Label>Barcode</Form.Label><Form.Control type="text" name="barcode" value={formData.barcode} onChange={handleChange} /></Form.Group></Col>
            <Col md={4}><Form.Group className="mb-3"><Form.Label>Serial Number</Form.Label><Form.Control type="text" name="serialNumber" value={formData.serialNumber} onChange={handleChange} /></Form.Group></Col>
            <Col md={4}><Form.Group className="mb-3"><Form.Label>Batch Number</Form.Label><Form.Control type="text" name="batchNumber" value={formData.batchNumber} onChange={handleChange} /></Form.Group></Col>
          </Row>

          {/* Row 5: Expiry Date & Status */}
          <Row>
            <Col md={6}><Form.Group className="mb-3"><Form.Label>Expiry Date</Form.Label><Form.Control type="date" name="expiryDate" value={formData.expiryDate || ""} onChange={handleChange} /></Form.Group></Col>
            <Col md={6}><Form.Group className="mb-3"><Form.Label>Status</Form.Label><Form.Select name="status" value={formData.status} onChange={handleChange}><option value="Active">Active</option><option value="Inactive">Inactive</option></Form.Select></Form.Group></Col>
          </Row>

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ItemModal;
