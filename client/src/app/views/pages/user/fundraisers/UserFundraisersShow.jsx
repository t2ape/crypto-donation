import React, { useEffect, useState } from 'react';

import {
  Button, Card, Divider, Grid, styled, TextField,
} from '@mui/material';
import { Formik } from 'formik';
import { useParams } from 'react-router-dom';
import * as yup from 'yup';

import { Breadcrumb } from 'app/components';
import { H4, Paragraph } from 'app/components/Typography';
import FundraiserContract from 'contracts/Fundraiser.json';
import getWeb3 from 'utils/getWeb3';

// styled components
const Container = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}));
const FundraiserIMG = styled(Card)({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
});
const IMG = styled('img')({
  padding: 32,
  maxWidth: 400,
  width: '100%',
});
const StyledTextField = styled(TextField)({ marginBottom: '16px' });
const Form = styled('form')({ paddingLeft: '16px', paddingRight: '16px' });

function FundraiserShow() {
  const { id } = useParams();
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [name, setName] = useState(null);
  const [description, setDescription] = useState(null);
  const [startedAt, setStartedAt] = useState(null);
  const [endedAt, setEndedAt] = useState(null);
  const [donationsAmountLabel, setDonationsAmountLabel] = useState(null);
  const [donationsCount, setDonationsCount] = useState(null);
  const [donationThresholdForTokenLabel, setDonationThresholdForTokenLabel] = useState(null);
  const [url, setUrl] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

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

  useEffect(() => {
    const init = async () => {
      try {
        const localWeb3 = await getWeb3();
        setWeb3(localWeb3);
        const localContract = new localWeb3.eth.Contract(
          FundraiserContract.abi,
          id,
        );
        setContract(localContract);
        const localAccounts = await localWeb3.eth.getAccounts();
        setAccounts(localAccounts);

        const localName = await localContract.methods.name().call();
        setName(localName);
        const localDescription = await localContract.methods
          .description()
          .call();
        setDescription(localDescription);
        const localUrl = await localContract.methods.url().call();
        setUrl(localUrl);
        const localImageUrl = await localContract.methods.imageUrl().call();
        setImageUrl(localImageUrl);
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
        const localDonationThresholdForToken = await localContract.methods
          .donationThresholdForToken()
          .call();
        const localDonationThresholdForTokenLabel = localWeb3.utils.fromWei(
          localDonationThresholdForToken,
          'ether',
        );
        setDonationThresholdForTokenLabel(localDonationThresholdForTokenLabel);
        const localStartedAt = await localContract.methods.startedAt().call();
        setStartedAt(localStartedAt);
        const localEndedAt = await localContract.methods.endedAt().call();
        setEndedAt(localEndedAt);
      } catch (error) {
        alert(
          'Failed to load web3, accounts, or contract. Check console for details.',
        );
        console.error(error); // eslint-disable-line no-console
      }
    };
    init();
  }, []);

  const handleFormSubmit = (values) => {
    const submitInputValues = async (inputValues) => {
      try {
        const value = web3.utils.toWei(inputValues.donationAmount.toString());

        const gasLimit = await contract.methods.donate().estimateGas({
          from: accounts[0],
          value,
        });
        const gasPrice = await web3.eth.getGasPrice();
        await contract.methods.donate().send({
          from: accounts[0],
          value,
          gasLimit,
          gasPrice,
        });

        alert('Successfully donated');
      } catch (error) {
        console.error(error); // eslint-disable-line no-console
        alert('Failed to create fundraiser');
      }
    };

    if (
      window.confirm('Are you sure you want to donate? This cannot be undone.')
    ) {
      submitInputValues(values);
    }
  };

  const initialValues = {
    donationAmount: 0,
  };

  const validationSchema = yup.object().shape({
    donationAmount: yup
      .number()
      .typeError('Donation amount should be a number')
      .required('Donation amount is required')
      .moreThan(0, 'Donation amount should be greater than 0'),
  });

  return (
    <Container>
      <div className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Fundraisers', path: '/user/fundraisers' },
            { name: 'Donate Fundraiser' },
          ]}
        />
      </div>

      <Card sx={{ px: 4, py: 4 }} elevation={3}>
        <Grid container spacing={3}>
          <Grid item md={6} xs={12}>
            <FundraiserIMG>
              <IMG src={imageUrl} />
            </FundraiserIMG>
          </Grid>

          <Grid item md={6} xs={12}>
            <H4 sx={{ mt: 0, mb: 2 }}>{name}</H4>

            <p>{description}</p>

            <Divider sx={{ my: 2 }} />

            <Paragraph sx={{ mt: 0, mb: 1 }} style={{ whiteSpace: 'pre-line' }}>
              {details.map((detail) => (
                <React.Fragment key={detail.label}>
                  {detail.label}
                  {' '}
                  {detail.value}
                  {'\n'}
                </React.Fragment>
              ))}
            </Paragraph>

            <Divider sx={{ my: 2 }} />

            <Formik
              onSubmit={handleFormSubmit}
              enableReinitialize
              initialValues={initialValues}
              validationSchema={validationSchema}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
              }) => (
                <Form
                  onSubmit={handleSubmit}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <StyledTextField
                      type="text"
                      name="donationAmount"
                      label="Donation Amout (ether)"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.donationAmount || 0}
                      error={Boolean(
                        touched.donationAmount && errors.donationAmount,
                      )}
                      helperText={
                        touched.donationAmount && errors.donationAmount
                      }
                      style={{ marginRight: '20px' }}
                    />
                    <Button type="submit" color="primary" variant="contained">
                      Donate
                    </Button>
                  </div>
                  <Paragraph
                    sx={{ mt: 0, mb: 1 }}
                    style={{ whiteSpace: 'pre-line' }}
                  >
                    Receive an NFT when you donate
                    {' '}
                    <strong>
                      {donationThresholdForTokenLabel}
                      {' '}
                      ETH
                    </strong>
                    {' '}
                    or
                    more at once.
                    <br />
                    You can view your acquired NFT on NFT marketplaces like
                    Opensea.
                  </Paragraph>
                </Form>
              )}
            </Formik>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
}

export default FundraiserShow;
