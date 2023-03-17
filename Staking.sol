// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Staking is Ownable {
    using SafeMath for uint256;

    enum StakingType {
        SIX_MONTHS,
        ONE_YEAR,
        TWO_YEARS,
        THREE_YEARS
    }

    event StakeToken(
        address indexed user,
        uint256 amount,
        uint256 timestamp,
        StakingType
    );
    event UnstakeToken(
        address indexed user,
        uint256 amount,
        uint256 timestamp,
        StakingType
    );
    event EarlyUnstakeToken(
        address indexed user,
        uint256 amount,
        uint256 timestamp,
        StakingType
    );

    uint256 public constant MIN_STAKE = 0.01 ether;

    // Put ROX token addrss instead of address(0)
    IERC20 public ROX = IERC20(address(0));

    mapping(address => uint256)[4] public stakedAmount;
    mapping(address => uint256)[4] public stakedTimestamp;
    uint256[4] public periods = [182 days, 365 days, 730 days, 1095 days];
    uint256[4] public interests = [197, 600 * 2, 800 * 4, 1200 * 6];
    uint256 penaltyRate = 50;

    function updateROXToken(IERC20 _ROX) public onlyOwner {
        ROX = _ROX;
    }

    function sweepToken(uint256 _amount) public onlyOwner {
        require(
            ROX.balanceOf(address(this)) >= _amount,
            "Amount exceeds the balance."
        );
        ROX.transfer(owner(), _amount);
    }

    function updateInterest(uint256[4] calldata _interests) public onlyOwner {
        interests[0] = _interests[0];
        interests[1] = _interests[1] * 2;
        interests[2] = _interests[2] * 4;
        interests[3] = _interests[3] * 6;
    }

    function updatePenaltyRate(uint256 _penaltyRate) public onlyOwner {
        require(_penaltyRate <= 100, "Penalty exceeds 100%.");
        penaltyRate = _penaltyRate;
    }

    function stake(uint256 _amount, StakingType _type) public {
        require(_amount >= MIN_STAKE, "Amount is less than the minimal value.");
        require(
            ROX.allowance(msg.sender, address(this)) >= _amount,
            "Amount exceeds the Allownace."
        );
        ROX.transferFrom(msg.sender, address(this), _amount);
        stakedTimestamp[uint256(_type)][msg.sender] = block.timestamp;
        stakedAmount[uint256(_type)][msg.sender] += _amount;
        emit StakeToken(msg.sender, _amount, block.timestamp, _type);
    }

    function unstake(StakingType _type) public {
        uint256 _staked = stakedAmount[uint256(_type)][msg.sender];
        require(_staked > 0, "Sender does not have staked tokens.");
        require(
            stakedTimestamp[uint256(_type)][msg.sender] +
                periods[uint256(_type)] <
                block.timestamp,
            "Lock Period is not passed."
        );
        uint256 _interest = interests[uint256(_type)];
        uint256 _reward = _staked.mul(_interest).div(10000).div(2);
        ROX.transfer(msg.sender, _staked.add(_reward));
        stakedAmount[uint256(_type)][msg.sender] = 0;
        emit UnstakeToken(
            msg.sender,
            _staked.add(_reward),
            block.timestamp,
            _type
        );
    }

    function earlyUnstake(uint256 _amount, StakingType _type) public {
        require(
            stakedAmount[uint256(_type)][msg.sender] >= _amount,
            "Amount exceeds the staked amount."
        );
        require(
            stakedTimestamp[uint256(_type)][msg.sender] +
                periods[uint256(_type)] >
                block.timestamp,
            "Lock Period is already passed."
        );
        uint256 _penalty = _amount.mul(penaltyRate).div(100);
        uint256 _remain = _amount.sub(_penalty);
        ROX.transfer(msg.sender, _remain);
        stakedAmount[uint256(_type)][msg.sender] -= _amount;
        emit EarlyUnstakeToken(msg.sender, _amount, block.timestamp, _type);
    }
}
