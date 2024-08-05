import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { getData } from '../services/apiService';
import { getToken } from '../utils/authUtils';
import { FaMapMarkerAlt, FaBox, FaWeightHanging, FaCalendarDay, FaClock, FaCheckCircle } from 'react-icons/fa';

const StyledContainer = styled(Container)`
  padding: 50px 15px;
  min-height: 100vh;
`;

const StyledCard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  padding: 20px;

  &:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const StyledCardTitle = styled(Card.Title)`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
`;

const StyledCardText = styled(Card.Text)`
  font-size: 0.95rem;
  color: #555;
  line-height: 1.6;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Heading = styled.h2`
  text-align: center;
    margin-bottom: 40px;
    margin-top: -60px;
    font-weight: 700;
    color: #007bff;
`;

const LinkText = styled.div`
  text-align: center;
  margin-top: 30px;
  font-size: 1rem;
`;

const AddRequestLink = styled(Link)`
  color: #007bff;
  text-decoration: none;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

const IconText = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
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
      <Heading>Request Dashboard</Heading>
      <Row>
        {requests.data.map((request, index) => (
          <Col xs={12} sm={6} md={4} lg={3} key={index}>
            <StyledCard>
              <StyledCardTitle>Request {index + 1}</StyledCardTitle>
              <StyledCardText>
                <IconText>
                  <FaMapMarkerAlt color="#007bff" />
                  <span><strong>Pickup Location:</strong> {request.pickup_address}</span>
                </IconText>
                <IconText>
                  <FaMapMarkerAlt color="#28a745" />
                  <span><strong>Delivery Location:</strong> {request.delivery_address}</span>
                </IconText>
                <IconText>
                  <FaBox color="#ffc107" />
                  <span><strong>Size:</strong> {request.size}</span>
                </IconText>
                <IconText>
                  <FaWeightHanging color="#dc3545" />
                  <span><strong>Weight:</strong> {request.weight}</span>
                </IconText>
                <IconText>
                  <FaCalendarDay color="#007bff" />
                  <span><strong>Pickup Time:</strong> {request.pickup_date_time}</span>
                </IconText>
                <IconText>
                  <FaClock color="#17a2b8" />
                  <span><strong>Delivery Time:</strong> {request.delivery_date_time}</span>
                </IconText>
                <IconText>
                  <FaCheckCircle color={request.status === 'COMPLETED' ? '#28a745' : '#dc3545'} />
                  <span><strong>Status:</strong> {formatStatus(request.status)}</span>
                </IconText>
              </StyledCardText>
            </StyledCard>
          </Col>
        ))}
      </Row>
      <LinkText>
        <AddRequestLink to="/truckRequestForm">
          Add New Request
        </AddRequestLink>
      </LinkText>
    </StyledContainer>
  );
};

export default Dashboard;
