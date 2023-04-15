import { usePrepareContractWrite, useContractWrite } from "wagmi";
import Image from "next/image";
import { Inter } from "next/font/google";

import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";

import { privateKeyToAddress } from "@celo/utils/lib/address";

const web3 = new Web3("https://alfajores-forno.celo-testnet.org");
const ContractKit = require("@celo/contractkit");
// require("dotenv").config();
import DumplingABI from "./abi.json";
import { useEffect, useState } from "react";

export default function Home() {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    // setBalance(kit.getTotalBalance(myAddress));
  }, []);

  async function awaitWrapper() {
    const kit = ContractKit.newKitFromWeb3(web3);
    // await kit.connection.addAccount(process.env.PRIVATE_KEY); // this account must have a CELO balance to pay transaction fees

    // This account must have a CELO balance to pay tx fees
    // get some testnet funds at https://faucet.celo.org
    // const address = privateKeyToAddress(process.env.PRIVATE_KEY);
    // console.log(address);
    let accounts = await kit.web3.eth.getAccounts();
    kit.defaultAccount = accounts[0];

    console.log("accounts", accounts);
    let totalBalance = await kit.getTotalBalance(accounts[0]);

    // test code: transfers money to other account
    // console.log(totalBalance);
    // const goldtoken = await kit._web3Contracts.getGoldToken();
    // const oneGold = kit.web3.utils.toWei("1", "ether");
    // const txo = await goldtoken.methods.transfer(accounts[0], oneGold);
    // const tx = await kit.sendTransactionObject(txo);
    // const hash = await tx.getHash();
    // const receipt = await tx.waitReceipt();

    let tx = await kit.sendTransaction({
      data: DumplingsABI.bytecode,
    });

    let receipt = tx.waitReceipt();
    console.log(receipt);
  }

  async function initContract() {
    const kit = ContractKit.newKitFromWeb3(web3);
    kit.connection.addAccount(process.env.PRIVATE_KEY);
    const address = privateKeyToAddress(process.env.PRIVATE_KEY);

    console.log(kit.web3.eth);

    kit.defaultAccount = address;

    // Check the Celo network ID
    const networkId = 44787;

    // Get the contract associated with the current network
    const deployedNetwork = DumplingABI.networks[networkId] || {
      address: "0x74D73D16632C1B4a49a764Ba74c05Ea45cDD8d5d",
    };

    // Create a new contract instance with the HelloWorld contract info
    let instance = new kit.web3.eth.Contract(
      DumplingABI.abi,
      deployedNetwork && deployedNetwork.address
    );

    // getName(instance);
    // setName(instance, "hello world!");
    // let response = await instance.methods.withdrawFunds().call(); // Read contract state
    // console.log(response);

    let name = await instance.methods.lendFunds(2592000).send({
      from: address,
      value: 10000000,
    }); // call();
    console.log(name);
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      Balance: {balance}
      {["Name", "Description", "Token", "Reward"].map((item, index) => {
        return (
          <>
            <label>{item}</label>
            <input></input>
          </>
        );
      })}
      <button
        disabled={false}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={async () => {
          await initContract();
        }}
      >
        Create Pool
      </button>
    </main>
  );
}
