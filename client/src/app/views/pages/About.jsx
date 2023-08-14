import React from 'react';

import { Paper, styled } from '@mui/material';

import { Breadcrumb } from 'app/components';
import { H4, Paragraph } from 'app/components/Typography';

// styled components
const Container = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}));

function About() {
  return (
    <Container>
      <div className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Fundraisers', path: '/user/fundraisers' },
            { name: 'About' },
          ]}
        />
      </div>

      <Paper sx={{ width: '100%', mb: 2, padding: '30px' }}>
        <div>
          <H4 sx={{ mt: 0, mb: 1 }}>About Our Service</H4>
          <Paragraph sx={{ mt: 0, mb: 2 }} style={{ whiteSpace: 'pre-line' }}>
            Our web application provides a platform where you can easily make
            donations using cryptocurrency.
          </Paragraph>

          <H4 sx={{ mt: 0, mb: 1 }}>Simple Donation Steps</H4>
          <Paragraph sx={{ mt: 0, mb: 2 }} style={{ whiteSpace: 'pre-line' }}>
            1. Choose your desired donation recipient from the donation list.
            <br />
            2. Specify the amount you wish to donate.
            <br />
            3. The final amount you will spend will be the donation amount plus the cost of gas.
          </Paragraph>

          <H4 sx={{ mt: 0, mb: 1 }}>Safety Precautions for Donations</H4>
          <Paragraph sx={{ mt: 0, mb: 2 }} style={{ whiteSpace: 'pre-line' }}>
            When donating with a cryptocurrency wallet, please ensure that the
            contents displayed on wallets like Metamask match your intended
            transaction.
            <br />
            This is a crucial step to ensure the safety of your transaction.
          </Paragraph>

          <H4 sx={{ mt: 0, mb: 1 }}>Special Bonus: NFT Issuance</H4>
          <Paragraph sx={{ mt: 0, mb: 2 }} style={{ whiteSpace: 'pre-line' }}>
            When you donate an amount above a certain threshold, we will issue a
            unique NFT as a token of our appreciation.
            <br />
            The necessary donation amount for this NFT issuance can be checked
            on the donation details page.
            <br />
            Moreover, once issued, the NFT can be traded or verified on NFT
            marketplaces such as OpenSea.
          </Paragraph>
        </div>
      </Paper>
    </Container>
  );
}

export default About;
