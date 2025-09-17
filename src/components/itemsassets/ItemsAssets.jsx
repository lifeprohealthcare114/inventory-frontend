import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import ItemsTable from "./ItemsTable";
import ItemModal from "./ItemModal";
import DeleteConfirmModal from "../DeleteConfirmModal";
import { useDataContext } from "../../context/DataContext";
import axios from "axios";

const ItemsAssets = () => {
  const { items, addItem, editItem, removeItem, loading, error } = useDataContext();

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  // Fetch dropdown data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, supRes, whRes] = await Promise.all([
          axios.get("http://localhost:8080/api/categories"),
          axios.get("http://localhost:8080/api/suppliers"),
          axios.get("http://localhost:8080/api/warehouses"),
        ]);
        setCategories(catRes.data);
        setSuppliers(supRes.data);
        setWarehouses(whRes.data);
      } catch (err) {
        console.error("Failed to fetch dropdown data:", err);
      }
    };
    fetchData();
  }, []);

  // Save item (add or edit)
  const handleSave = async (formData) => {
    try {
      let savedItem;
      let quantityChange = 0;
      // If editing, compute quantity change vs existing
      if (formData.id) {
        // find existing item in client list to compute change
        const existing = items.find((it) => it.id === formData.id) || {};
        quantityChange = (Number(formData.quantity || 0) - Number(existing.quantity || 0));
        savedItem = await editItem(formData.id, formData);
      } else {
        // new item
        quantityChange = Number(formData.quantity || 0);
        const { id, ...newItem } = formData;
        savedItem = await addItem(newItem);
      }

      if (!savedItem) {
        console.error("Saved item is undefined. Check your context functions.");
        return;
      }

      // If quantity changed, create a stock movement record
      try {
        if (quantityChange !== 0) {
          const movementPayload = {
            itemId: savedItem.id,
            quantityChange: quantityChange,
            type: quantityChange > 0 ? "IN" : "OUT",
            warehouseId: formData.warehouseId || savedItem.warehouseId || null,
            reference: formData.reference || null,
            notes: formData.notes || (quantityChange > 0 ? "Stock increase on save" : "Stock decrease on save"),
          };
          await axios.post("http://localhost:8080/api/stock-movements", movementPayload);
        }
      } catch (err) {
        // Non-fatal: movement logging failure should not block the save operation
        console.error("Failed to log stock movement:", err);
      }

      // Optional: Map nested objects for table display (not strictly necessary)
      // Keep editing state cleared and close modal
      setEditingItem(null);
      setShowModal(false);
      return savedItem;
    } catch (err) {
      console.error("Failed to save item:", err);
      throw err; // rethrow so modal can handle notification if needed
    }
  };

  // Delete item
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await removeItem(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  // Low-stock helper uses minimumStockLevel if present, otherwise fallback to reorderLevel
  const isLowStock = (it) => {
    const min = it.minimumStockLevel ?? it.reorderLevel ?? 0;
    return (it.quantity || 0) <= min;
  };

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Items</h3>
        <Button onClick={() => { setEditingItem(null); setShowModal(true); }}>+ Add Item</Button>
      </div>

      {error && <div className="alert alert-danger">Error: {error}</div>}
      {loading && <div className="alert alert-info">Loading items...</div>}

      {/* Stats */}
      <div className="d-flex gap-3 mb-4 flex-wrap">
        <div className="card p-3 flex-fill text-center">
          <h6>Total Items</h6>
          <h4>{items.length}</h4>
        </div>
        <div className="card p-3 flex-fill text-center">
          <h6>Total Quantity</h6>
          <h4>{items.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0)}</h4>
        </div>
        <div className="card p-3 flex-fill text-center">
          <h6>Low Stock Items</h6>
          <h4>{items.filter(i => isLowStock(i)).length}</h4>
        </div>
        <div className="card p-3 flex-fill text-center">
          <h6>Inactive Items</h6>
          <h4>{items.filter(i => i.status === "Inactive").length}</h4>
        </div>
        <div className="card p-3 flex-fill text-center">
          <h6>Total Inventory Value</h6>
          <h4 style={{ color: "green" }}>
            {items
              .reduce((sum, i) => sum + (Number(i.quantity || 0) * Number(i.price || 0)), 0)
              .toLocaleString("en-IN", { style: "currency", currency: "INR" })}
          </h4>
        </div>
      </div>

      <ItemsTable
        items={items}
        onEdit={item => { setEditingItem(item); setShowModal(true); }}
        onDelete={setDeleteTarget}
        categories={categories}
        suppliers={suppliers}
        warehouses={warehouses}
      />

      {showModal && (
        <ItemModal
          show={showModal}
          handleClose={() => { setShowModal(false); setEditingItem(null); }}
          editItem={editingItem}
          onSave={handleSave}
          categories={categories}
          suppliers={suppliers}
          warehouses={warehouses}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          show={!!deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
          item={deleteTarget}
        />
      )}
    </div>
  );
};

export default ItemsAssets;
