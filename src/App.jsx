import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { Sidebar, Navbar } from './components';
import { TwinDetails, CreateCampaign, Home } from './pages';
import VerifyOwnership from './pages/VerifyOwnership'; // Import VerifyOwnership
import UpdateDataLink from './pages/UpdateDataLink'; // Import UpdateDataLink

const App = () => {
  return (
    <div className="relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-row">
      <div className="sm:flex hidden mr-10 relative">
        <Sidebar />
      </div>

      <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-campaign" element={<CreateCampaign />} />
          <Route path="/twin-details/:id" element={<TwinDetails />} />
          <Route path="/verify-ownership" element={<VerifyOwnership />} />
          <Route path="/update-data-link" element={<UpdateDataLink />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
