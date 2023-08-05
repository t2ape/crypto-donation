import {
  Paper,
  styled,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
} from '@mui/material';
import { useParams } from 'react-router-dom';

import { Breadcrumb, MatxLoading } from 'app/components';
import { TableHead, TableToolbar } from 'app/components/data-table';
import useCollection from 'app/hooks/useCollection';
import useDonations from 'app/hooks/user/useDonations';

import DonationRow from './DonationRow';

// styled components
const Container = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}));

function Show() {
  const { id } = useParams();

  const { page, itemsPerPage, handleChangePage } = useCollection();

  const { isLoading, donations } = useDonations(id);

  // TABLE HEADER COLUMN LIST
  const columns = [
    {
      id: 'value', align: 'center', disablePadding: true, label: 'Value (ether)',
    },
    {
      id: 'date', align: 'center', disablePadding: false, label: 'Date',
    },
  ];

  if (isLoading) return <MatxLoading />;

  return (
    <Container>
      <div className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Donated Fundraisers', path: '/user/donated_fundraisers' },
            { name: 'Donations' },
          ]}
        />
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper sx={{ width: '60%', mb: 2 }}>
          <TableToolbar title="Donations" />

          <TableContainer>
            <Table sx={{ minWidth: 750 }}>
              <TableHead headCells={columns} />

              <TableBody>
                {donations
                  ?.slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage)
                  .map((donation) => (
                    <DonationRow donation={donation} key={donation} />
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            page={page}
            component="div"
            rowsPerPage={itemsPerPage}
            count={donations.length}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[]}
          />
        </Paper>
      </div>
    </Container>
  );
}

export default Show;
