import hre from "hardhat";
import keccak256 from "keccak256";

export const CONTRACT_NAME = "ERC721A2";
export const TOKEN_NAME = "TEST";
export const TOKEN_SYMBOL = "TEST";
export const CONTRACT_URI = "ipfs://contractURI/";
export const URI = "ipfs://uri/";
export const PRICE = "0";

export async function mint(contract, amount, account, price = PRICE) {
  return await contract.connect(account).mint(amount, {
    value: hre.ethers.utils.parseUnits(price, "ether"),
  });
}

export async function deploy(owner) {
  const Token = await hre.ethers.getContractFactory(CONTRACT_NAME, owner);
  return await Token.deploy(TOKEN_NAME, TOKEN_SYMBOL, CONTRACT_URI, URI);
}
