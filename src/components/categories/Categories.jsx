import React, { useState } from "react";
import { Button } from "react-bootstrap";
import CategoriesTable from "./CategoriesTable";
import CategoryModal from "./CategoryModal";
import DeleteCategoryModal from "../DeleteConfirmModal";

const Categories = () => {
  const [categories, setCategories] = useState([
    {
      id: "cat-001",
      name: "Raw Materials",
      description: "Basic materials for production",
      itemsCount: 1,
      lowStock: 0,
      totalValue: 6825,
      created: "2024-01-15",
      subCategories: ["Steel", "Aluminum"], // ✅ example
    },
    {
      id: "cat-002",
      name: "Finished Goods",
      description: "Completed products ready for sale",
      itemsCount: 1,
      lowStock: 1,
      totalValue: 3125,
      created: "2024-01-15",
      subCategories: ["Chairs", "Tables"],
    },
    {
      id: "cat-003",
      name: "Stationery",
      description: "Office supplies and stationery items",
      itemsCount: 0,
      lowStock: 0,
      totalValue: 0,
      created: "2024-01-15",
      subCategories: [],
    },
    {
      id: "cat-004",
      name: "Tools & Equipment",
      description: "Manufacturing tools and equipment",
      itemsCount: 0,
      lowStock: 0,
      totalValue: 0,
      created: "2024-01-15",
      subCategories: [],
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [deleteCategory, setDeleteCategory] = useState(null);

  const handleSaveCategory = (category) => {
    if (editCategory) {
      setCategories((prev) =>
        prev.map((c) => (c.id === category.id ? category : c))
      );
    } else {
      setCategories((prev) => [
        ...prev,
        { ...category, id: `cat-${Date.now()}` },
      ]);
    }
    setShowModal(false);
    setEditCategory(null);
  };

  const handleDeleteCategory = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setDeleteCategory(null);
  };

  const totalItems = categories.reduce((sum, c) => sum + c.itemsCount, 0);
  const lowStock = categories.filter((c) => c.lowStock > 0).length;
  const totalValue = categories.reduce((sum, c) => sum + c.totalValue, 0);

  return (
    <div className="p-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Categories</h3>
        <Button onClick={() => setShowModal(true)}>+ Add Category</Button>
      </div>

      {/* Stats */}
      <div className="d-flex gap-3 mb-4">
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
          setEditCategory(c);
          setShowModal(true);
        }}
        onDelete={(c) => setDeleteCategory(c)}
      />

      {/* Modals */}
      {showModal && (
        <CategoryModal
          show={showModal}
          handleClose={() => {
            setShowModal(false);
            setEditCategory(null);
          }}
          onSave={handleSaveCategory}
          editCategory={editCategory}
        />
      )}

     {deleteCategory && (
  <DeleteCategoryModal
    show={!!deleteCategory}
    onClose={() => setDeleteCategory(null)}   // ✅ match DeleteConfirmModal
    onConfirm={() => handleDeleteCategory(deleteCategory.id)} // ✅ match DeleteConfirmModal
  />
)}

    </div>
  );
};

export default Categories;
