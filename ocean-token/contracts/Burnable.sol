// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

error totalSupplyExceed();
error pleaseSendTokenPrice();
error pleaseEnterRightPersntage();
error TransferFaild();
error DontHaveEnoughBalance();
error pleaseSendSlaePrice();
error YouAreNotAuthorise();
error StakingTimeIsRemain();

contract BrnToken is ERC20,Ownable {
    using Counters for Counters.Counter;    
    Counters.Counter public listingId;


    struct Sale{
    uint256 tokenId;
    uint256 tokens;
    uint256 price;
    address seller;
    }
   
    struct stake {
        uint256 satkeId;
        address staker;
        uint256 tokens;
        uint256 stakingTime;
        uint256 stakingEndTime;
    }

    uint256 public stakingTime = 86400;
    uint256 public Reward = 5000; 
    uint256 public supply = 100 ether;
    uint256 public burnfee = 200;
    uint256 public tokenPrice = 1;
    uint256 public stakingId;

    mapping(uint256 => Sale) public listing;
    mapping(uint256 => stake) public staking;


    constructor() ERC20("TokenBurn", "TBT") {}


    function setburnAmount(uint256 _amount) public onlyOwner {
    if(_amount>1000){
            revert pleaseEnterRightPersntage();
        }
        burnfee = _amount;
    }

    function burnPersontage(uint256 amount) public view returns (uint256) {
        return ((amount / 10000) * burnfee);
    }

    function stakingReward(uint256 amount) public view returns (uint256) {
        return ((amount / 10000) * Reward);
    }

    //minting payable function
    function mint(address to, uint256 _amount) public payable {
    if ((totalSupply() + _amount) > supply) {
            revert totalSupplyExceed();
        }
    if(msg.value<(_amount*tokenPrice)){
            revert pleaseSendTokenPrice();   
        }
        _mint(to, _amount);
    }

    //transfer Function 
    function transfer(
        address to,
        uint256 amount
    ) public virtual override returns (bool) {
        uint256 temp = burnPersontage(amount);
        uint256 sendamount = amount - temp;
        address owner = _msgSender();
        _burn(owner, temp);
        _transfer(owner, to, sendamount);
        return true;
    }
    
    //This is Tokens buying Function
    function BuyToken(uint256 _listingId, uint256 _amount)public payable{
        Sale memory sales = listing[_listingId];
    if(msg.value < sales.price){
        revert pleaseSendSlaePrice();
    }    
    (bool success,)=sales.seller.call{value:msg.value}("");
    if(!success){
        revert TransferFaild();
    }  
        address owner = _msgSender();
        IERC20(address(this)).transferFrom(sales.seller,owner,_amount);
        delete listing[_listingId];
    }

    //This is withdraw Function, OnlyOwner Can call this Function
    function withdraw()public onlyOwner{
        (bool success,)=msg.sender.call{value:address(this).balance}("");
        if(!success){
        revert TransferFaild();
        } 
    }

    //In this Function We can sale Our Tokens
    function SellTokens(uint256 _tokens, uint256 price) public {
    if(balanceOf(msg.sender) < _tokens){
        revert DontHaveEnoughBalance();
    }
        
        approve(address(this),_tokens);
        uint256 tokenId =listingId.current();
        listing[tokenId]=Sale(tokenId,_tokens,price,msg.sender);
        listingId.increment();
    }

    //get All Listed Tokens
    function ListedTokens()public view returns(Sale[] memory){
        uint256 id = listingId.current();
        Sale[] memory sales = new Sale[](id);
    for(uint256 i=0; i<id; i++){
        sales[i]=listing[i];
    }
        return sales;
    }
    
    function tokenStaking(uint256 _tokens)public
    {  
        
     if(balanceOf(msg.sender) < _tokens){
        revert DontHaveEnoughBalance();
         }
        transfer(address(this),_tokens);   
        stakingId++;
        uint256 temp=(stakingTime+block.timestamp);
        staking[stakingId]=stake(stakingId,msg.sender,_tokens,temp,block.timestamp);
    }

    function WithdrawStakingTokens(uint256 stakingId) public {
        stake memory Stake = staking[stakingId];
        
        if(msg.sender != Stake.staker){
            revert YouAreNotAuthorise();
      }
        if(block.timestamp < Stake.stakingEndTime){
            revert StakingTimeIsRemain();
      }
        uint256 reward = stakingReward(Stake.tokens);
        IERC20(address(this)).transfer(Stake.staker,reward);
        
        delete staking[stakingId];
    }


}