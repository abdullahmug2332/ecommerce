import React, { useEffect } from 'react'
import { useState } from 'react';
import loginpic from "../assets/loginpic.png";
import { Navigate, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';



export default function ForgetPass() {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [step, setStep] = useState(1);
    const navigate = useNavigate()

    useEffect(() => {
        const token = Cookies.get("token");

        if (token) {
            Swal.fire({
                title: 'Already Logged In',
                text: 'You are already logged in.',
                icon: 'info',
                iconColor: '#007762',
                confirmButtonColor: '#007762'
            }).then(() => {
                navigate("/");
            });
        }
    }, []);

    const handleSendCode = async () => {
        try {
            const res = await fetch("http://localhost:3000/sendcode", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();

            if (res.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Code Sent!',
                    text: data.message,
                    confirmButtonColor: '#007762'
                });
                setStep(2);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.message,
                    confirmButtonColor: '#d33'
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Server Error',
                text: 'Something went wrong!',
                confirmButtonColor: '#d33'
            });
        }
    };

    const handleResetPassword = async () => {
        try {
            const res = await fetch("http://localhost:3000/resetpassword", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code, newPassword }),
            });
            const data = await res.json();

            if (res.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Password Reset',
                    text: data.message,
                    confirmButtonColor: '#007762'
                }).then(() => {
                    navigate("/auth");
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.message,
                    confirmButtonColor: '#d33'
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Server Error',
                text: 'Something went wrong!',
                confirmButtonColor: '#d33'
            });
        }
    };
    return (
        <section className='w-[80%] mx-auto flex my-[80px]'>
            <div className='w-[50%] hidden md:block'>
                <img src={loginpic} className='w-full mt-[50px]' alt="Login Visual" />
            </div>
            <div className='w-full md:w-[50%] px-[60px]'>
                <div className=' py-[30px]'>
                    <p className='text-[25px]'>Forget Password</p>
                </div>
                {step === 1 && (
                    <>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button onClick={handleSendCode} className="btn">
                            Send Code
                        </button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <input
                            type="text"
                            placeholder="Enter the code"
                            className="input"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            className="input"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button onClick={handleResetPassword} className="btn">
                            Reset Password
                        </button>
                    </>
                )}
            </div>
        </section>
    )
}
