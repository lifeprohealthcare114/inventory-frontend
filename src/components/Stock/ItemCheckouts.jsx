import React, { useState } from "react";
import { Card, Row, Col, Button, Table, Badge } from "react-bootstrap";
import CheckoutModal from "./CheckoutModal";

export default function ItemCheckouts({ movements, setMovements }) {
  const [checkouts, setCheckouts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleCheckout = (checkout) => {
    const newCheckout = {
      ...checkout,
      id: Date.now(),
      checkoutDate: new Date().toLocaleString(),
      returnDate: null,
      status: "Checked Out",
    };

    setCheckouts([...checkouts, newCheckout]);

    // 🔑 Add as stock movement (Issue)
    setMovements([
      ...movements,
      {
        id: Date.now() + 1,
        date: new Date().toLocaleString(),
        item: checkout.item,
        type: "Issue",
        quantity: checkout.quantity || 1,
        location: checkout.location || "Main Warehouse",
        remarks: `Issued to ${checkout.person}`,
      },
    ]);

    setShowModal(false);
  };

  const handleReturn = (checkout) => {
    setCheckouts(
      checkouts.map((c) =>
        c.id === checkout.id
          ? { ...c, status: "Returned", returnDate: new Date().toLocaleString() }
          : c
      )
    );

    // 🔑 Add as stock movement (Receive)
    setMovements([
      ...movements,
      {
        id: Date.now() + 2,
        date: new Date().toLocaleString(),
        item: checkout.item,
        type: "Receive",
        quantity: checkout.quantity || 1,
        location: checkout.location || "Main Warehouse",
        remarks: `Returned by ${checkout.person}`,
      },
    ]);
  };

  return (
    <Card>
      <Card.Header>
        <Row className="align-items-center">
          <Col>
            <h5>Item Checkouts</h5>
            <small className="text-muted">
              Track borrowed items and their return timestamps.
            </small>
          </Col>
          <Col className="text-end">
            <Button variant="primary" onClick={() => setShowModal(true)}>
              Checkout Item
            </Button>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Item</th>
              <th>Person</th>
              <th>Checkout Time</th>
              <th>Return Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {checkouts.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">No checkouts found.</td>
              </tr>
            ) : (
              checkouts.map((c) => (
                <tr key={c.id}>
                  <td>{c.item}</td>
                  <td>{c.person}</td>
                  <td>{c.checkoutDate}</td>
                  <td>{c.returnDate || "—"}</td>
                  <td>
                    <Badge bg={c.status === "Checked Out" ? "warning" : "success"}>
                      {c.status}
                    </Badge>
                  </td>
                  <td>
                    {c.status === "Checked Out" && (
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleReturn(c)}
                      >
                        Mark Returned
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card.Body>

      {showModal && (
        <CheckoutModal
          show={showModal}
          onHide={() => setShowModal(false)}
          onSave={handleCheckout}
        />
      )}
    </Card>
  );
}
