

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Col,
  Container,
  Row,
  Card,
  CardBody,
} from "reactstrap";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TableContainer from "../../Components/Common/TableContainer";
import axios from "axios";
import { api } from "../../config";

const DownloadedWhitepapers = () => {
  const userDetails = JSON.parse(sessionStorage.getItem("authUser")).data ?? null;
  const [whitepapers, setWhitepapers] = useState([])
  useEffect(() => {
    getDownloadedWhitepapers()
  }, [])
  const getDownloadedWhitepapers = async () => {
    const config = {
      headers: {
        'Authorization': `Bearer ${userDetails.jwtToken}`
      }
    };
    const data = await axios.get(`${api.API_URL}/api/user/view-all-downloaded?id=${userDetails.id}`, config)
    setWhitepapers(data.data.allDownloaded)
  }

  const columns = useMemo(
    () => [

      {
        header: "Sr No",
        accessorKey: "no",
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
        header: "Title",
        accessorKey: "title",
        enableColumnFilter: false,
      },
      {
        header: "Description",
        accessorKey: "description",
        enableColumnFilter: false,
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
                      <h4 className="card-title mb-0">Downloaded Whitepapers List</h4>
                    </div>
                    <TableContainer
                      columns={columns}
                      data={(whitepapers ?? [])}
                      isGlobalFilter={true}
                      isAddUserList={false}
                      customPageSize={10}
                      className="custom-header-css"
                      divClass="table-responsive table-card mb-2"
                      tableClass="align-middle table-nowrap"
                      theadClass="table-light"
                      SearchPlaceholder='Search for Saved Whitepapers...'
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

export default DownloadedWhitepapers;
