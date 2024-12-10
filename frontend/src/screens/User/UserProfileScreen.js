import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import { getUserProfile, updateUserProfile } from '../../actions/userActions'
import { USER_UPDATE_PROFILE_RESET } from '../../constants/userConstants'

function UserProfileScreen() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [jobTitle, setJobTitle] = useState('')
    const [department, setDepartment] = useState('')
    const [preferredLanguage, setPreferredLanguage] = useState('en')
    const [timeZone, setTimeZone] = useState('UTC')
    const [message, setMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const { t, i18n } = useTranslation()
    const dispatch = useDispatch()
    const history = useNavigate()

    const userProfile = useSelector(state => state.userProfile)
    const { loading, error, user } = userProfile

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const userUpdateProfile = useSelector(state => state.userUpdateProfile)
    const { success: successUpdate, error: errorUpdate } = userUpdateProfile

    useEffect(() => {
        if (!userInfo) {
            history.push('/login')
        } else {
            if (!user || !user.name || successUpdate) {
                dispatch({ type: USER_UPDATE_PROFILE_RESET })
                dispatch(getUserProfile('profile'))
            } else {
                setName(user.name)
                setEmail(user.email)
                setPhone(user.phone || '')
                setJobTitle(user.job_title || '')
                setDepartment(user.department || '')
                setPreferredLanguage(user.preferred_language || 'en')
                setTimeZone(user.time_zone || 'UTC')
            }
        }
    }, [dispatch, history, userInfo, user, successUpdate])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateUserProfile({
            'name': name,
            'email': email,
            'phone': phone,
            'job_title': jobTitle,
            'department': department,
            'preferred_language': preferredLanguage,
            'time_zone': timeZone
        }))
        setSuccessMessage(t('Profile updated successfully'))
        setTimeout(() => setSuccessMessage(''), 3000)
    }

    const timeZones = [
        'UTC',
        'America/New_York',
        'America/Chicago',
        'America/Denver',
        'America/Los_Angeles',
        'Europe/London',
        'Europe/Paris',
        'Asia/Tokyo',
        'Asia/Dubai',
        'Australia/Sydney'
    ]

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'ar', name: 'العربية' },
        { code: 'es', name: 'Español' },
        { code: 'fr', name: 'Français' }
    ]

    const handleLanguageChange = (e) => {
        const langCode = e.target.value
        setPreferredLanguage(langCode)
        i18n.changeLanguage(langCode)
    }

    return (
        <Row className="justify-content-md-center">
            <Col md={8}>
                <h2>{t('User Profile')}</h2>
                {message && <Message variant='danger'>{message}</Message>}
                {error && <Message variant='danger'>{error}</Message>}
                {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
                {successMessage && <Message variant='success'>{successMessage}</Message>}
                {loading && <Loader />}

                <Card className="mb-4">
                    <Card.Header>{t('Personal Information')}</Card.Header>
                    <Card.Body>
                        <Form onSubmit={submitHandler}>
                            <Form.Group controlId='name'>
                                <Form.Label>{t('Name')}</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder={t('Enter name')}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                ></Form.Control>
                            </Form.Group>

                            <Form.Group controlId='email'>
                                <Form.Label>{t('Email Address')}</Form.Label>
                                <Form.Control
                                    type='email'
                                    placeholder={t('Enter email')}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                ></Form.Control>
                            </Form.Group>

                            <Form.Group controlId='phone'>
                                <Form.Label>{t('Phone Number')}</Form.Label>
                                <Form.Control
                                    type='tel'
                                    placeholder={t('Enter phone number')}
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                ></Form.Control>
                            </Form.Group>

                            <Form.Group controlId='jobTitle'>
                                <Form.Label>{t('Job Title')}</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder={t('Enter job title')}
                                    value={jobTitle}
                                    onChange={(e) => setJobTitle(e.target.value)}
                                ></Form.Control>
                            </Form.Group>

                            <Form.Group controlId='department'>
                                <Form.Label>{t('Department')}</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder={t('Enter department')}
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}
                                ></Form.Control>
                            </Form.Group>

                            <Button type='submit' variant='primary' className="mt-3">
                                {t('Update Profile')}
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>

                <Card>
                    <Card.Header>{t('Preferences')}</Card.Header>
                    <Card.Body>
                        <Form>
                            <Form.Group controlId='language'>
                                <Form.Label>{t('Preferred Language')}</Form.Label>
                                <Form.Control
                                    as='select'
                                    value={preferredLanguage}
                                    onChange={handleLanguageChange}
                                >
                                    {languages.map(lang => (
                                        <option key={lang.code} value={lang.code}>
                                            {lang.name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='timezone'>
                                <Form.Label>{t('Time Zone')}</Form.Label>
                                <Form.Control
                                    as='select'
                                    value={timeZone}
                                    onChange={(e) => setTimeZone(e.target.value)}
                                >
                                    {timeZones.map(tz => (
                                        <option key={tz} value={tz}>
                                            {tz}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default UserProfileScreen
