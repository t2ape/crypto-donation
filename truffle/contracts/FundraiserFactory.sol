pragma solidity ^0.8.18;

import "./Fundraiser.sol";

contract FundraiserFactory {
  Fundraiser[] private _fundraisers;

  function createFundraiser(
    string memory name,
    string memory description,
    string memory url,
    string memory imageUrl,
    uint256 startedAt,
    uint256 endedAt,
    uint256 donationsAmount,
    uint256 donationsCount,
    address payable beneficiary
  ) public {
    Fundraiser fundraiser = new Fundraiser(
      name,
      description,
      url,
      imageUrl,
      startedAt,
      endedAt,
      donationsAmount,
      donationsCount,
      beneficiary,
      msg.sender
    );
    _fundraisers.push(fundraiser);
  }

  function fundraisersCount() public view returns (uint256) {
    return _fundraisers.length;
  }
}
