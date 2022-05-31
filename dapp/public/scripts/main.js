let connectedAccount;
const connectWalletBtn = document.getElementById("connect-wallet");

getWalletAccounts().then((accounts) => {
  connectedAccount = accounts[0];
  if (connectedAccount) {
    displayAccountAddress(connectedAccount);
  }
}).catch((err) => {
  console.error(err);
});

connectWalletBtn.onclick = async () => {
  try {
    console.log('Connect wallet');
    connectedAccount = (await connectWallet())[0];
    displayAccountAddress(connectedAccount);
    await switchEthereumChain('0x13881', 'Mumbai', 'https://rpc-mumbai.matic.today');
    window.ethereum.on('accountsChanged', async (accounts) => {
      console.log(accounts);
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
  } catch (err) {
    console.error(err);
  }
}

function displayAccountAddress(account) {
  const accountAddress = account.slice(0, 5) + '...' + account.slice(account.length - 4, account.length);
  connectWalletBtn.innerHTML = accountAddress;
}