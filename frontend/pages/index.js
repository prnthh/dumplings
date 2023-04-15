import Image from "next/image";
import { Inter } from "next/font/google";
import { Web3Button } from "@web3modal/react";
import { useAccount, useContract, useSigner } from "wagmi";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by &nbsp;
          <code className="font-mono font-bold">joining a pool</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <Web3Button />
        </div>
      </div>

      <div className="mb-32 grid text-center lg:mb-0 md:grid-cols-4 lg:text-left">
        {["FSC Forest, Japan", "Pool 2", "Pool 3"].map((item, index) => (
          <a
            href={`/pool?=${item}`}
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            // target="_blank"
            rel="noopener noreferrer"
          >
            <div className="text-left text-sm">
              <h2 className={`${inter.className} mb-3 text-2xl font-semibold`}>
                {item}{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                  -&gt;
                </span>
              </h2>
              <p>Interest Rate</p>
              <p className="text-lg">13.0%</p>
              <div className="flex flex-row justify-between w-full">
                <p>Total Value Locked</p>
                <p>$11.3M</p>
              </div>
              <div className="flex flex-row justify-between w-full">
                <p>Loan Duration</p>
                <p>60d</p>
              </div>
              <div className="flex flex-row justify-between w-full">
                <p>Credit Score</p>
                <p>A</p>
              </div>
            </div>
          </a>
        ))}
      </div>

      <a href={"/new"}>
        <button className="bg-transparent text-blue-500 hover:text-white rounded border border-blue-500 hover:bg-blue-500 py-2 px-3">
          Create a new pool
        </button>
      </a>
    </main>
  );
}
