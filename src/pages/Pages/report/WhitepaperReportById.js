import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap'
import TableContainer from '../../../Components/Common/TableContainer';
import { useNavigate, useParams } from 'react-router-dom';
import { downloadReport } from '../../../helpers/api_utils';

const WhitepaperReportById = () => {
  const token = JSON.parse(sessionStorage.getItem("authUser")).token ?? null;
  const [reports, setReports] = useState();

  const id = useParams()?.id

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
        header: "Whitepaper Name",
        accessorKey: "whitePaperName",
        enableColumnFilter: false,
        cell: ({ cell }) => {
          return reports?.whitePaperName;
        },
      },
      {
        header: "Category Name",
        accessorKey: "categoryName",
        enableColumnFilter: false,
        cell: ({ cell }) => {
          return reports?.categoryName;
        },
      },

      {
        header: "User Name",
        accessorKey: "userName",
        enableColumnFilter: false,
      },
      {
        header: "Company",
        accessorKey: "userCompany",
        enableColumnFilter: false,
      },
      {
        header: "Designation",
        accessorKey: "userDesignation",
        enableColumnFilter: false,
      },
      {
        header: "Email",
        accessorKey: "userEmail",
        enableColumnFilter: false,
      },
      {
        header: "Country",
        accessorKey: "userCountry",
        enableColumnFilter: false,
      },
      {
        header: "Saved Date",
        accessorKey: "savedAt",
        enableColumnFilter: false,
      },
      {
        header: "Save",
        accessorKey: "save",
        enableColumnFilter: false,
      },
      {
        header: "View",
        accessorKey: "view",
        enableColumnFilter: false,
      },
      {
        header: "Download",
        accessorKey: "download",
        enableColumnFilter: false,
      },
      {
        header: "User Ip",
        accessorKey: "userIp",
        enableColumnFilter: false,
      },
    ],
    [reports]
  );

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    try {
      const data = await axios.get(`https://infiniteb2b.com:8443/admin/whitepaper-by-id-download-report?id=${id}`, config)
      setReports(data)
    } catch (error) {
      toast.error("Unable to fetch reports")
      console.log("Whitepaper error", error)
    }
  }


  return (
    <div className="page-content">
      <Container fluid>
        <ToastContainer />
        <Row>
          <Col xxl={12}>
            <Card>
              <CardBody>
                <CardHeader>
                  <h6 className="card-title p-0 mb-2">Whitepaper Report By User</h6>
                </CardHeader>
                <TableContainer
                  columns={columns}
                  data={(reports?.userData ?? [])}
                  isGlobalFilter={true}
                  isAddUserList={false}
                  customPageSize={10}
                  className="custom-header-css"
                  divClass="table-responsive table-card mb-2"
                  tableClass="align-middle table-nowrap"
                  theadClass="table-light"
                  SearchPlaceholder='Search for Whitepaper...'
                  isExport={true}
                  downloadReport={() => downloadReport(token, `https://infiniteb2b.com:8443/admin/whitepaper-by-id-download-csv?id=${id}`, "whitepaperById.csv", id)}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default WhitepaperReportById