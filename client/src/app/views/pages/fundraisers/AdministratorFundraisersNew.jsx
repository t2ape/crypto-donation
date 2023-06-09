// TODO: import の順序を整理する
import {Box, Button, Card, Checkbox, Divider, Grid, styled, TextField} from "@mui/material";
import { Breadcrumb } from "app/components";
import {H4, Paragraph} from "app/components/Typography";
import { Formik } from "formik";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import * as yup from "yup";
import MuiTextField from "@mui/material/TextField";
import {useState, useEffect} from "react";
import getWeb3 from "utils/getWeb3";

import AdministratorFundraiserHandlerContract from "contracts/AdministratorFundraiserHandler.json";
import {FlexBox} from "app/components/FlexBox";

// styled components
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));
const StyledTextField = styled(TextField)({ marginBottom: "16px" });
const Form = styled("form")({ paddingLeft: "16px", paddingRight: "16px" });

const AdministratorFundraisersNew = () => {
  const [ web3, setWeb3 ] = useState(null);
  const [ contract, setContract ] = useState(null);
  const [ accounts, setAccounts ] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = await getWeb3();
        setWeb3(web3);

        const networkId = await web3.eth.net.getId();
        const deployedNetwork = AdministratorFundraiserHandlerContract.networks[networkId];
        const contract = new web3.eth.Contract(
          AdministratorFundraiserHandlerContract.abi,
          deployedNetwork && deployedNetwork.address,
        );
        setContract(contract);

        const accounts = await web3.eth.getAccounts();
        setAccounts(accounts);
      } catch(error) {
        alert('Failed to load web3, accounts, or contract. Check console for details.');
        console.error(error);
      }
    }
    init();
  }, []);

  const handleSubmit = (values) => {
    const formatInputValues = (values) => {
      console.log(values);

      let formattedInputValues = {};

      let inputStartedAt = values.startedAt
      if(inputStartedAt === undefined || inputStartedAt === null) {
        formattedInputValues.startedAt = 0;
      } else if (isNaN(Date.parse(inputStartedAt))) {
        formattedInputValues = null;
        alert('StartedAt is invalid.');
      } else {
        formattedInputValues.startedAt = Math.floor(Date.parse(inputStartedAt) / 1000);
      }

      let inputEndedAt = values.endedAt
      if(inputEndedAt === undefined || inputEndedAt === null) {
        formattedInputValues.endedAt = 0;
      } else if (isNaN(Date.parse(inputEndedAt))) {
        formattedInputValues = null;
        alert('StartedAt is invalid.');
      } else {
        formattedInputValues.endedAt = Math.floor(Date.parse(inputEndedAt) / 1000);
      }

      return formattedInputValues;
    }

    const submitInputValues = async (values, formattedInputValues) => {
      console.log(values);
      console.log(formattedInputValues);

      const gasLimit = await contract.methods.createFundraiser(
        values.name,
        values.description,
        values.url,
        values.imageUrl,
        values.isOpen,
        formattedInputValues.startedAt,
        formattedInputValues.endedAt,
        values.beneficiary,
      ).estimateGas({ from: accounts[0] });
      const gasPrice = await web3.eth.getGasPrice();
      await contract.methods.createFundraiser(
        values.name,
        values.description,
        values.url,
        values.imageUrl,
        values.isOpen,
        formattedInputValues.startedAt,
        formattedInputValues.endedAt,
        values.beneficiary,
      ).send({ from: accounts[0], gasLimit, gasPrice });

      alert('Successfully created fundraiser');

      // TODO:JSON-RPC エラーが発生した時のために、例外をキャッチして alert を出す
    }

    const formattedInputValues = formatInputValues(values);
    if (formattedInputValues !== null) {
      submitInputValues(values, formattedInputValues);
    }
  }

  // TODO: フォームに、スマートコントラクト側のバリデーションと一致するようなヒントを追加
  return (
    <Container>
      <div className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "Pages", path: "/pages" }, { name: "New Fundraiser" }]} />
      </div>

      <Card elevation={3}>
        <Box p={2} display="flex">
          <H4>Add New Fundraiser</H4>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <Formik
          onSubmit={handleSubmit}
          enableReinitialize={true}
          initialValues={initialValues}
          validationSchema={validationSchema}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
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
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    value={values.name || ""}
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
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    value={values.description || ""}
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
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    value={values.url || ""}
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
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    value={values.imageUrl || ""}
                    error={Boolean(touched.imageUrl && errors.imageUrl)}
                    helperText={touched.imageUrl && errors.imageUrl}
                  />

                  <StyledTextField
                    fullWidth
                    name="beneficiary"
                    label="Beneficiary Ethereum Address"
                    size="small"
                    variant="outlined"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    value={values.beneficiary || ""}
                    error={Boolean(touched.beneficiary && errors.beneficiary)}
                    helperText={touched.beneficiary && errors.beneficiary}
                  />

                  <FlexBox gap={1} alignItems="center">
                    <Checkbox
                      size="small"
                      name="isOpen"
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      checked={values.isOpen || false}
                      sx={{ padding: 0 }}
                    />

                    <Paragraph fontSize={13}>
                      Fundraiser is open to donations.
                    </Paragraph>
                  </FlexBox>
                </Grid>

                <Grid item sm={6} xs={12}>
                  <DateTimePicker
                    value={values.startedAt || ""}
                    onChange={(date) => {
                      setFieldValue("startedAt", date);
                    }}
                    renderInput={(props) => (
                      <MuiTextField {...props} label="start dateTime" variant="standard" />
                    )}
                  />
                </Grid>

                <Grid item sm={6} xs={12}>
                  <DateTimePicker
                    value={values.endedAt || ""}
                    onChange={(date) => {
                      setFieldValue("endedAt", date);
                    }}
                    renderInput={(props) => (
                      <MuiTextField {...props} label="end dateTime" variant="standard" />
                    )}
                  />
                </Grid>
              </Grid>

              <Button type="submit" color="primary" variant="contained" sx={{ my: 2, px: 6 }}>
                Add Fundraiser
              </Button>
            </Form>
          )}
        </Formik>
      </Card>
    </Container>
  );
};

const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
  beneficiary: yup.string().required("Beneficiary is required"),
});

const initialValues = {
  name: "",
  description: "",
  url: "",
  imageUrl: "",
  beneficiary: "",
  startedAt: null,
  endedAt: null,
  isOpen: false,
};
export default AdministratorFundraisersNew;
