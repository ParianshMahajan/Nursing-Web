import "./Home.css";
import Searchbar from "../Components/Searchbar/Searchbar";
import Selector from "./Components/Selectors/Selector";

import bg from './Assets/bg.png'
import Hands from './Assets/Hands.svg'

import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/api/auth";


export default function Home() {
  const navigate = useNavigate();
  const { role,token } = useContext(AuthContext);

  useEffect(() => {
    if(role && token) {
      navigate(`/${role}/dashboard`);
    }
  }, [role,token]);

  return (
    <Box position="relative">
      <Box sx={{ position: "absolute", background: `url(${bg})`, height: "60vh", width: "100%", zIndex: -1, backgroundSize: 'cover', backgroundRepeat: "no-repeat" }}>
      </Box>
      <img src={Hands} style={{ position: "absolute", top: "16%", left: "9%", width: "13%" }} />

      <Box className="home hero" >
        <div className="homeHeadings typewriter">
          <h1 className="tapovan homeHead" style={{ color: "#002130" }}>तपोवन</h1>
          <h4 className="homeTagUp">Sehat Ka Saathi</h4>

          <p className="homeTagDown">
            24/7 Service, Private Consultation + Emergency Services
          </p>

        </div>
        <div className="homeSearchCont" style={{ cursor: "pointer" }}>
          <Searchbar />
        </div>

        <div className="homeSelectorCont">
          <div className="homeSelector">
            {/* <h5>Sign up as:</h5> */}
            <div className="homeSelectors">
              <Selector key="1" id="1" details="nurse" />
              <Selector key="2" id="2" details="user" />
            </div>
          </div>
        </div>
      </Box>

      {/* <div className="homeVideoCont">
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
      </div> */}

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
      {/* <Footer /> */}
    </Box>
  );
}
