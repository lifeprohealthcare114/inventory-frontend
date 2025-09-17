// src/components/Stock/StockAdjustmentList.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Table, Button, Badge, Spinner, Alert } from "react-bootstrap";
import StockAdjustmentForm from "./StockAdjustmentsForm";
import {
  fetchStockAdjustments,
  approveStockAdjustment,
  rejectStockAdjustment,
} from "../../api/api";

export default function StockAdjustmentList({ currentUser }) {
  const [adjustments, setAdjustments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetchStockAdjustments();
      const data = res?.data;
      setAdjustments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading adjustments:", err);
      setError("Failed to load stock adjustments.");
      setAdjustments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onApprove = async (id, approve) => {
    try {
      if (approve) {
        await approveStockAdjustment(id);
      } else {
        await rejectStockAdjustment(id);
      }
      // Update status locally without full reload
      setAdjustments((prev) =>
        prev.map((adj) =>
          adj.id === id
            ? { ...adj, status: approve ? "APPROVED" : "REJECTED" }
            : adj
        )
      );
    } catch (err) {
      console.error("Approval error:", err);
      alert("Failed to update approval status.");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h4>Stock Adjustments</h4>
        <Button onClick={() => setShowForm(true)}>New Adjustment</Button>
      </div>

      {loading && (
        <div className="text-center my-3">
          <Spinner animation="border" />
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && adjustments.length === 0 && (
        <Alert variant="info">No stock adjustments found.</Alert>
      )}

      {!loading && adjustments.length > 0 && (
        <Table responsive bordered hover>
          <thead>
            <tr>
              <th>Date</th>
              <th>Item</th>
              <th>Warehouse</th>
              <th>Type</th>
              <th>Qty</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {adjustments.map((a) => (
              <tr key={a.id}>
                <td>{a.date ? new Date(a.date).toLocaleString() : "N/A"}</td>
                <td>{a.itemName || "N/A"}</td>
                <td>{a.warehouseName || "N/A"}</td>
                <td>{a.type || "N/A"}</td>
                <td>{a.quantity ?? 0}</td>
                <td>
                  <Badge
                    bg={
                      a.status === "PENDING"
                        ? "warning"
                        : a.status === "APPROVED"
                        ? "success"
                        : "secondary"
                    }
                  >
                    {a.status}
                  </Badge>
                </td>
                <td>
                  {a.status === "PENDING" ? (
                    <>
                      <Button
                        size="sm"
                        variant="success"
                        className="me-1"
                        onClick={() => onApprove(a.id, true)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => onApprove(a.id, false)}
                      >
                        Reject
                      </Button>
                    </>
                  ) : (
                    <Badge
                      bg={a.status === "APPROVED" ? "success" : "danger"}
                      className="p-2"
                    >
                      {a.status === "APPROVED" ? "✅ Approved" : "❌ Rejected"}
                    </Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <StockAdjustmentForm
        show={showForm}
        onClose={() => setShowForm(false)}
        onSaved={load}
        currentUser={currentUser}
      />
    </div>
  );
}
