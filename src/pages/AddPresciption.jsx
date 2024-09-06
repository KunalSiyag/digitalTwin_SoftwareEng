import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import { contractABI, contractAddress } from '../contracts/DigitalTwinNFT';
import { Loader } from '../components';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [twinType, setTwinType] = useState('');
  const [description, setDescription] = useState('');
  const [dataLink, setDataLink] = useState('');
  const [imageUrl, setImageUrl] = useState('https://picsum.photos/500/500'); // Placeholder image URL
  const [tokenId, setTokenId] = useState(null); // Track tokenId after creation
  const [createdTwin, setCreatedTwin] = useState(null); // Store created twin details
  const [sensorValue, setSensorValue] = useState(null); // Store sensor value

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

  const createDigitalTwin = async () => {
    if (contract && accounts.length > 0) {
      setIsLoading(true);
      try {
        const tx = await contract.methods
          .createDigitalTwin(twinType, description, dataLink)
          .send({ from: accounts[0] });

        const newTokenId = tx.events.Transfer.returnValues.tokenId;
        console.log('Digital Twin created successfully with tokenId:', newTokenId);
        setTokenId(newTokenId);
        setIsLoading(false);

        // Store created twin details for rendering block details
        setCreatedTwin({
          tokenId: newTokenId,
          twinType,
          description,
          dataLink,
          imageUrl,
        });
      } catch (error) {
        setIsLoading(false);
        console.error(error);
      }
    }
  };

  // Render the block details form after successful twin creation
  const renderBlockDetailsForm = () => {
    return (
      <div className="w-full mt-4 space-y-4">
        <h2 className="text-xl font-bold mb-2 text-white">Block Details</h2>
        <div className="bg-gray-800 rounded-lg p-4 flex flex-wrap items-start">
          <div className="flex-1">
            <p className="text-lg mb-2">
              Token ID: <span className="font-bold">{Number(createdTwin.tokenId)}</span>
            </p>
            <p className="text-lg mb-2">
              Twin Type: <span className="font-bold">{createdTwin.twinType}</span>
            </p>
            <p className="text-lg mb-2">
              Description:{" "}
              <span className="block bg-gray-700 p-2 rounded-lg mt-2">{createdTwin.description}</span>
            </p>
            <p className="text-lg mb-2">
              Data Link: <span className="font-bold">{createdTwin.dataLink}</span>
            </p>
            <p className="text-lg mb-2">
              Sensor Value: <span className="font-bold">{sensorValue !== null ? sensorValue : 'Loading...'}</span>
            </p>
          </div>
          <div className="flex-1 flex justify-center items-center">
            {createdTwin.imageUrl && (
              <img src={createdTwin.imageUrl} alt="Twin Image" className="w-32 h-32 rounded-md mb-2" />
            )}
          </div>
          {/* Add other block details inputs here */}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {isLoading && <Loader />} {/* Show loader when creating digital twin */}
      {tokenId ? ( // Show block details form after successful twin creation
        renderBlockDetailsForm()
      ) : (
        <div className="w-full mt-4 flex flex-col gap-4">
          <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">ADD A DIGITAL TWIN!</h1>
          <img src={imageUrl} alt="Preview" className="w-32 h-32 rounded-md mb-2 mx-auto" />
          <input
            type="text"
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-gray-200"
          />
          <input
            type="text"
            placeholder="Twin Type"
            value={twinType}
            onChange={(e) => setTwinType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-gray-200"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 resize-none bg-gray-200"
            rows={6}
          />
          <input
            type="text"
            placeholder="Data Link"
            value={dataLink}
            onChange={(e) => setDataLink(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-gray-200"
          />
          <button onClick={createDigitalTwin} className="bg-grey-1500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
            Create Digital Twin
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateCampaign;
