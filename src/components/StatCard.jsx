// src/components/StatCard.jsx
import React from "react";

export default function StatCard({ title, children }) {
  return (
    <div className="card p-3">
      <h6>{title}</h6>
      <div className="mt-2">{children}</div>
    </div>
  );
}
