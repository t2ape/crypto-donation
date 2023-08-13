import { useState, useEffect } from 'react';

import {
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  Grid,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import MuiTextField from '@mui/material/TextField';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Formik } from 'formik';
import { useParams } from 'react-router-dom';
import * as yup from 'yup';

import { Breadcrumb } from 'app/components';
import { FlexBox } from 'app/components/FlexBox';
import { H4, Paragraph } from 'app/components/Typography';
import WithAuthorization from 'app/views/pages/administrator/WithAuthorization';
import FundraiserContract from 'contracts/Fundraiser.json';
import dateToSecond from 'utils/dateFormatter';
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
const StyledTextField = styled(TextField)({ marginBottom: '16px' });
const Form = styled('form')({ paddingLeft: '16px', paddingRight: '16px' });
const StyledText = styled(Typography)({ marginBottom: '16px' });
const FlexEndBox = styled(FlexBox)({ justifyContent: 'flex-end' });

function AdministratorFundraisersEdit() {
  const { id } = useParams();
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [donationsAmount, setDonationsAmount] = useState(null);
  const [donationsCount, setDonationsCount] = useState(null);
  const [deletedAt, setDeletedAt] = useState(null);
  const [initialValues, setInitialValues] = useState(null);

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

        const localDonationsAmount = await localContract.methods
          .donationsAmount()
          .call();
        setDonationsAmount(localDonationsAmount);
        const localDonationsCount = await localContract.methods
          .donationsCount()
          .call();
        setDonationsCount(localDonationsCount);
        const localDeletedAt = await localContract.methods.deletedAt().call();
        setDeletedAt(localDeletedAt);

        const localName = await localContract.methods.name().call();
        const localDescription = await localContract.methods
          .description()
          .call();
        const localUrl = await localContract.methods.url().call();
        const localImageUrl = await localContract.methods.imageUrl().call();
        const localDonationThresholdForToken = await localContract.methods
          .donationThresholdForToken()
          .call();
        const localBeneficiary = await localContract.methods
          .beneficiary()
          .call();
        const localRewardToken = await localContract.methods
          .rewardToken()
          .call();
        const localIsOpen = await localContract.methods.isOpen().call();
        const localStartedAt = await localContract.methods.startedAt().call();
        const localEndedAt = await localContract.methods.endedAt().call();

        const localInitialValues = {
          name: localName || '',
          description: localDescription || '',
          url: localUrl || '',
          imageUrl: localImageUrl || '',
          donationThresholdForToken: localDonationThresholdForToken || 0,
          beneficiary: localBeneficiary || '',
          rewardToken: localRewardToken || '',
          isOpen: localIsOpen || false,
          startedAt: localStartedAt ? new Date(localStartedAt * 1000) : null,
          endedAt: localEndedAt ? new Date(localEndedAt * 1000) : null,
        };
        setInitialValues(localInitialValues);
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
    const submitInputValues = async (inputValues, formattedInputValues) => {
      try {
        const updateFundraiserParams = {
          name: inputValues.name,
          description: inputValues.description,
          url: inputValues.url,
          imageUrl: inputValues.imageUrl,
          isOpen: inputValues.isOpen,
          startedAt: formattedInputValues.startedAt,
          endedAt: formattedInputValues.endedAt,
          donationThresholdForToken: inputValues.donationThresholdForToken,
          beneficiary: inputValues.beneficiary,
          rewardToken: inputValues.rewardToken,
        };

        const gasLimit = await contract.methods
          .updateFundraiser(updateFundraiserParams)
          .estimateGas({ from: accounts[0] });

        const gasPrice = await web3.eth.getGasPrice();
        const gasPriceBN = new web3.utils.BN(gasPrice);
        const factor = new web3.utils.BN('60');
        const base = new web3.utils.BN('100');
        const adjustedGasPrice = gasPriceBN.mul(factor).div(base);

        await contract.methods
          .updateFundraiser(updateFundraiserParams)
          .send({ from: accounts[0], gasLimit, adjustedGasPrice });

        alert('Successfully updated fundraiser');
      } catch (error) {
        console.error(error); // eslint-disable-line no-console
        alert('Failed to update fundraiser');
      }
    };

    const formattedInputValues = {
      startedAt: dateToSecond(values.startedAt),
      endedAt: dateToSecond(values.endedAt),
    };
    if (
      formattedInputValues.startedAt !== null
      && formattedInputValues.endedAt !== null
    ) {
      submitInputValues(values, formattedInputValues);
    } else {
      alert('StartedAt or EndedAt is invalid.');
    }
  };

  const deleteFundraiser = async () => {
    const gasLimit = await contract.methods
      .deleteFundraiser()
      .estimateGas({ from: accounts[0] });
    const gasPrice = await web3.eth.getGasPrice();
    await contract.methods
      .deleteFundraiser()
      .send({ from: accounts[0], gasLimit, gasPrice });

    alert('Successfully deleted fundraiser');

    try {
      const tempdeletedAt = await contract.methods.deletedAt().call();
      setDeletedAt(tempdeletedAt);
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
      alert('Failed to delete fundraiser');
    }
  };

  const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    description: yup.string().required('Description is required'),
    donationThresholdForToken: yup
      .number()
      .typeError('Donation threshold for token should be a number')
      .required('Donation threshold for token is required')
      .moreThan(0, 'Donation threshold for token should be greater than 0'),
    beneficiary: yup.string().required('Beneficiary is required'),
    rewardToken: yup.string().required('Reward token is required'),
  });

  return (
    <Container>
      <div className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Fundraisers', path: '/administrator/fundraisers' },
            { name: 'Edit Fundraiser' },
          ]}
        />
      </div>

      <Card elevation={3}>
        <Box p={2} display="flex">
          <H4>Edit Fundraiser</H4>
        </Box>
        <Divider sx={{ mb: 3 }} />
        <FlexEndBox mb={3} px={2} gap={2} className="delete-fundraiser">
          <Button
            type="submit"
            color="error"
            variant="contained"
            onClick={() => {
              if (
                window.confirm(
                  'Are you sure you want to delete? This cannot be undone.',
                )
              ) {
                deleteFundraiser();
              }
            }}
          >
            Delete
          </Button>
        </FlexEndBox>

        <Formik
          onSubmit={handleFormSubmit}
          enableReinitialize
          initialValues={initialValues || {}}
          validationSchema={validationSchema}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
          }) => (
            <Form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item sm={12} xs={12}>
                  <StyledTextField
                    fullWidth
                    name="name"
                    label="Name"
                    size="small"
                    variant="outlined"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name || ''}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />

                  <StyledTextField
                    fullWidth
                    multiline
                    size="small"
                    name="description"
                    variant="outlined"
                    label="Description"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.description || ''}
                    error={Boolean(touched.description && errors.description)}
                    helperText={touched.description && errors.description}
                  />

                  <StyledTextField
                    fullWidth
                    name="url"
                    label="URL"
                    size="small"
                    variant="outlined"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.url || ''}
                    error={Boolean(touched.url && errors.url)}
                    helperText={touched.url && errors.url}
                  />

                  <StyledTextField
                    fullWidth
                    name="imageUrl"
                    label="image URL"
                    size="small"
                    variant="outlined"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.imageUrl || ''}
                    error={Boolean(touched.imageUrl && errors.imageUrl)}
                    helperText={touched.imageUrl && errors.imageUrl}
                  />

                  <StyledTextField
                    fullWidth
                    name="donationThresholdForToken"
                    label="Donation threshold for token (wei)"
                    size="small"
                    variant="outlined"
                    type="number"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.donationThresholdForToken || 0}
                    error={Boolean(
                      touched.donationThresholdForToken
                        && errors.donationThresholdForToken,
                    )}
                    helperText={
                      touched.donationThresholdForToken
                      && errors.donationThresholdForToken
                    }
                  />

                  <StyledTextField
                    fullWidth
                    name="beneficiary"
                    label="Beneficiary Ethereum Address"
                    size="small"
                    variant="outlined"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.beneficiary || ''}
                    error={Boolean(touched.beneficiary && errors.beneficiary)}
                    helperText={touched.beneficiary && errors.beneficiary}
                  />

                  <StyledTextField
                    fullWidth
                    name="rewardToken"
                    label="Reward token Ethereum Address"
                    size="small"
                    variant="outlined"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.rewardToken || ''}
                    error={Boolean(touched.rewardToken && errors.rewardToken)}
                    helperText={touched.rewardToken && errors.rewardToken}
                  />

                  <FlexBox gap={1} alignItems="center">
                    <Checkbox
                      size="small"
                      name="isOpen"
                      onChange={handleChange}
                      checked={values.isOpen || false}
                      sx={{ padding: 0 }}
                    />

                    <Paragraph fontSize={13}>
                      Fundraiser is open to donation.
                    </Paragraph>
                  </FlexBox>
                </Grid>

                <Grid item sm={12} xs={12}>
                  <StyledText variant="body1" gutterBottom>
                    {`donationsAmount: ${donationsAmount}`}
                  </StyledText>

                  <StyledText variant="body1" gutterBottom>
                    {`donationsCount: ${donationsCount}`}
                  </StyledText>

                  <StyledText variant="body1" gutterBottom>
                    {`deletedAt: ${deletedAt}`}
                  </StyledText>
                </Grid>

                <Grid item sm={6} xs={12}>
                  <DateTimePicker
                    value={values.startedAt || null}
                    onChange={(date) => {
                      setFieldValue('startedAt', date);
                    }}
                    renderInput={(props) => (
                      <MuiTextField
                        {...props} // eslint-disable-line react/jsx-props-no-spreading
                        label="start dateTime"
                        variant="standard"
                      />
                    )}
                  />
                </Grid>

                <Grid item sm={6} xs={12}>
                  <DateTimePicker
                    value={values.endedAt || null}
                    onChange={(date) => {
                      setFieldValue('endedAt', date);
                    }}
                    renderInput={(props) => (
                      <MuiTextField
                        {...props} // eslint-disable-line react/jsx-props-no-spreading
                        label="end dateTime"
                        variant="standard"
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                color="primary"
                variant="contained"
                sx={{ my: 2, px: 6 }}
              >
                Edit Fundraiser
              </Button>
            </Form>
          )}
        </Formik>
      </Card>
    </Container>
  );
}

export default WithAuthorization(AdministratorFundraisersEdit);
