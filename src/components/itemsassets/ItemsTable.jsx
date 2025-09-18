import React from "react";
import { Table, Button } from "react-bootstrap";

const ItemsTable = ({
  items,
  onEdit,
  onDelete,
  categories,
  suppliers,
  warehouses,
  onSort,
  sortField,
  sortDir
}) => {
  const getMinLevel = (item) => item.minimumStockLevel ?? item.reorderLevel ?? 0;

  const rowClass = (item) => {
    const stock = Number(item.quantity || 0);
    const min = Number(getMinLevel(item));
    if (stock <= min) return "table-danger";
    if (stock <= Math.ceil(min * 1.5)) return "table-warning";
    return "";
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDir === "asc" ? " ▲" : " ▼";
  };

  return (
    <div className="card p-3">
      <h5>Items Management</h5>
      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th onClick={() => onSort("itemCode")}>Item Code{renderSortIcon("itemCode")}</th>
            <th onClick={() => onSort("name")}>Item Name{renderSortIcon("name")}</th>
            <th>Category</th>
            <th>Warehouse</th>
            <th>Supplier</th>
            <th onClick={() => onSort("quantity")}>Quantity{renderSortIcon("quantity")}</th>
            <th onClick={() => onSort("price")}>Unit Price{renderSortIcon("price")}</th>
            <th onClick={() => onSort("lastPurchasePrice")}>Last Purchase Price{renderSortIcon("lastPurchasePrice")}</th>
            <th onClick={() => onSort("reorderLevel")}>Reorder Level{renderSortIcon("reorderLevel")}</th>
            <th onClick={() => onSort("minimumStockLevel")}>Min Stock{renderSortIcon("minimumStockLevel")}</th>
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
          {items.map((item) => (
            <tr key={item.id} className={rowClass(item)}>
              <td>{item.itemCode}</td>
              <td>{item.name}</td>
              <td>{categories.find(c => c.id === item.categoryId)?.name || "-"}</td>
              <td>{warehouses.find(w => w.id === item.warehouseId)?.name || "-"}</td>
              <td>{suppliers.find(s => s.id === item.supplierId)?.name || "-"}</td>
              <td>{item.quantity}</td>
              <td>{Number(item.price || 0).toLocaleString("en-IN", { style: "currency", currency: "INR" })}</td>
              <td>{item.lastPurchasePrice ? Number(item.lastPurchasePrice).toLocaleString("en-IN", { style: "currency", currency: "INR" }) : "-"}</td>
              <td>{item.reorderLevel ?? "-"}</td>
              <td>{item.minimumStockLevel ?? item.reorderLevel ?? "-"}</td>
              <td>
                <span className={`badge ${item.status === "Active" ? "bg-success" : "bg-secondary"}`}>
                  {item.status}
                </span>
              </td>
              <td>{(Number(item.quantity || 0) * Number(item.price || 0)).toLocaleString("en-IN", { style: "currency", currency: "INR" })}</td>
              <td>{item.barcode || "-"}</td>
              <td>{item.serialNumber || "-"}</td>
              <td>{item.batchNumber || "-"}</td>
              <td>{item.expiryDate || "-"}</td>
              <td>
                <Button size="sm" variant="outline-primary" className="me-2" onClick={() => onEdit(item)}>Edit</Button>
                <Button size="sm" variant="outline-danger" onClick={() => onDelete(item)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ItemsTable;
