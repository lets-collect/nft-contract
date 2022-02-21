//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ERC721Bollywood is ERC721Enumerable, Ownable {
    using Strings for uint256;
    uint256 public price;
    uint256 public maxSupply;
    event Withdraw(address indexed to, uint256 indexed amount);

    using Counters for Counters.Counter;
    uint256 private __tokenIncrement;
    string public baseURI;

    constructor(uint256 maxSupply_, string memory baseURI_)
        ERC721("Bollywood", "BLWD")
    {
        maxSupply = maxSupply_;
        __tokenIncrement = 0;
        setBaseURI(baseURI_);
        setPrice(0.2 ether);
    }

    function setBaseURI(string memory baseURI_) public onlyOwner {
        baseURI = baseURI_;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(_exists(tokenId), "URI query for nonexistent token");
        return
            bytes(baseURI).length > 0
                ? string(abi.encodePacked(baseURI, tokenId.toString(), ".json"))
                : "";
    }

    function setPrice(uint256 price_) public onlyOwner {
        require(price_ >= 0.01 ether, "Price is not valid");
        price = price_;
    }

    function nextToken() internal virtual returns (uint256) {
        uint256 tokenId = __tokenIncrement;
        __tokenIncrement = __tokenIncrement + 1;
        return tokenId;
    }

    function mint(uint256 amount) public payable {
        require(amount > 0, "Amount is not valid");
        require(msg.value == price * amount, "Price is not correct");
        require(
            totalSupply() + amount <= maxSupply,
            "Mint requested more than max supply"
        );
        for (uint256 i = 0; i < amount; i++) {
            uint256 id = nextToken();
            _safeMint(_msgSender(), id);
        }
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "Balance is not available");
        (payable(msg.sender)).transfer(balance);
        emit Withdraw(msg.sender, balance);
    }
}
