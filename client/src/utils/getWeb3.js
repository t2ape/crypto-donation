import Web3 from 'web3';

const getWeb3 = async () => {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  await window.ethereum?.request({ method: 'eth_requestAccounts' });

  // Modern dapp browsers...
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    return web3;
  }

  // Legacy dapp browsers...
  if (window.web3) {
    // Use Mist/MetaMask's provider.
    const { web3 } = window;
    console.log('Injected web3 detected.'); // eslint-disable-line no-console
    return web3;
  }

  // Fallback to localhost; use dev console port by default...
  const provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
  const web3 = new Web3(provider);
  console.log('No web3 instance injected, using Local web3.'); // eslint-disable-line no-console
  return web3;
};

export default getWeb3;
