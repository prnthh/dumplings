import { useCelo } from "@celo/react-celo";
import { useEffect, useState } from "react";
export default function ConnectButton({}) {
  const { connect, address } = useCelo();
  const [loaded, isLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) isLoaded(true);
  }, []);

  return (
    <button
      className="rounded-md flex h-14 w-36 bg-[#192125] items-center justify-center text-[#60CBB9] m-2"
      onClick={connect}
      style={{ zIndex: 1 }}
    >
      {loaded && address ? (
        <>Connected {address.substring(0, 7)}</>
      ) : (
        <>Connect wallet</>
      )}
    </button>
  );
}
