// src/components/IssueReturn/IssueList.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Table, Button, Form, Row, Col, Pagination, Spinner } from "react-bootstrap";
import { fetchIssues, markIssueReturned } from "../../api/api";
import IssueForm from "./IssueForm";
import { useDataContext } from "../../context/DataContext";

export default function IssueList() {
  const { reload } = useDataContext();

  const [issues, setIssues] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        search,
        status: statusFilter || undefined,
        page,
        size,
      };
      const res = await fetchIssues(params);
      const data = Array.isArray(res.data.content) ? res.data.content : [];
      setIssues(data);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, size, search, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const onReturn = async (id) => {
    try {
      await markIssueReturned(id);
      load();
      reload();
    } catch (err) {
      console.error(err);
      alert("Failed to mark item as returned.");
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(0);
  };

  const handleSizeChange = (e) => {
    setSize(Number(e.target.value));
    setPage(0);
  };

  return (
    <div>
      <div className="d-flex justify-content-between mb-2">
        <h4>Item Issues</h4>
        <Button onClick={() => setShowForm(true)}>New Issue</Button>
      </div>

      <Row className="mb-3">
        <Col md={2}>
          <Form.Select value={size} onChange={handleSizeChange}>
            {[5, 10, 25, 50].map((n) => (
              <option key={n} value={n}>
                {n} per page
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={5}>
          <Form.Control
            placeholder="Search by person, department or purpose..."
            value={search}
            onChange={handleSearchChange}
          />
        </Col>
        <Col md={3}>
          <Form.Select value={statusFilter} onChange={handleStatusChange}>
            <option value="">All Status</option>
            <option value="ISSUED">Issued</option>
            <option value="RETURNED">Returned</option>
          </Form.Select>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" /> Loading issues...
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Date Issued</th>
              <th>Item</th>
              <th>Qty</th>
              <th>Person</th>
              <th>Department</th>
              <th>Purpose</th>
              <th>Status</th>
              <th>Return Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((i) => (
              <tr key={i.id}>
                <td>{i.issueDate ? new Date(i.issueDate).toLocaleDateString() : "-"}</td>
                <td>{i.itemName}</td>
                <td>{i.quantity}</td>
                <td>{i.person}</td>
                <td>{i.department}</td>
                <td>{i.purpose}</td>
                <td>
                  {i.status === "ISSUED" ? (
                    <span className="badge bg-warning text-dark">Issued</span>
                  ) : (
                    <span className="badge bg-success">Returned</span>
                  )}
                </td>
                <td>{i.returnDate ? new Date(i.returnDate).toLocaleDateString() : "-"}</td>
                <td>
                  {i.status === "ISSUED" ? (
                    <Button size="sm" onClick={() => onReturn(i.id)}>
                      Mark Returned
                    </Button>
                  ) : (
                    <span className="text-success fw-bold">Returned</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
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

      <IssueForm show={showForm} onClose={() => setShowForm(false)} onSaved={load} />
    </div>
  );
}
