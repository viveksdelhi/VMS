import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import NotificationsIcon from '@mui/icons-material/Notifications';

function AlertDashboard() {
    return (
        <Row className="justify-content-center bg-dark text-light">
            <Col xs={12} md={4} className="mb-3">
                <Card className="bg-secondary text-light">
                    <Card.Body>
                        <Card.Title>Response Time <span>| Today</span></Card.Title>
                        <div className="d-flex align-items-center">
                            <div className="card-icon rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', backgroundColor: '#343a40' }}>
                                <NotificationsIcon style={{ color: '#ffc107' }} />
                            </div>
                            <div className="ps-3 text-div" style={{ textAlign: 'center' }}>
                                <h6 className="text-danger">11</h6>
                                <span className="pt-2 ps-1 text-danger">Alerts</span>
                            </div>

                            <div className="ps-3 text-div" style={{ textAlign: 'center' }}>
                                <span className="small pt-2 ps-1 text-primary div-text">Level 1</span>
                            </div>
                            <div className="ps-3 text-div" style={{ textAlign: 'center' }}>
                                <span className="text-warning small pt-1">7</span>
                                <span className="text-warning small pt-2 ps-1">Level 2</span>
                            </div>
                            <div className="ps-3 text-div" style={{ textAlign: 'center' }}>
                                <span className="text-danger small pt-1">3</span>
                                <span className="text-danger small pt-2 ps-1">Level 3</span>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Col>

            <Col xs={12} md={4} className="mb-3">
                <Card className="bg-secondary text-light">
                    <Card.Body>
                        <Card.Title>Alerts <span>| Today</span></Card.Title>
                        <div className="d-flex align-items-center">
                            <div className="card-icon rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', backgroundColor: '#343a40' }}>
                                <NotificationsIcon style={{ color: '#ffc107' }} />
                            </div>
                            <div className="ps-3 text-div" style={{ textAlign: 'center' }}>
                                <h6 className="text-danger">11</h6>
                                <span className="pt-2 ps-1 text-danger">Alerts</span>
                            </div>

                            <div className="ps-3 text-div" style={{ textAlign: 'center' }}>
                                <span className="small pt-2 ps-1 text-primary div-text">Basic</span>
                            </div>
                            <div className="ps-3 text-div" style={{ textAlign: 'center' }}>
                                <span className="text-warning small pt-1">7</span>
                                <span className="text-warning small pt-2 ps-1">Critical</span>
                            </div>
                            <div className="ps-3 text-div" style={{ textAlign: 'center' }}>
                                <span className="text-danger small pt-1">3</span>
                                <span className="text-danger small pt-2 ps-1">Severe</span>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Col>

            <Col xs={12} md={4} className="mb-3">
                <Card className="bg-secondary text-light">
                    <Card.Body>
                        <Card.Title>Action <span>| Today</span></Card.Title>
                        <div className="d-flex align-items-center">
                            <div className="card-icon rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', backgroundColor: '#343a40' }}>
                                <NotificationsIcon style={{ color: '#ffc107' }} />
                            </div>
                            <div className="ps-3 text-div" style={{ textAlign: 'center' }}>
                                <h6 className="text-danger">11</h6>
                                <span className="pt-2 ps-1 text-danger">Alerts</span>
                            </div>

                            <div className="ps-3 text-div" style={{ textAlign: 'center' }}>
                                <span className="small pt-2 ps-1 text-primary div-text">Basic</span>
                            </div>
                            <div className="ps-3 text-div" style={{ textAlign: 'center' }}>
                                <span className="text-warning small pt-1">7</span>
                                <span className="text-warning small pt-2 ps-1">Critical</span>
                            </div>
                            <div className="ps-3 text-div" style={{ textAlign: 'center' }}>
                                <span className="text-danger small pt-1">3</span>
                                <span className="text-danger small pt-2 ps-1">Severe</span>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}

export default AlertDashboard;
