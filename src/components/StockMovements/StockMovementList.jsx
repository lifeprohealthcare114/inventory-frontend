import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Table, Form, Row, Col, Button, InputGroup, Spinner, Alert, Badge, Pagination } from 'react-bootstrap';
import { fetchStockMovementsPaginated } from '../../api/api';
import StockMovementModal from './StockMovementModal';
import axios from 'axios';
import debounce from 'lodash.debounce';

const typeLabels = {
  IN: { label: "Stock In", variant: "success" },
  OUT: { label: "Stock Out", variant: "danger" },
  ADJUST: { label: "Adjustment", variant: "primary" },
  CONSUMPTION: { label: "Consumption", variant: "warning" },
  PRODUCTION: { label: "Production", variant: "info" }
};

export default function StockMovementList() {
  const [movements, setMovements] = useState([]);
  const [items, setItems] = useState([]);
  const [itemSearch, setItemSearch] = useState('');
  const [filters, setFilters] = useState({ itemId: '', type: '', from: '', to: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Pagination & sorting
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sortField, setSortField] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

  // Keyboard navigation & dropdown
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // --- Fetch stock movements ---
  const loadMovements = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params = { ...filters, page, size, sortField, sortDir };
      if (filters.from) params.from = filters.from + 'T00:00:00';
      if (filters.to) params.to = filters.to + 'T23:59:59';

      const res = await fetchStockMovementsPaginated(params);
      setMovements(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error(err);
      setError('Failed to load stock movements.');
      setMovements([]);
    } finally {
      setLoading(false);
    }
  }, [filters, page, size, sortField, sortDir]);

  useEffect(() => { loadMovements(); }, [loadMovements]);

  // --- Fetch items with server-side search ---
  useEffect(() => {
    if (!itemSearch.trim() || !isTyping) {
      setItems([]);
      return;
    }

    const fetchItems = debounce(async (searchTerm) => {
      try {
        const res = await axios.get('http://localhost:8080/api/items/paginated', {
          params: { page: 0, size: 10, search: searchTerm } // <-- send 'search' param
        });
        setItems(res.data.content || []);
        setHighlightIndex(-1);
      } catch (err) {
        console.error('Failed to fetch items:', err);
        setItems([]);
      }
    }, 300);

    fetchItems(itemSearch);
    return () => fetchItems.cancel();
  }, [itemSearch, isTyping]);

  // --- Click outside closes dropdown ---
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          searchInputRef.current && !searchInputRef.current.contains(e.target)) {
        setItems([]);
        setHighlightIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- Handlers ---
  const onFilterChange = e => setFilters({ ...filters, [e.target.name]: e.target.value });

  const resetFilters = () => {
    setFilters({ itemId: '', type: '', from: '', to: '' });
    setItemSearch('');
    setItems([]);
    setPage(0);
    setIsTyping(false);
  };

  const handleSort = field => {
    if (sortField === field) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
    setPage(0);
  };

  const renderSortIcon = field => (sortField !== field ? '↕' : (sortDir === 'asc' ? '↑' : '↓'));

  const selectItem = (item) => {
    setFilters({ ...filters, itemId: item.id });
    setItemSearch(item.name);
    setItems([]);
    setHighlightIndex(-1);
    setIsTyping(false);
    searchInputRef.current?.blur();
  };

  const handleKeyDown = (e) => {
    if (!items.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((prev) => (prev + 1) % items.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((prev) => (prev - 1 + items.length) % items.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightIndex >= 0 && highlightIndex < items.length) selectItem(items[highlightIndex]);
    } else if (e.key === 'Escape') {
      setItems([]);
      setHighlightIndex(-1);
    }
  };

  return (
    <div>
      <h4>Stock Movements</h4>

      <Form className="mb-3">
        <Row className="g-2 align-items-center">
          {/* Item search */}
          <Col md={3} style={{ position: 'relative' }}>
            <Form.Control
              type="text"
              placeholder="Search item..."
              value={itemSearch}
              ref={searchInputRef}
              onFocus={() => setIsTyping(true)}
              onChange={e => { setItemSearch(e.target.value); setIsTyping(true); }}
              onKeyDown={handleKeyDown}
            />
            {items.length > 0 && (
              <div ref={dropdownRef} style={{
                position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1000,
                maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', background: '#fff'
              }}>
                {items.map((i, idx) => (
                  <div
                    key={i.id}
                    style={{
                      padding: '5px 10px',
                      cursor: 'pointer',
                      background: highlightIndex === idx ? '#f0f0f0' : '#fff'
                    }}
                    onClick={() => selectItem(i)}
                  >
                    {i.name}
                  </div>
                ))}
              </div>
            )}
          </Col>

          {/* Type */}
          <Col md={2}>
            <Form.Select name="type" value={filters.type} onChange={onFilterChange}>
              <option value="">All types</option>
              {Object.keys(typeLabels).map(t => <option key={t} value={t}>{t}</option>)}
            </Form.Select>
          </Col>

          {/* Date filters */}
          <Col md={2}><Form.Control type="date" name="from" value={filters.from} onChange={onFilterChange} /></Col>
          <Col md={2}><Form.Control type="date" name="to" value={filters.to} onChange={onFilterChange} /></Col>

          {/* Page size */}
          <Col md={1}>
            <Form.Select value={size} onChange={e => { setSize(Number(e.target.value)); setPage(0); }}>
              {[5, 10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
            </Form.Select>
          </Col>

          {/* Buttons */}
          <Col md={2}>
            <InputGroup>
              <Button variant="primary" onClick={() => { setPage(0); loadMovements(); }}>Apply</Button>
              <Button variant="outline-secondary" onClick={resetFilters}>Reset</Button>
            </InputGroup>
          </Col>
        </Row>
      </Form>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th style={{ cursor: 'pointer' }} onClick={() => handleSort('date')}>Date {renderSortIcon('date')}</th>
            <th style={{ cursor: 'pointer' }} onClick={() => handleSort('itemName')}>Item {renderSortIcon('itemName')}</th>
            <th>Warehouse</th>
            <th>Quantity</th>
            <th>Type</th>
            <th>User</th>
            <th>Reference</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {loading && <tr><td colSpan={8} className="text-center"><Spinner animation="border" size="sm" /> Loading…</td></tr>}
          {!loading && movements.length === 0 && <tr><td colSpan={8} className="text-center">No records found.</td></tr>}
          {!loading && movements.map(m => {
            const typeInfo = typeLabels[m.type] || { label: m.type, variant: "secondary" };
            return (
              <tr key={m.id}>
                <td>{m.date ? new Date(m.date).toLocaleString() : 'N/A'}</td>
                <td>{m.itemName || 'N/A'}</td>
                <td>{m.warehouseName || 'N/A'}</td>
                <td>{m.quantity ?? 0}</td>
                <td><Badge bg={typeInfo.variant}>{typeInfo.label}</Badge></td>
                <td>{m.userName || 'N/A'}</td>
                <td>{m.reference || '-'}</td>
                <td><Button size="sm" onClick={() => { setSelectedId(m.id); setShowModal(true); }}>View</Button></td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {totalPages > 1 && (
        <Pagination>
          <Pagination.Prev disabled={page === 0} onClick={() => setPage(prev => prev - 1)} />
          {[...Array(totalPages)].map((_, i) => (
            <Pagination.Item key={i} active={i === page} onClick={() => setPage(i)}>{i + 1}</Pagination.Item>
          ))}
          <Pagination.Next disabled={page === totalPages - 1} onClick={() => setPage(prev => prev + 1)} />
        </Pagination>
      )}

      <StockMovementModal show={showModal} id={selectedId} onClose={() => setShowModal(false)} />
    </div>
  );
}
