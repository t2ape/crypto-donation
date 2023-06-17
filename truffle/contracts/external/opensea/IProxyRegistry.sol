// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

interface IProxyRegistry {
  function proxies(address) external view returns (address);
}
