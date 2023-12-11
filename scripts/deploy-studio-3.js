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
require("dotenv").config()

async function main() {
    const registerAddress = process.env.REGISTER_ADDRESS || "0xFd621e71b5aEcBb389702F79B540d76Ad6eE8Fd2"
    const chainselector = process.env.AVALANCHE_CHAIN_SELECTOR || "14767482510784806043"

    const optimismRPC = process.env.OPTIMISM_GOERLI_RPC_URL || ""
    const privateKey = process.env.PRIVATE_KEY || ""
    const routerAddress = process.env.OPTIMISM_GOERLI_ROUTER || "0xeb52e9ae4a9fb37172978642d4c141ef53876f26"
    const thumbnailURI = "QmYP7hZicPnj2EL6e7NcAKv5CTDteZTtAKPByoBeBbGsQs"
    const avatarURI = "QmRdu8UPDyTBekx1rPF8LUorzQdpTwUGiqVbND46c1KBJC"
    const chain = "Optimism Goerli"
    const studioName = "Zic Sports"
    const descriptiveText = "This studio offers content that cut accross all sports, jump in and let's engage."
    const entryFee = parseInt("0.002")
    const unitPrice = parseInt("0.001")

    //const studioAbi = studio.abi[0]
    //const studioBytecode = studio.bytecode

    //const studioERC20Abi = studioERC20.abi[0]
    //const studioERC20Bytecode = studioERC20.bytecode

    //const studioERC721Abi = studioERC721.abi[0]
    //const studioERC721Bytecode = studioERC721.bytecode

    let provider = new ethers.providers.JsonRpcProvider(optimismRPC)

    let wallet = new ethers.Wallet(privateKey, provider)
    let address = wallet.getAddress()

    const tokenContractFactory = new ethers.ContractFactory(studioERC20Abi, studioERC20Bytecode.bytecode, wallet)
    const nftContractFactory  = new ethers.ContractFactory(studioERC721Abi, studioERC721Bytecode.bytecode, wallet)
    const studioContractFactory = new ethers.ContractFactory(studioAbi, studioBytecode.bytecode, wallet)
    const tokenArgs = ["ZICO_TOKEN", "ZICO"]
    
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

    let logStudioTx = await studioContract.handleLogStudio(ethers.utils.getAddress(registerAddress), ethers.BigNumber.from(chainselector))
    let logStudioReceipt = await logStudioTx.wait(1)
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
 *  Token Contract 0xAFCad32235F8e8095A2EA12d9BB93542BE89584C
    NFT Contract  0xFd621e71b5aEcBb389702F79B540d76Ad6eE8Fd2
    Studio Contract deployed to 0x04DBE376110a08DbccCE4027534e33664A1FBe60
 */