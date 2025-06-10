import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../redux/authSlice';
import Cookies from 'js-cookie';
import axios from 'axios';
import userimg1 from '../assets/userimg.png';
import Swal from 'sweetalert2'; // Import SweetAlert2


export default function Profile() {
  const dispatch = useDispatch();
  const reduxUser = useSelector((state) => state.auth.user);
  const [user, setUser] = useState(reduxUser);

  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  // const [password, setPassword] = useState();
  const [userimg, setUserimg] = useState("");
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // 🔁 Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      const userCookie = Cookies.get('user');
      if (!userCookie) return;

      const user = JSON.parse(userCookie);
      const id = user.id;
      try {
        const res = await axios.post('http://localhost:3000/getuser', { id }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const fetchedUser = res.data;

        setUser(fetchedUser);
        setName(fetchedUser.name);
        setEmail(fetchedUser.email);

        dispatch(setCredentials({ user: fetchedUser, token: Cookies.get('token') }));
        Cookies.set('user', JSON.stringify({ id: fetchedUser.id, name: fetchedUser.name }));
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    fetchUser();
  }, [dispatch]);

  // 📝 Handle profile edit
  const handleEdit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      // if (password) formData.append('password', password);
      if (userimg) formData.append('userimg', userimg);

      const token = Cookies.get('token');
      const response = await axios.put('http://localhost:3000/updateprofile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedUser = response.data.user;

      dispatch(setCredentials({ user: updatedUser, token }));
      Cookies.set('user', JSON.stringify({ id: updatedUser.id, name: updatedUser.name }));

      setUser(updatedUser);
      Swal.fire({
        icon: 'success',
        iconColor: '#007762',
        title: 'Profile Updated!',
        text: 'Your profile has been updated successfully.',
        button: "#007762",
        confirmButtonText: 'OK',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      Swal.fire({
        icon: 'error',
        iconColor: '#007762',
        title: 'Failed to Update Profile',
        text: 'An error occurred while updating your profile.',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <section className='w-full mt-[140px]'>
      <div className='w-[95%] lg:w-[80%] flex flex-col md:flex-row mx-auto my-[70px]'>
        <div className='w-full md:w-[30%] flex justify-center h-full'>
          <img
            src={
              user?.userimg
                ? `http://localhost:3000${user.userimg}`
                : userimg1
            }
            alt='User'
            className=' w-[350px] aspect-square object-cover rounded-full my-auto'
          />
        </div>
        <div className='w-full md:w-[70%] px-[30px] relative'>
          <p className='text-[30px] font-semibold color mb-[30px]'>Your Profie data</p>
          <div className='relative'>
            <p>{`User ID: ${user?.id}`}</p>
            <p className='absolute top-0 right-0'>{`Created At: ${user?.createdat || ''}`}</p>
            <form onSubmit={handleEdit}>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='input'
                type='text'
                placeholder='Name'
                required
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='input'
                type='email'
                placeholder='Email'
                required
              />
              <input
                type='file'
                onChange={(e) => setUserimg(e.target.files[0])}
                className='input'
              />
              {/* <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='input'
              type='password'
              placeholder='New Password'
            /> */}
              <button type='submit' className='btn'>
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
