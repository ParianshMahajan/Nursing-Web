import React from 'react'
import "./Login.css"
import { useParams, useSearchParams } from 'react-router-dom'

export default function Login() {
    const { type } = useParams();
    console.log(type);
    return (
        <div className="login">
            <div className="loginLeft">
                <img src="" alt="" />
            </div>

            <div className="loginRight">
                <h3 style={{ fontWeight: "semi-bold", fontSize: "2em" }}>LOGIN</h3>
                <form action="">
                    <div className="loginFormGroup">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" placeholder='abcd@gmail.com' />
                    </div>

                    <div className="loginFormGroup">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="pass" />
                    </div>

                    <div className="loginFormGroup">
                        <div className="button">LOGIN</div>
                    </div>

                    <p>Dont have an account? <a href={`/signup/${type}`}>Sign Up</a></p>

                </form>
            </div>
        </div>
    )
}
