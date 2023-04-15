// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Dumpling.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DumplingTest {
    Dumpling dumpling;
    ERC20 token;

    address constant LENDER1 = 0x627306090abaB3A6e1400e9345bC60c78a8BEf57;
    address constant LENDER2 = 0xf17f52151EbEF6C7334FAD080c5704D77216b732;

    function beforeEach() public {
        token = new ERC20("Test Token", "TEST");
        dumpling = new Dumpling(address(token));
    }
    
    function testLendFunds() public {
        uint256 amount = 100;
        
        // Lender1 lends funds for 30 days
        dumpling.lendFunds(30 days);
        Assert.equal(token.balanceOf(address(dumpling)), amount, "Incorrect funds lent");
        Assert.equal(token.balanceOf(LENDER1), 900, "Incorrect balance after lending");
        
        // Lender2 lends funds for 60 days
        token.approve(address(dumpling), amount);
        dumpling.lendFunds(60 days);
        Assert.equal(token.balanceOf(address(dumpling)), amount * 2, "Incorrect funds lent");
        Assert.equal(token.balanceOf(LENDER2), 900, "Incorrect balance after lending");
    }
    
    function testWithdrawFunds() public {
        uint256 amount = 100;
        token._allowances[LENDER1][address(dumpling)] = amount;
        
        // Lender1 lends funds for 30 days
        dumpling.lendFunds(30 days);
        
        // Fast-forward time by 40 days
        // evm_increaseTime(40 days);
        
        // Lender1 withdraws funds with interest
        dumpling.withdrawFunds();
        Assert.equal(token.balanceOf(address(dumpling)), 0, "Incorrect funds after withdrawal");
        Assert.equal(token.balanceOf(LENDER1), 901, "Incorrect balance after withdrawal");
    }
    
    function testWithdrawFunds_NoInterest() public {
        uint256 amount = 100;
        
        // Lender1 lends funds for 30 days
        dumpling.lendFunds(30 days);
        
        // Fast-forward time by 20 days
        // block.timestamp += 20 days;
        
        // Lender1 attempts to withdraw funds with no interest accrued
        dumpling.withdrawFunds();
        Assert.equal(token.balanceOf(address(dumpling)), amount, "Incorrect funds after failed withdrawal");
        Assert.equal(token.balanceOf(LENDER1), 900, "Incorrect balance after failed withdrawal");
    }
    
    function testWithdrawFunds_MultipleLenders() public {
        uint256 amount = 100;
        
        // Lender1 lends funds for 30 days
        dumpling.lendFunds(30 days);
        
        // Lender2 lends funds for 60 days
        token.approve(address(dumpling), amount);
        dumpling.lendFunds(60 days);
        
        // Fast-forward time by 90 days
        // block.timestamp += 90 days;
        
        // Lender1 withdraws funds with interest
        dumpling.withdrawFunds();
        Assert.equal(token.balanceOf(address(dumpling)), amount, "Incorrect funds after Lender1 withdrawal");
        Assert.equal(token.balanceOf(LENDER1), 901, "Incorrect balance after Lender1 withdrawal");
        // Lender2 withdraws funds with interest
        dumpling.withdrawFunds();
        Assert.equal(token.balanceOf(address(dumpling)), 0, "Incorrect funds after Lender2 withdrawal");
        Assert.equal(token.balanceOf(LENDER2), 901, "Incorrect balance after Lender2 withdrawal");
    }

    function testWithdrawFunds_MultipleLenders_WithInterest() public {
        uint256 amount = 100;
        
        // Lender1 lends funds for 30 days
        dumpling.lendFunds(30 days);
        
        // Lender2 lends funds for 60 days
        token.approve(address(dumpling), amount);
        dumpling.lendFunds(60 days);
        
        // Fast-forward time by 30 days
        // block.timestamp += 30 days;
        
        // Lender1 withdraws funds with no interest accrued
        dumpling.withdrawFunds();
        Assert.equal(token.balanceOf(address(dumpling)), amount, "Incorrect funds after Lender1 withdrawal");
        Assert.equal(token.balanceOf(LENDER1), 900, "Incorrect balance after Lender1 withdrawal");
        
        // Fast-forward time by 60 days
        // block.timestamp += 60 days;
        
        // Lender2 withdraws funds with interest
        dumpling.withdrawFunds();
        Assert.equal(token.balanceOf(address(dumpling)), 0, "Incorrect funds after Lender2 withdrawal");
        Assert.equal(token.balanceOf(LENDER2), 901, "Incorrect balance after Lender2 withdrawal");
    }
}
