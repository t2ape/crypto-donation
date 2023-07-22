pragma solidity ^0.8.19;

import "./Fundraiser.sol";
import "./FundraiserStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AdministratorFundraiserHandler is Ownable {
  // fundraisers 関数が返すアイテムの最大値
  uint256 constant maxLimit = 50;

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

  FundraiserStorage internal _fundraiserStorage;

  event FundraiserCreated(Fundraiser indexed fundraiser, address indexed creator, uint256 createdAt);

  modifier onlyFundraiser {
    require(_msgSenderIsFundraiser());
    _;
  }

  constructor(address fundraiserStorageAddress) {
    _fundraiserStorage = FundraiserStorage(fundraiserStorageAddress);
  }

  function _msgSenderIsFundraiser() private view returns(bool) {
    Fundraiser fundraiser = Fundraiser(msg.sender);
    if (_fundraiserStorage.getAddress(keccak256(abi.encodePacked("fundraiser", fundraiser.id))) != address(0)) {
      return true;
    }

    return false;
  }

  function setFundraisersCount(uint256 count) internal onlyOwner {
    _fundraiserStorage.setUint(keccak256("fundraisersCount"), count);
  }

  // TODO: Fundraiser 作成・更新時に、HeartToken の minters に Fundraiser を add/delete する方法を検討
  function createFundraiser(FundraiserArgs memory args) public onlyOwner {
    // validations
    require(bytes(args.name).length > 0 && bytes(args.name).length <= 400, "name length is invalid.");
    require(bytes(args.description).length > 0 && bytes(args.description).length <= 4000, "description length is invalid.");
    require(bytes(args.url).length >= 0 && bytes(args.url).length <= 4000, "url length is invalid.");
    require(bytes(args.imageUrl).length >= 0 && bytes(args.imageUrl).length <= 4000, "imageUrl length is invalid.");
    require(args.donationThresholdForToken > 0, "donationThresholdForToken value is invalid.");
    require(args.beneficiary != address(0), "beneficiary format is invalid.");
    // TODO: rewardToken が ERC721 準拠のコントラクトであることを確認

    uint256 count = fundraisersCount();

    Fundraiser.FundraiserArgs memory fundraiserArgs = Fundraiser.FundraiserArgs({
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

    Fundraiser fundraiser = new Fundraiser(
      address(this),
      count,
      fundraiserArgs,
      msg.sender
    );

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

  function fundraisersDonatedByDonor(address donor) public view onlyFundraiser returns (address[] memory) {
    return _fundraiserStorage.getAddressArray(keccak256(abi.encodePacked("fundraisersDonatedByDonor", donor)));
  }

  function setFundraisersDonatedByDonor(address donor, address fundraiser) public onlyFundraiser {
    bool contractIsPresentInFundraisers = false;
    address[] memory fundraisersArray = _fundraiserStorage.getAddressArray(keccak256(abi.encodePacked("fundraisersDonatedByDonor", donor)));

    for(uint i = 0; i < fundraisersArray.length; i++){
      if(fundraisersArray[i] == address(fundraiser)){
        contractIsPresentInFundraisers = true;
        break;
      }
    }

    if(!contractIsPresentInFundraisers){
      address[] memory newFundraisers = new address[](fundraisersArray.length + 1);
      for(uint i = 0; i < fundraisersArray.length; i++) {
        newFundraisers[i] = fundraisersArray[i];
      }
      newFundraisers[fundraisersArray.length] = address(fundraiser);
      _fundraiserStorage.setAddressArray(keccak256(abi.encodePacked("fundraisersDonatedByDonor", donor)), newFundraisers);
    }
  }
}
