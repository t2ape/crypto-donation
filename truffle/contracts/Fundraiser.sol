pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Fundraiser is Ownable {
  // TODO: 寄付に紐付く団体を考慮する

  string public name;
  string public description;
  string public url;
  string public imageUrl;
  uint256 public startedAt;
  uint256 public endedAt;
  uint256 public deletedAt;
  uint256 public donationsAmount;
  uint256 public donationsCount;
  address payable public beneficiary;
  bool public is_open;

  constructor(
    string memory _name,
    string memory _description,
    string memory _url,
    string memory _imageUrl,
    uint256 _startedAt,
    uint256 _endedAt,
    uint256 _donationsAmount,
    uint256 _donationsCount,
    address payable _beneficiary,
    bool _is_open,
    address _custodian
  ) {
    name = _name;
    description = _description;
    url = _url;
    imageUrl = _imageUrl;
    startedAt = _startedAt;
    endedAt = _endedAt;
    donationsAmount = _donationsAmount;
    donationsCount = _donationsCount;
    beneficiary = _beneficiary;
    is_open = _is_open;
    // TODO: 寄付に紐付く団体を考慮した段階で変更が必要になるはず
    // コントラクトのオーナーではなく寄付対象の管理者 (寄付対象の作成者) をオーナーとしたい
    transferOwnership(_custodian);
  }

  function updateFundraiser(
    string memory _name, // 必須
    string memory _description, // 必須
    string memory _url, // 任意
    string memory _imageUrl, // 任意
    uint256 _startedAt, // 任意
    uint256 _endedAt, // 任意
    address payable _beneficiary, // 必須
    bool _is_open // 必須
  ) public {
    // validations
    require(bytes(name).length > 0 && bytes(name).length <= 400, "name length is invalid.");
    require(bytes(description).length > 0 && bytes(description).length <= 4000, "description length is invalid.");
    require(bytes(url).length >= 0 && bytes(url).length <= 4000, "url length is invalid.");
    require(bytes(imageUrl).length >= 0 && bytes(imageUrl).length <= 4000, "imageUrl length is invalid.");
    require(beneficiary != address(0), "beneficiary format is invalid.");

    name = _name;
    description = _description;
    url = _url;
    imageUrl = _imageUrl;
    startedAt = _startedAt;
    endedAt = _endedAt;
    beneficiary = _beneficiary;
    is_open = _is_open;
  }

  function deleteFundraiser() public {
    deletedAt = block.timestamp;
  }
}
