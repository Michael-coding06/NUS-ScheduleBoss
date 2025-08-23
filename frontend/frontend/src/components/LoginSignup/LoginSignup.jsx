import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';

const AuthContainer = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      {isLogin ? (
        <Login switchToSignup={() => setIsLogin(false)} />
      ) : (
        <Signup switchToLogin={() => setIsLogin(true)} />
      )}
    </>
  );
};

export default AuthContainer;