/**
 * Global variable
 */
let connectedAccount;
const connectWalletBtn = document.getElementById("connect-wallet");
let myNftsField = document.getElementById("my-nfts");
let myNfts;
let myNftMetadatas;

/**
 * Connect wallet
 */
getWalletAccounts().then(async (accounts) => {
  connectedAccount = accounts[0];
  if (connectedAccount) {
    displayAccountInfo(connectedAccount);
    displayMyNfts();
    await switchEthereumChain(ChainInfo.MUMBAI.chainId, ChainInfo.MUMBAI.name, ChainInfo.MUMBAI.rpcUrl);
  }
}).catch((err) => {
  console.error(err);
});

connectWalletBtn.onclick = async () => {
  try {
    connectedAccount = (await connectWallet())[0];
    displayAccountInfo(connectedAccount);
    displayMyNfts();
    await switchEthereumChain(ChainInfo.MUMBAI.chainId, ChainInfo.MUMBAI.name, ChainInfo.MUMBAI.rpcUrl);
  } catch (err) {
    console.error(err);
  }
}

handleWalletEvent();

/**
 * My NFTs
 */
async function displayMyNfts() {
  try {
    if (connectedAccount) {
      myNfts = (await getMyNfts(connectedAccount, ChainInfo.MUMBAI.name)).result;
      document.querySelector('#nft-quantity').innerHTML = myNfts.length;
      const tokenUris = myNfts.map((nft) => nft.token_uri);
      const nftMetadatas = await Promise.all(tokenUris.map((uri) => getNftDetail(uri)));
      myNftMetadatas = nftMetadatas.map(JSON.parse);
      myNftsField.innerHTML = "";
      for (let i = 0; i < myNfts.length; i++) {
        myNftsField.innerHTML += `
          <div class="item-info">
            <div class="item-info-top">
              <img src=${myNftMetadatas[i]["image"]} alt="img" onerror="handleLoadImageError(event)">
            </div>
            <div class="item-info-bottom">
              <h4 class="item-name">${myNftMetadatas[i]["name"] || "No Name"}</h4>
              <button class="item-click" onclick="handleMyNftClick(${i})">Select</button>
            </div>
          </div>
        `;
      }
    }
  } catch (err) {
    console.error(err);
  }
}

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

async function getNftDetail(tokenUri) {
  return new Promise(function (resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", tokenUri);
    xhr.send();
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: this.statusText
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: this.statusText
      });
    };
  });
}

function handleLoadImageError(event) {
  event.target.src = "./public/assets/images/default.png";
  event.onerror = null;
  return;
}

function handleMyNftClick(index) {
  console.log(myNftMetadatas[index]);
}