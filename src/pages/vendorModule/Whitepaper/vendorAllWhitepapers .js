

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useLocation, useNavigate} from "react-router-dom";
import {
  Col,
  Container,
  Row,
  Card,
  CardBody,
  ModalBody,
  Label,
  Input,
  Modal,
  ModalHeader,
  Form,
  ModalFooter,
  Button,
  FormFeedback,
  CardHeader
} from "reactstrap";


import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TableContainer from "../../../Components/Common/TableContainer";
import Loader from "../../../Components/Common/Loader";
import axios from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";
import { mediaBaseURL } from "../../../helpers/api_helper";

const VendorAllWhitepapers = () => {

const token = JSON.parse(sessionStorage.getItem("authUser")).token ?? null;
  const config = {
    headers: {  
      'Authorization': `Bearer ${token}`,
    },
  };
 const Navigate = useNavigate()
 const location = useLocation();

  const queryParams = new URLSearchParams(location.search).get('status');
  const [isEdit, setIsEdit] = useState(false);
  const [company, setCompany] = useState([]);
  const [modal, setModal] = useState(false);
  const [whitepapers, setWhitepapers] = useState([]);
  const [whitePaperData, setWhitepaperData] = useState({});
  const [whitePaper, setWhitepaper] = useState({});
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('');
  const [isFocused, setIsFocused] = useState(false)
  const [isModified, setIsModified] = useState(false)
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState([])


  const handleAddWhitepapers = () => {
    Navigate('/add-whitepapers'); 
  };

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setCompany(null);
    } else {
      setModal(true);
    }
  }, [modal]);

  useEffect(()=>{
    fetchWhitepapers()
    fetchRandomRecords()
  },[queryParams])

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

  const fetchWhitepapers=async()=>{
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    };
    const data = await axios.get(`https://infiniteb2b.com:8443/api/vendor/get-allwhitepapers?status=${queryParams ?? ""}`,config)
    setWhitepapers(data.data)
    
  }

  const fetchRandomRecords = async () => {
    try {
      const response = await axios.get('https://infiniteb2b.com:8443/api/category',config);
      setOptions(response.data.slice(0, 10).map(item => item.name))
    } catch (error) {
      console.error('Error fetching random records:', error);
    }
  };
  const fetchSearchResults = async (query) => {
    if (!query) {
      setOptions([]);
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
  const handleWhitepaperChange = (e)=>{
    setIsModified(true)
    const {name,value}=e
    setWhitepaper({...whitePaper,[name]:value})
  }
  const handleFileChange = (acceptedFiles) => {
    setIsModified(true)
    setWhitepaper(prev => ({ ...prev, file: acceptedFiles[0] }));
  };

  const handleImageChange = (acceptedFiles) => {
    setIsModified(true)
    setWhitepaper(prev => ({ ...prev, image: acceptedFiles[0] }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("solutionSetId",whitePaperData?.id)
    Object.keys(whitePaper).map((key) => {
      if (key) {
        let value = whitePaper[key];
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
      const response = await axios.post(
        'https://infiniteb2b.com:8443/api/vendor/update-solutionset',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (response.status) {
        
        setWhitepaper({});
        setIsModified(false)
        toast.success("Whitepaper Updated")
        fetchWhitepapers()
        toggle()
        
      }
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Error uploading file')
      console.log(err, "err")
    } finally {
    }
  };

  // const showConfirmToast = (itemId) => {
  //   toast(
  //     <div>
  //       <h3>Are you sure you want to delete this item?</h3>
  //       <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
  //         <button
  //           onClick={() => handleCancel()}
  //           className="cancel-btn"
  //         >
  //           Cancel
  //         </button>
  //         <button
  //           onClick={() => handleConfirm(itemId)}
  //           className="confirm-btn"
  //         >
  //           Confirm
  //         </button>
  //       </div>
  //     </div>,
  //     {
  //       position: "top-center",
  //       autoClose: false,
  //       closeOnClick: false,
  //       draggable: false,
  //       pauseOnHover: false,
  //       closeButton: false,
  //     }
  //   );
  // };

  // const handleDelete = () => {
  //   showConfirmToast()
  // }
  // const handleCancel = () => {
  //   toast.dismiss()
  // }
  // const handleConfirm = async () => {
  //   const formData = new FormData();
  //   formData.append('solutionId', whitePaperData.id);
  //   try {
  //     const config = {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //         'Authorization': `Bearer ${token}`
  //       }
  //     };
  //     await axios.put(`https://infiniteb2b.com:8443/admin/reject-solutionsets`, formData, config)
  //     toast.warn("Whitepaper Deleted")
  //     fetchWhitepapers()
  //     setModal(false)
  //   } catch (error) {
  //     toast.error(error)
  //   }finally {
  //     toast.dismiss()
  //   }
  // }

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      // img: (company && company.img) || '',
      name: (company && company.name) || '',
      owner: (company && company.owner) || '',
      industry_type: (company && company.industry_type) || '',
      star_value: (company && company.star_value) || '',
      location: (company && company.location) || '',
      employee: (company && company.employee) || '',
      website: (company && company.website) || '',
      contact_email: (company && company.contact_email) || '',
      since: (company && company.since) || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Company Name"),
      owner: Yup.string().required("Please Enter Category name"),
      industry_type: Yup.string().required("Please Enter Industry Type"),
      star_value: Yup.string().required("Please Enter Rating"),
      location: Yup.string().required("Please Enter Subscibers"),
      employee: Yup.string().required("Please Enter Downloads"),
      website: Yup.string().required("Please Enter Website"),
      contact_email: Yup.string().required("Please Enter Contact Email"),
      since: Yup.string().required("Please Enter Since"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateCompany = {
          _id: company ? company._id : 0,
          // img: values.img,
          name: values.name,
          owner: values.owner,
          industry_type: values.industry_type,
          star_value: values.star_value,
          location: values.location,
          employee: values.employee,
          website: values.website,
          contact_email: values.contact_email,
          since: values.since,
        };
        // update Company
        dispatch(onUpdateCompanies(updateCompany));
        validation.resetForm();
      } else {
        const newCompany = {
          _id: (Math.floor(Math.random() * (30 - 20)) + 20).toString(),
          // img: values["img"],
          name: values["name"],
          owner: values["owner"],
          industry_type: values["industry_type"],
          star_value: values["star_value"],
          location: values["location"],
          employee: values["employee"],
          website: values["website"],
          contact_email: values["contact_email"],
          since: values["since"]
        };
        // save new Company
        // dispatch(onAddNewCompanies(newCompany));
        validation.resetForm();
      }
      toggle();
    },
  });

  // Update Data
  const handleCompanyClick = useCallback((arg) => {
    const company = arg;
    setWhitepaperData({...arg,category:arg?.categoryName})
    setCompany({
      _id: company._id,
      // img: company.img,
      name: company.name,
      owner: company.owner,
      industry_type: company.industry_type,
      star_value: company.star_value,
      location: company.location,
      employee: company.employee,
      website: company.website,
      contact_email: company.contact_email,
      since: company.since
    });

    setIsEdit(true);
    toggle();
  }, [toggle]);


  

   const columns = useMemo(
    () => [
      {
        header: "No.",
        accessorKey: "No.",
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
        header: "WhitePapers Name",
        accessorKey: "title",
        enableColumnFilter: false,
      },
      {
        header: "Status",
        accessorKey: "status",
        enableColumnFilter: false,
      },
      {
        header: "Action",
        cell: (cell) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item" title="Edit">
                <Link className="edit-item-btn" to="#"
                  onClick={() => { const companyData = cell.row.original; handleCompanyClick(companyData); }}
                >
                  <i className="ri-pencil-fill align-bottom text-muted"></i>
                </Link>
              </li>
           
            </ul>
          );
        },
      },
    ],
    [handleCompanyClick]
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
                       <h4 className="card-title mb-0">WhitePaper List</h4>
                       <Button
                         color="secondary"
                         style={{ backgroundColor: 'purple', borderColor: 'purple' }}
                         onClick={handleAddWhitepapers}
                       >
                         <i className="ri-add-fill me-1 align-bottom"></i> Add Whitepaper
                       </Button>

                     </div>              
                      <TableContainer
                        columns={columns}
                        data={(whitepapers ?? [])}
                        isGlobalFilter={true}
                        isAddUserList={false}
                        customPageSize={10}
                        className="custom-header-css"
                        divClass="table-responsive table-card mb-2"
                        tableClass="align-middle table-nowrap"
                        theadClass="table-light"
                        SearchPlaceholder='Search for WhitePapers...'
                      />
                  </div>
                  {<Modal id="showModal" isOpen={modal} toggle={toggle} centered fullscreen>
                    <ModalHeader className="bg-info-subtle p-3" toggle={toggle}>
                      Update Whitepaper
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
                                    Whitepaper Name
                                  </label>
                                  <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    className="form-control"
                                    value={whitePaper?.title ?? whitePaperData?.title}
                                    onChange={(e) => handleWhitepaperChange(e.target)}
                                  />
                                </div>
                                <div className="mb-3">
                                  <label htmlFor="category" className="form-label cursor-pointer">
                                    Category:
                                  </label>
                                  <input
                                    type="text"
                                    value={(whitePaper?.categoryName ?? whitePaperData?.categoryName )||query}
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
                                            setWhitepaper(prev => ({ ...prev, category: item }));
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
                                    <strong>Selected Category:</strong> {category ? category : whitePaperData.category}
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
                                  {whitePaperData?.imagePath && (
                                    <div className="mt-2">
                                      <img src={mediaBaseURL + whitePaperData.imagePath} alt="Whitepaper preview"
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

export default VendorAllWhitepapers;