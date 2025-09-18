import React, { useState, useEffect, useCallback } from "react";
import { Button, InputGroup, FormControl, Spinner } from "react-bootstrap";
import CategoriesTable from "./CategoriesTable";
import CategoryModal from "./CategoryModal";
import DeleteConfirmModal from "../DeleteConfirmModal";
import { fetchCategoriesPaginated, createCategory, updateCategory, deleteCategory } from "../../api/api";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchValue, setSearchValue] = useState("");

  // Load categories with pagination & search
  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchCategoriesPaginated({
        page,
        size: 10,
        search: searchValue,
      });
      setCategories(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error("Failed to load categories:", err);
      setError("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  }, [page, searchValue]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Save (Add or Update)
  const handleSave = async (formData) => {
    try {
      if (formData.id) {
        await updateCategory(formData.id, formData);
      } else {
        const newCode = `CAT-${Date.now()}`;
        await createCategory({ ...formData, categoryCode: newCode });
      }
      setShowModal(false);
      setEditingCategory(null);
      loadCategories();
    } catch (err) {
      console.error("Failed to save category:", err);
      alert("Failed to save category.");
    }
  };

  // Delete
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCategory(deleteTarget.id);
      setDeleteTarget(null);
      loadCategories();
    } catch (err) {
      console.error("Failed to delete category:", err);
      alert("Failed to delete category.");
    }
  };

  return (
    <div className="p-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
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

      {/* Search */}
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Search categories..."
          value={searchValue}
          onChange={(e) => { setSearchValue(e.target.value); setPage(0); }}
        />
      </InputGroup>

      {/* Error / Loading */}
      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="text-center my-3"><Spinner animation="border" /></div>}

      {/* Table */}
      <CategoriesTable
        categories={categories}
        onEdit={(c) => { setEditingCategory(c); setShowModal(true); }}
        onDelete={(c) => setDeleteTarget(c)}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-2">
          <Button size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>Prev</Button>
          <span>Page {page + 1} / {totalPages}</span>
          <Button size="sm" disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <CategoryModal
          show={showModal}
          handleClose={() => { setShowModal(false); setEditingCategory(null); }}
          editCategory={editingCategory}
          onSave={handleSave}
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
}
