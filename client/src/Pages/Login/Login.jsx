import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '@/api/config';
import { useParams } from 'react-router-dom';
import "./Login.css"

export default function Login() {
    const { type } = useParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [isOTPSent, setIsOTPSent] = useState(false);
    const [otpSentMessage, setOtpSentMessage] = useState('');
    const [isLoginFailed, setIsLoginFailed] = useState(false);

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${API_URL}/${type}/sendOTP`, {
                Email: email,
                Password: password
            });

            if (response.data.status) {
                setIsOTPSent(true);
                setOtpSentMessage(response.data.message);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const handleVerifyOTP = async () => {
        try {
            const response = await axios.post(`${API_URL}/${type}/verifyOTP`, {
                Email: email,
                Password: password,
                OTP: otp
            });

            if (response.data.status) {
                localStorage.setItem('token', response.data.token);
                window.location.href = '/dashboard'; // Redirect to dashboard
            } else {
                setIsLoginFailed(true);
            }
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="login">
            <div className="loginLeft">
                <img src="" alt="" />
            </div>

            <div className="loginRight">
                <h3 style={{ fontWeight: "semi-bold", fontSize: "2em" }}>{type.toUpperCase()} - LOGIN</h3>
                <form action="">
                    <div className="loginFormGroup">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" placeholder='abcd@gmail.com' value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className="loginFormGroup">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="pass" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    {isOTPSent ? (
                        <div className="loginFormGroup">
                            <label htmlFor="otp">OTP</label>
                            <input type="text" name="otp" id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} />
                        </div>
                    ) : null}

                    <div className="loginFormGroup">
                        {isOTPSent ? (
                            <div className="button" onClick={handleVerifyOTP}>VERIFY OTP</div>
                        ) : (
                            <div className="button" onClick={handleLogin}>LOGIN</div>
                        )}
                    </div>

                    {isOTPSent ? (
                        <p>{otpSentMessage}</p>
                    ) : null}

                    {isLoginFailed ? (
                        <p style={{ color: 'red' }}>Invalid OTP</p>
                    ) : null}

                    <p>Dont have an account? <a href={`/signup/${type}`}>Sign Up</a></p>

                </form>
            </div>
        </div>
    )
}