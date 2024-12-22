

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


// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

// Export Modal
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TableContainer from "../../../Components/Common/TableContainer";
// import TableContainer from "../../Components/Common/TableContainer";
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";
import DeleteModal from "../../../Components/Common/DeleteModal";
import axios from "axios";
import { mediaBaseURL } from "../../../helpers/api_helper";

const AllWhitepapers = () => {
  const token = JSON.parse(sessionStorage.getItem("authUser")).token ?? null;
  const config = {
    headers: {  
      'Authorization': `Bearer ${token}`,
    },
  };
 const Navigate = useNavigate()
  const [isEdit, setIsEdit] = useState(false);
  const [company, setCompany] = useState([]);

  //delete Company
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);
  const [modal, setModal] = useState(false);
   const [file, setFile] = useState(null);
  const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false)
  const [isModified, setIsModified] = useState(false)
    const [query, setQuery] = useState('');
    const [options, setOptions] = useState(["Airlines", "SOCIAL-MEDIA-STRATEGY-GUIDE", "Big Data", "Machine-learning", "2023-INDUSTRY-TRENDS-REPORT", "SEO-Keyword-Research", "B2B-Lead-Generation-Campaign-Guide", "Authentic-Gaming", "From-B2B-to-D2C-online-sales.", "CRM (Customer Relationship Management)"]);
    const [categories, setCategories] = useState([]);
    const [whitePaperData, setWhitepaperData] = useState({});
    const [whitePaper, setWhitepaper] = useState({});


  const handleAddWhitepapers = () => {
    Navigate('/admin/add-whitepapers'); 
  };

  const industrytype = [
    {
      options: [
        { label: "Select industry type", value: "Select industry type" },
        { label: "Computer Industry", value: "Computer Industryfdgfdgfd" },
        { label: "Chemical Industries", value: "Chemical Industries" },
        { label: "Health Services", value: "Health Services" },
        {
          label: "Telecommunications Services",
          value: "Telecommunications Services",
        },
        {
          label: "Textiles: Clothing, Footwear",
          value: "Textiles: Clothing, Footwear",
        },
      ],
    },
  ];

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setWhitepaper({});
    } else {
      setModal(true);
    }
  }, [modal]);

  // Delete Data
  const handleDeleteCompany = () => {
    if (company) {
      dispatch(onDeleteCompanies(company._id));
      setDeleteModal(false);
    }
  };


  useEffect(()=>{
    fetchWhitepapers()
    fetchRandomRecords();
  },[])
  useEffect(() => {
      let interval = null
      // console.log("query", query)
      if (query) {
        // console.log("queryunder", query)
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
      // console.log("response", response)
    } catch (error) {
      console.error('Error fetching random records:', error);
    }
  };
  const fetchWhitepapers=async()=>{
    try {
      const data = await axios.get("https://infiniteb2b.com:8443/admin/get-allwhitepapers?value=4",config)
      setCategories(data.data.whitepapers)
    } catch (error) {
      console.log("Whitepaper error",error)
    }
  }

  const fetchSearchResults = async (query) => {
    if (!query) {
      setOptions([]);
      return;
    }
    try {

      const res = await axios.get(`https://infiniteb2b.com:8443/api/category?name=${query}`, config)
      // console.log("res.data", res.data)
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
      setLoading(false);
    }
  };
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
  const handleWhitePaperClick = useCallback((arg) => {
    const company = arg;
    setWhitepaperData({...arg.solutionSet,category:arg.categoryName})
    
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
  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    const ele = document.querySelectorAll(".companyCheckBox");

    if (checkall.checked) {
      ele.forEach((ele) => {
        ele.checked = true;
      });
    } else {
      ele.forEach((ele) => {
        ele.checked = false;
      });
    }
    deleteCheckbox();
  }, []);

  // Delete Multiple
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState(false);


  const deleteMultiple = () => {
    const checkall = document.getElementById("checkBoxAll");
    selectedCheckBoxDelete.forEach((element) => {
      // dispatch(onDeleteCompanies(element.value));
      setTimeout(() => { toast.clearWaitingQueue(); }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };

  const deleteCheckbox = () => {
    const ele = document.querySelectorAll(".companyCheckBox:checked");
    ele.length > 0 ? setIsMultiDeleteButton(true) : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(ele);
  };

  const formatDate= (dateString)=>{
    const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const day = String(date.getDate()).padStart(2, '0'); 
  return `${year}-${month}-${day}`;
  }

   const columns = useMemo(
    () => [
      {
        header: "No.",
        accessorKey: "No.",
        enableColumnFilter: false,
        cell: (cell) => (
          <div className="d-flex align-items-center">
            <div className="flex-shrink-0">
              {cell.row.index + 1} {/* This will display row numbers starting from 1 */}
            </div>
          </div>
        )
        
      },
      {
        header: "WhitePapers Name",
        accessorKey: "solutionSet.title",
        enableColumnFilter: false,
      },

      {
        header: "Category Name",
        accessorKey: "categoryName",
        enableColumnFilter: false,
      },
      
      {
        header: "Total Views",
        accessorKey: "totalViews",
        enableColumnFilter: false,
      },
      {
        header: "Total Downloads",
        accessorKey: "totalDownloads",
        enableColumnFilter: false,
      },
 
      {
        header: "Published date",
        accessorKey: "publishedDate",
        enableColumnFilter: false,
        cell: ({ cell }) => {
          const rawDate = cell.getValue(); // Get the raw date value
          const formattedDate = rawDate.split("T")[0]; // Extract the date portion
          return formatDate(formattedDate);
        },
      },
      
      {
        header: "Action",
        cell: (cell) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
           
              <li className="list-inline-item" title="View">
                <Link to="#"
                  onClick={() => { window.open(cell.row.original.whitePaperUrl ?? "https://infiniteb2b.com/whitepaper", '_blank'); }}
                >
                  <i className="ri-eye-fill align-bottom text-muted"></i>
                </Link>
              </li>
              <li className="list-inline-item" title="Edit">
                <Link className="edit-item-btn" to="#"
                  onClick={() => { const companyData = cell.row.original; handleWhitePaperClick(companyData); }}
                >
                  <i className="ri-pencil-fill align-bottom text-muted"></i>
                </Link>
              </li>
           
            </ul>
          );
        },
      },
    ],
    [handleWhitePaperClick, checkedAll]
  );

  const [info, setInfo] = useState([]);
  const [isExportCSV, setIsExportCSV] = useState(false);

  document.title = "InfiniteB2B";
  return (
    <React.Fragment>
     <div className="page-content">
        <ExportCSVModal
          show={isExportCSV}
          onCloseClick={() => setIsExportCSV(false)}
          data={categories ?? []}
        />
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteCompany}
          onCloseClick={() => setDeleteModal(false)}
        />
        <DeleteModal
          show={deleteModalMulti}
          onDeleteClick={() => {
            deleteMultiple();
            setDeleteModalMulti(false);
          }}
          onCloseClick={() => setDeleteModalMulti(false)}
        />
        <Container fluid>
          <Row>
            <Col xxl={12}>
              <Card 
              >
                <CardBody className="pt-0 ">
                  <div className="flex-grow-1 ">
                       <div className="d-flex justify-content-between align-items-center my-2 mx-1">
                       <h4 className="card-title mb-0">WhitePapers List</h4>
                       <Button
                         color="secondary"
                         style={{ backgroundColor: 'purple', borderColor: 'purple' }}
                         onClick={handleAddWhitepapers}
                       >
                         <i className="ri-add-fill me-1 align-bottom"></i> Add Whitepapers
                       </Button>
                     </div>
                      <TableContainer
                        columns={columns}
                        data={(categories ?? [])}
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

                                <button
                                  type="submit"
                                  className="btn btn-primary"
                                  disabled={!isModified}
                                >
                                  Submit
                                </button>
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

export default AllWhitepapers;
