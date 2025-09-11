import React, { useState } from "react";
import { Button } from "react-bootstrap";
import CategoriesTable from "./CategoriesTable";
import CategoryModal from "./CategoryModal";
import DeleteConfirmModal from "../DeleteConfirmModal";
import { useDataContext } from "../../context/DataContext";

const Categories = () => {
  const {
    categories,
    addCategory,
    editCategory,
    removeCategory,
    loading,
    error,
  } = useDataContext();

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Aggregate stats
  const totalItems = categories.reduce((sum, c) => sum + (c.itemsCount || 0), 0);
  const lowStock = categories.filter((c) => c.lowStock > 0).length;
  const totalValue = categories.reduce((sum, c) => sum + (c.totalValue || 0), 0);

  // Save (Add or Update)
// Save (Add or Update)
const handleSave = async (formData) => {
  try {
    if (formData.id) {
      // Editing existing → send id
      await editCategory(formData.id, formData);
    } else {
      // Creating new → backend generates id
      const newCode = `CAT-${Date.now()}`;
      await addCategory({ ...formData, categoryCode: newCode });
    }
    setShowModal(false);
    setEditingCategory(null);
  } catch (err) {
    console.error("Failed to save category:", err);
  }
};


  // Delete
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await removeCategory(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      console.error("Failed to delete category:", err);
    }
  };

  return (
    <div className="p-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Categories</h3>
        <Button
          onClick={() => {
            setEditingCategory(null);
            setShowModal(true);
          }}
        >
          + Add Category
        </Button>
      </div>

      {/* Error/Loading States */}
      {error && <div className="alert alert-danger">Error: {error}</div>}
      {loading && <div className="alert alert-info">Loading categories...</div>}

      {/* Stats */}
      <div className="d-flex gap-3 mb-4 flex-wrap">
        <div className="card p-3 flex-fill text-center">
          <h6>Total Categories</h6>
          <h4>{categories.length}</h4>
        </div>
        <div className="card p-3 flex-fill text-center">
          <h6>Total Items</h6>
          <h4>{totalItems}</h4>
        </div>
        <div className="card p-3 flex-fill text-center">
          <h6>Categories with Low Stock</h6>
          <h4>{lowStock}</h4>
        </div>
        <div className="card p-3 flex-fill text-center">
          <h6>Total Category Value</h6>
          <h4 style={{ color: "green" }}>${totalValue.toLocaleString()}</h4>
        </div>
      </div>

      {/* Table */}
      <CategoriesTable
        categories={categories}
        onEdit={(c) => {
          setEditingCategory(c);
          setShowModal(true);
        }}
        onDelete={(c) => setDeleteTarget(c)}
      />

      {/* Add/Edit Modal */}
      {showModal && (
        <CategoryModal
          show={showModal}
          handleClose={() => {
            setShowModal(false);
            setEditingCategory(null);
          }}
          editCategory={editingCategory}
          onSave={handleSave} // ✅ passes back to context
        />
      )}

      {/* Delete Modal */}
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

export default Categories;
