import React, { useState } from "react";
import SupplierTable from "./SupplierTable";
import SupplierModal from "./SupplierModal";
import { Button } from "react-bootstrap";
import { useDataContext } from "../../context/DataContext";

const Supplier = () => {
  const { suppliers, addSupplier, editSupplier, removeSupplier } = useDataContext();

  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const handleAddSupplier = async (supplier) => {
    if (editingSupplier) {
      await editSupplier(editingSupplier.id, supplier);
    } else {
      await addSupplier(supplier);
    }
    setEditingSupplier(null);
    setShowModal(false);
  };

  const handleEditSupplier = (supplier) => {
    setEditingSupplier(supplier);
    setShowModal(true);
  };

  const handleDeleteSupplier = async (id) => {
    await removeSupplier(id);
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h4">Supplier Management</h1>
        <Button onClick={() => setShowModal(true)}>+ Add Supplier</Button>
      </div>

      <SupplierTable
        suppliers={suppliers}
        onEdit={handleEditSupplier}
        onDelete={handleDeleteSupplier}
      />

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
