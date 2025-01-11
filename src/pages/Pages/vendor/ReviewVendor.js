

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Col,
  Container,
  Row,
  Card,
  CardHeader,
  CardBody,
  ModalBody,
  Label,
  Input,
  Modal,
  ModalHeader,
  Form,
  ModalFooter,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  FormFeedback,
  Alert
} from "reactstrap";

import { isEmpty } from "lodash";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

// Export Modal
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createSelector } from "reselect";
import TableContainer from "../../../Components/Common/TableContainer";
// import TableContainer from "../../Components/Common/TableContainer";
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";
import Loader from "../../../Components/Common/Loader";
import DeleteModal from "../../../Components/Common/DeleteModal";
import axios from "axios";

const ReviewVendor = () => {

  const token = JSON.parse(sessionStorage.getItem("authUser")) ? JSON.parse(sessionStorage.getItem("authUser")).token : null;
  const navigate = useNavigate()
  const [isEdit, setIsEdit] = useState(false);
  const [company, setCompany] = useState([]);

  //delete Company
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);
  const [modal, setModal] = useState(false);
  const [status, setStatus] = useState("1");
  const [vendorId, setVendorId] = useState("")

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
      setCompany(null);
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
    fetchCategories() 
  },[modal])
  const fetchCategories=async()=>{
    
    // const token ="eyJhbGciOiJIUzUxMiJ9.eyJyb2xlcyI6WyJTVVBFUkFETUlOIl0sInN1YiI6InN1cGVyYWRtaW5AZGVtYW5kYXkuaW5mbyIsImlhdCI6MTczMjg3MDQzMywiZXhwIjoxNzMzMjMwNDMzfQ.ne7d9Mseaabh-uNJEx7GOaa1Vd7G8JTLF8M45ZkDGKNm5N9u6IMSMMHvz5EdhYEJxljd1qCFjoXtUM42rlHmGQ"
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    // const data = await axios.get("https://infiniteb2b.com:8443/api/category",config)
    const data = await axios.get("https://infiniteb2b.com:8443/admin/get-reviewvendor",config)
    setCategories(data.data)
    
  }
  // console.log("category",categories)


  // validation
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

  // Node API 
  // useEffect(() => {


  //   if (isCompaniesCreated) {
  //     setCompany(null);
  //     dispatch(onGetCompanies());
  //   }
  // }, [
  //   dispatch,
  //   isCompaniesCreated,
  // ]);
  const handleStatus = async () => {
    const API_ENDPOINT = status == "1" ? "approve-vendor" : "reject-vendor"
    const formData = new FormData();
    formData.append('vendorId', vendorId);
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      };
      await axios.put(`https://infiniteb2b.com:8443/admin/${API_ENDPOINT}`, formData, config)
      // const data = await axios.get("https://infiniteb2b.com:8443/admin/get-reviewvendor",config)
      setModal(false)
    } catch (error) {
      console.log(error)
      toast.error(error)
    }
  }

  // Checked All
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
  const [categories, setCategories] = useState([]);

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

  
  // Column
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
        header: "Vendor Name",
        accessorKey: "name",
        enableColumnFilter: false,
      },




      
      {
        header: "Phone No.",
        accessorKey: "phone",
        enableColumnFilter: false,
      },
      
      {
        header: "Email Address",
        accessorKey: "email",
        enableColumnFilter: false,
      },
      {
        header: "Country",
        accessorKey: "country",
        enableColumnFilter: false,
      },
      {
        header: "Company",
        accessorKey: "companyName",
        enableColumnFilter: false,
      },
      {
        header: "Designation",
        accessorKey: "designation",
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
        <li className="list-inline-item" title="View">
            <Link  to={{ pathname: "/admin/review-vendor/view", state: { data:"Vendor Data" } }}
              // onClick={() => {console.log("clicked"); navigate("/admin/review-vendor/view") }}
            >
              <i className="ri-eye-fill align-bottom text-muted"></i>
            </Link>
        </li>
        <li className="list-inline-item" title="Edit">
          <Link className="edit-item-btn" to="#"
            // onClick={() => { const companyData = cell.row.original; handleCompanyClick(companyData); }}
            onClick={() => {
              setModal(!modal)
              setVendorId(cell.row.original.id)
            }}
          >
            <i className="ri-pencil-fill align-bottom text-muted"></i>
          </Link>
        </li>
     
      </ul>
    );
  },
},
    ],
    [handleCompanyClick, checkedAll]
  );

  // SideBar Company Deatail
  const [info, setInfo] = useState([]);

  // Export Modal
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
          {/* <BreadCrumb title="Companies" pageTitle="CRM" /> */}

          <Row>
         
            <Col xxl={12}>
              <Card 
              // id="companyList"
              >

                <CardBody className="pt-0 ">
                  <div className="flex-grow-1 ">
                    {/* <div className="my-2 mx-1">
                 
                        <h4 className="card-title mb-0">WhitePapers-set Category List</h4>
                        <Button color="secondary" onClick={() => handleTeamClicks()}>
                        <i className="ri-add-fill me-1 align-bottom"></i> Add</Button>

                    </div> */}
                    <div className="d-flex justify-content-between align-items-center my-2 mx-1">
  <h4 className="card-title mb-0">Review Vendor List</h4>


</div>




              
                    {/* {isCompaniesSuccess && companies.length ? ( */}
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
                        
                        // handleCompanyClick={handleCompanyClicks}
                        // isCompaniesFilter={true}
                        SearchPlaceholder='Search for Vendor...'
                      />
                    {/* ) : (<Loader error={error} />)
                    } */}
                  </div>
                  {<Modal id="showModal" isOpen={modal} toggle={toggle} centered fullscreen>
                    <ModalHeader className="bg-info-subtle p-3" toggle={toggle}>
                      {/* {!!isEdit ? "Edit Company" : "Add Company"} */}
                      Edit Status
                    </ModalHeader>
                    <Form className="tablelist-form" onSubmit={(e) => {
                      e.preventDefault();
                      return false;
                    }}>
                      <ModalBody>
                        <input type="hidden" id="id-field" />
                        <Row className="g-3">


                          <Col lg={6}>
                            <div>
                              <Label
                                htmlFor="owner-field"
                                className="form-label"
                              >
                              Status
                              </Label>
                              <Input
                                bsSize="lg"
                                className="mb-3"
                                type="select"
                                onChange={(e)=>setStatus(e.target.value)}
                              >
                                <option value="1">
                                  Approve
                                </option>
                                <option value="2">
                                  Reject
                                </option>
                              </Input>
                            </div>
                          </Col> 
                       
                          
                        </Row>
                      </ModalBody>
                      <ModalFooter>
                        <div className="hstack gap-2 justify-content-end bg-info-subtle">
                          <Button color="light" onClick={() => { setModal(false); }} > Close </Button>
                          

                          <Button onClick={()=>{handleStatus()}}  style={{ backgroundColor: 'purple', borderColor: 'purple' }}  type="submit" color="success" id="add-btn" >  Update</Button>
                        </div>
                      </ModalFooter>
                    </Form>
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

export default ReviewVendor;

