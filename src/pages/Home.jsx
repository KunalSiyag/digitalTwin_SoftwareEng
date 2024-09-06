import React, { useState, useEffect } from 'react';
import { DisplayTwins } from '../components';
import { useStateContext } from '../context';

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [twins, setTwins] = useState([]); // Changed campaigns to twins
  const { address, contract, getCampaigns } = useStateContext();

  const fetchTwins = async () => {
    setIsLoading(true);
    try {
      const data = await getCampaigns(); // Assuming getCampaigns fetches twins data
      setTwins(data);
    } catch (error) {
      console.error('Error fetching twins:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (contract) fetchTwins();
  }, [address, contract]);

  return (
    <DisplayTwins
      title="All Digital Twins"
      isLoading={isLoading}
      twins={twins} // Changed campaigns to twins
    />
  );
};

export default Home;
