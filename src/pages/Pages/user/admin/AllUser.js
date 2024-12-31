


import React, { useEffect, useState, useMemo, useCallback } from "react";


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


import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TableContainer from "../../../../Components/Common/TableContainer";
import axios from "axios";

const AllUser = () => {
  const token = JSON.parse(sessionStorage.getItem("authUser")) ? JSON.parse(sessionStorage.getItem("authUser")).token : null;
  const [userId, setUserId] = useState("")
  const [status, setStatus] = useState("1")
  const [modal, setModal] = useState(false)
  const [users, setUsers] = useState([]);
  
  const toggle = useCallback(() => {
      if (modal) {
        setModal(false);
      } else {
        setModal(true);
      }
    }, [modal]);

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

  const handleStatus = async()=>{
    const formData = new FormData();
      formData.append('id', userId);        // Append ID
      formData.append('value', status); 
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      };
      await axios.post("https://infiniteb2b.com:8443/update-user-status",formData  ,config)
      fetchUsers();
      setModal(false)
    } catch (error) {
      toast.error(error)
      console.log(error)
    }
  }


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
        accessorKey: "user.name",
        enableColumnFilter: false,
      },

      {
        header: "Total Download Count",
        accessorKey: "totalDownloadCount",
        enableColumnFilter: false,
      },

      {
        header: "Total Save Count",
        accessorKey: "totalSaveCount",
        enableColumnFilter: false,
      },
      {
        header: "Total View Count",
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
        header: "Total Category Subscribed Count",
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
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-primary btn-sm me-2"
                onClick={() => {
                  setModal(!modal)
                  setUserId(cell.row.original.user.id)
                  setStatus(cell.row.original.user.status == "ACTIVE" ? "1" : "2")
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
                                value={status}
                                onChange={(e)=>setStatus(e.target.value)}
                              >
                                <option value="1">
                                  Active
                                </option>
                                <option value="2">
                                  Inactive
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

export default AllUser;
