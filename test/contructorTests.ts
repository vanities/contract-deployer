import * as assert from "assert";
import { expect } from "chai";
import hre from "hardhat";

import * as settings from "./index";

describe("Test Contract Deployment & Constructor", () => {
  let contract;
  let owner, nonOwner;

  before(async () => {
    [owner, nonOwner] = await hre.ethers.getSigners();
    contract = await settings.deploy(owner);
  });

  describe("Deployment", async () => {
    it("deploys successfully", async () => {
      const address = contract.address;
      expect(address).to.not.equal("");
      expect(address).to.not.equal(null);
      expect(address).to.not.equal(undefined);
    });
    it("check token name", async () => {
      expect(await contract.name()).to.equal(settings.TOKEN_NAME);
    });

    it("check token symbol", async () => {
      expect(await contract.symbol()).to.equal(settings.TOKEN_SYMBOL);
    });

    it("check contract uri", async () => {
      expect(await contract.contractURI()).to.equal("ipfs://contractURI/");
    });

    it("check token uri", async () => {
      await settings.mint(contract, 1, nonOwner);
      expect(await contract.tokenURI(0)).to.equal("ipfs://uri/0");
    });
  });
});
