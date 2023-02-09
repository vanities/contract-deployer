// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";

/**
 * @title ERC721A Smart Contract
 */
contract ERC721A2 is
    ERC721A,
    ERC2981,
    Ownable,
    ReentrancyGuard
{
    event PaymentReceived(address from, uint256 amount);

    uint256 public immutable MAX_MINT = 1;
    uint256 public immutable MAX_SUPPLY = 10_000;
    uint256 public immutable PRICE = 0 ether;

    constructor(
        string memory name_,
        string memory symbol_,
        string memory contractURI_,
        string memory baseURI_
    )
        ERC721A(name_, symbol_)
        ERC2981()
    {
        _contractURI = contractURI_;
        _baseTokenURI = baseURI_;
        _setDefaultRoyalty(address(this), 750);
    }

    function mint(
        uint256 amount_
    ) external payable onlySaleIsActive nonReentrant {
        require(amount_ <= MAX_MINT, "Exceeds max mints per transaction");
        require(
            numberMinted(msg.sender) + amount_ <= MAX_MINT,
            "Minting limit exceeded"
        );
        require(totalSupply() + amount_ <= MAX_SUPPLY, "Exceeds max supply");
        require(PRICE * amount_ <= msg.value, "Insufficient payment");

        _safeMint(msg.sender, amount_);
    }

    function burn(uint256 tokenId) external {
        super._burn(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721A, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }


    function numberMinted(address owner) public view returns (uint256) {
      return _numberMinted(owner);
    }

    /* METADATA API */
    string private _contractURI;
    string private _baseTokenURI;

    /**
     * @dev Sets the contract URI.
     */
    function setContractURI(string memory contractURI_) external onlyOwner {
        _contractURI = contractURI_;
    }

    /**
     * @dev Gets the contract URI.
     */
    function contractURI() public view returns (string memory) {
        return _contractURI;
    }

    /**
     * @dev Gets the base URI.
     */
    function _baseURI() internal view virtual override returns (string memory) {
      return _baseTokenURI;
    }

    /**
     * @dev Sets the base URI.
     */
    function setBaseURI(string calldata baseURI) external onlyOwner {
      _baseTokenURI = baseURI;
    }

    /* PAYMENT */

    function withdraw() external onlyOwner nonReentrant {
      (bool success, ) = msg.sender.call{value: address(this).balance}("");
      require(success, "Transfer failed.");
    }

    receive() external payable virtual {
        emit PaymentReceived(_msgSender(), msg.value);
    }

    /* ACTIVATE */

    bool public saleIsActive = true;

    modifier onlySaleIsActive() {
        require(saleIsActive, "Sale not active");
        _;
    }

    /**
     * @dev Enables or disables the minting process.
     */
    function setSaleIsActive(bool saleIsActive_) external onlyOwner {
        saleIsActive = saleIsActive_;
    }
}
