import React, { useEffect, useState } from 'react'
import "./Search.css"
import Navbar from '../Components/Navbar/Navbar'
import Searchbar from '../Components/Searchbar/Searchbar'

import { FaStar } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

export default function Search() {

    let [searchres, getsearchres] = useState([])
    let navigate = useNavigate();

    const [formData, setFormData] = useState({
        Skilled: '0',
        Ratings: '0',
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {

        e.preventDefault();
        const queryParams = new URLSearchParams(formData).toString();
        console.log(queryParams);

        fetch(`http://localhost:8000/search?${queryParams}`).then((response) => response.json())
            .then((data) => {
                getsearchres(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
            
    };

    useEffect(()=>{
        const queryParams = new URLSearchParams(formData).toString();
        fetch(`http://localhost:8000/search?${queryParams}`).then((response) => response.json())
            .then((data) => {
                getsearchres(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

    }, []);

    const redirector = async (e) => {
        const url = "/nurse/" + e.target.id;
        navigate(url);
    }

    return (
        <div>
            <Navbar />
            <div className="searchCont">
                <Searchbar width="90" />
                <form className="searchFilterCont" method='GET' onSubmit={handleSubmit}>
                    <div className="searchFilter">
                        <label htmlFor="Ratings">Rating</label>
                        <select name="Ratings" id="" onChange={handleInputChange}>
                            <option value="0" selected>ALL</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>

                    <div className="searchFilter">
                        <label htmlFor="Skilled">Skilled</label>
                        <select name="Skilled" onChange={handleInputChange}>
                            <option value="0" selected>ALL</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                    </div>

                    <button type='submit'>
                        Apply
                    </button>
                </form>

                <div className="searchResults">

                    {
                        searchres.length!=0?
                        searchres.map((result) => (
                            <div className="searchResult" id={result._id} onMouseDown={redirector}>
                                <div className="searchResultLeft">
                                    <h3>{result.Name}</h3>
                                    <p>{result.City} | {result.State}</p>
                                    <p className='mt-3' style={{ color: "grey" }}>{result.AboutMe}</p>
                                </div>
                                <div className="searchResultRight">
                                    <h4>{result.Price}$</h4>
                                    <div classname="rating">
                                        {
                                            [...Array(result.Ratings)].map((a) => (<FaStar />))
                                        }
                                    </div>
                                </div>
                            </div>
                        )):

                        <h1>No Result Found</h1>
                    }
                </div>
            </div>
        </div>
    )
}
