import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

function Footer() {
    const { t } = useTranslation()
    const currentYear = new Date().getFullYear()

    return (
        <footer>
            <Container>
                <Row>
                    <Col className="text-center py-3">
                        <p className="mb-0">
                            {t('Employee Management System')} &copy; {currentYear}
                        </p>
                        <p className="text-muted small mb-0">
                            {t('Version')} 1.0.0
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}

export default Footer
