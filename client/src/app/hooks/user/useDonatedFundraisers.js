import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { getDonatedFundraisers } from 'app/redux/slices/user/donatedFundraiserSlice';

const useDonatedFundraisers = () => {
  const dispatch = useDispatch();
  const { error, donatedFundraisers, loading } = useSelector(
    (state) => state.userDonatedFundraisers,
  );

  // console.log(`donated_fundraisers: ${fundraisers}`);

  useEffect(() => {
    dispatch(getDonatedFundraisers());
  }, [dispatch]);

  // console.log(`donated_fundraisers: ${donatedFundraisers}`);

  return {
    donatedFundraisers,
    isError: error,
    isLoading: loading,
  };
};

export default useDonatedFundraisers;
