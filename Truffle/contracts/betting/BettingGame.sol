// SPDX-License-Identifier: MIT
pragma solidity >=0.4.17 <0.9.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "../interfaces/IERC20Burnable.sol";
import "../interfaces/IPriceConverter.sol";

contract BettingGame is VRFConsumerBase {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    enum BettingGameStatus {
        OPEN,
        CLOSED
    }

    event Challenge(address challenger);
    event Play(address playerAddress, uint256 randomResult);
    event Deposit(address tokenAddress, uint256 tokenAmount);
    event Withdraw(address winner, address tokenAddress, uint256 tokenAmount);

    bytes32 internal keyHash;
    uint256 internal fee;
    address public creator;
    address public challenger;
    uint256 public sides;
    BettingGameStatus public status;
    uint256 public expiryTime;
    address public nativeTokenAddress;
    address public depositTokenAddress;
    address priceConverterAddress;
    address public winner;
    bool public isWithdrawn;

    mapping(bytes32 => address) requestIdToAddressRegistry;
    mapping(address => uint256) public playerBetRecordRegistry;

    constructor(
        address _vrfCoordinatorAddress,
        address _linkTokenAddress,
        bytes32 _keyHash,
        uint256 _fee,
        address _creator,
        uint256 _sides,
        address _nativeTokenAddress,
        address _priceConverterAddress
    ) VRFConsumerBase(_vrfCoordinatorAddress, _linkTokenAddress) {
        keyHash = _keyHash;
        fee = _fee;
        creator = _creator;
        challenger = address(0);
        sides = _sides;
        status = BettingGameStatus.OPEN;
        expiryTime = block.timestamp + 30 minutes;
        nativeTokenAddress = _nativeTokenAddress;
        priceConverterAddress = _priceConverterAddress;
        depositTokenAddress = address(0);
    }

    /**
     * Making sure that `_msgSend` is either a creator or not (depends `isEqual`)
     */
    modifier onlyCreator(bool isEqual) {
        if (isEqual) {
            require(
                creator == msg.sender,
                "You are not the creator of this game!"
            );
        } else {
            require(creator != msg.sender, "You are the creator of this game!");
        }
        _;
    }

    /**
     * Making sure that `_msgSend` is either the creator or the challenger of the game
     */
    modifier onlyCreatorAndChallenger() {
        require(
            msg.sender == creator || msg.sender == challenger,
            "You are not the creator or the challenger of this game!"
        );
        _;
    }

    /**
     * Making sure that the challenger position is not filled
     */
    modifier onlyEmptyChallenger() {
        require(challenger == address(0), "Challenger position is filled!");
        _;
    }

    /**
     * Making sure that this game has either expired or not (depends on `isExpired`)
     */
    modifier onlyExpiredGame(bool isExpired) {
        if (isExpired) {
            require(
                block.timestamp >= expiryTime ||
                    status == BettingGameStatus.CLOSED,
                "This game has not expired!"
            );
        } else {
            require(
                block.timestamp < expiryTime &&
                    status == BettingGameStatus.OPEN,
                "This game has expired!"
            );
        }
        _;
    }

    modifier onlyNotWithdrawn() {
        require(
            isWithdrawn == false,
            "The fund in this game has been withdrawn!"
        );
        _;
    }

    /**
     * Making sure that the function has only access to the winner
     */
    modifier onlyWinner() {
        require(msg.sender == winner, "You are not the winner of this game!");
        _;
    }

    /**
     * Get Betting Game all public info
     */
    function getBettingGameInfo()
        public
        view
        returns (
            address,
            address,
            uint256,
            BettingGameStatus,
            uint256,
            address,
            address,
            bool,
            uint256,
            uint256
        )
    {}

    /**
     * Allow `msg.sender` address to register as a challenger
     */
    function challenge()
        public
        onlyCreator(false)
        onlyEmptyChallenger
        onlyExpiredGame(false)
    {
        // 1. Burn the tokens
        // 2, Register the challenger
        // 3. Emit Challenge Event
    }

    /**
     *  Cancel the created Betting Game
     */
    function cancel() public onlyCreator(true) {
        // 1. Set the bettingGameStatus to CLOSED
    }

    /**
     * Allow player `msg.sender` to place a bet on the game
     */
    function play()
        public
        onlyCreatorAndChallenger
        onlyExpiredGame(false)
        returns (bytes32 requestId)
    {}

    /**
     * This is a function overriden from Chainlink VRF contract to get the randomness result
     */
    function fulfillRandomness(bytes32 requestId, uint256 randomness)
        internal
        override
    {}

    /**
     * Handle depositing ERC20 token to the `BettingGame` contract
     */
    function deposit(
        address _tokenAddress,
        address _baseAddress,
        address _quoteAddress
    ) public onlyCreatorAndChallenger onlyExpiredGame(false) {
        // 1. Get Price Feeds Data from Chainlink
        // 2. Transfer ERC20 token from user to the `BettingGame` contract
        // 3. Set Deposit Token Address when it is empty
        // 4. Emit Deposit event
    }

    /**
     * Handle creator and challenger ERC20 token withdrawal after both have played
     */
    function withdraw()
        public
        onlyCreatorAndChallenger
        onlyExpiredGame(true)
        onlyWinner
        onlyNotWithdrawn
    {
        // 1. Transfer the depositted asset to the winner
        // 2. Emit Withdraw event
        // 3. Set `isWithdrawn` to false
    }
}
