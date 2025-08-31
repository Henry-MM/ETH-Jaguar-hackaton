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

    function createLoan(uint256 lempiraCoinAmount, uint256 maxPaymentPerMonth, bool hasColateral) external {
        require(lempiraCoinAmount >= 1e18, "Amount must be at least 1 LEMP");
        require(!blacklist[msg.sender], "You are banned");
        require(lem.balanceOf(owner()) >= lempiraCoinAmount, "in this moment contract doesn't have enough LEMP");
        require(lempiraCoinAmount <= maxLoanAmount, "Amount too large");
        require(maxPaymentPerMonth >= 1e18, "Max payment must be at least 1 LEMP");

        loans.createLoan(msg.sender, lempiraCoinAmount, maxPaymentPerMonth, hasColateral);
        lem.transfer(msg.sender, lempiraCoinAmount);
    }

    function payLoan(uint256 lempiraCoinAmount) external {
        uint256 balance = lem.balanceOf(msg.sender);        
        require(lempiraCoinAmount <= balance, "No tienes suficiente LEMP");
        require(!blacklist[msg.sender], "You are banned");
        lem.transferFrom(msg.sender, address(this), lempiraCoinAmount);
        loans.payLoan(msg.sender, lempiraCoinAmount);
    } 
    
    receive() external payable {}
}
