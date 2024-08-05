import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PlacesAutocomplete from 'react-places-autocomplete';
import { FaMapMarkerAlt, FaBox, FaWeight, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';
import { getToken } from '../utils/authUtils';
import { postData } from '../services/apiService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LinkText = styled.div`
    text-align: center;
    margin-top: 20px;
    font-size: 16px;
    color: #007bff;
`;

const CustomForm = styled(Form)`
    background: #ffffff;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-top: 20px;
`;

const CustomControl = styled(Form.Control)`
    border-radius: 8px;
    border: 1px solid #ced4da;
    box-shadow: none;
    &:focus {
        border-color: #007bff;
        box-shadow: 0 0 0 0.2rem rgba(38, 143, 255, 0.25);
    }
`;

const CustomButton = styled(Button)`
    background-color: #007bff;
    border-color: #007bff;
    border-radius: 8px;
    &:hover {
        background-color: #0056b3;
        border-color: #004085;
    }
`;

const AutocompleteContainer = styled.div`
    position: relative;
    width: 100%;
`;

const AutocompleteDropdown = styled.div`
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 1000;
    background: #ffffff;
    border: 1px solid #ced4da;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-height: 200px;
    overflow-y: auto;
`;

const SuggestionItem = styled.div`
    padding: 12px;
    cursor: pointer;
    &:hover {
        background-color: #f1f1f1;
    }
`;

const Title = styled.h2`
    color: #333;
    font-size: 24px;
    margin-bottom: 20px;
`;

const FieldGroup = styled(Form.Group)`
    margin-bottom: 20px;
`;

const IconContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 10px;
`;

const Icon = styled.div`
    color: #007bff;
    font-size: 1.5rem;
    margin-right: 10px;
`;

const TruckRequestForm = ({ addRequest }) => {
    const [formData, setFormData] = useState({
        pickup_address: '',
        delivery_address: '',
        size: '',
        weight: '',
        pickup_date_time: '',
        delivery_date_time: '',
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({}); 
    
    const navigate = useNavigate();

    const handleChange = (address, name) => {
        setFormData({ ...formData, [name]: address });
    };

    const handleSelect = (address, name) => {
        setFormData({ ...formData, [name]: address });
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const formatDate = (date) => {
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({}); // Reset errors

        const token = getToken();

        const formattedData = {
            pickup_address: formData.pickup_address,
            delivery_address: formData.delivery_address,
            size: formData.size,
            weight: formData.weight,
            pickup_date_time: formatDate(formData.pickup_date_time),
            delivery_date_time: formatDate(formData.delivery_date_time),
        };

        try {
            const endpoint = 'add-truck-request';
            const headers = {
                'Authorization': `Bearer ${token}`, // Ensure 'Bearer' keyword is included
                'Content-Type': 'application/json'
            };
            const response = await postData(endpoint, formattedData, headers);

            // Extract data from the response
            const { message, data } = response.data;

            addRequest(data); // Pass the data to addRequest function
            setFormData({
                pickup_address: '',
                delivery_address: '',
                size: '',
                weight: '',
                pickup_date_time: '',
                delivery_date_time: '',
            });
            toast.success(message); // Show success toast with message from response
            setTimeout(() => navigate('/dashboard'), 2000); // Redirect after 2 seconds
        } catch (err) {
            if (err.response && err.response.data.errors) {
                // Extract validation errors
                const validationErrors = err.response.data.errors;
                setErrors(validationErrors); // Update errors state
            } else {
                setErrors({ general: 'An error occurred' }); // Handle general errors
                toast.error('An error occurred'); // Show error toast
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Title className="text-center">Truck Request Form</Title>
                    <CustomForm onSubmit={handleSubmit}>
                        <FieldGroup controlId="pickup_address">
                            <Form.Label>Pickup Location</Form.Label>
                            <AutocompleteContainer>
                                <PlacesAutocomplete
                                    value={formData.pickup_address}
                                    onChange={(address) => handleChange(address, 'pickup_address')}
                                    onSelect={(address) => handleSelect(address, 'pickup_address')}
                                >
                                    {({ getInputProps, suggestions, getSuggestionItemProps }) => (
                                        <div>
                                            <IconContainer>
                                                <Icon><FaMapMarkerAlt /></Icon>
                                                <CustomControl
                                                    {...getInputProps({
                                                        placeholder: 'Enter pickup address',
                                                        autoComplete: 'off'
                                                    })}
                                                    isInvalid={!!errors.pickup_address}
                                                    required
                                                />
                                            </IconContainer>
                                            {errors.pickup_address && (
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.pickup_address[0]}
                                                </Form.Control.Feedback>
                                            )}
                                            {suggestions.length > 0 && (
                                                <AutocompleteDropdown>
                                                    {suggestions.map((suggestion) => (
                                                        <SuggestionItem
                                                            {...getSuggestionItemProps(suggestion)}
                                                        >
                                                            <strong>{suggestion.formattedSuggestion.mainText}</strong>
                                                            <small>{suggestion.formattedSuggestion.secondaryText}</small>
                                                        </SuggestionItem>
                                                    ))}
                                                </AutocompleteDropdown>
                                            )}
                                        </div>
                                    )}
                                </PlacesAutocomplete>
                            </AutocompleteContainer>
                        </FieldGroup>

                        <FieldGroup controlId="delivery_address">
                            <Form.Label>Delivery Location</Form.Label>
                            <AutocompleteContainer>
                                <PlacesAutocomplete
                                    value={formData.delivery_address}
                                    onChange={(address) => handleChange(address, 'delivery_address')}
                                    onSelect={(address) => handleSelect(address, 'delivery_address')}
                                >
                                    {({ getInputProps, suggestions, getSuggestionItemProps }) => (
                                        <div>
                                            <IconContainer>
                                                <Icon><FaMapMarkerAlt /></Icon>
                                                <CustomControl
                                                    {...getInputProps({
                                                        placeholder: 'Enter delivery address',
                                                        autoComplete: 'off'
                                                    })}
                                                    isInvalid={!!errors.delivery_address}
                                                    required
                                                />
                                            </IconContainer>
                                            {errors.delivery_address && (
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.delivery_address[0]}
                                                </Form.Control.Feedback>
                                            )}
                                            {suggestions.length > 0 && (
                                                <AutocompleteDropdown>
                                                    {suggestions.map((suggestion) => (
                                                        <SuggestionItem
                                                            {...getSuggestionItemProps(suggestion)}
                                                        >
                                                            <strong>{suggestion.formattedSuggestion.mainText}</strong>
                                                            <small>{suggestion.formattedSuggestion.secondaryText}</small>
                                                        </SuggestionItem>
                                                    ))}
                                                </AutocompleteDropdown>
                                            )}
                                        </div>
                                    )}
                                </PlacesAutocomplete>
                            </AutocompleteContainer>
                        </FieldGroup>

                        <FieldGroup controlId="size">
                            <Form.Label>Size</Form.Label>
                            <IconContainer>
                                <Icon><FaBox /></Icon>
                                <CustomControl
                                    type="text"
                                    name="size"
                                    value={formData.size}
                                    onChange={(e) => handleChange(e.target.value, 'size')}
                                    isInvalid={!!errors.size}
                                    required
                                />
                            </IconContainer>
                            {errors.size && (
                                <Form.Control.Feedback type="invalid">
                                    {errors.size[0]}
                                </Form.Control.Feedback>
                            )}
                        </FieldGroup>

                        <FieldGroup controlId="weight">
                            <Form.Label>Weight</Form.Label>
                            <IconContainer>
                                <Icon><FaWeight /></Icon>
                                <CustomControl
                                    type="text"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={(e) => handleChange(e.target.value, 'weight')}
                                    isInvalid={!!errors.weight}
                                    required
                                />
                            </IconContainer>
                            {errors.weight && (
                                <Form.Control.Feedback type="invalid">
                                    {errors.weight[0]}
                                </Form.Control.Feedback>
                            )}
                        </FieldGroup>

                        <FieldGroup controlId="pickup_date_time">
                            <Form.Label>Pickup Date</Form.Label>
                            <IconContainer>
                                <Icon><FaCalendarAlt /></Icon>
                                <CustomControl
                                    type="date"
                                    name="pickup_date_time"
                                    value={formData.pickup_date_time}
                                    onChange={handleDateChange}
                                    isInvalid={!!errors.pickup_date_time}
                                    required
                                />
                            </IconContainer>
                            {errors.pickup_date_time && (
                                <Form.Control.Feedback type="invalid">
                                    {errors.pickup_date_time[0]}
                                </Form.Control.Feedback>
                            )}
                        </FieldGroup>

                        <FieldGroup controlId="delivery_date_time">
                            <Form.Label>Delivery Date</Form.Label>
                            <IconContainer>
                                <Icon><FaCalendarAlt /></Icon>
                                <CustomControl
                                    type="date"
                                    name="delivery_date_time"
                                    value={formData.delivery_date_time}
                                    onChange={handleDateChange}
                                    isInvalid={!!errors.delivery_date_time}
                                    required
                                />
                            </IconContainer>
                            {errors.delivery_date_time && (
                                <Form.Control.Feedback type="invalid">
                                    {errors.delivery_date_time[0]}
                                </Form.Control.Feedback>
                            )}
                        </FieldGroup>

                        <CustomButton variant="primary" type="submit" className="w-100 my-3" disabled={loading}>
                            {loading ? (
                                <Spinner animation="border" size="sm" />
                            ) : (
                                <>
                                    <FaArrowRight style={{ marginRight: '10px' }} /> Submit Request
                                </>
                            )}
                        </CustomButton>
                        {errors.general && <div className="text-danger text-center my-2">{errors.general}</div>}
                        <LinkText>
                            <Link to="/dashboard" style={{ color: '#007bff', textDecoration: 'none' }}>
                                Go To Dashboard
                            </Link>
                        </LinkText>
                    </CustomForm>
                    <ToastContainer />
                </Col>
            </Row>
        </Container>
    );
};

export default TruckRequestForm;
