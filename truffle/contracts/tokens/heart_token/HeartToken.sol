// SPDX-License-Identifier: GPL-3.0

/// @title The Heart ERC-721 token

// TODO: 全体的に、override は Interface の存在を前提とした記述かもなので不要であれば削除する

pragma solidity ^0.8.19;

import { Ownable } from '@openzeppelin/contracts/access/Ownable.sol';
import { ERC721 } from './base/ERC721.sol';
import { IERC721 } from '@openzeppelin/contracts/token/ERC721/IERC721.sol';
// TODO: 追加
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

  constructor(
    address _founders,
    address _minter,
    IProxyRegistry _proxyRegistry
  ) ERC721('Heart', 'HEART') {
    founders = _founders;
    minter = _minter;
    proxyRegistry = _proxyRegistry;
  }

  /**
   * @notice Override isApprovedForAll to whitelist user's OpenSea proxy accounts to enable gas-less listings.
     */
  function isApprovedForAll(address owner, address operator) public view override(IERC721, ERC721) returns (bool) {
    // Whitelist OpenSea proxy contract for easy trading.
    if (proxyRegistry.proxies(owner) == operator) {
      return true;
    }
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
    uint256 randomNonce = 0;
    uint256 seed = _randomValue(tokenId, randomNonce);
    uint256[14] seeds = [
      _randomValue(tokenId, randomNonce++) % 180 + 180, _randomValue(tokenId, randomNonce++) % 180 + 180,
      _randomValue(tokenId, randomNonce++) % 180 + 360, _randomValue(tokenId, randomNonce++) % 180 + 180,
      _randomValue(tokenId, randomNonce++) % 180 + 540, _randomValue(tokenId, randomNonce++) % 180 + 180,
      _randomValue(tokenId, randomNonce++) % 180 + 720, _randomValue(tokenId, randomNonce++) % 180 + 180,
      _randomValue(tokenId, randomNonce++) % 180 + 180, _randomValue(tokenId, randomNonce++) % 180 + 360,
      _randomValue(tokenId, randomNonce++) % 180 + 360, _randomValue(tokenId, randomNonce++) % 180 + 360,
      _randomValue(tokenId, randomNonce++) % 180 + 540, _randomValue(tokenId, randomNonce++) % 180 + 360,
      _randomValue(tokenId, randomNonce++) % 180 + 720, _randomValue(tokenId, randomNonce++) % 180 + 360,
      _randomValue(tokenId, randomNonce++) % 180 + 180, _randomValue(tokenId, randomNonce++) % 180 + 540,
      _randomValue(tokenId, randomNonce++) % 180 + 360, _randomValue(tokenId, randomNonce++) % 180 + 540,
      _randomValue(tokenId, randomNonce++) % 180 + 540, _randomValue(tokenId, randomNonce++) % 180 + 540,
      _randomValue(tokenId, randomNonce++) % 180 + 720, _randomValue(tokenId, randomNonce++) % 180 + 540,
      _randomValue(tokenId, randomNonce++) % 180 + 360, _randomValue(tokenId, randomNonce++) % 180 + 720,
      _randomValue(tokenId, randomNonce++) % 180 + 540, _randomValue(tokenId, randomNonce++) % 180 + 720
    ];

    if (seed % 10 == 0) {
      string[10] colors = [
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
      string[6] colors = [
        "#E60033",
        "#E6B8C2",
        "#E68A9E",
        "#E65C7A",
        "#E62E56",
        "#E60033"
      ];
    }

    bytes memory image = _generateImage(seeds, colors);

    return abi.encodePacked(
      '<svg width="1080" height="1080" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">\n',
      image,
      '</svg>'
    );
  }

  function _generateImage(uint256 tokenId, uint256[] _seeds, string[] _colors, uint256 _colorsLength) internal pure returns(bytes memory) {
    bytes memory pack;
    uint256 i;
    for (i = 0; i < _seeds.length - 6; i++) {
      uint256 _colorsIndex = _randomValue(tokenId, i) % _colorsLength;

      pack = abi.encodePacked(
        pack,
        '<polygon points="',
        _seeds[i], ' ', _seeds[i + 1], ', ',
        _seeds[i + 2], ' ', _seeds[i + 3], ', ',
        _seeds[i + 4], ' ', _seeds[i + 5], '"',
        'fill="',
        _colors[_colorsIndex],
        '/>\n'
      );
    }
    return pack;
  }

  function _randomValue(uint256 base, uint256 randomNonce) internal pure returns (uint256) {
     return uint256(keccak256(abi.encodePacked(base, randomNonce, block.timestamp)));
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
