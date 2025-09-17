import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { getStockMovementById } from '../../api/api';

export default function StockMovementModal({ show, id, onClose }) {
  const [movement, setMovement] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show && id) {
      setLoading(true);
      getStockMovementById(id)
        .then(res => setMovement(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    } else setMovement(null);
  }, [show, id]);

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Stock Movement Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && <p>Loading…</p>}
        {!loading && movement && (
          <div>
            <p><strong>Date:</strong> {movement.date ? new Date(movement.date).toLocaleString() : 'N/A'}</p>
            <p><strong>Item:</strong> {movement.itemName} (#{movement.itemId})</p>
            <p><strong>Quantity:</strong> {movement.quantity}</p>
            <p><strong>Type:</strong> {movement.type}</p>
            <p><strong>Warehouse:</strong> {movement.warehouseName}</p>
            <p><strong>User:</strong> {movement.userName}</p>
            <p><strong>Reference:</strong> {movement.reference || '—'}</p>
            <hr />
            <p><strong>Notes:</strong></p>
            <p>{movement.notes || 'No notes'}</p>
          </div>
        )}
        {!loading && !movement && <p>No details.</p>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
