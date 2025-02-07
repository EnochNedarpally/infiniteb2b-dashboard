

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

import ExportCSVModal from "../../../Components/Common/ExportCSVModal";
import DeleteModal from "../../../Components/Common/DeleteModal";
import axios from "axios";
import { api } from "../../../config";

const AllCategory = () => {

  const Navigate =useNavigate();

  const handleAddCategory = () => {
    Navigate('/admin/add-category'); 
  };
  const [isEdit, setIsEdit] = useState(false);
  const [company, setCompany] = useState([]);

  //delete Company
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);
  const [modal, setModal] = useState(false);
  const [isModified, setIsModified] = useState(false);
    const [category, setCategory] = useState({});
    const [categoryData, setCategoryData] = useState({
        name: "",
        whitePaperCount: "",
        id: 0,
        iconPath: "",
        isSubscribe: 0,
        bannerPath: "",
        url: "",
        descp: ""
    });
    const [featuredImagePreview, setFeaturedImagePreview] = useState(null); 
    const [loading, setLoading] = useState(false);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setCompany(null);
      setCategory({})
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
    fetchCategories(); 
  },[])
  const fetchCategories=async()=>{
    const token = JSON.parse(sessionStorage.getItem("authUser")) ? JSON.parse(sessionStorage.getItem("authUser")).token : null;
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    const data = await axios.get(`${api.API_URL}/api/category/dashboard-admin`,config)
    setCategories(data.data)
    
  }

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

  const handleInputChange = (e)=>{
    const {name,value}=e
    setCategory({...category,[name]:value})
    setIsModified(true)
  }
  const handleBannerImageChange = (files) => {
    if (files && files[0]) {
      setCategory({...category,["banner"]:files[0]})
      setIsModified(true)
    }
  };

  const handleFeaturedImageChange = (files) => {
    if (files && files[0]) {
      setCategory({...category,["icon"]:files[0]})
      setFeaturedImagePreview(URL.createObjectURL(files[0]))
      setIsModified(true)
    }
  };
  // Update Data
  const handleCategoryClick = useCallback((arg) => {
    const company = arg;
    setCategoryData(company)
    setCompany({
      _id: company._id,
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
  const [isExportCSV, setIsExportCSV] = useState(false);


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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("id",categoryData.id)
    Object.keys(category).map((key) => {
      if (key) {
        let value = category[key];
        if (value instanceof Blob) {
          formData.append(key, value);
        } else {
          value = typeof value === 'object' ? JSON.stringify(value) : value;
          formData.append(key, value);
        }
      }
    });

    setLoading(true);
  
    try {
      const token = JSON.parse(sessionStorage.getItem("authUser")) ? JSON.parse(sessionStorage.getItem("authUser")).token : null;
      const response = await axios.post(
        `${api.API_URL}/api/category/update`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (response.status) {
        
        setCategory({});
        setFeaturedImagePreview(null)
        setIsModified(false)
        toast.success("Category Updated")
        fetchCategories()
        toggle()
        
      }
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Error uploading file')
      console.log(err, "err")
    } finally {
      setLoading(false);
    }
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
              {cell.row.index + 1} {/* This will display row numbers starting from 1 */}
            </div>
          </div>
        )
        
      },
      {
        header: "Category Name",
        accessorKey: "name",
        enableColumnFilter: false,
      }, 
      {
        header: "No. of WhitePapers",
        accessorKey: "totalWhitePapers",
        enableColumnFilter: false,
      },
      
      {
        header: "Total Subscibers",
        accessorKey: "totalSubscribers",
        enableColumnFilter: false,
      },
      {
        header: "Total Downloads",
        accessorKey: "totalDownloads",
        enableColumnFilter: false,
      },
      {
        header: "Action",
        cell: (cell) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
           
              <li className="list-inline-item" title="View">
                <Link to="/admin/all-category" 
                  onClick={() => { window.open(cell.row.original.url ?? "https://infeedu.com/category", '_blank'); }}
                >
                  <i className="ri-eye-fill align-bottom text-muted"></i>
                </Link>
              </li>
              <li className="list-inline-item" title="Edit">
                <Link className="edit-item-btn" to="#"
                  onClick={() => { const companyData = cell.row.original; handleCategoryClick(companyData); }}
                >
                  <i className="ri-pencil-fill align-bottom text-muted"></i>
                </Link>
              </li>
           
            </ul>
          );
        },
      },
    ],
    [handleCategoryClick, checkedAll]
  );

  document.title = "Infeedu";
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
  <h4 className="card-title mb-0">WhitePapers-set Category List</h4>
  <Button 
  color="secondary" 
  style={{ backgroundColor: 'purple', borderColor: 'purple' }} 
  onClick={handleAddCategory}

>
  <i className="ri-add-fill me-1 align-bottom"></i> Add Category
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
                        SearchPlaceholder='Search for WhitePapers-set Category...'
                      />
              
                  </div>
                  {<Modal id="showModal" isOpen={modal} toggle={toggle} centered fullscreen>
                    <ModalHeader className="bg-info-subtle p-3" toggle={toggle}>
                      Update Category
                    </ModalHeader>
                     <Container fluid>
                              <ToastContainer closeButton={false} limit={1} />
                              <Row>
                                <Col lg={12}>
                                  <Card>
                                    <CardHeader className="card-header m-0">
                                    </CardHeader>
                                    <CardBody className='m-0'>
                                      <form onSubmit={handleSubmit}>
                                        <div className="mb-4">
                                          <label htmlFor="title" className="form-label">
                                            Category Name
                                          </label>
                                          <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            className="form-control"
                                            value={category?.name ?? categoryData?.name}
                                            onChange={(e) => handleInputChange(e.target)}
                                            required
                                          />
                                        </div>
                    
                                        <div className="mb-4">
                                          <label htmlFor="desc" className="form-label">
                                            Category Description
                                          </label>
                                          <textarea
                                            id="desc"
                                            name="desc"
                                            className="form-control"
                                            value={category?.desc ?? categoryData.descp}
                                            onChange={(e) => handleInputChange(e.target)}
                                          
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
                                          {(category?.bannerPath || categoryData.bannerPath) && (
                                            <div className="mt-2">
                                              <p>
                                                <strong>Selected Banner Image:</strong> {category?.bannerPath?.name || category.bannerPath ||  categoryData.bannerPath?.name || categoryData.bannerPath}
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
                                          />
                                          <p className="text-muted mt-1">
                                            Please upload an image having size (400x500)
                                          </p>
                                          {(category?.iconPath || categoryData.iconPath) && (
                                            <div className="mt-2">
                                              <p>
                                                <strong>Selected Featured Image:</strong> {category?.iconPath?.name || category?.iconPath || categoryData.iconPath}
                                              </p>
                                      {featuredImagePreview && <div className="mt-2">
                                        <img
                                          src={featuredImagePreview}
                                          alt="Preview"
                                          style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '10px' }}
                                        />
                                      </div>}
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

export default AllCategory;
