import React, { useEffect, useState } from "react";
import {Button, Card, Divider, Grid, styled, TextField, useTheme} from "@mui/material";
import FundraiserContract from "contracts/Fundraiser.json";
import { Formik } from "formik";
import {H4, Paragraph, Span} from "app/components/Typography";
import getWeb3 from "utils/getWeb3";
import {useNavigate, useParams} from "react-router-dom";
import * as yup from "yup";

// styled components
const FundraiserIMG = styled(Card)({
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "center",
});

const IMG = styled("img")({
  padding: 32,
  maxWidth: 400,
  width: "100%",
});

const Form = styled("form")({ paddingLeft: "16px", paddingRight: "16px" });

const FundraiserShow = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.text.secondary;
  const { id } = useParams();
  const [ web3, setWeb3 ] = useState(null);
  const [ contract, setContract ] = useState(null);
  const [ accounts, setAccounts ] = useState(null);
  const [ name, setName ] = useState(null);
  const [ description, setDescription ] = useState(null);
  const [ imageUrl, setImageUrl ] = useState(null);
  const [ beneficiary, setBeneficiary ] = useState(null);
  const [ isOpen, setIsOpen ] = useState(null);
  const [ startedAt, setStartedAt ] = useState(null);
  const [ endedAt, setEndedAt ] = useState(null);
  const [ deletedAt, setDeletedAt ] = useState(null);
  const [ donationsAmount, setDonationsAmount ] = useState(null);
  const [ donationsCount, setDonationsCount ] = useState(null);
  const [ url, setUrl ] = useState(null);
  const [ initialValues, setInitialValues ] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = await getWeb3();
        setWeb3(web3);
        const contract = new web3.eth.Contract(
          FundraiserContract.abi,
          id,
        );
        setContract(contract);
        const accounts = await web3.eth.getAccounts();
        setAccounts(accounts);

        const name = await contract.methods.name().call();
        setName(name);
        const description = await contract.methods.description().call();
        setDescription(description);
        const url = await contract.methods.url().call();
        setUrl(url);
        const imageUrl = await contract.methods.imageUrl().call();
        setImageUrl(imageUrl);
        const beneficiary = await contract.methods.beneficiary().call();
        setBeneficiary(beneficiary);
        const isOpen = await contract.methods.isOpen().call();
        setIsOpen(isOpen);
        const donationsAmount = await contract.methods.donationsAmount().call();
        setDonationsAmount(donationsAmount);
        const donationsCount = await contract.methods.donationsCount().call();
        setDonationsCount(donationsCount);
        const deletedAt = await contract.methods.deletedAt().call();
        setDeletedAt(deletedAt);
        const startedAt = await contract.methods.startedAt().call();
        setStartedAt(startedAt);
        const endedAt = await contract.methods.endedAt().call();
        setEndedAt(endedAt);

        const initialValues = {
          donationAmount: 0,
        };
        setInitialValues(initialValues);
      } catch(error) {
        alert(
          'Failed to load web3, accounts, or contract. Check console for details.',
        );
        console.error(error);
      }
    }
    init();
  }, []);

  const handleSubmit = (values) => {
    const submitInputValues = async (values) => {
      console.log(values);

      const value = web3.utils.toWei(values.donationAmount.toString());

      const gasLimit = await contract.methods.donate().estimateGas({
        from: accounts[0],
        value: value
      });
      const gasPrice = await web3.eth.getGasPrice();
      await contract.methods.donate().send({
        from: accounts[0],
        value: value,
        gasLimit,
        gasPrice
      });

      alert('Successfully donated');

      // TODO:JSON-RPC エラーが発生した時のために、例外をキャッチして alert を出す
    }

    submitInputValues(values);
  }

  return (
    <Card sx={{ px: 4, py: 4 }} elevation={3}>
      <Grid container spacing={3}>
        <Grid item md={6} xs={12}>
          <FundraiserIMG>
            <IMG src="https://fastly.picsum.photos/id/436/200/300.jpg?hmac=OuJRsPTZRaNZhIyVFbzDkMYMyORVpV86q5M8igEfM3Y" />
          </FundraiserIMG>
        </Grid>

        <Grid item md={6} xs={12}>
          <H4 sx={{ mt: 0, mb: 2 }}>{name}</H4>
          <Paragraph sx={{ mt: 0, mb: 1, color: secondary }} style={{ whiteSpace: "pre-line" }}>
            StartedAt: {startedAt}{"\n"}
            EndedAt: {endedAt}{"\n"}
          </Paragraph>

          <Divider sx={{ my: 2 }} />

          <Paragraph sx={{ mt: 0, mb: 1, color: secondary }} style={{ whiteSpace: "pre-line" }}>
            DonationsAmount: {donationsAmount}{"\n"}
            DonationsCount: {donationsCount}{"\n"}
          </Paragraph>

          <Formik
            onSubmit={handleSubmit}
            enableReinitialize={true}
            initialValues={initialValues ? initialValues : {
              donationAmount: 0
            }}
            validationSchema={validationSchema}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
              <Form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  type="text"
                  name="donationAmount"
                  label="Donation Amout"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.donationAmount || 0}
                  error={Boolean(touched.donationAmount && errors.donationAmount)}
                  helperText={touched.donationAmount && errors.donationAmount}
                  style={{ marginRight: '10px' }}
                />
                <Button type="submit" color="primary" variant="contained" onClick={() => {
                  if (window.confirm("Are you sure you want to donate? This cannot be undone.")) {}
                }}>
                  Donate
                </Button>
              </Form>
            )}
          </Formik>

          <Divider sx={{ my: 2 }} />

          <Paragraph sx={{ mt: 0, mb: 1, color: secondary }} style={{ whiteSpace: "pre-line" }}>
            Url: {url}
          </Paragraph>

          <Divider sx={{ my: 2 }} />

          <p>{description}</p>
        </Grid>
      </Grid>
    </Card>
  )
}

const validationSchema = yup.object().shape({
  donationAmount: yup
    .number()
    .typeError('Donation Amount is number')
    .positive('Donation Amount is greater than 0')
    .required("Donation Amount is required")
});

export default FundraiserShow;
