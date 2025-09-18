import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { useDataContext } from "../../context/DataContext";

export default function WarehouseModal({ show, onHide, onSave, warehouse }) {
  const { fetchItemsForWarehouse } = useDataContext();

  const [form, setForm] = useState({
    warehouseCode: "",
    name: "",
    location: "",
    manager: "",
    contact: "",
    capacity: 0,
    itemsCount: 0,
    value: 0,
    type: "Main",
    notes: "",
    status: "Active",
  });

  const [saving, setSaving] = useState(false);
  const [associatedItemsList, setAssociatedItemsList] = useState([]);
  const [itemsPage, setItemsPage] = useState(0);
  const [itemsTotalPages, setItemsTotalPages] = useState(0);
  const itemsPerPage = 5;

  // Initialize form when warehouse changes
  useEffect(() => {
    if (warehouse) {
      setForm({
        warehouseCode: warehouse.warehouseCode || "",
        name: warehouse.name || "",
        location: warehouse.location || "",
        manager: warehouse.manager || "",
        contact: warehouse.contact || "",
        capacity: warehouse.capacity || 0,
        itemsCount: warehouse.itemsCount || 0,
        value: warehouse.value || 0,
        type: warehouse.type || "Main",
        notes: warehouse.notes || "",
        status: warehouse.status || "Active",
      });
      setItemsPage(0); // reset page
    } else {
      setForm({
        warehouseCode: "",
        name: "",
        location: "",
        manager: "",
        contact: "",
        capacity: 0,
        itemsCount: 0,
        value: 0,
        type: "Main",
        notes: "",
        status: "Active",
      });
      setAssociatedItemsList([]);
    }
  }, [warehouse]);

  // Fetch associated items whenever warehouse or page changes
  useEffect(() => {
    if (warehouse?.id) {
      const loadItems = async () => {
        const items = await fetchItemsForWarehouse(warehouse.id, itemsPage, itemsPerPage);
        setAssociatedItemsList(items);
        setItemsTotalPages(Math.ceil((warehouse.itemsCount || items.length) / itemsPerPage));
      };
      loadItems();
    }
  }, [warehouse, itemsPage, fetchItemsForWarehouse]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["capacity", "itemsCount", "value"].includes(name)) return; // read-only
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    if (!form.warehouseCode || !form.name) {
      alert("Warehouse Code and Name are required");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form };
      if (warehouse) payload.id = warehouse.id;
      await onSave(payload);
      onHide();
    } catch (err) {
      console.error("Failed to save warehouse:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{warehouse ? "Edit Warehouse" : "Add Warehouse"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Warehouse Code</Form.Label>
            <Form.Control
              name="warehouseCode"
              value={form.warehouseCode}
              onChange={handleChange}
              placeholder="e.g. WH001"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Warehouse Name</Form.Label>
            <Form.Control name="name" value={form.name} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control name="location" value={form.location} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Manager</Form.Label>
            <Form.Control name="manager" value={form.manager} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contact</Form.Label>
            <Form.Control name="contact" value={form.contact} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Capacity</Form.Label>
            <Form.Control type="number" name="capacity" value={form.capacity} readOnly />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Items Count</Form.Label>
            <Form.Control type="number" name="itemsCount" value={form.itemsCount} readOnly />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Total Value (₹)</Form.Label>
            <Form.Control type="number" name="value" value={form.value} readOnly />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Type</Form.Label>
            <Form.Select name="type" value={form.type} onChange={handleChange}>
              <option>Main</option>
              <option>Distribution</option>
              <option>Cold Storage</option>
              <option>Transit</option>
            </Form.Select>
          </Form.Group>

          {/* Associated Items with Pagination */}
          <Form.Group className="mb-3">
            <Form.Label>Associated Items</Form.Label>
            {associatedItemsList.length > 0 ? (
              <ul style={{ maxHeight: "150px", overflowY: "auto", paddingLeft: "20px" }}>
                {associatedItemsList.map((item) => (
                  <li key={item.id}>
                    {item.name} ({item.warehouseCode || item.code})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No associated items.</p>
            )}
            {itemsTotalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-2">
                <Button
                  size="sm"
                  disabled={itemsPage === 0}
                  onClick={() => setItemsPage((p) => Math.max(p - 1, 0))}
                >
                  Prev
                </Button>
                <span>
                  Page {itemsPage + 1} / {itemsTotalPages}
                </span>
                <Button
                  size="sm"
                  disabled={itemsPage + 1 >= itemsTotalPages}
                  onClick={() => setItemsPage((p) => Math.min(p + 1, itemsTotalPages - 1))}
                >
                  Next
                </Button>
              </div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="notes"
              value={form.notes}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Status</Form.Label>
            <Form.Select name="status" value={form.status} onChange={handleChange}>
              <option>Active</option>
              <option>Inactive</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={saving}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={saving}>
          {saving ? <Spinner size="sm" animation="border" /> : warehouse ? "Update" : "Add"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
