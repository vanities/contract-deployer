import * as ethers from "ethers";
import * as path from "path";
import { HardhatUserConfig, task } from "hardhat/config";
import { Web3Storage, getFilesFromPath } from "web3.storage";

task(
  "generate",
  "creates and prints out a random account.",
  async (taskArgs, hre) => {
    const account = hre.ethers.Wallet.createRandom();
    console.log("Private Key:", account._signingKey().privateKey);
    console.log("Public Key:", account._signingKey().publicKey);
    console.log("Public Address", account.address);
    console.log("Mnemonic:", account._mnemonic().phrase);
  }
);

task("upload", "uploads to ipfs.")
  .addVariadicPositionalParam("files")
  .setAction(async (taskArgs, hre) => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDg0NjVhYTVjOTVmMzY3M2U2M0Y0MWVGNTVEMkM1RTdhNjcyNUQ0NDAiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjU0NDc1MDAwMzUsIm5hbWUiOiJvcGVuMyJ9.wX7cjEecSIXIStIUQBvGmSYIG8nkxH5qv5PWO2anZxk";
    const files = await getFilesFromPath(taskArgs.files);

    console.log(`Uploading ${files.length} files`);
    const storage = new Web3Storage({ token });
    const cid = await storage.put(files);
    console.log("Content added with CID:", cid);
  });
