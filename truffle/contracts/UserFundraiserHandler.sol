// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.19;

import {Fundraiser} from "./Fundraiser.sol";
import {FundraiserStorage} from "./FundraiserStorage.sol";

contract UserFundraiserHandler {
  FundraiserStorage private _fundraiserStorage;

  constructor(address fundraiserStorageAddress) {
    _fundraiserStorage = FundraiserStorage(fundraiserStorageAddress);
  }

  function activeFundraisers(
    uint256 _limit,
    uint256 _offset
  ) public view returns (Fundraiser[] memory collection) {
    require(_offset <= activeFundraisersCount(), "offset is over limit");

    uint256 maxLimit = 50;

    uint256 size = activeFundraisersCount() - _offset;
    size = size < _limit ? size : _limit;
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
        if (collectionIndex >= _offset && collectionIndex < _offset + size) {
          // インクリメントしていった collectionIndex が offset 以上 offset + size 未満の時だけ、
          // collection に fundraiser を追加していく。
          // collection[collectionIndex - offset] とすることで、
          // collection[0] から順に fundraiser が追加されていく。
          collection[collectionIndex - _offset] = fundraiser;
        }
        // collection に追加する・しないに関わらず、collectionIndex はインクリメントしていく
        collectionIndex++;

        if (collectionIndex >= _offset + size) {
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
    uint256 size = _fundraiserStorage.getUint(keccak256("fundraisersCount"));

    // This is an overestimate, but ensures we have a large enough array.
    address[] memory tempCollection = new address[](size);
    uint256 count = 0; // To keep track of how many addresses we've added.

    for (uint256 i = 0; i < size; i++) {
      address fundraiserAddress = _fundraiserStorage.getAddress(
        keccak256(abi.encodePacked("fundraiser", i))
      );

      if (
        _fundraiserStorage.getBool(
          keccak256(
            abi.encodePacked( // solhint-disable-line func-named-parameters
              "fundraisersDonatedByDonor",
              msg.sender,
              fundraiserAddress
          )
        )
      )
      ) {
        tempCollection[count] = fundraiserAddress;
        count++;
      }
    }

    // Create a new array with the correct size.
    address[] memory collection = new address[](count);
    for (uint256 i = 0; i < count; i++) {
      collection[i] = tempCollection[i];
    }

    return collection;
  }
}
