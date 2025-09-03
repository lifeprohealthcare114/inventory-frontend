// ItemsTable.jsx
import React, { useMemo, useState } from "react";
import { Table, InputGroup, FormControl, Row, Col, Badge, Button, Pagination } from "react-bootstrap";

export default function ItemsTable({ items = [], onEdit, onDeleteRequest, pageSize = 8 }) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [warehouseFilter, setWarehouseFilter] = useState("All");

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // derive distinct filters
  const categories = useMemo(() => ["All", ...Array.from(new Set(items.map(i => i.category || "Uncategorized")))], [items]);
  const warehouses = useMemo(() => ["All", ...Array.from(new Set(items.map(i => i.warehouse || "No Warehouse")))], [items]);

  // filtered list
  const filtered = useMemo(() => {
    let out = items;

    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(it =>
        (it.name || "").toLowerCase().includes(q) ||
        (it.barcode || "").toLowerCase().includes(q) ||
        (it.batchNumber || "").toLowerCase().includes(q) ||
        (it.serialNumber || "").toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== "All") {
      out = out.filter(it => (it.category || "") === categoryFilter);
    }

    if (warehouseFilter !== "All") {
      out = out.filter(it => (it.warehouse || "") === warehouseFilter);
    }

    if (stockFilter !== "All") {
      if (stockFilter === "In Stock") out = out.filter(it => Number(it.quantity || 0) > 0 && Number(it.quantity || 0) > Number(it.reorderLevel || 0));
      if (stockFilter === "Low Stock") out = out.filter(it => Number(it.quantity || 0) > 0 && Number(it.quantity || 0) <= Number(it.reorderLevel || 0));
      if (stockFilter === "Out of Stock") out = out.filter(it => Number(it.quantity || 0) === 0);
    }

    return out;
  }, [items, search, categoryFilter, stockFilter, warehouseFilter]);

  // pagination calculations
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // ensure page within range when filtered changes
  React.useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const renderStatusBadge = (item) => {
    const qty = Number(item.quantity || 0);
    const reorder = Number(item.reorderLevel || 0);
    if (qty === 0) return <Badge bg="danger">Out</Badge>;
    if (qty <= reorder) return <Badge bg="warning" text="dark">Low</Badge>;
    return <Badge bg="success">In</Badge>;
  };

  return (
    <>
      <Row className="mb-3 align-items-center">
        <Col md={5}>
          <InputGroup>
            <FormControl placeholder="Search name, barcode, batch, serial..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} />
          </InputGroup>
        </Col>
        <Col md={7} className="d-flex gap-2 justify-content-end">
          <select className="form-select" style={{ maxWidth: 180 }} value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}>
            {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
          </select>

          <select className="form-select" style={{ maxWidth: 160 }} value={stockFilter} onChange={(e) => { setStockFilter(e.target.value); setCurrentPage(1); }}>
            <option>All</option>
            <option>In Stock</option>
            <option>Low Stock</option>
            <option>Out of Stock</option>
          </select>

          <select className="form-select" style={{ maxWidth: 180 }} value={warehouseFilter} onChange={(e) => { setWarehouseFilter(e.target.value); setCurrentPage(1); }}>
            {warehouses.map((w, i) => <option key={i} value={w}>{w}</option>)}
          </select>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th style={{ minWidth: 220 }}>Item</th>
            <th>Category</th>
            <th>Warehouse</th>
            <th style={{ width: 120 }}>Qty</th>
            <th style={{ width: 120 }}>Price</th>
            <th style={{ width: 120 }}>Value</th>
            <th style={{ width: 100 }}>Status</th>
            <th style={{ width: 120 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pageItems.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center text-muted py-4">No items found</td>
            </tr>
          ) : pageItems.map(item => (
            <tr key={item.id}>
              <td>
                <div className="fw-bold">{item.name}</div>
                <div className="small text-muted">{item.description}</div>
                <div className="small mt-1">
                  <span className="badge bg-light text-dark me-1">BC: {item.barcode || "-"}</span>
                  <span className="badge bg-light text-dark">Batch: {item.batchNumber || "-"}</span>
                </div>
              </td>
              <td>{item.category}</td>
              <td>{item.warehouse}</td>
              <td>{item.quantity}</td>
              <td>${Number(item.price || 0).toLocaleString()}</td>
              <td>${(Number(item.price || 0) * Number(item.quantity || 0)).toLocaleString()}</td>
              <td>{renderStatusBadge(item)}</td>
              <td>
                <div className="d-flex gap-2">
                  <Button size="sm" variant="outline-primary" onClick={() => onEdit(item)}>Edit</Button>
                  <Button size="sm" variant="outline-danger" onClick={() => onDeleteRequest(item)}>Delete</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination controls */}
      <div className="d-flex justify-content-between align-items-center">
        <div className="text-muted">Showing {(pageItems.length === 0) ? 0 : ((currentPage - 1) * pageSize + 1)} - {Math.min(currentPage * pageSize, total)} of {total}</div>

        <Pagination className="mb-0">
          <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
          <Pagination.Prev onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} />
          {/* simple page numbers - cap rendering to small window */}
          {Array.from({ length: totalPages }).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2)).map((_, idx) => {
            const pageIndex = Math.max(1, currentPage - 2) + idx;
            if (pageIndex > totalPages) return null;
            return <Pagination.Item key={pageIndex} active={pageIndex === currentPage} onClick={() => setCurrentPage(pageIndex)}>{pageIndex}</Pagination.Item>;
          })}
          <Pagination.Next onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} />
          <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
        </Pagination>
      </div>
    </>
  );
}
