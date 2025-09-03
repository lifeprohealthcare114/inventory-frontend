import React, { useState } from "react";
import { Card, Row, Col, Button, Table, Badge } from "react-bootstrap";
import ReceiveStockModal from "./ReceiveStockModal";
import IssueStockModal from "./IssueStockModal";

export default function StockMovements({ externalMovements, setExternalMovements }) {
  const [movements, setMovements] = useState([
    {
      id: 1,
      date: "1/15/2024",
      item: "Dell Laptop Pro 15",
      type: "Receive",
      quantity: 20,
      location: "Main Warehouse",
      remarks: "New stock received from supplier",
    },
  ]);

  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);

  // Use external state if provided (so ItemCheckouts can push Issue/Return)
  const allMovements = externalMovements || movements;
  const updateMovements = setExternalMovements || setMovements;

  const calculateStockLevels = (list) => {
    const stock = {};
    list.forEach((m) => {
      const key = `${m.item}|${m.location}`;
      if (!stock[key]) stock[key] = 0;
      if (m.type === "Receive") stock[key] += Number(m.quantity);
      if (m.type === "Issue") stock[key] -= Number(m.quantity);
    });
    return stock;
  };

  const addMovement = (movement) => {
    const newList = [
      ...allMovements,
      { ...movement, id: Date.now(), date: new Date().toLocaleString() },
    ];
    updateMovements(newList);
  };

  const handleDelete = (movement) => {
    if (window.confirm(`Delete stock movement for ${movement.item}?`)) {
      const newList = allMovements.filter((m) => m.id !== movement.id);
      updateMovements(newList);
    }
  };

  const stockLevels = calculateStockLevels(allMovements);

  return (
    <Card>
      <Card.Header>
        <Row className="align-items-center">
          <Col>
            <h5>Stock Movements</h5>
            <small className="text-muted">
              Track all inventory transactions and stock movements.
            </small>
          </Col>
          <Col className="text-end">
            <Button
              variant="success"
              className="me-2"
              onClick={() => setShowReceiveModal(true)}
            >
              Receive Stock
            </Button>
            <Button
              variant="warning"
              onClick={() => setShowIssueModal(true)}
            >
              Issue Stock
            </Button>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Date</th>
              <th>Item</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Location</th>
              <th>Remaining Stock</th>
              <th>Remarks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allMovements.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">
                  No stock movements found.
                </td>
              </tr>
            ) : (
              allMovements.map((m) => {
                const key = `${m.item}|${m.location}`;
                return (
                  <tr key={m.id}>
                    <td>{m.date}</td>
                    <td>{m.item}</td>
                    <td>
                      <Badge bg={m.type === "Receive" ? "success" : "danger"}>
                        {m.type}
                      </Badge>
                    </td>
                    <td className={m.type === "Receive" ? "text-success" : "text-danger"}>
                      {m.type === "Receive" ? `+${m.quantity}` : `-${m.quantity}`}
                    </td>
                    <td>{m.location}</td>
                    <td><strong>{stockLevels[key]}</strong></td>
                    <td>{m.remarks}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(m)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </Card.Body>

      {/* Modals */}
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
          onSave={addMovement}
        />
      )}
    </Card>
  );
}
