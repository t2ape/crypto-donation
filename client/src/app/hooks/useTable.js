import { useState } from "react";

const useTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(30);

  const handleChangePage = (_, newPage) => setPage(newPage);

  return {
    page,
    rowsPerPage,
    handleChangePage,
  };
};

export default useTable;
