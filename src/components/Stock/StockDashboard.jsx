// src/components/Stock/StockDashboard.jsx
import React, { useState } from "react";
import { Container, Tabs, Tab } from "react-bootstrap";
import StockMovements from "./StockMovements";
import ItemCheckouts from "./ItemCheckouts";

export default function StockDashboard() {
  const [movements, setMovements] = useState([
    {
      id: 1,
      date: "1/15/2024",
      item: "Dell Laptop Pro 15",
      type: "Receive",
      quantity: 20,
      location: "Main Warehouse",
      remarks: "Initial stock received",
    },
  ]);

  return (
    <Container fluid className="mt-3">
      <Tabs defaultActiveKey="movements" id="stock-tabs" className="mb-3">
        <Tab eventKey="movements" title="Stock Movements">
          <StockMovements
            externalMovements={movements}
            setExternalMovements={setMovements}
          />
        </Tab>
        <Tab eventKey="checkouts" title="Item Checkouts">
          <ItemCheckouts
            movements={movements}
            setMovements={setMovements}
          />
        </Tab>
      </Tabs>
    </Container>
  );
}
