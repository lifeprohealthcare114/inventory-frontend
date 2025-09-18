import React, { useState, useEffect } from "react";
import SupplierTable from "./SupplierTable";
import SupplierModal from "./SupplierModal";
import { Button, Form } from "react-bootstrap";
import { useDataContext } from "../../context/DataContext";

const Supplier = () => {
  const {
    suppliers,
    fetchSuppliers,
    addSupplier,
    editSupplier,
    removeSupplier,
    supplierTotalPages,
  } = useDataContext();

  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [page, setPage] = useState(0);
  const [size] = useState(10); // default page size
  const [search, setSearch] = useState("");

  // 🔹 Fetch suppliers whenever page/search changes
  useEffect(() => {
    fetchSuppliers(page, size, search);
  }, [page, size, search, fetchSuppliers]);

  const handleAddSupplier = async (supplier) => {
    if (editingSupplier) {
      await editSupplier(editingSupplier.id, supplier);
    } else {
      await addSupplier(supplier);
    }
    setEditingSupplier(null);
    setShowModal(false);
    fetchSuppliers(page, size, search); // refresh after save
  };

  const handleEditSupplier = (supplier) => {
    setEditingSupplier(supplier);
    setShowModal(true);
  };

  const handleDeleteSupplier = async (id) => {
    await removeSupplier(id);
    fetchSuppliers(page, size, search); // refresh after delete
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h4">Supplier Management</h1>
        <Button onClick={() => setShowModal(true)}>+ Add Supplier</Button>
      </div>

      {/* 🔹 Search Box */}
      <div className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search suppliers..."
          value={search}
          onChange={(e) => {
            setPage(0);
            setSearch(e.target.value);
          }}
        />
      </div>

      <SupplierTable
        suppliers={suppliers}
        onEdit={handleEditSupplier}
        onDelete={handleDeleteSupplier}
        page={page}
        totalPages={supplierTotalPages}
        onPageChange={setPage}
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
