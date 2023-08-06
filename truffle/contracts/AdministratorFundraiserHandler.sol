pragma solidity ^0.8.19;

import {Fundraiser} from "./Fundraiser.sol";
import {FundraiserStorage} from "./FundraiserStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract AdministratorFundraiserHandler is Ownable {
  FundraiserStorage internal _fundraiserStorage;

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
    require(_msgSenderIsFundraiser(), "msg.sender is not authorized.");
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
    try IERC721(_address).name() returns (string memory) {
      return true;
    } catch {
      return false;
    }
  }

  // TODO: Fundraiser 作成・更新時に、HeartToken の minters に Fundraiser を add/delete する方法を検討
  function createFundraiser(FundraiserArgs memory args) public onlyOwner {
    // validations
    require(
      bytes(args.name).length > 0 && bytes(args.name).length <= 400,
      "name length is invalid."
    );
    require(
      bytes(args.description).length > 0 &&
        bytes(args.description).length <= 4000,
      "description length is invalid."
    );
    require(
      bytes(args.url).length >= 0 && bytes(args.url).length <= 4000,
      "url length is invalid."
    );
    require(
      bytes(args.imageUrl).length >= 0 && bytes(args.imageUrl).length <= 4000,
      "imageUrl length is invalid."
    );
    require(
      args.donationThresholdForToken > 0,
      "donationThresholdForToken value is invalid."
    );
    require(args.beneficiary != address(0), "beneficiary format is invalid.");
    require(
      _tokenAddressIsErc721(args.rewardToken),
      "rewardToken format is invalid."
    );

    uint256 count = fundraisersCount();

    Fundraiser.FundraiserArgs memory fundraiserArgs = Fundraiser
      .FundraiserArgs({
        name: args.name,
        description: args.description,
        url: args.url,
        imageUrl: args.imageUrl,
        isOpen: args.isOpen,
        startedAt: args.startedAt,
        endedAt: args.endedAt,
        donationThresholdForToken: args.donationThresholdForToken,
        beneficiary: args.beneficiary,
        rewardToken: args.rewardToken
      });

    Fundraiser.ConstructorArgs memory constructorArgs = Fundraiser
      .ConstructorArgs({
        fundraiserHandlerAddress: address(this),
        id: count,
        fundraiserArgs: fundraiserArgs,
        custodian: msg.sender
      });

    Fundraiser fundraiser = new Fundraiser(constructorArgs);

    setFundraisersCount(count + 1);
    _fundraiserStorage.setAddress(
      keccak256(abi.encodePacked("fundraiser", count)),
      address(fundraiser)
    );

    // solhint-disable-next-line func-named-parameters, not-rely-on-time
    emit FundraiserCreated(fundraiser, msg.sender, block.timestamp);
  }

  function fundraisers(
    uint256 limit,
    uint256 offset
  ) public view onlyOwner returns (Fundraiser[] memory collection) {
    require(offset <= fundraisersCount(), "offset is over limit.");

    uint256 maxLimit = 50;

    uint256 size = fundraisersCount() - offset;
    size = size < limit ? size : limit;
    size = size < maxLimit ? size : maxLimit;
    collection = new Fundraiser[](size);

    for (uint256 i = 0; i < size; i++) {
      collection[i] = Fundraiser(
        _fundraiserStorage.getAddress(
          keccak256(abi.encodePacked("fundraiser", offset + i))
        )
      );
    }

    return collection;
  }

  function fundraisersCount() public view onlyOwner returns (uint256) {
    return _fundraiserStorage.getUint(keccak256("fundraisersCount"));
  }

  function setFundraisersCount(uint256 count) internal onlyOwner {
    _fundraiserStorage.setUint(keccak256("fundraisersCount"), count);
  }

  function setFundraisersDonatedByDonor(
    address donor,
    address fundraiser
  ) public onlyFundraiser {
    bool contractIsPresentInFundraisers = false;
    address[] memory fundraisersArray = _fundraiserStorage.getAddressArray(
      keccak256(abi.encodePacked("fundraisersDonatedByDonor", donor))
    );

    for (uint256 i = 0; i < fundraisersArray.length; i++) {
      if (fundraisersArray[i] == address(fundraiser)) {
        contractIsPresentInFundraisers = true;
        break;
      }
    }

    if (!contractIsPresentInFundraisers) {
      address[] memory newFundraisers = new address[](
        fundraisersArray.length + 1
      );
      for (uint256 i = 0; i < fundraisersArray.length; i++) {
        newFundraisers[i] = fundraisersArray[i];
      }
      newFundraisers[fundraisersArray.length] = address(fundraiser);

      _fundraiserStorage.setAddressArray(
        keccak256(abi.encodePacked("fundraisersDonatedByDonor", donor)),
        newFundraisers
      );
    }
  }
}
