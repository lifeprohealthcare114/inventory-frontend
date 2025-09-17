import React, { useEffect, useState } from "react";
import { Table, Button, Spinner } from "react-bootstrap";
import { fetchConsumptions } from "../../api/api";
import ConsumptionForm from "./ConsumptionForm";

export default function ConsumptionList() {
  const [consumptions, setConsumptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetchConsumptions();
      setConsumptions(r.data || []);
    } catch (err) {
      console.error("Failed to fetch consumptions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between mb-2 align-items-center">
        <h4 className="mb-0">Consumption / Usage</h4>
        <Button size="sm" variant="primary" onClick={() => setShowForm(true)}>
          + Log Consumption
        </Button>
      </div>

      {loading ? (
        <div className="text-center my-3">
          <Spinner animation="border" />
        </div>
      ) : consumptions.length === 0 ? (
        <p className="text-muted">No consumption records found.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Date</th>
              <th>Item</th>
              <th>Quantity</th>
              <th>Department</th>
              <th>Purpose</th>
              <th>Person</th>
            </tr>
          </thead>
          <tbody>
            {consumptions.map((c) => (
              <tr key={c.id}>
                <td>{c.date ? new Date(c.date).toLocaleDateString() : "-"}</td>
                <td>{c.itemName || "-"}</td>
                <td>{c.quantity}</td>
                <td>{c.department || "-"}</td>
                <td>{c.purpose || "-"}</td>
                <td>{c.person || "-"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal Form */}
      <ConsumptionForm
        show={showForm}
        onClose={() => setShowForm(false)}
        onSaved={load}
      />
    </div>
  );
}
