import { getFundraisers } from "app/redux/user/slices/fundraiserSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useFundraisers = () => {
  const dispatch = useDispatch();
  const { error, fundraisers, loading } = useSelector((state) => state.fundraisersForUser);

  useEffect(() => {
    dispatch(getFundraisers());
  }, [dispatch]);

  return {
    fundraisers,
    isError: error,
    isLoading: loading,
  };
};

export default useFundraisers;
