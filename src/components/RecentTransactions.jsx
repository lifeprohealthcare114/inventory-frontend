import React from "react";

export default function RecentTransactions({ transactions = [] }) {
  return (
    <div className="card recent-card p-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="mb-0">Recent Transactions</h6>
        <button className="btn btn-sm btn-outline-secondary">View All</button>
      </div>

      {transactions.length === 0 ? (
        <div className="text-muted small">No recent transactions.</div>
      ) : (
        transactions.map((r, i) => (
          <div
            key={i}
            className="d-flex align-items-center justify-content-between py-2 border-top"
          >
            <div>
              <div className="fw-bold">
                {r.type} — {r.item}
              </div>
              <div className="text-muted small">
                {r.qty} qty • {r.date} • {r.user}
              </div>
            </div>
            <div className="text-end">
              <div>
                Stock: <strong>{r.stock}</strong>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
