import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import LoadingSpinner from '../components/LoadSpinner';

function SignUp() {

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [lineNumber, setLineNumber] = useState(null)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [linkedIn, setlinkedIn] = useState('');
  const [resume, setResume] = useState('')
  const [verified, setVerified] = useState(false)
  const [admin, setAdmin] = useState(false)
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isLoading, setIsLoading] = useState(false)
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    setErrorMessage('');
    
    try {
      const response = await fetch(`${apiUrl}/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, lineNumber, email, password, image, linkedIn, resume, verified, admin }),
      });
      const data = await response.json();

      if (response.ok) {
        login(data);  // Call the login function from your auth context with the received data        
        navigate('/verification'); // Redirect the user to the home page or dashboard
      } else {
        setErrorMessage(data.message || 'Signup failed.');  // If the signup was not successful, display the error message from the backend
      }
    } catch (error) {
      console.error('There was an error with the signup request:', error); // If there was a problem with the fetch request itself, display a generic error message
      setErrorMessage('An error occurred during signup. Please try again later.');
    }

    setIsLoading(false)
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!/^[a-zA-Z0-9._%+-]+@buffalo\.edu$/.test(value)) {
        setErrorMessage('Please enter a University at Buffalo email address.');
    } else {
        setErrorMessage('');
    }
};

  return (
    <div className='signUp'>
      <h2>Sign Up</h2>
      <form className='signUpForm' onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Line Number"
          value={lineNumber}
          onChange={(e) => setLineNumber(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {isLoading? <LoadingSpinner /> : <button type="submit" disabled={isLoading}>Sign Up</button>}
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}

export default SignUp;
