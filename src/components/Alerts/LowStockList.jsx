import React, { useEffect, useState } from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import { fetchLowStockItems  } from '../../api/api';
import ReorderModal from './ReorderModal';


export default function LowStockList() {
const [items, setItems] = useState([]);
const [loading, setLoading] = useState(false);
const [selected, setSelected] = useState(null);
const [showReorder, setShowReorder] = useState(false);


const load = () => {
setLoading(true);
fetchLowStockItems().then(r => setItems(r.data)).catch(console.error).finally(() => setLoading(false));
};


useEffect(() => { load(); }, []);


return (
<div>
<div className="d-flex justify-content-between align-items-center mb-2"><h4>Low Stock Items</h4><Button onClick={load}>Refresh</Button></div>
<Table responsive bordered hover>
<thead><tr><th>Item</th><th>SKU</th><th>Stock Qty</th><th>Min Level</th><th>Warehouse</th><th>Action</th></tr></thead>
<tbody>
{items.map(it => (
<tr key={it.id}>
<td>{it.name}</td>
<td>{it.sku}</td>
<td>{it.stockQty}</td>
<td>{it.minimumStockLevel}</td>
<td>{it.warehouse?.name || '—'}</td>
<td><Button size="sm" onClick={() => { setSelected(it); setShowReorder(true); }}>Create PO</Button></td>
</tr>
))}
</tbody>
</Table>


<ReorderModal show={showReorder} item={selected} onClose={() => setShowReorder(false)} onCreated={load} />
</div>
);
}

