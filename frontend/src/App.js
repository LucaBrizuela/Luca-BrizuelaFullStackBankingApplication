import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import CreateAccount from './components/CreateAccount';
import Login from './components/Login';
import Logout from './components/Logout';
import Deposit from './components/Deposit';
import Withdraw from './components/Withdraw';
import AllData from './components/AllData';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <UserProvider>
      <div style={{ minHeight: '100vh' }}>
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/deposit" element={<Deposit />} />
            <Route path="/withdraw" element={<Withdraw />} />
            <Route path="/all-data" element={<AllData />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
      </div>
    </UserProvider>
  );
}

export default App;