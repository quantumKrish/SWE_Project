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
import LandingPage from './pages/LandingPage';
import ForgotPassword from './pages/ForgotPassword';
import CodeSent from './pages/CodeSent';
import VerifyEmail from './pages/VerifyEmail';
import SetNewPassword from './pages/SetNewPassword';
import PasswordSuccess from './pages/PasswordSuccess';
import EditProfile from './pages/EditProfile';
import AddPet from './pages/AddPet';
import Message from './pages/Message';
import Inbox from './pages/Inbox';


import { UserProvider } from './pages/UserContext';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<SearchPetMinders />} />
          <Route path="/search/:username" element={<SearchPetMinders />} />
          <Route path="/book" element={<BookPetMinder />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/code-sent" element={<CodeSent />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/set-new-password" element={<SetNewPassword />} />
          <Route path="/password-success" element={<PasswordSuccess />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/add-pet" element={<AddPet />} />
          <Route path="/message/" element={<Inbox />} />
          <Route path="/message/:id" element={<Message />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
