import React, { useState, useEffect } from "react";
import SupplierTable from "./SupplierTable";
import SupplierModal from "./SupplierModal";
import { Button } from "react-bootstrap";

const Supplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  // Load suppliers (simulate API call)
  useEffect(() => {
    const storedSuppliers = JSON.parse(localStorage.getItem("suppliers")) || [];
    setSuppliers(storedSuppliers);
  }, []);

  // Save suppliers to local storage
  useEffect(() => {
    localStorage.setItem("suppliers", JSON.stringify(suppliers));
  }, [suppliers]);

  const handleAddSupplier = (supplier) => {
    if (editingSupplier) {
      setSuppliers((prev) =>
        prev.map((s) => (s.id === editingSupplier.id ? { ...supplier, id: s.id } : s))
      );
    } else {
      setSuppliers((prev) => [...prev, { ...supplier, id: Date.now() }]);
    }
    setEditingSupplier(null);
    setShowModal(false);
  };

  const handleEditSupplier = (supplier) => {
    setEditingSupplier(supplier);
    setShowModal(true);
  };

  const handleDeleteSupplier = (id) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h4">Supplier Management</h1>
        <Button onClick={() => setShowModal(true)}>+ Add Supplier</Button>
      </div>

      <SupplierTable suppliers={suppliers} onEdit={handleEditSupplier} onDelete={handleDeleteSupplier} />

      {showModal && (
        <SupplierModal
          onClose={() => {
            setShowModal(false);
            setEditingSupplier(null);
          }}
          onSave={handleAddSupplier}
          supplier={editingSupplier}
        />
      )}
    </div>
  );
};

export default Supplier;
