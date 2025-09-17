import React, { useEffect, useState } from 'react';
import { Table, Form, Row, Col, Button, InputGroup, Spinner, Alert } from 'react-bootstrap';
import { fetchStockMovements, fetchItems } from '../../api/api';
import StockMovementModal from './StockMovementModal';

export default function StockMovementList() {
  const [movements, setMovements] = useState([]);
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ itemId: '', type: '', from: '', to: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Load items
  useEffect(() => {
    fetchItems()
      .then(r => setItems(Array.isArray(r?.data) ? r.data : []))
      .catch(() => setItems([]));
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      setError('');

      // Convert date filters to ISO for backend
      const params = { ...filters };
      if (filters.from) params.from = filters.from + 'T00:00:00';
      if (filters.to) params.to = filters.to + 'T23:59:59';

      const res = await fetchStockMovements(params);
      setMovements(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load stock movements.");
      setMovements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onFilterChange = e => setFilters({ ...filters, [e.target.name]: e.target.value });
  const resetFilters = () => { setFilters({ itemId: '', type: '', from: '', to: '' }); setTimeout(load, 0); };

  return (
    <div>
      <h4>Stock Movements</h4>

      {/* Filters */}
      <Form className="mb-3">
        <Row className="g-2">
          <Col md={3}>
            <Form.Select name="itemId" value={filters.itemId} onChange={onFilterChange}>
              <option value="">All items</option>
              {items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Select name="type" value={filters.type} onChange={onFilterChange}>
              <option value="">All types</option>
              <option value="IN">IN</option>
              <option value="OUT">OUT</option>
              <option value="ADJUST">ADJUST</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Control type="date" name="from" value={filters.from} onChange={onFilterChange} />
          </Col>
          <Col md={2}>
            <Form.Control type="date" name="to" value={filters.to} onChange={onFilterChange} />
          </Col>
          <Col md={3}>
            <InputGroup>
              <Button variant="primary" onClick={load}>Apply</Button>
              <Button variant="outline-secondary" onClick={resetFilters}>Reset</Button>
            </InputGroup>
          </Col>
        </Row>
      </Form>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Date</th>
            <th>Item</th>
            <th>Warehouse</th>
            <th>Quantity</th>
            <th>Type</th>
            <th>User</th>
            <th>Reference</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={8} className="text-center"><Spinner animation="border" size="sm" /> Loading…</td>
            </tr>
          )}
          {!loading && movements.length === 0 && (
            <tr>
              <td colSpan={8} className="text-center">No records found.</td>
            </tr>
          )}
          {!loading && movements.map(m => (
            <tr key={m.id}>
              <td>{m.date ? new Date(m.date).toLocaleString() : 'N/A'}</td>
              <td>{m.itemName || 'N/A'}</td>
              <td>{m.warehouseName || 'N/A'}</td>
              <td>{m.quantity ?? 0}</td>
              <td>{m.type || 'N/A'}</td>
              <td>{m.userName || 'N/A'}</td>
              <td>{m.reference || '-'}</td>
              <td>
                <Button size="sm" onClick={() => { setSelectedId(m.id); setShowModal(true); }}>View</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal */}
      <StockMovementModal show={showModal} id={selectedId} onClose={() => setShowModal(false)} />
    </div>
  );
}
