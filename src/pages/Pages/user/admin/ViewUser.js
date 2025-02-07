import React, { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Card, CardBody, CardFooter, CardHeader, Col, Container, Row } from 'reactstrap'
import TableContainer from '../../../../Components/Common/TableContainer'
import { toast, ToastContainer } from 'react-toastify'
import axios from 'axios'
import { api } from '../../../../config'

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
            const response = await axios.get(`${api.API_URL}/view-all-downloaded-by-userid?id=${userDetail?.id}`, formData, config);
            setSavedWhitepaper(response.data.allSaved);
            setDowndloadedWhitepaper(response?.data.allDownloaded);
            setViewedWhitepaper(response?.data.allViewed);
        } catch (err) {
            toast.error("Something went wrong, Please try again later...",err)
        }
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
                header: "Title",
                accessorKey: "title",
                enableColumnFilter: false,
            },

            {
                header: "description",
                accessorKey: "description",
                enableColumnFilter: false,
            },
        ],
        [savedWhitepaper,downdloadedWhitepaper,ViewedWhitepaper]
    );
    return (
        <>
            <div className="page-content">
                <Container fluid>
                    <ToastContainer />
                    <Row>
                        <Col xxl={12}>
                        <Card>
                                <CardBody>
                                    <CardHeader>
                                        <h6 className="card-title p-0 mb-2">Viewed Whitepapers</h6>
                                    </CardHeader>
                                    <TableContainer columns={columns}
                                        data={(ViewedWhitepaper ?? [])}
                                        isGlobalFilter={false}
                                        isAddUserList={false}
                                        customPageSize={10}
                                        className="custom-header-css"
                                        divClass="table-responsive table-card mb-2"
                                        tableClass="align-middle table-nowrap"
                                        theadClass="table-light" />
                                </CardBody>
                            </Card>
                            <Card
                            >
                                <CardBody className="mt-2 ">
                                    <CardHeader>
                                        <h6 className="card-title p-0 mb-2">Saved Whitepapers</h6>
                                    </CardHeader>
                                    <TableContainer
                                        columns={columns}
                                        data={(savedWhitepaper ?? [])}
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
                                        <h6 className="card-title p-0 mb-2">Downloaded Whitepapers</h6>
                                    </CardHeader>
                                    <TableContainer columns={columns}
                                        data={(downdloadedWhitepaper ?? [])}
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
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}

export default ViewUser