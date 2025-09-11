import React from "react";
import { Table, Button } from "react-bootstrap";

export default function PurchaseOrdersTable({ orders, onEdit, onDelete }) {
  // Currency formatter
  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value || 0);

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
          <th>Order Date</th>
          <th>Expected Date</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {orders.length === 0 ? (
          <tr>
            <td colSpan="10" className="text-center">
              No purchase orders found.
            </td>
          </tr>
        ) : (
          orders.map((order) => (
            <tr key={order.id}>
              <td>{order.poNumber}</td>
              <td>{order.supplier}</td>
              <td>{order.item}</td>
              <td>{order.quantity}</td>
              <td>{formatCurrency(order.price)}</td>
              <td>{formatCurrency(order.totalAmount || order.quantity * order.price)}</td>
              <td className="text-nowrap">{order.orderDate}</td>
              <td className="text-nowrap">{order.expectedDate}</td>
              <td className="text-nowrap">{order.status}</td>
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
        )}
      </tbody>
    </Table>
  );
}
