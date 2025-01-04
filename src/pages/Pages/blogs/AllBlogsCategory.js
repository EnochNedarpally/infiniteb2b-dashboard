

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

const AllBlogsCategory = () => {
  const token = JSON.parse(sessionStorage.getItem("authUser")) ? JSON.parse(sessionStorage.getItem("authUser")).token : null;

  const navigate = useNavigate();

  const handleAddCategory = () => {
    navigate('/add-blogs-category');
  };
  const [isEdit, setIsEdit] = useState(false)
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

  useEffect(() => {
    fetchCategories();
  }, [])
  const fetchCategories = async () => {

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    const data = await axios.get("https://infiniteb2b.com:8443/api/blogs/get-blogs-category", config)
    setCategories(data.data)

  }

  const handleInputChange = (e) => {
    const { name, value } = e
    setCategory({ ...category, [name]: value })
    setIsModified(true)
  }


  const handleCategoryClick = useCallback((arg) => {
    const company = arg;
    setCategoryData(company)
    setIsEdit(true);
    toggle();
  }, [toggle]);

  const [categories, setCategories] = useState([]);

  const handleSubmit = async (event) => {
    // event.preventDefault();
    // const formData = new FormData();
    // formData.append("id",categoryData.id)
    // Object.keys(category).map((key) => {
    //   if (key) {
    //     let value = category[key];
    //     if (value instanceof Blob) {
    //       formData.append(key, value);
    //     } else {
    //       value = typeof value === 'object' ? JSON.stringify(value) : value;
    //       formData.append(key, value);
    //     }
    //   }
    // });

    // setLoading(true);

    // try {
    //   const token = JSON.parse(sessionStorage.getItem("authUser")) ? JSON.parse(sessionStorage.getItem("authUser")).token : null;
    //   const response = await axios.post(
    //     'https://infiniteb2b.com:8443/api/category/update',
    //     formData,
    //     {
    //       headers: {
    //         'Content-Type': 'multipart/form-data',
    //         'Authorization': `Bearer ${token}`,
    //       },
    //     }
    //   );
    //   if (response.status) {

    //     setCategory({});
    //     setFeaturedImagePreview(null)
    //     setIsModified(false)
    //     toast.success("Category Updated")
    //     fetchCategories()
    //     toggle()

    //   }
    // } catch (err) {
    //   toast.error(err?.response?.data?.message ?? 'Error uploading file')
    //   console.log(err, "err")
    // } finally {
    //   setLoading(false);
    // }
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
        header: "Category Name",
        accessorKey: "blogCategoryName",
        enableColumnFilter: false,
      },
      {
        header: "Blogs Description",
        accessorKey: "blogCategoryDescp",
        enableColumnFilter: false,
      },
      {
        header: "Total no of Blogs",
        accessorKey: "totalDownloads",
        enableColumnFilter: false,
        cell: (cell) => {
          return (
            <div className="d-flex align-items-center">
            <div className="flex-shrink-0">
              {`${cell.row.original.blogs.length > 0 ? cell.row.original.blogs.length : 0}` } 
            </div>
          </div>
          )
        }
      },
      {
        header: "Action",
        cell: (cell) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">

              <li className="list-inline-item" title="View">
                <Link to="/admin/all-category"
                  onClick={() => { window.open(cell.row.original.url ?? "https://infiniteb2b.com/category", '_blank'); }}
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
    [handleCategoryClick]
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
                      <h4 className="card-title mb-0">Blogs Category List</h4>
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

export default AllBlogsCategory;
