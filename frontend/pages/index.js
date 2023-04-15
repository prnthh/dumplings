import Image from "next/image";
import ConnectButton from "@/components/ConnectButton";
import Logo from "../static/logo.png";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col p-4">
      <div className="flex row justify-end">
        <ConnectButton />
      </div>

      <div>
        <img
          style={{
            position: "absolute",
            right: 0,
            top: 50,
            zIndex: 0,
            width: 300,
          }}
          src={Logo.src}
        ></img>
      </div>

      <div
        className="mb-32 grid text-center lg:mb-0 md:grid-cols-4 gap-2 text-left"
        style={{ zIndex: 2 }}
      >
        {["FSC Forest, Japan", "Pool 2", "Pool 3"].map((item, index) => (
          <a
            href={`/pool?=${index}`}
            className="group rounded-lg border border-transparent bg-[#0f0f14] text-white px-3 py-4 transition-colors border-2 border-[#1c1c21] hover:border-[#00D2AF] hover:shadow-md shadow-[#3E4E51] transition-all"
            // target="_blank"
            rel="noopener noreferrer"
          >
            <div className="text-left text-xs">
              <h2 className={`mb-3 text-lg font-semibold`}>
                {item}
                {/* <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                  -&gt;
                </span> */}
              </h2>
              <p className="text-white/50">APY (%)</p>
              <p className="text-lg pb-6">13.0%</p>
              <div className="flex flex-row justify-between w-full py-1.5">
                <p className="text-white/50">Total Value Locked</p>
                <p>$11.3M</p>
              </div>
              <div className="flex flex-row justify-between w-full py-1.5">
                <p className="text-white/50">Loan Duration</p>
                <p>60d</p>
              </div>
              <div className="flex flex-row justify-between w-full py-1.5">
                <p className="text-white/50">Credit Score</p>
                <p>A</p>
              </div>
            </div>

            <div className="bg-[#17171B] text-white/50 text-xs -mx-3 px-3 -mb-3 py-3 ">
              <div className="flex flex-row justify-between w-full py-1.5">
                <p>Capital Supplied</p>
                <p className="text-white">11.3M</p>
              </div>
              <div className="w-full h-3 rounded-xl bg-[#212B31]">
                <div className="w-5/12 h-full rounded bg-[#DEDEDE]"></div>
              </div>
              <div className="flex flex-row justify-between w-full py-1.5">
                <p>Maximum Supply</p>
                <p className="text-white">20M</p>
              </div>
            </div>
          </a>
        ))}
      </div>

      <center>
        <a href={"/new"}>
          <button className="rounded-md flex h-14 w-48 bg-[#192125] items-center justify-center text-[#60CBB9] m-2">
            Create a new pool
          </button>
        </a>
      </center>
    </main>
  );
}
