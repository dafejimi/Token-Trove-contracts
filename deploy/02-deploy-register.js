const { network, ethers } = require("hardhat")
const {
  networkConfig,
  VERIFICATION_BLOCK_CONFIRMATIONS
} = require("../helper-hardhat-config")

const deployRegisterContract = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log, get } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId

  const aliasAddress = networkConfig[chainId]["alias"]
  const routerAddress = networkConfig[chainId]["router"]
  
  const args = [
    aliasAddress,
    routerAddress
  ]
  
  log("----------------------------------------------------")
  log("Deploying Register Contract and waiting for confirmations...")

  const registerContract = await deploy("StudioRegister", {
    from: deployer,
    args: args, 
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: VERIFICATION_BLOCK_CONFIRMATIONS || 1,
  })

  networkConfig[chainId]["register"] = registerContract.address
  log(`Register Contract at ${registerContract.address}`)

  //if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
  //  await verify(registerContract.address, args)
  //}
}

module.exports = deployRegisterContract
