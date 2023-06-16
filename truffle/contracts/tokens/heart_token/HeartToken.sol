// SPDX-License-Identifier: GPL-3.0

/// @title The Heart ERC-721 token

pragma solidity ^0.8.19;

import { Ownable } from '@openzeppelin/contracts/access/Ownable.sol';
import { IHeartToken } from './interfaces/IHeartToken.sol';
import { ERC721 } from './base/ERC721.sol';
import { IERC721 } from '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import { IProxyRegistry } from './external/opensea/IProxyRegistry.sol';

contract HeartToken is Ownable {
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
     * @dev Call _mintTo with the to address(es).
     */
  function mint() public override onlyMinter returns (uint256) {
    if (_currentTokenId % 10 == 0) {
      _mintTo(founders, _currentTokenId++);
    }
    return _mintTo(minter, _currentTokenId++);
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
    return tokenURI(tokenId, seeds[tokenId]);
  }

  /**
   * @notice Similar to `tokenURI`, but always serves a base64 encoded data URI
     * with the JSON contents directly inlined.
     */
  function dataURI(uint256 tokenId) public view override returns (string memory) {
    require(_exists(tokenId), 'URI query for nonexistent token');
    return dataURI(tokenId, seeds[tokenId]);
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

  /**
   * @notice Mint a Token with `tokenID` to the provided `to` address.
     */
  function _mintTo(address to, uint256 tokenID) internal returns (uint256) {
    // TODO: generate seed
    // ITokenSeeder.Seed memory seed = seeds[tokenID] = seeder.generateSeed(tokenID, descriptor);

    _mint(owner(), to, tokenID);
    emit TokenCreated(tokenID, seed);

    return tokenID;
  }
}
