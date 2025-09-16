import React from "react";
import { Table, Button } from "react-bootstrap";

const ItemsTable = ({ items, onEdit, onDelete, categories, suppliers, warehouses }) => {
  return (
    <div className="card p-3">
      <h5>Items Management</h5>
      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>Item Code</th>
            <th>Item Name</th>
            <th>Category</th>
            <th>Warehouse</th>
            <th>Supplier</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Last Purchase Price</th>
            <th>Reorder Level</th>
            <th>Status</th>
            <th>Total Value</th>
            <th>Barcode</th>
            <th>Serial No.</th>
            <th>Batch No.</th>
            <th>Expiry Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.id}>
              <td>{i.itemCode}</td>
              <td>{i.name}</td>
              <td>{categories.find(c => c.id === i.categoryId)?.name || "-"}</td>
              <td>{warehouses.find(w => w.id === i.warehouseId)?.name || "-"}</td>
              <td>{suppliers.find(s => s.id === i.supplierId)?.name || "-"}</td>
              <td>{i.quantity}</td>
              <td>
                {i.price.toLocaleString("en-IN", { style: "currency", currency: "INR" })}
              </td>
              <td>
                {i.lastPurchasePrice
                  ? i.lastPurchasePrice.toLocaleString("en-IN", { style: "currency", currency: "INR" })
                  : "-"}
              </td>
              <td>{i.reorderLevel}</td>
              <td>
                <span className={`badge ${i.status === "Active" ? "bg-success" : "bg-secondary"}`}>
                  {i.status}
                </span>
              </td>
              <td>
                {(i.quantity * i.price).toLocaleString("en-IN", { style: "currency", currency: "INR" })}
              </td>
              <td>{i.barcode}</td>
              <td>{i.serialNumber}</td>
              <td>{i.batchNumber}</td>
              <td>{i.expiryDate || "-"}</td>
              <td>
                <Button
                  size="sm"
                  variant="outline-primary"
                  className="me-2"
                  onClick={() => onEdit(i)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() => onDelete(i)}
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

export default ItemsTable;
