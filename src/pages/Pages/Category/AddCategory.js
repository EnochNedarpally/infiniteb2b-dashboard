import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Row, Container, CardHeader } from 'reactstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../../config';

const AddCategory = () => {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('');
  const [desc, setDesc] = useState('');
  const [title, setTitle] = useState('');
  const [bannerImage, setBannerImage] = useState(null);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate()

  const handleBannerImageChange = (files) => {
    if (files && files[0]) {
      setBannerImage(files[0]);
    }
  };

  const handleFeaturedImageChange = (files) => {
    if (files && files[0]) {
      setFeaturedImage(files[0]);
      // Create a preview URL
      setFeaturedImagePreview(URL.createObjectURL(files[0]));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title || !desc) {
      alert('Please fill in all fields');
      return;
    }
  
    const formData = new FormData();
    formData.append('desc', desc);
    formData.append('name', title);
    formData.append('banner', bannerImage);
    formData.append('icon', featuredImage);
    setLoading(true);
    setError(null);
    setSuccess(true);
  
    try {
      const token = JSON.parse(sessionStorage.getItem("authUser")) ? JSON.parse(sessionStorage.getItem("authUser")).token : null;
      // const token = 'eyJhbGciOiJIUzUxMiJ9.eyJyb2xlcyI6WyJDQU1QQUlHTk1BTkFHRVIiXSwic3ViIjoiY2FtcGFpZ25tYW5hZ2VyQGRlbWFuZGF5LmluZm8iLCJpYXQiOjE3MzI2OTY4NzgsImV4cCI6MTczMzA1Njg3OH0.PVZcsHqm8XiZzkMejYThVcHko1YEIdA26rNyuNFXDbCLuHKqPw2Q1mRH-OyWHOc5b4Ye9GXy6YXcIDPfbbXGTQ';
      const response = await axios.post(
        `${api.API_URL}/api/category/add`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (response.message == "Success") {
        
        setFile(null);
        setCategory('');
        setDesc('');
        setTitle('');
        setBannerImage(null)
        setFeaturedImage(null)
        setFeaturedImagePreview(null)
        navigate("/admin/all-category")
        toast.success("Category Added")

      }
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Error uploading file')
      setError(err?.response?.data?.message ?? 'Error uploading file');
      console.log(err, "err")
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content m-0">
        <Container fluid>
          <ToastContainer closeButton={false} limit={1} />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader className="card-header m-0">
                  <h4 className="card-title mb-0">Add WhitePapers-set Category</h4>
                </CardHeader>
                <CardBody className='m-0'>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="title" className="form-label">
                        Category Name
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

                    <div className="mb-4">
                      <label htmlFor="desc" className="form-label">
                        Category Description
                      </label>
                      <textarea
                        id="desc"
                        className="form-control"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                      
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="bannerImage" className="form-label">
                        Insert Banner Image
                      </label>
                      <input
                        type="file"
                        id="bannerImage"
                        accept="image/*"
                        className="form-control"
                        onChange={(e) => handleBannerImageChange(e.target.files)}
                     
                      />
                      <p className="text-muted mt-1">
                        Please upload an image having size (1280x720)
                      </p>
                      {bannerImage && (
                        <div className="mt-2">
                          <p>
                            <strong>Selected Banner Image:</strong> {bannerImage.name}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <label htmlFor="featuredImage" className="form-label">
                        Insert Featured Image
                      </label>
                      <input
                        type="file"
                        id="featuredImage"
                        accept="image/*"
                        className="form-control"
                        onChange={(e) => handleFeaturedImageChange(e.target.files)}
                        required
                      />
                      <p className="text-muted mt-1">
                        Please upload an image having size (500x400)
                      </p>
                      {featuredImage && (
                        <div className="mt-2">
                          <p>
                            <strong>Selected Featured Image:</strong> {featuredImage.name}
                          </p>
                          <img
                            src={featuredImagePreview}
                            alt="Preview"
                            style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '10px' }}
                          />
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Uploading...' : 'Submit'}
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

export default AddCategory;
