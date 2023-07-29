import { Edit, TrendingFlat } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import {Box, IconButton, styled, TableCell, TableRow} from "@mui/material";
import FundraiserContract from "contracts/Fundraiser.json";
import { H5 } from "app/components/Typography";
import getWeb3 from "utils/getWeb3";
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

const FundraiserRow = (props) => {
  console.log('props', JSON.stringify(props));
  const { fundraiser } = props;
  const [ name, setName ] = useState(null);
  const [ startedAt, setStartedAt ] = useState(null);
  const [ endedAt, setEndedAt ] = useState(null);
  const [ donationsAmount, setDonationsAmount ] = useState(null);
  const [ donationsCount, setDonationsCount ] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if(fundraiser) {
      const init = async (fundraiser) => {
        try {
          const web3 = await getWeb3();
          const contract = new web3.eth.Contract(
            FundraiserContract.abi,
            fundraiser
          );
          const name = await contract.methods.name().call();
          setName(name);
          const description = await contract.methods.startedAt().call();
          setStartedAt(description);
          const totalDonations = await contract.methods.endedAt().call();
          setEndedAt(totalDonations);
          const imageURL = await contract.methods.donationsAmount().call();
          setDonationsAmount(imageURL);
          const url = await contract.methods.donationsCount().call();
          setDonationsCount(url);
        } catch(error) {
          alert(
            'Failed to load web3, accounts, or contract. Check console for details.',
          );
          console.error(error);
        }
      }
      init(fundraiser);
    }
  }, [fundraiser]);

  return (
    <TableRow
      hover
      tabIndex={-1}
      key={name}
    >
      <TableCell component="th" scope="row" padding="none">
        <FlexBox gap={1} justifyContent="center">
          {/*TODO: IMG の URL を適切な値に修正*/}
          <IMG src="https://fastly.picsum.photos/id/436/200/300.jpg?hmac=OuJRsPTZRaNZhIyVFbzDkMYMyORVpV86q5M8igEfM3Y" />
          <H5 fontSize={15}>{name}</H5>
        </FlexBox>
      </TableCell>
      <TableCell align="center">{startedAt}</TableCell>
      <TableCell align="center">{endedAt}</TableCell>
      <TableCell align="center">{donationsAmount}</TableCell>
      <TableCell align="center">{donationsCount}</TableCell>
      <TableCell align="center">
        {/*TODO: fundraisers/edit ページへのリンクに変更*/}
        <IconButton onClick={() => navigate(`/administrator/pages/fundraisers/${fundraiser}/edit`)}>
          <Edit />
        </IconButton>
        {/*TODO: fundraisers/:id もしくは fundraisers/show ページへのリンクに変更*/}
        <IconButton onClick={() => navigate(`/user/pages/donated_fundraisers/${fundraiser}`)}>
          <TrendingFlat />
        </IconButton>
      </TableCell>
    </TableRow>
  )
}

export default FundraiserRow;
