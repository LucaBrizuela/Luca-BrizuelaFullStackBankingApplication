import React, { useState, useEffect } from 'react';
import { Card, Table, Spinner } from 'react-bootstrap';

function AllData() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return (
    <Card>
      <Card.Body className="text-center">
        <Spinner animation="border" />
      </Card.Body>
    </Card>
  );

  if (error) return (
    <Card>
      <Card.Body>
        <Card.Title>Error</Card.Title>
        <p>{error}</p>
      </Card.Body>
    </Card>
  );

  return (
    <Card>
      <Card.Body>
        <Card.Title>All Data</Card.Title>
        {users && users.length > 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Password</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.password}</td>
                  <td>${user.balance || 0}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No user data available.</p>
        )}
      </Card.Body>
    </Card>
  );
}

export default AllData;