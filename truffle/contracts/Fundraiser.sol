// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.19;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import {AdministratorFundraiserHandler} from "./AdministratorFundraiserHandler.sol";

interface IRewardTokenContract {
  function mint(address to) external;
}

interface IERC165 {
  function supportsInterface(bytes4 interfaceID) external view returns (bool);
}

// solhint-disable-next-line max-states-count
contract Fundraiser is Ownable {
  using SafeMath for uint256;

  AdministratorFundraiserHandler internal _fundraiserHandler;

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

  event FundraiserUpdated(address indexed updater, uint256 updatedAt);
  event FundraiserDeleted(address indexed deletor, uint256 deletedAt);
  event FundraiserDonated(
    address indexed donor,
    uint256 value,
    uint256 donatedAt
  );

  constructor(ConstructorArgs memory _args) {
    _fundraiserHandler = AdministratorFundraiserHandler(
      address(_args.fundraiserHandlerAddress)
    );

    id = uint256(_args.id);

    FundraiserArgs memory fundraiserArgs = _args.fundraiserArgs;

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
    require(isActive(), "fundraiser in not active");
    _;
  }

  function isActive() public view returns (bool) {
    return (isOpen &&
      deletedAt == 0 &&
      startedAt <= block.timestamp && // solhint-disable-line not-rely-on-time
      endedAt > block.timestamp); // solhint-disable-line not-rely-on-time
  }

  function _tokenAddressIsErc721(address _address) private view returns (bool) {
    bytes4 interfaceID = 0x80ac58cd; // Interface ID of IERC721
    try IERC165(_address).supportsInterface(interfaceID) returns (bool result) {
      return result;
    } catch {
      return false;
    }
  }

  function updateFundraiser(
    FundraiserArgs memory _args
  ) public onlyOwner notDeleted {
    require(
      bytes(_args.name).length > 0 && bytes(_args.name).length <= 400,
      "name length is invalid"
    );
    require(
      bytes(_args.description).length > 0 &&
        bytes(_args.description).length <= 4000,
      "description length is invalid"
    );
    require(
      bytes(_args.url).length >= 0 && bytes(_args.url).length <= 4000,
      "url length is invalid"
    );
    require(
      bytes(_args.imageUrl).length >= 0 && bytes(_args.imageUrl).length <= 4000,
      "imageUrl length is invalid"
    );
    require(
      _args.donationThresholdForToken > 0,
      "donationThresholdForToken value is invalid"
    );
    require(_args.beneficiary != address(0), "beneficiary format is invalid");
    require(
      _tokenAddressIsErc721(_args.rewardToken),
      "rewardToken format is invalid"
    );

    name = _args.name;
    description = _args.description;
    url = _args.url;
    imageUrl = _args.imageUrl;
    isOpen = _args.isOpen;
    startedAt = _args.startedAt;
    endedAt = _args.endedAt;
    donationThresholdForToken = _args.donationThresholdForToken;
    beneficiary = _args.beneficiary;
    rewardToken = _args.rewardToken;

    emit FundraiserUpdated(msg.sender, block.timestamp); // solhint-disable-line not-rely-on-time
  }

  function deleteFundraiser() public onlyOwner notDeleted {
    deletedAt = block.timestamp; // solhint-disable-line not-rely-on-time

    emit FundraiserDeleted(msg.sender, deletedAt);
  }

  function donate() public payable active notDeleted {
    // update this fundraisers' stat
    donationsAmount = donationsAmount.add(msg.value);
    donationsCount++;

    // update donated history
    _fundraiserHandler.setFundraiserIsDonated(msg.sender, address(this));

    // mint a token
    if (msg.value >= donationThresholdForToken) {
      IRewardTokenContract _tempRewardTokenContract = IRewardTokenContract(
        rewardToken
      );
      _tempRewardTokenContract.mint(msg.sender);
    }

    // donate
    emit FundraiserDonated(msg.sender, msg.value, block.timestamp); // solhint-disable-line not-rely-on-time, func-named-parameters

    beneficiary.transfer(msg.value);
  }
}
