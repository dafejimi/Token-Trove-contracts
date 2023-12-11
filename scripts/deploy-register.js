const ethers = require("ethers")
const registerAbi = require("./abi/register.json")
const registerBytecode = require("./bytecode/register.json")

async function main() {
    const avalancheRPC = process.env.SEPOLIA_RPC_URL || ""
    const privateKey = process.env.PRIVATE_KEY || ""
    const routerAddress = process.env.AVALANCHE_ROUTER || "0x554472a2720e5e7d5d3c817529aba05eed5f82d8"

    let provider = new ethers.providers.JsonRpcProvider(avalancheRPC)
    let wallet = new ethers.Wallet(privateKey, provider)

    const registerContractFactory  = new ethers.ContractFactory(registerAbi, registerBytecode.bytecode, wallet)
    const aliasAddress = ethers.utils.getAddress("0xAFCad32235F8e8095A2EA12d9BB93542BE89584C")
    const router = ethers.utils.getAddress(routerAddress)
    const registerContract = await registerContractFactory.deploy(aliasAddress, router)
    console.log(registerContract.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
