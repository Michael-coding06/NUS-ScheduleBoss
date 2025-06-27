import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginSignup from './components/LoginSignup/LoginSignup';
import Timetable from './components//TimeTable/Timetable'
import { useEffect, useState } from 'react';
import Login from './components/LoginSignup/Login';
import Signup from './components/LoginSignup/Signup';


import Axios from "axios";

function App() {
  const [token, setToken] = useState(false);

  
  if(token){
    sessionStorage.setItem('token', JSON.stringify(token))
  }


  useEffect(() => {
    if(sessionStorage.getItem('token')){
      let data = JSON.parse(sessionStorage.getItem('token'))
      setToken(data)
    }
  }, [])

  return (
    <Router basename='/NUS-ScheduleBoss'>
      <Routes>
        <Route path="/" >
          <Route path="timetable" element={<Timetable token = {token}/>} />        
          <Route path="login" element={<Login setToken ={setToken} />} />
          <Route path="signup" element={<Signup/>} />
          <Route index element={<Signup/>}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
