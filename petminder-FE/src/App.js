import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import SearchPetMinders from './pages/SearchPetMinders';
import BookPetMinder from './pages/BookPetMinder';
import Tracking from './pages/Tracking';
import Profile from './pages/Profile';
import LogIn from './pages/LogIn';
import SignUp from './pages/SignUp';

import { UserProvider } from './pages/UserContext';

function App() {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchPetMinders />} />
          <Route path="/book" element={<BookPetMinder />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
