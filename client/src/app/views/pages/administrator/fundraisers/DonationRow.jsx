import React from "react";
import {Box, styled, TableCell, TableRow} from "@mui/material";
import {useNavigate} from "react-router-dom";

// styled components
const IMG = styled("img")({
  height: 32,
  borderRadius: "4px",
});
const FlexBox = styled(Box)({
  display: "flex",
  alignItems: "center",
});

const DonationRow = (props) => {
  console.log('props', JSON.stringify(props));
  const { donation } = props;
  const navigate = useNavigate();

  return (
    // TODO: key を適切な値に修正
    <TableRow
      hover
      tabIndex={-1}
      key={donation.value}
    >
      <TableCell align="center">{donation.value}</TableCell>
      <TableCell align="center">{donation.date}</TableCell>
    </TableRow>
  )
}

export default DonationRow;
