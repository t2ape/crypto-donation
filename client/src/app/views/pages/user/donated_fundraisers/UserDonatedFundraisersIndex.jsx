import {
  Paper,
  styled,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
} from '@mui/material';

import { Breadcrumb, MatxLoading } from 'app/components';
import { TableHead, TableToolbar } from 'app/components/data-table';
import useCollection from 'app/hooks/useCollection';
import useDonatedFundraisers from 'app/hooks/user/useDonatedFundraisers';

import FundraiserRow from './FundraiserRow';

// styled components
const Container = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}));

function UserDonatedFundraisersIndex() {
  const { page, itemsPerPage, handleChangePage } = useCollection();

  const { isLoading, donatedFundraisers } = useDonatedFundraisers();

  // TABLE HEADER COLUMN LIST
  const columns = [
    {
      id: 'name',
      align: 'center',
      disablePadding: true,
      label: 'Name',
    },
    {
      id: 'description',
      align: 'center',
      disablePadding: true,
      label: 'Description',
    },
    {
      id: 'details',
      align: 'center',
      disablePadding: false,
      label: 'Details',
    },
  ];

  if (isLoading) return <MatxLoading />;

  return (
    <Container>
      <div className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Pages', path: '/pages' },
            { name: 'Fundraisers' },
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
          <TableToolbar title="Donated Fundraisers" />

          <TableContainer>
            <Table>
              <TableHead headCells={columns} />

              <TableBody>
                {donatedFundraisers
                  ?.slice(
                    page * itemsPerPage,
                    page * itemsPerPage + itemsPerPage,
                  )
                  .map((donatedFundraiser) => (
                    <FundraiserRow
                      fundraiser={donatedFundraiser}
                      key={donatedFundraiser}
                    />
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            page={page}
            component="div"
            rowsPerPage={itemsPerPage}
            count={donatedFundraisers.length}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[]}
          />
        </Paper>
      </div>
    </Container>
  );
}

export default UserDonatedFundraisersIndex;
