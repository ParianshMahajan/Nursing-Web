import React from 'react'
import "./Home.css"
import Navbar from '../Components/Navbar/Navbar'

export default function Home() {
  return (
    <>
      <Navbar/>
      <div className="home">
        <div className="homeHeadings">
          <h4 className='homeTagUp'>Sehat Ka Saathi</h4>
          <h1 className='homeHead'>Nurses for Home</h1>
          <p className='homeTagDown'>
            24/7 Service, Private Consultation + Emergency Services <br /> 
            Starts at just 10$, Exclusively on our mobile app
          </p>
        </div>
      </div>
    </>
  )
}
