import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { getData } from '../apiService';
import { getToken } from '../utils/authUtils';

const StyledContainer = styled(Container)`
  padding-top: 50px;
  padding-bottom: 50px;
`;

const StyledCard = styled(Card)`
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background-color: #f8f9fa; /* Light background color */
  text-align: center; /* Center-align text */
`;

const StyledCardTitle = styled(Card.Title)`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
`;

const StyledCardText = styled(Card.Text)`
  font-size: 1rem;
  color: #555;
`;

const Heading = styled.h2`
  text-align: center;
  margin-bottom: 40px;
  font-size: 2rem;
  font-weight: bold;
  color: #007bff;
`;

const LinkText = styled.div`
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
  color: #007bff;
`;

const Dashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = getToken(); 
        const data = await getData('/request-list', token);
        setRequests(data); 
      } catch (error) {
        console.error('Error fetching requests:', error); 
      } finally {
        setLoading(false); 
      }
    };

    fetchRequests();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }
  const formatStatus = (status) => {
    if (!status) return '';

    const formattedStatus = status
      .replace(/_/g, ' ') 
      .toLowerCase() 
      .replace(/^./, str => str.toUpperCase()); 

    return formattedStatus;
  };

  return (
    <StyledContainer>
      <Row>
        <Col>
          <Heading>Request Dashboard</Heading>
          {requests.data.map((request, index) => (
            <StyledCard key={index} className="mb-4">
              <Card.Body>
                <StyledCardTitle>Request {index + 1}</StyledCardTitle>
                <StyledCardText>
                  <strong>Pickup Location:</strong> {request.pickup_address} <br />
                  <strong>Delivery Location:</strong> {request.delivery_address} <br />
                  <strong>Size:</strong> {request.size} <br />
                  <strong>Weight:</strong> {request.weight} <br />
                  <strong>Pickup Time:</strong> {request.pickup_date_time} <br />
                  <strong>Delivery Time:</strong> {request.delivery_date_time}
                  <strong>Status:</strong> {formatStatus(request.status)}

                </StyledCardText>
              </Card.Body>
            </StyledCard>
          ))}
        </Col>
        <LinkText>
          <Link to="/truckRequestForm" style={{ color: '#007bff', textDecoration: 'none' }}>
            Add New Request
          </Link>
        </LinkText>
      </Row>
    </StyledContainer>
  );
};

export default Dashboard;
