import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from "react-i18next"
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import { updateUserSecurity, enable2FA, disable2FA, verify2FA } from '../../actions/userActions'
import {QRCodeSVG} from 'qrcode.react'

function UserSecurityScreen() {
    const [t, i18n] = useTranslation()

    const history = useNavigate()
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
    const [verificationCode, setVerificationCode] = useState('')
    const [message, setMessage] = useState('')

    const dispatch = useDispatch()

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const userUpdateSecurity = useSelector(state => state.userUpdateSecurity)
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = userUpdateSecurity

    const user2FAEnable = useSelector(state => state.user2FAEnable)
    const { loading: loadingEnable, error: errorEnable, qrCode } = user2FAEnable

    const user2FADisable = useSelector(state => state.user2FADisable)
    const { loading: loadingDisable, error: errorDisable, success: successDisable } = user2FADisable

    const user2FAVerify = useSelector(state => state.user2FAVerify)
    const { loading: loadingVerify, error: errorVerify, success: successVerify } = user2FAVerify

    useEffect(() => {
        if (!userInfo) {
            history.push('/login')
        }
        if (successUpdate) {
            dispatch({ type: 'USER_UPDATE_SECURITY_RESET' })
            setCurrentPassword('')
            setNewPassword('')
            setConfirmNewPassword('')
        }
    }, [userInfo, history, successUpdate, dispatch])

    const submitPasswordHandler = (e) => {
        e.preventDefault()
        if (newPassword !== confirmNewPassword) {
            setMessage(t('Passwords do not match'))
        } else {
            dispatch(updateUserSecurity({
                current_password: currentPassword,
                new_password: newPassword
            }))
            setCurrentPassword('')
            setNewPassword('')
            setConfirmNewPassword('')
        }
    }

    const enable2FAHandler = () => {
        dispatch(enable2FA())
    }

    const verify2FAHandler = (e) => {
        e.preventDefault()
        dispatch(verify2FA(verificationCode))
        setVerificationCode('')
    }

    const disable2FAHandler = (e) => {
        e.preventDefault()
        dispatch(disable2FA(verificationCode))
        setVerificationCode('')
    }

    return (
        <div style={i18n.language === 'ar' ? {direction: 'rtl'} : {direction: 'ltr'}}>
            <Row className="justify-content-md-center">
                <Col md={8}>
                    <h2>{t('Security Settings')}</h2>
                    {message && <Message variant='danger'>{message}</Message>}
                    {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
                    {successUpdate && <Message variant='success'>{t('Password Updated Successfully')}</Message>}
                    
                    <Card className="mb-4">
                        <Card.Header>{t('Change Password')}</Card.Header>
                        <Card.Body>
                            <Form onSubmit={submitPasswordHandler}>
                                <Form.Group controlId='currentPassword'>
                                    <Form.Label>{t('Current Password')}</Form.Label>
                                    <Form.Control
                                        type='password'
                                        placeholder={t('Enter current password')}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>

                                <Form.Group controlId='newPassword'>
                                    <Form.Label>{t('New Password')}</Form.Label>
                                    <Form.Control
                                        type='password'
                                        placeholder={t('Enter new password')}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>

                                <Form.Group controlId='confirmNewPassword'>
                                    <Form.Label>{t('Confirm New Password')}</Form.Label>
                                    <Form.Control
                                        type='password'
                                        placeholder={t('Confirm new password')}
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>

                                <Button type='submit' variant='primary' className="mt-3">
                                    {t('Update Password')}
                                </Button>
                                {loadingUpdate && <Loader />}
                            </Form>
                        </Card.Body>
                    </Card>

                    <Card>
                        <Card.Header>{t('Two-Factor Authentication')}</Card.Header>
                        <Card.Body>
                            {userInfo?.two_factor_enabled ? (
                                <>
                                    <p>{t('Two-factor authentication is currently enabled.')}</p>
                                    <Form onSubmit={disable2FAHandler}>
                                        <Form.Group controlId='verificationCode'>
                                            <Form.Label>{t('Verification Code')}</Form.Label>
                                            <Form.Control
                                                type='text'
                                                placeholder={t('Enter verification code')}
                                                value={verificationCode}
                                                onChange={(e) => setVerificationCode(e.target.value)}
                                            ></Form.Control>
                                        </Form.Group>

                                        <Button type='submit' variant='danger' className="mt-3">
                                            {t('Disable 2FA')}
                                        </Button>
                                        {loadingDisable && <Loader />}
                                        {errorDisable && <Message variant='danger'>{errorDisable}</Message>}
                                        {successDisable && <Message variant='success'>{t('2FA Disabled Successfully')}</Message>}
                                    </Form>
                                </>
                            ) : (
                                <>
                                    <p>{t('Two-factor authentication is currently disabled.')}</p>
                                    {!qrCode ? (
                                        <Button onClick={enable2FAHandler} variant='success'>
                                            {t('Enable 2FA')}
                                        </Button>
                                    ) : (
                                        <>
                                            <div className="text-center mb-3">
                                                <QRCodeSVG value={qrCode} />
                                                <p className="mt-2">{t('Scan this QR code with your authenticator app')}</p>
                                            </div>
                                            <Form onSubmit={verify2FAHandler}>
                                                <Form.Group controlId='verificationCode'>
                                                    <Form.Label>{t('Verification Code')}</Form.Label>
                                                    <Form.Control
                                                        type='text'
                                                        placeholder={t('Enter verification code')}
                                                        value={verificationCode}
                                                        onChange={(e) => setVerificationCode(e.target.value)}
                                                    ></Form.Control>
                                                </Form.Group>

                                                <Button type='submit' variant='primary' className="mt-3">
                                                    {t('Verify and Enable 2FA')}
                                                </Button>
                                                {loadingVerify && <Loader />}
                                                {errorVerify && <Message variant='danger'>{errorVerify}</Message>}
                                                {successVerify && <Message variant='success'>{t('2FA Enabled Successfully')}</Message>}
                                            </Form>
                                        </>
                                    )}
                                    {loadingEnable && <Loader />}
                                    {errorEnable && <Message variant='danger'>{errorEnable}</Message>}
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default UserSecurityScreen
