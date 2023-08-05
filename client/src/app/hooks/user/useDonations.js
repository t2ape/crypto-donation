import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { getDonations } from 'app/redux/slices/user/donationSlice';

const useDonations = (id) => {
  const dispatch = useDispatch();
  const { error, donations, loading } = useSelector(
    (state) => state.userDonations,
  );

  useEffect(() => {
    dispatch(getDonations(id));
  }, [dispatch]);

  return {
    donations,
    isError: error,
    isLoading: loading,
  };
};

export default useDonations;
