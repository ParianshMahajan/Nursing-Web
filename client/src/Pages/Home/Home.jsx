import React from "react";
import "./Home.css";
import Navbar from "../Components/Navbar/Navbar";
import Searchbar from "../Components/Searchbar/Searchbar";
import Selector from "./Components/Selectors/Selector";
import Footer from "../Components/Footer/Footer";

import tapovan from './Assets/Tapovan.mp4'
import { useNavigate } from "react-router-dom";


export default function Home() {
  const navigate=useNavigate();
  return (
    <>
      <Navbar />
      <div className="home hero">
        <div className="homeHeadings typewriter">
          <h1 className="homeHead" style={{color:"#002130"}}>तपोवन्</h1>
          <h4 className="homeTagUp">Sehat Ka Saathi</h4>
     
          <p className="homeTagDown">
            24/7 Service, Private Consultation + Emergency Services <br />
            Starts at just 10$, Exclusively on our website
          </p>

        </div>
        <div className="homeSearchCont" onClick={()=>{navigate('/search')}} style={{cursor:"pointer"}}>
          <Searchbar width="60" />
        </div>

        <div className="homeSelectorCont">
          <div className="homeSelector">
            {/* <h5>Sign up as:</h5> */}
            <div className="homeSelectors">
              <Selector id="1" details="Nurse"  />
              <Selector id="2" details="User"  />
            </div>
          </div>
        </div>
      </div>

      <div className="homeVideoCont">
        <div className="homeVideo" dangerouslySetInnerHTML={{ __html: `
        <video class="heroVideo" loop autoplay muted playsinline>
        <source src=${tapovan} type="video/mp4">
        Your browser does not support the video tag.
      </video>           
    ` }}></div>
        <div className="homeVideoSide leftside">
          <div className="sideIcon"></div>
          <div>
            <h5 className="mb-2">Consultant</h5>
            <p>Lorem ipsum dolor sit amet.</p>
          </div>
        </div>
        <div className="homeVideoSide righthside">
          <div className="sideIcon"></div>
          <div>
            <h5 className="mb-2">24/7 Service</h5>
            <p>Lorem ipsum dolor sit amet.</p>
          </div>
        </div>
      </div>

      {/* <div className="homeNurseTypes">
        <h1>
          Hire Top Nurses Online For <br /> Any Health Priority
        </h1>
        <p className="mt-2">
          Lorem ipsum dolor sit amet consectetur adipisicing amet consectetur
          adipisicing.
        </p> */}
{/* 
        <div className="homeNurseTypeSelectors">
          <div className="homeNurseTypeSelector">
            <img
              src="https://images.unsplash.com/photo-1576765607924-3f7b8410a787?q=80&w=1475&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
            />
            <h4>lorem</h4>
          </div>
          <div className="homeNurseTypeSelector">
            <img
              src="https://images.unsplash.com/photo-1576765607924-3f7b8410a787?q=80&w=1475&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
            />
            <h4>lorem</h4>
          </div>
          <div className="homeNurseTypeSelector">
            <img
              src="https://images.unsplash.com/photo-1576765607924-3f7b8410a787?q=80&w=1475&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
            />
            <h4>lorem</h4>
          </div>
          <div className="homeNurseTypeSelector">
            <img
              src="https://images.unsplash.com/photo-1576765607924-3f7b8410a787?q=80&w=1475&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
            />
            <h4>lorem</h4>
          </div>
          <div className="homeNurseTypeSelector">
            <img
              src="https://images.unsplash.com/photo-1576765607924-3f7b8410a787?q=80&w=1475&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
            />
            <h4>lorem</h4>
          </div>
          <div className="homeNurseTypeSelector">
            <img
              src="https://images.unsplash.com/photo-1576765607924-3f7b8410a787?q=80&w=1475&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
            />
            <h4>lorem</h4>
          </div>
        </div> */}
      {/* </div> */}
      <Footer />
    </>
  );
}
