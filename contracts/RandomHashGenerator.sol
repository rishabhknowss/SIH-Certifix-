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
        uint256 newRandomHash = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty , block.number )));
        emit RandomHashGenerated(randomHash);
    }
}
