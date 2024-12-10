import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useTranslation } from 'react-i18next'
import { logout } from '../actions/userActions'

function Header() {
    const { t, i18n } = useTranslation()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const logoutHandler = () => {
        dispatch(logout())
        navigate('/login')
    }

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng)
        // Update user preferences if needed
    }

    return (
        <header>
            <Navbar bg="primary" variant="dark" expand="lg" collapseOnSelect>
                <Container>
                    <LinkContainer to="/">
                        <Navbar.Brand>{t('Employee Management System')}</Navbar.Brand>
                    </LinkContainer>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            {userInfo ? (
                                <>
                                    {/* Main Navigation */}
                                    <LinkContainer to="/employees">
                                        <Nav.Link>
                                            <i className="fas fa-users"></i> {t('Employees')}
                                        </Nav.Link>
                                    </LinkContainer>

                                    <LinkContainer to="/departments">
                                        <Nav.Link>
                                            <i className="fas fa-building"></i> {t('Departments')}
                                        </Nav.Link>
                                    </LinkContainer>

                                    <LinkContainer to="/companies">
                                        <Nav.Link>
                                            <i className="fas fa-city"></i> {t('Companies')}
                                        </Nav.Link>
                                    </LinkContainer>

                                    {/* Admin Menu */}
                                    {userInfo.isAdmin && (
                                        <NavDropdown title={<><i className="fas fa-cog"></i> {t('Admin')}</>} id="admin-menu">
                                            <LinkContainer to="/users">
                                                <NavDropdown.Item>{t('Users')}</NavDropdown.Item>
                                            </LinkContainer>
                                            <LinkContainer to="/settings">
                                                <NavDropdown.Item>{t('Settings')}</NavDropdown.Item>
                                            </LinkContainer>
                                        </NavDropdown>
                                    )}

                                    {/* User Menu */}
                                    <NavDropdown 
                                        title={
                                            <span>
                                                <i className="fas fa-user"></i> {userInfo.name}
                                            </span>
                                        } 
                                        id="username"
                                    >
                                        <LinkContainer to="/profile">
                                            <NavDropdown.Item>{t('Profile')}</NavDropdown.Item>
                                        </LinkContainer>
                                        
                                        <LinkContainer to="/profile/security">
                                            <NavDropdown.Item>{t('Security')}</NavDropdown.Item>
                                        </LinkContainer>

                                        <NavDropdown.Divider />
                                        
                                        <NavDropdown.Item onClick={logoutHandler}>
                                            {t('Logout')}
                                        </NavDropdown.Item>
                                    </NavDropdown>

                                    {/* Language Selector */}
                                    <NavDropdown 
                                        title={<i className="fas fa-globe"></i>} 
                                        id="language-selector"
                                    >
                                        <NavDropdown.Item onClick={() => changeLanguage('en')}>
                                            🇺🇸 English
                                        </NavDropdown.Item>
                                        <NavDropdown.Item onClick={() => changeLanguage('ar')}>
                                            🇸🇦 العربية
                                        </NavDropdown.Item>
                                        <NavDropdown.Item onClick={() => changeLanguage('es')}>
                                            🇪🇸 Español
                                        </NavDropdown.Item>
                                        <NavDropdown.Item onClick={() => changeLanguage('fr')}>
                                            🇫🇷 Français
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                </>
                            ) : (
                                <LinkContainer to="/login">
                                    <Nav.Link>
                                        <i className="fas fa-user"></i> {t('Login')}
                                    </Nav.Link>
                                </LinkContainer>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default Header
