import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from "react-i18next"
import Loader from '../../components/Loader'
import Message from '../../components/Message'
import FormContainer from '../../components/FormContainer'
import { getDepartmentDetails, updateDepartment } from '../../actions/departmentActions'
import { listCompanies } from '../../actions/companyActions'
import { DEPARTMENT_UPDATE_RESET } from '../../constants/departmentConstants'

function DepartmentEditScreen() {
    const { t } = useTranslation()
    const { id } = useParams()
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [company, setCompany] = useState('')

    const dispatch = useDispatch()

    const departmentDetails = useSelector(state => state.departmentDetails)
    const { error, loading, department } = departmentDetails

    const departmentUpdate = useSelector(state => state.departmentUpdate)
    const { error: errorUpdate, loading: loadingUpdate, success: successUpdate } = departmentUpdate

    const companyList = useSelector(state => state.companyList)
    const { loading: loadingCompanies, error: errorCompanies, companies } = companyList

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            navigate('/login')
        }

        if (successUpdate) {
            dispatch({ type: DEPARTMENT_UPDATE_RESET })
            navigate('/departments')
        } else {
            if (!department.name || department.id !== Number(id)) {
                dispatch(getDepartmentDetails(id))
                dispatch(listCompanies())
            } else {
                setName(department.name)
                setCompany(department.company)
            }
        }
    }, [dispatch, id, department, successUpdate, navigate, userInfo])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateDepartment({
            id,
            name,
            company
        }))
    }

    return (
        <div>
            <Link to='/departments' className='btn btn-light my-3'>
                {t('Common.Back')}
            </Link>

            <FormContainer>
                <h1>{t('Department Management.Edit Department')}</h1>

                {loadingUpdate && <Loader />}
                {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}

                {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message>
                    : (
                        <Form onSubmit={submitHandler}>
                            <Form.Group controlId='name'>
                                <Form.Label>{t('Department Management.Department Name')}</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder={t('Placeholders.Enter department name')}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='company' className='mt-3'>
                                <Form.Label>{t('Department Management.Select Company')}</Form.Label>
                                {loadingCompanies ? <Loader />
                                    : errorCompanies ? <Message variant='danger'>{errorCompanies}</Message>
                                        : (
                                            <Form.Control
                                                as='select'
                                                value={company}
                                                onChange={(e) => setCompany(e.target.value)}
                                                required
                                            >
                                                <option value=''>{t('Common.Select')}...</option>
                                                {companies?.map(company => (
                                                    <option key={company.id} value={company.id}>
                                                        {company.name}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        )}
                            </Form.Group>

                            <Button type='submit' variant='primary' className='mt-3'>
                                {t('Common.Save')}
                            </Button>
                        </Form>
                    )}
            </FormContainer>
        </div>
    )
}

export default DepartmentEditScreen
