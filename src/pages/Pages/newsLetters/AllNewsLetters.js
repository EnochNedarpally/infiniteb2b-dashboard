

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

const AllNewsLetters = () => {
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
    const [newsLetters, setnewsLetters] = useState([]);
    const [NewsLetterData, setNewsLetterData] = useState({});
    const [NewsLetter, setNewsLetter] = useState({});


  const handleAddNewsLetters = () => {
    navigate('/add-news-letters'); 
  };


  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setNewsLetter({});
    } else {
      setModal(true);
    }
  }, [modal]);

  useEffect(()=>{
    fetchNewsLetters()
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
      const response = await axios.get('https://infiniteb2b.com:8443/api/category',config);
      setOptions(response.data.slice(0, 10).map(item => item.name))
    } catch (error) {
      console.error('Error fetching random records:', error);
    }
  };
  const fetchNewsLetters=async()=>{
    try {
      const data = await axios.get("https://infiniteb2b.com:8443/admin/allnewsletters",config)
      setnewsLetters(data.data)
    } catch (error) {
      console.log("NewsLetter error",error)
    }
  }


  const fetchSearchResults = async (query) => {
    if (!query) {
      fetchRandomRecords();
      return;
    }
    try {

      const res = await axios.get(`https://infiniteb2b.com:8443/api/category?name=${query}`, config)
      setOptions(res.data.slice(0, 10).map(item => item.name));
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };
  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };
  const handleNewsLetterChange = (e)=>{
    setIsModified(true)
    const {name,value}=e
    setNewsLetter({...NewsLetter,[name]:value})
  }
  const handleFileChange = (acceptedFiles) => {
    setIsModified(true)
    setNewsLetter(prev => ({ ...prev, file: acceptedFiles[0] }));
  };

  const handleImageChange = (acceptedFiles) => {
    setIsModified(true)
    setNewsLetter(prev => ({ ...prev, image: acceptedFiles[0] }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // const formData = new FormData();
    // formData.append("solutionSetId",NewsLetterData?.id)
    // Object.keys(NewsLetter).map((key) => {
    //   if (key) {
    //     let value = NewsLetter[key];
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
        
    //     setNewsLetter({});
    //     setIsModified(false)
    //     toast.success("NewsLetter Updated")
    //     fetchNewsLetters()
    //     toggle()
        
    //   }
    // } catch (err) {
    //   toast.error(err?.response?.data?.message ?? 'Encountered an error while publishing NewsLetter')
    //   console.log(err, "err")
    // } finally {
    //   setLoading(false);
    // }
  };
  // const validation = useFormik({
  //   // enableReinitialize : use this flag when initial values needs to be changed
  //   enableReinitialize: true,

  //   initialValues: {
  //     // img: (company && company.img) || '',
  //     name: (company && company.name) || '',
  //     owner: (company && company.owner) || '',
  //     industry_type: (company && company.industry_type) || '',
  //     star_value: (company && company.star_value) || '',
  //     location: (company && company.location) || '',
  //     employee: (company && company.employee) || '',
  //     website: (company && company.website) || '',
  //     contact_email: (company && company.contact_email) || '',
  //     since: (company && company.since) || '',
  //   },
  //   validationSchema: Yup.object({
  //     name: Yup.string().required("Please Enter Company Name"),
  //     owner: Yup.string().required("Please Enter Category name"),
  //     industry_type: Yup.string().required("Please Enter Industry Type"),
  //     star_value: Yup.string().required("Please Enter Rating"),
  //     location: Yup.string().required("Please Enter Subscibers"),
  //     employee: Yup.string().required("Please Enter Downloads"),
  //     website: Yup.string().required("Please Enter Website"),
  //     contact_email: Yup.string().required("Please Enter Contact Email"),
  //     since: Yup.string().required("Please Enter Since"),
  //   }),
  // });

  // Update Data
  const handleNewsLetterClick = useCallback((arg) => {
    const company = arg;
    setNewsLetterData({...arg.solutionSet,category:arg.categoryName})
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
        header: "NewsLetters Name",
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
        header: "Total Subscribers",
        accessorKey: "totalSubscribers",
        enableColumnFilter: false,
      },
      {
        header: "Action",
        cell: (cell) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
           
              <li className="list-inline-item" title="View">
                <Link to="#"
                  onClick={() => { window.open(cell.row.original.viewPath ?? "https://infiniteb2b.com/NewsLetter", '_blank'); }}
                >
                  <i className="ri-eye-fill align-bottom text-muted"></i>
                </Link>
              </li>
              <li className="list-inline-item" title="Edit">
                <Link className="edit-item-btn" to="#"
                  onClick={() => { const companyData = cell.row.original; handleNewsLetterClick(companyData); }}
                >
                  <i className="ri-pencil-fill align-bottom text-muted"></i>
                </Link>
              </li>
           
            </ul>
          );
        },
      },
    ],
    [handleNewsLetterClick]
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
                       <h4 className="card-title mb-0">NewsLetters List</h4>
                       <Button
                         color="secondary"
                         style={{ backgroundColor: 'purple', borderColor: 'purple' }}
                         onClick={handleAddNewsLetters}
                       >
                         <i className="ri-add-fill me-1 align-bottom"></i> Add NewsLetters
                       </Button>
                     </div>
                      <TableContainer
                        columns={columns}
                        data={(newsLetters ?? [])}
                        isGlobalFilter={true}
                        isAddUserList={false}
                        customPageSize={10}
                        className="custom-header-css"
                        divClass="table-responsive table-card mb-2"
                        tableClass="align-middle table-nowrap"
                        theadClass="table-light"
                        SearchPlaceholder='Search for NewsLetters...'
                      />
                  </div>
                  {<Modal id="showModal" isOpen={modal} toggle={toggle} centered fullscreen>
                    <ModalHeader className="bg-info-subtle p-3" toggle={toggle}>
                      Update NewsLetter
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
                                    NewsLetter Name
                                  </label>
                                  <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    className="form-control"
                                    value={NewsLetter?.title ?? NewsLetterData?.title}
                                    onChange={(e) => handleNewsLetterChange(e.target)}
                                  />
                                </div>
                                <div className="mb-3">
                                  <label htmlFor="category" className="form-label cursor-pointer">
                                    Category:
                                  </label>
                                  <input
                                    type="text"

                                    value={(NewsLetter?.categoryName ?? NewsLetterData?.categoryName )||query}
                                    onChange={handleInputChange}
                                    placeholder="Search a category"
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setTimeout(() => setIsFocused(false), 100)} // Delay hiding
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
                                            setNewsLetter(prev => ({ ...prev, category: item }));
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
                                    <strong>Selected Category:</strong> {category ? category : NewsLetterData.category}
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
                                  {NewsLetterData?.imagePath && (
                                    <div className="mt-2">
                                      <img src={mediaBaseURL + NewsLetterData.imagePath} alt="NewsLetter preview"
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

export default AllNewsLetters;
