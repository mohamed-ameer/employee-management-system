import React, { useState, useEffect } from 'react'
import { Link,useParams,useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../../components/Loader'
import Message from '../../components/Message'
import FormContainer from '../../components/FormContainer'
import { getUserProfile, updateUser } from '../../actions/userActions'
import { USER_UPDATE_RESET } from '../../constants/userConstants'

function UserEditScreen() {
    const {id} = useParams()
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)

    const dispatch = useDispatch()

    const userDetails = useSelector(state => state.userDetails)
    const { error, loading, user } = userDetails

    const userUpdate = useSelector(state => state.userUpdate)
    const { error: errorUpdate, loading: loadingUpdate, success: successUpdate } = userUpdate

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin
 
    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            navigate('/login')
        }else if (successUpdate) {
            dispatch({ type: USER_UPDATE_RESET })
            navigate('/users')
        } else {

            if (!user.name || user.id !== Number(id)) {
                dispatch(getUserProfile(id))
            } else {
                setName(user.name)
                setEmail(user.email)
                setIsAdmin(user.isAdmin)
            }
        }

    }, [user, id, successUpdate, navigate,userInfo])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateUser({ id: user.id, name, email, isAdmin }))
    }

    return (
        <div>
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb" style={{backgroundColor:'#ddd',padding:'10px 15px',marginBottom:'0px',borderRadius:'40px'}}>
                    <li className="breadcrumb-item "><Link to='/'><span><i className="fa-solid fa-house-chimney"></i></span>    Home</Link></li>
                    <li className="breadcrumb-item text-center" aria-current="page">/</li>
                    <li className="breadcrumb-item "><Link to='/users'>Users List</Link></li>
                    <li className="breadcrumb-item text-center" aria-current="page">/</li>
                    <li className="breadcrumb-item active"><Link >user ID: {id}</Link></li>
                </ol>
            </nav> 
            <FormContainer>
                <h1>Edit User</h1>
                {loadingUpdate && <Loader />}
                {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}

                {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message>
                    : (
                        <Form onSubmit={submitHandler}>

                            <Form.Group controlId='name'>
                                <Form.Label>Name</Form.Label>
                                <Form.Control

                                    type='name'
                                    placeholder='Enter name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='email'>
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    type='email'
                                    placeholder='Enter Email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='isadmin'>
                                <Form.Check
                                    type='checkbox'
                                    label='Is Admin'
                                    checked={isAdmin}
                                    onChange={(e) => setIsAdmin(e.target.checked)}
                                >
                                </Form.Check>
                            </Form.Group>

                            <Button type='submit' className='btn-custom-color w-100 mt-3'>
                                Update
                        </Button>

                        </Form>
                    )}

            </FormContainer >
        </div>

    )
}

export default UserEditScreen