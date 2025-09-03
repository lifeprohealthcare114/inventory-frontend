import React from 'react';


export default function RecentTransactions(){
const rows = [
{type:'Receive', item:'Steel Rods', qty:100, stock:150, date:'25/05/2024', user:'John Smith'},
{type:'Issue', item:'Screws', qty:20, stock:200, date:'20/05/2024', user:'Jane Doe'}
];


return (
<div className="card recent-card p-3">
<div className="d-flex justify-content-between align-items-center mb-2">
<h6 className="mb-0">Recent Transactions</h6>
<button className="btn btn-sm btn-outline-secondary">View All</button>
</div>


{rows.map((r,i)=> (
<div key={i} className="d-flex align-items-center justify-content-between py-2 border-top">
<div>
<div className="fw-bold">{r.type} — {r.item}</div>
<div className="text-muted small">{r.qty} qty • {r.date} • {r.user}</div>
</div>
<div className="text-end">
<div>Stock: <strong>{r.stock}</strong></div>
</div>
</div>
))}
</div>
)
}