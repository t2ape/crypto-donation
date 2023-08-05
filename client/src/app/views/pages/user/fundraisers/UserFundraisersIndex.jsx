import { useEffect, useState } from 'react';

import { styled, TablePagination } from '@mui/material';

import { Breadcrumb } from 'app/components';
import useCollection from 'app/hooks/useCollection';
import FundraiserCard from 'app/views/pages/user/fundraisers/FundraiserCard';
import UserFundraiserHandlerContract from 'contracts/UserFundraiserHandler.json';
import getWeb3 from 'utils/getWeb3';

// styled components
const Container = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
}));

function UserFundraisersIndex() {
  const { page, itemsPerPage, handleChangePage } = useCollection();
  const [fundraisers, setFundraisers] = useState([]);
  const [fundraisersCount, setFundraisersCount] = useState(0);

  useEffect(() => {
    const init = async () => {
      try {
        const localWeb3 = await getWeb3();
        const localNetworkId = await localWeb3.eth.net.getId();
        const localDeployedNetwork =
          UserFundraiserHandlerContract.networks[localNetworkId];
        const localContract = new localWeb3.eth.Contract(
          UserFundraiserHandlerContract.abi,
          localDeployedNetwork && localDeployedNetwork.address,
        );
        const localFundraisers = await localContract.methods
          .activeFundraisers(itemsPerPage, page * itemsPerPage)
          .call();
        setFundraisers(localFundraisers);
        const localFundraisersCount = await localContract.methods
          .activeFundraisersCount()
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
  }, [page, itemsPerPage]);

  return (
    <Container>
      <Container>
        <Breadcrumb routeSegments={[{ name: 'Fundraisers' }]} />
      </Container>

      <div>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {fundraisers.map((fundraiser) => (
            <FundraiserCard fundraiser={fundraiser} key={fundraiser} />
          ))}
        </div>

        <TablePagination
          page={page}
          component="div"
          rowsPerPage={itemsPerPage}
          count={fundraisersCount}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[]}
        />
      </div>
    </Container>
  );
}

export default UserFundraisersIndex;
