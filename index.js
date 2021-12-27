import fetch from "node-fetch";
import Web3 from "web3";
import dotenv from 'dotenv'
dotenv.config();
const func = async () => {
  const contractAddress = "0x44709a920fCcF795fbC57BAA433cc3dd53C44DbE";
  const infuraKey = process.env.infuraKey;
  const privateKey = process.env.privateKey;
  const response = await fetch(
    `https://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=Z6GREXDZPPJS48Q3VZDVVYI3WWGBEWAJ7Q`
  );
  console.log(contractAddress)
  const result = await response.json();
  const abi = result.result;
  console.log(abi);
  const web3 = new Web3(
    new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/${infuraKey}`)
  );
  const contract = new web3.eth.Contract(JSON.parse(abi), contractAddress);

  const tx = contract.methods.transfer(
    "0x62e0b529cA53057658f0604D9c805f2F30727b0B",
    "8697000000000000000000"
  );
  const address = "0xE1363434c88Fcc2939211995EBFacD6fF7f4CB39";
  const networkId = 1;
  const gas = await tx.estimateGas({ from: address });
  const gasPrice = await web3.eth.getGasPrice();
  const data = tx.encodeABI();
  const nonce = await web3.eth.getTransactionCount(address);

  const signedTx = await web3.eth.accounts.signTransaction(
    {
      to: contract.options.address,
      data,
      gas,
      gasPrice,
      nonce,
      chainId: networkId,
    },
    privateKey
  );
  console.log(signedTx);
  console.log(gas);
  console.log(gas * gasPrice / 10 ** 18);
  const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  console.log(`Transaction hash: ${receipt.transactionHash}`);
};

func();
