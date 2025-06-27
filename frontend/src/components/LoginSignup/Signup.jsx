import React, { useState } from 'react';
import './LoginSignup.css';
import {Link} from 'react-router-dom'
import { supabase } from '../LoginSignup/client';

import email_icon from './Image/email.png';
import password_icon from './Image/lock.png';
import user_icon from './Image/user.png'

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullname: '', email: '', password: ''
  });

  function handleChange(event) {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value
      };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            fullname: formData.fullname,
          }
        }
      });
      if (error) throw error;
      alert("Check your email for verification link");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className='container'>
        <div className="header">
          <div className="text">Sign Up</div>
        </div>
        <div className="inputs">
          <div className="input">
            <img src= {user_icon} alt="" />
            <input 
              type="text" 
              name="fullname" 
              placeholder='Name' 
              onChange={handleChange} />
          </div>
          <div className="input">
            <img src= {email_icon} alt="" />
            <input 
              type="email" 
              name="email" 
              placeholder='Email' 
              onChange={handleChange} />
          </div>
            <div className="input">
              <img src= {password_icon} alt="" />
              <input 
                type="password" 
                name="password" 
                placeholder='Password' 
                onChange={handleChange}  />
            </div>
        </div>

          <button type='submit' className='submit'>
            Submit
          </button>
          <div className="bottom-text">Already have an account? <Link to='/login'>Log In</Link>
          </div>
      </form>
    </div>
  );
}

export default SignUp;