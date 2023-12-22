import React from 'react'
import "./Selector.css"

export default function Selector(props) {
  return (
    <div className="selector">
        <h5>{`Selector Type ${props.id}`}</h5>
        <p>{props.details}</p>
    </div>
  )
}
