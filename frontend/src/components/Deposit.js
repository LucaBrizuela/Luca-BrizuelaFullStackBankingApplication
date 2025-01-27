import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';

function Deposit() {
  const { currentUser, setCurrentUser} = useContext(UserContext);
  const [amount, setAmount] = useState('');
  const [warning, setWarning] = useState('');

  console.log(currentUser); 

  if (!currentUser) {
    return (
      <div className="alert alert-danger">
        You must <strong>create an account</strong>. If you already have one, <strong>log in</strong>.
      </div>
    );
  }

  const handleDeposit = async () => {
    const numericAmount = parseFloat(amount);

    if (numericAmount <= 0) {
      setWarning('Amount must be greater than zero.');
      return;
    }
    try {
    const token = localStorage.getItem('token'); 
    if(!token) {
      setWarning('You must be logged in to make a deposit.'); 
      return; 
    }
    const response = await fetch("http://localhost:3000/api/user/transactions", {
      method: "PUT", 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      }, 
      body: JSON.stringify({
        amount: numericAmount, 
        type: 'deposit',
      }), 
    });

    const data = await response.json(); 

    if(response.ok){
      setCurrentUser(data.user); 
      setWarning(''); 
      alert(`${numericAmount} has been deposited into your account.`); 
      setAmount('');
    } 
    } catch(err) {
      console.error("Deposit error", err); 
      setWarning('An error occurred. Please try again.')
    }
  };



  return (
    <div className="card" style={{ width: '30rem', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
      <div className="card-header">
        Deposit (Current Balance: ${currentUser.balance})
      </div>
      <div className="card-body">
        <div className="mb-3">
          <label>Amount</label>
          <input
            type="number"
            className="form-control"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        {warning && <div className="text-danger mb-3">{warning}</div>}
        <button className="btn btn-success" onClick={handleDeposit} value={amount} disabled={!amount.trim()}> 
          Deposit
        </button>
      </div>
    </div>
  );
}

export default Deposit;
