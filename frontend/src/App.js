import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Timetable from './components//TimeTable/Timetable'
import { useEffect, useState } from 'react';
import Login from './components/LoginSignup/Login';
import Signup from './components/LoginSignup/Signup';

function App() {
  const [token, setToken] = useState(() => {
    const stored = sessionStorage.getItem('token');
    return stored ? JSON.parse(stored) : null;
  });

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
      {/* <Router> */}
        <Routes>
          <Route path="/timetable" element={<Timetable token={token}/>} />        
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/" element={<Signup/>}/>
           <Route path="*" element={<Navigate to= "/"/>}/>
        </Routes>
      </Router>
  );
}

export default App;