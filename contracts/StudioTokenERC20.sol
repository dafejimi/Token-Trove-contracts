// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// balances might be unsteady
contract StudioTokenERC20 is ERC20 {
    constructor(string memory _name_, string memory _symbol_) ERC20(_name_, _symbol_) {}

    // CCIP - called in receive function
    function mint(address account, uint256 amount) public {
        _mint(account, amount);
    }
    // CCIP - called in receive function
    function burn(address account, uint256 amount) public {
        _burn(account, amount);
    }

    function _balanceOf(address account) public view returns (uint256) {
        return balanceOf(account);
    }

    function _name() public view returns (string memory) {
        return name();
    }
    
    function _symbol() public view returns (string memory) {
        return symbol();
    }
}
