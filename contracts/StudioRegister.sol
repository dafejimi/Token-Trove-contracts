// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./StudioAlias.sol";
import "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.0/token/ERC20/IERC20.sol";
import "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";

contract StudioRegister is CCIPReceiver, StudioAlias {
    string public chain;
    StudioAlias public _studioAlias;

    struct Studio {
        bytes32 studioId;
        string studioName;
        string thumbnailURI;
        string avatarURI;
        string chain;
        string descriptiveText;
        string creatorAlias;
        address creator;
        address studioAddress;
        address nftAddress;
        address tokenAddress;
    }

    event StudioEvent (
        bytes32 indexed studio_id,
        string indexed studioName,
        string thumbnailURI,
        string avatarURI,
        string chain,
        string descriptiveText,
        string creatorAlias,
        address creator,
        address indexed studioAddress,
        address studioTokenAddress,
        address nftAddress
    );

    mapping (address => Studio) public studioMap;

    constructor(address _aliasContract, address _router) CCIPReceiver(_router) {
        _studioAlias = StudioAlias(_aliasContract);
    }

    // CCIP call - called from receive function.
    function logStudio(
        string memory _name,
        string memory _thumbnailURI,
        string memory _avatarURI,
        string memory _chain,
        string memory _descriptiveText,
        address _creator,
        address _studio,
        address _nft,
        address _token
    ) public {

        bytes32 id = keccak256(
            abi.encodePacked(_name, _thumbnailURI, _avatarURI, _chain, _descriptiveText, _creator, _studio, _token)
        );

        string memory _creatorAlias = getAddressedAlias(_creator);

        studioMap[_creator] = Studio(id, _name, _thumbnailURI, _avatarURI, _chain, _descriptiveText, _creatorAlias, _creator, _studio, _nft, _token);

        emit StudioEvent(id, _name, _thumbnailURI, _avatarURI, _chain, _descriptiveText, _creatorAlias, _creator, _studio, _token, _nft);
    }

    function getStudio(address creator) public view returns (Studio memory) {
        Studio memory studio = studioMap[creator];

        return studio;
    }

    // CCIP - called in receive
    function getStudioName(address creator) public view returns (string memory) {
        Studio memory studio = getStudio(creator);

        return studio.studioName;
    }
    // CCIP - called in receive
    function getStudioAddress(address creator) public view returns (address) {
        Studio memory studio = getStudio(creator);

        return studio.studioAddress;
    }

    // CCIP - called in receive
    function getStudioTokenAddress(address creator) public view returns (address) {
        Studio memory studio = getStudio(creator);

        return studio.nftAddress;
    }

    function getStudioNftAddress(address creator) public view returns (address) {
        Studio memory studio = getStudio(creator);

        return studio.nftAddress;
    }

    function getStudioChain(address creator) public view returns (string memory) {
        Studio memory studio = getStudio(creator);

        return studio.chain;
    }

    function _setAlias(string memory _alias, string memory _avatarURI) public {
        _studioAlias.setAlias(_alias, _avatarURI);
    }

    function _getAlias() public view returns (string memory ) {
       return  _studioAlias.getAlias(msg.sender);
    }

    function getAddressedAlias(address account) public view returns (string memory) {
        return  _studioAlias.getAlias(account);
    }

    function getAddressedAvatar(address account) public view returns (string memory) {
        return  _studioAlias.getAliasURI(account);
    }

    function _getAliasAvatar() public view returns (string memory ) {
       return  _studioAlias.getAliasURI(msg.sender);
    }

    function _isAliasSet() public view returns (bool) {
        return _studioAlias.isAliasSet(msg.sender);
    }

    function _ccipReceive(
        Client.Any2EVMMessage memory message
    ) internal virtual override {
        (string memory studioName, 
        string memory thumbnailURI, 
        string memory avatarURI, 
        string memory _chain, 
        string memory descriptiveText,
        address _creator, 
        address studioAddress, 
        address nftAddress,
        address tokenAddress ) = abi.decode(message.data, (string, string, string, string, string, address, address, address, address));

        logStudio(studioName, thumbnailURI, avatarURI, _chain, descriptiveText, _creator, studioAddress, nftAddress, tokenAddress);
    }
}