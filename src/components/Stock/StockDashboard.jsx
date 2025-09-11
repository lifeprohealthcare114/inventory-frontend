import React, { useState, useEffect } from "react";
import { Container, Tabs, Tab } from "react-bootstrap";
import StockMovements from "./StockMovements";
import ItemCheckouts from "./ItemCheckouts";
import axios from "axios";

const API_BASE = "http://localhost:8080/api/stock-movements";

export default function StockDashboard() {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch movements from backend
  const fetchMovements = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}?page=0&size=100&sortBy=date&sortDir=desc`);
      setMovements(res.data.content); // assuming backend returns Page<StockMovementDto>
    } catch (err) {
      console.error("Failed to fetch stock movements:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, []);

  // Add movement (Receive, Issue, or Checkout)
  const addMovement = async (movement) => {
    try {
      await axios.post(API_BASE, movement);
      fetchMovements(); // refresh after add
    } catch (err) {
      console.error("Failed to add movement:", err);
    }
  };

  // Delete movement
  const deleteMovement = async (id) => {
    if (window.confirm("Are you sure you want to delete this movement?")) {
      try {
        await axios.delete(`${API_BASE}/${id}`);
        setMovements((prev) => prev.filter((m) => m.id !== id));
      } catch (err) {
        console.error("Failed to delete movement:", err);
      }
    }
  };

  return (
    <Container fluid className="mt-3">
      <Tabs defaultActiveKey="movements" id="stock-tabs" className="mb-3">
        <Tab eventKey="movements" title="Stock Movements">
          <StockMovements
            movements={movements}
            setMovements={setMovements}
            addMovement={addMovement}
            deleteMovement={deleteMovement}
            loading={loading}
          />
        </Tab>
        <Tab eventKey="checkouts" title="Item Checkouts">
          <ItemCheckouts
            movements={movements}
            setMovements={setMovements}
            addMovement={addMovement}
            loading={loading}
          />
        </Tab>
      </Tabs>
    </Container>
  );
}
