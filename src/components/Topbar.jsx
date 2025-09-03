import React from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';


export default function Topbar(){
return (
<div className="topbar d-flex align-items-center justify-content-between">
<div className="d-flex align-items-center gap-3">
<InputGroup className="search-input">
<Form.Control placeholder="Search items, categories, \u2026" />
</InputGroup>
</div>
<div className="d-flex align-items-center gap-2">
<Button variant="outline-secondary">Notifications</Button>
<img src="/assets/screenshot.png" alt="user" style={{width:36,height:36,borderRadius:18}} />
</div>
</div>
)
}