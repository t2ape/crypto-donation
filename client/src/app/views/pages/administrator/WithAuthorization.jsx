import React, { useState, useEffect } from "react";
import { MatxLoading } from 'app/components';
import NotFound from 'app/views/pages/NotFound';
import getWeb3 from "utils/getWeb3";
import AdministratorFundraiserHandlerContract from "contracts/AdministratorFundraiserHandler.json";

export default function withAuthorization(WrappedComponent) {
  return function WithAuthorizationWrapper(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
      const init = async () => {
        try {
          const localWeb3 = await getWeb3();
          const localAccounts = await localWeb3.eth.getAccounts();
          const localNetworkId = await localWeb3.eth.net.getId();
          const localDeployedNetwork = AdministratorFundraiserHandlerContract
            .networks[localNetworkId];
          const localContract = new localWeb3.eth.Contract(
            AdministratorFundraiserHandlerContract.abi,
            localDeployedNetwork && localDeployedNetwork.address,
          );

          const localHasPermission = await localContract.methods
            .msgSenderIsOwner()
            .call({ from: localAccounts[0] });
          if (localHasPermission) {
            setHasPermission(true);
            setIsLoading(false);
          } else {
            setHasPermission(false);
            setIsLoading(false);
          }
        } catch (error) {
          alert(
            'Failed to load web3, accounts, or contract. Check console for details.',
          );
          console.error(error); // eslint-disable-line no-console
        }
      };
      init();
    }, []);

    if (isLoading) return <MatxLoading />;

    if (!hasPermission) {
      return <NotFound />;
    }

    return <WrappedComponent {...props} />;
  };
}
