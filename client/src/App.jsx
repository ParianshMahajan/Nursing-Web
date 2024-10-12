import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Pages/Home/Home'
import Search from './Pages/Search/Search';
import NurseProfile from './Pages/NurseProfile/NurseProfile';
import Login from './Pages/Login/Login';
import Location from './Pages/Components/Location/Location';
import UserDash from './Pages/Dashboards/UserDashboard/UserDash';
import SignUpNurse from './Pages/SignUp/Nurse/SignUpNurse';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Good */}
          <Route path="/" element={<Home/> }></Route>
          <Route path="/search" element={<Search/> }></Route>
          <Route path="/nurse/:id" element={<NurseProfile/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/signup/user" element={<SignUpNurse/>}></Route>
          <Route path="/signup/nurse" element={<SignUpNurse/>}></Route>
          <Route path="/location" element={<Location/>}></Route>
          <Route path="/user/dash" element={<UserDash/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
