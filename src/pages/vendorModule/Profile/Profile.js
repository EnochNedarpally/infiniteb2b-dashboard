import React, { useEffect, useState } from 'react'
import { Card, CardBody, Col, Container, Row } from 'reactstrap'
import EditProfile from './EditProfile'
import axios from 'axios'
import { api } from '../../../config'

const VendorProfile = () => {
  const [vendor, setVendor] = useState({})
  const vendorData = JSON.parse(sessionStorage.getItem("authUser")) ?? null;

  useEffect(() => {
    fetchVendor()
  }, [])

  const fetchVendor = async () => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${vendorData.token}`
      }
    };
    const data = await axios.get(`${api.API_URL}/api/vendor/by-id/${vendorData.data._id}`, config)
    setVendor(data.data)

  }
  return (
    <React.Fragment>
      <div>
        <Container fluid>
          <Row>
            <Col xxl={12}>
              <Card
              >
                <CardBody className="pt-0 ">
                  <EditProfile isEdit={true} vendorDetail={vendor} />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default VendorProfile
