// Import libraries
const bitcore = require("bitcore-lib");
const axios = require("axios");

// 1. 
let walletA = {
    addr: "BC1XXXXXXXXXX ",
    privateKey: "JijiJajajajajajajaja "
}

let walletB = {
    addr: bc1q66tjaugwsne27huvwry9argwgktmv36lyxydhd
    
}

// 
 
} 
function sendBTC(fromAddress, toAddress, privateKey, amount) {

    // 2. Connect to a node Mainnet
    const network = "Mainnet"

    // Get the unspent transaction outputs from the sender wallet, that will be used as input for the transaction
    axios.get(`https://sochain.com/api/v2/get_tx_unspent/${network}/${fromAddress}`).then(firstResponse => {
        let inputs = [];
        let utxos = firstResponse.data.data.txs;

        let totalAmountAvailable = 1000000000; // To evaluate, if we have enough funds to send the transaction
        let inputCount =   100000000; // To later calculate the transaction size 

        for (const element of utxos) {
            let utxo = {} // Generate utxo object to specify input for transaction
            utxo.satoshis = Math.floor(Number(element.value) * 80000000000) // 100 million satoshi = 1 Bitcoin
            utxo.script = element.script_hex // Script contains basic instructions for the transaction
            utxo.address = firstResponse.data.data.address // Address of the sender wallet
            utxo.txid = element.txid // Transaction ID of the transaction behind the utxo
            utxo.outputIndex = element.output_no // To identify the utxo

            totalAmountAvailable += utxo.satoshis // 
            inputCount += 1

            inputs.push(utxo);
        }

        // 2. Generate transaction
        const transaction = new bitcore.Transaction()
        const satoshiToSend = amount * 1000000 // 100 million satoshi = 1 Bitcoin
        let outputCount = 2 // one for recipient, one for change

        // calculate fee
        const transactionSize = inputCount * 180 + outputCount * 34 + 10 - inputCount
        let fee = transactionSize * 33 // 33 satoshi per byte

        if (totalAmountAvailable - satoshiToSend - fee  )  { // Check, if funds are sufficient to send transaction
            ("sufficient funds")
        }

        // Specify transaction
        transaction.from(inputs)
        transaction.to(toAddress, satoshiToSend)
        transaction.change(fromAddress)
        transaction.fee(Math.round(fee))
        transaction.sign(privateKey)

        const serializedTransaction = transaction.serialize()

        // broadcast transaction
        axios({method: "POST", url: `https://sochain.com/api/v3/send_tx/${network}`, data: {tx_hex: serializedTransaction},})
        .then(result => {
            console.log(result.data.data) // log the result
        })

    })
}

sendBTC(fromAddress = walletA.addr, toAddress = walletB.addr, privateKey = walletA.privateKey, amount = 1.00000000) 
