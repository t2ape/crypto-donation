pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Fundraiser is Ownable {
  // TODO: 寄付に紐付く団体を考慮する

  string public name;
  string public description;
  string public url;
  string public imageUrl;
  uint256 public startedAt;
  uint256 public endedAt;
  uint256 public donationsAmount;
  uint256 public donationsCount;
  address payable public beneficiary;

  constructor(
    string memory _name,
    string memory _description,
    string memory _url,
    string memory _imageUrl,
    uint256 _startedAt,
    uint256 _endedAt,
    uint256 _donationsAmount,
    uint256 _donationsCount,
    address payable _beneficiary
  ) {
    name = _name;
    description = _description;
    url = _url;
    imageUrl = _imageUrl;
    startedAt = _startedAt;
    endedAt = _endedAt;
    donationsAmount = _donationsAmount;
    donationsCount = _donationsCount;
    beneficiary = _beneficiary;
  }
}