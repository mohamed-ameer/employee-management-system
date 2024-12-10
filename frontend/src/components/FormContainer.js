import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

function FormContainer({ children, className = '' }) {
    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col xs={12} md={8} lg={6} className={`bg-white p-4 rounded shadow-sm ${className}`}>
                    {children}
                </Col>
            </Row>
        </Container>
    )
}

export default FormContainer