import React, {useEffect, useRef, useState} from 'react';
import Head from 'next/head';
// import Image from 'next/image'
// import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css';
import Web3Modal from 'web3modal';
import {Contract, providers} from "ethers";
import { Whitelist_Contract_Address, abi } from '../constants';
// import ConnectToWalletConnect from 'web3modal/dist/providers/connectors/walletconnect';

// const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [numOfWhitelisted, setNumOfWhitelisted] = useState(0);
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  const [loading, setLoading] = useState(false);
  const web3ModalRef = useRef();


  const getProviderOrSigner = async (needSigner = false) => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Goerli network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert("Change the network to Goerli");
      throw new Error("Change network to Goerli");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

    /**
   * addAddressToWhitelist: Adds the current connected address to the whitelist
   */
    const addAddressToWhitelist = async () => {
      try {
        // We need a Signer here since this is a 'write' transaction.
        const signer = await getProviderOrSigner(true);
        // Create a new instance of the Contract with a Signer, which allows
        // update methods
        const whitelistContract = new Contract(
          Whitelist_Contract_Address,
          abi,
          signer
        );
        // call the addAddressToWhitelist from the contract
        const tx = await whitelistContract.addAddressToWhitelist();
        setLoading(true);
        // wait for the transaction to get mined
        await tx.wait();
        setLoading(false);
        // get the updated number of addresses in the whitelist
        await getNumOfWhitelisted();
        setJoinedWhitelist(true);
      } catch (err) {
        console.error(err);
      }
    };

   const checkAddressWhitelisted = async() => {
    try{
      const signer = getProviderOrSigner(true);
      const whitelistContract = new Contract(Whitelist_Contract_Address, abi, signer);
      const address = await signer.getAddress();
      const _joinedWhitelist = await whitelistContract.whitelistedAddresses(address);
      setJoinedWhitelist(_joinedWhitelist);

    } catch(err) {
      console.error(err);
    }
   };

   const getNumOfWhitelisted = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // No need for the Signer here, as we are only reading state from the blockchain
      const provider = await getProviderOrSigner();
      // We connect to the Contract using a Provider, so we will only
      // have read-only access to the Contract
      const whitelistContract = new Contract(Whitelist_Contract_Address,
        abi,
        provider);
      
      const _numOfWhitelisted =
      await whitelistContract.numAddressesWhitelisted();
      setNumOfWhitelisted(_numOfWhitelisted);
    } catch (err) {
      console.error(err);
    }
  };

     /*
    renderButton: Returns a button based on the state of the dapp
  */
  const renderButton = () => {
    if (walletConnected) {
      if (joinedWhitelist) {
        return (
          <div className={styles.description}>
            Thanks for joining the Whitelist!
          </div>
        );
      } else if (loading) {
        return <button className={styles.button}>Loading...</button>;
      } else {
        return (
          <button onClick={addAddressToWhitelist} className={styles.button}>
            Join the Whitelist
          </button>
        );
      }
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }
   };
   


  const connectWallet = async() => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
      checkAddressWhitelisted();
      getNumOfWhitelisted();
    } catch(err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disabledInjectedProvider: false,
      });
       connectWallet()
    }
  }, [walletConnected]);
  return (
    <div>
      <Head>
        <title>Whitelist dApp</title>
        <meta name="description" content="Whitelist-Dapp" />
      </Head>
        <div className={styles.main}>
          <h1 className={styles.title}>
            Welcome to Crypto Devs!
          </h1>
          <div className={styles.description}>
            {numOfWhitelisted} have already joined the Whitelist
          </div>
          {renderButton()}
          <div>
            <img className={styles.image} src="./crypto-devs.svg"/>
          </div>

        </div>
      <footer className={styles.footer}>
        Made with &#10084; by Crypto Guys

      </footer>
    </div>
  )
}
