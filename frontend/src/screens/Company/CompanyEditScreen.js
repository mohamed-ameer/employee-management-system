import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from "react-i18next"
import Loader from '../../components/Loader'
import Message from '../../components/Message'
import FormContainer from '../../components/FormContainer'
import { getCompanyDetails, updateCompany } from '../../actions/companyActions'
import { COMPANY_UPDATE_RESET } from '../../constants/companyConstants'

function CompanyEditScreen() {
    const { t } = useTranslation()
    const { id } = useParams()
    const navigate = useNavigate()

    const [name, setName] = useState('')

    const dispatch = useDispatch()

    const companyDetails = useSelector(state => state.companyDetails)
    const { error, loading, company } = companyDetails

    const companyUpdate = useSelector(state => state.companyUpdate)
    const { error: errorUpdate, loading: loadingUpdate, success: successUpdate } = companyUpdate

    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: COMPANY_UPDATE_RESET })
            navigate('/companies')
        } else {
            if (!company.name || company.id !== Number(id)) {
                dispatch(getCompanyDetails(id))
            } else {
                setName(company.name)
            }
        }
    }, [dispatch, id, company, successUpdate, navigate])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateCompany({
            id: id,
            name
        }))
    }

    return (
        <div>
            <Link to='/companies' className='btn btn-light my-3'>
                {t('Common.Back')}
            </Link>

            <FormContainer>
                <h1>{t('Company Management.Edit Company')}</h1>

                {loadingUpdate && <Loader />}
                {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}

                {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message>
                    : (
                        <Form onSubmit={submitHandler}>
                            <Form.Group controlId='name'>
                                <Form.Label>{t('Company Management.Company Name')}</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder={t('Placeholders.Enter company name')}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                >
                                </Form.Control>
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

export default CompanyEditScreen
