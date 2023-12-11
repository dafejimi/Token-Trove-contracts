// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

contract StudioAlias {

    struct Alias {
        string _alias;
        string _avatarURI;
        bool isSet;
    }

    event AliasEvent (
        bytes32 indexed id,
        address indexed account,
        string _alias,
        string _avatarURI
    );

    mapping (address => Alias) public aliases;
    constructor() {
        
    }

    function setAlias(string memory _alias_, string memory _avatarURI_) public {
        bytes32 id = keccak256(abi.encodePacked(msg.sender, _alias_, _avatarURI_));

        aliases[msg.sender] = Alias(_alias_, _avatarURI_, true);

        emit AliasEvent(id, msg.sender, _alias_, _avatarURI_);
    }

    function getAlias(address account) public view returns (string memory) {
        string memory _alias = aliases[account]._alias;

        return _alias;
    }

    function getAliasURI(address account) public view returns (string memory){
        string memory _aliasURI = aliases[account]._avatarURI;

        return _aliasURI;
    }

    function isAliasSet(address account) public view returns (bool) {
        bool _aliasStatus = aliases[account].isSet;
        
        if(_aliasStatus) {
            return true;
        } else {
            return false;
        }
    }
}