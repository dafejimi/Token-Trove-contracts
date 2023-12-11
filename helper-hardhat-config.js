networkConfig = {
    80001: {
        name: "polygon_mumbai",
        alias: "0x04DBE376110a08DbccCE4027534e33664A1FBe60",
        register: "0xc9B80C3189636825f8F752F68F1425C2a1619eE8",
        router: "0x70499c328e1e2a3c41108bd3730f6670a44595d1"
    },
    43113: {
        name: "fuji_testnet",
        alias: "0xAFCad32235F8e8095A2EA12d9BB93542BE89584C",
        register: "0xbA217Be6dd3307D0A30c66503Ca4c5D3513828C0",
        router: "0x554472a2720e5e7d5d3c817529aba05eed5f82d8"
    }
}

const developmentChains = ["hardhat", "localhost"]
const VERIFICATION_BLOCK_CONFIRMATIONS = 6
const addresses = "../studio-frontend/constants/networkAddresses.json"
const aliasAbi = "../studio-frontend/constants/alias.json"
const registerAbi = "../studio-frontend/constants/register.json"

module.exports = {
    addresses,
    aliasAbi,
    developmentChains,
    registerAbi,
    networkConfig,
    VERIFICATION_BLOCK_CONFIRMATIONS
}