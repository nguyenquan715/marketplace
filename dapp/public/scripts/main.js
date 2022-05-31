/**
 * Global variable
 */
let connectedAccount;
const connectWalletBtn = document.getElementById("connect-wallet");

/**
 * Connect wallet
 */
getWalletAccounts().then(async (accounts) => {
  connectedAccount = accounts[0];
  if (connectedAccount) {
    displayAccountInfo(connectedAccount);
  }
}).catch((err) => {
  console.error(err);
});

connectWalletBtn.onclick = async () => {
  try {
    connectedAccount = (await connectWallet())[0];
    displayAccountInfo(connectedAccount);
    await switchEthereumChain('0x13881', 'Mumbai', 'https://rpc-mumbai.matic.today');
  } catch (err) {
    console.error(err);
  }
}

handleWalletEvent();

/**
 * Helper function
 */
function displayAccountAddress(account) {
  const accountAddress = account.slice(0, 5) + '...' + account.slice(account.length - 4, account.length);
  connectWalletBtn.innerHTML = accountAddress;
}

async function displayAccountBalance(account) {
  let accountBalance = await getAddressBalance(account);
  document.querySelector('.user-balance .balance').innerHTML = accountBalance;
}

function displayAccountInfo(account) {
  displayAccountAddress(account);
  displayAccountBalance(account);
}

