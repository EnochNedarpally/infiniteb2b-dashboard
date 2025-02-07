import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap'
import TableContainer from '../../../Components/Common/TableContainer';
import { Link, useNavigate } from 'react-router-dom';
import { downloadReport } from '../../../helpers/api_utils';
import { api } from '../../../config';

const NewsletterReports = () => {
  const token = JSON.parse(sessionStorage.getItem("authUser")).token ?? null;
  const [reports, setReports] = useState();

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
        header: "Newsletter Name",
        accessorKey: "newsLetterName",
        enableColumnFilter: false,
      },
      {
        header: "Uploaded By",
        accessorKey: "uploadedBy",
        enableColumnFilter: false,
      },
      {
        header: "Uploaded Date",
        accessorKey: "uploadDate",
        enableColumnFilter: false,
      },

      {
        header: "Total Downloads",
        accessorKey: "totalDownload",
        enableColumnFilter: false,
      },
      {
        header: "Total Saved",
        accessorKey: "totalSave",
        enableColumnFilter: false,
      },
      {
        header: "Total Views",
        accessorKey: "totalViews",
        enableColumnFilter: false,
      },
    ],
    []
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
      const data = await axios.get(`${api.API_URL}/admin/newsletter-report`, config)
      setReports(data.newsLetters)
    } catch (error) {
      toast.error("Unable to fetch reports")
      console.log("error", error)
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
                  <h6 className="card-title p-0 mb-2">Newsletter Report</h6>
                </CardHeader>
                <TableContainer
                  columns={columns}
                  data={(reports ?? [])}
                  isGlobalFilter={true}
                  isAddUserList={false}
                  customPageSize={10}
                  className="custom-header-css"
                  divClass="table-responsive table-card mb-2"
                  tableClass="align-middle table-nowrap"
                  theadClass="table-light"
                  SearchPlaceholder='Search for Newsletter...'
                  isExport={true}
                  downloadReport={() => downloadReport(token, `${api.API_URL}/admin/newsletter-download-csv`, "newsletter.csv")}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default NewsletterReports