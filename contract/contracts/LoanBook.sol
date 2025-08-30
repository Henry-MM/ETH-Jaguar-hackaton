// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract LoanBook is Ownable {
  uint256 private payment_id;
  uint256 private loan_id;
  
  struct Payment {
    uint256 id;
    uint256 amount;
    uint256 timestamp;
  }

  struct Loan {
    uint256 amount;
    bytes32 borrowerId;

  }

  mapping(uint256 => Payment[]) public paymentsArray;

  constructor(address owner) Ownable(owner) {}

  // balances of loans uint256 is lender id
  mapping(uint256 => Loan) public loansBalances;

  event LoanCreated(bytes32 indexed borrowerId, uint256 amount);
  event LoanPaid(bytes32 indexed borrowerId, uint256 amount, uint256 indexed loanId, bytes32 indexed lenderId, uint256 paymentId);

  function createLoan(bytes32 borrowerId, uint256 amount) external onlyOwner returns (uint256) {
    loan_id++;
    loansBalances[loan_id] = Loan({
      amount: amount,
      borrowerId: borrowerId
    });
    emit LoanCreated(borrowerId, amount);
    return loan_id;
  }

  function payLoan(uint256 _loanId, bytes32 borrowerId, bytes32 lenderId, uint256 amount, uint256 timestamp) external onlyOwner returns (uint256) {
    require(loansBalances[_loanId].borrowerId == borrowerId, "this loan is not yours");

    payment_id++;
    paymentsArray[_loanId].push(Payment({id: payment_id, amount: amount, timestamp: timestamp}));
    emit LoanPaid(borrowerId, amount, _loanId, lenderId, payment_id);
    return payment_id;
  }

  function getLoan(uint256 _loanId) external view onlyOwner returns (Loan memory) {
    return loansBalances[_loanId];
  }

  function getPayments(uint256 _loanId) external view onlyOwner returns (Payment[] memory) {
    return paymentsArray[_loanId];
  }

}

