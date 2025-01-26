

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
import ContentEditor from "../../../Components/Common/ContentEditor";

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
 const [blogContent, setBlogContent] = useState("")

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
    useEffect(()=>{
      if(blogContent){
        setIsModified(true)
        setBlog(prev => ({ ...prev, content: blogContent }));
      }
    },[blogContent])
  const fetchRandomRecords = async () => {
    try {
      const response = await axios.get('https://infiniteb2b.com:8443/api/blogs/get-blogs-category',config);
      setOptions(response.data.slice(0, 10).map(item => item))
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
    event.preventDefault();
    const formData = new FormData();
    formData.append("blogId",blogData?.id)
    Object.keys(Blog).map((key) => {
      if (key) {
        let value = Blog[key];
        if (value instanceof Blob) {
          formData.append(key, value);
        } else {
          value = typeof value === 'object' ? JSON.stringify(value) : value;
          formData.append(key, value);
        }
      }
    });
  
    try {
      const token = JSON.parse(sessionStorage.getItem("authUser")) ? JSON.parse(sessionStorage.getItem("authUser")).token : null;
      const response = await axios.put(
        'https://infiniteb2b.com:8443/api/blogs/edit-blogs',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (response.status) {
        
        setBlog({});
        setIsModified(false)
        toast.success("Blog Updated")
        fetchBlogs()
        toggle()
        
      }
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Encountered an Error while Updating Blog')
      console.log(err, "err")
    } finally {
      setLoading(false);
    }
  };
     const showConfirmToast = (itemId) => {
        toast(
          <div>
            <h3>Are you sure you want to delete this item?</h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button
                onClick={() => handleCancel()}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirm(itemId)}
                className="confirm-btn"
              >
                Confirm
              </button>
            </div>
          </div>,
          {
            position: "top-center",
            autoClose: false, // Stay open until the user takes action
            closeOnClick: false,
            draggable: false,
            pauseOnHover: false,
            closeButton: false,
          }
        );
      };

  const handleDelete = ()=>{
    showConfirmToast()
  }
  const handleCancel = ()=>{
    toast.dismiss()
  }
  const handleConfirm = async()=>{
    try {
      const data = await axios.delete(`https://infiniteb2b.com:8443/api/blogs/delete-blog/${blogData.id}`,config)
      toast.warn("Item Deleted")
      fetchBlogs()
      toggle()
      toast.dismiss()
    } catch (error) {
      toast.error("Something went wrong, Please try again later..")
      toast.dismiss()
    }
   
  }
  
  const handleBlogClick = useCallback((arg) => {
    const company = arg;
    setBlogData({...arg})
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
        header: "Blog Name",
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
        header: "Total Views",
        accessorKey: "totalViews",
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
                       <h4 className="card-title mb-0">Blog List</h4>
                       <Button
                         color="secondary"
                         style={{ backgroundColor: 'purple', borderColor: 'purple' }}
                         onClick={handleAddBlogs}
                       >
                         <i className="ri-add-fill me-1 align-bottom"></i> Add Blog
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
                              <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                  <label htmlFor="name" className="form-label">
                                    Blog Name
                                  </label>
                                  <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="form-control"
                                    value={Blog?.name ?? blogData?.name}
                                    onChange={(e) => handleBlogChange(e.target)}
                                  />
                                </div>
                                <div className="mb-3">
                                  <label htmlFor="desc" className="form-label">
                                    Blog Content:
                                  </label>
                                   <ContentEditor content={Blog?.content ?? blogData.content} setContent={setBlogContent}/>
                                </div>
                                <div className="mb-3">
                                  <label htmlFor="category" className="form-label cursor-pointer">
                                    Category:
                                  </label>
                                  <input
                                    type="text"

                                    value={(Blog?.category ?? blogData?.categoryName )||query}
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
                                          key={item.id}
                                          onMouseDown={(e) => {
                                            e.preventDefault();
                                            setCategory(item.blogCategoryName);
                                            setBlog(prev => ({ ...prev, blogsCategoryId: item.id }));
                                            setIsModified(true)
                                            setIsFocused(false);
                                            setQuery('');
                                          }}
                                          className="p-3 cursor-pointer hover:bg-gray-100"
                                        >
                                          {item.blogCategoryName}
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
                                    Image Preview:
                                  </label>
                                  <input
                                    type="file"
                                    id="image"
                                    accept="image/*"
                                    className="form-control"
                                    onChange={(e) => handleImageChange(e.target.files)}
                                  />
                                  {(Blog?.image?.name || blogData?.imageContent) && (
                                    <div className="mt-2">
                                     { Blog?.image?.name ?<p>{Blog?.image?.name}</p> :<img src={blogData?.imageContent} alt="Blog preview"
                                      style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '10px' }}/>}
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
