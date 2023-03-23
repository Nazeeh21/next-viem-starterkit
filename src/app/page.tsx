import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from './page.module.css'

import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})


export default async function Home() {
  const blockNumber = await client.getBlockNumber()

  console.log('blockNumber: ', blockNumber)
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        Nextjs 13 & Viem

        <div>BlockNumber: <span>{Number(blockNumber)}</span></div>
      </div>
    </main>
  )
}
