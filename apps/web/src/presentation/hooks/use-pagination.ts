import { useEffect, useState } from "react";

export function usePagination() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pages, setPages] = useState(1);

  const perPage = 10;

  useEffect(() => {
    if (totalItems === 0) return;

    setPages(Math.ceil(totalItems / perPage));
  }, [totalItems, perPage]);

  return {
    setCurrentPage,
    setTotalItems,
    perPage,
    currentPage,
    pages,
  };
}
