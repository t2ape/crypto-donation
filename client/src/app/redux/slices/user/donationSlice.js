import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import FundraiserContract from 'contracts/Fundraiser.json';
import getWeb3 from 'utils/getWeb3';

const initialState = {
  error: null,
  donations: [],
  loading: false,
};

export const getDonations = createAsyncThunk(
  'user/donations/get',
  async (id) => {
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(FundraiserContract.abi, id);

    const fundraiserDonatedEvents = await contract.getPastEvents(
      'FundraiserDonated',
      {
        filter: { donor: accounts[0] },
        fromBlock: 0,
        toBlock: 'latest',
      },
    );
    const donations = fundraiserDonatedEvents.map((event) => ({
      value: event.returnValues.value,
      donatedAt: event.returnValues.donatedAt,
    }));
    return donations;
  },
);

const donationSlice = createSlice({
  initialState,
  name: 'userDonations',
  extraReducers: (builder) => {
    builder
      .addCase(getDonations.pending, (state) => {
        state.loading = true; // eslint-disable-line no-param-reassign
      })
      .addCase(getDonations.fulfilled, (state, actions) => {
        state.loading = false; // eslint-disable-line no-param-reassign
        state.donations = actions.payload; // eslint-disable-line no-param-reassign
      })
      .addCase(getDonations.rejected, (state, actions) => {
        state.loading = false; // eslint-disable-line no-param-reassign
        state.donations = []; // eslint-disable-line no-param-reassign
        state.error = actions.error.message; // eslint-disable-line no-param-reassign
      });
  },
});

export const userDonationReducer = donationSlice.reducer;
