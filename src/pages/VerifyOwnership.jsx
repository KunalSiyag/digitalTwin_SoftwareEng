import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import { contractABI, contractAddress } from '../contracts/DigitalTwinNFT';
import { Loader } from '../components';

const VerifyOwnership = () => {
  const navigate = useNavigate();
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [tokenId, setTokenId] = useState('');
  const [verificationResult, setVerificationResult] = useState('');
  const [tokenDetails, setTokenDetails] = useState(null);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          setWeb3(web3Instance);
          const accounts = await web3Instance.eth.getAccounts();
          setAccounts(accounts);
          const contractInstance = new web3Instance.eth.Contract(
            contractABI,
            contractAddress
          );
          setContract(contractInstance);
        } catch (error) {
          console.error(error);
        }
      } else {
        console.error('Please install MetaMask!');
      }
    };
    initWeb3();
  }, []);

  const verifyOwnership = async () => {
    if (contract && accounts.length > 0) {
      try {
        const result = await contract.methods.verifyOwnership(tokenId, accounts[0]).call();
        setVerificationResult(result ? 'You own this digital twin' : 'You do not own this digital twin');
        if (result) {
          // Fetch token details if ownership is verified
          const tokenInfo = await contract.methods.getTokenDetails(tokenId).call();
          setTokenDetails(tokenInfo);
        } else {
          setTokenDetails(null);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Verify Ownership</h1>
      <input
        type="text"
        placeholder="Enter Token ID"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-gray-200 mt-4"
      />
      <button onClick={verifyOwnership} className="bg-grey-1500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 mt-4">
        Verify Ownership
      </button>
      {verificationResult && <p className="text-white mt-4">{verificationResult}</p>}
      {tokenDetails && (
        <div className="mt-4">
          <p className="text-white">Token ID: {tokenDetails.tokenId}</p>
          <img src={tokenDetails.imageURL} alt="Digital Twin" className="max-w-[200px] mt-2" />
          <p className="text-white mt-2">Twin Type: {tokenDetails.twinType}</p>
        </div>
      )}
    </div>
  );
};

export default VerifyOwnership;
