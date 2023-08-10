import React, { useEffect, useState } from 'react';

import { Button, Card, Divider, Grid, styled } from '@mui/material';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import { H4, Paragraph } from 'app/components/Typography';
import FundraiserContract from 'contracts/Fundraiser.json';
import getWeb3 from 'utils/getWeb3';

// styled components
const FundraiserIMG = styled(Card)({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
});

const IMG = styled('img')({
  padding: 32,
  width: '100%',
});

function FundraiserCard({ fundraiser }) {
  const [name, setName] = useState(null);
  const [description, setDescription] = useState(null);
  const [startedAt, setStartedAt] = useState(null);
  const [endedAt, setEndedAt] = useState(null);
  const [donationsAmountLabel, setDonationsAmountLabel] = useState(null);
  const [donationsCount, setDonationsCount] = useState(null);
  const [url, setUrl] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  const details = [
    {
      label: 'StartedAt:',
      value: startedAt ? new Date(startedAt * 1000).toLocaleString() : null,
    },
    {
      label: 'EndedAt:',
      value: endedAt ? new Date(endedAt * 1000).toLocaleString() : null,
    },
    { label: 'DonationsAmount:', value: donationsAmountLabel },
    { label: 'DonationsCount:', value: donationsCount },
    { label: 'URL:', value: url },
  ];

  FundraiserCard.propTypes = {
    fundraiser: PropTypes.string.isRequired,
  };

  useEffect(() => {
    if (fundraiser) {
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
          const localStartedAt = await localContract.methods.startedAt().call();
          setStartedAt(localStartedAt);
          const localEndedAt = await localContract.methods.endedAt().call();
          setEndedAt(localEndedAt);
          const localDonationsAmount = await localContract.methods
            .donationsAmount()
            .call();
          const localDonationsAmountLabel = localWeb3.utils.fromWei(
            localDonationsAmount,
            'ether',
          );
          setDonationsAmountLabel(localDonationsAmountLabel);
          const localDonationsCount = await localContract.methods
            .donationsCount()
            .call();
          setDonationsCount(localDonationsCount);
          const localUrl = await localContract.methods.url().call();
          setUrl(localUrl);
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
    }
  }, []);

  return (
    <Card sx={{ px: 4, py: 4, width: '600px' }} elevation={3}>
      <Grid container spacing={3}>
        <Grid item md={6} xs={12}>
          <FundraiserIMG>
            <IMG src={imageUrl} />
          </FundraiserIMG>
        </Grid>

        <Grid item md={6} xs={12}>
          <H4 sx={{ mt: 0, mb: 2 }}>{name}</H4>

          <p style={{ whiteSpace: 'pre-line' }}>{description}</p>

          <Divider sx={{ my: 2 }} />

          <Paragraph sx={{ mt: 0, mb: 1 }} style={{ whiteSpace: 'pre-line' }}>
            {details.map((detail) => (
              <React.Fragment key={detail.label}>
                {detail.label} {detail.value}
                {'\n'}
              </React.Fragment>
            ))}
          </Paragraph>

          <Divider sx={{ my: 2 }} />

          <Button
            type="submit"
            color="primary"
            variant="contained"
            onClick={() => {
              navigate(`/user/fundraisers/${fundraiser}`);
            }}
          >
            Donate
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
}

export default FundraiserCard;
