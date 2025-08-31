// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/*
  Requisitos:
  npm install @openzeppelin/contracts
  o usar los imports desde Remix (import "@openzeppelin/contracts/...").
*/

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LempiraCoin is ERC20, Ownable {

    uint256 public rateInTokenPerEth = 100_000 * 1e18; // 1 ETH = 100,000 LEMP

    event BoughtWithETH(address indexed buyer, uint256 ethPaid, uint256 tokensMinted);
    event RedeemedForETH(address indexed redeemer, uint256 tokensBurned, uint256 ethReturned);
    event RateChanged(uint256 oldRate, uint256 newRate);
    event Withdrawn(address indexed to, uint256 amount);

    constructor(uint256 initialReserveTokens) ERC20("LempiraCoin", "LEMP") Ownable(msg.sender) {
        require(initialReserveTokens > 1e18, "Initial reserve too small");
        _mint(msg.sender, initialReserveTokens);
    }


    receive() external payable {
        buyWithETH();
    }

    fallback() external payable {
        buyWithETH();
    }

    function buyWithETH() public payable {
        require(msg.value > 0, "No ETH sent");

        uint256 tokensToMint = (msg.value * rateInTokenPerEth) / 1 ether;
        require(tokensToMint > 0, "Amount too small for configured rate");

        _transfer(owner(), msg.sender, tokensToMint);

        emit BoughtWithETH(msg.sender, msg.value, tokensToMint);
    }

    // function redeemForETH(uint256 tokenAmount) external {
    //     require(tokenAmount > 0, "tokenAmount = 0");

    //     uint256 ethToReturn = (tokenAmount * 1 ether) / rateInTokenPerEth;
    //     require(address(this).balance >= ethToReturn, "Contract ETH balance insufficient");

    //     _transfer(msg.sender, owner(), tokenAmount);

    //     (bool sent, ) = payable(msg.sender).call{value: ethToReturn}("");
    //     require(sent, "ETH transfer failed");

    //     emit RedeemedForETH(msg.sender, tokenAmount, ethToReturn);
    // }

    function setRate(uint256 newRateInTokenPerEth) external onlyOwner {
        require(newRateInTokenPerEth > 0, "rate = 0");
        uint256 old = rateInTokenPerEth;
        rateInTokenPerEth = newRateInTokenPerEth;
        emit RateChanged(old, newRateInTokenPerEth);
    }

    function withdrawETH(address payable to, uint256 amount) external onlyOwner {
        require(to != address(0), "zero address");
        require(amount <= address(this).balance, "insufficient balance");
        (bool sent, ) = to.call{value: amount}("");
        require(sent, "withdraw failed");
        emit Withdrawn(to, amount);
    }

    function rescueERC20(address tokenAddr, address to) external onlyOwner {
        require(to != address(0), "zero address");
        IERC20 token = IERC20(tokenAddr);
        uint256 bal = token.balanceOf(address(this));
        require(bal > 0, "no token balance");
        token.transfer(to, bal);
    }
}
