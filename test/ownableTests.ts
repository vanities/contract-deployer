import * as assert from "assert";
import { expect } from "chai";
import hre from "hardhat";

import * as settings from "./index";

describe("Test ERC721 Ownable", () => {
  let contract;
  let owner, newOwner, nonOwner;

  before(async () => {
    [owner, newOwner, nonOwner] = await hre.ethers.getSigners();
    contract = await settings.deploy(owner);
  });

  describe("Ownable", async () => {
    it("owner can set owner", async () => {
      expect(await contract.owner()).to.equal(owner.address);

      await contract.connect(owner).transferOwnership(newOwner.address);

      expect(await contract.owner()).to.equal(newOwner.address);
    });
    it("non-owner cannot set owner", async () => {
      expect(await contract.owner()).to.equal(newOwner.address);

      await expect(
        contract.connect(nonOwner).transferOwnership(newOwner.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");

      expect(await contract.owner()).to.equal(newOwner.address);
    });
  });
});
