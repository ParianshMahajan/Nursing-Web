import React from 'react'

export default function SignUp() {
  return (
    <div className="login">
        <div className="loginLeft">
            <img src="" alt="" />
        </div>

        <div className="loginRight">
            <h3>Sign Up</h3>
            <form action="">
                <div className="loginFormGroup">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email" placeholder='abcd@example.com'/>
                </div>
                
                <div className="loginFormGroup">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="pass" />
                </div>

                <div className="loginFormGroup">
                    <label htmlFor="password">Confirm Password</label>
                    <input type="password" name="password" id="pass" />
                </div>
                
                <div className="loginFormGroup">
                    <div className="button">Proceed</div>
                </div>

                <p>Already have an account? <a href="/login">Login</a></p>

            </form>
        </div>
    </div>
  )
}
