import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';
import { profileGet } from '../apiService'; 
import '../assest/css/profile.css'; 
import { getToken } from '../utils/authUtils';

const Profile = () => {
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile_number: '',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getToken();
        const data = await profileGet('/profile', token);
        setProfile(data);
      } catch (error) {
        setError('Failed to fetch profile data. Please try again later.');
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <Container>
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
          <Card className="profile-card">
            <Card.Body>
              <Card.Title className="text-center">
                <FaUser /> {profile.first_name} {profile.last_name}
              </Card.Title>
              <Card.Text>
                {error ? (
                  <div className="text-center text-danger">{error}</div>
                ) : (
                  <>
                    <div className="profile-detail">
                      <FaEnvelope /> {profile.email}
                    </div>
                    <div className="profile-detail">
                      <FaPhone /> {profile.mobile_number}
                    </div>
                  </>
                )}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
