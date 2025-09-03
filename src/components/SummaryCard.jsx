import React from "react";


export default function SummaryCard({ title, value, highlight }) {
return (
<div className="card p-3 text-center">
<h6 className="text-muted mb-1">{title}</h6>
<div className="fs-5 fw-bold" style={{ color: highlight || "#111" }}>{value}</div>
</div>
);
}