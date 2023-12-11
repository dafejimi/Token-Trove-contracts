// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const studioAbi = require("./abi/studio.json")
const studioBytecode = require("./bytecode/studio.json")
const studioERC20Abi = require("./abi/studioERC20.json")
const studioERC20Bytecode = require("./bytecode/studioERC20.json")
const studioERC721Abi = require("./abi/studioERC721.json")
const studioERC721Bytecode = require("./bytecode/studioERC721.json")
const ethers = require("ethers");
const { parseUnits } = require("ethers/lib/utils")
require("dotenv").config()

async function main() {
  const registerAddress = process.env.REGISTER_ADDRESS || "0xFd621e71b5aEcBb389702F79B540d76Ad6eE8Fd2"
  const chainselector = process.env.AVALANCHE_CHAIN_SELECTOR || "14767482510784806043"
  const sepoliaRPC = process.env.SEPOLIA_RPC_URL || ""
  const privateKey = process.env.PRIVATE_KEY || ""
  const routerAddress = process.env.SEPOLIA_ROUTER || "0xd0daae2231e9cb96b94c8512223533293c3693bf"
  const thumbnailURI = "QmNwaCLsGigREyzuKXvvgcyHEUVwCiNuqvsLBkWXxdgWQZ"
  const avatarURI = "QmNbAwUQt7YUXqafzvwVUcNuMg2MQDcLXaYGwSZf8dUJEB"
  const chain = "Sepolia"
  const studioName = "Dafe loves Games"
  const descriptiveText = "Are you a diehard gamer, then join in on the fun with us e-sports is all we do."
  const entryFee = parseInt("0.02")
  const unitPrice = parseInt("0.001")

  //const studioAbi = studio.abi[0]
  //const studioBytecode = studio.bytecode

  //const studioERC20Abi = studioERC20.abi[0]
  //const studioERC20Bytecode = studioERC20.bytecode

  //const studioERC721Abi = studioERC721.abi[0]
  //const studioERC721Bytecode = studioERC721.bytecode
  

  let provider = new ethers.providers.JsonRpcProvider(sepoliaRPC)

  let wallet = new ethers.Wallet(privateKey, provider)
  let address = wallet.getAddress()

  const tokenContractFactory = new ethers.ContractFactory(studioERC20Abi, studioERC20Bytecode.bytecode, wallet)
  const nftContractFactory  = new ethers.ContractFactory(studioERC721Abi, studioERC721Bytecode.bytecode, wallet)
  const studioContractFactory = new ethers.ContractFactory(studioAbi, studioBytecode.bytecode, wallet)
  const tokenArgs = ["DAFE_TOKEN", "DAFE"]
  
  console.log("Deploying Token Contract, please wait...")
  const tokenContract = await tokenContractFactory.deploy(tokenArgs[0], tokenArgs[1])
  // const contract = await contractFactory.deploy({ gasPrice: 100000000000 })
  const tokenDeploymentReceipt = await tokenContract.deployTransaction.wait(1)
  console.log(`Contract deployed to ${tokenContract.address}`)

  console.log("Deploying NFT Contract, please wait...")
  const nftContract = await nftContractFactory.deploy(tokenArgs[0], tokenArgs[1])
  const nftDepoloymentReceipt = await nftContract.deployTransaction.wait(1)
  console.log(`Contract deployed to ${nftContract.address}`)

  console.log("Deploying Studio Contract, please wait...")
  const studioArgs = [nftContract.address, tokenContract.address, routerAddress, avatarURI, thumbnailURI, chain, studioName, descriptiveText, entryFee, unitPrice ]
  const studioContract = await studioContractFactory.deploy(studioArgs[0], studioArgs[1], studioArgs[2], studioArgs[3], studioArgs[4], studioArgs[5], studioArgs[6], studioArgs[7], studioArgs[8], studioArgs[9])
  const studioDeploymentReceipt = await studioContract.deployTransaction.wait(1)
  console.log(`Contract deployed to ${studioContract.address}`)

  let setStudioAddressTx = await studioContract.setStudioAddress(studioContract.address)
  let setStudioAddressReceipt=  await setStudioAddressTx.wait()
  console.log(setStudioAddressReceipt)
  
  let logStudioTx = await studioContract.handleLogStudio(ethers.utils.getAddress(registerAddress), ethers.BigNumber.from(chainselector), {gasLimit: 10000000})
  let logStudioReceipt = await logStudioTx.wait()
  console.log(logStudioReceipt)



}
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })

  
  /** 
   *Token Contract 0xd0a13375f8EDc853236709282A27a89adc6b3502
    
    NFT Contract 0x9362c683301B015aF5B649111bD94A8e94e3AE8E

    Studio Contract 0x2E4FE6AD683B62953f37F51A94c195D063CF60AD
  */