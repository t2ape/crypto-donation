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

function Disclaimer() {
  return (
    <Container>
      <div className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Fundraisers', path: '/user/fundraisers' },
            { name: 'Disclaimer' },
          ]}
        />
      </div>

      <Paper sx={{ width: '100%', mb: 2, padding: '30px' }}>
        <div>
          <H4 sx={{ mt: 0, mb: 1 }}>General Use</H4>
          <Paragraph sx={{ mt: 0, mb: 2 }} style={{ whiteSpace: 'pre-line' }}>
            This service is provided &quot;as is&quot; without any express or implied
            warranties.
            <br />
            Use of this service is at the user&apos;s own risk.
          </Paragraph>

          <H4 sx={{ mt: 0, mb: 1 }}>Cryptocurrency Risks</H4>
          <Paragraph sx={{ mt: 0, mb: 2 }} style={{ whiteSpace: 'pre-line' }}>
            Cryptocurrency values can be highly volatile.
            <br />
            Users must fully understand and make judgments about the risks
            associated with donations and transactions.
          </Paragraph>

          <H4 sx={{ mt: 0, mb: 1 }}>Transaction Verification</H4>
          <Paragraph sx={{ mt: 0, mb: 2 }} style={{ whiteSpace: 'pre-line' }}>
            Users are responsible for verifying and accepting all details of
            their transactions, including donation amounts and fees.
            <br />
            Users are liable for any incorrect transactions or donations they
            make.
          </Paragraph>

          <H4 sx={{ mt: 0, mb: 1 }}>NFT Transactions</H4>
          <Paragraph sx={{ mt: 0, mb: 2 }} style={{ whiteSpace: 'pre-line' }}>
            Once an NFT is issued, it cannot be revoked.
            <br />
            Additionally, the value of an NFT can fluctuate based on market
            conditions, and its value is not guaranteed.
          </Paragraph>

          <H4 sx={{ mt: 0, mb: 1 }}>Third-party Services</H4>
          <Paragraph sx={{ mt: 0, mb: 2 }} style={{ whiteSpace: 'pre-line' }}>
            While our service integrates with third-party platforms such as
            Metamask and OpenSea, we assume no responsibility for the operation
            or content of these services.
          </Paragraph>

          <H4 sx={{ mt: 0, mb: 1 }}>Data Loss or Malfunctions</H4>
          <Paragraph sx={{ mt: 0, mb: 2 }} style={{ whiteSpace: 'pre-line' }}>
            Please be aware that we cannot be held responsible for any potential
            data loss or malfunctions that may arise from the use of our
            service.
          </Paragraph>
        </div>
      </Paper>
    </Container>
  );
}

export default Disclaimer;
