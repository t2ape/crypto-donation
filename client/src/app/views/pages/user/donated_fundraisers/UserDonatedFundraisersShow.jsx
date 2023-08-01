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
import useDonations from "app/hooks/user/useDonations";
import useTable from "app/hooks/useTable";
import {useParams} from "react-router-dom";
import DonationRow from "../../administrator/fundraisers/DonationRow";

// styled components
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const Show = () => {
  const { id } = useParams();

  const {
    page,
    rowsPerPage,
    handleChangePage,
  } = useTable();

  const { isLoading, donations } = useDonations(id);

  // TABLE HEADER COLUMN LIST
  const columns = [
    { id: "value", align: "center", disablePadding: true, label: "Value" },
    { id: "date", align: "center", disablePadding: false, label: "Date" },
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
              {donations?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((donation) => {
                  return (
                    // TODO: 修正
                    <DonationRow
                      donation={donation}
                      key={donation}
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

export default Show;
