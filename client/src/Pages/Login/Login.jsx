import React from 'react'
import "./Login.css"

export default function Login() {
  return (
    <div className="login">
        <div className="loginLeft">
            <img src="" alt="" />
        </div>

        <div className="loginRight">
            <h3>LOGIN</h3>
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
                    <div className="button">LOGIN</div>
                </div>

                <p>Dont have an account? <a href="/signup">Sign Up</a></p>

            </form>
        </div>
    </div>
  )
}
