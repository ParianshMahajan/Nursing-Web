import React from 'react'
import "./Selector.css"
import { useNavigate } from 'react-router-dom'

export default function Selector(props) {
  const navigate=useNavigate();
  return (
    <div className={`selector ${props.details}`} onClick={()=>{navigate(`/login/?login=${props.details}`)}} >
        <p>Log in </p>
        <h4>{`As a ${props.details}`}</h4>
    </div>
  )
}
