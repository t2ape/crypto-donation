import {styled} from "@mui/material";
import {Breadcrumb, MatxLoading} from "app/components";
import useFundraisers from "app/hooks/user/useFundraisers";
import FundraiserCard from "app/views/pages/user/fundraisers/FundraiserCard";
import FundraisersCardPagination from "app/views/pages/user/fundraisers/FundraisersCardPagination.jsx"

// styled components
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
}));

const Index = () => {
  const { isLoading, fundraisers } = useFundraisers();

  if (isLoading) return <MatxLoading />;

  return (
    <Container>
      <Container>
        <Breadcrumb routeSegments={[{ name: "Pages", path: "/pages" }, { name: "Fundraisers" }]} />
      </Container>

      <FundraisersCardPagination items={fundraisers} ItemCard={FundraiserCard} />

    </Container>
  );
};

export default Index;
