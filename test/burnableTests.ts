import * as assert from "assert";
import { expect } from "chai";
import hre from "hardhat";

import { deploy, mint } from "./index";

describe("Test ERC721 Burnable", () => {
  let contract;
  let owner, account1, account2;

  before(async () => {
    [owner, account1, account2] = await hre.ethers.getSigners();
    contract = await deploy(owner);
  });

  it("users can burn tokens", async () => {
    const id = 0;
    const amount = 1;
    await mint(contract, amount, account1);

    expect(await contract.balanceOf(account1.address)).to.equal(1);
    await contract.connect(account1).burn(id);
    expect(await contract.balanceOf(account1.address)).to.equal(0);
  });
});
