import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Pages/Home/Home'
import Search from './Pages/Search/Search';
import NurseProfile from './Pages/NurseProfile/NurseProfile';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/> }></Route>
          <Route path="/search" element={<Search/> }></Route>
          <Route path="/nurse/:id" element={<NurseProfile/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
