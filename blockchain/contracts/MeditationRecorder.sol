// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IBreathZenToken {
    function mint(address to, uint256 amount) external;
}

contract MeditationRecorder {
    struct Meditation {
        uint256 startTime;
        uint256 endTime;
    }

    mapping(address => Meditation[]) private records;
    IBreathZenToken public token;
    uint256 public reward = 1 ether;

    event MeditationRecorded(
        address indexed user,
        uint256 startTime,
        uint256 endTime,
        uint256 reward
    );

    constructor(address tokenAddress) {
        token = IBreathZenToken(tokenAddress);
    }

    function recordMeditation(uint256 _startTime, uint256 _endTime) external {
        require(_endTime > _startTime, "Invalid time range");

        Meditation memory m = Meditation(_startTime, _endTime);
        records[msg.sender].push(m);

        // 調用 mint 函數發行獎勵代幣
        token.mint(msg.sender, reward);

        emit MeditationRecorded(msg.sender, _startTime, _endTime, reward);
    }
}
