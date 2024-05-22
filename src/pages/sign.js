import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleLogin = () => {
    window.location.href = '/login'
  };

  const handleSignUp = () => {
    const auth = getAuth();

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User signed up successfully:", user);
        setSuccess(true);
        setError("");

        const uniqueName = `${name}-${uuidv4()}`;

        // Save name to Firestore
        const db = getFirestore();
        setDoc(doc(db, "users", user.uid), {
          email: email,
          profileName: uniqueName
        });

        // Redirect to profile creation page with profile name in the URL
        setTimeout(() => {
          window.location.href = '/login'
        }, 3000);
      })
      .catch((error) => {
        setError(error.message);
        console.error("Signup error:", error);
        setSuccess(false);
      });
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500">
      {/* Left Section: Logo */}
      <div className="flex justify-center items-center w-1/2 pl-20">
        <img src="/images/quizlogo.png" alt=""/> 
      </div>
      {/* Right Section: Sign Up Form */}
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-1/2">
        <p className="text-4xl font-bold mb-8 text-gray-800">Sign Up</p>
        <div className="flex flex-col mb-6">
          <label className="text-gray-800 mb-1" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:border-purple-500"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col mb-6">
          <label className="text-gray-800 mb-1" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:border-purple-500"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col mb-6">
          <label className="text-gray-800 mb-1" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:border-purple-500"
            placeholder="Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition duration-300"
          onClick={handleSignUp}
        >
          Sign Up
        </button>
        <p>&ensp;</p>
        <button
          className="w-full bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 transition duration-300"
          onClick={handleLogin}
        >
          Log In
        </button>

        {success && (
          <p className="text-green-500 mt-2 text-center">Sign up successful</p>
        )}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default SignUpPage;
