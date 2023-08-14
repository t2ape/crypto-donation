// SPDX-License-Identifier: GPL-3.0

/// @title The Heart ERC-721 token

pragma solidity ^0.8.19;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721} from "../../base/ERC721.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IProxyRegistry} from "../../external/opensea/IProxyRegistry.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Base64} from "base64-sol/base64.sol";

contract HeartToken is Ownable, IERC721, ERC721 {
  using Strings for uint256;

  event TokenCreated(uint256 indexed tokenId);

  event TokenBurned(uint256 indexed tokenId);

  event FoundersUpdated(address founders);

  event MintersAdded(address minter);

  event MintersDeleted(address minter);

  event MintersLocked();

  // The founders address (creators org)
  address public founders;

  // An address who has permissions to mint token
  address[] public minters;

  // Whether the minter can be updated
  bool public isMintersLocked;

  // The internal token ID tracker
  uint256 private _currentTokenId;

  // OpenSea's Proxy Registry
  IProxyRegistry public immutable PROXY_REGISTRY;

  /**
   * @notice Require that the minters have not been locked.
   */
  modifier whenMintersNotLocked() {
    require(!isMintersLocked, "Minters are locked");
    _;
  }

  /**
   * @notice Require that the sender is a minter.
   */
  modifier onlyMinter() {
    require(msgSenderIsMinter(), "Sender is not a minter");
    _;
  }

  /**
   * @notice Require that the sender is the founders.
   */
  modifier onlyFounders() {
    require(msg.sender == founders, "Sender is not the founders");
    _;
  }

  constructor(
    address _founders,
    IProxyRegistry _proxyRegistry
  ) ERC721("Heart", "HEART") {
    founders = _founders;
    PROXY_REGISTRY = _proxyRegistry;
  }

  function msgSenderIsMinter() private view returns (bool) {
    for (uint256 i = 0; i < minters.length; i++) {
      if (minters[i] == msg.sender) {
        return true;
      }
    }

    return false;
  }

  /**
   * @notice Override isApprovedForAll to whitelist user's OpenSea proxy accounts to enable gas-less listings.
   */
  function isApprovedForAll(
    address owner,
    address operator
  ) public view override(IERC721, ERC721) returns (bool) {
    // Whitelist OpenSea proxy contract for easy trading.
    if (PROXY_REGISTRY.proxies(owner) == operator) {
      return true;
    }

    return super.isApprovedForAll(owner, operator);
  }

  /**
   * @notice Mint a token to the address passed as argument "to",
   * along with a possible founders reward token.
   * Founders reward tokens are minted every 10 token.
   */
  function mint(address to) public onlyMinter {
    if (_currentTokenId % 10 == 0) {
      _mint(owner(), founders, _currentTokenId++); // solhint-disable-line func-named-parameters
      emit TokenCreated(_currentTokenId);
    }
    _mint(owner(), to, _currentTokenId++); // solhint-disable-line func-named-parameters
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
  function tokenURI(
    uint256 tokenId
  ) public view override returns (string memory) {
    require(_exists(tokenId), "URI query for nonexistent token");
    return dataURI(tokenId);
  }

  /**
   * @notice Similar to `tokenURI`, but always serves a base64 encoded data URI
   * with the JSON contents directly inlined.
   */
  function dataURI(uint256 tokenId) public view returns (string memory) {
    require(_exists(tokenId), "URI query for nonexistent token");

    string memory tokenIdStringified = tokenId.toString();
    string memory name = string(
      abi.encodePacked("Heart Token #", tokenIdStringified)
    );
    string memory image = Base64.encode(_generateSVG(tokenId));
    return
      string(
        abi.encodePacked(
          "data:application/json;base64,",
          Base64.encode(
            bytes(
              abi.encodePacked( // solhint-disable-line func-named-parameters
                  '{"name":"', // solhint-disable-line quotes
                  name,
                  '", "image": "', // solhint-disable-line quotes
                  "data:image/svg+xml;base64,",
                  image,
                  '"}' // solhint-disable-line quotes
                )
            )
          )
        )
      );
  }

  function _generateSVG(uint256 tokenId) internal pure returns (bytes memory) {
    uint256[2][16] memory fPoints = [
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
    uint256[2][14] memory rPoints = [
      [
        (_randomValue(tokenId, nonce++) % 180) + 180,
        (_randomValue(tokenId, nonce++) % 180) + 180
      ],
      [
        (_randomValue(tokenId, nonce++) % 180) + 360,
        (_randomValue(tokenId, nonce++) % 180) + 180
      ],
      [
        (_randomValue(tokenId, nonce++) % 180) + 540,
        (_randomValue(tokenId, nonce++) % 180) + 180
      ],
      [
        (_randomValue(tokenId, nonce++) % 180) + 720,
        (_randomValue(tokenId, nonce++) % 180) + 180
      ],
      [
        (_randomValue(tokenId, nonce++) % 180) + 180,
        (_randomValue(tokenId, nonce++) % 180) + 360
      ],
      [
        (_randomValue(tokenId, nonce++) % 180) + 360,
        (_randomValue(tokenId, nonce++) % 180) + 360
      ],
      [
        (_randomValue(tokenId, nonce++) % 180) + 540,
        (_randomValue(tokenId, nonce++) % 180) + 360
      ],
      [
        (_randomValue(tokenId, nonce++) % 180) + 720,
        (_randomValue(tokenId, nonce++) % 180) + 360
      ],
      [
        (_randomValue(tokenId, nonce++) % 180) + 180,
        (_randomValue(tokenId, nonce++) % 180) + 540
      ],
      [
        (_randomValue(tokenId, nonce++) % 180) + 360,
        (_randomValue(tokenId, nonce++) % 180) + 540
      ],
      [
        (_randomValue(tokenId, nonce++) % 180) + 540,
        (_randomValue(tokenId, nonce++) % 180) + 540
      ],
      [
        (_randomValue(tokenId, nonce++) % 180) + 720,
        (_randomValue(tokenId, nonce++) % 180) + 540
      ],
      [
        (_randomValue(tokenId, nonce++) % 180) + 360,
        (_randomValue(tokenId, nonce++) % 180) + 720
      ],
      [
        (_randomValue(tokenId, nonce++) % 180) + 540,
        (_randomValue(tokenId, nonce++) % 180) + 720
      ]
    ];

    uint256[2][3][42] memory seeds = [
      [fPoints[4], fPoints[0], rPoints[0]], // uppermost part
      [fPoints[0], rPoints[0], fPoints[2]], // uppermost part
      [rPoints[0], fPoints[2], rPoints[1]], // uppermost part
      [fPoints[2], rPoints[1], fPoints[5]], // uppermost part
      [rPoints[1], fPoints[5], rPoints[2]], // uppermost part
      [fPoints[5], rPoints[2], fPoints[3]], // uppermost part
      [rPoints[2], fPoints[3], rPoints[3]], // uppermost part
      [fPoints[3], rPoints[3], fPoints[1]], // uppermost part
      [rPoints[3], fPoints[1], fPoints[6]], // uppermost part
      [fPoints[4], fPoints[7], rPoints[0]], // upper left part
      [fPoints[7], rPoints[0], rPoints[4]], // upper left part
      [rPoints[0], rPoints[4], rPoints[1]], // upper left part
      [rPoints[4], rPoints[1], rPoints[5]], // upper left part
      [rPoints[1], rPoints[5], rPoints[6]], // upper left part
      [rPoints[1], rPoints[6], rPoints[2]], // upper right part
      [rPoints[6], rPoints[2], rPoints[7]], // upper right part
      [rPoints[2], rPoints[7], rPoints[3]], // upper right part
      [rPoints[7], rPoints[3], fPoints[8]], // upper right part
      [rPoints[3], fPoints[8], fPoints[6]], // upper right part
      [fPoints[7], fPoints[9], rPoints[4]], // middle left part
      [fPoints[9], rPoints[4], fPoints[11]], // middle left part
      [rPoints[4], fPoints[11], rPoints[8]], // middle left part
      [fPoints[11], rPoints[8], rPoints[12]], // middle left part
      [rPoints[4], rPoints[8], rPoints[5]], // middle center left part
      [rPoints[8], rPoints[5], rPoints[9]], // middle center left part
      [rPoints[5], rPoints[9], rPoints[10]], // middle center left part
      [rPoints[5], rPoints[10], rPoints[6]], // middle center right part
      [rPoints[10], rPoints[6], rPoints[11]], // middle center right part
      [rPoints[6], rPoints[11], rPoints[7]], // middle center right part
      [rPoints[13], rPoints[11], fPoints[12]], // middle right part
      [rPoints[11], fPoints[12], rPoints[7]], // middle right part
      [fPoints[12], rPoints[7], fPoints[10]], // middle right part
      [rPoints[7], fPoints[10], fPoints[8]], // middle right part
      [rPoints[8], rPoints[12], rPoints[9]], // lower part
      [rPoints[12], rPoints[9], rPoints[13]], // lower part
      [rPoints[9], rPoints[13], rPoints[10]], // lower part
      [rPoints[13], rPoints[10], rPoints[11]], // lower part
      [fPoints[11], fPoints[13], rPoints[12]], // lowest part
      [fPoints[13], rPoints[12], fPoints[15]], // lowest part
      [rPoints[12], fPoints[15], rPoints[13]], // lowest part
      [fPoints[15], rPoints[13], fPoints[14]], // lowest part
      [rPoints[13], fPoints[14], fPoints[12]] // lowest part
    ];

    uint256 seed = _randomValue(tokenId, nonce++);
    string[10] memory colors;
    if (seed % 10 == 0) {
      // rainbow style
      colors = [
        "#FF595E",
        "#FF924C",
        "#FFCA3A",
        "#C5CA30",
        "#8AC926",
        "#36949D",
        "#1982C4",
        "#4267AC",
        "#565AA0",
        "#6A4C93"
      ];
    } else if (seed % 10 == 1) {
      // luxury style
      colors = [
        "#F8F3E6",
        "#F8F3E6",
        "#E7CC8F",
        "#E7CC8F",
        "#EFAA52",
        "#EFAA52",
        "#AB3E16",
        "#AB3E16",
        "#48120E",
        "#48120E"
      ];
    } else if (seed % 10 == 2) {
      // sweet style
      colors = [
        "#4BBCF4",
        "#4BBCF4",
        "#61C0BF",
        "#61C0BF",
        "#BBDED6",
        "#BBDED6",
        "#FFB6B9",
        "#FFB6B9",
        "#FAE3D9",
        "#FAE3D9"
      ];
    } else if (seed % 10 == 3) {
      // tropical style
      colors = [
        "#F5AB99",
        "#F5AB99",
        "#FEB47B",
        "#FEB47B",
        "#FF7E5F",
        "#FF7E5F",
        "#765285",
        "#765285",
        "#351C4D",
        "#351C4D"
      ];
    } else if (seed % 10 == 4 || seed % 10 == 5) {
      // green style
      colors = [
        "#006400",
        "#006400",
        "#007200",
        "#007200",
        "#008000",
        "#008000",
        "#38B000",
        "#38B000",
        "#70E000",
        "#70E000"
      ];
    } else if (seed % 10 == 6 || seed % 10 == 7) {
      // blue style
      colors = [
        "#EDFAFD",
        "#EDFAFD",
        "#AFD9DA",
        "#AFD9DA",
        "#3DDAD7",
        "#3DDAD7",
        "#2A93D5",
        "#2A93D5",
        "#135589",
        "#135589"
      ];
    } else {
      // red style
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

    bytes memory image = _generateImage(tokenId, seeds, colors); // solhint-disable-line func-named-parameters

    return
      abi.encodePacked( // solhint-disable-line func-named-parameters
          // solhint-disable-next-line quotes
          '<svg width="1080" height="1080" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">\n',
          '<rect width="1080" height="1080" fill="#F8F3E6" />',
          image,
          "</svg>"
        );
  }

  function _generateImage(
    uint256 tokenId,
    uint256[2][3][42] memory _seeds,
    string[10] memory _colors
  ) internal pure returns (bytes memory) {
    bytes memory pack;
    uint256[2][3] memory seedValues;

    for (uint256 i = 0; i < _seeds.length; i++) {
      uint256 _colorsIndex = _randomValue(tokenId, i) % 10;

      // update seedValues
      for (uint256 j = 0; j < 3; j++) {
        for (uint256 k = 0; k < 2; k++) {
          seedValues[j][k] = _seeds[i][j][k];
        }
      }

      pack = abi.encodePacked(
        pack,
        _buildPolygon(seedValues, _colors[_colorsIndex])
      );
    }
    return pack;
  }

  function _buildPolygon(
    uint256[2][3] memory seedValues,
    string memory color
  ) internal pure returns (bytes memory) {
    bytes memory pack;

    pack = abi.encodePacked( // solhint-disable-line func-named-parameters
        '<polygon points="', // solhint-disable-line quotes
        seedValues[0][0].toString(),
        " ",
        seedValues[0][1].toString(),
        ", "
      );
    pack = abi.encodePacked( // solhint-disable-line func-named-parameters
        pack,
        seedValues[1][0].toString(),
        " ",
        seedValues[1][1].toString(),
        ", "
      );
    pack = abi.encodePacked( // solhint-disable-line func-named-parameters
        pack,
        seedValues[2][0].toString(),
        " ",
        seedValues[2][1].toString(),
        '" ', // solhint-disable-line quotes
        'fill="', // solhint-disable-line quotes
        color,
        '" />\n' // solhint-disable-line quotes
      );

    return pack;
  }

  function _randomValue(
    uint256 base,
    uint256 nonce
  ) internal pure returns (uint256) {
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
   * @notice Add a token minter.
   * @dev Only callable by the owner when not locked.
   */
  function addMinter(address _minter) external onlyOwner whenMintersNotLocked {
    minters.push(_minter);

    emit MintersAdded(_minter);
  }

  /**
   * @notice Delete a token minter.
   * @dev Only callable by the owner when not locked.
   */
  function deleteMinter(
    address _minter
  ) external onlyOwner whenMintersNotLocked {
    for (uint256 i = 0; i < minters.length; i++) {
      if (minters[i] == _minter) {
        // Delete does not change the array length.
        // It resets the value at index to it's default value,
        // in this case address(0)
        delete minters[i];

        emit MintersDeleted(_minter);
      }
    }
  }

  /**
   * @notice Lock the minters.
   * @dev This cannot be reversed and is only callable by the owner when not locked.
   */
  function lockMinters() external onlyOwner whenMintersNotLocked {
    isMintersLocked = true;

    emit MintersLocked();
  }
}
