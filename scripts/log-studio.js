const ethers = require("ethers")
const studioAbi = require("./abi/studio.json")
const registerAbi = require("./abi/register.json")

async function main() {
    const registerAddress = process.env.REGISTER_ADDRESS || "0xa60B51B671F10F740FccF2AC883B3439a77e6c01"
    const chainselector = process.env.AVALANCHE_CHAIN_SELECTOR || "14767482510784806043"
    const sepoliaRPC = process.env.SEPOLIA_RPC_URL || ""
    const privateKey = process.env.PRIVATE_KEY || ""
    let provider = new ethers.providers.JsonRpcProvider(sepoliaRPC)
    let wallet = new ethers.Wallet(privateKey, provider)
    const studioAddress_1 = "0x2E4FE6AD683B62953f37F51A94c195D063CF60AD"
    const studioAddress_2 = "0x7CB75Eff911960469668D96953bbdabF209A7111"
    const studioAddress_3 = "0x04DBE376110a08DbccCE4027534e33664A1FBe60"
    const register = new ethers.Contract(registerAddress, registerAbi, wallet);
    const studio1 = new ethers.Contract(studioAddress_1, studioAbi, wallet);
    const studio2 = new ethers.Contract(studioAddress_2, studioAbi, wallet);
    const studio3 = new ethers.Contract(studioAddress_3, studioAbi, wallet);


    //let setStudioAddressTx = await studio.setStudioAddress(studioAddress)
    //let setStudioAddressReceipt = await setStudioAddressTx.wait(1)
    //console.log(setStudioAddressReceipt)
    //const setAliasTx = await register._setAlias("Dafe", "QmNbAwUQt7YUXqafzvwVUcNuMg2MQDcLXaYGwSZf8dUJEB", {gasLimit: 15000000})
    //const setAliasReceipt = await setAliasTx.wait(1)
    //console.log(setAliasReceipt)

    const logStudio1Tx = await studio1.handleLogStudio(ethers.utils.getAddress(registerAddress), ethers.BigNumber.from(chainselector), {gasLimit: 15000000})
    let logStudio1Receipt = await logStudio1Tx.wait(1)
    console.log(logStudio1Receipt)
  
    const logStudio2Tx = await studio2.handleLogStudio(ethers.utils.getAddress(registerAddress), ethers.BigNumber.from(chainselector), {gasLimit: 15000000})
    let logStudio2Receipt = await logStudio2Tx.wait(1)
    console.log(logStudio2Receipt)

    const logStudio3Tx = await studio1.handleLogStudio(ethers.utils.getAddress(registerAddress), ethers.BigNumber.from(chainselector), {gasLimit: 15000000})
    let logStudio3Receipt = await logStudio3Tx.wait(1)
    console.log(logStudio3Receipt)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })

/**
 * 
 */