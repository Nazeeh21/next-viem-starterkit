"use client";

import "viem/window";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import {
  Account,
  Chain,
  createPublicClient,
  createWalletClient,
  custom,
  getAccount,
  http,
  parseEther,
  WalletClient,
} from "viem";
import { mainnet } from "viem/chains";
import { WindowProvider } from "viem/window";

const requiredChainId: Chain = mainnet;

const client = createPublicClient({
  chain: requiredChainId,
  transport: http(),
  pollingInterval: 10_000,
});

export default function Home() {
  const [blockNumber, setBlockNumber] = useState<null | number>(null);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [account, setAccount] = useState<Account>();
  const [chainId, setChainId] = useState<undefined | number>();
  const [walletClient, setWalletClient] = useState<WalletClient | undefined>();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const walletClient = createWalletClient({
      chain: mainnet,
      transport: custom(window.ethereum as WindowProvider),
    });
    setWalletClient(walletClient as WalletClient);
  }, []);

  const getBlockNumber = async () => {
    const blockNumber = await client.getBlockNumber();
    setBlockNumber(Number(blockNumber));
    setChainId(await client.getChainId());
  };

  getBlockNumber();

  const connectWallet = async () => {
    setAccount(undefined);
    setConnecting(true);

    const [address] = await walletClient!.requestAddresses();
    const account = getAccount(address);
    console.log("account: ", account);
    setAccount(getAccount(address));
    setConnecting(false);
  };

  const switchNetwork = async () => {
    await walletClient?.switchChain({
      id: requiredChainId.id,
    });
  };

  const signMessage = async () => {
    if (!account) return;
    const message = "gm";

    const signedMessage = await walletClient?.signMessage({
      account,
      message,
    });

    console.log("signedMessage: ", signedMessage);
    alert("Signed Msg: " + signedMessage);
  };

  const sendTransaction = async () => {
    if (!account) return;
    await walletClient?.sendTransaction({
      account,
      to: "0x0000000000000000000000000000000000000000",
      value: parseEther("0.000000"),
    });
  };

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <div>Nextjs 13 & Viem</div>
        <div>Current ChainId: {chainId}</div>
        <div>
          BlockNumber: <span>{blockNumber}</span>
        </div>
        {account ? (
          <div>Connected address: {account.address}</div>
        ) : connecting ? (
          <div>Connecting...</div>
        ) : (
          <button onClick={connectWallet}>Connect Wallet</button>
        )}

        {requiredChainId.id != chainId && (
          <button onClick={switchNetwork}>Switch network</button>
        )}

        {account && <button onClick={signMessage}>Sign gm message</button>}
        {account && <button onClick={sendTransaction}>Send transaction</button>}
      </div>
    </main>
  );
}
