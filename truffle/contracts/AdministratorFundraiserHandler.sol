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

  function setFundraisersCount(uint256 count) internal onlyOwner {
    _fundraiserStorage.setUint(keccak256("fundraisersCount"), count);
  }

  // TODO: Fundraiser 作成・更新時に、HeartToken の minters に Fundraiser を add/delete する方法を検討
  function createFundraiser(
    string memory name, // 必須
    string memory description, // 必須
    string memory url, // 任意
    string memory imageUrl, // 任意
    bool isOpen, // 必須
    uint256 startedAt, // 任意
    uint256 endedAt, // 任意
    address payable beneficiary, // 必須
    address rewardToken // 必須
  ) public onlyOwner {
    // validations
    require(bytes(name).length > 0 && bytes(name).length <= 400, "name length is invalid.");
    require(bytes(description).length > 0 && bytes(description).length <= 4000, "description length is invalid.");
    require(bytes(url).length >= 0 && bytes(url).length <= 4000, "url length is invalid.");
    require(bytes(imageUrl).length >= 0 && bytes(imageUrl).length <= 4000, "imageUrl length is invalid.");
    require(beneficiary != address(0), "beneficiary format is invalid.");
    // TODO: rewardToken が ERC721 準拠のコントラクトであることを確認

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
      msg.sender,
      rewardToken
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

  function fundraisersCount() public view onlyOwner returns (uint256) {
    return _fundraiserStorage.getUint(keccak256("fundraisersCount"));
  }
}
