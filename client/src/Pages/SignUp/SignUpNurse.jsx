import { NurseSignupFormComponent } from './nurse-signup-form'
import React from 'react'

export default function SignUpNurse() {
  return (
    <div className="login">
        <div className="loginLeft hidden sm:block">
            <img src="" alt="" />
        </div>

        <div className="loginRight pt-5 mb-5">
            <h3 style={{fontWeight:"semi-bold",fontSize:"2em",marginBottom:"25px"}}>Sign Up</h3>

            <NurseSignupFormComponent />

            <div className='mb-5'>

            </div>
            
        </div>
    </div>

  )
}
