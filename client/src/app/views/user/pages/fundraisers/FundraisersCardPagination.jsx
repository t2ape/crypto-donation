import { useState } from 'react';
import { Pagination } from '@mui/material';

const pageSize = 30;

function CardPagination({ items, ItemCard }) {
  const [page, setPage] = useState(1);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const cardsToShow = items.slice(startIndex, endIndex);

  return (

    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {cardsToShow.map((item) => (
          <ItemCard item={item} key={item}/>
        ))}
      </div>
      <Pagination
        count={Math.ceil(items.length / pageSize)}
        page={page}
        onChange={handleChangePage}
      />
    </div>
  );
}

export default CardPagination;
