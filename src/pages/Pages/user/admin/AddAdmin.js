import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Row, Container, CardHeader, Label } from 'reactstrap';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const AddAdmin = () => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [pass, setPass] = useState("");

  const navigate = useNavigate()
  const adminData = useLocation()?.state

  const token = 'your_jwt_token_here'; // Replace with your token

  useEffect(() => {
    if (adminData) {
      setName(adminData.name)
      setEmail(adminData.email)
      setLocation(adminData.Location)
      setPhoneNumber(adminData.name)
      setPass(adminData.pass)
    }
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name || !phoneNumber || !email || !location) {
      alert('Please fill in all fields');
      return;
    }

    const formData = new FormData();

    formData.append('name', name);
    formData.append('isSuperAdmin', 1);
    formData.append('email', email);
    formData.append('location', location);
    formData.append('phone', phoneNumber);
    formData.append('password', pass);

    setLoading(true);
    setError(null);
    setSuccess(true);

    try {
      const response = await axios.post(
        'https://infiniteb2b.com:8443/register/admin',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
console.log("formData", formData)
      if (response.message.toLowerCase() == "success") {
        setName('');
        setPhoneNumber('');
        setEmail('');
        setLocation('');
        setPass('');
        navigate("/admin/user-alladmin")
      }
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Error submitting form')
      setError(err?.response?.data?.message ?? 'Error submitting form');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content m-0">
        <Container fluid>
          <Row>
            <Col lg={12}>
             <ToastContainer closeButton={false} limit={1} />
              <Card>
                <CardHeader className="card-header m-0">
                  <h4 className="card-title mb-0">Add Admin</h4>
                </CardHeader>
                <CardBody className="m-0">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="name" className="form-label">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    {/* <div className="mb-3">
                                                    <label htmlFor="username" className="form-label">  isSuperAdmin <span className="text-danger">*</span></label>
                                                    <Input
                                                        name="isSuperAdmin"
                                                        type="text"
                                                        placeholder="Enter username"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value="3"
                                                     
                                                    />
                                                 

                                                </div> */}
                    <div className="mb-4">
                      <label htmlFor="phoneNumber" className="form-label">
                        Phone No.
                      </label>
                      <input
                        type="text"
                        id="phoneNumber"
                        className="form-control"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="pass" className="form-label">
                        Password
                      </label>
                      <input
                        type="pass"
                        id="pass"
                        className="form-control"
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="location" className="form-label">
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        className="form-control"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Submitting...' : 'Submit'}
                    </button>
                  </form>

                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AddAdmin;
