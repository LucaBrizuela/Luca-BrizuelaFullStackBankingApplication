import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';

function Logout() {
  const { currentUser, setCurrentUser } = useContext(UserContext);

  const handleLogout = async () => {
    if (!currentUser) {
      alert('No user is currently logged in.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Call logout endpoint to blacklist the token
        await fetch('http://localhost:3000/api/user/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        // Clear local storage
        localStorage.removeItem('token');
      }

      setCurrentUser(null);
      alert(`You have logged out successfully.`);
    } catch (error) {
      console.error('Logout error:', error);
      alert('Error during logout. Please try again.');
    }
  };

  return (
    <div className="card">
      <div className="card-header">Logout</div>
      <div className="card-body">
        {currentUser ? (
          <p>Currently logged in as: <strong>{currentUser.email}</strong></p>
        ) : (
          <p>No user is currently logged in.</p>
        )}
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Logout;