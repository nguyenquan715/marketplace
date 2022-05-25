// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Marketplace {
  event OfferingPlaced();
  event OfferingClosed();
  event BalanceWithdrawn();
  event OperatorChanged();
}