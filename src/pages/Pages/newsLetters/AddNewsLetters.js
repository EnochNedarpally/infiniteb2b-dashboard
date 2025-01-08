

import React, { useEffect, useRef, useState } from 'react';
import { Card, CardBody, Col, Row, Container, CardHeader } from 'reactstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ContentEditor from '../../../Components/Common/ContentEditor';

const AddNewsLetters = () => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [newsletterContent, setNewsletterContent] = useState("")
  const token = JSON.parse(sessionStorage.getItem("authUser")) ? JSON.parse(sessionStorage.getItem("authUser")).token : null;
  const navigate = useNavigate()

  const handleImageChange = (acceptedFiles) => {
    setImage(acceptedFiles[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!newsletterContent || !title || !image || !link) {
      alert('Please fill in all fields');
      return;
    }

    const formData = new FormData();
    formData.append('name', title);
    formData.append('content', newsletterContent);
    formData.append('image', image);
    formData.append('link', link);
    setLoading(true);
    setError(null);
    setSuccess(true);

    try {
      const response = await axios.post(
        'https://infiniteb2b.com:8443/api/newsletter/add-newsletter',
        
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
        setNewsletterContent('');
        setTitle('');
        setNewsletterContent("")
        setLink("")
        setImage(null);
        setLoading(false)
        toast.success("NewsLetter Created successfullly")
        navigate("/all-news-letters")
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Something went wrong please try again later')
      setLoading(false)
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <ToastContainer closeButton={false} limit={1} />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader className="card-header">
                  <h4 className="card-title mb-0">Add Newsletter </h4>
                </CardHeader>
                <CardBody>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="title" className="form-label">
                        Newsletter Name
                      </label>
                      <input
                        type="text"
                        id="title"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="desc" className="form-label">
                      Newsletter Content:
                      </label>
                      <ContentEditor  setContent={setNewsletterContent}/>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="image" className="form-label">
                       Featured Image:
                      </label>
                      <input
                        type="file"
                        id="image"
                        accept="image/*"
                        className="form-control"
                        onChange={(e) => handleImageChange(e.target.files)}
                        required
                      />
                      {image && (
                        <div className="mt-2">
                          <p>
                            <strong>Selected Image:</strong> {image.name}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="title" className="form-label">
                        Enter Link for NewsLetter
                      </label>
                      <input
                        type="text"
                        id="title"
                        className="form-control"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        required
                      />
                    </div>

                    <button
                      type="Send"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Sending...' : 'Send'}
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

export default AddNewsLetters;
