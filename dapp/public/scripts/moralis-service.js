const connectMoralisServer = () => {
  const serverUrl = MORALIS_SERVER_URL;
  const appId = MORALIS_APP_ID;
  Moralis.start({ serverUrl, appId });
}

connectMoralisServer();

const getMyNfts = async (address, chain) => {
  return Moralis.Web3API.account.getNFTs({
    chain,
    address
  });
}