const pinataSDK = require("@pinata/sdk")
const fs = require("fs")
const path = require("path")
require("dotenv").config()

const pinataApiKey = process.env.PINATA_API_KEY || ""
const pinataApiSecret = process.env.PINATA_API_SECRET || ""
const pinata = new pinataSDK(pinataApiKey, pinataApiSecret)

async function uploadAvatars() {
    const image1Path = "./ipfs-uploads/avatars/download(1).jpg"
    const image2Path = "./ipfs-uploads/avatars/download(2).jpg"
    const image3Path = "./ipfs-uploads/avatars/download(3).jpg"

    const image1 = fs.readFileSync(image1Path)
    const image2 = fs.readFileSync(image2Path)
    const image3 = fs.readFileSync(image3Path)

    try {
        const options1 = {
            pinataMetadata: {
                name: 'dafe' // Replace with the desired file name
            }
        };

        const options2 = {
            pinataMetadata: {
                name: 'dave' // Replace with the desired file name
            }
        };

        const options3 = {
            pinataMetadata: {
                name: 'zivo' // Replace with the desired file name
            }
        };

        const result1 = await pinata.pinFileToIPFS(image1, options1);
        console.log("--------------------------------------")
        console.log('File uploaded successfully!', result1);
        const result2 = await pinata.pinFileToIPFS(image2, options2);
        console.log("--------------------------------------")
        console.log('File uploaded successfully!', result2);
        const result3 = await pinata.pinFileToIPFS(image3, options3);
        console.log("--------------------------------------")
        console.log('File uploaded successfully!', result3);

    } catch (error) {
        console.error('Error uploading file:', error);
    }

}


async function uploadBanners() {
    const image1Path = "./ipfs-uploads/thumbnails/download(1).jpg"
    const image2Path = "./ipfs-uploads/thumbnails/download(2).jpg"
    const image3Path = "./ipfs-uploads/thumbnails/download(3).jpg"

    const image1 = fs.readFileSync(image1Path)
    const image2 = fs.readFileSync(image2Path)
    const image3 = fs.readFileSync(image3Path)

    try {
        const options1 = {
            pinataMetadata: {
                name: 'dafe' // Replace with the desired file name
            }
        };

        const options2 = {
            pinataMetadata: {
                name: 'dave' // Replace with the desired file name
            }
        };

        const options3 = {
            pinataMetadata: {
                name: 'zivo' // Replace with the desired file name
            }
        };

        const result1 = await pinata.pinFileToIPFS(image1, options1);
        console.log("--------------------------------------")
        console.log('File uploaded successfully!', result1);
        const result2 = await pinata.pinFileToIPFS(image2, options2);
        console.log("--------------------------------------")
        console.log('File uploaded successfully!', result2);
        const result3 = await pinata.pinFileToIPFS(image3, options3);
        console.log("--------------------------------------")
        console.log('File uploaded successfully!', result3);
    } catch (error) {
        console.error('Error uploading file:', error);
    }
}

async function main() {
    uploadAvatars()
    uploadBanners()
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })