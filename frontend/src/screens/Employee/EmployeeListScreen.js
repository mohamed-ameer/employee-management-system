import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from "react-i18next"
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import { listEmployees, deleteEmployee } from '../../actions/employeeActions'

function EmployeeListScreen() {
    const [t, i18n] = useTranslation()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const employeeList = useSelector(state => state.employeeList)
    const { loading, error, employees } = employeeList

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const employeeDelete = useSelector(state => state.employeeDelete)
    const { success: successDelete } = employeeDelete

    useEffect(() => {
        if (!userInfo || (!userInfo.isAdmin && !userInfo.isHR && !userInfo.isManager)) {
            navigate('/login')
        } else {
            dispatch(listEmployees())
        }
    }, [dispatch, navigate, userInfo, successDelete])

    const deleteHandler = (id) => {
        if (window.confirm(t('Are you sure you want to delete this employee?'))) {
            dispatch(deleteEmployee(id))
        }
    }

    const createEmployeeHandler = () => {
        navigate('/employee/create')
    }

    return (
        <div style={i18n.language === 'ar' ? {direction: 'rtl'} : {direction: 'ltr'}}>
            <Row className='align-items-center'>
                <Col>
                    <h1>{t('Employees')}</h1>
                </Col>
                <Col className='text-right'>
                    <Button className='my-3' onClick={createEmployeeHandler}>
                        <i className='fas fa-plus'></i> {t('Add Employee')}
                    </Button>
                </Col>
            </Row>

            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : (
                <Table striped bordered hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>{t('ID')}</th>
                            <th>{t('Name')}</th>
                            <th>{t('Email')}</th>
                            <th>{t('Phone')}</th>
                            <th>{t('Company')}</th>
                            <th>{t('Department')}</th>
                            <th>{t('Address')}</th>
                            <th>{t('Position')}</th>
                            <th>{t('Status')}</th>
                            <th>{t('Actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map(employee => (
                            <tr key={employee.id}>
                                <td>{employee.id}</td>
                                <td>{employee.name}</td>
                                <td>{employee.email}</td>
                                <td>{employee.mobile_number}</td>
                                <td>{employee.company_data?.name}</td>
                                <td>{employee.department_data?.name}</td>
                                <td>{employee.address}</td>
                                <td>{employee.designation}</td>
                                <td>
                                    <span className={`badge ${
                                        employee.workflow_state === 'hired' ? 'bg-success' :
                                        employee.workflow_state === 'interview_scheduled' ? 'bg-warning' :
                                        'bg-secondary'
                                    }`}>
                                        {t(employee.workflow_state)}
                                    </span>
                                </td>
                                <td>
                                    <Button
                                        variant='light'
                                        className='btn-sm'
                                        onClick={() => navigate(`/employee/${employee.id}`)}>
                                        <i className='fas fa-eye'></i>
                                    </Button>
                                    <Button
                                        variant='light'
                                        className='btn-sm'
                                        onClick={() => navigate(`/employee/${employee.id}/edit`)}>
                                        <i className='fas fa-edit'></i>
                                    </Button>
                                    <Button
                                        variant='danger'
                                        className='btn-sm'
                                        onClick={() => deleteHandler(employee.id)}>
                                        <i className='fas fa-trash'></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    )
}

export default EmployeeListScreen
