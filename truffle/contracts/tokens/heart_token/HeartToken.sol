// SPDX-License-Identifier: GPL-3.0

/// @title The Heart ERC-721 token

pragma solidity ^0.8.19;

import { Ownable } from '@openzeppelin/contracts/access/Ownable.sol';
import { ERC721 } from './base/ERC721.sol';
import { IERC721 } from '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import { IProxyRegistry } from './external/opensea/IProxyRegistry.sol';

contract HeartToken is Ownable {
  using Strings for uint256;

  // The founders address (creators org)
  address public founders;

  // An address who has permissions to mint token
  address public minter;

  // Whether the minter can be updated
  bool public isMinterLocked;

  // The internal token ID tracker
  uint256 private _currentTokenId;

  // OpenSea's Proxy Registry
  IProxyRegistry public immutable proxyRegistry;

  /**
   * @notice Require that the minter has not been locked.
     */
  modifier whenMinterNotLocked() {
    require(!isMinterLocked, 'Minter is locked');
    _;
  }

  /**
   * @notice Require that the sender is the founders.
     */
  modifier onlyFounders() {
    require(msg.sender == founders, 'Sender is not the founders');
    _;
  }

  /**
   * @notice Require that the sender is the minter.
     */
  modifier onlyMinter() {
    require(msg.sender == minter, 'Sender is not the minter');
    _;
  }

//  TODO: opensea について調べたら proxyRegistry を用いる形に修正
//  constructor(
//    address _founders,
//    address _minter,
//    IProxyRegistry _proxyRegistry
//  ) ERC721('Heart', 'HEART') {
//    founders = _founders;
//    minter = _minter;
//    proxyRegistry = _proxyRegistry;
//  }

  constructor(
    address _founders,
    address _minter
  ) ERC721('Heart', 'HEART') {
    founders = _founders;
    minter = _minter;
  }

  /**
   * @notice Override isApprovedForAll to whitelist user's OpenSea proxy accounts to enable gas-less listings.
     */
  function isApprovedForAll(address owner, address operator) public view override(IERC721, ERC721) returns (bool) {
    // Whitelist OpenSea proxy contract for easy trading.

    //  TODO: opensea について調べたら proxyRegistry を用いる形に修正
//    if (proxyRegistry.proxies(owner) == operator) {
//      return true;
//    }
    return super.isApprovedForAll(owner, operator);
  }

  /**
   * @notice Mint a token to the minter, along with a possible founders reward
     * token. Founders reward tokens are minted every 10 token.
     */
  function mint() public override onlyMinter {
    if (_currentTokenId % 10 == 0) {
      _mint(owner(), founders, _currentTokenId++);
    }
    _mint(owner(), minter, _currentTokenId++);
  }

  /**
   * @notice Burn a token.
     */
  function burn(uint256 tokenID) public override onlyMinter {
    _burn(tokenID);
    emit TokenBurned(tokenID);
  }

  /**
   * @notice A distinct Uniform Resource Identifier (URI) for a given asset.
     * @dev See {IERC721Metadata-tokenURI}.
     */
  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    require(_exists(tokenId), 'URI query for nonexistent token');
    return dataURI(tokenId);
  }

  /**
   * @notice Similar to `tokenURI`, but always serves a base64 encoded data URI
     * with the JSON contents directly inlined.
     */
  function dataURI(uint256 tokenId) public view override returns (string memory) {
    require(_exists(tokenId), 'URI query for nonexistent token');

    string memory tokenId = tokenId.toString();
    string memory name = string(abi.encodePacked('Heart Token #', tokenId));
    string memory image = Base64.encode(_generateSVG(tokenId));
    return string(
      abi.encodePacked(
        'data:application/json;base64,',
        Base64.encode(
          bytes(
            abi.encodePacked('{"name":"', name, '", "image": "', 'data:image/svg+xml;base64,', image, '"}')
          )
        )
      )
    );
  }

  function _generateSVG(uint256 tokenId) internal pure returns (bytes memory) {
    uint256[2] f_point_1 = [270, 45];
    uint256[2] f_point_2 = [810, 45];
    uint256[2] f_point_3 = [450, 90];
    uint256[2] f_point_4 = [630, 90];
    uint256[2] f_point_5 = [90, 180];
    uint256[2] f_point_6 = [540, 180];
    uint256[2] f_point_7 = [990, 180];
    uint256[2] f_point_8 = [0, 360];
    uint256[2] f_point_9 = [1080, 360];
    uint256[2] f_point_10 = [90, 585];
    uint256[2] f_point_11 = [990, 585];
    uint256[2] f_point_12 = [180, 720];
    uint256[2] f_point_13 = [900, 720];
    uint256[2] f_point_14 = [360, 900];
    uint256[2] f_point_15 = [720, 900];
    uint256[2] f_point_16 = [540, 1080];

    uint256 nonce = 0;
    uint256[2] r_point_1 = [_randomValue(tokenId, nonce++) % 180 + 180, _randomValue(tokenId, nonce++) % 180 + 180];
    uint256[2] r_point_2 = [_randomValue(tokenId, nonce++) % 180 + 360, _randomValue(tokenId, nonce++) % 180 + 180];
    uint256[2] r_point_3 = [_randomValue(tokenId, nonce++) % 180 + 540, _randomValue(tokenId, nonce++) % 180 + 180];
    uint256[2] r_point_4 = [_randomValue(tokenId, nonce++) % 180 + 720, _randomValue(tokenId, nonce++) % 180 + 180];
    uint256[2] r_point_5 = [_randomValue(tokenId, nonce++) % 180 + 180, _randomValue(tokenId, nonce++) % 180 + 360];
    uint256[2] r_point_6 = [_randomValue(tokenId, nonce++) % 180 + 360, _randomValue(tokenId, nonce++) % 180 + 360];
    uint256[2] r_point_7 = [_randomValue(tokenId, nonce++) % 180 + 540, _randomValue(tokenId, nonce++) % 180 + 360];
    uint256[2] r_point_8 = [_randomValue(tokenId, nonce++) % 180 + 720, _randomValue(tokenId, nonce++) % 180 + 360];
    uint256[2] r_point_9 = [_randomValue(tokenId, nonce++) % 180 + 180, _randomValue(tokenId, nonce++) % 180 + 540];
    uint256[2] r_point_10 = [_randomValue(tokenId, nonce++) % 180 + 360, _randomValue(tokenId, nonce++) % 180 + 540];
    uint256[2] r_point_11 = [_randomValue(tokenId, nonce++) % 180 + 540, _randomValue(tokenId, nonce++) % 180 + 540];
    uint256[2] r_point_12 = [_randomValue(tokenId, nonce++) % 180 + 720, _randomValue(tokenId, nonce++) % 180 + 540];
    uint256[2] r_point_13 = [_randomValue(tokenId, nonce++) % 180 + 360, _randomValue(tokenId, nonce++) % 180 + 720];
    uint256[2] r_point_14 = [_randomValue(tokenId, nonce++) % 180 + 540, _randomValue(tokenId, nonce++) % 180 + 720];

    uint256[2][3][42] memory seeds = [
      [f_point_5, f_point_1, r_point_1], // uppermost part
      [f_point_1, r_point_1, f_point_3], // uppermost part
      [r_point_1, f_point_3, r_point_2], // uppermost part
      [f_point_3, r_point_2, f_point_6], // uppermost part
      [r_point_2, f_point_6, r_point_3], // uppermost part
      [f_point_6, r_point_3, f_point_4], // uppermost part
      [r_point_3, f_point_4, r_point_4], // uppermost part
      [f_point_4, r_point_4, f_point_2], // uppermost part
      [r_point_4, f_point_2, f_point_7], // uppermost part
      [f_point_5, f_point_8, r_point_1], // upper left part
      [f_point_8, r_point_1, r_point_5], // upper left part
      [r_point_1, r_point_5, r_point_2], // upper left part
      [r_point_5, r_point_2, r_point_6], // upper left part
      [r_point_2, r_point_6, r_point_7], // upper left part
      [r_point_2, r_point_7, r_point_3], // upper right part
      [r_point_7, r_point_3, r_point_8], // upper right part
      [r_point_3, r_point_8, r_point_4], // upper right part
      [r_point_8, r_point_4, f_point_9], // upper right part
      [r_point_4, f_point_9, f_point_7], // upper right part
      [f_point_8, f_point_10, r_point_5], // middle left part
      [f_point_10, r_point_5, f_point_12], // middle left part
      [r_point_5, f_point_12, r_point_9], // middle left part
      [f_point_12, r_point_9, r_point_13], // middle left part
      [r_point_5, r_point_9, r_point_6], // middle center left part
      [r_point_9, r_point_6, r_point_10], // middle center left part
      [r_point_6, r_point_10, r_point_11], // middle center left part
      [r_point_6, r_point_11, r_point_7], // middle center right part
      [r_point_11, r_point_7, r_point_12], // middle center right part
      [r_point_7, r_point_12, r_point_8], // middle center right part
      [r_point_14, r_point_12, f_point_13], // middle right part
      [r_point_12, f_point_13, r_point_8], // middle right part
      [f_point_13, r_point_8, f_point_11], // middle right part
      [r_point_8, f_point_11, f_point_9], // middle right part
      [r_point_9, r_point_13, r_point_10], // lower part
      [r_point_13, r_point_10, r_point_14], // lower part
      [r_point_10, r_point_14, r_point_11], // lower part
      [r_point_14, r_point_11, r_point_12], // lower part
      [f_point_12, f_point_14, r_point_13], // lowest part
      [f_point_14, r_point_13, f_point_16], // lowest part
      [r_point_13, f_point_16, r_point_14], // lowest part
      [f_point_16, r_point_14, f_point_15], // lowest part
      [r_point_14, f_point_15, f_point_13] // lowest part
    ];

    uint256 seed = _randomValue(tokenId, nonce++);
    string[10] colors;
    if (seed % 10 == 0) {
      colors = [
        "#F94144",
        "#F3722C",
        "#F8961E",
        "#F9844A",
        "#F9C74F",
        "#90BE6D",
        "#43AA8B",
        "#4D908E",
        "#577590",
        "#277DA1"
      ];
    } else {
      // TODO: 10 色にする?
      colors = [
        "#E60033",
        "#E6B8C2",
        "#E68A9E",
        "#E65C7A",
        "#E62E56",
        "#E60033"
      ];
    }

    bytes memory image = _generateImage(tokenId, seeds, colors);

    return abi.encodePacked(
      '<svg width="1080" height="1080" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">\n',
      image,
      '</svg>'
    );
  }

  function _generateImage(uint256 tokenId, uint256[2][3][42] _seeds, string[10] _colors) internal pure returns(bytes memory) {
    bytes memory pack;
    uint256 i;
    for (i = 0; i < _seeds.length; i++) {
      uint256 _colorsIndex = _randomValue(tokenId, i) % 10;

      pack = abi.encodePacked(
        pack,
        '<polygon points="',
        _seeds[i][0][0], ' ', _seeds[i][0][1], ', ',
        _seeds[i][1][0], ' ', _seeds[i][1][1], ', ',
        _seeds[i][2][0], ' ', _seeds[i][2][1], '" ',
        'fill="',
        _colors[_colorsIndex],
        '" />\n'
      );
    }
    return pack;
  }

  function _randomValue(uint256 base, uint256 nonce) internal pure returns (uint256) {
     return uint256(keccak256(abi.encodePacked(base, nonce)));
  }

  /**
   * @notice Set the founders.
     * @dev Only callable by the founders when not locked.
     */
  function setFounders(address _founders) external override onlyFounders {
    founders = _founders;

    emit FoundersUpdated(_founders);
  }

  /**
   * @notice Set the token minter.
     * @dev Only callable by the owner when not locked.
     */
  function setMinter(address _minter) external override onlyOwner whenMinterNotLocked {
    minter = _minter;

    emit MinterUpdated(_minter);
  }

  /**
   * @notice Lock the minter.
     * @dev This cannot be reversed and is only callable by the owner when not locked.
     */
  function lockMinter() external override onlyOwner whenMinterNotLocked {
    isMinterLocked = true;

    emit MinterLocked();
  }
}
