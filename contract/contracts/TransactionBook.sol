// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract TransactionBook is Ownable {
  uint256 private transaction_id;
  enum TypeTransaction { DEPOSIT, WITHDRAW, LOAN, PAYMENT }

  struct Transaction {
      uint256 id;
      uint256 amount;
      uint256 timestamp;
      bytes32 loanId;       
      bytes32 paymentId;    
      bytes32 userId;
      bytes32 bankId;
      bytes32 referenceId;
      TypeTransaction typeTransaction;
  }

  constructor(address owner) Ownable(owner) {}

  mapping(uint256 => Transaction) public transactions;

  event TransactionCreated(
      uint256 indexed id,
      uint256 amount,
      bytes32 loanId,
      bytes32 paymentId,
      bytes32 userId,
      bytes32 bankId,
      bytes32 referenceId,
      TypeTransaction typeTransaction
  );

  function createTransactionInternal(
      uint256 amount,
      uint256 timestamp,
      uint256 loanId,
      uint256 paymentId,
      uint256 userId,
      uint256 bankId,
      uint256 referenceId,
      TypeTransaction typeTransaction
  ) private onlyOwner returns (uint256) {
      transaction_id++;

      bytes32 loanIdBytes32 = keccak256(abi.encodePacked(loanId));
      bytes32 paymentIdBytes32 = keccak256(abi.encodePacked(paymentId));
      bytes32 userIdBytes32 = keccak256(abi.encodePacked(userId));
      bytes32 bankIdBytes32 = keccak256(abi.encodePacked(bankId));
      bytes32 referenceIdBytes32 = keccak256(abi.encodePacked(referenceId));

      transactions[transaction_id] = Transaction({
          id: transaction_id,
          amount: amount,
          timestamp: timestamp,
          loanId: loanIdBytes32,
          paymentId: paymentIdBytes32,
          userId: userIdBytes32,
          bankId: bankIdBytes32,
          referenceId: referenceIdBytes32,
          typeTransaction: typeTransaction  
      });
      emit TransactionCreated(transaction_id, amount, loanIdBytes32, paymentIdBytes32, userIdBytes32, bankIdBytes32, referenceIdBytes32, typeTransaction);
      return transaction_id;
  }
 
  function createDepositTransaction(
      uint256 amount,
      uint256 timestamp,
      uint256 userId,
      uint256 bankId,
      uint256 referenceId
  ) external onlyOwner returns (uint256) {
      return createTransactionInternal( amount, timestamp, 0, 0, userId, bankId, referenceId, TypeTransaction.DEPOSIT);
  }

  function createWithdrawTransaction(
      uint256 amount,
      uint256 timestamp,
      uint256 userId,
      uint256 bankId,
      uint256 referenceId
  ) external onlyOwner returns (uint256) {
      return createTransactionInternal(amount, timestamp, 0, 0, userId, bankId, referenceId, TypeTransaction.WITHDRAW);
  }

  function createLoanTransaction(
      uint256 amount,
      uint256 timestamp,
      uint256 borrowerId,
      uint256 bankId,
      uint256 referenceId,
      uint256 loanId
  ) external onlyOwner returns (uint256) {
      return createTransactionInternal(amount, timestamp, loanId, 0, borrowerId, bankId, referenceId, TypeTransaction.LOAN);
  }

  function createPaymentTransaction(
      uint256 amount,
      uint256 timestamp,
      uint256 borrowerId,
      uint256 lenderId,
      uint256 loanId,
      uint256 paymentId,
      uint256 referenceId
  ) external onlyOwner returns (uint256) {
      return createTransactionInternal(amount, timestamp, loanId, paymentId, borrowerId, lenderId, referenceId, TypeTransaction.PAYMENT);
  }

  function getTransaction(uint256 _id) external view onlyOwner returns (Transaction memory) {
      return transactions[_id];
  }
}