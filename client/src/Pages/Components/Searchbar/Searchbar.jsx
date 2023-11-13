import React from 'react'
import "./Searchbar.css"

import { Country, State, City } from 'country-state-city';
import { FaLocationDot, FaMagnifyingGlass } from "react-icons/fa6";


export default function Searchbar() {

    let Cities = City.getCitiesOfCountry("IN");

    return (
        <div className="search">
            <div className="searchLocation">
                <div className='locationIcon'><FaLocationDot/></div>
                <input list='cities' name="browser" id="browser" placeholder='Select City' />
                <datalist id='cities'>
                    { Cities.map((cityData) => (<option value={cityData.name + ", " + cityData.stateCode}>{cityData.name + ", " + cityData.stateCode}</option>))}
                </datalist>
            </div>
            <div className="searchSeperator" />
            <div className="searchNurses">
                <div className='d-flex'>
                    <div className='locationIcon'><FaMagnifyingGlass/></div>
                    <input type="text" placeholder='Cardiac Nurses'/>
                </div>
                <div className="searchBtn">
                    <FaMagnifyingGlass/>
                    Search
                </div>
            </div>
        </div>
    )
}
