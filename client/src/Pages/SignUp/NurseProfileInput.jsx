import React from 'react'
import "./NurseProfileInput.css"

export default function ProfileInput() {
  return (
    <div className="nurseProfileInput">
        <div className="nurseProfileCont">

          <h3 className='profileLabel'>Personal Details</h3>

          <div className="profileRow">

            <div className="formGroup">
              <label htmlFor="">First Name</label>
              <input type="text" />
            </div>

            <div className="formGroup">
              <label htmlFor="">Last Name</label>
              <input type="text" />
            </div>

          </div>

          <div className="profileRow">
            <div className="formGroup">
              <label htmlFor="">Email</label>
              <input type="text" />
            </div>

            <div className="formGroup">
              <label htmlFor="">Phone</label>
              <input type="text" />
            </div>
          </div>

          <div className="profileRow">
            <div className="formGroup">
              <label htmlFor="">Skills</label>
              <input type="text" />
            </div>
          </div>

          <div className="profileRow">
            <div className="formGroup">
              <label htmlFor="">About Me</label>
              <textarea name="" id="" rows={"10"}></textarea>
            </div>
          </div>

          <h3 className='profileLabel'>Address</h3>

          <div className="profileRow">
            <div className="formGroup">
              <label htmlFor="">Billing Address</label>
              <input type="text" />
            </div>
          </div>

          <div className="profileRow">
            <div className="formGroup">
              <label htmlFor="">City</label>
              <input type="text" />
            </div>

            <div className="formGroup">
              <label htmlFor="">State</label>
              <input type="text" />
            </div>

            <div className="formGroup">
              <label htmlFor="">Postal Code</label>
              <input type="text" />
            </div>
          </div>

          <div className="profileRow">
            <div className="formGroup">
              <label htmlFor="">Shipping Address</label>
              <input type="text" />
            </div>
          </div>

          <div className="profileRow">
            <div className="formGroup">
              <label htmlFor="">City</label>
              <input type="text" />
            </div>

            <div className="formGroup">
              <label htmlFor="">State</label>
              <input type="text" />
            </div>

            <div className="formGroup">
              <label htmlFor="">Postal Code</label>
              <input type="text" />
            </div>
          </div>


          <h3 className="profileLabel">Educational Details</h3>

          <div className="profileRow">
            <div className="formGroup">
              <label htmlFor="">Education</label>
              <input type="text" />
            </div>
          </div>

          <div className="profileRow">
            <div className="formGroup">
              <label htmlFor="">University Name</label>
              <input type="text" />
            </div>
          </div>


          <div className="profileRow">
            <div className="formGroup">
              <button className='button'>Submit</button>
            </div>
          </div>

        </div>
    </div>
  )
}
