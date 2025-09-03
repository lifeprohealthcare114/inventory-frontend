// ItemsAssets.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";

import ItemModal from "./ItemModal";
import ItemsTable from "./ItemsTable";
import DeleteConfirmModal from "../DeleteConfirmModal";

const API_BASE = "http://localhost:5000/items"; // change when you move to backend

export default function ItemsAssets() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Fetch items
  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_BASE);
      setItems(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Add or Update
  const handleSaveItem = async (formData) => {
    try {
      if (formData.id) {
        // update
        await axios.put(`${API_BASE}/${formData.id}`, formData);
        toast.success("Item updated successfully");
      } else {
        // create
        await axios.post(API_BASE, formData);
        toast.success("Item added successfully");
      }
      setShowItemModal(false);
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save item");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowItemModal(true);
  };

  // Delete flow (open confirm modal)
  const handleRequestDelete = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await axios.delete(`${API_BASE}/${itemToDelete.id}`);
      toast.success("Item deleted");
      setShowDeleteModal(false);
      setItemToDelete(null);
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete item");
    }
  };

  const handleAddClick = () => {
    setEditingItem(null);
    setShowItemModal(true);
  };

  return (
    <Container fluid className="p-4">
      <ToastContainer position="top-right" autoClose={2500} />

      <Row className="align-items-center mb-3">
        <Col>
          <h4 className="mb-0">Items & Assets</h4>
          <small className="text-muted">Manage your inventory items</small>
        </Col>
        <Col xs="auto">
          <Button variant="outline-secondary" className="me-2" onClick={() => {
            // placeholder for Export/Import - implement later
            toast.info("Export/Import not implemented (placeholder)");
          }}>
            Export
          </Button>
          <Button variant="primary" onClick={handleAddClick}>
            + Add Item
          </Button>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          {/* Basic summary cards */}
          <div className="d-flex gap-3">
            <div className="card p-3 flex-fill">
              <div className="text-muted small">Total Items</div>
              <div className="h5 mb-0">{items.length}</div>
            </div>
            <div className="card p-3 flex-fill">
              <div className="text-muted small">Low Stock</div>
              <div className="h5 mb-0">
                {items.filter(i => Number(i.quantity) <= Number(i.reorderLevel || 0)).length}
              </div>
            </div>
            <div className="card p-3 flex-fill">
              <div className="text-muted small">Out of Stock</div>
              <div className="h5 mb-0">
                {items.filter(i => Number(i.quantity) === 0).length}
              </div>
            </div>
            <div className="card p-3 flex-fill">
              <div className="text-muted small">Total Value</div>
              <div className="h5 mb-0">
                ${items.reduce((s, it) => s + (Number(it.price || 0) * Number(it.quantity || 0)), 0).toLocaleString()}
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status" />
            </div>
          ) : (
            <ItemsTable
              items={items}
              onEdit={handleEdit}
              onDeleteRequest={handleRequestDelete}
              // optional: you can pass custom pageSize prop here
            />
          )}
        </Col>
      </Row>

      {/* Add / Edit Modal */}
      <ItemModal
        show={showItemModal}
        onClose={() => setShowItemModal(false)}
        onSave={handleSaveItem}
        itemToEdit={editingItem}
      />

      {/* Delete confirm */}
      <DeleteConfirmModal
        show={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        item={itemToDelete}
      />
    </Container>
  );
}
