// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./StudioTokenERC721.sol";
import "./StudioTokenERC20.sol";
import "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";

error Studio_Logged();
error Studio_WithdrawalError();

contract Studio {

    string public chain;
    string private studioName;
    string public avatarURI;
    string public thumbnailURI;
    string public descriptiveText;

    uint256 public entryFee;
    uint256 public unitPrice;
    uint256 public initialCount = 0;
    uint256 public subscriberCount;

    address public studioAddress;
    address public nftAddress;
    address public tokenAddress;
    address public i_router;
    address public deployer;

    StudioTokenERC721 public nft;
    StudioTokenERC20 public token;

    bool isLogged = false;
    
    struct Status {
        bool subscribed;
        uint256 balance;
    }

    struct Post {
        string title;
        string contentType;
        string contentURI;
        uint256 interactionCost;
        uint256 nftPrice;
        uint256 interactionCount;
    }

    struct NftData {
        address account;
        string contentURI;
        string nftURI;
    }

    struct Interaction {
        address account;
        bytes32 postId;
        string comment;
    }

    struct Bookmark {
        bytes32 postId;
        string postURI;
    }

    event SubscriptionEvent (
        bytes32 id,
        address subscriber,
        uint256 tier
    );

    event PostEvent (
        bytes32 id,
        string title, 
        string contentType,
        string contentURI
    ); 

    event NftDataEvent (
        bytes32 id,
        address account,
        string contentURI,
        string nftURI
    );

    event InteractionEvent (
        bytes32 id,
        address account,
        bytes32 post_id,
        string comment
    );

    event BookmarkEvent (
        bytes32 id,
        address account,
        bytes32 postId,
        string postURI
    );

    event LogStudioMessageSent(string message, bytes32 messageId);

    //TODO: make subscriber tiers
    mapping (address => Status) public subscribers;
    mapping (bytes32 => Post) public posts;
    mapping (bytes32 => NftData) public NFTsMap;
    mapping (bytes32 => Interaction) public interactions;
    mapping (address => Bookmark) public bookmarks;

    modifier studioLogged() {
        if(isLogged == true) {revert Studio_Logged();}
        _;
    }

    modifier onlyDeployer() {
        if(deployer != msg.sender) {revert Studio_WithdrawalError();}
        _;
    }

    // send studio data in constructor
    constructor (address _nftAddress, address _tokenAddress,address _router, string memory _avatarURI, string memory _thumbnailURI, string memory _chain, string memory _studioName, string memory _descriptiveText, uint256 _entryFee, uint256 _unitPrice) {
        nftAddress = _nftAddress;
        tokenAddress = _tokenAddress;
        i_router = _router;
        deployer = msg.sender;
        studioName = _studioName;
        descriptiveText = _descriptiveText;
        entryFee = _entryFee * 1 ether;
        chain = _chain;
        avatarURI = _avatarURI;
        thumbnailURI = _thumbnailURI;
        unitPrice = _unitPrice * 1 ether;
        nft = StudioTokenERC721(_nftAddress);
        token = StudioTokenERC20(_tokenAddress);
    }

    // front end
    function subscribe() public payable {
        require(msg.value == entryFee, "Insufficient payment");

        bytes32 id = keccak256(abi.encodePacked(msg.sender, "true", "0"));
        subscribers[msg.sender] = Status(true, 0);
        subscriberCount++;

        emit SubscriptionEvent(id, msg.sender, 0);

    }
    
    // front end (also uploads post v)
    function post(string memory _title, string memory _type, string memory _contentURI, uint256 _interactionCost, uint256 _nftPrice) public onlyDeployer {
        bytes32 id = keccak256(abi.encodePacked(_title, _contentURI));

        posts[id] = Post(_title, _type, _contentURI, _interactionCost, _nftPrice, initialCount);

        emit PostEvent(id, _title, _type, _contentURI);
    }

    function updatePostNftPrice(uint256 newPrice, bytes32 id) public view {
        Post memory _post = getPost(id);
        _post.nftPrice = newPrice;
    }
    
    // front end
    function interact(bytes32 _postId, string memory _comment ) public {
        spendTokenOnInteraction(_postId);
        incrementCount(_postId);

        bytes32 id = keccak256(abi.encodePacked(_postId, msg.sender, _comment));

        interactions[id] = Interaction(msg.sender, _postId, _comment);

        emit InteractionEvent(id, msg.sender, _postId, _comment);
    }

    function bookmark(bytes32 post_id) public {
        Post memory _post = getPost(post_id);
        string memory _postURI = _post.contentURI;
        bytes32 id = keccak256(abi.encodePacked(post_id, msg.sender, _postURI));

        bookmarks[msg.sender] = Bookmark(post_id, _postURI);

        emit BookmarkEvent(id, msg.sender, post_id, _postURI);
    }

    function isSubscriber() public view returns (bool) {
        bool _status = subscribers[msg.sender].subscribed;
        return _status;
    }

    function incrementCount(bytes32 _postId ) public view {
        Post memory _post = getPost(_postId);
        _post.interactionCount++;
    }

    function setStudioAddress(address account) public {
       studioAddress = account;
    }

    function getSubscriberCount() public view returns (uint256) {
        return subscriberCount;
    }

    function getStudioName() public view returns (string memory) {
        return studioName;
    }

    function getPost(bytes32 id) public view returns (Post memory) {
        Post memory _post = posts[id];
        return _post;
    }

    function getNftData(bytes32 id) public view returns (NftData memory) {
        NftData memory _nftdata = NFTsMap[id];
        return _nftdata;
    }
    function getInteraction(bytes32 id) public view returns (Interaction memory) {
        Interaction memory _interaction = interactions[id];
        return _interaction;
    }

    // front end
    function getToken(uint256 units) public payable {
        uint256 amountInEther = units * unitPrice * 1 ether;
        require (msg.value == amountInEther, "Insufficient payment.");
        token.mint(msg.sender, units);

        Status memory _status = subscribers[msg.sender];
        _status.balance += units;
    }

    function getTokenBalance(address account) public view returns (uint256) {
        uint256 balance = subscribers[account].balance;
        return balance;
    }
    
    function spendTokenOnInteraction(bytes32 _id) public {
        Status memory _status = subscribers[msg.sender];
        Post memory _post = posts[_id];
        uint256 cost = _post.interactionCost;

        require(_status.balance >= cost, "Insufficient Token Balance");
        token.burn(msg.sender, cost);
        _status.balance -= cost;
    }

    function spendTokenOnNft(bytes32 _id, address account) public {
        Status memory _status = subscribers[account];
        Post memory _post = posts[_id];
        uint256 price = _post.nftPrice;

        require(_status.balance >= price, "Insufficient Token Balance");
        token.burn(account, price);
        _status.balance -= price;
    }


    function mintNft(bytes32 postId, address account, string memory nftURI) public {
        spendTokenOnNft(postId, account);

        Post memory _post = getPost(postId);
        string memory postURI = _post.contentURI;

        bytes32 id = keccak256(abi.encodePacked(postURI, msg.sender));

        NFTsMap[id] = NftData(account, postURI, nftURI);

        nft.mint(account, nftURI);

        emit NftDataEvent(id, account, postURI, nftURI);
    }
    
    // better ways to get deployer address
    function handleLogStudio(address _registerContract, uint256 destinationChainSelector) public studioLogged {
        uint64 chainSelector = uint64(destinationChainSelector);
        bytes memory _data = abi.encode(studioName, thumbnailURI, avatarURI, chain, descriptiveText,  deployer, studioAddress, nftAddress, tokenAddress); 
        Client.EVM2AnyMessage memory message = buildCCIPMessage(_registerContract, _data);

        uint256 fee = IRouterClient(i_router).getFee(
            chainSelector,
            message
        );

        bytes32 messageId;

        messageId = IRouterClient(i_router).ccipSend{value: fee}(
            chainSelector,
            message
        );

        isLogged = true;

        emit LogStudioMessageSent("Studio Logged",messageId);
    }

    function buildCCIPMessage(address _receiver, bytes memory _data) public pure returns (Client.EVM2AnyMessage memory) {
        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(_receiver),
            data: _data,
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: "",
            feeToken: address(0)
        });

        return message;
    }

    function withdraw() public payable onlyDeployer returns (bool) {
    (bool success, ) = payable(msg.sender).call{value: address(this).balance}("");
        return success;
    }
}