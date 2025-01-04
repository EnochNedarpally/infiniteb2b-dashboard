

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Col,
  Container,
  Row,
  Card,
  CardHeader,
  CardBody,
  Modal,
  ModalHeader,
  Button,
} from "reactstrap";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TableContainer from "../../../Components/Common/TableContainer";
import axios from "axios";
import { mediaBaseURL } from "../../../helpers/api_helper";

const AllBlogs = () => {
  const token = JSON.parse(sessionStorage.getItem("authUser")).token ?? null;
  const config = {
    headers: {  
      'Authorization': `Bearer ${token}`,
    },
  };
 const navigate = useNavigate()
  const [isEdit, setIsEdit] = useState(false);
  const [modal, setModal] = useState(false);
   const [file, setFile] = useState(null);
  const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false)
  const [isModified, setIsModified] = useState(false)
    const [query, setQuery] = useState('');
    const [options, setOptions] = useState([]);
    const [Blogs, setBlogs] = useState([]);
    const [blogData, setBlogData] = useState({});
    const [Blog, setBlog] = useState({});


  const handleAddBlogs = () => {
    navigate('/add-new-blog'); 
  };


  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setBlog({});
    } else {
      setModal(true);
    }
  }, [modal]);

  useEffect(()=>{
    fetchBlogs()
    fetchRandomRecords();
  },[])
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
  const fetchRandomRecords = async () => {
    try {
      const response = await axios.get('https://infiniteb2b.com:8443/api/blogs/get-blogs-category',config);
      setOptions(response.data.slice(0, 10).map(item => item.name))
    } catch (error) {
      console.error('Error fetching random records:', error);
    }
  };
  const fetchBlogs=async()=>{
    try {
      const data = await axios.get("https://infiniteb2b.com:8443/admin/allBlogs",config)
      setBlogs(data.data)
    } catch (error) {
      console.log("Blog error",error)
    }
  }


  const fetchSearchResults = async (query) => {
    if (!query) {
      setOptions([]);
      return;
    }
    try {

      const res = await axios.get(`https://infiniteb2b.com:8443/api/blogs/get-blogs-category?name=${query}`, config)
      setOptions(res.data.slice(0, 10).map(item => item.name));
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };
  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };
  const handleBlogChange = (e)=>{
    setIsModified(true)
    const {name,value}=e
    setBlog({...Blog,[name]:value})
  }
  const handleFileChange = (acceptedFiles) => {
    setIsModified(true)
    setBlog(prev => ({ ...prev, file: acceptedFiles[0] }));
  };

  const handleImageChange = (acceptedFiles) => {
    setIsModified(true)
    setBlog(prev => ({ ...prev, image: acceptedFiles[0] }));
  };

  const handleSubmit = async (event) => {
    // event.preventDefault();
    // const formData = new FormData();
    // formData.append("solutionSetId",blogData?.id)
    // Object.keys(Blog).map((key) => {
    //   if (key) {
    //     let value = Blog[key];
    //     if (value instanceof Blob) {
    //       formData.append(key, value);
    //     } else {
    //       value = typeof value === 'object' ? JSON.stringify(value) : value;
    //       formData.append(key, value);
    //     }
    //   }
    // });
  
    // try {
    //   const token = JSON.parse(sessionStorage.getItem("authUser")) ? JSON.parse(sessionStorage.getItem("authUser")).token : null;
    //   const response = await axios.post(
    //     'https://infiniteb2b.com:8443/api/vendor/update-solutionset',
    //     formData,
    //     {
    //       headers: {
    //         'Content-Type': 'multipart/form-data',
    //         'Authorization': `Bearer ${token}`,
    //       },
    //     }
    //   );
    //   if (response.status) {
        
    //     setBlog({});
    //     setIsModified(false)
    //     toast.success("Blog Updated")
    //     fetchBlogs()
    //     toggle()
        
    //   }
    // } catch (err) {
    //   toast.error(err?.response?.data?.message ?? 'Error uploading file')
    //   console.log(err, "err")
    // } finally {
    //   setLoading(false);
    // }
  };
  
  const handleBlogClick = useCallback((arg) => {
    const company = arg;
    setBlogData({...arg.solutionSet,category:arg.categoryName})
    setIsEdit(true);
    toggle();
  }, [toggle]);
   const columns = useMemo(
    () => [
      {
        header: "No.",
        accessorKey: "id",
        enableColumnFilter: false,
        cell: (cell) => (
          <div className="d-flex align-items-center">
            <div className="flex-shrink-0">
              {cell.row.index + 1} 
            </div>
          </div>
        )
        
      },
      {
        header: "Blogs Name",
        accessorKey: "name",
        enableColumnFilter: false,
      },
      {
        header: "Category",
        accessorKey: "category",
        enableColumnFilter: false,
      },
      {
        header: "Published Date",
        accessorKey: "publishDate",
        enableColumnFilter: false,
      },
      {
        header: "Action",
        cell: (cell) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
           
              <li className="list-inline-item" title="View">
                <Link to="#"
                  onClick={() => { window.open(cell.row.original.viewPath ?? "https://infiniteb2b.com/Blog", '_blank'); }}
                >
                  <i className="ri-eye-fill align-bottom text-muted"></i>
                </Link>
              </li>
              <li className="list-inline-item" title="Edit">
                <Link className="edit-item-btn" to="#"
                  onClick={() => { const companyData = cell.row.original; handleBlogClick(companyData); }}
                >
                  <i className="ri-pencil-fill align-bottom text-muted"></i>
                </Link>
              </li>
           
            </ul>
          );
        },
      },
    ],
    [handleBlogClick]
  );

  document.title = "InfiniteB2B";
  return (
    <React.Fragment>
     <div className="page-content">
        <Container fluid>
          <Row>
            <Col xxl={12}>
              <Card 
              >
                <CardBody className="pt-0 ">
                  <div className="flex-grow-1 ">
                       <div className="d-flex justify-content-between align-items-center my-2 mx-1">
                       <h4 className="card-title mb-0">Blogs List</h4>
                       <Button
                         color="secondary"
                         style={{ backgroundColor: 'purple', borderColor: 'purple' }}
                         onClick={handleAddBlogs}
                       >
                         <i className="ri-add-fill me-1 align-bottom"></i> Add Blogs
                       </Button>
                     </div>
                      <TableContainer
                        columns={columns}
                        data={(Blogs ?? [])}
                        isGlobalFilter={true}
                        isAddUserList={false}
                        customPageSize={10}
                        className="custom-header-css"
                        divClass="table-responsive table-card mb-2"
                        tableClass="align-middle table-nowrap"
                        theadClass="table-light"
                        SearchPlaceholder='Search for Blogs...'
                      />
                  </div>
                  {<Modal id="showModal" isOpen={modal} toggle={toggle} centered fullscreen>
                    <ModalHeader className="bg-info-subtle p-3" toggle={toggle}>
                      Update Blog
                    </ModalHeader>
                    <Container fluid>
                      <ToastContainer closeButton={false} limit={1} />
                      <Row>
                        <Col lg={12}>
                          <Card>
                            <CardHeader className="card-header">
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
                                    Blog Name
                                  </label>
                                  <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    className="form-control"
                                    value={Blog?.title ?? blogData?.title}
                                    onChange={(e) => handleBlogChange(e.target)}
                                  />
                                </div>
                                <div className="mb-3">
                                  <label htmlFor="category" className="form-label cursor-pointer">
                                    Category:
                                  </label>
                                  <input
                                    type="text"

                                    value={(Blog?.categoryName ?? blogData?.categoryName )||query}
                                    onChange={handleInputChange}
                                    placeholder="Search a category"
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setTimeout(() => setIsFocused(false), 100)} 
                                    className="form-control cursor-pointer"
                                  />
                                  {isFocused && (
                                    <ul className="absolute w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-64 overflow-auto">
                                      {options.map((item) => (
                                        <li
                                          key={item}
                                          onMouseDown={(e) => {
                                            e.preventDefault();
                                            setCategory(item);
                                            setBlog(prev => ({ ...prev, category: item }));
                                            setIsModified(true)
                                            setIsFocused(false);
                                            setQuery('');
                                          }}
                                          className="p-3 cursor-pointer hover:bg-gray-100"
                                        >
                                          {item}
                                        </li>
                                      ))}
                                      {query && options.length === 0 && (
                                        <li className="p-3 text-gray-500">No results found</li>
                                      )}
                                    </ul>
                                  )}
                                </div>
                                  <p className="form-label mt-2">
                                    <strong>Selected Category:</strong> {category ? category : blogData.category}
                                  </p>
                                <div className="mb-3">
                                  <label htmlFor="image" className="form-label">
                                    PDFPreview:
                                  </label>
                                  <input
                                    type="file"
                                    id="image"
                                    accept="image/*"
                                    className="form-control"
                                    onChange={(e) => handleImageChange(e.target.files)}
                                  />
                                  {blogData?.imagePath && (
                                    <div className="mt-2">
                                      <img src={mediaBaseURL + blogData.imagePath} alt="Blog preview"
                                      style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '10px' }}/>
                                    </div>
                                  )}
                                </div>
                                <div style={{display:"flex",justifyContent:"space-between"}}>
                                  <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={!isModified}
                                  >
                                    Submit
                                  </button>
                                  <button
                                  type="button"
                                    style={{ backgroundColor: "red", color: "white" }}
                                    className="btn "
                                    onClick={()=>handleDelete()}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </form>
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>
                    </Container>
                  </Modal>}
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

export default AllBlogs;
