import React, { useMemo, useState } from "react";
import { Card, Row, Col, Button, Table, Badge, Spinner, InputGroup, Form } from "react-bootstrap";
import CheckoutModal from "./CheckoutModal";
import { toast } from "react-toastify";
import { format } from "date-fns";

export default function ItemCheckouts({ movements, addMovement, loading, stockLevels = {} }) {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter ISSUE type movements for checkouts
  const checkouts = useMemo(() => {
    return movements
      .filter(m => m.type === "ISSUE")
      .map(m => ({ ...m, status: "Checked Out", returnDate: m.returnDate || null }));
  }, [movements]);

  // Search/filter
  const filteredCheckouts = useMemo(() => {
    return checkouts.filter(c =>
      c.item.toLowerCase().includes(search.toLowerCase()) ||
      (c.person || c.department || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [checkouts, search]);

  const totalPages = Math.ceil(filteredCheckouts.length / pageSize);
  const paginatedCheckouts = filteredCheckouts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleReturn = async (checkout) => {
    try {
      // Cannot return more than checked out quantity
      const returnedQty = movements
        .filter(m => m.referenceNo === checkout.referenceNo && m.type === "RECEIVE")
        .reduce((acc, m) => acc + m.quantity, 0);
      if (returnedQty >= checkout.quantity) {
        toast.error("All items for this checkout have already been returned.");
        return;
      }

      await addMovement({
        referenceNo: checkout.referenceNo || "",
        item: checkout.item,
        quantity: checkout.quantity,
        location: checkout.location,
        batchNo: checkout.batchNo,
        expiryDate: checkout.expiryDate,
        type: "RECEIVE",
        remarks: `Returned by ${checkout.person || checkout.department}`,
      });

      toast.success(`Returned ${checkout.quantity} of ${checkout.item}`);
    } catch (err) {
      toast.error("Failed to return item.");
    }
  };

  return (
    <Card>
      <Card.Header>
        <Row className="align-items-center">
          <Col>
            <h5>Item Checkouts</h5>
            <small className="text-muted">Track borrowed items and their return timestamps.</small>
          </Col>
          <Col className="text-end">
            <Button variant="primary" onClick={() => setShowModal(true)}>Checkout Item</Button>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col md={4}>
            <InputGroup>
              <InputGroup.Text>Search</InputGroup.Text>
              <Form.Control
                placeholder="Item or Person/Department"
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
                <th>Reference No.</th>
                <th>Item</th>
                <th>Person</th>
                <th>Quantity</th>
                <th>Location</th>
                <th>Batch No.</th>
                <th>Expiry Date</th>
                <th>Checkout Time</th>
                <th>Return Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCheckouts.length === 0 ? (
                <tr><td colSpan="11" className="text-center">No checkouts found.</td></tr>
              ) : (
                paginatedCheckouts.map(c => (
                  <tr key={c.id}>
                    <td>{c.referenceNo || "—"}</td>
                    <td>{c.item}</td>
                    <td>{c.person || c.department}</td>
                    <td>{c.quantity}</td>
                    <td>{c.location || "Main Warehouse"}</td>
                    <td>{c.batchNo || "—"}</td>
                    <td>{c.expiryDate || "—"}</td>
                    <td>{c.date ? format(new Date(c.date), "dd/MM/yyyy HH:mm") : "—"}</td>
                    <td>{c.returnDate ? format(new Date(c.returnDate), "dd/MM/yyyy HH:mm") : "—"}</td>
                    <td>
                      <Badge bg={c.status === "Checked Out" ? "warning" : "success"}>{c.status}</Badge>
                    </td>
                    <td>
                      {c.status === "Checked Out" && (
                        <Button size="sm" variant="success" onClick={() => handleReturn(c)}>
                          Mark Returned
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
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

      {showModal && (
        <CheckoutModal
          show={showModal}
          onHide={() => setShowModal(false)}
          onSave={(m) => {
            addMovement(m);
            toast.success(`${m.item} checked out to ${m.person}`);
          }}
          stockLevels={stockLevels || {}}
        />
      )}
    </Card>
  );
}
