import React, { useEffect, useState } from 'react';

import { List } from '@mui/icons-material';
import { Box, IconButton, styled, TableCell, TableRow } from '@mui/material';
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
  const [description, setDescription] = useState(null);
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
        const localDescription = await localContract.methods
          .description()
          .call();
        setDescription(localDescription);
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
    <TableRow hover tabIndex={-1}>
      <TableCell component="th" scope="row" padding="none">
        <FlexBox gap={1} justifyContent="center">
          <IMG src={imageUrl} />
          <H5 fontSize={15}>{name}</H5>
        </FlexBox>
      </TableCell>
      <TableCell align="center">{description}</TableCell>
      <TableCell align="center">
        <IconButton
          onClick={() => navigate(`/user/donated_fundraisers/${fundraiser}`)}
        >
          <List />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

export default FundraiserRow;
