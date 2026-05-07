import { ethers } from "hardhat";

async function main() {
  console.log("Deploying Voting contract...");

  const Voting = await ethers.getContractFactory("Voting");
  const voting = await Voting.deploy();

  await voting.waitForDeployment();

  const deployedAddress = await voting.getAddress();

  console.log("Voting contract deployed to:", deployedAddress);
  console.log("\nAdd this address to your .env file as CONTRACT_ADDRESS");

  // Verify on Sepolia (optional)
  if (process.env.ETHERSCAN_API_KEY) {
    console.log("\nWaiting for block confirmations...");
    await new Promise((resolve) => setTimeout(resolve, 30000)); // Wait 30 seconds

    console.log("Verifying contract on Etherscan...");
    // Implementation for verification
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
