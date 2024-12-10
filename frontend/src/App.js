import { Container } from 'react-bootstrap';
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
// common components
import Footer from './components/Footer';
import Header from './components/Header';
// screens
import DashboardScreen from './screens/DashboardScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

// Company Screens
import CompanyListScreen from './screens/Company/CompanyListScreen';
import CompanyDetailScreen from './screens/Company/CompanyDetailScreen';
import CompanyEditScreen from './screens/Company/CompanyEditScreen';
import CompanyCreateScreen from './screens/Company/CompanyCreateScreen';

// Department Screens
import DepartmentListScreen from './screens/Department/DepartmentListScreen';
import DepartmentDetailScreen from './screens/Department/DepartmentDetailScreen';
import DepartmentEditScreen from './screens/Department/DepartmentEditScreen';
import DepartmentCreateScreen from './screens/Department/DepartmentCreateScreen';

// Employee Screens
import EmployeeListScreen from './screens/Employee/EmployeeListScreen';
import EmployeeDetailScreen from './screens/Employee/EmployeeDetailScreen';
import EmployeeCreateScreen from './screens/Employee/EmployeeCreateScreen';
import EmployeeEditScreen from './screens/Employee/EmployeeEditScreen';

// User Account Screens
import UserProfileScreen from './screens/User/UserProfileScreen';
import UserEditScreen from './screens/User/UserEditScreen';
import UserSecurityScreen from './screens/User/UserSecurityScreen';
import UserListScreen from './screens/User/UserListScreen';

// translate ar and en 
import { useTranslation } from "react-i18next";
import { useEffect } from 'react';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  const [t, i18n] = useTranslation();
  useEffect(() => {
    document.title = t('EMS - Employee Management System')
  }, [t])

  return (
    <Router>
      <Header />
      <main className='py-3'>
        <Container>
          <Routes>
            {/* Dashboard */}
            <Route path='/' element={<DashboardScreen />} exact />

            {/* Authentication */}
            <Route path='/login' element={<LoginScreen />} />
            <Route path='/register' element={<RegisterScreen />} />

            {/* User Routes */}
            <Route path="/profile" element={
              <PrivateRoute>
                <UserProfileScreen />
              </PrivateRoute>
            } />
            <Route path="/profile/security" element={
              <PrivateRoute>
                <UserSecurityScreen />
              </PrivateRoute>
            } />
            <Route path="/users" element={
              <AdminRoute>
                <UserListScreen />
              </AdminRoute>
            } />

            {/* Company Management */}
            <Route path='/companies' element={
              <PrivateRoute>
                <CompanyListScreen />
              </PrivateRoute>
            } />
            <Route path='/company/create' element={
              <AdminRoute>
                <CompanyCreateScreen />
              </AdminRoute>
            } />
            <Route path='/company/:id' element={
              <PrivateRoute>
                <CompanyDetailScreen />
              </PrivateRoute>
            } />
            <Route path='/company/:id/edit' element={
              <AdminRoute>
                <CompanyEditScreen />
              </AdminRoute>
            } />

            {/* Department Management */}
            <Route path='/departments' element={
              <PrivateRoute>
                <DepartmentListScreen />
              </PrivateRoute>
            } />
            <Route path='/department/create' element={
              <AdminRoute>
                <DepartmentCreateScreen />
              </AdminRoute>
            } />
            <Route path='/department/:id' element={
              <PrivateRoute>
                <DepartmentDetailScreen />
              </PrivateRoute>
            } />
            <Route path='/department/:id/edit' element={
              <AdminRoute>
                <DepartmentEditScreen />
              </AdminRoute>
            } />

            {/* Employee Management Routes */}
            <Route path="/employees" element={
              <PrivateRoute>
                <EmployeeListScreen />
              </PrivateRoute>
            } />
            <Route path="/employee/create" element={
              <AdminRoute>
                <EmployeeCreateScreen />
              </AdminRoute>
            } />
            <Route path="/employee/:id" element={
              <PrivateRoute>
                <EmployeeDetailScreen />
              </PrivateRoute>
            } />
            <Route path="/employee/:id/edit" element={
              <AdminRoute>
                <EmployeeEditScreen />
              </AdminRoute>
            } />

            {/* User Account Management */}
            <Route path='/profile/edit' element={<UserEditScreen />} />
          </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
