pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract FundraiserStorage is Ownable {
  address[] private _accessPermittedContracts;
  mapping(address => bool) private _accessPermissions;
  mapping(bytes32 => uint) uIntStorage;
  mapping(bytes32 => string) stringStorage;
  mapping(bytes32 => address) addressStorage;
  mapping(bytes32 => bytes) bytesStorage;
  mapping(bytes32 => bool) boolStorage;
  mapping(bytes32 => int) intStorage;

  modifier onlyAccessPermittedContract() {
    require(msgSenderIsAccessPermittedContract);
    _;
  }

  function msgSenderIsAccessPermittedContract() {
    for(uint256 i = 0; i < _accessPermittedContracts.length; i++) {
      if(_accessPermittedContracts[i] == msg.sender) {
        return true;
      }
    }

    return false;
  }

  function setAccessPermittedContract(address _contract) public onlyOwner {
    _accessPermittedContracts.push(_contract);
  }

  function deleteAccessPermittedContract(address _contract) public onlyOwner {
    for(uint256 i = 0; i < _accessPermittedContracts.length; i++) {
      if(_accessPermittedContracts[i] == _contract) {
        // Delete does not change the array length.
        // It resets the value at index to it's default value,
        // in this case address(0)
        delete _accessPermittedContracts[i];
      }
    }
  }

  // *** Getter Methods ***
  function getUint(bytes32 _key) external view returns(uint) {
    return uIntStorage[_key];
  }

  function getString(bytes32 _key) external view returns(string) {
    return stringStorage[_key];
  }

  function getAddress(bytes32 _key) external view returns(address) {
    return addressStorage[_key];
  }

  function getBytes(bytes32 _key) external view returns(bytes) {
    return bytesStorage[_key];
  }

  function getBool(bytes32 _key) external view returns(bool) {
    return boolStorage[_key];
  }

  function getInt(bytes32 _key) external view returns(int) {
    return intStorage[_key];
  }

  // *** Setter Methods ***
  function setUint(bytes32 _key, uint _value) onlyAccessPermittedContract external {
    uIntStorage[_key] = _value;
  }

  function setString(bytes32 _key, string _value) onlyAccessPermittedContract external {
    stringStorage[_key] = _value;
  }

  function setAddress(bytes32 _key, address _value) onlyAccessPermittedContract external {
    addressStorage[_key] = _value;
  }

  function setBytes(bytes32 _key, bytes _value) onlyAccessPermittedContract external {
    bytesStorage[_key] = _value;
  }

  function setBool(bytes32 _key, bool _value) onlyAccessPermittedContract external {
    boolStorage[_key] = _value;
  }

  function setInt(bytes32 _key, int _value) onlyAccessPermittedContract external {
    intStorage[_key] = _value;
  }

  // *** Delete Methods ***
  function deleteUint(bytes32 _key) onlyAccessPermittedContract external {
    delete uIntStorage[_key];
  }

  function deleteString(bytes32 _key) onlyAccessPermittedContract external {
    delete stringStorage[_key];
  }

  function deleteAddress(bytes32 _key) onlyAccessPermittedContract external {
    delete addressStorage[_key];
  }

  function deleteBytes(bytes32 _key) onlyAccessPermittedContract external {
    delete bytesStorage[_key];
  }

  function deleteBool(bytes32 _key) onlyAccessPermittedContract external {
    delete boolStorage[_key];
  }

  function deleteInt(bytes32 _key) onlyAccessPermittedContract external {
    delete intStorage[_key];
  }
}
