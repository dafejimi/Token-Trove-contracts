const {ethers} = require("ethers")
const { Web3, eth } = require("web3")
const {EvmChain, CommonEvmUtils, } = require("@moralisweb3/common-evm-utils")
const { default: Moralis, } = require("moralis")
const {EvmApi,  } = require("moralis").default
const eventAbi = require("./abi/eventAbi.json")

const bookmarkEvent = {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "id",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "postId",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "postURI",
        "type": "string"
      }
    ],
    "name": "BookmarkEvent",
    "type": "event"
}

const postEvent = {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "id",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "contentType",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "contentURI",
        "type": "string"
      }
    ],
    "name": "PostEvent",
    "type": "event"
}

const subscribeEvent = {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "id",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "subscriber",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tier",
        "type": "uint256"
      }
    ],
    "name": "SubscriptionEvent",
    "type": "event"
  }

const chain = EvmChain?.SEPOLIA
// const eventAbi = JSON.stringify(event.inputs[0])
const studioAddress1 = "0x2E4FE6AD683B62953f37F51A94c195D063CF60AD"
const studioAddress2 = "0x04DBE376110a08DbccCE4027534e33664A1FBe60"

async function getEventSignature(event) {
    const signature = eth.abi.encodeEventSignature({
        name: event.name,
        type: event.type,
        inputs: event.inputs,
    })
}


async function main() {
    const bookmarkSignature = getEventSignature(bookmarkEvent)
    const postSignature = getEventSignature(postEvent)
    const subscribeSignature = getEventSignature(subscribeEvent)
    
    await Moralis?.start({
        apiKey: process.env.MORALIS_API_KEY || "",
        // ...and any other configuration
    });
    
    const address1 = ethers.utils.getAddress(studioAddress1)
    const address2 = ethers.utils.getAddress(studioAddress2)
    
    const response1 = await EvmApi?.events?.getContractEvents({
        chain: chain,
        address: address1,
        abi: postEvent,
        topic: bookmarkSignature
    })

    const response2 = await EvmApi?.events?.getContractEvents({
        chain: EvmChain.GOERLI,
        address: address2,
        abi: postEvent,
        topic: bookmarkSignature
    })

    console.log("--------------------")
    console.log(response1.toJSON().result[0].data)
    console.log(response1.toJSON().result[1].data)
    console.log("--------------------")
    console.log(response2.toJSON().result[0])
    console.log(response2.toJSON().result[1].data)
  
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })