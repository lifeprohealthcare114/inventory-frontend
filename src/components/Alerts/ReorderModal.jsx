import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { createReorderDraftPO, fetchSuppliers } from '../../api/api';

export default function ReorderModal({ show, item, onClose, onCreated }) {
  const [qty, setQty] = useState(0);
  const [loading, setLoading] = useState(false);
  const [warehouseId, setWarehouseId] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [supplierId, setSupplierId] = useState(null);

  // Calculate default reorder quantity
  useEffect(() => {
    if (item) {
      setQty(Math.max(0, (item.minimumStockLevel || 0) - (item.stockQty || 0)));
    } else {
      setQty(0);
    }
  }, [item]);

  // Load suppliers when modal opens
  useEffect(() => {
    if (show) {
      fetchSuppliers()
        .then(r => setSuppliers(r.data))
        .catch(console.error);
    }
  }, [show]);

  const submit = async () => {
    if (!item || qty <= 0 || !supplierId) {
      alert("Please select a supplier and quantity > 0.");
      return;
    }

    setLoading(true);
    try {
      await createReorderDraftPO({
        itemId: item.id,
        qty,
        warehouseId: warehouseId || null,
        supplierId,
      });

      onCreated && onCreated();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to create draft PO');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create Draft Purchase Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {item ? (
          <Form>
            <Row className="g-2">
              <Col md={12}>
                <p><strong>{item.name}</strong> (SKU: {item.sku})</p>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Qty</Form.Label>
                  <Form.Control
                    type="number"
                    value={qty}
                    onChange={e => setQty(Number(e.target.value))}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Warehouse (optional)</Form.Label>
                  <Form.Control
                    placeholder="Warehouse id"
                    value={warehouseId || ''}
                    onChange={e => setWarehouseId(e.target.value ? Number(e.target.value) : null)}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Supplier</Form.Label>
                  <Form.Select
                    value={supplierId || ''}
                    onChange={e => setSupplierId(Number(e.target.value))}
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        ) : (
          <p>No item selected.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button
          variant="primary"
          onClick={submit}
          disabled={loading || qty <= 0 || !supplierId}
        >
          Create Draft PO
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
