import React from 'react';
import { Card } from 'react-bootstrap';

function Home() {
  return (
    <Card className="text-center" style={{ width: '30rem', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
      <Card.Body>
        <Card.Title>Welcome to the Bank</Card.Title>
        <Card.Text>
          Manage your account, deposits, and withdrawals with ease.
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default Home;