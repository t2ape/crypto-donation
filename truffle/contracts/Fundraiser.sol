pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Fundraiser is Ownable {
  // TODO: 寄付に紐付く団体を考慮する

  using SafeMath for uint256;

  string public name;
  string public description;
  string public url;
  string public imageUrl;
  bool public isOpen;
  uint256 public startedAt;
  uint256 public endedAt;
  uint256 public deletedAt;
  uint256 public donationsAmount;
  uint256 public donationsCount;
  address payable public beneficiary;

  struct Donation {
    uint256 value;
    uint256 date;
  }

  mapping(address => Donation[]) private _donations;

  event FundraiserUpdated(address indexed updater, uint256 updatedAt);
  event FundraiserDeleted(address indexed deletor, uint256 deletedAt);
  event DonationReceived(address indexed donor, uint256 value, uint256 donatedAt);

  constructor(
    string memory _name,
    string memory _description,
    string memory _url,
    string memory _imageUrl,
    bool _isOpen,
    uint256 _startedAt,
    uint256 _endedAt,
    uint256 _donationsAmount,
    uint256 _donationsCount,
    address payable _beneficiary,
    address _custodian
  ) {
    name = _name;
    description = _description;
    url = _url;
    imageUrl = _imageUrl;
    isOpen = _isOpen;
    startedAt = _startedAt;
    endedAt = _endedAt;
    donationsAmount = _donationsAmount;
    donationsCount = _donationsCount;
    beneficiary = _beneficiary;
    transferOwnership(_custodian);
  }

  modifier notDeleted() {
    require(deletedAt == 0);
    _;
  }

  modifier active() {
    require(isActive());
    _;
  }

  function updateFundraiser(
    string memory _name, // 必須
    string memory _description, // 必須
    string memory _url, // 任意
    string memory _imageUrl, // 任意
    bool _isOpen, // 必須
    uint256 _startedAt, // 任意
    uint256 _endedAt, // 任意
    address payable _beneficiary // 必須
  ) public onlyOwner notDeleted {
    // validations
    require(bytes(name).length > 0 && bytes(name).length <= 400, "name length is invalid.");
    require(bytes(description).length > 0 && bytes(description).length <= 4000, "description length is invalid.");
    require(bytes(url).length >= 0 && bytes(url).length <= 4000, "url length is invalid.");
    require(bytes(imageUrl).length >= 0 && bytes(imageUrl).length <= 4000, "imageUrl length is invalid.");
    require(beneficiary != address(0), "beneficiary format is invalid.");

    name = _name;
    description = _description;
    url = _url;
    imageUrl = _imageUrl;
    isOpen = _isOpen;
    startedAt = _startedAt;
    endedAt = _endedAt;
    beneficiary = _beneficiary;

    emit FundraiserUpdated(msg.sender, block.timestamp);
  }

  function deleteFundraiser() public onlyOwner notDeleted {
    deletedAt = block.timestamp;

    emit FundraiserDeleted(msg.sender, deletedAt);
  }

  function isActive() public view returns (bool) {
    return (
      isOpen &&
      deletedAt == 0 &&
      startedAt <= block.timestamp &&
      endedAt > block.timestamp
    );
  }

  function donate() public payable active {
    Donation memory donation = Donation({
      value: msg.value,
      date: block.timestamp
    });
    _donations[msg.sender].push(donation);
    donationsAmount = donationsAmount.add(msg.value);
    donationsCount++;

    emit DonationReceived(msg.sender, msg.value, block.timestamp);
  }
}
