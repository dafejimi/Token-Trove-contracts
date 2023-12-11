const {ethers} = require("ethers")
const { Web3, eth } = require("web3")
const {EvmChain, CommonEvmUtils, } = require("@moralisweb3/common-evm-utils")
const { default: Moralis, } = require("moralis")
const {EvmApi,  } = require("moralis").default
const eventAbi = require("./abi/eventAbi.json")

const event = {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "studio_id",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "string",
        "name": "studioName",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "thumbnailURI",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "avatarURI",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "chain",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "descriptiveText",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "creatorAlias",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "studioAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "studioTokenAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "nftAddress",
        "type": "address"
      }
    ],
    "name": "StudioEvent",
    "type": "event"
  }

const chain = EvmChain?.MUMBAI
// const eventAbi = JSON.stringify(event.inputs[0])
const registerAddress = "0xc9B80C3189636825f8F752F68F1425C2a1619eE8"





async function main() {

    const signature = eth.abi.encodeEventSignature({
        name: event.name,
        type: event.type,
        inputs: event.inputs,
    })
    
    await Moralis?.start({
        apiKey: process.env.MORALIS_API_KEY || "",
        // ...and any other configuration
    });
    
    const address = ethers.utils.getAddress(registerAddress)
    
    const response = await EvmApi?.events?.getContractEvents({
        chain: chain,
        address: address,
        abi: event,
        topic: signature
    })

    console.log("--------------------")
    console.log(response.toJSON().result[0].data)
    console.log(response.toJSON().result[1].data)
    console.log(response.toJSON().result[2].data)
  
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })