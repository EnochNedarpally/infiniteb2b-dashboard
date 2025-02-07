import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Container, Form, Input, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import Flatpickr from "react-flatpickr";
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { api } from '../../../config';

const EditProfile = ({ vendorDetail, isEdit }) => {
    const location = useLocation()
    const [vendorData, setVendorData] = useState()
    const [vendor, setVendor] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!vendorDetail) {
            setVendor(location.state)
        } else setVendor(vendorDetail)
    }, [vendorDetail])

    const navigate = useNavigate()
    document.title = "Infinite B2B";

    const token = JSON.parse(sessionStorage.getItem("authUser")).token ?? null;
    const handleChange = (e) => {
        const { name, value } = e.target;
        setVendorData(prev => { return { ...prev, [name]: value } })
    }

    const handleUpdate = async () => {
        setLoading(true)
        const formData = new FormData();
        formData.append("id", vendor?._id)
        Object.keys(vendorData).map((key) => {
            if (key) {
                let value = vendorData[key];
                formData.append(key, value);
            }
        });

        try {
            const response = await axios.post(
                `${api.API_URL}/api/vendor/update-details`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            toast.success("Profile Updated")
        } catch (err) {
            toast.error(err?.response?.data?.message ?? 'Encountered an error while updating the Profile')
            console.log(err, "err")
        } finally {
            setLoading(false);
        }
    }
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <ToastContainer />
                    <Row>
                        <Col lg={12}>
                            <CardBody >
                                <Form>
                                    <Row>
                                        <Col lg={6}>
                                            <div className="mb-3">
                                                <Label htmlFor="firstnameInput" className="form-label">First
                                                    Name</Label>
                                                <Input disabled={!isEdit} onChange={(e) => handleChange(e)} type="text" className="form-control" id="firstnameInput"
                                                    name="name" placeholder="Enter your First name" value={vendorData?.name ?? vendor.name} />
                                            </div>
                                        </Col>
                                        <Col lg={6}>
                                            <div className="mb-3">
                                                <Label htmlFor="lastnameInput" className="form-label">Last
                                                    Name</Label>
                                                <Input disabled={!isEdit} onChange={(e) => handleChange(e)} type="text" className="form-control" id="lastnameInput"
                                                    name="lastName" placeholder="Enter your Last name" value={vendorData?.lastName ?? vendor.lastName} />
                                            </div>
                                        </Col>
                                        <Col lg={6}>
                                            <div className="mb-3">
                                                <Label htmlFor="phonenumberInput" className="form-label">Phone
                                                    Number</Label>
                                                <Input disabled={!isEdit} name="phoneNo" onChange={(e) => handleChange(e)} type="text" className="form-control"
                                                    id="phonenumberInput"
                                                    placeholder="Enter your phone number"
                                                    value={vendorData?.phoneNo ?? vendor.phoneNo} />
                                            </div>
                                        </Col>
                                        <Col lg={6}>
                                            <div className="mb-3">
                                                <Label htmlFor="emailInput" className="form-label">Email
                                                    Address</Label>
                                                <Input disabled={!isEdit} name="email" onChange={(e) => handleChange(e)} type="email" className="form-control" id="emailInput"
                                                    placeholder="Enter your email"
                                                    value={vendorData?.email ?? vendor.email} />
                                            </div>
                                        </Col>
                                        <Col lg={6}>
                                            <div className="mb-3">
                                                <Label htmlFor="designationInput"
                                                    className="form-label">Designation</Label>
                                                <Input disabled={!isEdit} name="designation" onChange={(e) => handleChange(e)} type="text" className="form-control"
                                                    id="designationInput" placeholder="Designation"
                                                    value={vendorData?.designation ?? vendor.designation} />
                                            </div>
                                        </Col>
                                        <Col lg={6}>
                                            <div className="mb-3">
                                                <Label htmlFor="websiteInput1"
                                                    className="form-label">Company Name</Label>
                                                <Input disabled={!isEdit} name="companyName" onChange={(e) => handleChange(e)} type="text" className="form-control" id="websiteInput1"
                                                    placeholder="Enter Company Name" value={vendorData?.companyName ?? vendor.companyName} />
                                            </div>
                                        </Col>
                                        <Col lg={6}>
                                            <div className="mb-3">
                                                <Label htmlFor="countryInput" className="form-label">Country</Label>
                                                <Input disabled={!isEdit} name="country" onChange={(e) => handleChange(e)} type="text" className="form-control" id="countryInput"
                                                    placeholder="Country" value={vendorData?.country ?? vendor.country} />
                                            </div>
                                        </Col>
                                        <Col lg={6}>
                                            <div className="mb-3">
                                                <Label htmlFor="stateInput" className="form-label">State</Label>
                                                <Input disabled={!isEdit} name="state" onChange={(e) => handleChange(e)} type="text" className="form-control" id="stateInput"
                                                    placeholder="State" value={vendorData?.state ?? vendor.state} />
                                            </div>
                                        </Col>
                                        <Col lg={6}>
                                            <div className="mb-3">
                                                <Label htmlFor="zipcodeInput" className="form-label">Zip
                                                    Code</Label>
                                                <Input disabled={!isEdit} name="zipCode" onChange={(e) => handleChange(e)} type="text" className="form-control" minLength="5"
                                                    maxLength="6" id="zipcodeInput"
                                                    placeholder="Enter zipcode" value={vendorData?.zipCode ?? vendor.zipCode} />
                                            </div>
                                        </Col>
                                        <Col lg={12}>
                                            <div className="hstack gap-2 justify-content-end">
                                                {isEdit && <button onClick={handleUpdate} type="button"
                                                    className="btn btn-secondary">{!loading ? "Update" : "Updating..."}</button>}
                                                <button type="button"
                                                    onClick={() => navigate(-1)} className="btn btn-soft-danger">Cancel</button>
                                            </div>
                                        </Col>
                                    </Row>
                                </Form>
                            </CardBody>
                        </Col>

                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default EditProfile;