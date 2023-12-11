// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract StudioTokenERC721 is ERC721URIStorage {
    uint256 public tokenId;

    event MintCallSuccess(bytes32 messageId, address _owner, string uri);

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
    }
    // CCIP - called in receive function
    function mint(address recipient, string memory _tokenURI_) public returns (uint256) {
        tokenId++;
        uint256 newTokenId = tokenId;
        _mint(recipient, newTokenId);
        _setTokenURI(newTokenId, _tokenURI_);
        return newTokenId;
    }

    function latestTokenId() public view returns (uint256) {
        return tokenId;
    }

    function _tokenURI(uint256 _tokenId) public view returns (string memory) {
        return tokenURI(_tokenId);
    }

}

