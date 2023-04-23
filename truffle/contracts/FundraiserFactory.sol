pragma solidity ^0.8.19;

import "./Fundraiser.sol";

contract FundraiserFactory {
  Fundraiser[] private _fundraisers;

  function createFundraiser(
    string memory name, // 必須
    string memory description, // 必須
    string memory url, // 任意
    string memory imageUrl, // 任意
    uint256 startedAt, // 任意
    uint256 endedAt, // 任意
    address payable beneficiary // 必須
  ) public {
    // TODO: 入力値のバリデーションを追加する

    Fundraiser fundraiser = new Fundraiser(
      name,
      description,
      url,
      imageUrl,
      startedAt,
      endedAt,
      0,
      0,
      beneficiary,
      msg.sender
    );
    _fundraisers.push(fundraiser);
  }

  function fundraisersCount() public view returns (uint256) {
    return _fundraisers.length;
  }
}
