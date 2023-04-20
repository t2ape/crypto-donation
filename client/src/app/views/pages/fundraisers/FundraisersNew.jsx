import { Box, Button, Card, Divider, Grid, styled, TextField } from "@mui/material";
import { Breadcrumb } from "app/components";
import { H4 } from "app/components/Typography";
import { Formik } from "formik";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import * as yup from "yup";
import MuiTextField from "@mui/material/TextField";

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

const FundraisersNew = () => {
  const handleSubmit = async (values) => {
    console.log(values);
  };

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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
                    value={values.url || ""}
                    error={Boolean(touched.url && errors.url)}
                    helperText={touched.url && errors.url}
                  />

                  <StyledTextField
                    fullWidth
                    name="url"
                    label="image URL"
                    size="small"
                    variant="outlined"
                    onBlur={handleBlur}
                    onChange={handleChange}
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
                    onChange={handleChange}
                    value={values.beneficiary || ""}
                    error={Boolean(touched.beneficiary && errors.beneficiary)}
                    helperText={touched.beneficiary && errors.beneficiary}
                  />
                </Grid>

                <Grid item sm={6} xs={12}>
                  <DateTimePicker
                    value={values.startedAt || ""}
                    onChange={(date) => setFieldValue("startedAt", date)}
                    renderInput={(props) => (
                      <MuiTextField {...props} label="start dateTime" variant="standard" />
                    )}
                  />
                </Grid>

                <Grid item sm={6} xs={12}>
                  <DateTimePicker
                    value={values.endedAt || ""}
                    onChange={(date) => setFieldValue("endedAt", date)}
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
  startedAt: new Date(),
  endedAt: new Date(),
};
export default FundraisersNew;
