import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Row, Col, ListGroup, Card, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from "react-i18next"
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import { getEmployeeDetails } from '../../actions/employeeActions'
import WorkflowTimeline from '../../components/WorkflowTimeline'

function EmployeeDetailScreen() {
    const { id } = useParams()
    const [t, i18n] = useTranslation()
    const dispatch = useDispatch()

    const employeeDetails = useSelector(state => state.employeeDetails)
    const { loading, error, employee } = employeeDetails

    useEffect(() => {
        dispatch(getEmployeeDetails(id))
    }, [dispatch, id])

    const handleWorkflowTransition = (status) => {
        dispatch({
            type: 'EMPLOYEE_WORKFLOW_TRANSITION_REQUEST',
            payload: { employeeId: employee.id, status }
        })
    }

    return (
        <div style={i18n.language === 'ar' ? {direction: 'rtl'} : {direction: 'ltr'}}>
            <Link to='/employees' className='btn btn-light my-3'>
                {t('Go Back')}
            </Link>
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : (
                <Row>
                    <Col md={8}>
                        <Card className="mb-4">
                            <Card.Header>
                                <h3>{t('Employee Information')}</h3>
                            </Card.Header>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <h4>{employee.name}</h4>
                                    <p className="mb-0">
                                        <strong>{t('Position')}:</strong> {employee.designation}
                                    </p>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col md={6}>
                                            <p className="mb-0">
                                                <strong>{t('Email')}:</strong> {employee.email}
                                            </p>
                                        </Col>
                                        <Col md={6}>
                                            <p className="mb-0">
                                                <strong>{t('Phone')}:</strong> {employee.mobile_number}
                                            </p>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <h3>{t('Company')}</h3>
                                    {employee.company_data && (
                                        <>
                                            <p><strong>{t('Name')}:</strong> {employee.company_data.name}</p>
                                            <p><strong>{t('Employees Count')}:</strong> {employee.company_data.employees_count}</p>
                                        </>
                                    )}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <h3>{t('Department')}</h3>
                                    {employee.department_data && (
                                        <>
                                            <p><strong>{t('Name')}:</strong> {employee.department_data.name}</p>
                                            <p><strong>{t('Employees Count')}:</strong> {employee.department_data.employees_count}</p>
                                        </>
                                    )}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col md={6}>
                                            <p className="mb-0">
                                                <strong>{t('Join Date')}:</strong>{' '}
                                                {new Date(employee.join_date).toLocaleDateString()}
                                            </p>
                                        </Col>
                                        <Col md={6}>
                                            <p className="mb-0">
                                                <strong>{t('Status')}:</strong>{' '}
                                                <span className={`badge ${
                                                    employee.workflow_state === 'hired' ? 'bg-success' :
                                                    employee.workflow_state === 'interview_scheduled' ? 'bg-warning' :
                                                    'bg-secondary'
                                                }`}>
                                                    {t(employee.workflow_state)}
                                                </span>
                                            </p>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>

                        {/* Workflow Timeline */}
                        <Card>
                            <Card.Header>
                                <h4>{t('Workflow History')}</h4>
                            </Card.Header>
                            <Card.Body>
                                <WorkflowTimeline logs={employee.workflow_logs || []} />
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={4}>
                        <Card>
                            <Card.Header>
                                <h4>{t('Actions')}</h4>
                            </Card.Header>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <Button
                                        className='btn-block w-100'
                                        type='button'
                                        as={Link}
                                        to={`/employee/${employee.id}/edit`}>
                                        {t('Edit Employee')}
                                    </Button>
                                </ListGroup.Item>
                                {employee.workflow_state !== 'hired' && (
                                    <ListGroup.Item>
                                        <Button
                                            className='btn-block w-100'
                                            type='button'
                                            variant='success'
                                            onClick={() => handleWorkflowTransition('hired')}>
                                            {t('Mark as Hired')}
                                        </Button>
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                        </Card>

                        {/* Employee Stats */}
                        <Card className="mt-4">
                            <Card.Header>
                                <h4>{t('Employee Stats')}</h4>
                            </Card.Header>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>{t('Time in Company')}:</Col>
                                        <Col>
                                            {calculateTimeInCompany(employee.hired_on)}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>{t('Status Changes')}:</Col>
                                        <Col>
                                            {employee.workflow_logs?.length || 0}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            )}
        </div>
    )
}

// Helper function to calculate time in company
function calculateTimeInCompany(joinDate) {
    if (!joinDate) return '-'
    const start = new Date(joinDate)
    const now = new Date()
    const diffTime = Math.abs(now - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const years = Math.floor(diffDays / 365)
    const months = Math.floor((diffDays % 365) / 30)
    const days = diffDays % 30

    if (years > 0) {
        return `${years}y ${months}m`
    } else if (months > 0) {
        return `${months}m ${days}d`
    } else {
        return `${days}d`
    }
}

export default EmployeeDetailScreen
