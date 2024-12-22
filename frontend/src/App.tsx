import {
  ConnectButton,
  AccountProvider,
  AccountAddress,
  AccountBalance,
  useWalletBalance,
  AccountAddressProps,
} from "thirdweb/react";
import thirdwebIcon from "./thirdweb.svg";
import { client } from "./client";

export function App() {
//   const { address } = use(); // Get the connected wallet address

//   const { data: balance, isLoading } = useWalletBalance(address);

  return (
    <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
      <div className="py-20">
        <Header />

        <div className="flex justify-center mb-20">
          <ConnectButton
            client={client}
            appMetadata={{
              name: "Example app",
              url: "https://example.com",
            }}
          />

          {/* {address ? (
            <div>
              <p>Your Wallet Address: {address}</p>
              {isLoading ? (
                <p>Loading balance...</p>
              ) : (
                <p>Your Balance: {balance}ETH</p>
              )}
            </div>
          ) : (
            <p>Please connect your wallet.</p>
          )} */}
          <AccountProvider
            address="0xd8da6bf26964af9d7eed9e03e53415d37aa96045"
            client={client}
          ></AccountProvider>
        </div>

        {/* <ThirdwebResources /> */}
      </div>
    </main>
  );
}

function Header() {
  return (
    <header className="flex flex-col items-center mb-20 md:mb-20">
      <img
        src={thirdwebIcon}
        alt=""
        className="size-[150px] md:size-[150px]"
        style={{
          filter: "drop-shadow(0px 0px 24px #a726a9a8)",
        }}
      />

      <h1 className="text-2xl md:text-6xl font-bold tracking-tighter mb-6 text-zinc-100">
        MoneyPlant AI
      </h1>
    </header>
  );
}
