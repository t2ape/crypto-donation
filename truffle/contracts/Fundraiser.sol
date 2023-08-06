pragma solidity ^0.8.19;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import {AdministratorFundraiserHandler} from "./AdministratorFundraiserHandler.sol";

interface IRewardTokenContract {
  function mint(address to) external;
}

// solhint-disable-next-line max-states-count
contract Fundraiser is Ownable {
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
    string name; // required
    string description; // required
    string url; // optional
    string imageUrl; // optional
    bool isOpen; // required
    uint256 startedAt; // optional
    uint256 endedAt; // optional
    uint256 donationThresholdForToken; // required
    address payable beneficiary; // required
    address rewardToken; // required
  }

  struct ConstructorArgs {
    address fundraiserHandlerAddress;
    uint256 id;
    FundraiserArgs fundraiserArgs;
    address custodian;
  }

  mapping(address => Donation[]) private _donations;

  event FundraiserUpdated(address indexed updater, uint256 updatedAt);
  event FundraiserDeleted(address indexed deletor, uint256 deletedAt);
  event DonationReceived(
    address indexed donor,
    uint256 value,
    uint256 donatedAt
  );

  constructor(ConstructorArgs _args) {
    _fundraiserHandler = AdministratorFundraiserHandler(
      address(_args.fundraiserHandlerAddress)
    );

    id = uint256(_args.id);

    fundraiserArgs = FundraiserArgs(_args.fundraiserArgs);

    name = fundraiserArgs.name;
    description = fundraiserArgs.description;
    url = fundraiserArgs.url;
    imageUrl = fundraiserArgs.imageUrl;
    isOpen = fundraiserArgs.isOpen;
    startedAt = fundraiserArgs.startedAt;
    endedAt = fundraiserArgs.endedAt;
    donationsAmount = 0;
    donationsCount = 0;
    donationThresholdForToken = fundraiserArgs.donationThresholdForToken;
    beneficiary = fundraiserArgs.beneficiary;
    rewardToken = fundraiserArgs.rewardToken;

    transferOwnership(address(_args.custodian));
  }

  modifier notDeleted() {
    require(deletedAt == 0, "fundraiser has already deleted");
    _;
  }

  modifier active() {
    require(_isActive(), "fundraiser in not active");
    _;
  }

  function _isActive() private view returns (bool) {
    return (isOpen &&
      deletedAt == 0 &&
      startedAt <= block.timestamp && // solhint-disable-line not-rely-on-time
      endedAt > block.timestamp); // solhint-disable-line not-rely-on-time
  }

  function _tokenAddressIsErc721(address _address) private view returns (bool) {
    try IERC721(_address).name() returns (string memory) {
      return true;
    } catch {
      return false;
    }
  }

  function updateFundraiser(
    FundraiserArgs memory args
  ) public onlyOwner notDeleted {
    require(
      bytes(args.name).length > 0 && bytes(args.name).length <= 400,
      "name length is invalid"
    );
    require(
      bytes(args.description).length > 0 &&
        bytes(args.description).length <= 4000,
      "description length is invalid"
    );
    require(
      bytes(args.url).length >= 0 && bytes(args.url).length <= 4000,
      "url length is invalid"
    );
    require(
      bytes(args.imageUrl).length >= 0 && bytes(args.imageUrl).length <= 4000,
      "imageUrl length is invalid"
    );
    require(
      args.donationThresholdForToken > 0,
      "donationThresholdForToken value is invalid"
    );
    require(args.beneficiary != address(0), "beneficiary format is invalid");
    require(
      _tokenAddressIsErc721(args.rewardToken),
      "rewardToken format is invalid"
    );

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

    emit FundraiserUpdated(msg.sender, block.timestamp); // solhint-disable-line not-rely-on-time
  }

  function deleteFundraiser() public onlyOwner notDeleted {
    deletedAt = block.timestamp; // solhint-disable-line not-rely-on-time

    emit FundraiserDeleted(msg.sender, deletedAt);
  }

  function donate() public payable active notDeleted {
    // update _donations
    Donation memory donation = Donation({
      value: msg.value,
      date: block.timestamp // solhint-disable-line not-rely-on-time
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

    // solhint-disable-next-line func-named-parameters, not-rely-on-time
    emit DonationReceived(msg.sender, msg.value, block.timestamp);
  }

  function donations() public view returns (Donation[] memory) {
    return _donations[msg.sender];
  }
}
