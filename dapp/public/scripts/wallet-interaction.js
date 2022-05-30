const checkWalletInstalled = () => {
  if (!window.ethereum) return false;
  return true;
}

const getWalletAccounts = () => {
  if (!checkWalletInstalled()) return;
  return window.ethereum.request({
    method: 'eth_accounts'
  });
}

const checkConnectedWallet = () => {
  
}

