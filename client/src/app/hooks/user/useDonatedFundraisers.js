import { getDonatedFundraisers } from "app/redux/user/slices/donatedFundraiserSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useDonatedFundraisers = () => {
  const dispatch = useDispatch();
  const { error, donatedFundraisers, loading } = useSelector((state) => state.donatedFundraisersForUser);

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
