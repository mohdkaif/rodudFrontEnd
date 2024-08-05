import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { FaTruck, FaShippingFast, FaWarehouse } from 'react-icons/fa';
import logo from '../logo.svg'; 
import '../assets/css/home.css'; 

const Home = () => {
  return (
    <Container className="text-center">
      <Row className="justify-content-center">
        <Col md={6} className="mt-5">
          <Image src={logo} alt="Rodud App Logo" fluid />
          <h1 className="mt-3">Rodud App</h1>
          <p>Your reliable logistics partner.</p>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col md={4} className="mb-3">
          <FaTruck size={50} />
          <h3>Efficient Trucking</h3>
          <p>We provide the best trucking solutions to ensure timely delivery of goods.</p>
        </Col>
        <Col md={4} className="mb-3">
          <FaShippingFast size={50} />
          <h3>Fast Shipping</h3>
          <p>Our fast shipping services guarantee quick and safe transportation.</p>
        </Col>
        <Col md={4} className="mb-3">
          <FaWarehouse size={50} />
          <h3>Secure Warehousing</h3>
          <p>We offer secure warehousing options to store your goods safely.</p>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
