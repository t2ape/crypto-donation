// SPDX-License-Identifier: GPL-3.0

/// @title The Heart ERC-721 token

pragma solidity ^0.8.19;

import { Ownable } from '@openzeppelin/contracts/access/Ownable.sol';
import { ERC721 } from '../../base/ERC721.sol';
import { IERC721 } from '@openzeppelin/contracts/token/ERC721/IERC721.sol';
//  TODO: opensea について調べたら proxyRegistry を用いる形に修正
//import { IProxyRegistry } from '../../external/opensea/IProxyRegistry.sol';
import "@openzeppelin/contracts/utils/Strings.sol";
import { Base64 } from 'base64-sol/base64.sol';

contract HeartToken is Ownable, IERC721, ERC721 {
  using Strings for uint256;

  event TokenCreated(uint256 indexed tokenId);

  event TokenBurned(uint256 indexed tokenId);

  event FoundersUpdated(address founders);

  event MinterUpdated(address minter);

  event MinterLocked();

  // The founders address (creators org)
  address public founders;

  // An address who has permissions to mint token
  address public minter;

  // Whether the minter can be updated
  bool public isMinterLocked;

  // The internal token ID tracker
  uint256 private _currentTokenId;

  //  TODO: opensea について調べたら proxyRegistry を用いる形に修正
  //  // OpenSea's Proxy Registry
  //  IProxyRegistry public immutable proxyRegistry;

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
//    IProxyRegistry _proxyRegistry
//  ) ERC721('Heart', 'HEART') {
//    founders = _founders;
//    proxyRegistry = _proxyRegistry;
//  }

  constructor(
    address _founders
  ) ERC721('Heart', 'HEART') {
    founders = _founders;
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
  function mint() public onlyMinter {
    if (_currentTokenId % 10 == 0) {
      _mint(owner(), founders, _currentTokenId++);
      emit TokenCreated(_currentTokenId);
    }
    _mint(owner(), minter, _currentTokenId++);
    emit TokenCreated(_currentTokenId);
  }

  /**
   * @notice Burn a token.
     */
  function burn(uint256 tokenID) public onlyMinter {
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
  function dataURI(uint256 tokenId) public view returns (string memory) {
    require(_exists(tokenId), 'URI query for nonexistent token');

    string memory tokenIdStringified = tokenId.toString();
    string memory name = string(abi.encodePacked('Heart Token #', tokenIdStringified));
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
    uint256[2][16] memory f_points = [
      [uint256(270), uint256(45)],
      [uint256(810), uint256(45)],
      [uint256(450), uint256(90)],
      [uint256(630), uint256(90)],
      [uint256(90), uint256(180)],
      [uint256(540), uint256(180)],
      [uint256(990), uint256(180)],
      [uint256(0), uint256(360)],
      [uint256(1080), uint256(360)],
      [uint256(90), uint256(585)],
      [uint256(990), uint256(585)],
      [uint256(180), uint256(720)],
      [uint256(900), uint256(720)],
      [uint256(360), uint256(900)],
      [uint256(720), uint256(900)],
      [uint256(540), uint256(1080)]
    ];

    uint256 nonce = 0;
    uint256[2][14] memory r_points = [
      [_randomValue(tokenId, nonce++) % 180 + 180, _randomValue(tokenId, nonce++) % 180 + 180],
      [_randomValue(tokenId, nonce++) % 180 + 360, _randomValue(tokenId, nonce++) % 180 + 180],
      [_randomValue(tokenId, nonce++) % 180 + 540, _randomValue(tokenId, nonce++) % 180 + 180],
      [_randomValue(tokenId, nonce++) % 180 + 720, _randomValue(tokenId, nonce++) % 180 + 180],
      [_randomValue(tokenId, nonce++) % 180 + 180, _randomValue(tokenId, nonce++) % 180 + 360],
      [_randomValue(tokenId, nonce++) % 180 + 360, _randomValue(tokenId, nonce++) % 180 + 360],
      [_randomValue(tokenId, nonce++) % 180 + 540, _randomValue(tokenId, nonce++) % 180 + 360],
      [_randomValue(tokenId, nonce++) % 180 + 720, _randomValue(tokenId, nonce++) % 180 + 360],
      [_randomValue(tokenId, nonce++) % 180 + 180, _randomValue(tokenId, nonce++) % 180 + 540],
      [_randomValue(tokenId, nonce++) % 180 + 360, _randomValue(tokenId, nonce++) % 180 + 540],
      [_randomValue(tokenId, nonce++) % 180 + 540, _randomValue(tokenId, nonce++) % 180 + 540],
      [_randomValue(tokenId, nonce++) % 180 + 720, _randomValue(tokenId, nonce++) % 180 + 540],
      [_randomValue(tokenId, nonce++) % 180 + 360, _randomValue(tokenId, nonce++) % 180 + 720],
      [_randomValue(tokenId, nonce++) % 180 + 540, _randomValue(tokenId, nonce++) % 180 + 720]
    ];

    uint256[2][3][42] memory seeds = [
      [f_points[4], f_points[0], r_points[0]], // uppermost part
      [f_points[0], r_points[0], f_points[2]], // uppermost part
      [r_points[0], f_points[2], r_points[1]], // uppermost part
      [f_points[2], r_points[1], f_points[5]], // uppermost part
      [r_points[1], f_points[5], r_points[2]], // uppermost part
      [f_points[5], r_points[2], f_points[3]], // uppermost part
      [r_points[2], f_points[3], r_points[3]], // uppermost part
      [f_points[3], r_points[3], f_points[1]], // uppermost part
      [r_points[3], f_points[1], f_points[6]], // uppermost part
      [f_points[4], f_points[7], r_points[0]], // upper left part
      [f_points[7], r_points[0], r_points[4]], // upper left part
      [r_points[0], r_points[4], r_points[1]], // upper left part
      [r_points[4], r_points[1], r_points[5]], // upper left part
      [r_points[1], r_points[5], r_points[6]], // upper left part
      [r_points[1], r_points[6], r_points[2]], // upper right part
      [r_points[6], r_points[2], r_points[7]], // upper right part
      [r_points[2], r_points[7], r_points[3]], // upper right part
      [r_points[7], r_points[3], f_points[8]], // upper right part
      [r_points[3], f_points[8], f_points[6]], // upper right part
      [f_points[7], f_points[9], r_points[4]], // middle left part
      [f_points[9], r_points[4], f_points[11]], // middle left part
      [r_points[4], f_points[11], r_points[8]], // middle left part
      [f_points[11], r_points[8], r_points[12]], // middle left part
      [r_points[4], r_points[8], r_points[5]], // middle center left part
      [r_points[8], r_points[5], r_points[9]], // middle center left part
      [r_points[5], r_points[9], r_points[10]], // middle center left part
      [r_points[5], r_points[10], r_points[6]], // middle center right part
      [r_points[10], r_points[6], r_points[11]], // middle center right part
      [r_points[6], r_points[11], r_points[7]], // middle center right part
      [r_points[13], r_points[11], f_points[12]], // middle right part
      [r_points[11], f_points[12], r_points[7]], // middle right part
      [f_points[12], r_points[7], f_points[10]], // middle right part
      [r_points[7], f_points[10], f_points[8]], // middle right part
      [r_points[8], r_points[12], r_points[9]], // lower part
      [r_points[12], r_points[9], r_points[13]], // lower part
      [r_points[9], r_points[13], r_points[10]], // lower part
      [r_points[13], r_points[10], r_points[11]], // lower part
      [f_points[11], f_points[13], r_points[12]], // lowest part
      [f_points[13], r_points[12], f_points[15]], // lowest part
      [r_points[12], f_points[15], r_points[13]], // lowest part
      [f_points[15], r_points[13], f_points[14]], // lowest part
      [r_points[13], f_points[14], f_points[12]] // lowest part
    ];

    uint256 seed = _randomValue(tokenId, nonce++);
    string[10] memory colors;
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
      colors = [
        "#E6B8C2",
        "#E6B8C2",
        "#E68A9E",
        "#E68A9E",
        "#E65C7A",
        "#E65C7A",
        "#E62E56",
        "#E62E56",
        "#E60033",
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

  function _generateImage(uint256 tokenId, uint256[2][3][42] memory _seeds, string[10] memory _colors) internal pure returns(bytes memory) {
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
  function setFounders(address _founders) external onlyFounders {
    founders = _founders;

    emit FoundersUpdated(_founders);
  }

  /**
   * @notice Set the token minter.
     * @dev Only callable by the owner when not locked.
     */
  function setMinter(address _minter) external onlyOwner whenMinterNotLocked {
    minter = _minter;

    emit MinterUpdated(_minter);
  }

  /**
   * @notice Lock the minter.
     * @dev This cannot be reversed and is only callable by the owner when not locked.
     */
  function lockMinter() external onlyOwner whenMinterNotLocked {
    isMinterLocked = true;

    emit MinterLocked();
  }
}
