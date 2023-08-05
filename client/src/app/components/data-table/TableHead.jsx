import { TableCell, TableRow } from '@mui/material';
import MuiTableHead from '@mui/material/TableHead';

const TableHead = (props) => {
  const { headCells } = props;

  return (
    <MuiTableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </MuiTableHead>
  );
};

export default TableHead;
