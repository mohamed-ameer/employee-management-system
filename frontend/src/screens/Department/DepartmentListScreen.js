import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from "react-i18next"
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import { listDepartments, deleteDepartment, createDepartment } from '../../actions/departmentActions'

function DepartmentListScreen() {
    const [t, i18n] = useTranslation()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const departmentList = useSelector(state => state.departmentList)
    const { loading, error, departments } = departmentList

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const departmentDelete = useSelector(state => state.departmentDelete)
    const { success: successDelete } = departmentDelete

    const departmentCreate = useSelector(state => state.departmentCreate)
    const { success: successCreate, department: createdDepartment } = departmentCreate

    useEffect(() => {
        if (!userInfo || (!userInfo.isAdmin && !userInfo.isHR)) {
            navigate('/login')
        }
        
        if (successCreate) {
            navigate(`/department/${createdDepartment.id}/edit`)
        } else {
            dispatch(listDepartments())
        }
    }, [dispatch, navigate, userInfo, successDelete, successCreate, createdDepartment])

    const deleteHandler = (id) => {
        if (window.confirm(t('Are you sure you want to delete this department?'))) {
            dispatch(deleteDepartment(id))
        }
    }

    const createDepartmentHandler = () => {
        navigate('/department/create')
    }

    return (
        <div style={i18n.language === 'ar' ? {direction: 'rtl'} : {direction: 'ltr'}}>
            <Row className='align-items-center'>
                <Col>
                    <h1>{t('Departments')}</h1>
                </Col>
                <Col className='text-right'>
                    <Button className='my-3' onClick={createDepartmentHandler}>
                        <i className='fas fa-plus'></i> {t('Create Department')}
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
                            <th>{t('Company')}</th>
                            <th>{t('Manager')}</th>
                            <th>{t('Employees')}</th>
                            <th>{t('Status')}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments.map(department => (
                            <tr key={department.id}>
                                <td>{department.id}</td>
                                <td>{department.name}</td>
                                <td>{department.company?.name}</td>
                                <td>{department.manager?.name || t('No Manager')}</td>
                                <td>{department.employees_count || 0}</td>
                                <td>
                                    <span className={`badge ${department.is_active ? 'bg-success' : 'bg-danger'}`}>
                                        {department.is_active ? t('Active') : t('Inactive')}
                                    </span>
                                </td>
                                <td>
                                    <Button
                                        variant='light'
                                        className='btn-sm'
                                        onClick={() => navigate(`/department/${department.id}`)}>
                                        <i className='fas fa-eye'></i>
                                    </Button>
                                    <Button
                                        variant='light'
                                        className='btn-sm'
                                        onClick={() => navigate(`/department/${department.id}/edit`)}>
                                        <i className='fas fa-edit'></i>
                                    </Button>
                                    <Button
                                        variant='danger'
                                        className='btn-sm'
                                        onClick={() => deleteHandler(department.id)}>
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

export default DepartmentListScreen
