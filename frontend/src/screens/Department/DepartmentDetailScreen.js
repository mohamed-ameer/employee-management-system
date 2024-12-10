import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Row, Col, ListGroup, Card, Button, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from "react-i18next"
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import { getDepartmentDetails } from '../../actions/departmentActions'

function DepartmentDetailScreen() {
    const { id } = useParams()
    const [t, i18n] = useTranslation()
    const dispatch = useDispatch()

    const departmentDetails = useSelector(state => state.departmentDetails)
    const { loading, error, department } = departmentDetails

    useEffect(() => {
        dispatch(getDepartmentDetails(id))
    }, [dispatch, id])

    return (
        <div style={i18n.language === 'ar' ? {direction: 'rtl'} : {direction: 'ltr'}}>
            <Link to='/departments' className='btn btn-light my-3'>
                {t('Go Back')}
            </Link>
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : (
                <Row>
                    <Col md={8}>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h3>{department.name}</h3>
                                <p className="mb-0">
                                    <strong>{t('Company')}:</strong>{' '}
                                    <Link to={`/company/${department.company?.id}`}>
                                        {department.company?.name}
                                    </Link>
                                </p>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>{t('Manager')}:</strong>{' '}
                                {department.manager ? (
                                    <Link to={`/employee/${department.manager.id}`}>
                                        {department.manager.name}
                                    </Link>
                                ) : (
                                    t('No Manager Assigned')
                                )}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>{t('Description')}:</strong>{' '}
                                {department.description || t('No description available')}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>{t('Status')}:</strong>{' '}
                                <span className={`badge ${department.is_active ? 'bg-success' : 'bg-danger'}`}>
                                    {department.is_active ? t('Active') : t('Inactive')}
                                </span>
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>

                    <Col md={4}>
                        <Card>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>{t('Total Employees')}:</Col>
                                        <Col>
                                            <strong>{department.employees?.length || 0}</strong>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Button
                                        className='btn-block'
                                        type='button'
                                        as={Link}
                                        to={`/department/${department.id}/edit`}>
                                        {t('Edit Department')}
                                    </Button>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>

                    {/* Employees Section */}
                    <Col md={12} className="mt-4">
                        <Card>
                            <Card.Header>
                                <h4 className="mb-0">{t('Department Employees')}</h4>
                            </Card.Header>
                            <Card.Body>
                                {department.employees?.length === 0 ? (
                                    <Message variant='info'>
                                        {t('No employees in this department')}
                                    </Message>
                                ) : (
                                    <Table striped bordered hover responsive className='table-sm'>
                                        <thead>
                                            <tr>
                                                <th>{t('Name')}</th>
                                                <th>{t('Position')}</th>
                                                <th>{t('Status')}</th>
                                                <th>{t('Join Date')}</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {department.employees?.map(employee => (
                                                <tr key={employee.id}>
                                                    <td>{employee.name}</td>
                                                    <td>{employee.position}</td>
                                                    <td>
                                                        <span className={`badge ${employee.is_active ? 'bg-success' : 'bg-danger'}`}>
                                                            {employee.workflow_state}
                                                        </span>
                                                    </td>
                                                    <td>{new Date(employee.join_date).toLocaleDateString()}</td>
                                                    <td>
                                                        <Link to={`/employee/${employee.id}`}>
                                                            {t('View Details')}
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
        </div>
    )
}

export default DepartmentDetailScreen
