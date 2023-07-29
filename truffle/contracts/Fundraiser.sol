pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./AdministratorFundraiserHandler.sol";

interface IRewardTokenContract {
  function mint(address to) external;
}

contract Fundraiser is Ownable {
  // TODO: 寄付に紐付く団体を考慮する

  using SafeMath for uint256;

  AdministratorFundraiserHandler internal _fundraiserHandler;

  IRewardTokenContract public rewardTokenContract;

  uint256 public id;
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
  uint256 public donationThresholdForToken;
  address payable public beneficiary;
  address public rewardToken;

  struct Donation {
    uint256 value;
    uint256 date;
  }

  struct FundraiserArgs {
    string name; // 必須
    string description; // 必須
    string url; // 任意
    string imageUrl; // 任意
    bool isOpen; // 必須
    uint256 startedAt; // 任意
    uint256 endedAt; // 任意
    uint256 donationThresholdForToken; // 必須
    address payable beneficiary; // 必須
    address rewardToken; // 必須
  }

  mapping(address => Donation[]) private _donations;

  event FundraiserUpdated(address indexed updater, uint256 updatedAt);
  event FundraiserDeleted(address indexed deletor, uint256 deletedAt);
  event DonationReceived(address indexed donor, uint256 value, uint256 donatedAt);

  constructor(
    address _fundraiserHandlerAddress,
    uint256 _id,
    FundraiserArgs memory _args,
    address _custodian
  ) {
    _fundraiserHandler = AdministratorFundraiserHandler(_fundraiserHandlerAddress);
    id = _id;
    name = _args.name;
    description = _args.description;
    url = _args.url;
    imageUrl = _args.imageUrl;
    isOpen = _args.isOpen;
    startedAt = _args.startedAt;
    endedAt = _args.endedAt;
    donationsAmount = 0;
    donationsCount = 0;
    donationThresholdForToken = _args.donationThresholdForToken;
    beneficiary = _args.beneficiary;
    rewardToken = _args.rewardToken;

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

  function updateFundraiser(FundraiserArgs memory args) public onlyOwner notDeleted {
    require(bytes(args.name).length > 0 && bytes(args.name).length <= 400, "name length is invalid.");
    require(bytes(args.description).length > 0 && bytes(args.description).length <= 4000, "description length is invalid.");
    require(bytes(args.url).length >= 0 && bytes(args.url).length <= 4000, "url length is invalid.");
    require(bytes(args.imageUrl).length >= 0 && bytes(args.imageUrl).length <= 4000, "imageUrl length is invalid.");
    require(args.donationThresholdForToken > 0, "donationThresholdForToken value is invalid.");
    require(args.beneficiary != address(0), "beneficiary format is invalid.");
    // TODO: rewardToken が ERC721 準拠のコントラクトであることを確認

    name = args.name;
    description = args.description;
    url = args.url;
    imageUrl = args.imageUrl;
    isOpen = args.isOpen;
    startedAt = args.startedAt;
    endedAt = args.endedAt;
    donationThresholdForToken = args.donationThresholdForToken;
    beneficiary = args.beneficiary;
    rewardToken = args.rewardToken;

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
    // update _donations
    Donation memory donation = Donation({
      value: msg.value,
      date: block.timestamp
    });
    _donations[msg.sender].push(donation);

    _fundraiserHandler.setFundraisersDonatedByDonor(msg.sender, address(this));

    // update this fundraisers' stat
    donationsAmount = donationsAmount.add(msg.value);
    donationsCount++;

    // mint a token
    if (msg.value >= donationThresholdForToken) {
      if (rewardTokenContract != IRewardTokenContract(rewardToken)) {
        rewardTokenContract = IRewardTokenContract(rewardToken);
      }

      rewardTokenContract.mint(msg.sender);
    }

    emit DonationReceived(msg.sender, msg.value, block.timestamp);
  }

  function donations() public view returns (Donation[] memory) {
    return _donations[msg.sender];
  }
}
