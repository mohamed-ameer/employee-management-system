import React, { useEffect } from 'react'
import { Row, Col, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from "react-i18next"
import Loader from '../components/Loader'
import Message from '../components/Message'
// Import actions
import { listCompanies } from '../actions/companyActions'
import { listDepartments } from '../actions/departmentActions'
import { listEmployees } from '../actions/employeeActions'

function DashboardScreen() {
    const [t, i18n] = useTranslation()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const companyList = useSelector(state => state.companyList)
    const { loading: loadingCompanies, error: errorCompanies, companies } = companyList

    const departmentList = useSelector(state => state.departmentList)
    const { loading: loadingDepartments, error: errorDepartments, departments } = departmentList

    const employeeList = useSelector(state => state.employeeList)
    const { loading: loadingEmployees, error: errorEmployees, employees } = employeeList

    useEffect(() => {
        if (!userInfo) {
            navigate('/login')
        } else {
            dispatch(listCompanies())
            dispatch(listDepartments())
            dispatch(listEmployees())
        }
    }, [dispatch, navigate, userInfo])

    return (
        <div>
            <h1 className="text-center mb-4">{t('DashboardTitle')}</h1>
            
            {loadingCompanies || loadingDepartments || loadingEmployees ? (
                <Loader />
            ) : errorCompanies || errorDepartments || errorEmployees ? (
                <Message variant='danger'>
                    {errorCompanies || errorDepartments || errorEmployees}
                </Message>
            ) : (
                <>
                    <Row>
                        <Col md={4}>
                            <Card className="mb-4">
                                <Card.Body className="text-center">
                                    <Card.Title>{t('Companies')}</Card.Title>
                                    <h2>{companies?.length || 0}</h2>
                                    <Link to="/companies">{t('View All')}</Link>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="mb-4">
                                <Card.Body className="text-center">
                                    <Card.Title>{t('Departments')}</Card.Title>
                                    <h2>{departments?.length || 0}</h2>
                                    <Link to="/departments">{t('View All')}</Link>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="mb-4">
                                <Card.Body className="text-center">
                                    <Card.Title>{t('Employees')}</Card.Title>
                                    <h2>{employees?.length || 0}</h2>
                                    <Link to="/employees">{t('View All')}</Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Recent Employees */}
                    <h2 className="mt-4">{t('Recent Employees')}</h2>
                    <Row>
                        {employees?.slice(0, 5).map(employee => (
                            <Col key={employee.id} md={12}>
                                <Card className="mb-3">
                                    <Card.Body>
                                        <Card.Title>{employee.name}</Card.Title>
                                        <Card.Text>
                                            {t('Department')}: {employee.department?.name}<br />
                                            {t('Position')}: {employee.position}<br />
                                            {t('Status')}: {employee.workflow_state}
                                        </Card.Text>
                                        <Link to={`/employee/${employee.id}`}>{t('View Details')}</Link>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </>
            )}
        </div>
    )
}

export default DashboardScreen
