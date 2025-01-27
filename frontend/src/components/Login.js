import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { auth, googleProvider } from '../firebase/firebase';
import { signInWithPopup } from 'firebase/auth';

function Login() {
  const { setCurrentUser, currentUser } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (token && !currentUser) {
        try {
          const response = await fetch("http://137.184.15.190:3001/api/users/validate", {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          if (response.ok) {
            setCurrentUser(data.user);
          } else {
            localStorage.removeItem('token');
          }
        } catch (err) {
          console.error("Token validation error:", err);
          localStorage.removeItem('token');
        }
      }
    };

    validateToken();
  }, []);

  // If user is already logged in
  if (currentUser) {
    return (
      <div className="alert alert-success">
        <strong>You are already logged in!</strong>
      </div>
    );
  }

  const handleLogin = async () => {
    try {
      const response = await fetch("http://137.184.15.190:3001/api/users/login", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password}),
      });

      const data = await response.json(); 

      if(response.ok) {
        setCurrentUser(data.user);
        localStorage.setItem('token', data.token);  
        setError(''); 
      } else {
        setError(data.error || "Login failed. Please try again."); 
      }
    } catch(err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      
      // Verify with your backend
      const response = await fetch("http://137.184.15.190:3001/api/users/google-login", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();
      
      if(response.ok) {
        setCurrentUser(data.user);
        localStorage.setItem('token', data.token);
        setError('');
      } else {
        setError(data.error || "Google login failed");
      }
    } catch(err) {
      console.error("Google login error:", err);
      setError("An error occurred during Google login");
    }
  };

  return (
    <div className="card" style={{ width: '30rem', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
      <div className="card-header">Login</div>
      <div className="card-body">
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <div className="text-danger mb-3">{error}</div>}
        <div className='login-buttons' style={{display: 'flex', gap: '10px'}}>
        <button className="btn btn-primary" onClick={handleLogin}>
          Login
        </button>
        <button className="btn btn-danger" onClick={handleGoogleLogin}>
            Login with Google
        </button>
        </div>
      </div>
    </div>
  );
}

export default Login;