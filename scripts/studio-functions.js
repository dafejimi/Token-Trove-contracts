const {ethers} = require("ethers")
const studioAbi = require("./abi/studio.json")

async function main() {
    const studioAddress_1 = process.env.STUDIO_ADDRESS_1 || "0x2E4FE6AD683B62953f37F51A94c195D063CF60AD"
    const studioAddress_2 = process.env.STUDIO_ADDRESS_2 || "0x7CB75Eff911960469668D96953bbdabF209A7111"
    const studioAddress_3 = process.env.STUDIO_ADDRESS_3 || "0x04DBE376110a08DbccCE4027534e33664A1FBe60"

    const optimismRPC = process.env.OPTIMISM_GOERLI_RPC_URL || ""
    const sepoliaRPC = process.env.SEPOLIA_RPC_URL || ""
    const privateKey = process.env.PRIVATE_KEY || ""

    const optimismProvider = new ethers.providers.JsonRpcProvider(optimismRPC)
    const sepoliaProvider = new ethers.providers.JsonRpcProvider(sepoliaRPC)

    const optimismWallet = new ethers.Wallet(privateKey, optimismProvider)
    const sepoliaWallet = new ethers.Wallet(privateKey, sepoliaProvider)

    const studioContract1 = new ethers.Contract(studioAddress_1, studioAbi, sepoliaWallet)
    const studioContract3 = new ethers.Contract(studioAddress_3, studioAbi, optimismWallet)

    const entryFee = ethers.utils.parseEther("0.02")
    
    const subscribeTx1 = await studioContract1.subscribe({value: entryFee, gasLimit: 150000})
    const subscribeReceipt1 = await subscribeTx1.wait(1)
    console.log(subscribeReceipt1)

    const subscribeTx3 = await studioContract3.subscribe({value: entryFee, gasLimit: 150000})
    const subscribeReceipt3 = await subscribeTx3.wait(1)
    console.log(subscribeReceipt3)

    const units = parseInt("2")
    const valueOfUnits = ethers.utils.parseEther("0.04")

    const getTokenTx1 = await studioContract1.getToken(units, {value: valueOfUnits})
    const getTokenReceipt1 = await getTokenTx1.wait(1)
    console.log(getTokenReceipt1)

    const getTokenTx3 = await studioContract3.getToken(units, {value: valueOfUnits})
    const getTokenReceipt3 = await getTokenTx3.wait(1)
    console.log(getTokenReceipt3)

    const interactionFee = ethers.utils.parseEther("0.001")
    const interactArgs = [
        {
            "id": "0xf91356533ef6452aac1fe1424e9e8314578fb7674d039895b9a213660357e474",
            "comment": "nice !!!"
        },
        {
            "id": "",
            "comment": "Great job"
        }
    ]

    const interactTx1 = await studioContract1.interact(ethers.utils.toUtf8Bytes(interactArgs[0].id), interactArgs[0].comment, {value: interactionFee})
    const interacionReceipt1 = await interactTx1.wait(1)
    console.log(interacionReceipt1)

    //const interactTx3 = await studioContract3.interact(interactArgs[1].id, interactArgs[1].comment, {value: interactionFee})
    //const interacionReceipt3 = await interactTx3.wait()
    //console.log(interacionReceipt3)

    // const post_ids = ["", ""]
    const mintPrice = ether.utils.parseEther("0.05")

    const bookmarkTx1 = await studioContract1.bookmark(ethers.utils.toUtf8Bytes(interactArgs[0].id))
    const bookmarkReceipt1 = await bookmarkTx1.wait(1)
    console.log(bookmarkReceipt1)

    //const bookmarkTx3 = await studioContract3.bookmark(post_ids[1])
    //const bookmarkReceipt3 = await bookmarkTx3.wait()
    //console.log(bookmarkReceipt3)

    const mintNftTx1 = await studioContract1.mintNft(ethers.utils.toUtf8Bytes(interactArgs[0].id), {value: mintPrice})
    const mintReceipt1 = await mintNftTx1.wait()
    console.log(mintReceipt1)

    //const mintNftTx3 = await studioContract1.mintNft(post_ids[1], {value: mintPrice})
    //const mintReceipt3 = await mintNftTx3.wait()
    //console.log(mintReceipt3)

    
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })