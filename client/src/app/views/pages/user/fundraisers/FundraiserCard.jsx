import React, { useEffect, useState } from "react";
import {Button, Card, Divider, Grid, IconButton, styled, useTheme} from "@mui/material";
import FundraiserContract from "contracts/Fundraiser.json";
import {H4, Paragraph, Span} from "app/components/Typography";
import getWeb3 from "utils/getWeb3";
import {useNavigate} from "react-router-dom";
import {Edit} from "@mui/icons-material";

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

const FundraiserCard = (props) => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.text.secondary;

  console.log('props', JSON.stringify(props));
  const { fundraiser: fundraiser } = props;
  const [ name, setName ] = useState(null);
  const [ description, setDescription ] = useState(null);
  const [ startedAt, setStartedAt ] = useState(null);
  const [ endedAt, setEndedAt ] = useState(null);
  const [ donationsAmount, setDonationsAmount ] = useState(null);
  const [ donationsCount, setDonationsCount ] = useState(null);
  const [ url, setUrl ] = useState(null);
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
          console.log('name:', name)
          const description = await contract.methods.description().call();
          setDescription(description);
          const startedAt = await contract.methods.startedAt().call();
          setStartedAt(startedAt);
          const endedAt = await contract.methods.endedAt().call();
          setEndedAt(endedAt);
          const donationsAmount = await contract.methods.donationsAmount().call();
          setDonationsAmount(donationsAmount);
          const donationsCount = await contract.methods.donationsCount().call();
          setDonationsCount(donationsCount);
          const url = await contract.methods.url().call();
          setUrl(url);
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

          <Button type="submit" color="primary" variant="contained" onClick={() => {
            navigate(`/user/pages/fundraisers/${fundraiser}`)
          }}>
            Donate
          </Button>

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

export default FundraiserCard;
