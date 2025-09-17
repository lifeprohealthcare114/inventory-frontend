import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { createReorderDraftPO  } from '../../api/api';


export default function ReorderModal({ show, item, onClose, onCreated }) {
const [qty, setQty] = useState(0);
const [loading, setLoading] = useState(false);


useEffect(() => { if (item) setQty(Math.max(0, (item.minimumStockLevel || 0) - (item.stockQty || 0))); else setQty(0); }, [item]);


const submit = async () => {
if (!item) return;
setLoading(true);
try {
await createReorderDraftPO({ items: [{ itemId: item.id, qty }] });
onCreated && onCreated();
onClose();
} catch (err) { console.error(err); alert('Failed to create draft PO'); }
finally { setLoading(false); }
};


return (
<Modal show={show} onHide={onClose} centered>
<Modal.Header closeButton><Modal.Title>Create Draft Purchase Order</Modal.Title></Modal.Header>
<Modal.Body>
{item ? (
<Form>
<Row className="g-2">
<Col md={12}><p><strong>{item.name}</strong> (SKU: {item.sku})</p></Col>
<Col md={6}><Form.Group><Form.Label>Qty</Form.Label><Form.Control type="number" value={qty} onChange={e => setQty(Number(e.target.value))} /></Form.Group></Col>
<Col md={6}><Form.Group><Form.Label>Warehouse (optional)</Form.Label><Form.Control placeholder="Warehouse id" /></Form.Group></Col>
</Row>
</Form>
) : <p>No item selected.</p>}
</Modal.Body>
<Modal.Footer>
<Button variant="secondary" onClick={onClose}>Cancel</Button>
<Button variant="primary" onClick={submit} disabled={loading || qty <= 0}>Create Draft PO</Button>
</Modal.Footer>
</Modal>
);
}