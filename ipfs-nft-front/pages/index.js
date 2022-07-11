import React, { useEffect, useRef, useState } from 'react'
import {Contract, utils, providers} from 'ethers'
import Web3Modal from 'web3modal'
import {NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI} from '../constants'
import Head from 'next/head'
import styles from '../styles/Home.module.css'


export default function Home() {


  const [walletConnected, setWalletConnected] = useState(false)

  const [loading, setLoading] = useState(false)

  const [tokenIdsMinted, setTokenIdsMinted] = useState("0")

  const web3ModalRef = useRef()

  const getProviderOrSigner = async(needSigner=false) => {

    const provider = await web3ModalRef.current.connect()
    const web3Provider = new providers.Web3Provider(provider)

    const { chainId } = await web3Provider.getNetwork()
    if (chainId !==  4) {
      window.alert("Change the network to Rinkeby")
      throw new Error("Change the network to Rinkeby")
    }

    if(needSigner) {
      const signer = web3Provider.getSigner()
      return signer
    }
    return web3Provider
  }

  const connectWallet = async () => {
    try {
      await getProviderOrSigner()
      setWalletConnected(true)
    } catch(err) {
      console.error(err)
    }
  }


  const publicMint = async () => {
    try {
      const signer = await getProviderOrSigner(true)

      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, signer)

      const tx = await nftContract.mint({value: utils.parseEther("0.005")})

      setLoading(true)

      await tx.wait()
      setLoading(false)
      window.alert("You successfully minted a MAVPunk!")
    } catch (err) {
      console.error(err)
    }
  }

  const getTokenIdsMinted = async () => {
    try {
        const provider = await getProviderOrSigner()

        const nftContract = new Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, provider)

        const _tokenIds = await nftContract.tokenIds()

        setTokenIdsMinted(_tokenIds.toString())
    } catch(err) {
      console.error(err)
    }
  }
  

  useEffect(() => {

    if(!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider: false
      })

      connectWallet()

      getTokenIdsMinted()

      setInterval(async function() {
        await getTokenIdsMinted()
      }, 5 *1000)
    }
  }, [walletConnected])


  const renderButton = () => {
    if(!walletConnected) {
      return (
        <button onClick={connectWallet} className={styles.button}>
        Connect your wallet
      </button>
      )
    }

    if (loading) {
      return  <button className={styles.button}>Loading🎁...</button>; 
    }

    return (
      <button className={styles.button} onClick={publicMint}>
      Public Mint 🚀
    </button>
    )
  }



  return (
    <div className={styles.container}>
      <Head>
        <title>MAVPunks</title>
        <meta name="description" content="MAVPunks-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
          <div className={styles.main}>
            <div>
              <h1 className={styles.title}>Welcome to MAVPunks!</h1>
              <div className={styles.description}>
                Its an NFT collection for Maverick Chain members.
              </div>
              <div className={styles.description}>
                {tokenIdsMinted}/10 have been minted
              </div>
              {renderButton()}
            </div>
            <div>
              <img className={styles.image} src="./cover.png" />
            </div>
          </div>

          <footer className={styles.footer}>Made with &#10084; by MAVPunks</footer>

    </div>
  ) 
}
