// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Whitelist {
// max number of address that can be whitelisted
    uint8 public maxWhitelistedAddresses;
// keeps track of addresses whitelisted
    uint8 public numAddressWhitelisted;

    mapping(address => bool) public whitelistedAddresses;

    constructor(uint8 _maxWhitelistedAddresses) {
        maxWhitelistedAddresses = _maxWhitelistedAddresses;
    }
}