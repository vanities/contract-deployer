import * as assert from "assert";
import { expect } from "chai";
import keccak256 from "keccak256";
import hre from "hardhat";

import * as settings from "./index";
import { createSignature, mint } from "./index";

if (settings.CAN_MINT) {
  describe("Test ERC721 qualifiedMints", () => {
    let contract;
    let owner,
      account1,
      account2,
      maxMintAccount,
      mintLimitPerAddressAccount,
      signingAddressAccount,
      maxSupplyAccount;

    before(async () => {
      [
        owner,
        account1,
        account2,
        maxMintAccount,
        mintLimitPerAddressAccount,
        signingAddressAccount,
        maxSupplyAccount,
      ] = await hre.ethers.getSigners();
      contract = await settings.deploy(owner);
    });

    describe("qualifiedMint", async () => {
      const startingSupply = 0;

      it("address1 can make a mint", async () => {
        const amount = 1;
        const tx = await settings.mint(contract, amount, account1);

        expect(await contract.balanceOf(account1.address)).to.equal(amount);
        expect(await contract.totalSupply()).to.equal(amount);
        expect(await contract.qualifiedWalletList(account1.address)).to.equal(
          amount
        );
      });

      it("require amount to be <= than MAX_MINT", async () => {
        const maxMints = await contract.MAX_MINT();

        // test account1 cannot mint more in subsequent transations
        await expect(mint(contract, maxMints, account1)).to.be.revertedWith(
          "Exceeds max mints per transaction"
        );
        expect(await contract.balanceOf(account1.address)).to.equal(1);

        // test maxMintAmount account cannot mint more in a single transactions
        await expect(
          mint(contract, maxMints + 1, maxMintAccount)
        ).to.be.revertedWith("Exceeds max mints per transaction");
        expect(await contract.balanceOf(maxMintAccount.address)).to.equal(1);
        expect(await contract.totalSupply()).to.equal(1);
      });
    });
  });
}
