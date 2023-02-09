import * as assert from "assert";
import { expect } from "chai";
import hre from "hardhat";

import * as settings from "./index";

describe("Test ERC721 payable", () => {
  let contract;
  let owner;

  before(async () => {
    [owner] = await hre.ethers.getSigners();
    contract = await settings.deploy(owner);
  });

  describe("payable()", async () => {
    it("account can send ether to contract", async () => {
      await owner.sendTransaction({
        to: contract.address,
        value: hre.ethers.utils.parseEther("1.0"),
      });
      expect(
        hre.ethers.utils.formatEther(
          await hre.ethers.provider.getBalance(contract.address)
        )
      ).to.equal("1.0");
    });
  });
});
