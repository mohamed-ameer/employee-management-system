import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from "react-i18next"
import Loader from '../../components/Loader'
import Message from '../../components/Message'
import FormContainer from '../../components/FormContainer'
import { createCompany } from '../../actions/companyActions'
import { COMPANY_CREATE_RESET } from '../../constants/companyConstants'

function CompanyCreateScreen() {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const [name, setName] = useState('')

    const dispatch = useDispatch()

    const companyCreate = useSelector(state => state.companyCreate)
    const { error, loading, success: successCreate, company } = companyCreate

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            navigate('/login')
        }

        if (successCreate) {
            dispatch({ type: COMPANY_CREATE_RESET })
            navigate('/companies')
        }
    }, [dispatch, navigate, userInfo, successCreate])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(createCompany({
            name
        }))
    }

    return (
        <div>
            <Link to='/companies' className='btn btn-light my-3'>
                {t('Common.Back')}
            </Link>

            <FormContainer>
                <h1>{t('Company Management.Create Company')}</h1>

                {loading && <Loader />}
                {error && <Message variant='danger'>{error}</Message>}

                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='name'>
                        <Form.Label>{t('Company Management.Company Name')}</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder={t('Placeholders.Enter company name')}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        >
                        </Form.Control>
                    </Form.Group>

                    <Button type='submit' variant='primary' className='mt-3'>
                        {t('Common.Create')}
                    </Button>
                </Form>
            </FormContainer>
        </div>
    )
}

export default CompanyCreateScreen
