import React, { useEffect, useState } from 'react';

import { Edit } from '@mui/icons-material';
import {
  Box, IconButton, styled, TableCell, TableRow,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import { H5 } from 'app/components/Typography';
import FundraiserContract from 'contracts/Fundraiser.json';
import getWeb3 from 'utils/getWeb3';

// styled components
const IMG = styled('img')({
  height: 32,
  borderRadius: '4px',
});
const FlexBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
});

function FundraiserRow({ fundraiser }) {
  const [name, setName] = useState(null);
  const [startedAt, setStartedAt] = useState(null);
  const [endedAt, setEndedAt] = useState(null);
  const [donationsAmountLabel, setDonationsAmountLabel] = useState(null);
  const [donationsCount, setDonationsCount] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  FundraiserRow.propTypes = {
    fundraiser: PropTypes.string.isRequired,
  };

  useEffect(() => {
    const init = async () => {
      try {
        const localWeb3 = await getWeb3();
        const localContract = new localWeb3.eth.Contract(
          FundraiserContract.abi,
          fundraiser,
        );
        const localName = await localContract.methods.name().call();
        setName(localName);
        const localStartedAt = await localContract.methods.startedAt().call();
        setStartedAt(localStartedAt);
        const localEndedAt = await localContract.methods.endedAt().call();
        setEndedAt(localEndedAt);
        const localDonationsAmount = await localContract.methods.donationsAmount().call();
        const localDonationsAmountLabel = localWeb3.utils.fromWei(localDonationsAmount, 'ether');
        setDonationsAmountLabel(localDonationsAmountLabel);
        const localDonationsCount = await localContract.methods.donationsCount().call();
        setDonationsCount(localDonationsCount);
        const localImageUrl = await localContract.methods.imageUrl().call();
        setImageUrl(localImageUrl);
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
    <TableRow hover tabIndex={-1} key={name}>
      <TableCell component="th" scope="row" padding="none">
        <FlexBox gap={1} justifyContent="center">
          <IMG src={imageUrl} />
          <H5 fontSize={15}>{name}</H5>
        </FlexBox>
      </TableCell>
      <TableCell align="center">{startedAt ? new Date(startedAt * 1000).toLocaleString() : null}</TableCell>
      <TableCell align="center">{endedAt ? new Date(endedAt * 1000).toLocaleString() : null}</TableCell>
      <TableCell align="center">{donationsAmountLabel}</TableCell>
      <TableCell align="center">{donationsCount}</TableCell>
      <TableCell align="center">
        <IconButton
          onClick={() => navigate(`/administrator/fundraisers/${fundraiser}/edit`)}
        >
          <Edit />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

export default FundraiserRow;
