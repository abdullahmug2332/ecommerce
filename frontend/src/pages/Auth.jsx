import React, { useEffect, useState } from 'react';
import loginpic from "../assets/loginpic.png";
import Cookies from 'js-cookie';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/authSlice';
import Swal from 'sweetalert2';
import { FiAlertCircle } from "react-icons/fi";
import { HiEmojiSad } from "react-icons/hi";


export default function Auth() {
  const [toggle, setToggle] = useState("login");
  const [toggleError, setToggleError] = useState(false)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userimg, setUserimg] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      Swal.fire({
        icon: "info",
        iconColor: '#007762',
        title: 'Already Logged In',
        text: 'You are already logged in.',
        confirmButtonColor: '#007762'
      }).then(() => {
        navigate("/");
      });
    }
  }, []);
  const url =
    toggle === "login"
      ? "http://localhost:3000/auth/login"
      : "http://localhost:3000/auth/register";


  useEffect(() => {
    if (password.length >= 8) {
      setToggleError(false)
    }
  }, [password])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      setToggleError(true);
      return;
    }

    if (toggle === "login") {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok) {
          dispatch(setCredentials({ user: data.user, token: data.token }));
          Cookies.set("token", data.token, { expires: 7 });
          Cookies.set("user", JSON.stringify(data.user));
          Cookies.set("role", JSON.stringify(data.user.role));

          Swal.fire({
            icon: 'success',
            iconColor: '#007762',
            title: 'Login Successful',
            text: `Welcome back, ${data.user.name}!`,
            timer: 2000,
            showConfirmButton: false,
          });
          navigate("/");
        } else {
          Swal.fire({
            icon: 'error',
            iconColor: '#007762',
            title: 'Login Failed',
            text: data.message || "Invalid email or password.",
          })
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          iconColor: '#007762',
          text: 'Something went wrong.',
        });
        console.error(error);
        console.error(error);
      }
    } else {
      // Registration
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      if (userimg) formData.append("userimg", userimg);

      try {
        const res = await fetch(url, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (res.ok) {
          Swal.fire({
            icon: 'success',
            iconColor: '#007762',
            title: 'Registration Successful',
            text: 'Please log in with your new account.',
            timer: 2000,
            showConfirmButton: false,
          });
          setToggle("login");
          setName("");
          setEmail("");
          setPassword("");
          setUserimg(null);
        } else {
          Swal.fire({
            icon: 'error',
            iconColor: '#007762',
            title: 'Registration Failed',
            text: data.message || "Please try again.",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          iconColor: '#007762',
          title: 'Error',
          text: 'Something went wrong.',
        });
        console.error(error);
      }
    }
  };

  return (
    <section className='w-[95%] md:w-[80%] mx-auto flex my-[80px]'>
      <div className='w-[50%] hidden md:block'>
        <img src={loginpic} className='w-full mt-[50px]' alt="Login Visual" />
      </div>

      <div className='w-full md:w-[50%] px-[30px] md:pl-[30px] md:pr-[0px] xl:px-[60px]'>
        <div className='flex items-center justify-evenly py-[30px]'>
          <button
            onClick={() => setToggle("login")}
            className={toggle === "login" ? "btn" : "btn2"}>
            Log In
          </button>
          <button
            onClick={() => setToggle("register")}
            className={toggle === "register" ? "btn" : "btn2"}>
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {toggle === "register" && (
            <>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='input'
                type="text"
                placeholder='Name'
                required
              />
              <input
                type="file"
                onChange={(e) => setUserimg(e.target.files[0])}
                className='input'
                accept="image/*"
              />
            </>
          )}

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='input'
            type="email"
            placeholder='Email'
            required
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='input'
            type="password"
            placeholder='Password'
            required
          />

          <p className={`color text-[14px] overflow-hidden ${toggleError == true ? "h-[23px]" : "h-[0px]"} `}>Password must be 8 charaters long <HiEmojiSad className='color inline' /></p>


          {toggle === "login" && (
            <div className='mt-2'>
              <Link to="/forgetpass" className='color underline'>
                Forget Password?
              </Link>
            </div>
          )}

          <button className='btn mt-[20px]' type="submit">
            {toggle === "login" ? "Submit" : "Register"}
          </button>
        </form>
      </div>
    </section>
  );
}
