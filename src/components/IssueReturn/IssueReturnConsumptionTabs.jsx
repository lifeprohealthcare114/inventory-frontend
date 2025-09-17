import React from "react";
import { Tabs, Tab } from "react-bootstrap";
import IssueList from "./IssueList";
import ConsumptionList from "./ConsumptionList";

export default function IssueReturnConsumptionTabs() {
  return (
    <div>
      <h3 className="mb-3">Stock Operations</h3>
      <Tabs defaultActiveKey="issue" id="stock-operations-tabs" className="mb-3">
        <Tab eventKey="issue" title="Issue / Return">
          <IssueList />
        </Tab>
        <Tab eventKey="consumption" title="Consumption / Usage">
          <ConsumptionList />
        </Tab>
      </Tabs>
    </div>
  );
}
