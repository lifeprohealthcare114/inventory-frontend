import React from "react";
import { Table, Button, Pagination } from "react-bootstrap";

const SupplierTable = ({ suppliers, onEdit, onDelete, page, totalPages, onPageChange }) => {
  return (
    <>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Code</th>
            <th>Supplier Name</th>
            <th>Contact Person</th>
            <th>Phone</th>
            <th>Email</th>
            <th>GST / VAT</th>
            <th>Payment Terms</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.length > 0 ? (
            suppliers.map((supplier) => (
              <tr key={supplier.id || supplier.supplierCode}>
                <td>{supplier.supplierCode}</td>
                <td>{supplier.name}</td>
                <td>{supplier.contactPerson}</td>
                <td>{supplier.phone}</td>
                <td>{supplier.email}</td>
                <td>{supplier.gstNumber}</td>
                <td>{supplier.paymentTerms}</td>
                <td>{supplier.status}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => onEdit(supplier)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    disabled={!supplier.id}
                    onClick={() => supplier.id && onDelete(supplier.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center">
                No suppliers found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* 🔹 Pagination Controls */}
      {totalPages > 1 && (
        <Pagination className="justify-content-center">
          <Pagination.First onClick={() => onPageChange(0)} disabled={page === 0} />
          <Pagination.Prev onClick={() => onPageChange(page - 1)} disabled={page === 0} />

          {[...Array(totalPages)].map((_, idx) => (
            <Pagination.Item
              key={idx}
              active={idx === page}
              onClick={() => onPageChange(idx)}
            >
              {idx + 1}
            </Pagination.Item>
          ))}

          <Pagination.Next onClick={() => onPageChange(page + 1)} disabled={page === totalPages - 1} />
          <Pagination.Last onClick={() => onPageChange(totalPages - 1)} disabled={page === totalPages - 1} />
        </Pagination>
      )}
    </>
  );
};

export default SupplierTable;
