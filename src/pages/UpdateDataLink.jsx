import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { contractABI, contractAddress } from '../contracts/DigitalTwinNFT';
import { Loader } from '../components';

const UpdateDataLink = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [dataLink, setDataLink] = useState('');

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

  const updateDataLink = async () => {
    if (contract && accounts.length > 0) {
      setIsLoading(true);
      try {
        const tokenId = 1; // Replace with your tokenId logic
        const tx = await contract.methods.updateDataLink(tokenId, dataLink).send({ from: accounts[0] });
        console.log('Data Link updated successfully:', tx);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error(error);
      }
    }
  };

  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] p-4">
      {isLoading && <Loader />} {/* Show loader while updating data link */}
      <h1 className="text-white font-bold text-xl mb-4">Update Data Link</h1>
      <input
        type="text"
        placeholder="New Data Link"
        value={dataLink}
        onChange={(e) => setDataLink(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-gray-200"
      />
      <button onClick={updateDataLink} className="bg-gray-700 text-white px-4 py-2 mt-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
        Update Data Link
      </button>
    </div>
  );
};

export default UpdateDataLink;
