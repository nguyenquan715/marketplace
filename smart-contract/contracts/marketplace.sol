// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Marketplace {
  event Sell(uint256 orderId, uint256 tokenId, address ctAddress, address seller, uint256 price, uint256 timeStamp);
  event Buy(uint256 orderId, uint256 tokenId, address ctAddress, address seller, address buyer, uint256 price, uint256 timeStamp);
  event Cancel(uint256 orderId, uint256 tokenId, address ctAddress, address seller, uint256 timeStamp);

  struct Order {
    address seller;
    uint256 tokenId;
    address ctAddress;
    uint256 price;
    bool sold;
  }

  using Counters for Counters.Counter;
  Counters.Counter private orderId;

  mapping(uint256 => Order) private orders;

  function sell(uint256 _tokenId, address _ctAddress, uint256 _price) external {
    require (_tokenId > 0, 'Invalid token id');
    require (_price > 0, 'Invalid price');
    require (IERC721(_ctAddress).ownerOf(_tokenId) == msg.sender, 'Not owner of token');
    orderId.increment();
    uint256 orderIdValue = orderId.current();
    orders[orderIdValue] = Order({
      seller: msg.sender,
      tokenId: _tokenId,
      ctAddress: _ctAddress,
      price: _price,
      sold: false
    });
    IERC721(_ctAddress).safeTransferFrom(msg.sender, address(this), _tokenId);
    emit Sell(orderIdValue, _tokenId, _ctAddress, msg.sender, _price, block.timestamp);
  }
}