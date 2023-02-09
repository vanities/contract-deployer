import { DeployFunction } from "hardhat-deploy/types";
import { THardhatRuntimeEnvironmentExtended } from "../helpers/types/THardhatRuntimeEnvironmentExtended";
import { sleep } from "../helpers/sleep";

const func: DeployFunction = async (
  hre: THardhatRuntimeEnvironmentExtended
) => {
  const [account] = await hre.ethers.getSigners();
  const contractName = "";
  const contract = await hre.ethers.getContractFactory(contractName, account);

  const contractURI = "";
  const baseURI = ""; // with trailing splash

  const erc721 = await contract.deploy(contractURI, baseURI);
  await erc721.deployed();
  console.log("Contract deployed to:", erc721.address);

  console.log("waiting a minute to verify contract..");
  await sleep(60000);
  console.log("done waiting");

  try {
    await hre.run("verify:verify", {
      address: erc721.address,
      contract: `contracts/${contractName}.sol:${contractName}`,
      constructorArguments: [contractURI, baseURI],
    });
    console.log("Contract verified");
  } catch (e) {
    console.log(e);
  }
};
export default func;
