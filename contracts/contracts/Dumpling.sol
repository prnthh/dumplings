// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Dumpling {
    mapping(address => uint256) private _balances;
    mapping(address => uint256) private _timestamps;
    IERC20 private _token;
    address private _borrower;
    
    uint256 private constant _30_DAYS = 30 days;
    uint256 private constant _60_DAYS = 60 days;
    uint256 private constant _90_DAYS = 90 days;
    
    event FundsLent(address indexed lender, uint256 amount, uint256 duration);
    event FundsWithdrawn(uint256 amount);
    event FundsPulled(address indexed lender, uint256 amount);
    
    constructor(address tokenAddress, address borrower) {
        _token = IERC20(tokenAddress);
        _borrower = borrower;
    }
    
    function lendFunds(uint256 duration) external {
        require(duration == _30_DAYS || duration == _60_DAYS || duration == _90_DAYS, "Invalid duration");
        
        address lender = msg.sender;
        require(_balances[lender] == 0, "Existing position not yet finished");
        
        uint256 amount = _token.allowance(lender, address(this));
        require(amount > 0, "Amount must be greater than 0");
        
        require(_token.transferFrom(lender, address(this), amount), "Token transfer failed");
        
        _balances[lender] += amount;
        _timestamps[lender] = block.timestamp;
        
        emit FundsLent(lender, amount, duration);
    }

    function withdrawFunds(uint256 amount) external {
        require(msg.sender == _borrower, "Only borrower can withdraw funds");
        require(_token.transfer(_borrower, amount), "Token transfer failed");
        emit FundsWithdrawn(amount);
    }
    
    function pullFunds() external {
        address lender = msg.sender;
        require(_balances[lender] > 0, "No funds to pull");
        
        uint256 amount = calculateInterest(lender);
        require(amount > 0, "No interest accrued yet");
        
        _balances[lender] = 0;
        require(_token.transfer(lender, amount), "Token transfer failed");
        
        emit FundsPulled(lender, amount);
    }
    
    function calculateInterest(address lender) private view returns(uint256) {
        uint256 balance = _balances[lender];
        uint256 timestamp = _timestamps[lender];
        uint256 duration = block.timestamp - timestamp;
        
        uint256 interestRate;
        if (duration >= _90_DAYS) {
            interestRate = 103; // 3% interest for 90 days or more
        } else if (duration >= _60_DAYS) {
            interestRate = 102; // 2% interest for 60-89 days
        } else if (duration >= _30_DAYS) {
            interestRate = 101; // 1% interest for 30-59 days
        } else {
            return 0; // No interest accrued yet
        }
        
        return (balance * interestRate * duration) / (100 * 365 days);
    }
}
