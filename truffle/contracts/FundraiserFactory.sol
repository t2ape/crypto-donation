pragma solidity ^0.8.19;

import "./Fundraiser.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FundraiserFactory is Ownable {
  Fundraiser[] private _fundraisers;

  function isActive(Fundraiser _fundraiser) private view returns (bool) {
    return (
      _fundraiser.isOpen() &&
      _fundraiser.deletedAt() == 0 &&
      _fundraiser.startedAt() <= block.timestamp &&
      _fundraiser.endedAt() > block.timestamp
    );
  }

  function createFundraiser(
    string memory name, // 必須
    string memory description, // 必須
    string memory url, // 任意
    string memory imageUrl, // 任意
    uint256 startedAt, // 任意
    uint256 endedAt, // 任意
    address payable beneficiary, // 必須
    bool isOpen // 必須
  ) public {
    // validations
    require(bytes(name).length > 0 && bytes(name).length <= 400, "name length is invalid.");
    require(bytes(description).length > 0 && bytes(description).length <= 4000, "description length is invalid.");
    require(bytes(url).length >= 0 && bytes(url).length <= 4000, "url length is invalid.");
    require(bytes(imageUrl).length >= 0 && bytes(imageUrl).length <= 4000, "imageUrl length is invalid.");
    require(beneficiary != address(0), "beneficiary format is invalid.");

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
      isOpen,
      msg.sender
    );
    _fundraisers.push(fundraiser);
  }

  function fundraisersCount() public view returns (uint256) {
    return _fundraisers.length;
  }

  function activeFundraisersCount() public view returns (uint256) {
    uint256 count = 0;
    for (uint256 i = 0; i < _fundraisers.length; i++) {
      if (isActive(_fundraisers[i])) { count++; }
    }
    return count;
  }

  function fundraisers_for_user(uint256 limit, uint256 offset) public view returns(Fundraiser[] memory collection) {
    require(offset <= activeFundraisersCount(), "offset is over limit.");

    uint256 size = activeFundraisersCount() - offset;
    size = size < limit ? size : limit;
    size = size < maxLimit ? size : maxLimit;
    collection = new Fundraiser[](size);

    uint256 collectionIndex = 0;

    for (uint256 i = 0; i < _fundraisers.length; i++) {
      if (isActive(_fundraisers[i])) {
        if (collectionIndex >= offset && collectionIndex < offset + size) {
          collection[collectionIndex - offset] = _fundraisers[i];
        }
        collectionIndex++;

        if (collectionIndex >= offset + size) {
          break;
        }
      }
    }

    return collection;
  }

  // TODO: アクセス制御をし全 fundraisers のリストは管理者だけがアクセスできるようにする
  // fundraisers 関数が返すアイテムの最大値
  uint256 constant maxLimit = 50;

  function fundraisers_for_admin(uint256 limit, uint256 offset) public view onlyOwner returns(Fundraiser[] memory collection) {
    require(offset <= fundraisersCount(), "offset is over limit.");

    uint256 size = fundraisersCount() - offset;
    size = size < limit ? size : limit;
    size = size < maxLimit ? size : maxLimit;
    collection = new Fundraiser[](size);

    for(uint256 i = 0; i < size; i++) {
      collection[i] = _fundraisers[offset + i];
    }

    return collection;
  }
}
