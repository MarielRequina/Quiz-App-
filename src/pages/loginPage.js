import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = () => {
    setErrorEmail('');
    setErrorPassword('');
    setLoginError('');

    if (!email.endsWith('@gmail.com')) {
      setErrorEmail('Email is not a valid email');
      return;
    }
    if (password.length < 8 || password.length > 20) {
      setErrorPassword('Password must be between 8 and 20 characters');
      return;
    }

    const auth = getAuth(); // Get authentication instance

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        // If successful, navigate to profile page
        window.location.href = '/quiz';
      })
      .catch((error) => {
        // Handle sign-in errors
        setLoginError(error.message);
      });
  };
  const handleSignup = () => {
    window.location.href = '/sign';
  };
  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500'>
      {/* Left Section: Logo */}
      <div className="flex justify-center items-center w-1/2 pl-20">
        <img src="/images/quizlogo.png" alt=""/> 
      </div>
      {/* Right Section: Login Form */}
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-1/2">
        <p className='text-4xl font-bold mb-8 text-gray-800'>Log In</p>
        <div className='flex flex-col mb-6'>
          <label className='text-gray-800 mb-1' htmlFor='email'>Email</label>
          <input
            className='w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:border-purple-500'
            id='email'
            type='email'
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <p className='text-red-500 text-sm mt-1'>{errorEmail}</p>
        </div>
        <div className='flex flex-col mb-6'>
          <label className='text-gray-800 mb-1' htmlFor='password'>Password</label>
          <input
            className='w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:border-purple-500'
            id='password'
            type='password'
            value={password}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className='text-red-500 text-sm mt-1'>{errorPassword}</p>
          <button
            className='w-full bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 transition duration-300'
            onClick={handleLogin}
          >
            Login
          </button>{loginError && <p className='text-red-500 mt-2'>{loginError}</p>}
          <p>&ensp;</p>
          <button
            className='w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition duration-300'
            onClick={handleSignup}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
