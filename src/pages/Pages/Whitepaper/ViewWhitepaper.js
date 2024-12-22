import React from 'react'
import { useLocation } from 'react-router-dom';
import { Card, CardBody, Col, Row, Container, CardHeader } from 'reactstrap';
import { mediaBaseURL } from '../../../helpers/api_helper';


const ViewWhitepaper = () => {
    const whitepaper = useLocation()?.state
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardHeader className="card-header">
                                    <h4 className="card-title mb-0">View Whitepaper </h4>
                                </CardHeader>
                                <CardBody>
                                    <div className="mb-3">
                                        <label htmlFor="title" className="form-label">
                                            Whitepaper Name
                                        </label>
                                        <input
                                            type="text"
                                            id="title"
                                            className="form-control"
                                            value={whitepaper.solutionSet?.title}
                                            disabled={true}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="desc" className="form-label">
                                            Whitepaper Description:
                                        </label>
                                        <textarea
                                            id="desc"
                                            className="form-control"
                                            value={whitepaper.solutionSet?.description}
                                            disabled={true}
                                        />
                                    </div>
                                    <label htmlFor="title" className="form-label">
                                        Selected Category:
                                    </label>
                                    <span className="form-label mx-2 mt-2">
                                        {whitepaper?.categoryName}
                                    </span>
                                    <div className="mb-3">
                                        <label htmlFor="image" className="form-label">
                                            PDF Preview:
                                        </label>
                                        <div style={{ width: "400px", height: '500px' }}>
                                            <embed style={{ width: '100%', height: '100%' }} src={mediaBaseURL + whitepaper.solutionSet?.filePath} />
                                        </div>
                                        <div className="mt-4">
                                            <p className='form-label'>
                                                Featured Image {whitepaper?.image?.name}
                                            </p>
                                            <img src={mediaBaseURL + whitepaper.solutionSet?.imagePath} alt="Whitepaper preview"
                                                style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '10px' }} />
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default ViewWhitepaper