import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Pages/Home/Home'
// import Search from './Pages/Search/Search';
import NurseProfile from './Pages/NurseProfile/NurseProfile';
import Login from './Pages/Login/Login';
import Location from './Pages/Components/Location/Location';
import UserDash from './Pages/Dashboards/UserDashboard/UserDash';
import SignUpNurse from './Pages/SignUp/Nurse/SignUpNurse';
import SignUpUser from './Pages/SignUp/User/SignUpUser';
import { SearchResults } from './Pages/Search/search-results';
import { Navbar } from './Pages/Components/Navbar/navbar';
import Footer from './Pages/Components/Footer/Footer';

function App() {
  return (
    <>
      <BrowserRouter>
      <Navbar/> 
        <Routes>
          {/* Good */}
          <Route path="/" element={<Home/> }></Route>
          <Route path="/search" element={<SearchResults/> }></Route>
          <Route path="/nurse/:id" element={<NurseProfile/>}></Route>
          <Route path="/login/:type" element={<Login/>}></Route>
          {/* <Route path="/signup" element={<SignUp/>}></Route> */}
          <Route path="/signup/nurse" element={<SignUpNurse/>}></Route>
          <Route path="/signup/user" element={<SignUpUser/>}></Route>
          <Route path="/location" element={<Location/>}></Route>
          <Route path="/user/" element={<UserDash/>}></Route>
        </Routes>
        <Footer/>
      </BrowserRouter>
    </>
  )
}

export default App
