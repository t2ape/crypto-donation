import { Edit, TrendingFlat } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
} from "@mui/material";
import { Breadcrumb, MatxLoading } from "app/components";
import { TableHead, TableToolbar } from "app/components/data-table";
import { H5 } from "app/components/Typography";
import useFundraisers from "app/hooks/useFundraisers";
import useTable from "app/hooks/useTable";
import { useNavigate } from "react-router-dom";

// styled components
const IMG = styled("img")({
  height: 32,
  borderRadius: "4px",
});
const FlexBox = styled(Box)({
  display: "flex",
  alignItems: "center",
});
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const FundraisersIndex = () => {
  const {
    page,
    rowsPerPage,
    handleChangePage,
  } = useTable();

  const navigate = useNavigate();
  const { isLoading, fundraisers } = useFundraisers();

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

  const fundraiserArray = fundraisers?.map((fundraiser) => ({
    name: fundraiser.name,
    startedAt: fundraiser.startedAt,
    endedAt: fundraiser.endedAt,
    donationsAmount: fundraiser.donationsAmount,
    donationsCount: fundraiser.donationsCount,
    imageUrl: fundraiser.imageUrl,
  }));

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
              {fundraiserArray
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {

                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.name}
                    >
                      {/*TODO: それぞれのセルの表示を文字列でなくする*/}
                      <TableCell component="th" scope="row" padding="none">
                        <FlexBox gap={1} justifyContent="center">
                          <IMG src="https://fastly.picsum.photos/id/436/200/300.jpg?hmac=OuJRsPTZRaNZhIyVFbzDkMYMyORVpV86q5M8igEfM3Y" />
                          <H5 fontSize={15}>{"row.name"}</H5>
                        </FlexBox>
                      </TableCell>
                      <TableCell align="center">{"row.startedAt"}</TableCell>
                      <TableCell align="center">{"row.endedAt"}</TableCell>
                      <TableCell align="center">{"row.donationsAmount"}</TableCell>
                      <TableCell align="center">{"row.donationsCount"}</TableCell>
                      <TableCell align="center">
                        {/*TODO: fundraisers/edit ページへのリンクに変更*/}
                        <IconButton onClick={() => navigate("/pages/new-product")}>
                          <Edit />
                        </IconButton>
                        {/*TODO: fundraisers/:id もしくは fundraisers/show ページへのリンクに変更*/}
                        <IconButton onClick={() => navigate("/pages/view-product")}>
                          <TrendingFlat />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          page={page}
          component="div"
          rowsPerPage={rowsPerPage}
          count={fundraiserArray.length}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[]}
        />
      </Paper>
    </Container>
  );
};

export default FundraisersIndex;
