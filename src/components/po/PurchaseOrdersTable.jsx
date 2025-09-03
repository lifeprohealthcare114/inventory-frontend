import React from "react";
import { Table, Button } from "react-bootstrap";

export default function PurchaseOrdersTable({ orders, onEdit, onDelete }) {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>ID</th>
          <th>Supplier</th>
          <th>Item</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {orders.length === 0 ? (
          <tr>
            <td colSpan="7" className="text-center">No orders found.</td>
          </tr>
        ) : (
          orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.supplier}</td>
              <td>{order.item}</td>
              <td>{order.quantity}</td>
              <td>{order.price}</td>
              <td>{order.date}</td>
              <td>
                <Button size="sm" variant="warning" className="me-2" onClick={() => onEdit(order)}>Edit</Button>
                <Button size="sm" variant="danger" onClick={() => onDelete(order)}>Delete</Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
}
