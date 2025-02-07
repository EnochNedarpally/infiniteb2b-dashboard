

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
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
} from "reactstrap";
import TableContainer from "../../../Components/Common/TableContainer";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { api } from "../../../config";

const ReviewWhitepaper = () => {
    const token = JSON.parse(sessionStorage.getItem("authUser")).token ?? null;
    const navigate = useNavigate()
    const [modal, setModal] = useState(false);
    const [categories, setCategories] = useState([]);
    const [company, setCompany] = useState([]);
    const [status, setStatus] = useState("1");
    const [solutionId, setSolutionId] = useState("")


    const handleStatus = async () => {
        const API_ENDPOINT = status == "1" ? "approve-solutionset" : "reject-solutionset"
        const formData = new FormData();
        formData.append('solutionId', solutionId);
        try {
          const config = {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            }
          };
          await axios.put(`${api.API_URL}/admin/${API_ENDPOINT}`, formData, config)
          fetchWhitepapers()
          setModal(false)
        } catch (error) {
          toast.error(error)
        }
      }

    const toggle = useCallback(() => {
        if (modal) {
            setModal(false);
        } else {
            setModal(true);
        }
    }, [modal]);

    useEffect(() => {
        fetchWhitepapers()
    }, [])
    const fetchWhitepapers = async () => {
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        };
        try {
            const data = await axios.get(`${api.API_URL}/admin/get-allwhitepapers?value=2`, config)
            setCategories(data.data.whitepapers)
        } catch (error) {
            console.log("Whitepaper error", error)
        }


    }

    const validation = useFormik({
        enableReinitialize: true,

        initialValues: {
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
                            {cell.row.index + 1}
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
                header: "Published By",
                accessorKey: "publishedBy",
                enableColumnFilter: false,
            },
            {
                header: "Published Date",
                accessorKey: "publishedDate",
                enableColumnFilter: false,
                cell: ({ cell }) => {
                    const rawDate = cell.getValue(); // Get the raw date value
                    const formattedDate = rawDate.split("T")[0]; // Extract the date portion
                    return formatDate(formattedDate);
                },
            },

            {
                header: "Status",
                accessorKey: "solutionSet.status",
                enableColumnFilter: false,
            },

            {
                header: "Action",
                cell: (cell) => {
                    return (
                        <ul className="list-inline hstack gap-2 mb-0">

                            <li className="list-inline-item" title="View">
                                <Link to="/admin/view-whitepapers" state={cell.row.original}
                                >
                                    <i className="ri-eye-fill align-bottom text-muted"></i>
                                </Link>
                            </li>
                            <li className="list-inline-item" title="Edit">
                                <Link className="edit-item-btn" to="#"
                                    onClick={() => {setModal(true);setSolutionId(cell.row.original.solutionSet.id) }}
                                >
                                    <i className="ri-pencil-fill align-bottom text-muted"></i>
                                </Link>
                            </li>

                        </ul>
                    );
                },
            },
        ],
        []
    );


    document.title = "Infeedu";
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
                                            <h4 className="card-title mb-0">Review WhitePapers</h4>
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
                                            Edit Status
                                        </ModalHeader>
                                        <Form className="tablelist-form" onSubmit={(e) => {
                                            handleStatus()
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
                                                                onChange={(e) => setStatus(e.target.value)}
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
                                                    <Button onClick={handleStatus} style={{ backgroundColor: 'purple', borderColor: 'purple' }} type="submit" color="success" id="add-btn" >  Update</Button>
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

export default ReviewWhitepaper;
