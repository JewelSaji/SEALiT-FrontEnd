const Web3 = require("web3");
require("dotenv").config();

const web3 = new Web3(process.env.BLOCKCHAIN_API);
const contractAddress = "YOUR_SMART_CONTRACT_ADDRESS";
const contractABI = require("./contractABI.json");  // Smart contract ABI
const contract = new web3.eth.Contract(contractABI, contractAddress);
const senderAddress = "YOUR_WALLET_ADDRESS";
const privateKey = "YOUR_WALLET_PRIVATE_KEY";

// Register Product on Blockchain
const registerProduct = async (serialNumber) => {
    try {
        const tx = contract.methods.registerProduct(serialNumber);
        const gas = await tx.estimateGas({ from: senderAddress });
        const data = tx.encodeABI();
        
        const signedTx = await web3.eth.accounts.signTransaction(
            { to: contractAddress, data, gas, from: senderAddress },
            privateKey
        );

        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        return receipt.transactionHash;
    } catch (error) {
        console.error("Blockchain Error:", error);
        return null;
    }
};

const verifyProduct = async (serialNumber) => {
    try {
        return await contract.methods.isProductRegistered(serialNumber).call();
    } catch (error) {
        console.error("Blockchain Verification Error:", error);
        return false;
    }
};

module.exports = { registerProduct, verifyProduct };
