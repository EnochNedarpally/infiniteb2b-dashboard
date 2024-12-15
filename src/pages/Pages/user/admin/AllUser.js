


import React, { useEffect, useState, useMemo } from "react";


import {
  Col,
  Container,
  Row,
  Card,
  CardBody,
} from "reactstrap";


import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TableContainer from "../../../../Components/Common/TableContainer";
import axios from "axios";

const AllUser = () => {
  const token = JSON.parse(sessionStorage.getItem("authUser")) ? JSON.parse(sessionStorage.getItem("authUser")).token : null;

  useEffect(() => {

    fetchUsers();

  }, [])
  const fetchUsers = async () => {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    const data = await axios.get("https://infiniteb2b.com:8443/admin/get-alluser", config)
    setUsers(data.data)

  }

  const [users, setUsers] = useState([]);

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
        header: "Name",
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
        header: "Job title",
        accessorKey: "jobTitle",
        enableColumnFilter: false,
      },
      {
        header: () => <div className="text-center">Action</div>, // Centered header
        accessorKey: "status", // Key for this column
        cell: (cell) => {
          return (
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-primary btn-sm me-2"
                onClick={() => {
                }}

              >
                Edit
              </button>
            </div>
          );
        },
        enableColumnFilter: false,
      }
    ],
    []
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
                      <h4 className="card-title mb-0">All Users List</h4>

                    </div>
                    <TableContainer
                      columns={columns}
                      data={(users ?? [])}
                      isGlobalFilter={true}
                      isAddUserList={false}
                      customPageSize={10}
                      className="custom-header-css"
                      divClass="table-responsive table-card mb-2"
                      tableClass="align-middle table-nowrap"
                      theadClass="table-light"
                      SearchPlaceholder='Search for Users ...'
                    />

                  </div>
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

export default AllUser;
