import React from "react";
import { Table, Button } from "react-bootstrap";

const CategoriesTable = ({ categories, onEdit, onDelete }) => {
  return (
    <div className="card p-3">
      <h5>Category Management</h5>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Code</th>
            <th>Category Name</th>
            <th>Description</th>
            <th>Sub-Categories</th>
            <th>Status</th>
            <th>Items Count</th>
            <th>Low Stock</th>
            <th>Total Value</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id}>
              <td>{c.categoryCode}</td>
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
              <td>
                <span
                  className={`badge ${
                    c.status === "Active"
                      ? "bg-success"
                      : c.status === "Inactive"
                      ? "bg-warning"
                      : "bg-secondary"
                  }`}
                >
                  {c.status}
                </span>
              </td>
              <td>{c.itemsCount}</td>
              <td>
                {c.lowStock > 0 ? (
                  <span className="badge bg-danger">{c.lowStock}</span>
                ) : (
                  <span className="badge bg-secondary">0</span>
                )}
              </td>
              <td>
                {c.totalValue.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                })}
              </td>
              <td>{c.createdAt}</td>
              <td>{c.updatedAt}</td>
              <td>
             
                <Button
                                  size="sm"
                                  variant="outline-primary"
                                  className="me-2"
                                   onClick={() => onEdit(c)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-danger"
                                     onClick={() => onDelete(c)}
                                >
                                  Delete
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
