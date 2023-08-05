import {
  Paper,
  styled,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
} from "@mui/material";
import { Breadcrumb, MatxLoading } from "app/components";
import { TableHead, TableToolbar } from "app/components/data-table";
import useDonatedFundraisers from "app/hooks/user/useDonatedFundraisers";
import useCollection from "app/hooks/useCollection";
import FundraiserRow from "../../administrator/fundraisers/FundraiserRow";

// styled components
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const Index = () => {
  const {
    page,
    rowsPerPage,
    handleChangePage,
  } = useCollection();

  const { isLoading, donatedFundraisers } = useDonatedFundraisers();

  // console.log(`fundraisers: ${fundraisers}`);

  // TABLE HEADER COLUMN LIST
  const columns = [
    { id: "name", align: "center", disablePadding: true, label: "Name" },
    { id: "startedAt", align: "center", disablePadding: false, label: "StartedAt" },
    { id: "endedAt", align: "center", disablePadding: false, label: "EndedAt" },
    { id: "donationsAmount", align: "center", disablePadding: false, label: "DonationsAmount" },
    { id: "donationsCount", align: "center", disablePadding: false, label: "DonationsCount" },
    { id: "edit", align: "center", disablePadding: false, label: "Edit" },
  ];

  if (isLoading) return <MatxLoading />;

  return (
    <Container>
      <div className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "Pages", path: "/pages" }, { name: "Fundraisers" }]} />
      </div>

      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableToolbar title="All Fundraisers" />

        <TableContainer>
          <Table sx={{ minWidth: 750 }}>
            <TableHead headCells={columns} />

            <TableBody>
              {donatedFundraisers?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((fundraiser) => {
                  console.log('fundraisers:', JSON.stringify(donatedFundraisers));
                  console.log('fundraiser:', JSON.stringify(fundraiser));

                  return (
                    <FundraiserRow
                      fundraiser={fundraiser}
                      key={fundraiser}
                    />
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          page={page}
          component="div"
          rowsPerPage={rowsPerPage}
          // TODO: 修正
          count={10}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[]}
        />
      </Paper>
    </Container>
  );
};

export default Index;
