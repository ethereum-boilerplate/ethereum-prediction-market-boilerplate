// SPDX-License-Identifier: MIT
pragma solidity >=0.4.17 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./BettingGame.sol";
import "../interfaces/IERC20Burnable.sol";

contract BettingGameRegistry is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    using SafeERC20 for IERC20Burnable;

    event BettingGameCreated(
        uint256 bettingGameId,
        address creator,
        uint256 sides,
        address bettingGameAddress
    );

    address public nativeTokenAddress;
    address public priceConverterAddress;
    address internal vrfCoordinatorAddress;
    address internal linkTokenAddress;
    bytes32 internal keyHash;
    uint256 internal fee;
    uint256 private bettingGameCount;
    mapping(uint256 => address) public bettingGameDataRegistry;

    constructor(
        address _nativeTokenAddress,
        address _priceConverterAddress,
        address _vrfCoordinatorAddress,
        address _linkTokenAddress,
        bytes32 _keyHash,
        uint256 _fee
    ) {
        nativeTokenAddress = _nativeTokenAddress;
        priceConverterAddress = _priceConverterAddress;
        vrfCoordinatorAddress = _vrfCoordinatorAddress;
        linkTokenAddress = _linkTokenAddress;
        keyHash = _keyHash;
        fee = _fee;
        bettingGameCount = 0;
    }

    /**
     * Making sure that the `_bettingGameId` is valid
     */
    modifier onlyExistingGame(uint256 _bettingGameId) {
        require(_bettingGameId < bettingGameCount);
        _;
    }

    /**
     * Get Betting Game Address by `bettingGameId`
     */
    function getBettingGameById(uint256 _bettingGameId)
        public
        view
        returns (address)
    {}

    /**
     * Set Native Token Address (only owner access)
     */
    function setNativeTokenAddress(address newNativeTokenAddress)
        public
        onlyOwner
    {}

    /**
     * Create new `BettingGame` instance
     */
    function createGame(uint256 _sides) public {
        // 1. Burn some token
        // 2. Create new `BettingGame` smart contract
        // 3. Increase Betting Game Counter
    }
}
