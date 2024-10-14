import "./Searchbar.css"

import { City } from 'country-state-city';
import { FaLocationDot, FaMagnifyingGlass } from "react-icons/fa6";


// eslint-disable-next-line react/prop-types
export default function Searchbar({width}) {

    let Cities = City.getCitiesOfCountry("IN");

    return (
        <form className="search" style={{width: width + "%"}}>
            <div className="searchLocation">
                <div className='locationIcon'><FaLocationDot/></div>
                <input list='cities' name="browser" id="browser" placeholder='Select City' />
                <datalist id='cities'>
                    { Cities.map((cityData) => (<option key={cityData} value={cityData.name + ", " + cityData.stateCode}>{cityData.name + ", " + cityData.stateCode}</option>))}
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
        </form>
    )
}
