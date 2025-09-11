import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const CategoryModal = ({ show, handleClose, onSave, editCategory }) => {
  const [formData, setFormData] = useState({
    id: null,
    categoryCode: "",
    name: "",
    description: "",
    status: "Active",
    itemsCount: 0, // auto-calculated later
    lowStock: 0,   // auto-calculated later
    totalValue: 0, // auto-calculated later
    createdAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
    subCategories: [""],
  });

  useEffect(() => {
    if (editCategory) {
      setFormData({
        ...editCategory,
        subCategories: editCategory.subCategories || [""],
      });
    }
  }, [editCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubChange = (index, value) => {
    const updated = [...formData.subCategories];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, subCategories: updated }));
  };

  const addSubCategory = () => {
    setFormData((prev) => ({
      ...prev,
      subCategories: [...prev.subCategories, ""],
    }));
  };

  const removeSubCategory = (index) => {
    const updated = formData.subCategories.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      subCategories: updated.length > 0 ? updated : [""],
    }));
  };

  const handleSubmit = () => {
    onSave({
      ...formData,
      updatedAt: new Date().toISOString().split("T")[0], // update timestamp
      subCategories: formData.subCategories.filter((s) => s.trim() !== ""),
    });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {editCategory ? "Edit Category" : "Add Category"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Category Code</Form.Label>
            <Form.Control
              type="text"
              name="categoryCode"
              value={formData.categoryCode}
              onChange={handleChange}
              placeholder="e.g. ELEC, CAT-001"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter category name"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Archived">Archived</option>
            </Form.Select>
          </Form.Group>

          {/* ✅ Sub-Categories */}
          <Form.Group className="mb-3">
            <Form.Label>Sub-Categories</Form.Label>
            {formData.subCategories.map((sub, index) => (
              <div key={index} className="d-flex mb-2">
                <Form.Control
                  type="text"
                  value={sub}
                  placeholder={`Sub-category ${index + 1}`}
                  onChange={(e) => handleSubChange(index, e.target.value)}
                />
                <Button
                  variant="danger"
                  size="sm"
                  className="ms-2"
                  onClick={() => removeSubCategory(index)}
                >
                  ❌
                </Button>
              </div>
            ))}
            <Button variant="secondary" size="sm" onClick={addSubCategory}>
              ➕ Add More
            </Button>
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

export default CategoryModal;
