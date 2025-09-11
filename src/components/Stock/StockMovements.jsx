import React, { useMemo, useState } from "react";
import { Card, Row, Col, Button, Table, Badge, Spinner, Form, InputGroup } from "react-bootstrap";
import ReceiveStockModal from "./ReceiveStockModal";
import IssueStockModal from "./IssueStockModal";
import { toast } from "react-toastify";
import { format } from "date-fns";

export default function StockMovements({ movements, addMovement, deleteMovement, loading }) {
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter and search movements
  const filteredMovements = useMemo(() => {
    return movements.filter(m =>
      m.item.toLowerCase().includes(search.toLowerCase()) ||
      (m.department || m.purpose || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [movements, search]);

  // Pagination
  const totalPages = Math.ceil(filteredMovements.length / pageSize);
  const paginatedMovements = filteredMovements.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Stock levels
  const stockLevels = useMemo(() => {
    return movements.reduce((acc, m) => {
      const key = `${m.item}|${m.location}`;
      if (!acc[key]) acc[key] = 0;
      if (m.type === "RECEIVE") acc[key] += Number(m.quantity);
      if (m.type === "ISSUE") acc[key] -= Number(m.quantity);
      return acc;
    }, {});
  }, [movements]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this movement?")) return;
    try {
      await deleteMovement(id);
      toast.success("Stock movement deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete movement.");
    }
  };

  return (
    <Card>
      <Card.Header>
        <Row className="align-items-center">
          <Col>
            <h5>Stock Movements</h5>
            <small className="text-muted">Track all inventory transactions and stock levels.</small>
          </Col>
          <Col className="text-end">
            <Button variant="success" className="me-2" onClick={() => setShowReceiveModal(true)}>Receive Stock</Button>
            <Button variant="warning" onClick={() => setShowIssueModal(true)}>Issue Stock</Button>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col md={4}>
            <InputGroup>
              <InputGroup.Text>Search</InputGroup.Text>
              <Form.Control
                placeholder="Item or Department"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              />
            </InputGroup>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        {loading ? (
          <div className="text-center py-5"><Spinner animation="border" /></div>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Date</th>
                <th>Reference No.</th>
                <th>Batch No.</th>
                <th>Expiry Date</th>
                <th>Item</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Warehouse</th>
                <th>Department/Purpose</th>
                <th>Remaining Stock</th>
                <th>Remarks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMovements.length === 0 ? (
                <tr><td colSpan="12" className="text-center">No stock movements found.</td></tr>
              ) : (
                paginatedMovements.map((m) => {
                  const key = `${m.item}|${m.location}`;
                  return (
                    <tr key={m.id}>
                      <td>{m.date ? format(new Date(m.date), "dd/MM/yyyy HH:mm") : "—"}</td>
                      <td>{m.referenceNo || "—"}</td>
                      <td>{m.batchNo || "—"}</td>
                      <td>{m.expiryDate || "—"}</td>
                      <td>{m.item}</td>
                      <td><Badge bg={m.type === "RECEIVE" ? "success" : "danger"}>{m.type}</Badge></td>
                      <td className={m.type === "RECEIVE" ? "text-success" : "text-danger"}>
                        {m.type === "RECEIVE" ? `+${m.quantity}` : `-${m.quantity}`}
                      </td>
                      <td>{m.location}</td>
                      <td>{m.department || m.purpose || "—"}</td>
                      <td><strong>{stockLevels[key]}</strong></td>
                      <td>{m.remarks || "—"}</td>
                      <td>
                        <Button size="sm" variant="danger" onClick={() => handleDelete(m.id)}>Delete</Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        )}
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-end align-items-center mt-2">
            <Button
              variant="secondary"
              size="sm"
              className="me-2"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              Prev
            </Button>
            <span>Page {currentPage} of {totalPages}</span>
            <Button
              variant="secondary"
              size="sm"
              className="ms-2"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </Card.Body>

      {showReceiveModal && (
        <ReceiveStockModal
          show={showReceiveModal}
          onHide={() => setShowReceiveModal(false)}
          onSave={addMovement}
        />
      )}

      {showIssueModal && (
        <IssueStockModal
          show={showIssueModal}
          onHide={() => setShowIssueModal(false)}
          onSave={(movement) => {
            // Stock validation
            const key = `${movement.item}|${movement.location}`;
            const available = stockLevels[key] || 0;
            if (movement.quantity > available) {
              toast.error(`Cannot issue more than available stock (${available})`);
              return;
            }
            addMovement(movement);
            toast.success("Stock issued successfully!");
          }}
          stockLevels={stockLevels}
        />
      )}
    </Card>
  );
}
