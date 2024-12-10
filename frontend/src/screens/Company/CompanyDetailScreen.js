import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Row, Col, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from "react-i18next"
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import { getCompanyDetails } from '../../actions/companyActions'

function CompanyDetailScreen() {
    const { t } = useTranslation()
    const { id } = useParams()
    const dispatch = useDispatch()

    const companyDetails = useSelector(state => state.companyDetails)
    const { loading, error, company } = companyDetails

    useEffect(() => {
        dispatch(getCompanyDetails(id))
    }, [dispatch, id])

    return (
        <div>
            <Link to='/companies' className='btn btn-light my-3'>
                {t('Common.Back')}
            </Link>

            {loading ? <Loader />
                : error ? <Message variant='danger'>{error}</Message>
                    : (
                        <Row>
                            <Col md={6}>
                                <Card>
                                    <Card.Body>
                                        <Card.Title>{t('Company Management.Company Details')}</Card.Title>
                                        <Card.Text>
                                            <strong>{t('Company Management.Company Name')}: </strong>
                                            {company.name}
                                        </Card.Text>
                                        <Card.Text>
                                            <strong>{t('Company Management.Number of Departments')}: </strong>
                                            {company.departments_count}
                                        </Card.Text>
                                        <Card.Text>
                                            <strong>{t('Company Management.Number of Employees')}: </strong>
                                            {company.employees_count}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    )}
        </div>
    )
}

export default CompanyDetailScreen
