import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from "react-i18next"
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import FormContainer from '../../components/FormContainer'
import { createEmployee } from '../../actions/employeeActions'
import { listCompanies } from '../../actions/companyActions'
import { listDepartments } from '../../actions/departmentActions'
import { EMPLOYEE_CREATE_RESET } from '../../constants/employeeConstants'

function EmployeeCreateScreen() {
    const [t, i18n] = useTranslation()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [mobile_number, setMobileNumber] = useState("")
    const [address, setAddress] = useState("")
    const [companyId, setCompanyId] = useState("")
    const [departmentId, setDepartmentId] = useState("")
    const [designation, setDesignation] = useState("")
    const [workflow_state, setWorkflowState] = useState("")
    const [status, setStatus] = useState("")


    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const employeeCreate = useSelector(state => state.employeeCreate)
    const { loading: loadingCreate, error: errorCreate, success: successCreate } = employeeCreate

    const companyList = useSelector(state => state.companyList)
    const { loading: loadingCompanies, error: errorCompanies, companies } = companyList

    const departmentList = useSelector(state => state.departmentList)
    const { loading: loadingDepartments, error: errorDepartments, departments } = departmentList


    useEffect(() => {
        if (!userInfo || (!userInfo.isAdmin && !userInfo.isHR)) {
            navigate('/login')
        }

        if (successCreate) {
            dispatch({ type: EMPLOYEE_CREATE_RESET })
            navigate('/employees')
        } else {
            dispatch(listCompanies())
        }
    }, [dispatch, navigate, userInfo, successCreate])

    useEffect(() => {
        if (companyId) {
            dispatch(listDepartments(`?company=${companyId}`))
        }
    }, [dispatch, companyId])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(createEmployee({
            name,
            email,
            mobile_number,
            address,
            designation,
            workflow_state,
            status,
            company: Number(companyId),  
            department: Number(departmentId)  
        }))
    }

    return (
        <div style={i18n.language === 'ar' ? {direction: 'rtl'} : {direction: 'ltr'}}>
            <Link to='/employees' className='btn btn-light my-3'>
                {t('Go Back')}
            </Link>

            <FormContainer>
                <h1>{t('Add New Employee')}</h1>

                {loadingCreate && <Loader />}
                {errorCreate && <Message variant='danger'>{errorCreate}</Message>}

                {loadingCompanies || loadingDepartments ? (
                    <Loader />
                ) : errorCompanies || errorDepartments ? (
                    <Message variant='danger'>{errorCompanies || errorDepartments}</Message>
                ) : (
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId='name' className='my-2'>
                            <Form.Label>{t('Name')}</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder={t('Enter name')}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId='email' className='my-2'>
                            <Form.Label>{t('Email')}</Form.Label>
                            <Form.Control
                                type='email'
                                placeholder={t('Enter email')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId='mobile_number' className='my-2'>
                            <Form.Label>{t('Mobile Number')}</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder={t('Enter mobile number')}
                                value={mobile_number}
                                onChange={(e) => setMobileNumber(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId='address' className='my-2'>
                            <Form.Label>{t('Address')}</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder={t('Enter address')}
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId='position' className='my-2'>
                            <Form.Label>{t('Position')}</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder={t('Enter position')}
                                value={designation}
                                onChange={(e) => setDesignation(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId='companyId' className='my-2'>
                            <Form.Label>{t('CompanyId')}</Form.Label>
                            <Form.Control
                                as='select'
                                value={companyId}
                                onChange={(e) => {
                                    setCompanyId(Number(e.target.value))
                                    setDepartmentId('') // Reset department when company changes
                                }}
                                required
                            >
                                <option value=''>{t('Select Company')}</option>
                                {companies?.map(company => (
                                    <option key={company.id} value={company.id}>
                                        {company.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='departmentId' className='my-2'>
                            <Form.Label>{t('Department')}</Form.Label>
                            <Form.Control
                                as='select'
                                value={departmentId}
                                onChange={(e) => setDepartmentId(Number(e.target.value))}
                                required
                                disabled={!companyId}
                            >
                                <option value=''>{t('Select Department')}</option>
                                {departments?.map(department => (
                                    <option key={department.id} value={department.id}>
                                        {department.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='workflow_state' className='my-2'>
                            <Form.Label>{t('Workflow State')}</Form.Label>
                            <Form.Control
                                as='select'
                                placeholder={t('Enter workflow state')}
                                value={workflow_state}
                                onChange={(e) => setWorkflowState(e.target.value)}
                            >
                                <option value="application_received">{t('Application Received')}</option>
                                <option value="interview_scheduled">{t('Interview Scheduled')}</option>
                                <option value="hired">{t('Hired')}</option>
                                <option value="not_accepted">{t('Not Accepted')}</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='status' className='my-2'>
                            <Form.Label>{t('Status')}</Form.Label>
                            <Form.Control
                                as='select'
                                placeholder={t('Enter status')}
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="pending">{t('Pending')}</option>
                                <option value="onboarding">{t('Onboarding')}</option>
                                <option value="active">{t('Active')}</option>
                                <option value="inactive">{t('Inactive')}</option>
                            </Form.Control>
                        </Form.Group>

                        <Button type='submit' variant='primary' className='my-3'>
                            {t('Create')}
                        </Button>
                    </Form>
                )}
            </FormContainer>
        </div>
    )
}

export default EmployeeCreateScreen
