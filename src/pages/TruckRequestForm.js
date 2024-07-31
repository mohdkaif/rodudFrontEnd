import React, { useState, useRef } from 'react';
import { Form, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import usePlacesAutocomplete from 'use-places-autocomplete';
import useOnclickOutside from 'react-cool-onclickoutside';
import axios from 'axios'; 
import { getToken } from '../utils/authUtils';
import { postData } from '../apiService';


const TruckRequestForm = ({ addRequest }) => {
    const [formData, setFormData] = useState({
        pickup_address: '',
        delivery_address: '',
        size: '',
        weight: '',
        pickup_date_time: '',
        delivery_date_time: '',
    });
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(null); // Error state

    const {
        ready,
        value: pickupValue,
        suggestions: { status: pickupStatus, data: pickupData },
        setValue: setPickupValue,
        clearSuggestions: clearPickupSuggestions,
    } = usePlacesAutocomplete();

    const {
        value: deliveryValue,
        suggestions: { status: deliveryStatus, data: deliveryData },
        setValue: setDeliveryValue,
        clearSuggestions: clearDeliverySuggestions,
    } = usePlacesAutocomplete();

    const pickupRef = useRef();
    const deliveryRef = useRef();

    const LinkText = styled.div`
        text-align: center;
        margin-top: 15px;
        font-size: 14px;
        color: #007bff;
    `;

    useOnclickOutside(pickupRef, () => {
        clearPickupSuggestions();
    });

    useOnclickOutside(deliveryRef, () => {
        clearDeliverySuggestions();
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'pickup_address') {
            setPickupValue(value);
        } else if (name === 'delivery_address') {
            setDeliveryValue(value);
        }
    };

    const handleSelect = (name, value) => {
        setFormData({ ...formData, [name]: value });
        if (name === 'pickup_address') {
            setPickupValue(value, false);
            clearPickupSuggestions();
        } else if (name === 'delivery_address') {
            setDeliveryValue(value, false);
            clearDeliverySuggestions();
        }
    };

    const formatDate = (datetime) => {
        // Convert from 'YYYY-MM-DDTHH:MM' format to 'DD/MM/YYYY'
        const [date] = datetime.split('T');
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading
        setError(null); // Reset error

        const token =  getToken();
        

        const formattedData = {
            pickup_address: formData.pickup_address,
            delivery_address: formData.delivery_address,
            size: formData.size,
            weight: formData.weight,
            pickup_date_time: formatDate(formData.pickup_date_time),
            delivery_date_time: formatDate(formData.delivery_date_time),
        };

        try {
            
            const endpoint='add-truck-request';
            const headers= {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
            const response = await postData(endpoint, headers, formattedData);

            addRequest(formattedData);
            setFormData({
                pickup_address: '',
                delivery_address: '',
                size: '',
                weight: '',
                pickup_date_time: '',
                delivery_date_time: '',
            });
            alert(response.data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred'); // Set error message
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const renderSuggestions = (name, suggestions) =>
        suggestions.map((suggestion) => {
            const {
                place_id,
                structured_formatting: { main_text, secondary_text },
            } = suggestion;

            return (
                <li
                    key={place_id}
                    onClick={() => handleSelect(name, `${main_text}, ${secondary_text}`)}
                    className="list-group-item"
                    style={{ cursor: 'pointer' }}
                >
                    <strong>{main_text}</strong> <small>{secondary_text}</small>
                </li>
            );
        });

    return (
        <Container>
            <Row>
                <Col md={{ span: 6, offset: 3 }}>
                    <h2 className="text-center my-4">Truck Request Form</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="pickup_address">
                            <Form.Label>Pickup Location</Form.Label>
                            <div ref={pickupRef}>
                                <Form.Control
                                    type="text"
                                    name="pickup_address"
                                    value={pickupValue}
                                    onChange={handleChange}
                                    autoComplete="off"
                                    required
                                />
                                {pickupStatus === 'OK' && (
                                    <ul className="list-group mt-2">
                                        {renderSuggestions('pickup_address', pickupData)}
                                    </ul>
                                )}
                            </div>
                        </Form.Group>

                        <Form.Group controlId="delivery_address">
                            <Form.Label>Delivery Location</Form.Label>
                            <div ref={deliveryRef}>
                                <Form.Control
                                    type="text"
                                    name="delivery_address"
                                    value={deliveryValue}
                                    onChange={handleChange}
                                    autoComplete="off"
                                    required
                                />
                                {deliveryStatus === 'OK' && (
                                    <ul className="list-group mt-2">
                                        {renderSuggestions('delivery_address', deliveryData)}
                                    </ul>
                                )}
                            </div>
                        </Form.Group>

                        <Form.Group controlId="size">
                            <Form.Label>Size</Form.Label>
                            <Form.Control
                                type="text"
                                name="size"
                                value={formData.size}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="weight">
                            <Form.Label>Weight</Form.Label>
                            <Form.Control
                                type="text"
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="pickup_date_time">
                            <Form.Label>Pickup Date & Time</Form.Label>
                            <Form.Control
                                type="date"
                                name="pickup_date_time"
                                value={formData.pickup_date_time}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="delivery_date_time">
                            <Form.Label>Delivery Date & Time</Form.Label>
                            <Form.Control
                                type="date"
                                name="delivery_date_time"
                                value={formData.delivery_date_time}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100 my-3" disabled={loading}>
                            {loading ? (
                                <Spinner animation="border" size="sm" />
                            ) : (
                                'Submit Request'
                            )}
                        </Button>
                        {error && <div className="text-danger text-center my-2">{error}</div>}
                        <LinkText>
                            <Link to="/dashboard" style={{ color: '#007bff', textDecoration: 'none' }}>
                                Go To Dashboard
                            </Link>
                        </LinkText>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default TruckRequestForm;
