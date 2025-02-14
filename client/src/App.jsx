import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Pages/Home/Home'
// import Search from './Pages/Search/Search';
import NurseProfile from './Pages/NurseProfile/NurseProfile';
import Login from './Pages/Login/Login';
import Location from './Pages/Components/Location/Location';
import UserDash from './Pages/Dashboards/UserDashboard/UserDash';
import { SearchResults } from './Pages/Search/search-results';
import { Navbar } from './Pages/Components/Navbar/navbar';
import Footer from './Pages/Components/Footer/Footer';
import { SignUpNurse } from './Pages/SignUp/nurse-signup-form';
import { SignUpUser } from './Pages/SignUp/user-signup-form';
import { SignUpApartment } from './Pages/SignUp/apartment-signup-form';
import { AuthProvider } from './api/auth';
import NurseProfileUser from './Pages/NurseProfile/NurseProfileUser';
import About from './Pages/About/About';
import Contact from './Pages/Contact/Contact';
import ApartmentList from './Pages/Apartments/ApartmentList';
import ApartmentDetail from './Pages/Apartments/ApartmentDetail';
import ApartmentDash from './Pages/Dashboards/ApartmentDashboard/ApartmentDash';

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
        <Navbar />
        <Routes>
            {/* Good */}
            <Route path="/" element={<Home />}></Route>
            <Route path="/search" element={<SearchResults />}></Route>
            <Route path="/nurse/dashboard" element={<NurseProfile />}></Route>
            <Route path="/nurseProfile/:id" element={<NurseProfileUser />}></Route>
            <Route path="/login/:type" element={<Login />}></Route>
            {/* <Route path="/signup" element={<SignUp/>}></Route> */}
            <Route path="/signup/nurse" element={<SignUpNurse />}></Route>
            <Route path="/signup/user" element={<SignUpUser />}></Route>
            <Route path="/signup/apartment" element={<SignUpApartment />}></Route>
            <Route path="/location" element={<Location />}></Route>
            <Route path="/user/dashboard" element={<UserDash />}></Route>
            <Route path="/apartment/dashboard" element={<ApartmentDash />}></Route>
            <Route path="/about" element={<About />}></Route>
            <Route path="/contact" element={<Contact />}></Route>
            
            {/* Apartment Routes */}
            <Route path="/apartments" element={<ApartmentList />}></Route>
            <Route path="/apartment/:id" element={<ApartmentDetail />}></Route>
        </Routes>
        <Footer />
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
