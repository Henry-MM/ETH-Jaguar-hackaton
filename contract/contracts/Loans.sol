
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {LempiraCoin} from "./LempiraCoin.sol";

contract Loans is Ownable {

  struct Loan {
    uint256 loanId;
    uint256 timestamp;
    uint256 tax;
    uint256 maxPaymentPerMonth;
    uint256 totalToPay;
    uint256 totalPaid;
    uint256 monthsToPay;
    bool hasColateral;
  }

  uint8 public constant decimals = 18;

  event LoanCreated(uint256 loanId, address borrower, uint256 amount);
  event LoanPaid(uint256 paymentId, uint256 loanId, address borrower, uint256 amount);
  event LoanFinalized(uint256 loanId, address borrower);

  struct Payment {
    uint256 amount;
    uint256 timestamp;
  }

  mapping(uint256 => Payment[]) public payments;
  mapping(address => uint256[]) public userLoans;


  constructor() Ownable(msg.sender) {}

  uint256 public loanId;
  uint256 public tax_porcent = 30; 

  function setTax(uint256 _tax) external onlyOwner {
    require(_tax > 0, "Tax must be greater than 0");
    tax_porcent = _tax;
  }

  event LoanCreated(uint256 loanId, address borrower, uint256 amount, uint256 tax);
  mapping(address => Loan) public currentLoan;
  mapping(address => uint256[]) public loansId;

  

  function createLoan(address borrower, uint256 lempiraCoinAmount, uint256 maxPaymentPerMonth, bool hasColateral) external onlyOwner {
    uint256 unitAmount = lempiraCoinAmount * 1e18;
    uint256 maxPayWithDecimals = maxPaymentPerMonth * 1e18;
    require(borrower != address(0), "zero address");
    require(lempiraCoinAmount > 0, "Amount must be greater than 0");
    require(currentLoan[borrower].monthsToPay == 0, "Loan already exists");
    require(maxPayWithDecimals > 1e18, "Max payment must be greater than 1 LEMP");
    require(unitAmount >= 1e18, "Amount must be at least 1 LEMP");
    
    uint256 monthsToPay = unitAmount / maxPayWithDecimals;
    uint256 remainder = unitAmount % maxPayWithDecimals;
    monthsToPay = remainder > 0 ? monthsToPay + 1 : monthsToPay;

    if(hasColateral) {
      tax_porcent = 20;
    }

    uint256 taxAmount = (lempiraCoinAmount * tax_porcent) / 100;
    uint256 totalTaxAmount = taxAmount * 1e18;
    uint256 totalToPay = unitAmount + totalTaxAmount;

    loanId++;
    currentLoan[borrower] = Loan({  
      loanId: loanId,
      timestamp: block.timestamp, 
      tax: tax_porcent, 
      maxPaymentPerMonth: maxPaymentPerMonth * 1e18, 
      totalToPay: totalToPay, 
      totalPaid: 0, 
      monthsToPay: monthsToPay,
      hasColateral: hasColateral
    });

    loansId[borrower].push(loanId);
    userLoans[borrower].push(loanId);
    emit LoanCreated(loanId, borrower, lempiraCoinAmount, tax_porcent);
  }

  function payLoan(address borrower, uint256 lempiraCoinAmount) external onlyOwner {
    require(currentLoan[borrower].loanId > 0, "No loan");
    
    uint256 currentLoanId = currentLoan[borrower].loanId;
    
    require(currentLoan[borrower].totalToPay >= lempiraCoinAmount, "Not enough balance");
    if(currentLoan[borrower].totalPaid + lempiraCoinAmount > currentLoan[borrower].totalToPay) {
      uint256 remainingAmount = currentLoan[borrower].totalToPay - currentLoan[borrower].totalPaid;
      lempiraCoinAmount = remainingAmount;
    }
    

    uint256 totalPaid = currentLoan[borrower].totalPaid + lempiraCoinAmount;
    currentLoan[borrower].totalPaid = totalPaid;  
    uint256 id = currentLoan[borrower].loanId;

    payments[id].push(Payment({amount: lempiraCoinAmount, timestamp: block.timestamp}));
    if(totalPaid == currentLoan[borrower].totalToPay) {
      emit LoanFinalized(currentLoanId, borrower);
      currentLoan[borrower] = Loan({loanId: 0, timestamp: 0, tax: 0, maxPaymentPerMonth: 0, totalToPay: 0, totalPaid: 0, monthsToPay: 0, hasColateral: false});
    }

    emit LoanPaid(payments[currentLoanId].length - 1, currentLoanId, borrower, lempiraCoinAmount);
  }

  function getLoan() external view returns (Loan memory) {
    require(currentLoan[msg.sender].loanId > 0, "No loan");
    return currentLoan[msg.sender];
  }

  function getLoansId() external view returns (uint256[] memory) {
    return loansId[msg.sender];
  }
}
