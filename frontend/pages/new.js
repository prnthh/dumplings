import { usePrepareContractWrite, useContractWrite } from "wagmi";
import Image from "next/image";
import { Inter } from "next/font/google";
import { Web3Button } from "@web3modal/react";
import { useAccount, useContract, useSigner } from "wagmi";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { config } = usePrepareContractWrite({
    address: "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2",
    abi: [
      {
        name: "mint",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [],
        outputs: [],
      },
    ],
    functionName: "mint",
  });
  const { write } = useContractWrite(config);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      {["Name", "Description", "Token", "Reward"].map((item, index) => {
        return (
          <>
            <label>{item}</label>
            <input></input>
          </>
        );
      })}
      <button disabled={!write} onClick={() => write?.()}>
        Create Pool
      </button>
    </main>
  );
}
