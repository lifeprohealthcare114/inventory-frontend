import React, { useEffect, useState, useCallback } from "react";
import { Table, Button, Form, Row, Col } from "react-bootstrap";
import { fetchIssues, markIssueReturned } from "../../api/api";
import IssueForm from "./IssueForm";

export default function IssueList() {
  const [issues, setIssues] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const load = useCallback(() => {
    fetchIssues()
      .then(r => {
        setIssues(r.data);
        setFiltered(r.data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => { load(); }, [load]);

  // Apply filters whenever search/status/issue list changes
  useEffect(() => {
    let data = issues;

    if (search) {
      const s = search.toLowerCase();
      data = data.filter(i =>
        (i.person && i.person.toLowerCase().includes(s)) ||
        (i.department && i.department.toLowerCase().includes(s)) ||
        (i.purpose && i.purpose.toLowerCase().includes(s))
      );
    }

    if (statusFilter) {
      data = data.filter(i => i.status === statusFilter);
    }

    setFiltered(data);
  }, [search, statusFilter, issues]);

  const onReturn = async (id) => {
    await markIssueReturned(id);
    load();
  };

  return (
    <div>
      <div className="d-flex justify-content-between mb-2">
        <h4>Item Issues</h4>
        <Button onClick={() => setShowForm(true)}>New Issue</Button>
      </div>

      {/* Search & Filters */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            placeholder="Search by person, department or purpose..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="ISSUED">Issued</option>
            <option value="RETURNED">Returned</option>
          </Form.Select>
        </Col>
      </Row>

      <Table striped bordered hover>
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
          {filtered.map(i => (
            <tr key={i.id}>
              <td>{new Date(i.issueDate).toLocaleDateString()}</td>
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
                  <Button size="sm" onClick={() => onReturn(i.id)}>Mark Returned</Button>
                ) : (
                  <span className="text-success fw-bold">Returned</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <IssueForm show={showForm} onClose={() => setShowForm(false)} onSaved={load} />
    </div>
  );
}
