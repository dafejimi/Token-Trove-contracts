const { network, ethers } = require("hardhat")
const {
  networkConfig, 
  VERIFICATION_BLOCK_CONFIRMATIONS
} = require("../helper-hardhat-config")

const deployAliasContract = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log, get } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId
  
  log("----------------------------------------------------")
  log("Deploying Alias Contract and waiting for confirmations...")

  const aliasContract = await deploy("StudioAlias", {
    from: deployer,
    args: [], 
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: VERIFICATION_BLOCK_CONFIRMATIONS || 1,
  })

  networkConfig[chainId]["alias"] = aliasContract.address
  log(`StudioAlias at ${aliasContract.address}`)

  //if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
  //    await verify(aliasContract.address, args)
  //}
}

module.exports = deployAliasContract

