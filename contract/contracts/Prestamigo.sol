// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {LempiraCoin} from "./LempiraCoin.sol";
import {Loans} from "./Loans.sol";

contract Prestamigo is Ownable {

    LempiraCoin public lem;
    Loans public loans;

    uint256 public constant maxLoanAmount = 5_000_000 * 1e18;

    mapping(address => bool) public blacklist;    
    event AddedToBlacklist(address indexed user);
    event RemovedFromBlacklist(address indexed user);

    constructor(address _owner, LempiraCoin _lem, Loans _loans) Ownable(_owner) {
        lem = _lem;
        loans = _loans;
        blacklist[msg.sender] = false; 
    }

    function addToBlacklist(address _user) external onlyOwner {
        blacklist[_user] = true;
        emit AddedToBlacklist(_user);
    }

    function removeFromBlacklist(address _user) external onlyOwner {
        blacklist[_user] = false;
        emit RemovedFromBlacklist(_user);
    }

    function isBanned(address _user) public view returns (bool) {
        return blacklist[_user];
    }

    function createLoan(uint256 lempiraCoinAmount, uint256 months, uint256 maxPaymentPerMonth) external {
        uint256 lempiraCoinAmountWithDecimals = lempiraCoinAmount * 1e18;
        require(lempiraCoinAmountWithDecimals >= 1e18, "Amount must be at least 1 LEMP");
        require(!blacklist[msg.sender], "You are banned");
        require(lem.balanceOf(owner()) >= lempiraCoinAmountWithDecimals, "in this moment contract doesn't have enough LEMP");
        require(lempiraCoinAmountWithDecimals <= maxLoanAmount, "Amount too large");
        
        loans.createLoan(msg.sender, lempiraCoinAmount, months, maxPaymentPerMonth);
        lem.transfer(msg.sender, lempiraCoinAmountWithDecimals);
    }

    function payLoan(uint256 lempiraCoinAmount) external {
        uint256 ammountWithDecimals = lempiraCoinAmount * 1e18;
        uint256 balance = lem.balanceOf(msg.sender);        
        require(ammountWithDecimals <= balance, "No tienes suficiente LEMP");
        require(!blacklist[msg.sender], "You are banned");
        lem.transferFrom(msg.sender, address(this), ammountWithDecimals);
        loans.payLoan(msg.sender, ammountWithDecimals);
    }
    
    receive() external payable {}
}
