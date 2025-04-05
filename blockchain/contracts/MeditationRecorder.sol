// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IBreathZenToken {
    function mint(address to, uint256 amount) external;
}

contract MeditationRecorder {
    struct Meditation {
        bytes32 id;
        uint256 startBlock;
        uint256 endBlock;
        uint256 totalCount;
        string chain;
    }

    mapping(address => Meditation[]) private records;
    IBreathZenToken public token;
    uint256 public reward = 1 ether;

    event MeditationRecorded(
        address indexed user,
        bytes32 id,
        uint256 startBlock,
        uint256 endBlock,
        uint256 totalCount,
        string chain,
        uint256 reward
    );

    constructor(address tokenAddress) {
        token = IBreathZenToken(tokenAddress);
    }

    function recordMeditation(
        uint256 _startBlock,
        uint256 _endBlock,
        uint256 _totalCount,
        string calldata _chain
    ) external {
        require(_endBlock > _startBlock, "Invalid block range");

        // 產生 pseudo-random unique id
        bytes32 meditationId = keccak256(
            abi.encodePacked(msg.sender, _startBlock, _endBlock, _totalCount, _chain, block.number, blockhash(block.number - 1))
        );

        Meditation memory m = Meditation(meditationId, _startBlock, _endBlock, _totalCount, _chain);
        records[msg.sender].push(m);

        token.mint(msg.sender, reward);

        emit MeditationRecorded(
            msg.sender,
            meditationId,
            _startBlock,
            _endBlock,
            _totalCount,
            _chain,
            reward
        );
    }

    function getMeditationRecords(address user) external view returns (Meditation[] memory) {
        return records[user];
    }
}
