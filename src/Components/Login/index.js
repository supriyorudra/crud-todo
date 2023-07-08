import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

import './styles.css'

const Login = () => {
  const [email, SetEmail] = useState('');
  const [password, SetPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  let users = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];

  //funtion for Login button to authenticate and navigate to dashboard page
  const handleLogin = (e) => {
    e.preventDefault();

    let isPresent = false;

    //mapping the users from local storage to match the details
    users.map(user => {
      if (email === user.email && password === user.password) {
        isPresent = true;
        localStorage.setItem('currentUser', JSON.stringify({ name, email, password }));
        setName(user.name);
        return;

        // axios
        //   .post('/api/login', { email, password })
        //   .then((response) => {
        //     // Handle successful login (e.g., redirect to dashboard)
        //     console.log(response.data);
        //   })
        //   .catch((error) => {
        //     // Handle login errors (e.g., display error message)
        //     console.error(error);
        //   });
      }
    })
    if (isPresent) {
      toast.success('Logged In Successfully!')
      setName('');
      SetEmail('');
      SetPassword('')
      navigate('/dashboard');
    }
    else {
      toast.error('Invalid Credentials!')
    }
  }

  //handle the signup link to navigate to signup page
  const handleSignup = () => {
    navigate('/')
  }


  return (
    <div className='loginForm'>
      <form>
        <h2>Login</h2>

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
        <button onClick={handleLogin}>Signup</button>

        <p>Don't have an account? <span onClick={handleSignup}>Signup</span></p>
      </form>
    </div>
  )
}

export default Login