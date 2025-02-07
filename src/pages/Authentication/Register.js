import React, { useEffect, useState } from "react";
import { Row, Col, CardBody, Card, Alert, Container, Input, Label, Form, FormFeedback } from "reactstrap";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// action
import { registerUser, apiError, resetRegisterFlag } from "../../slices/thunks";

//redux
import { useSelector, useDispatch } from "react-redux";

import { Link, useLocation, useNavigate } from "react-router-dom";

//import images 
import logoLight from "../../assets/images/Infinite-b2b-1-scaled.png";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import { createSelector } from "reselect";
import TermsOfUse from "../../Components/Common/TermsOfUse";
import "../../App.css"

const Register = () => {
    const history = useNavigate();
    const dispatch = useDispatch();
    const termsFilePath =  "/TermsandConditions.docx"
    const privacyFilePath =  "/PrivacyPolicy.docx"
    const [isChecked, setIsChecked] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [docxFile, setDocxFile] = useState(null);
    const redirectUrl = useLocation().state;
    const validation = useFormik({
        enableReinitialize: true,

        initialValues: {
            email: '',
            name: '',
            password: '',
            companyName:"",
            lastName:"",
            designation:"",
            country:"",
            state:"",
            zipCode:"",
            phoneNo:"",
            confirm_password: '',
            isSuperAdmin: '3',
        },
        validationSchema: Yup.object({
            email: Yup.string().required("Please Enter Your Email"),
            name: Yup.string().required("Please Enter Your First Name"),
            password: Yup.string().required("Please enter your password"),
            companyName:Yup.string().required("Please enter your Company Name"),
            lastName:Yup.string().required("Please enter your Last name"),
            designation:Yup.string().required("Please enter your designation"),
            country:Yup.string().required("Please enter your country"),
            state:Yup.string().required("Please enter your state"),
            zipCode:Yup.string().required("Please enter your zipcode"),
            phoneNo:Yup.string().required("Please enter your phine no"),
            confirm_password: Yup.string()
                .oneOf([Yup.ref("password")], "Passwords do not match")
                .required("Please confirm your password"),
        }),
        onSubmit: (values) => {
const payload = {...values} 
delete payload.confirm_password
            dispatch(registerUser(payload,()=>{
                toast.success(data)
            }));
        }
    });


    const selectLayoutState = (state) => state.Account;
    const registerdatatype = createSelector(
        selectLayoutState,
        (account) => ({
            success: account.success,
            error: account.error
        })
    );
    // Inside your component
    const {
        error, success
    } = useSelector(registerdatatype);

    useEffect(() => {
        dispatch(apiError(""));
    }, [dispatch]);

    useEffect(() => {
        const redirectEnpoint = redirectUrl ?"/user/login" : "/vendor/login"
        if (success) {
            setTimeout(() => history(redirectEnpoint), 3000);
        }

        setTimeout(() => {
            dispatch(resetRegisterFlag());
        }, 3000);

    }, [dispatch, success, error, history]);
    const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleTermsPrivacyClick = (filePath) => {
    setDocxFile(filePath);
    toggleModal();
  };

    document.title = "Infeedu";
    return (
        <React.Fragment>
            <ParticlesAuth>
                <div className="auth-page-content mt-lg-5">
                    <Container>
                        <Row>
                             <ToastContainer closeButton={false} limit={1} />
                            <Col lg={12}>
                                <div className="text-center  mb-4 text-white-50">
                                    <div>
                                        <Link to="/" className="d-inline-block auth-logo">
                                            <img src={logoLight} style={{objectFit:'cover'}} alt="" width="450"/>
                                        </Link>
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <Row className="justify-content-center">
                            <Col md={8} lg={6} xl={5}>
                                <Card className="mt-4">

                                    <CardBody className="p-4">
                                        <div className="text-center mt-2">
                                            <h5 className="text-primary">Create New Account</h5>
                                        </div>
                                        <div className="p-2 mt-4">
                                            <Form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    validation.handleSubmit();
                                                    return false;
                                                }}
                                                className="needs-validation" action="#">

                                                {success && success ? (
                                                    <>
                                                        {toast("Your Redirect To Login Page...", { position: "top-right", hideProgressBar: false, className: 'bg-success text-white', progress: undefined, toastId: "" })}
                                                        <ToastContainer autoClose={2000} limit={1} />
                                                        <Alert color="success">
                                                            Register User Successfully and Your Redirect To Login Page...
                                                        </Alert>
                                                    </>
                                                ) : null}

                                                {error && error ? (
                                                    <Alert color="danger"><div>
                                                        Email has been Register Before, Please Use Another Email Address... </div></Alert>
                                                ) : null}
                                            <div className="custom-scrollbar" style={{height:'40vh',overflowY:'auto'}}>
                                                <div className="mb-3">
                                                    <Label htmlFor="email" className="form-label">Company Email <span className="text-danger">*</span></Label>
                                                    <Input
                                                        id="email"
                                                        name="email"
                                                        className="form-control"
                                                        placeholder="Enter company email address"
                                                        type="email"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.email || ""}
                                                        invalid={
                                                            validation.touched.email && validation.errors.email ? true : false
                                                        }
                                                    />
                                                    {validation.touched.email && validation.errors.email ? (
                                                        <FormFeedback type="invalid"><div>{validation.errors.email}</div></FormFeedback>
                                                    ) : null}

                                                </div>
                                                <div className="mb-3">
                                                    <Label htmlFor="username" className="form-label">First Name <span className="text-danger">*</span></Label>
                                                    <Input
                                                        name="name"
                                                        type="text"
                                                        placeholder="Enter First Name"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.name || ""}
                                                        invalid={
                                                            validation.touched.name && validation.errors.name ? true : false
                                                        }
                                                    />
                                                    {validation.touched.name && validation.errors.name ? (
                                                        <FormFeedback type="invalid"><div>{validation.errors.name}</div></FormFeedback>
                                                    ) : null}

                                                </div>
                                                <div className="mb-3">
                                                    <Label htmlFor="lastname" className="form-label">Last name <span className="text-danger">*</span></Label>
                                                    <Input
                                                        id="lastname"
                                                        name="lastName"
                                                        type="text"
                                                        placeholder="Enter Last name"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.lastName || ""}
                                                        invalid={
                                                            validation.touched.lastName && validation.errors.lastName ? true : false
                                                        }
                                                    />
                                                    {validation.touched.lastName && validation.errors.lastName ? (
                                                        <FormFeedback type="invalid"><div>{validation.errors.lastName}</div></FormFeedback>
                                                    ) : null}

                                                </div>
                                                <div className="mb-3">
                                                    <Label htmlFor="companyname" className="form-label">Company name <span className="text-danger">*</span></Label>
                                                    <Input
                                                        id="companyname"
                                                        name="companyName"
                                                        type="text"
                                                        placeholder="Enter Company name"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.companyName || ""}
                                                        invalid={
                                                            validation.touched.companyName && validation.errors.companyName ? true : false
                                                        }
                                                    />
                                                    {validation.touched.companyName && validation.errors.companyName ? (
                                                        <FormFeedback type="invalid"><div>{validation.errors.companyName}</div></FormFeedback>
                                                    ) : null}

                                                </div>
                                                <div className="mb-3">
                                                    <Label htmlFor="designation" className="form-label">Designation <span className="text-danger">*</span></Label>
                                                    <Input
                                                        id="designation"
                                                        name="designation"
                                                        type="text"
                                                        placeholder="Enter Designation"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.designation || ""}
                                                        invalid={
                                                            validation.touched.designation && validation.errors.designation ? true : false
                                                        }
                                                    />
                                                    {validation.touched.designation && validation.errors.designation ? (
                                                        <FormFeedback type="invalid"><div>{validation.errors.designation}</div></FormFeedback>
                                                    ) : null}

                                                </div>
                                                <div className="mb-3">
                                                    <Label htmlFor="phoneNo" className="form-label">Phone No <span className="text-danger">*</span></Label>
                                                    <Input
                                                        id="phoneNo"
                                                        name="phoneNo"
                                                        type="text"
                                                        placeholder="Enter Phone No"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.phoneNo || ""}
                                                        invalid={
                                                            validation.touched.phoneNo && validation.errors.phoneNo ? true : false
                                                        }
                                                    />
                                                    {validation.touched.phoneNo && validation.errors.phoneNo ? (
                                                        <FormFeedback type="invalid"><div>{validation.errors.phoneNo}</div></FormFeedback>
                                                    ) : null}

                                                </div>
                                                <div className="mb-3">
                                                    <Label htmlFor="country" className="form-label">Country <span className="text-danger">*</span></Label>
                                                    <Input
                                                        id="country"
                                                        name="country"
                                                        type="text"
                                                        placeholder="Enter Country"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.country || ""}
                                                        invalid={
                                                            validation.touched.country && validation.errors.country ? true : false
                                                        }
                                                    />
                                                    {validation.touched.country && validation.errors.country ? (
                                                        <FormFeedback type="invalid"><div>{validation.errors.country}</div></FormFeedback>
                                                    ) : null}

                                                </div>
                                                <div className="mb-3">
                                                    <Label htmlFor="state" className="form-label">State <span className="text-danger">*</span></Label>
                                                    <Input
                                                        id="state"
                                                        name="state"
                                                        type="text"
                                                        placeholder="Enter State"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.state || ""}
                                                        invalid={
                                                            validation.touched.state && validation.errors.state ? true : false
                                                        }
                                                    />
                                                    {validation.touched.state && validation.errors.state ? (
                                                        <FormFeedback type="invalid"><div>{validation.errors.state}</div></FormFeedback>
                                                    ) : null}

                                                </div>
                                                <div className="mb-3">
                                                    <Label htmlFor="zipCode" className="form-label">Zip Code<span className="text-danger">*</span></Label>
                                                    <Input
                                                        id="zipCode"
                                                        name="zipCode"
                                                        type="text"
                                                        placeholder="Enter Zip Code"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.zipCode || ""}
                                                        invalid={
                                                            validation.touched.zipCode && validation.errors.zipCode ? true : false
                                                        }
                                                    />
                                                    {validation.touched.zipCode && validation.errors.zipCode ? (
                                                        <FormFeedback type="invalid"><div>{validation.errors.zipCode}</div></FormFeedback>
                                                    ) : null}

                                                </div>
                                                <div className="mb-3">
                                                    <Label htmlFor="userpassword" className="form-label">Password <span className="text-danger">*</span></Label>
                                                    <Input
                                                        name="password"
                                                        type="password"
                                                        placeholder="Enter Password"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.password || ""}
                                                        invalid={
                                                            validation.touched.password && validation.errors.password ? true : false
                                                        }
                                                    />
                                                    {validation.touched.password && validation.errors.password ? (
                                                        <FormFeedback type="invalid"><div>{validation.errors.password}</div></FormFeedback>
                                                    ) : null}

                                                </div>

                                                <div className="mb-2">
                                                    <Label htmlFor="confirmPassword" className="form-label">Confirm Password <span className="text-danger">*</span></Label>
                                                    <Input
                                                        name="confirm_password"
                                                        type="password"
                                                        placeholder="Confirm Password"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.confirm_password || ""}
                                                        invalid={
                                                            validation.touched.confirm_password && validation.errors.confirm_password ? true : false
                                                        }
                                                    />
                                                    {validation.touched.confirm_password && validation.errors.confirm_password ? (
                                                        <FormFeedback type="invalid"><div>{validation.errors.confirm_password}</div></FormFeedback>
                                                    ) : null}

                                                </div>
                                            </div>
                                                <div className="mb-4">
                                                    <p className="mb-0 fs-12 text-muted fst-italic d-flex align-items-center gap-2"><input type="checkbox" onChange={()=>setIsChecked(!isChecked)} /> By registering you agree to the InfiniteB2B
                                                    </p> 
                                                    <div className="mb-0 fs-12 text-muted fst-italic d-flex align-items-center gap-2">
                                                    <p onClick={()=>handleTermsPrivacyClick(termsFilePath)} className="text-primary text-decoration-underline fst-normal fw-medium cursor-pointer">Terms of Use</p>
                                                    <p onClick={()=>handleTermsPrivacyClick(privacyFilePath)} className="text-primary text-decoration-underline fst-normal fw-medium cursor-pointer">Privacy Policy</p>
                                                    </div>
                                                </div>
                                                <TermsOfUse
                                                    isOpen={isModalOpen}
                                                    toggleModal={toggleModal}
                                                    docxFile={docxFile}
                                                />
                                                <div className="mt-4">
                                                    <button className="btn btn-secondary w-100" disabled={!isChecked} type="submit">Sign Up</button>
                                                </div>
                                            </Form>
                                        </div>
                                    </CardBody>
                                </Card>
                                <div className="mt-4 text-center">
                                    <p className="mb-0">Already have an account ? <Link to={redirectUrl ?"/user/login" : "/vendor/login"}className="fw-semibold text-primary text-decoration-underline"> Signin </Link> </p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </ParticlesAuth>
        </React.Fragment>
    );
};

export default Register;
