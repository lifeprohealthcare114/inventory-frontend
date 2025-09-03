import React from "react";
import { Table, Button } from "react-bootstrap";

export default function WarehouseTable({ warehouses, onEdit, onDelete }) {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Name</th>
          <th>Location</th>
          <th>Manager</th>
          <th>Contact</th>
          <th>Capacity</th>
          <th>Items</th>
          <th>Value (₹)</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {warehouses.map((w) => (
          <tr key={w.id}>
            <td>{w.name}</td>
            <td>{w.location}</td>
            <td>{w.manager}</td>
            <td>{w.contact}</td>
            <td>{w.capacity}</td>
            <td>{w.itemsCount}</td>
            <td>{w.value}</td>
            <td>{w.status}</td>
            <td>
              <Button
                size="sm"
                variant="outline-primary"
                onClick={() => onEdit(w)}
                className="me-2"
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline-danger"
                onClick={() => onDelete(w)}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
