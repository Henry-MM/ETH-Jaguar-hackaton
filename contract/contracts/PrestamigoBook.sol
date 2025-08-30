
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Lenders book
// This contract is used to manage the balance of lenders
 import {TransactionBook} from "./TransactionBook.sol";
 import {LoanBook} from "./LoanBook.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
contract PrestamigoBook is Ownable {
  mapping(bytes32 => uint256) public balance_lenders;

  event Deposit(bytes32 indexed userId, uint256 amount, uint256 transactionId);
  event Withdraw(bytes32 indexed userId, uint256 amount, uint256 transactionId);
  event Borrow(bytes32 indexed fromId, bytes32 indexed toId, uint256 amount);
  TransactionBook public transaction_book;
  LoanBook public loan_book;

  constructor(TransactionBook _transaction_book, LoanBook _loan_book, address owner) Ownable(owner) {
    transaction_book = _transaction_book;
    loan_book = _loan_book;
  }


  function deposit(uint256 amount,
    uint256 timestamp,
    uint256 userId,
    uint256 bankId,
    uint256 referenceId
  ) external returns (uint256) {

    bytes32 userIdBytes32 = keccak256(abi.encodePacked(userId));
    balance_lenders[userIdBytes32] += amount;
    uint256 transactionId = transaction_book.createDepositTransaction(amount, timestamp, userId, bankId, referenceId);
    emit Deposit(userIdBytes32, amount, transactionId);
    return transactionId;
  }

  function withdraw(uint256 amount,
    uint256 timestamp,
    uint256 userId,
    uint256 bankId,
    uint256 referenceId
  ) external returns (uint256) {
    bytes32 userIdBytes32 = keccak256(abi.encodePacked(userId));
    require(balance_lenders[userIdBytes32] >= amount, "Fondos insuficientes");
    balance_lenders[userIdBytes32] -= amount;
    uint256 transactionId = transaction_book.createWithdrawTransaction(amount, timestamp, userId, bankId, referenceId);
    emit Withdraw(userIdBytes32, amount, transactionId);
    return transactionId;
  }

  function borrow(uint256 amount,
    uint256 timestamp,
    uint256 fromId,
    uint256 borrowerId,
    uint256 bankId,
    uint256 referenceId
  ) external returns (uint256, uint256) {
    bytes32 fromIdBytes32 = keccak256(abi.encodePacked(fromId));
    bytes32 borrowerIdBytes32 = keccak256(abi.encodePacked(borrowerId));
    require(balance_lenders[fromIdBytes32] >= amount, "insufficient funds");
    
    uint256 loanId = loan_book.createLoan(borrowerIdBytes32, amount);

    balance_lenders[fromIdBytes32] -= amount;
    uint256 transactionId = transaction_book.createLoanTransaction(amount, timestamp, borrowerId, bankId, referenceId, loanId);

    emit Borrow(fromIdBytes32, borrowerIdBytes32, amount);
    return (loanId, transactionId);
  }
}
