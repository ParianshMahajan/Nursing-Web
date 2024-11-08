import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import "./NurseProfile.css"

import { FaStar } from "react-icons/fa6";
import { Navbar } from '../Components/Navbar/navbar';
import { AuthContext } from '@/api/auth';
import axios from 'axios';
import { API_URL } from '@/api/config';


export default function NurseProfile() {

    let { id } = useParams();
    const { token } = useContext(AuthContext);
    let [nurseData, setNurseData] = useState({});

    var getNurseData = async () => {
        const response = await axios.get(`${API_URL}/nurse/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    
    
        setNurseData(response.data.data);
        console.log(response.data.data); 
    };


        useEffect(() => {
            getNurseData();
        }, [])



        return (
            <>
                <Navbar />
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
