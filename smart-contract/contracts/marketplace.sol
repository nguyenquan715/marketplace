// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Marketplace {
  event Sell(uint256 orderId, uint256 tokenId, address ctAddress, address seller, uint256 price, uint256 timeStamp);
  event Buy(uint256 orderId, uint256 tokenId, address ctAddress, address seller, address buyer, uint256 price, uint256 timeStamp);
  event Cancel(uint256 orderId, uint256 timeStamp);

  struct Order {
    address seller;
    address ctAddress;
    uint256 tokenId;
    uint256 price;
  }

  using Counters for Counters.Counter;
  Counters.Counter private orderId;

  mapping(uint256 => Order) private orders;
  
  uint8 private commissionFee;
  address private marketAddress;

  constructor(address _marketAddress, uint8 _fee) {
    commissionFee = _fee;
    marketAddress = _marketAddress;
  }

  function sell(uint256 _tokenId, address _ctAddress, uint256 _price) external {
    require (_tokenId > 0, 'Invalid token id');
    require (_price > 0, 'Invalid price');
    require (IERC721(_ctAddress).ownerOf(_tokenId) == msg.sender, 'Not owner of item');
    IERC721(_ctAddress).safeTransferFrom(msg.sender, address(this), _tokenId);
    orderId.increment();
    uint256 orderIdValue = orderId.current();
    orders[orderIdValue] = Order({
      seller: msg.sender,
      tokenId: _tokenId,
      ctAddress: _ctAddress,
      price: _price
    });
    emit Sell(orderIdValue, _tokenId, _ctAddress, msg.sender, _price, block.timestamp);
  }

  function buy(uint256 _orderId) external payable {
    Order memory order = orders[_orderId];
    require (order.seller != address(0), 'Sell order does not exist');
    require (msg.value == order.price, 'Price not match');
    require (msg.sender != order.seller, 'Buyer is seller');
    address payable market = payable(marketAddress);
    address payable seller = payable(order.seller);
    uint256 tax = (order.price * commissionFee) / 100;
    market.transfer(tax);
    seller.transfer(order.price - tax);
    IERC721(order.ctAddress).safeTransferFrom(address(this), msg.sender, order.tokenId);
    emit Buy(_orderId, order.tokenId, order.ctAddress, order.seller, msg.sender, order.price, block.timestamp);
  }

  function cancel(uint256 _orderId) external {
    Order memory order = orders[_orderId];
    require (order.seller != address(0), 'Sell order does not exist');
    require (msg.sender == order.seller, 'Not seller of item');
    IERC721(order.ctAddress).safeTransferFrom(address(this), msg.sender, order.tokenId);
    delete orders[_orderId];
    emit Cancel(_orderId, block.timestamp);
  }
}