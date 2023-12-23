import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../Components/Navbar/Navbar';
import "./NurseProfile.css"

import { FaStar } from "react-icons/fa6";


export default function NurseProfile() {

    let {id} = useParams();
    let [nurseData, setNurseData] = useState({});

    useEffect(() => {

        fetch(`http://localhost:8000/nurse/${id}`).then((response) => response.json())
            .then((data) => {
                console.log(data[0]);
                setNurseData(data[0]);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

    }, [])

    
    
    return (
        <>
        <Navbar/>
        <div className="nurseProfile">
            <div className="nurseProfileLeft">
                <img src={nurseData.ImgUrl} alt="" />
                <h6 className='mt-3'>About</h6> <hr />
                <p> {nurseData.AboutMe} </p>
            </div>
            <div className="nurseProfileRight">
                <h3> {nurseData.Name} </h3>
                <h6> {nurseData.Address} </h6>

                <div classname="rating">
                <p className='mt-4 nurseExp'>EXPERIENCE</p>
                {
                    [...Array(nurseData.Ratings)].map((a) => (<FaStar />))
                }
                </div>

                <ul className="nav nav-tabs">
                    <li className="nav-item mt-4">
                        <a className="nav-link active" aria-current="page" href="#">About</a>
                    </li>
                </ul>

                <table className='nurseProfileTable'>
                    <tbody>
                        <h6 className='my-4'>Personal Information</h6>
                        <tr>
                            <td>Name: </td>
                            <td> {nurseData.Name} </td>
                        </tr>

                        <tr>
                            <td>Address: </td>
                            <td> {nurseData.Address} </td>
                        </tr>

                        <tr>
                            <td>City: </td>
                            <td> {nurseData.City} </td>
                        </tr>

                        <tr>
                            <td>State: </td>
                            <td> {nurseData.State} </td>
                        </tr>

                        <h6 className='my-4'>Work Information</h6>

                        <tr>
                            <td>Skills: </td>
                            <td> {nurseData.Name} </td>
                        </tr>

                        <tr>
                            <td>Skill Rating: </td>
                            <td> {nurseData.Skilled} </td>
                        </tr>

                        <tr>
                            <td>Certificates: </td>
                            {/* <td> {nurseData.Links.certificate} </td> */}
                        </tr>

                        <tr>
                            <td>Achievements: </td>
                            {/* <td> {nurseData.Links.achievement} </td> */}
                        </tr>

                        <h6 className='my-4'>Personal Information</h6>

                        <tr>
                            <td>Skills: </td>
                            <td> {nurseData.Name} </td>
                        </tr>

                        <tr>
                            <td>Skill Rating: </td>
                            <td> {nurseData.Skilled} </td>
                        </tr>

                        <tr>
                            <td>Certificates: </td>
                            {/* <td> {nurseData.Links.certificate} </td> */}
                        </tr>

                        <tr>
                            <td>Achievements: </td>
                            {/* <td> {nurseData.Links.achievement} </td> */}
                        </tr>
                    </tbody>
                </table>

                <div className="my-5"></div>
            </div>
        </div>
        </>
    )
}
