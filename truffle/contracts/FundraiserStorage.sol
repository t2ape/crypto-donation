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

  function msgSenderIsAccessPermittedContract() private view returns(bool) {
    for(uint256 i = 0; i < _accessPermittedContracts.length; i++) {
      if(_accessPermittedContracts[i] == msg.sender) {
        return true;
      }
    }

    return false;
  }

  function addAccessPermittedContract(address _contract) public onlyOwner {
    _accessPermittedContracts.push(_contract);
  }

  function removeAccessPermittedContract(address _contract) public onlyOwner {
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

  function getAddress(bytes32 _key) external view returns(address) {
    return addressStorage[_key];
  }

  function getAddressArray(bytes32 _key) external view returns(address[] memory) {
    return addressArrayStorage[_key];
  }

  function getBool(bytes32 _key) external view returns(bool) {
    return boolStorage[_key];
  }

  function getBytes(bytes32 _key) external view returns(bytes memory) {
    return bytesStorage[_key];
  }

  function getInt(bytes32 _key) external view returns(int) {
    return intStorage[_key];
  }

  function getUint(bytes32 _key) external view returns(uint) {
    return uintStorage[_key];
  }

  function getString(bytes32 _key) external view returns(string memory) {
    return stringStorage[_key];
  }

  // *** Setter Methods ***

  function setAddress(bytes32 _key, address _value) onlyAccessPermittedContract external {
    addressStorage[_key] = _value;
  }

  function setAddressArray(bytes32 _key, address[] memory _values) onlyAccessPermittedContract external {
    addressArrayStorage[_key] = _values;
  }

  function setBool(bytes32 _key, bool _value) onlyAccessPermittedContract external {
    boolStorage[_key] = _value;
  }

  function setBytes(bytes32 _key, bytes calldata _value) onlyAccessPermittedContract external {
    bytesStorage[_key] = _value;
  }

  function setInt(bytes32 _key, int _value) onlyAccessPermittedContract external {
    intStorage[_key] = _value;
  }

  function setUint(bytes32 _key, uint _value) onlyAccessPermittedContract external {
    uintStorage[_key] = _value;
  }

  function setString(bytes32 _key, string calldata _value) onlyAccessPermittedContract external {
    stringStorage[_key] = _value;
  }

  // *** Delete Methods ***

  function deleteAddress(bytes32 _key) onlyAccessPermittedContract external {
    delete addressStorage[_key];
  }

  function deleteAddress(bytes32 _key) onlyAccessPermittedContract external {
    delete addressArrayStorage[_key];
  }

  function deleteBool(bytes32 _key) onlyAccessPermittedContract external {
    delete boolStorage[_key];
  }

  function deleteBytes(bytes32 _key) onlyAccessPermittedContract external {
    delete bytesStorage[_key];
  }

  function deleteInt(bytes32 _key) onlyAccessPermittedContract external {
    delete intStorage[_key];
  }

  function deleteUint(bytes32 _key) onlyAccessPermittedContract external {
    delete uintStorage[_key];
  }

  function deleteString(bytes32 _key) onlyAccessPermittedContract external {
    delete stringStorage[_key];
  }
}
