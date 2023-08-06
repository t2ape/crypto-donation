pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract FundraiserStorage is Ownable {
  address[] private _accessPermittedContracts;

  mapping(address => bool) private _accessPermissions;

  mapping(bytes32 => address) addressStorage;
  mapping(bytes32 => address[]) addressArrayStorage;
  mapping(bytes32 => bool) boolStorage;
  mapping(bytes32 => bytes) bytesStorage;
  mapping(bytes32 => int) intStorage;
  mapping(bytes32 => uint) uintStorage;
  mapping(bytes32 => string) stringStorage;

  modifier onlyAccessPermittedContract() {
    require(msgSenderIsAccessPermittedContract());
    _;
  }

  function msgSenderIsAccessPermittedContract() private view returns (bool) {
    for (uint256 i = 0; i < _accessPermittedContracts.length; i++) {
      if (_accessPermittedContracts[i] == msg.sender) {
        return true;
      }
    }

    return false;
  }

  function addAccessPermittedContract(address _contract) public onlyOwner {
    _accessPermittedContracts.push(_contract);
  }

  function removeAccessPermittedContract(address _contract) public onlyOwner {
    for (uint256 i = 0; i < _accessPermittedContracts.length; i++) {
      if (_accessPermittedContracts[i] == _contract) {
        // Delete does not change the array length.
        // It resets the value at index to it's default value,
        // in this case address(0)
        delete _accessPermittedContracts[i];
      }
    }
  }

  // *** Getter Methods ***

  function getAddress(bytes32 _key) external view returns (address) {
    return addressStorage[_key];
  }

  function getAddressArray(
    bytes32 _key
  ) external view returns (address[] memory) {
    return addressArrayStorage[_key];
  }

  function getBool(bytes32 _key) external view returns (bool) {
    return boolStorage[_key];
  }

  function getBytes(bytes32 _key) external view returns (bytes memory) {
    return bytesStorage[_key];
  }

  function getInt(bytes32 _key) external view returns (int) {
    return intStorage[_key];
  }

  function getUint(bytes32 _key) external view returns (uint) {
    return uintStorage[_key];
  }

  function getString(bytes32 _key) external view returns (string memory) {
    return stringStorage[_key];
  }

  // *** Setter Methods ***

  function setAddress(
    bytes32 _key,
    address _value
  ) external onlyAccessPermittedContract {
    addressStorage[_key] = _value;
  }

  function setAddressArray(
    bytes32 _key,
    address[] memory _values
  ) external onlyAccessPermittedContract {
    addressArrayStorage[_key] = _values;
  }

  function setBool(
    bytes32 _key,
    bool _value
  ) external onlyAccessPermittedContract {
    boolStorage[_key] = _value;
  }

  function setBytes(
    bytes32 _key,
    bytes calldata _value
  ) external onlyAccessPermittedContract {
    bytesStorage[_key] = _value;
  }

  function setInt(
    bytes32 _key,
    int _value
  ) external onlyAccessPermittedContract {
    intStorage[_key] = _value;
  }

  function setUint(
    bytes32 _key,
    uint _value
  ) external onlyAccessPermittedContract {
    uintStorage[_key] = _value;
  }

  function setString(
    bytes32 _key,
    string calldata _value
  ) external onlyAccessPermittedContract {
    stringStorage[_key] = _value;
  }

  // *** Delete Methods ***

  function deleteAddress(bytes32 _key) external onlyAccessPermittedContract {
    delete addressStorage[_key];
  }

  function deleteAddress(bytes32 _key) external onlyAccessPermittedContract {
    delete addressArrayStorage[_key];
  }

  function deleteBool(bytes32 _key) external onlyAccessPermittedContract {
    delete boolStorage[_key];
  }

  function deleteBytes(bytes32 _key) external onlyAccessPermittedContract {
    delete bytesStorage[_key];
  }

  function deleteInt(bytes32 _key) external onlyAccessPermittedContract {
    delete intStorage[_key];
  }

  function deleteUint(bytes32 _key) external onlyAccessPermittedContract {
    delete uintStorage[_key];
  }

  function deleteString(bytes32 _key) external onlyAccessPermittedContract {
    delete stringStorage[_key];
  }
}
