import React, { useState, useEffect, useCallback } from "react";
import { Button, Form, Pagination, Row, Col, Spinner, Alert } from "react-bootstrap";
import ItemsTable from "./ItemsTable";
import ItemModal from "./ItemModal";
import DeleteConfirmModal from "../DeleteConfirmModal";
import axios from "axios";
import debounce from "lodash.debounce";

const ItemsAssets = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  // Pagination & Sorting
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sortField, setSortField] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [search, setSearch] = useState("");

  // Fetch dropdown data
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [catRes, supRes, whRes] = await Promise.all([
          axios.get("http://localhost:8080/api/categories"),
          axios.get("http://localhost:8080/api/suppliers"),
          axios.get("http://localhost:8080/api/warehouses"),
        ]);
        setCategories(catRes.data);
        setSuppliers(supRes.data);
        setWarehouses(whRes.data);
      } catch (err) {
        console.error("Failed to fetch dropdowns", err);
      }
    };
    fetchDropdowns();
  }, []);

  // Fetch items
  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page,
        size,
        sortField,
        sortDir,
        search: search || undefined,
      };
      const res = await axios.get("http://localhost:8080/api/items/paginated", { params });
      setItems(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch items.");
    } finally {
      setLoading(false);
    }
  }, [page, size, sortField, sortDir, search]);

  // Debounced search (fixed warning)
  useEffect(() => {
    const handler = debounce((value) => setSearch(value), 500);
    return () => handler.cancel(); // cleanup on unmount
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSave = async (formData) => {
    try {
      if (formData.id) {
        await axios.put(`http://localhost:8080/api/items/${formData.id}`, formData);
      } else {
        await axios.post("http://localhost:8080/api/items", formData);
      }
      fetchItems();
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save item.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`http://localhost:8080/api/items/${deleteTarget.id}`);
      fetchItems();
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete item.");
    }
  };

  const handleSort = (field) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  return (
    <div className="p-3">
      {/* Top Controls */}
      <Row className="mb-3">
        <Col md={2}>
          <Form.Select
            value={size}
            onChange={(e) => { setSize(Number(e.target.value)); setPage(0); }}
          >
            {[5, 10, 25, 50].map((n) => (
              <option key={n} value={n}>{n} per page</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Search by name..."
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          />
        </Col>
        <Col className="text-end">
          <Button onClick={() => { setEditingItem(null); setShowModal(true); }}>+ Add Item</Button>
        </Col>
      </Row>

      {/* Loading / Error */}
      {loading && <div className="text-center"><Spinner animation="border" /> Loading items...</div>}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Items Table */}
      {!loading && !error && (
        <ItemsTable
          items={items}
          onEdit={(item) => { setEditingItem(item); setShowModal(true); }}
          onDelete={setDeleteTarget}
          categories={categories}
          suppliers={suppliers}
          warehouses={warehouses}
          onSort={handleSort}
          sortField={sortField}
          sortDir={sortDir}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-3">
          <Pagination.Prev disabled={page === 0} onClick={() => setPage(page - 1)} />
          {Array.from({ length: totalPages }).map((_, i) => (
            <Pagination.Item key={i} active={i === page} onClick={() => setPage(i)}>
              {i + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)} />
        </Pagination>
      )}

      {/* Modals */}
      {showModal && (
        <ItemModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          editItem={editingItem}
          onSave={handleSave}
          categories={categories}
          suppliers={suppliers}
          warehouses={warehouses}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          show={!!deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          item={deleteTarget}
        />
      )}
    </div>
  );
};

export default ItemsAssets;
