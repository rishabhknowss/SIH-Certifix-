// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract RandomHashGenerator is Ownable {
    uint256 public randomHash;

    event RandomHashGenerated(uint256 indexed hashValue);

    constructor() {
        generateRandomHash();
    }

    function generateRandomHash() public onlyOwner {
        randomHash = uint256(keccak256(abi.encodePacked(block.prevrandao, block.timestamp, block.number)));
        emit RandomHashGenerated(randomHash);
    }
}
