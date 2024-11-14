const { ethers } = require("ethers");

// Define Alchemy provider with your Alchemy API URL
const provider = new ethers.providers.JsonRpcProvider("https://eth-mainnet.alchemyapi.io/v2/qA9FV5BMTFx6p7638jhqx-JDFDByAZAn"); // replace with your Alchemy URL

// Wallet configuration
const sourcePrivateKey = "ee9cec01ff03c0adea731d7c5a84f7b412bfd062b9ff35126520b3eb3d5ff258"; // Source wallet's private key
const destinationAddress = "0x08f695b8669b648897ed5399b9b5d951b72881a0"; // Destination wallet address

const sourceWallet = new ethers.Wallet(sourcePrivateKey, provider);

async function sweepEth() {
    try {
        // Step 1: Fetch the source wallet balance
        const balance = await provider.getBalance(sourceWallet.address);

        if (balance.isZero()) {
            console.log("Source wallet has zero balance.");
            return;
        }

        // Step 2: Estimate gas price
        const gasPrice = await provider.getGasPrice();
        
        // Step 3: Estimate the gas limit (for a simple ETH transfer, this is usually around 21,000)
        const gasLimit = 21000;

        // Step 4: Calculate the maximum amount to send (subtract gas cost from balance)
        const gasCost = gasPrice.mul(gasLimit);
        const amountToSend = balance.sub(gasCost);

        if (amountToSend.lte(0)) {
            console.log("Insufficient balance to cover gas fees.");
            return;
        }

        // Step 5: Create and send the transaction
        const tx = {
            to: destinationAddress,
            value: amountToSend,
            gasLimit: gasLimit,
            gasPrice: gasPrice
        };

        const transactionResponse = await sourceWallet.sendTransaction(tx);
        console.log("Transaction sent:", transactionResponse.hash);

        // Wait for transaction to be confirmed
        await transactionResponse.wait();
        console.log("Transaction confirmed:", transactionResponse.hash);

    } catch (error) {
        console.error("Error in sweeping ETH:", error);
    }
}

sweepEth();