import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarker,
  faPhone,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faTwitter,
  faLinkedin,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

import "./Footer.css";

const Footer = () => {
  return (
    <section>
      <footer className="footer-distributed">
        <div className="footer-left" >
          <h3 >
          तपोवन्
          </h3>
          {/* <p className="footer-links">
            <a href="#" className="link-1">
              Home
            </a>
            <a href="#">Nurses</a>
            <a href="#">Pricing</a>
            <a href="#">About</a>
            <a href="#">Faq</a>
            <a href="#">Contact</a>
          </p> */}
          <p className="footer-company-name" style={{marginTop:"13px"}}>Company Name © 2015</p>
        </div>

        <div className="footer-center">
          <div style={{marginBottom:"13px"}}>
            <FontAwesomeIcon icon={faMapMarker} />
            <p style={{marginLeft:"15px"}}>
              <span>Rajpura,Chitkara</span> Punjab
            </p>
          </div>
          <div style={{marginBottom:"13px"}}>
            <FontAwesomeIcon icon={faPhone} />
            <p style={{marginLeft:"15px"}}>+91 7876768113</p>
          </div>
          <div style={{marginBottom:"13px"}}>
            <FontAwesomeIcon icon={faEnvelope} />
            <p>
              <a style={{marginLeft:"15px", color:"white"}} href="mailto:parianshm@gmail.com">parianshm@gmail.com</a>
            </p>
          </div>
        </div>

        <div className="footer-right">
          <p className="footer-company-about">
            <span>About the company</span> Facilitating transparent and efficient booking, our platform enables families to set preferences and recieve a curated list of qualified nurses within their specified range.
          </p>
          <div className="footer-icons">
            <a href="#">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a href="https://www.linkedin.com/in/pariansh-mahajan-3943b625b/" target="_blank">
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
            <a href="https://github.com/ParianshMahajan" target="_blank">
              <FontAwesomeIcon icon={faGithub} />
            </a>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default Footer;
