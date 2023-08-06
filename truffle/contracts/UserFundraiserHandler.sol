pragma solidity ^0.8.19;

import {Fundraiser} from "./Fundraiser.sol";
import {FundraiserStorage} from "./FundraiserStorage.sol";

contract UserFundraiserHandler {
  FundraiserStorage private _fundraiserStorage;

  constructor(address fundraiserStorageAddress) {
    _fundraiserStorage = FundraiserStorage(fundraiserStorageAddress);
  }

  function activeFundraisers(
    uint256 limit,
    uint256 offset
  ) public view returns (Fundraiser[] memory collection) {
    require(offset <= activeFundraisersCount(), "offset is over limit");

    uint256 maxLimit = 50;

    uint256 size = activeFundraisersCount() - offset;
    size = size < limit ? size : limit;
    size = size < maxLimit ? size : maxLimit;
    collection = new Fundraiser[](size);

    uint256 collectionIndex = 0;
    uint256 fundraisersCount = _fundraiserStorage.getUint(
      keccak256("fundraisersCount")
    );

    for (uint256 i = 0; i < fundraisersCount; i++) {
      Fundraiser fundraiser = Fundraiser(
        _fundraiserStorage.getAddress(
          keccak256(abi.encodePacked("fundraiser", i))
        )
      );
      if (fundraiser.isActive()) {
        if (collectionIndex >= offset && collectionIndex < offset + size) {
          // インクリメントしていった collectionIndex が offset 以上 offset + size 未満の時だけ、
          // collection に fundraiser を追加していく。
          // collection[collectionIndex - offset] とすることで、
          // collection[0] から順に fundraiser が追加されていく。
          collection[collectionIndex - offset] = fundraiser;
        }
        // collection に追加する・しないに関わらず、collectionIndex はインクリメントしていく
        collectionIndex++;

        if (collectionIndex >= offset + size) {
          break;
        }
      }
    }

    return collection;
  }

  function activeFundraisersCount() public view returns (uint256) {
    uint256 count = 0;
    uint256 fundraisersCount = _fundraiserStorage.getUint(
      keccak256("fundraisersCount")
    );
    for (uint256 i = 0; i < fundraisersCount; i++) {
      Fundraiser fundraiser = Fundraiser(
        _fundraiserStorage.getAddress(
          keccak256(abi.encodePacked("fundraiser", i))
        )
      );
      if (fundraiser.isActive()) {
        count++;
      }
    }
    return count;
  }

  function fundraisersDonatedByMsgSender()
    public
    view
    returns (address[] memory)
  {
    return
      _fundraiserStorage.getAddressArray(
        keccak256(abi.encodePacked("fundraisersDonatedByDonor", msg.sender))
      );
  }
}
