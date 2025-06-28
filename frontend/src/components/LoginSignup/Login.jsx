import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { supabase } from './client';

import './LoginSignup.css';

import email_icon from './Image/email.png';
import password_icon from './Image/lock.png';

const Login = ({ setToken }) => {
  let navigate = useNavigate();
  const [formData, setFormData] = useState({
        email: '', password: ''
  });

  console.log(formData)

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
      const {data, error} = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) throw error;
      setToken(data);
      sessionStorage.setItem('token', JSON.stringify(data));
      navigate('/timetable')
      return formData.email;
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className='container'>
        <div className="header">
          <div className="text">Log In</div>
        </div>
        <div className="inputs">
          <div className="input">
            <img src= {email_icon} alt="email" />
            <input 
              type="email" 
              name="email" 
              placeholder='Email' 
              onChange={handleChange} />
          </div>
          <div className="inputs">
            <div className="input">
              <img src= {password_icon} alt="email" />
              <input 
                type="password" 
                name="password" 
                placeholder='Password' 
                onChange={handleChange}  />
            </div>
          </div>
        </div>

          <button type='submit' className='submit'>
            Submit
          </button>
          <div className="bottom-text">Don't have an account? <Link to='/signup'>Sign Up</Link>
          </div>
      </form>
      
    </div>
  );
};

export default Login;
