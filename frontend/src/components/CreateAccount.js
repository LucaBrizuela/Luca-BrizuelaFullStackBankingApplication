import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';

function CreateAccount() {
  const { setCurrentUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    balance: 100 // Starting balance
  });
  const [warning, setWarning] = useState('');

  const validate = () => {
    if (!formData.name.trim()) return "Name is required";
    if (!formData.email.includes('@')) return "Invalid email address";
    if (formData.password.length < 8) return "Password must be at least 8 characters";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validate();
    if (validationError) {
      setWarning(validationError);
      return;
    }

    try {
      const response = await fetch('http://137.184.15.190:3001/api/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setWarning('');
        alert('Account created successfully!');
        setFormData({ name: '', email: '', password: '', balance: 100 });
      } else {
        setWarning(data.error || 'Failed to create account');
      }
    } catch (error) {
      console.error('Account creation error:', error);
      setWarning('An error occurred. Please try again.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="card" style={{ width: '30rem', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
      <div className="card-header">Create Account</div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          {warning && <div className="alert alert-danger">{warning}</div>}
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={!formData.name || !formData.email || !formData.password}
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateAccount;