const {
    aliasAbi,
    registerAbi,
    addresses,
    networkConfig
} = require("../helper-hardhat-config")
require("dotenv").config()
const fs = require("fs")
const { network, ethers } = require("hardhat")

module.exports = async () => {
    console.log("Writing to front end...")
    await updateContractAddresses()
    await updateAbi()
    console.log("Front end written!")
}


async function updateAbi() {
    const chainId = network.config.chainId

    const aliasAddress = networkConfig[chainId]["alias"]
    const registerAddress = networkConfig[chainId]["register"]

    const aliasContract = await ethers.getContractAt("StudioAlias", aliasAddress)
    const registerContract = await ethers.getContractAt("StudioRegister", registerAddress)

    fs.writeFileSync(aliasAbi, aliasContract.interface.format(ethers.utils.FormatTypes.json))

    fs.writeFileSync(registerAbi, registerContract.interface.format(ethers.utils.FormatTypes.json))
}

async function updateContractAddresses() {
    const chainId = network.config.chainId

    const aliasAddress = networkConfig[chainId]["alias"]
    const registerAddress = networkConfig[chainId]["register"]

    const aliasContract = await ethers.getContractAt("StudioAlias", aliasAddress)
    const registerContract = await ethers.getContractAt("StudioRegister", registerAddress)
    
    const contractAddresses = JSON.parse(fs.readFileSync(addresses, "utf8"))
    if (chainId.toString() in contractAddresses) {
        if (!contractAddresses[chainId.toString()]["Alias"].includes(aliasContract.address)) {
            contractAddresses[chainId.toString()]["Alias"].push(aliasContract.address)
        }

        if (!contractAddresses[chainId.toString()]["Register"].includes(registerContract.address)) {
            contractAddresses[chainId.toString()]["Register"].push(registerContract.address)
        }
    } else {
        contractAddresses[chainId.toString()]["Alias"] = [aliasContract.address]
        contractAddresses[chainId.toString()]["Register"] = [registerContract.address]

    }
    fs.writeFileSync(addresses, JSON.stringify(contractAddresses))
}