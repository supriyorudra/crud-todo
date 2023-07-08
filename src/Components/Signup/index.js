import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
// import axios from 'axios';
import { toast } from 'react-toastify';


import './styles.css'

const Signup = () => {
  const [name, setName] = useState('');
  const [email, SetEmail] = useState('');
  const [password, SetPassword] = useState('');
  const [confirmPassword, SetConfirmPassword] = useState('');
  const navigate = useNavigate();


  //handle login link to navigate to login page
  const handleLogin = () =>{
    navigate('/login');
  }

  let users = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];


  //Fucntion to handle signup button to authenticate and move to login page also store all the data to local storage
  const handleSignup = async(e) => {
    e.preventDefault();

    if ((name && email && password && confirmPassword) && password === confirmPassword) {
      users.push({ name, email, password })
      localStorage.setItem('users', JSON.stringify(users));
      setName('');
      SetEmail('');
      SetPassword('');
      SetConfirmPassword('')
      toast.success('Signed Up Successfully!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
      navigate('/login');


      // axios
      //   .post('http://localhost:3006/signup', { name, email, password })
      //   .then((response) => {
      //     // Handle successful registration (e.g., redirect to login page)
      //     console.log(response.data);
      //   })
      //   .catch((error) => {
      //     // Handle registration errors (e.g., display error message)
      //     console.error(error);
      //   });

    }
    else{
      toast.error('Fill all the details carefully!');
    }

  }

  return (
    <div className='signupForm'>

      <form>
        <h2>Signup</h2>
        <input
          type="text"
          value={name}
          placeholder='Full Name'
          onChange={e => setName(e.target.value)}
        />
        <input
          type="email"
          value={email}
          placeholder='Email'
          onChange={e => SetEmail(e.target.value)}
        />
        <input
          type="password"
          value={password}
          placeholder='Password'
          onChange={e => SetPassword(e.target.value)}
        />
        <input
          type="password"
          value={confirmPassword}
          placeholder='Confirm Password'
          onChange={e => SetConfirmPassword(e.target.value)}
        />
        <button onClick={handleSignup}>Signup</button>
        
        <p>Already have an account? <span onClick={handleLogin}>Login</span></p>
      </form>
    </div>
  )
}

export default Signup