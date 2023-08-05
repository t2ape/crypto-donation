import { useState } from "react";

const useCollection = () => {
  const [page, setPage] = useState(0);
  const [itemsPerPage] = useState(30);

  const handleChangePage = (_, newPage) => setPage(newPage);

  return {
    page,
    itemsPerPage,
    handleChangePage,
  };
};

export default useCollection;
