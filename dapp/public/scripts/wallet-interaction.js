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

const connectWallet = async () => {
  try {
    let accounts = await getWalletAccounts();
    if (accounts.length > 0) {
      return accounts;
    }
    accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });
    return accounts;
  } catch (err) {
    if (err.code === 4001) {
      alert("Please connect to MetaMask!");
    } else {
      throw err;
    }
  }
}

const handleWalletEvent = () => {
  if (!checkWalletInstalled()) return;
  window.ethereum.on('accountsChanged', async (accounts) => {
    window.location.reload();
  });
  
  window.ethereum.on('chainChanged', async (chainId) => {
    if (await checkEthereumChain('0x13881')) return;
    if (confirm("You must switch to Mumbai network!")) {
      await switchEthereumChain('0x13881', 'Mumbai', 'https://rpc-mumbai.matic.today');
    } else {
      alert("You are in wrong network!");
    }
    window.location.reload();
  });
}

const addEthereumChain = async (chainId, chainName, chainRpc) => {
  const chainInfo = {
    chainId: chainId,
    chainName: chainName,
    rpcUrls: [chainRpc]
  };
  return window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [
      chainInfo
    ]
  });
}

const checkEthereumChain = async (chainId) => {
  const currentChain = await window.ethereum.request({
    method: 'eth_chainId'
  });
  if (currentChain === chainId) return true;
  return false;
}

const switchEthereumChain = async (chainId, chainName, chainRpc) => {
  try {
    if (await checkEthereumChain(chainId)) return;
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }]
    });
  } catch (err) {
    if (err.code === 4001) {
      alert("You must switch to Mumbai network!");
      return;
    }
    if (err.code === 4902) {
      await addEthereumChain(chainId, chainName, chainRpc).catch((err) => {
        throw err;
      });
      return;
    }
    throw err;
  }
}

