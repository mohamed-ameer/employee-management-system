import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next";
import { Link,useNavigate,useSearchParams } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { register } from '../actions/userActions'

function RegisterScreen() {
    const [t,i18n]=useTranslation();
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get('redirect');

    const userRegister = useSelector(state => state.userRegister)
    const { error, loading, userInfo } = userRegister

    useEffect(() => {
        if (userInfo) {
            if(redirect){
                navigate('/'+redirect)
            }else{
                navigate('/')
            }
        }
    }, [navigate, userInfo,redirect])

    const submitHandler = (e) => {
        e.preventDefault()

        if (password != confirmPassword) {
            setMessage('Passwords do not match')
        } else {
            dispatch(register(name, email, password))
        }

    }

    return (
        <>
            <nav aria-label="breadcrumb" className="mb-4" style={i18n.language == 'ar'?{direction:'rtl'}:{direction:'ltr'}}>
                <ol className="breadcrumb" style={{backgroundColor:'#ddd',padding:'10px 15px',marginBottom:'0px',borderRadius:'40px'}}>
                    <li className="breadcrumb-item "><Link to='/'><span><i className="fa-solid fa-house-chimney"></i></span>    {i18n.language == 'ar'?'الصفحه الرئيسيه':'Home'}</Link></li>
                    <li className="breadcrumb-item text-center" aria-current="page">/</li>
                    <li className="breadcrumb-item active" aria-current="page">{i18n.language == 'ar'?'إنشاء حساب':'SIGN UP'}</li>
                </ol>
            </nav> 
            <FormContainer>
                <div className="alert alert-dark" style={i18n.language == 'ar'?{direction:'rtl'}:{direction:'ltr'}}>
                <h1>{i18n.language == 'ar'?'إنشاء حساب':'SIGN UP'}</h1>
                </div>
                {message && <Message variant='danger'>{message}</Message>}
                {error && <Message variant='danger'>{error}</Message>}
                {loading && <Loader />}
                <Form onSubmit={submitHandler}>

                    <Form.Group controlId='name' style={i18n.language == 'ar'?{direction:'rtl'}:{direction:'ltr'}}>
                        <Form.Label>{i18n.language == 'ar'?'الاسم':'Name'}</Form.Label>
                        <Form.Control
                            required
                            type='name'
                            placeholder={i18n.language == 'ar'?'ادخل الاسم':'Enter name'}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='email' style={i18n.language == 'ar'?{direction:'rtl'}:{direction:'ltr'}}>
                        <Form.Label>{i18n.language == 'ar'?'البريد الالكتروني':'Email Address'}</Form.Label>
                        <Form.Control
                            required
                            type='email'
                            placeholder={i18n.language == 'ar'?'ادخل البريد الالكتروني':'Enter Email'}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='password' style={i18n.language == 'ar'?{direction:'rtl'}:{direction:'ltr'}}>
                        <Form.Label>{i18n.language == 'ar'?'كلمه السر':'Password'}</Form.Label>
                        <Form.Control
                            required
                            type='password'
                            placeholder={i18n.language == 'ar'?'ادخل كلمه السر':'Enter Password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='passwordConfirm' style={i18n.language == 'ar'?{direction:'rtl'}:{direction:'ltr'}}>
                        <Form.Label>{i18n.language == 'ar'?'تاكيد كلمه السر':'Confirm Password'}</Form.Label>
                        <Form.Control
                            required
                            type='password'
                            placeholder={i18n.language == 'ar'?'تاكيد كلمه السر':'Confirm Password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>

                    <Button type='submit' className='btn-custom-color w-100 mt-3'>
                    {i18n.language == 'ar'?'تسجيل':'Register'}
                    </Button>

                </Form>

                <Row className='py-3' style={i18n.language == 'ar'?{direction:'rtl'}:{direction:'ltr'}}>
                    <Col>
                    {i18n.language == 'ar'?'لديك حساب بالفعل ؟':'Have an Account?'} 
                        <Link
                            to={redirect ? `/login?redirect=${redirect}` : '/login'}>
                            {i18n.language == 'ar'?'تسجيل الدخول':'Sign In'}
                        </Link>
                    </Col>
                </Row>
            </FormContainer >
        </>
    )
}

export default RegisterScreen
