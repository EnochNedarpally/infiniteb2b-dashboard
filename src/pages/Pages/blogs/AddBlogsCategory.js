import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Row, Container, CardHeader } from 'reactstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddBlogsCategory = () => {

  const [desc, setDesc] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate()
  const token = JSON.parse(sessionStorage.getItem("authUser")) ? JSON.parse(sessionStorage.getItem("authUser")).token : null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if ( !desc || !title) {
      alert('Please fill in all fields');
      return;
    }

    const formData = new FormData();
    formData.append('blogCategoryDescp', desc);
    formData.append('name', title);

    setLoading(true);

    try {
      const response = await axios.post(
        'https://infiniteb2b.com:8443/api/blogs/add-blogs-category',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
        setDesc('');
        setTitle('');
        navigate("/all-blogs-category")
        toast.success("Blogs category added")
    } catch (err) {
      setLoading(false)
      toast.error(err?.response?.data?.message ?? 'Error Adding Category');
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
              <Card>
                <CardHeader className="card-header m-0">
                  <h4 className="card-title mb-0">Add Blog Category</h4>
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
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Uploading...' : 'Submit'}
                    </button>
                  </form>
                <ToastContainer closeButton={false} limit={1} />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AddBlogsCategory;
