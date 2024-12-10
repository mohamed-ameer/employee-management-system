import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from "react-i18next"
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import { LinkContainer } from 'react-router-bootstrap'
import { listCompanies, deleteCompany, createCompany } from '../../actions/companyActions'

function CompanyListScreen() {
    const [t, i18n] = useTranslation()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const companyList = useSelector(state => state.companyList)
    const { loading, error, companies } = companyList

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const companyDelete = useSelector(state => state.companyDelete)
    const { success: successDelete } = companyDelete

    const companyCreate = useSelector(state => state.companyCreate)
    const { success: successCreate, company: createdCompany } = companyCreate

    useEffect(() => {
        if (!userInfo || (!userInfo.isAdmin && !userInfo.isHR)) {
            navigate('/login')
        }
        
        if (successCreate) {
            navigate(`/company/${createdCompany.id}/edit`)
        } else {
            dispatch(listCompanies())
        }
    }, [dispatch, navigate, userInfo, successDelete, successCreate, createdCompany])

    const deleteHandler = (id) => {
        if (window.confirm(t('Are you sure you want to delete this company?'))) {
            dispatch(deleteCompany(id))
        }
    }

    const createCompanyHandler = () => {
        navigate('/company/create')
    }

    return (
        <div style={i18n.language === 'ar' ? {direction: 'rtl'} : {direction: 'ltr'}}>
            <Row className='align-items-center'>
                <Col>
                    <h1>{t('Companies')}</h1>
                </Col>
                <Col className='text-right'>
                    <Button className='my-3' onClick={createCompanyHandler}>
                        <i className='fas fa-plus'></i> {t('Create Company')}
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
                            <th>{t('Common.ID')}</th>
                            <th>{t('Company Management.Company Name')}</th>
                            <th>{t('Company Management.Number of Departments')}</th>
                            <th>{t('Company Management.Number of Employees')}</th>
                            <th>{t('Common.Actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companies?.map(company => (
                            <tr key={company.id}>
                                <td>{company.id}</td>
                                <td>{company.name}</td>
                                <td>{company.departments_count}</td>
                                <td>{company.employees_count}</td>
                                <td>
                                    <LinkContainer to={`/company/${company.id}/edit`}>
                                        <Button variant='light' className='btn-sm'>
                                            <i className='fas fa-edit'></i>
                                        </Button>
                                    </LinkContainer>

                                    <Button
                                        variant='danger'
                                        className='btn-sm'
                                        onClick={() => deleteHandler(company.id)}>
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

export default CompanyListScreen
