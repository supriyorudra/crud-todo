import React from 'react';
import { Link } from 'react-router-dom';

import './styles.css'

const Header = () => {
    
  return (
    // link the links to navigate for specific pages
    <div className='navbar'>
        <Link to={'/'}>Signup</Link>
        <Link to={'/login'}>Login</Link>
        <Link to={'/Dashboard'}>Dashboard</Link>
    </div>
  )
}

export default Header