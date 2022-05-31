const provider = new ethers.providers.Web3Provider(window.ethereum);

const getAddressBalance = async (address) => {
  return parseFloat(getPriceFromBN(await provider.getBalance(address))).toFixed(4);
}

function getPriceFromBN(price) {
  return ethers.BigNumber.isBigNumber(price) ? ethers.utils.formatEther(price) : price;
}