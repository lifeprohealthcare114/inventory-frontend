import React from "react";
import { Table, Button } from "react-bootstrap";

const CategoriesTable = ({ categories, onEdit, onDelete }) => {
  return (
    <div className="card p-3">
      <h5>Category Management</h5>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Category Name</th>
            <th>Description</th>
            <th>Sub-Categories</th> {/* ✅ Added */}
            <th>Items Count</th>
            <th>Low Stock</th>
            <th>Total Value</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id}>
              <td>
                <strong>{c.name}</strong>
                <br />
                <small>ID: {c.id}</small>
              </td>
              <td>{c.description}</td>
              <td>
                {c.subCategories && c.subCategories.length > 0
                  ? c.subCategories.join(", ")
                  : "-"}
              </td>
              <td>{c.itemsCount}</td>
              <td>
                {c.lowStock > 0 ? (
                  <span className="badge bg-danger">{c.lowStock}</span>
                ) : (
                  <span className="badge bg-secondary">0</span>
                )}
              </td>
              <td>${c.totalValue.toLocaleString()}</td>
              <td>{c.created}</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => onEdit(c)}
                  className="me-2"
                >
                  ✏️
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => onDelete(c)}
                >
                  🗑️
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CategoriesTable;
