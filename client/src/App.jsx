import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Pages/Home/Home'
import Search from './Pages/Search/Search';
import NurseProfile from './Pages/NurseProfile/NurseProfile';
import Login from './Pages/Login/Login';
import SignUp from './Pages/SignUp/SignUp';
import ProfileInput from './Pages/SignUp/NurseProfileInput';
import Location from './Pages/Components/Location/Location';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/> }></Route>
          <Route path="/search" element={<Search/> }></Route>
          <Route path="/nurse/:id" element={<NurseProfile/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/signup" element={<SignUp/>}></Route>
          <Route path="/pi" element={<ProfileInput/>}></Route>
          <Route path="/location" element={<Location/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
