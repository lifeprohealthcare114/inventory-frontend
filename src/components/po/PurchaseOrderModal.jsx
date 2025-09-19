import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Spinner, Alert } from "react-bootstrap";
import CreatableSelect from "react-select/creatable";
import { useDataContext } from "../../context/DataContext";
import ItemModal from "../itemsassets/ItemModal";

const generatePONumber = () => {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `PO-${year}-${rand}`;
};

export default function PurchaseOrderModal({ show, onHide, onSave, order }) {
  const { suppliers = [], items = [], categories = [], warehouses = [], addItem } = useDataContext();

  const [formData, setFormData] = useState({
    poNumber: "",
    supplier: null,
    item: null,
    quantity: 0,
    price: 0,
    orderDate: "",
    expectedDate: "",
    status: "Draft",
    notes: "",
  });

  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [savingItem, setSavingItem] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (order) {
      const matchedSupplier = suppliers.find((s) => s.id === order.supplierId) || null;
      const matchedItem = order.itemId
        ? items.find((it) => it.id === order.itemId) || { id: order.itemId, name: order.itemName, itemCode: "" }
        : null;

      setFormData({
        ...order,
        supplier: matchedSupplier,
        item: matchedItem,
        quantity: Number(order.quantity) || 0,
        price: Number(order.price) || 0,
        orderDate: order.orderDate || new Date().toISOString().split("T")[0],
        expectedDate: order.expectedDate || "-",
      });
    } else {
      setFormData({
        poNumber: generatePONumber(),
        supplier: null,
        item: null,
        quantity: 0,
        price: 0,
        orderDate: new Date().toISOString().split("T")[0],
        expectedDate: "-",
        status: "Draft",
        notes: "",
      });
    }
  }, [order, suppliers, items]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" || name === "price" ? Number(value) : value,
    }));
  };

  const handleSaveItem = async (itemData) => {
    setSavingItem(true);
    setErrorMsg("");
    try {
      const savedItem = await addItem(itemData);
      if (savedItem?.success) {
        setFormData((prev) => ({ ...prev, item: savedItem.data }));
        return savedItem.data;
      } else {
        setErrorMsg("❌ Failed to save item. Cannot submit order.");
      }
    } catch (err) {
      console.error("Failed to save item:", err);
      setErrorMsg("❌ Failed to save item. Cannot submit order.");
    } finally {
      setShowItemModal(false);
      setEditingItem(null);
      setSavingItem(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.supplier?.id) {
      setErrorMsg("⚠️ Please select a valid supplier.");
      return;
    }
    if (!formData.item?.id) {
      setErrorMsg("⚠️ Please select a valid item.");
      return;
    }

    const totalAmount = (formData.quantity || 0) * (formData.price || 0);

    const payload = {
      id: formData.id || null,
      poNumber: formData.poNumber || generatePONumber(),
      supplierId: formData.supplier.id,
      itemId: formData.item.id,
      quantity: formData.quantity,
      price: formData.price,
      totalAmount,
      orderDate: formData.orderDate,
      expectedDate: formData.expectedDate === "-" ? "" : formData.expectedDate,
      status: formData.status,
      notes: formData.notes,
    };

    try {
      await onSave(payload); // ✅ call parent save
    } catch (err) {
      console.error(err);
      setErrorMsg(err?.response?.data?.message || "❌ Failed to save purchase order.");
    }
  };

  const totalAmount = (formData.quantity || 0) * (formData.price || 0);

  return (
    <>
      <Modal show={show} onHide={onHide} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{order ? "Edit Purchase Order" : "Add Purchase Order"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
          <Form onSubmit={handleSubmit}>
            {/* PO Number */}
            <Form.Group className="mb-3">
              <Form.Label>PO Number</Form.Label>
              <Form.Control
                type="text"
                name="poNumber"
                value={formData.poNumber}
                onChange={handleChange}
                placeholder="Auto-generated if left blank"
              />
            </Form.Group>

            {/* Supplier */}
            <Form.Group className="mb-3">
              <Form.Label>Supplier</Form.Label>
              <Form.Select
                name="supplier"
                value={formData.supplier?.id || ""}
                onChange={(e) => {
                  const selectedSupplier = suppliers.find((s) => s.id.toString() === e.target.value);
                  setFormData((prev) => ({ ...prev, supplier: selectedSupplier || null }));
                }}
                required
              >
                <option value="">-- Select Supplier --</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.supplierCode})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Item */}
            <Form.Group className="mb-3">
              <Form.Label>Item</Form.Label>
              <CreatableSelect
                options={items.map((it) => ({ value: it.id, label: `${it.name} (${it.itemCode})` }))}
                value={
                  formData.item
                    ? { value: formData.item.id, label: `${formData.item.name} (${formData.item.itemCode || ""})` }
                    : null
                }
                onChange={(selected) => {
                  if (!selected) return setFormData((prev) => ({ ...prev, item: null }));
                  const selectedItem = items.find((it) => it.id === selected.value);
                  setFormData((prev) => ({ ...prev, item: selectedItem || null }));
                }}
                onCreateOption={(inputValue) => {
                  setEditingItem({
                    id: null,
                    name: inputValue,
                    itemCode: `ITEM-${Date.now()}`,
                    quantity: 0,
                    price: 0,
                    reorderLevel: 10,
                    status: "Active",
                    categoryId: null,
                    supplierId: null,
                    warehouseId: null,
                  });
                  setShowItemModal(true);
                }}
                isSearchable
                placeholder="Search or add item..."
                isDisabled={savingItem}
              />
            </Form.Group>

            {/* Quantity, Price, Total */}
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control type="number" name="price" value={formData.price} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Total Amount</Form.Label>
                  <Form.Control type="number" value={totalAmount} readOnly />
                </Form.Group>
              </Col>
            </Row>

            {/* Dates */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Order Date</Form.Label>
                  <Form.Control type="date" name="orderDate" value={formData.orderDate} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Expected Delivery Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="expectedDate"
                    value={formData.expectedDate === "-" ? "" : formData.expectedDate}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Status & Notes */}
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select name="status" value={formData.status} onChange={handleChange}>
                <option>Draft</option>
                <option>Pending</option>
                <option>Approved</option>
                <option>Received</option>
                <option>Cancelled</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control as="textarea" rows={2} name="notes" value={formData.notes} onChange={handleChange} placeholder="Any additional details" />
            </Form.Group>

            <div className="text-end">
              <Button variant="secondary" onClick={onHide} className="me-2" disabled={savingItem}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={savingItem}>
                {savingItem ? <><Spinner animation="border" size="sm" className="me-2" />Saving Item...</> : order ? "Update" : "Add"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Item Modal */}
      {showItemModal && (
        <ItemModal
          show={showItemModal}
          handleClose={() => { setShowItemModal(false); setEditingItem(null); }}
          editItem={editingItem}
          onSave={handleSaveItem}
          categories={categories}
          suppliers={suppliers}
          warehouses={warehouses}
        />
      )}
    </>
  );
}
