

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
  Alert,
} from "reactstrap";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TableContainer from "../../../Components/Common/TableContainer";
import axios from "axios";
import { mediaBaseURL } from "../../../helpers/api_helper";
import ContentEditor from "../../../Components/Common/ContentEditor";



const AllNewsLetters = () => {
  const token = JSON.parse(sessionStorage.getItem("authUser")) ? JSON.parse(sessionStorage.getItem("authUser")).token : null;
  const config = {
    headers: {  
      'Authorization': `Bearer ${token}`,
    },
  };
 const navigate = useNavigate()
  const [isEdit, setIsEdit] = useState(false);
  const [modal, setModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false)
  const [isModified, setIsModified] = useState(false)
    const [query, setQuery] = useState('');
    const [options, setOptions] = useState([]);
    const [newsLetters, setnewsLetters] = useState([]);
    const [NewsLetterData, setNewsLetterData] = useState({});
    const [NewsLetter, setNewsLetter] = useState({});
     const [newsletterContent, setNewsletterContent] = useState("")


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
  const handleAddNewsLetters = () => {
    navigate('/add-news-letters'); 
  };

useEffect(()=>{
  if(newsletterContent){
    setIsModified(true)
    setNewsLetter(prev => ({ ...prev, content: newsletterContent }));
  }
},[newsletterContent])
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
    const formData = new FormData();
    formData.append("id",NewsLetterData?.id)
    Object.keys(NewsLetter).map((key) => {
      if (key) {
        let value = NewsLetter[key];
        if (value instanceof Blob) {
          formData.append(key == "previewLink" ? "link" : key, value);
        } else {
          value = typeof value === 'object' ? JSON.stringify(value) : value;
          formData.append(key == "previewLink" ? "link" : key, value);
        }
      }
    });
  
    try {
      
      const response = await axios.put(
        'https://infiniteb2b.com:8443/api/newsletter/edit-newsletter',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (response.status) {
        
        setNewsLetter({});
        setIsModified(false)
        toast.success("NewsLetter Updated")
        fetchNewsLetters()
        toggle()
        
      }
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Encountered an error while publishing NewsLetter')
      console.log(err, "err")
    } finally {
      setLoading(false);
    }
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
    setNewsLetterData({...arg})
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
        header: "NewsLetter Name",
        accessorKey: "name",
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

  const handleDelete = ()=>{
    showConfirmToast()
  }
  const handleCancel = ()=>{
    toast.dismiss()
  }
  const handleConfirm = async()=>{
    try {
      const data = await axios.delete(`https://infiniteb2b.com:8443/api/newsletter/delete-newsletter/${NewsLetterData.id}`,config)
      navigate("/all-news-letters")
      toast.warn("Item Deleted")
      fetchNewsLetters()
      toggle()
      toast.dismiss()
    } catch (error) {
      toast.error("Something went wrong, Please try again later..")
      toast.dismiss()
    }
   
  }

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
                       <h4 className="card-title mb-0">NewsLetter List</h4>
                       <Button
                         color="secondary"
                         style={{ backgroundColor: 'purple', borderColor: 'purple' }}
                         onClick={handleAddNewsLetters}
                       >
                         <i className="ri-add-fill me-1 align-bottom"></i> Add NewsLetter
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
                              <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                  <label htmlFor="name" className="form-label">
                                    NewsLetter Name
                                  </label>
                                  <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="form-control"
                                    value={NewsLetter?.name ?? NewsLetterData?.name}
                                    onChange={(e) => handleNewsLetterChange(e.target)}
                                  />
                                </div>
                                  <ContentEditor content={NewsLetter?.content ?? NewsLetterData.content} setContent={setNewsletterContent}/>
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
                                  />
                                  {(!NewsLetter?.image && NewsLetterData?.image) ? (
                                    <div className="mt-2">
                                      <img src={NewsLetterData.image} alt="NewsLetter preview"
                                      style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '10px' }}/>
                                    </div>
                                  ) : <div className="mt-2">
                                  <p>
                                    <strong>Selected Image:</strong> {NewsLetter.image?.name}
                                  </p>
                                </div>}
                                </div>
                                <div className="mb-3">
                                <label htmlFor="link" className="form-label">
                                  Enter Link for NewsLetter
                                </label>
                                <input
                                  type="text"
                                  id="link"
                                  name="previewLink"
                                  className="form-control"
                                  value={NewsLetter?.previewLink ?? NewsLetterData?.previewLink ?? ""}
                                  onChange={(e) => handleNewsLetterChange(e.target)}
                                  required
                                />
                              </div>
                                <div style={{display:"flex",justifyContent:"space-between"}}>
                                  <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={!isModified}
                                  >
                                    Update
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
                            {confirmationModal && (
                              <div className="modal">
                                <div className="modal-content">
                                  <h3>Are you sure you want to delete this item?</h3>
                                  <div className="modal-buttons">
                                    <button onClick={handleCancel} className="cancel-btn">
                                      Cancel
                                    </button>
                                    <button onClick={handleConfirm} className="confirm-btn">
                                      Confirm
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
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
