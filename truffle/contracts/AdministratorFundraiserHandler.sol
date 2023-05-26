pragma solidity ^0.8.19;

import "./Fundraiser.sol";
import "./FundraiserStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AdministratorFundraiserHandler is Ownable {
  // fundraisers 関数が返すアイテムの最大値
  uint256 constant maxLimit = 50;

  FundraiserStorage internal _fundraiserStorage;

  event FundraiserCreated(Fundraiser indexed fundraiser, address indexed creator, uint256 createdAt);

  constructor(address fundraiserStorageAddress) {
    _fundraiserStorage = FundraiserStorage(fundraiserStorageAddress);
  }

  function fundraisersCount() public view onlyOwner returns (uint256) {
    return _fundraiserStorage.getUint(keccak256("fundraisersCount"));
  }

  function setFundraisersCount(uint256 count) internal onlyOwner {
    _fundraiserStorage.setUint(keccak256("fundraisersCount"), count);
  }

  function createFundraiser(
    string memory name,
    string memory description,
    string memory url,
    string memory imageUrl,
    bool isOpen,
    uint256 startedAt,
    uint256 endedAt,
    address payable beneficiary
  ) public onlyOwner {
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
      isOpen,
      startedAt,
      endedAt,
      0,
      0,
      beneficiary,
      msg.sender
    );

    uint256 count = fundraisersCount();
    setFundraisersCount(count + 1);
    _fundraiserStorage.setAddress(keccak256(abi.encodePacked("fundraiser", count)), address(fundraiser));

    emit FundraiserCreated(fundraiser, msg.sender, block.timestamp);
  }

  function fundraisers(uint256 limit, uint256 offset) public view onlyOwner returns (Fundraiser[] memory collection) {
    require(offset <= fundraisersCount(), "offset is over limit.");

    uint256 size = fundraisersCount() - offset;
    size = size < limit ? size : limit;
    size = size < maxLimit ? size : maxLimit;
    collection = new Fundraiser[](size);

    for (uint256 i = 0; i < size; i++) {
      collection[i] = Fundraiser(_fundraiserStorage.getAddress(keccak256(abi.encodePacked("fundraiser", offset + i))));
    }

    return collection;
  }
}
