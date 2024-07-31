import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Profile = () => {
  return (
    <Container>
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <h2>Profile</h2>
          <p>Profile details go here.</p>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
