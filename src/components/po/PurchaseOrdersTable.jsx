import React from "react";
import { Table, Button } from "react-bootstrap";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

export default function PurchaseOrdersTable({
  orders = [],
  onEdit,
  onDelete,
  onReceive,
  onSort,
  sortField,
  sortDir,
}) {
  const renderSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="ms-1" />;
    return sortDir === "asc" ? <FaSortUp className="ms-1" /> : <FaSortDown className="ms-1" />;
  };

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th style={{ cursor: "pointer" }} onClick={() => onSort("poNumber")}>
            PO Number {renderSortIcon("poNumber")}
          </th>
          <th style={{ cursor: "pointer" }} onClick={() => onSort("supplierName")}>
            Supplier {renderSortIcon("supplierName")}
          </th>
          <th>Item</th>
          <th>Quantity</th>
          <th>Price</th>
          <th style={{ cursor: "pointer" }} onClick={() => onSort("totalAmount")}>
            Total {renderSortIcon("totalAmount")}
          </th>
          <th style={{ cursor: "pointer" }} onClick={() => onSort("status")}>
            Status {renderSortIcon("status")}
          </th>
          <th style={{ cursor: "pointer" }} onClick={() => onSort("orderDate")}>
            Order Date {renderSortIcon("orderDate")}
          </th>
          <th>Expected Date</th>
          <th>Received Date</th>
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
              <td>{order.orderDate || "-"}</td>
              <td>{order.expectedDate || "-"}</td>
              <td>{order.receivedDate ? new Date(order.receivedDate).toLocaleString() : "-"}</td>
              <td>
                <Button size="sm" variant="outline-primary" className="me-2" onClick={() => onEdit(order)}>
                  Edit
                </Button>
                <Button size="sm" variant="outline-danger" className="me-2" onClick={() => onDelete(order)}>
                  Delete
                </Button>
                <Button
                  size="sm"
                  variant="success"
                  disabled={order.status === "Received"}
                  onClick={() => onReceive(order)}
                >
                  {order.status === "Received" ? "Received" : "Mark as Received"}
                </Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="11" className="text-center">
              No purchase orders found.
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}
