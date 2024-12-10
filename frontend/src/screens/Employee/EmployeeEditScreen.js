import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from "react-i18next"
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import FormContainer from '../../components/FormContainer'
import { getEmployeeDetails, updateEmployee } from '../../actions/employeeActions'
import { listCompanies } from '../../actions/companyActions'
import { listDepartments } from '../../actions/departmentActions'
import { EMPLOYEE_UPDATE_RESET } from '../../constants/employeeConstants'

function EmployeeEditScreen() {
    const { id } = useParams()
    const [t, i18n] = useTranslation()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [mobile_number, setMobileNumber] = useState('')
    const [address, setAddress] = useState('')
    const [companyId, setCompanyId] = useState('')
    const [departmentId, setDepartmentId] = useState('')
    const [designation, setDesignation] = useState('')
    const [workflow_state, setWorkflowState] = useState('')
    const [status, setStatus] = useState('')
    const [hired_on, setHiredOn] = useState('')
    const [days_employed, setDaysEmployed] = useState('')

    const employeeDetails = useSelector(state => state.employeeDetails)
    const { loading, error, employee } = employeeDetails

    const companyList = useSelector(state => state.companyList)
    const { loading: loadingCompanies, error: errorCompanies, companies } = companyList

    const departmentList = useSelector(state => state.departmentList)
    const { loading: loadingDepartments, error: errorDepartments, departments } = departmentList

    const employeeUpdate = useSelector(state => state.employeeUpdate)
    const {
        loading: loadingUpdate,
        error: errorUpdate,
        success: successUpdate
    } = employeeUpdate

    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: EMPLOYEE_UPDATE_RESET })
            navigate('/employees')
        } else {
            if (!employee.name || employee.id !== Number(id)) {
                dispatch(getEmployeeDetails(id))
                dispatch(listCompanies())
                dispatch(listDepartments())
            } else {
                setName(employee.name)
                setEmail(employee.email)
                setMobileNumber(employee.mobile_number || '')
                setAddress(employee.address)
                setCompanyId(employee.company_data?.id || '')
                setDepartmentId(employee.department_data?.id || '')
                setDesignation(employee.designation)
                setStatus(employee.status)
                setHiredOn(employee.hired_on ? employee.hired_on.split('T')[0] : '')
                setWorkflowState(employee.workflow_state)
                setDaysEmployed(employee.days_employed)
            }
        }
    }, [dispatch, id, employee, successUpdate, navigate])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateEmployee({
            id,
            name,
            email,
            mobile_number,
            address,
            company: companyId,
            department: departmentId,
            designation,
            workflow_state,
            status,
            hired_on,
            days_employed
        }))
    }

    // Filter departments based on selected company
    const filteredDepartments = departments.filter(
        dept => dept.company_data?.id === companyId
    )

    return (
        <div style={i18n.language === 'ar' ? {direction: 'rtl'} : {direction: 'ltr'}}>
            <Link to='/employees' className='btn btn-light my-3'>
                {t('Go Back')}
            </Link>

            <FormContainer>
                <h1>{t('Edit Employee')}</h1>

                {loadingUpdate && <Loader />}
                {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}

                {loading || loadingCompanies || loadingDepartments ? (
                    <Loader />
                ) : error || errorCompanies || errorDepartments ? (
                    <Message variant='danger'>{error || errorCompanies || errorDepartments}</Message>
                ) : (
                    <Form onSubmit={submitHandler}>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId='name' className='my-2'>
                                    <Form.Label>{t('Name')}</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder={t('Enter full name')}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group controlId='designation' className='my-2'>
                                    <Form.Label>{t('designation')}</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder={t('Enter designation')}
                                        value={designation}
                                        onChange={(e) => setDesignation(e.target.value)}
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
                                    <Form.Label>{t('Phone')}</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder={t('Enter phone number')}
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
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group controlId='company' className='my-2'>
                                    <Form.Label>{t('Company')}</Form.Label>
                                    <Form.Control
                                        as='select'
                                        value={companyId}
                                        onChange={(e) => {
                                            setCompanyId(e.target.value)
                                            setDepartmentId('') // Reset department when company changes
                                        }}
                                        required
                                    >
                                        <option value=''>{t('Select Company')}</option>
                                        {companies.map(company => (
                                            <option key={company.id} value={company.id}>
                                                {company.name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group controlId='department' className='my-2'>
                                    <Form.Label>{t('Department')}</Form.Label>
                                    <Form.Control
                                        as='select'
                                        value={departmentId}
                                        onChange={(e) => setDepartmentId(e.target.value)}
                                        required
                                        disabled={!companyId}
                                    >
                                        <option value=''>{t('Select Department')}</option>
                                        {filteredDepartments.map(department => (
                                            <option key={department.id} value={department.id}>
                                                {department.name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group controlId='hired_on' className='my-2'>
                                    <Form.Label>{t('Hire Date')}</Form.Label>
                                    <Form.Control
                                        type='date'
                                        value={hired_on}
                                        onChange={(e) => setHiredOn(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId='days_employed' className='my-2'>
                                    <Form.Label>{t('Days Employed')}</Form.Label>
                                    <Form.Control
                                        type='number'
                                        value={days_employed}
                                        onChange={(e) => setDaysEmployed(e.target.value)}
                                        disabled={workflow_state !== 'hired'}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={12}>
                                <Form.Group controlId='workflow_state' className='my-2'>
                                    <Form.Label>{t('Workflow State')}</Form.Label>
                                    <Form.Control
                                        as='select'
                                        placeholder={t('Enter workflow state')}
                                        value={workflow_state}
                                        onChange={(e) => setWorkflowState(e.target.value)}
                                    >
                                        <option value='application_received'>{t('Application Received')}</option>
                                        <option value='interview_scheduled'>{t('Interview Scheduled')}</option>
                                        <option value='hired'>{t('Hired')}</option>
                                        <option value='not_accepted'>{t('Not Accepted')}</option>
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
                                        <option value='pending'>{t('Pending')}</option>
                                        <option value='onboarding'>{t('Onboarding')}</option>
                                        <option value='active'>{t('Active')}</option>
                                        <option value='inactive'>{t('Inactive')}</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Button type='submit' variant='primary' className='my-3'>
                            {t('Update')}
                        </Button>
                    </Form>
                )}
            </FormContainer>
        </div>
    )
}

export default EmployeeEditScreen
