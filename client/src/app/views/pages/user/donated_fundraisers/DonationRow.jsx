import React, { useEffect, useState } from 'react';

import { TableCell, TableRow } from '@mui/material';
import PropTypes from 'prop-types';

import getWeb3 from 'utils/getWeb3';

function DonationRow({ donation }) {
  const [web3, setWeb3] = useState(null);

  DonationRow.propTypes = {
    donation: PropTypes.shape({
      value: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired,
    }).isRequired,
  };

  useEffect(() => {
    const init = async () => {
      try {
        const localWeb3 = await getWeb3();
        setWeb3(localWeb3);
      } catch (error) {
        alert(
          'Failed to load web3, accounts, or contract. Check console for details.',
        );
        console.error(error); // eslint-disable-line no-console
      }
    };
    init();
  }, []);

  return (
    <TableRow hover tabIndex={-1}>
      <TableCell align="center">
        {web3 ? web3.utils.fromWei(donation.value, 'ether') : null}
      </TableCell>
      <TableCell align="center">
        {new Date(donation.date * 1000).toLocaleString()}
      </TableCell>
    </TableRow>
  );
}

export default DonationRow;
