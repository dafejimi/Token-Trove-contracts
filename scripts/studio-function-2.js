const {ethers} = require("ethers")
const studioAbi = require("./abi/studio.json")

async function main() {
    const studioAddress_1 = process.env.STUDIO_ADDRESS_1 || "0x2E4FE6AD683B62953f37F51A94c195D063CF60AD"
    //const studioAddress_2 = process.env.STUDIO_ADDRESS_2 || "0x7CB75Eff911960469668D96953bbdabF209A7111"
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

    const posts = [
        {
            "title": "Icons we love",
            "type": "jpg",
            "URI": "QmPeHz6pHvJXU6w9tcMmNkDh2qp5w8RXprSGyKa77jpaAU",
            "interaction_cost": "0.001",
            "nft_price": "0.05"
        },
        {
            "title": "Countdown to our live game day",
            "type": "jpg",
            "URI": "QmQJE5ex2S99zQ16ZS2Aw1dWTpspKwrMHYsNmYJGAMRaWg",
            "interaction_cost": "0.01",
            "nft_price": "0.05"
        }
    ]

    const postTx1 = await studioContract1.post(posts[0].title, posts[0].type, posts[0].URI, parseInt(posts[0].interaction_cost), parseInt(posts[0].nft_price))
    const postReceipt1 = await postTx1.wait(1)
    console.log(postReceipt1)

    const postTx3 = await studioContract3.post(posts[1].title, posts[1].type, posts[1].URI, parseInt(posts[1].interaction_cost), parseInt(posts[1].nft_price))
    const postReceipt3 = await postTx3.wait(1)
    console.log(postReceipt3)

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })