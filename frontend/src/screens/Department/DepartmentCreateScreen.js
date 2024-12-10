import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from "react-i18next"
import Loader from '../../components/Loader'
import Message from '../../components/Message'
import FormContainer from '../../components/FormContainer'
import { createDepartment } from '../../actions/departmentActions'
import { listCompanies } from '../../actions/companyActions'
import { DEPARTMENT_CREATE_RESET } from '../../constants/departmentConstants'

function DepartmentCreateScreen() {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [company, setCompany] = useState('')

    const dispatch = useDispatch()

    const departmentCreate = useSelector(state => state.departmentCreate)
    const { error, loading, success: successCreate } = departmentCreate

    const companyList = useSelector(state => state.companyList)
    const { loading: loadingCompanies, error: errorCompanies, companies } = companyList

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            navigate('/login')
        }

        if (successCreate) {
            dispatch({ type: DEPARTMENT_CREATE_RESET })
            navigate('/departments')
        } else {
            dispatch(listCompanies())
        }
    }, [dispatch, navigate, userInfo, successCreate])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(createDepartment({
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
                <h1>{t('Department Management.Create Department')}</h1>

                {loading && <Loader />}
                {error && <Message variant='danger'>{error}</Message>}

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
                        {t('Common.Create')}
                    </Button>
                </Form>
            </FormContainer>
        </div>
    )
}

export default DepartmentCreateScreen
