

import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Row, Container, CardHeader } from 'reactstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddNewsLetters = () => {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('');
  const [desc, setDesc] = useState('');
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState("");

  const [query, setQuery] = useState('');
  const [options, setOptions] = useState([]);
  const [isFocused, setIsFocused] = useState(false)
  const token = JSON.parse(sessionStorage.getItem("authUser")) ? JSON.parse(sessionStorage.getItem("authUser")).token : null;
  const navigate = useNavigate()
  const config = {

    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
  useEffect(() => {
    fetchRandomRecords();
  }, []);

  const fetchRandomRecords = async () => {
    try {
      const response = await axios.get('https://infiniteb2b.com:8443/api/category',config);
      setOptions(response.data?.slice(0, 10).map(item => item))
    } catch (error) {
      console.error('Error fetching random records:', error);
    }
  };
  useEffect(() => {
    let interval = null
    if (query) {
      interval = setTimeout(() => {
        fetchSearchResults(query)
      }, 400)
    }
    return () => {
      clearTimeout(interval)
    }
  }, [query])


  const fetchSearchResults = async (query) => {
    if (!query) {
      setOptions([]);
      return;
    }
    try {

      const res = await axios.get(`https://infiniteb2b.com:8443/api/category?name=${query}`, config)
      setOptions(res.data.slice(0, 10).map(item => item));
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleInputChange = (event) => {
    setIsFocused(true)
    setQuery(event.target.value);
  };

  const handleFileChange = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const handleImageChange = (acceptedFiles) => {
    setImage(acceptedFiles[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file || !category || !desc || !title || !image) {
      alert('Please fill in all fields');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('categoryId', category.id);
    formData.append('desc', desc);
    formData.append('name', title);
    formData.append('image', image);

    setLoading(true);
    setError(null);
    setSuccess(true);

    try {
      const token = JSON.parse(sessionStorage.getItem("authUser")) ? JSON.parse(sessionStorage.getItem("authUser")).token : null;
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
        setSuccess(true);
        setFile(null);
        setCategory('');
        setDesc('');
        setTitle('');
        setImage(null);
        toast.success("NewsLetter Created successfullly")
        navigate("/all-news-letters")
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
                  <p className="text-muted">
                    Upload your PDF files along with relevant details using this form.
                  </p>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">File:</label>
                      <div
                        className="dropzone dz-clickable"
                        onClick={() => document.getElementById('fileInput').click()}
                      >
                        <div className="dz-message needsclick">
                          <div className="mb-3">
                            <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                          </div>
                          <h4>Drop PDF files here or click to upload PDF.</h4>
                        </div>
                      </div>
                      <input
                        type="file"
                        id="fileInput"
                        accept=".pdf"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileChange(e.target.files)}
                      />
                      {file && (
                        <div className="mt-2">
                          <p>
                            <strong>Selected File:</strong> {file.name}
                          </p>
                        </div>
                      )}
                    </div>

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
                      Newsletter Description:
                      </label>
                      <textarea
                        id="desc"
                        className="form-control"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="category" className="form-label cursor-pointer">
                        Category:
                      </label>
                      <input
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        placeholder="Search a category"
                        onClick={()=>setIsFocused(true)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setTimeout(() => setIsFocused(false), 100)} // Delay hiding
                         className="form-control cursor-pointer"
                      />
                      {isFocused && (
                        <ul className="absolute w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-64 overflow-auto">
                          {options.map((item) => (
                            <li
                              key={item.id}
                              onMouseDown={(e) => {
                                e.preventDefault()
                                setCategory(item);
                                setIsFocused(false); 
                                setQuery(''); 
                              }}
                              className="p-3 cursor-pointer hover:bg-gray-100"
                            >
                              {item.name}
                            </li>
                          ))}
                          {query && options.length === 0 && (
                            <li className="p-3 text-gray-500">No results found</li>
                          )}
                        </ul>
                      )}
                    </div>
                    {category && (
                      <p className="text-info mt-2">
                        <strong>Selected Category:</strong> {category.name}
                      </p>
                    )}



                    <div className="mb-3">
                      <label htmlFor="image" className="form-label">
                        Image:
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

export default AddNewsLetters;
