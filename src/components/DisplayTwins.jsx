import React from 'react';
import { useNavigate } from 'react-router-dom';
import TwinCard from './TwinCard'; // Assuming you have a TwinCard component to display twin details
import { loader } from '../assets';

const DisplayTwins = ({ title, isLoading, twins }) => {
  const navigate = useNavigate();

  const handleNavigate = (twin) => {
    navigate(`/twin-details/${twin.id}`, { state: twin });
  };

  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">{title} ({twins.length})</h1>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading ? (
          <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
        ) : twins.length === 0 ? (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            You have not added any Digital Twins!
          </p>
        ) : (
          twins.map((twin) => (
            <TwinCard key={twin.id} {...twin} handleClick={() => handleNavigate(twin)} />
          ))
        )}
      </div>
    </div>
  );
};

export default DisplayTwins;
