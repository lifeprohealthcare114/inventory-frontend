import React, { useState, useEffect } from "react";
import { Table, Spinner, Alert, Form } from "react-bootstrap";
import Pagination from "./Pagination";

export default function AdvancedTable({
  fetchData, // async function({ page, limit, search, sort }) => { data, total }
  columns,   // [{ key: 'name', label: 'Name', sortable: true }]
  limit = 10,
}) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // asc or desc

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchData({ page, limit, search, sortKey, sortOrder });
      setData(res.data || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error(err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, search, sortKey, sortOrder]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <div>
      <Form.Control
        type="text"
        placeholder="Search..."
        className="mb-2"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <div className="text-center my-3"><Spinner animation="border" /></div>}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && data.length === 0 && !error && <Alert variant="info">No data found.</Alert>}

      {!loading && data.length > 0 && (
        <>
          <Table responsive bordered hover>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    style={{ cursor: col.sortable ? "pointer" : "default" }}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    {col.label}
                    {col.sortable && sortKey === col.key && (sortOrder === "asc" ? " 🔼" : " 🔽")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx}>
                  {columns.map((col) => (
                    <td key={col.key}>{row[col.key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>

          <Pagination
            page={page}
            totalPages={Math.ceil(total / limit)}
            onChange={(p) => setPage(p)}
          />
        </>
      )}
    </div>
  );
}
