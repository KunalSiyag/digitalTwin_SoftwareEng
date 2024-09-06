import React, { useContext, createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { contractABI, contractAddress } from '../contracts/DigitalTwinNFT'; // Import contract ABI and address

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const [contract, setContract] = useState(null);
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeContract = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);

        // Check if the contract has the required methods
        if (!contractInstance.createDigitalTwin || !contractInstance.getDigitalTwins) {
          throw new Error('Contract methods not available');
        }

        setContract(contractInstance);

        // Get user address
        const accounts = await provider.listAccounts();
        setAddress(accounts[0] || '');
      } catch (error) {
        console.error('Failed to initialize contract:', error);
        setError(error.message || 'Failed to initialize contract');
      }
    };

    initializeContract();
  }, []);

  const createDigitalTwin = async (twinData) => {
    try {
      if (!contract) {
        throw new Error('Contract not initialized');
      }

      setIsLoading(true);
      const data = await contract.createDigitalTwin(twinData.twinType, twinData.description, twinData.dataLink, twinData.imageUrl);
      console.log("Contract call success", data);
    } catch (error) {
      console.error("Contract call failure", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCampaigns = async () => {
    try {
      if (!contract) {
        throw new Error('Contract not initialized');
      }

      const campaigns = await contract.getDigitalTwins();

      const parsedCampaigns = campaigns.map((campaign, i) => ({
        owner: campaign.owner,
        twinType: campaign.twinType,
        description: campaign.description,
        dataLink: campaign.dataLink,
        imageUrl: campaign.imageUrl,
        tokenId: campaign.tokenId,
        pId: i,
      }));

      return parsedCampaigns;
    } catch (error) {
      console.error("Failed to fetch campaigns", error);
      return [];
    }
  };

  const getUserCampaigns = async () => {
    try {
      if (!contract) {
        throw new Error('Contract not initialized');
      }

      const allCampaigns = await getCampaigns();
      const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);
      return filteredCampaigns;
    } catch (error) {
      console.error("Failed to fetch user campaigns", error);
      return [];
    }
  };

  const updateDataLink = async (tokenId, newDataLink) => {
    try {
      if (!contract) {
        throw new Error('Contract not initialized');
      }

      // Placeholder logic to update dataLink in the contract
      console.log(`Updated dataLink for tokenId ${tokenId}: ${newDataLink}`);
    } catch (error) {
      console.error("Failed to update dataLink", error);
    }
  };

  const updateSensorValue = async (tokenId, newSensorValue) => {
    try {
      if (!contract) {
        throw new Error('Contract not initialized');
      }

      // Placeholder logic to update sensorValue in the contract
      console.log(`Updated sensorValue for tokenId ${tokenId}: ${newSensorValue}`);
    } catch (error) {
      console.error("Failed to update sensorValue", error);
    }
  };

  return (
    <StateContext.Provider
      value={{ 
        address,
        contract,
        isLoading,
        error,
        createDigitalTwin,
        getCampaigns,
        getUserCampaigns,
        updateDataLink,
        updateSensorValue,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
