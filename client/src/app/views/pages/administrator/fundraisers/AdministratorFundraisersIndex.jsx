import { useEffect, useState } from 'react';

import {
  Button,
  Paper,
  styled,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { Breadcrumb } from 'app/components';
import { TableHead, TableToolbar } from 'app/components/data-table';
import { FlexBox } from 'app/components/FlexBox';
import useTable from 'app/hooks/useTable';
import AdministratorFundraiserHandlerContract from 'contracts/AdministratorFundraiserHandler.json';
import getWeb3 from 'utils/getWeb3';

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
const FlexEndBox = styled(FlexBox)({ justifyContent: 'flex-end' });

function AdministratorFundraisersIndex() {
  const { page, rowsPerPage, handleChangePage } = useTable();
  const [fundraisers, setFundraisers] = useState([]);
  const [fundraisersCount, setFundraisersCount] = useState(0);
  const navigate = useNavigate();

  // TABLE HEADER COLUMN LIST
  const columns = [
    {
      id: 'name',
      align: 'center',
      disablePadding: true,
      label: 'Name',
    },
    {
      id: 'startedAt',
      align: 'center',
      disablePadding: false,
      label: 'StartedAt',
    },
    {
      id: 'endedAt',
      align: 'center',
      disablePadding: false,
      label: 'EndedAt',
    },
    {
      id: 'donationsAmount',
      align: 'center',
      disablePadding: false,
      label: 'DonationsAmount (ether)',
    },
    {
      id: 'donationsCount',
      align: 'center',
      disablePadding: false,
      label: 'DonationsCount',
    },
    {
      id: 'edit',
      align: 'center',
      disablePadding: false,
      label: 'Edit',
    },
  ];

  useEffect(() => {
    const init = async () => {
      try {
        const localWeb3 = await getWeb3();
        const localNetworkId = await localWeb3.eth.net.getId();
        const localDeployedNetwork = AdministratorFundraiserHandlerContract
          .networks[localNetworkId];
        const localContract = new localWeb3.eth.Contract(
          AdministratorFundraiserHandlerContract.abi,
          localDeployedNetwork && localDeployedNetwork.address,
        );
        const localFundraisers = await localContract.methods
          .fundraisers(rowsPerPage, page * rowsPerPage)
          .call();
        setFundraisers(localFundraisers);
        const localFundraisersCount = await localContract.methods
          .fundraisersCount()
          .call();
        setFundraisersCount(parseInt(localFundraisersCount, 10));
      } catch (error) {
        alert(
          'Failed to load web3, accounts, or contract. Check console for details.',
        );
        console.error(error); // eslint-disable-line no-console
      }
    };
    init();
  }, [page, rowsPerPage]);

  return (
    <Container>
      <div className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: 'Fundraisers' }]} />
      </div>

      <FlexEndBox mb={3} px={2} gap={2} className="new-fundraiser">
        <Button
          color="primary"
          variant="contained"
          onClick={() => navigate('/administrator/fundraisers/new')}
        >
          New
        </Button>
      </FlexEndBox>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableToolbar title="Fundraisers" />

        <TableContainer>
          <Table sx={{ minWidth: 750 }}>
            <TableHead headCells={columns} />

            <TableBody>
              {fundraisers.map((fundraiser) => (
                <FundraiserRow fundraiser={fundraiser} key={fundraiser} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          page={page}
          component="div"
          rowsPerPage={rowsPerPage}
          count={fundraisersCount}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[]}
        />
      </Paper>
    </Container>
  );
}

export default AdministratorFundraisersIndex;
