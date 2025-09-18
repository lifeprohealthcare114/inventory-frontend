import React from "react";
import { Pagination as BSPagination } from "react-bootstrap";

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const handleClick = (p) => {
    if (p < 1 || p > totalPages) return;
    onChange(p);
  };

  const getPaginationItems = () => {
    const items = [];
    const maxButtons = 5;
    let start = Math.max(1, page - Math.floor(maxButtons / 2));
    let end = Math.min(totalPages, start + maxButtons - 1);
    if (end - start < maxButtons - 1) start = Math.max(1, end - maxButtons + 1);

    for (let i = start; i <= end; i++) {
      items.push(
        <BSPagination.Item key={i} active={i === page} onClick={() => handleClick(i)}>
          {i}
        </BSPagination.Item>
      );
    }
    return items;
  };

  return (
    <BSPagination className="justify-content-center">
      <BSPagination.First onClick={() => handleClick(1)} disabled={page === 1} />
      <BSPagination.Prev onClick={() => handleClick(page - 1)} disabled={page === 1} />
      {getPaginationItems()}
      <BSPagination.Next onClick={() => handleClick(page + 1)} disabled={page === totalPages} />
      <BSPagination.Last onClick={() => handleClick(totalPages)} disabled={page === totalPages} />
    </BSPagination>
  );
}
