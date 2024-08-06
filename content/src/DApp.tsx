import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import SimpleStorage from './SimpleStorage.json';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const DApp: React.FC = () => {
  console.log('DApp component is rendering');
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [account, setAccount] = useState<string>('');
  const [storedValue, setStoredValue] = useState<string>('0');
  const [inputValue, setInputValue] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const init = async () => {
      try {
        if (typeof window.ethereum !== 'undefined') {
          const provider = new ethers.BrowserProvider(window.ethereum);
          await provider.send("eth_requestAccounts", []);

          // const network = await provider.getNetwork();
          // if (network.chainId !== BigInt(8453)) { // Base mainnet chain ID
          //   setError('Please connect to Base network');
          //   return;
          // }

          const signer = await provider.getSigner();
          const address = await signer.getAddress();

          // Replace with your deployed contract address on Base
          const contractAddress = '0x203991321231389766DdFb293fA5C058263343ea';
          const contractInstance = new ethers.Contract(contractAddress, SimpleStorage.abi, signer);

          setProvider(provider);
          setContract(contractInstance);
          setAccount(address);
          setError('');
        } else {
          setError('Please install MetaMask!');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to connect. Check console for details.');
      }
    };
    init();
  }, []);

  const handleSet = async () => {
    if (contract && inputValue) {
      try {
        const tx = await contract.set(inputValue);
        await tx.wait();
        const response = await contract.get();
        setStoredValue(response.toString());
        setError('');
      } catch (err) {
        console.error(err);
        setError('Error setting value. Check console for details.');
      }
    }
  };

  const handleGet = async () => {
    if (contract) {
      try {
        const response = await contract.get();
        setStoredValue(response.toString());
        setError('');
      } catch (err) {
        console.error(err);
        setError('Error getting value. Check console for details.');
      }
    }
  };

  return (
    <div>
      <h1>Simple Storage DApp on Base</h1>
      {error && <p style={{color: 'red'}}>{error}</p>}
      {account && <p>Connected Account: {account}</p>}
      <div>
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={handleSet} disabled={!contract}>Set Value</button>
      </div>
      <div>
        <button onClick={handleGet} disabled={!contract}>Get Value</button>
        <p>Stored Value: {storedValue}</p>
      </div>
    </div>
  );
};

export default DApp;