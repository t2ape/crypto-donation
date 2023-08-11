// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.19;

import {Fundraiser} from "./Fundraiser.sol";
import {FundraiserStorage} from "./FundraiserStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

interface IERC165 {
  function supportsInterface(bytes4 interfaceID) external view returns (bool);
}

contract AdministratorFundraiserHandler is Ownable {
  FundraiserStorage private _fundraiserStorage;

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

  event FundraiserCreated(
    Fundraiser indexed fundraiser,
    address indexed creator,
    uint256 createdAt
  );

  constructor(address fundraiserStorageAddress) {
    _fundraiserStorage = FundraiserStorage(fundraiserStorageAddress);
  }

  modifier onlyFundraiser() {
    require(_msgSenderIsFundraiser(), "msg.sender is not authorized");
    _;
  }

  function _msgSenderIsFundraiser() private view returns (bool) {
    Fundraiser fundraiser = Fundraiser(msg.sender);
    if (
      _fundraiserStorage.getAddress(
        keccak256(abi.encodePacked("fundraiser", fundraiser.id()))
      ) != address(0)
    ) {
      return true;
    }

    return false;
  }

  function _tokenAddressIsErc721(address _address) private view returns (bool) {
    bytes4 interfaceID = 0x80ac58cd; // Interface ID of IERC721
    try IERC165(_address).supportsInterface(interfaceID) returns (bool result) {
      return result;
    } catch {
      return false;
    }
  }

  function msgSenderIsOwner() public view returns (bool) {
    return msg.sender == owner();
  }

  // TODO: Fundraiser 作成・更新時に、HeartToken の minters に Fundraiser を add/delete する方法を検討
  function createFundraiser(FundraiserArgs memory _args) public onlyOwner {
    // validations
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

    uint256 count = fundraisersCount();

    Fundraiser.FundraiserArgs memory fundraiserArgs = Fundraiser
      .FundraiserArgs({
        name: _args.name,
        description: _args.description,
        url: _args.url,
        imageUrl: _args.imageUrl,
        isOpen: _args.isOpen,
        startedAt: _args.startedAt,
        endedAt: _args.endedAt,
        donationThresholdForToken: _args.donationThresholdForToken,
        beneficiary: _args.beneficiary,
        rewardToken: _args.rewardToken
      });

    Fundraiser.ConstructorArgs memory constructorArgs = Fundraiser
      .ConstructorArgs({
        fundraiserHandlerAddress: address(this),
        id: count,
        fundraiserArgs: fundraiserArgs,
        custodian: msg.sender
      });

    Fundraiser fundraiser = new Fundraiser(constructorArgs);

    _setFundraisersCount(count + 1);
    _fundraiserStorage.setAddress(
      keccak256(abi.encodePacked("fundraiser", count)),
      address(fundraiser)
    );

    // solhint-disable-next-line func-named-parameters, not-rely-on-time
    emit FundraiserCreated(fundraiser, msg.sender, block.timestamp);
  }

  function fundraisers(
    uint256 _limit,
    uint256 _offset
  ) public view onlyOwner returns (Fundraiser[] memory collection) {
    require(_offset <= fundraisersCount(), "offset is over limit");

    uint256 maxLimit = 50;

    uint256 size = fundraisersCount() - _offset;
    size = size < _limit ? size : _limit;
    size = size < maxLimit ? size : maxLimit;
    collection = new Fundraiser[](size);

    for (uint256 i = 0; i < size; i++) {
      collection[i] = Fundraiser(
        _fundraiserStorage.getAddress(
          keccak256(abi.encodePacked("fundraiser", _offset + i))
        )
      );
    }

    return collection;
  }

  function fundraisersCount() public view onlyOwner returns (uint256) {
    return _fundraiserStorage.getUint(keccak256("fundraisersCount"));
  }

  function _setFundraisersCount(uint256 _count) private {
    _fundraiserStorage.setUint(keccak256("fundraisersCount"), _count);
  }

  function setFundraiserIsDonated(
    address _donor,
    address _fundraiser
  ) public onlyFundraiser {
    _fundraiserStorage.setBool(
      keccak256(abi.encodePacked("fundraiserIsDonated", _donor, _fundraiser)), // solhint-disable-line func-named-parameters
      true
    );
  }
}
