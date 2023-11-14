import React from 'react'
import "./Home.css"
import Navbar from '../Components/Navbar/Navbar'
import Searchbar from '../Components/Searchbar/Searchbar'
import Selector from './Components/Selectors/Selector'

export default function Home() {
  return (
    <>
      <Navbar/>
      <div className="home hero">
        <div className="homeHeadings">
          <h4 className='homeTagUp'>Sehat Ka Saathi</h4>
          <h1 className='homeHead'>Nurses for Home</h1>
          <p className='homeTagDown'>
            24/7 Service, Private Consultation + Emergency Services <br /> 
            Starts at just 10$, Exclusively on our mobile app
          </p>
        </div>

        <div className="homeSearchCont">
          <Searchbar/>
        </div>

        <div className="homeSelectorCont">
          <div className="homeSelector">
            <h5>Are You Looking For:</h5>
            <div className="homeSelectors">
              <Selector/>
              <Selector/>
              <Selector/>
            </div>
          </div>
        </div>

      </div>

      <div className="homeVideoCont">
        <div className="homeVideo">
        </div>
      </div>

      <div className="pp">

      </div>

      
    </>
  )
}
