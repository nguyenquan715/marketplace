/**
 * Global variable
 */
let connectedAccount;
const connectWalletBtn = document.getElementById("connect-wallet");
const myNftsField = document.getElementById("my-nfts");
const nftSelectedField = document.getElementById("nft-selected");
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
  console.log(myNfts[index]);
  nftSelectedField.innerHTML = "";
  nftSelectedField.innerHTML = `
    <div class="item-selected">
      <div class="item-detail-top">
        <img src=${myNftMetadatas[index]["image"]} alt="img" onerror="handleLoadImageError(event)">          
      </div>
      <div class="item-detail-mid">
        <h2>ABOUT</h2>
        <div class="item-detail-group">
          <div class="item-detail-content">
            <h5 class="item-detail-key">Item Name</h5>
            <p class="item-detail-value">${myNftMetadatas[index]["name"] || "No Name"}</p>
          </div>
          <div class="item-detail-content">
            <h5 class="item-detail-key">Token ID</h5>
            <p class="item-detail-value">${myNfts[index]["token_id"]}</p>
          </div>
          <div class="item-detail-content">
            <h5 class="item-detail-key">Contract Address</h5>
            <p class="item-detail-value">${myNfts[index]["token_address"]}</p>
          </div>
          <div class="item-detail-content">
            <h5 class="item-detail-key">Description</h5>
            <p class="item-detail-value">${myNftMetadatas[index]["description"] || "No Description"}</p>
          </div>
        </div>
      </div>
      <div class="item-detail-bot">
        <input type="text" id="item-price" placeholder="Enter price">
        <button id="sell-item">Sell</button>
      </div>
    </div>
  `;
}