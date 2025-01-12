import React, { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Card, CardBody, CardFooter, CardHeader, Col, Container, Row } from 'reactstrap'
import TableContainer from '../../../../Components/Common/TableContainer'
import { toast, ToastContainer } from 'react-toastify'
import axios from 'axios'

const ViewUser = () => {
    const token = JSON.parse(sessionStorage.getItem("authUser")).token ?? null;
    const [savedWhitepaper, setSavedWhitepaper] = useState([]);
    const [downdloadedWhitepaper, setDowndloadedWhitepaper] = useState([]);
    const [ViewedWhitepaper, setViewedWhitepaper] = useState([]);
    const userDetail = useLocation().state?.user
    const users = []

    useEffect(() => {
        fetchUserData()
    }, [userDetail])

    const fetchUserData = async () => {
        const formData = new FormData();
        formData.append('id', userDetail.id);
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        };

        try {
            const response1 = axios.get('https://infiniteb2b.com:8443/api/user/view-all-saved', formData, config);
            const response2 = axios.get('https://infiniteb2b.com:8443/api/user/view-all-downloaded', formData, config);
            const response3 = axios.get('https://infiniteb2b.com:8443/api/user/view-all-viewed', formData, config);

            const results = await Promise.all([response1, response2, response3]);

            setSavedWhitepaper(results[0].data);
            setDowndloadedWhitepaper(results[1].data);
            setViewedWhitepaper(results[2].data);
        } catch (err) {
            toast.error("Something went wrong, Please try again later...")
        }
    }

    const savedColumns = useMemo(
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
                header: "Name",
                accessorKey: "user.name",
                enableColumnFilter: false,
            },

            {
                header: "Download Count",
                accessorKey: "totalDownloadCount",
                enableColumnFilter: false,
            },

            {
                header: "Save Count",
                accessorKey: "totalSaveCount",
                enableColumnFilter: false,
            },
            {
                header: "View Count",
                accessorKey: "totalViewCount",
                enableColumnFilter: false,
            },
            {
                header: "News Letters Subscribed",
                accessorKey: "newsLetterSubscribed",
                enableColumnFilter: false,
                cell: (cell) => {
                    return (
                        <div className="d-flex justify-content-center">
                            {cell.row.original.newsLetterSubscribed == "0" ? "No" : "Yes"}
                        </div>
                    );
                },
            },
            {
                header: "Category Subscribed Count",
                accessorKey: "totalCategorySubscribedCount",
                enableColumnFilter: false,
            },
            {
                header: "Status",
                accessorKey: "user.status",
                enableColumnFilter: false,
                cell: (cell) => {
                    return (
                        <div className="d-flex justify-content-center">
                            {cell.row.original.user.status ?? "Hold"}
                        </div>
                    );
                },
            },
            {
                header: () => <div className="text-center">Action</div>, // Centered header
                accessorKey: "status", // Key for this column
                cell: (cell) => {
                    return (
                        <div className="d-flex justify-content-center align-items-center ">
                            <div className="list-inline-item " title="View">
                                <p
                                    className="cursor-pointer"
                                    //  to={{ pathname: "/admin/review-vendor/view", states:data}}
                                    onClick={() => { navigate("/admin/user-viewUser", { state: { user: cell.row.original.user } }) }}
                                >
                                    <i className="ri-eye-fill align-bottom text-muted"></i>
                                </p>
                            </div>
                            <div className="list-inline-item" title="Edit"
                                onClick={() => {
                                    setModal(!modal)
                                    setUserId(cell.row.original.user.id)
                                    setStatus(cell.row.original.user.status == "ACTIVE" ? "1" : "2")
                                }}

                            >
                                <i className="ri-pencil-fill align-bottom text-muted"></i>
                            </div>
                        </div>
                    );
                },
                enableColumnFilter: false,
            }
        ],
        []
    );
    return (
        <>
            <div className="page-content">
                <Container fluid>
                    <ToastContainer />
                    <Row>
                        <Col xxl={12}>
                            <Card
                            >

                                <CardBody className="mt-2 ">
                                    <CardHeader>
                                        <h6 className="card-title mb-0">Saved Whitepapers</h6>
                                    </CardHeader>
                                    <TableContainer
                                        columns={savedColumns}
                                        data={(users ?? [])}
                                        isGlobalFilter={false}
                                        isAddUserList={false}
                                        customPageSize={10}
                                        className="custom-header-css"
                                        divClass="table-responsive table-card mb-2"
                                        tableClass="align-middle table-nowrap"
                                        theadClass="table-light" />
                                    <CardFooter />
                                </CardBody>
                            </Card>
                            <Card>
                                <CardBody>
                                    <CardHeader>
                                        <h6 className="card-title mb-0">Downloaded Whitepapers</h6>
                                    </CardHeader>
                                    <TableContainer columns={savedColumns}
                                        data={(users ?? [])}
                                        isGlobalFilter={false}
                                        isAddUserList={false}
                                        customPageSize={10}
                                        className="custom-header-css"
                                        divClass="table-responsive table-card mb-2"
                                        tableClass="align-middle table-nowrap"
                                        theadClass="table-light" />
                                    <CardFooter />
                                </CardBody>
                            </Card>
                            <Card>
                                <CardBody>
                                    <CardHeader>
                                        <h6 className="card-title mb-0">Viewed Whitepapers</h6>
                                    </CardHeader>
                                    <TableContainer columns={savedColumns}
                                        data={(users ?? [])}
                                        isGlobalFilter={false}
                                        isAddUserList={false}
                                        customPageSize={10}
                                        className="custom-header-css"
                                        divClass="table-responsive table-card mb-2"
                                        tableClass="align-middle table-nowrap"
                                        theadClass="table-light" />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}

export default ViewUser