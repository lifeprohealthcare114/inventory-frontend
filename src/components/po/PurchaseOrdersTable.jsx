import React from "react";
import { Table, Button } from "react-bootstrap";

export default function PurchaseOrdersTable({ orders = [], onEdit, onDelete }) {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>PO Number</th>
          <th>Supplier</th>
          <th>Item</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Total</th>
          <th>Status</th>
          <th>Order Date</th>
          <th>Expected Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {orders.length > 0 ? (
          orders.map((order) => (
            <tr key={order.id || order.poNumber}>
              <td>{order.poNumber}</td>
              <td>{order.supplierName || "Unknown Supplier"}</td>
              <td>{order.itemName || "Unknown Item"}</td>
              <td>{order.quantity}</td>
              <td>{order.price}</td>
              <td>{order.totalAmount}</td>
              <td>{order.status}</td>
              <td>{order.orderDate}</td>
              <td>{order.expectedDate}</td>
              <td>
                <Button
                  size="sm"
                  variant="outline-primary"
                  className="me-2"
                  onClick={() => onEdit(order)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() => onDelete(order)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="10" className="text-center">
              No purchase orders found.
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}
