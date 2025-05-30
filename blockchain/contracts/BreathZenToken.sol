// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BreathZenToken is ERC20, Ownable {
    constructor(address initialOwner) ERC20("BreatheZenToken", "BREATH") Ownable(initialOwner) {}
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
