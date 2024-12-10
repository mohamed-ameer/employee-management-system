# Employee Management System

A comprehensive web application for managing employees, companies, and departments with multilingual support and advanced workflow management.

## 🌟 Features

- **Authentication & Authorization**
  - Role-based access control (Admin, HR, Manager, Employee)
  - JWT token-based authentication
  - Protected routes based on user roles

- **Company Management**
  - CRUD operations for companies
  - Track departments and employees count
  - Detailed company profiles

- **Department Management**
  - CRUD operations for departments
  - Department-company relationships
  - Employee allocation tracking

- **Employee Management**
  - Complete employee lifecycle management
  - Workflow states (Application Received, Interview Scheduled, Hired, Not Accepted)
  - Status tracking (Pending, Onboarding, Active, Inactive)
  - Detailed employee profiles

- **Internationalization**
  - Support for multiple languages:
    - English
    - Arabic
    - Spanish
    - French
  - Dynamic language switching
  - RTL support for Arabic

## 🚀 Tech Stack

### Backend
- Django
- Django REST Framework
- PostgreSQL
- JWT Authentication

### Frontend
- React
- Redux for state management
- React Bootstrap
- i18next for translations

## 📋 Prerequisites

- Python 3.8+
- Node.js 14+
- PostgreSQL
- Git

## 🛠️ Installation

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/mohamed-ameer/employee-management-system.git
cd employee-management-system
cd backend
```

2. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
.\venv\Scripts\activate  # Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your database and other configurations
```

5. Run migrations:
```bash
python manage.py migrate
```

6. Create superuser:
```bash
python manage.py createsuperuser
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
# Create .env file
REACT_APP_API_URL=http://localhost:8000/api
EOL
```

4. Update API URL in .env if needed:
- For development: REACT_APP_API_URL=http://localhost:8000/api
- For production: REACT_APP_API_URL=https://your-api-domain.com/api

## 🚀 Running the Application

### Development Mode

1. Start backend server:
```bash
python manage.py runserver
```

2. Start frontend development server:
```bash
cd frontend
npm start
```

### Production Mode

1. Build frontend:
```bash
cd frontend
npm run build
```

2. Configure web server (Nginx/Apache) to serve static files and proxy API requests.

## 🔒 Security Measures

1. **Authentication**
   - JWT token-based authentication
   - Token refresh mechanism
   - Password hashing using Django's default hasher

2. **Authorization**
   - Role-based access control
   - Permission-based views
   - API endpoint protection

3. **Data Protection**
   - Input validation
   - XSS protection
   - CSRF protection
   - SQL injection prevention

## 📡 API Documentation

- The Postman collection for the API endpoints is available you can import it into Postman, you will find it in the root of the repository as `Employee Management System API.postman_collection.json`.

## 📝 API Endpoints

### Authentication Endpoints

- POST `/api/users/login/` - User login
- POST `/api/users/register/` - User registration
- POST `/api/users/profile/` - Get user profile

### Company Endpoints

- GET `/api/companies/` - List all companies
- POST `/api/companies/create/` - Create new company
- GET `/api/companies/{id}/` - Get company details
- PUT `/api/companies/{id}/update/` - Update company
- DELETE `/api/companies/{id}/delete/` - Delete company

### Department Endpoints

- GET `/api/departments/` - List all departments
- POST `/api/departments/create/` - Create new department
- GET `/api/departments/{id}/` - Get department details
- PUT `/api/departments/{id}/update/` - Update department
- DELETE `/api/departments/{id}/delete/` - Delete department

### Employee Endpoints

- GET `/api/employees/` - List all employees
- POST `/api/employees/create/` - Create new employee
- GET `/api/employees/{id}/` - Get employee details
- PUT `/api/employees/{id}/update/` - Update employee
- DELETE `/api/employees/{id}/delete/` - Delete employee

## ✅ Requirements Completion Status

### Backend Requirements

#### Models ✅
- [x] User Accounts (name, email, role)
- [x] Company (name, departments count, employees count)
- [x] Department (company, name, employees count)
- [x] Employee (all required fields including status, hired date, days employed)

#### Validations & Business Logic ✅
- [x] Required fields validation
- [x] Email and mobile number format validation
- [x] Automatic calculation of counts (departments, employees)
- [x] Days employed calculation
- [x] Department-Company relationship validation
- [x] Cascade deletion handling
- [x] Error handling and messages

#### Workflow (Bonus) ✅
- [x] Employee onboarding workflow
- [x] Stage definitions (Application Received, Interview Scheduled, etc.)
- [x] Stage transitions
- [x] Status tracking

#### Security & Permissions ✅
- [x] Role-based access control
- [x] JWT authentication
- [x] Authorization middleware
- [x] Secure routes

#### APIs ✅
- [x] RESTful API implementation
- [x] CRUD operations for all models
- [x] Secure data handling
- [x] API documentation

#### Testing (Bonus) ⚠️ for the backend only
- [x] Unit tests 
- [x] Integration tests

#### Logging (Bonus) ⚠️
- [x] Basic error logging
- [ ] Advanced logging features
- [ ] Log management system

### Frontend Requirements

#### User Interface ✅
- [x] Login Page
- [x] Company Management (List, View, Edit, Delete)
- [x] Department Management (List, View, Edit, Delete)
- [x] Employee Management (List, Create, Edit, View, Delete)
- [x] User Account Management (Bonus)
- [x] Summary Dashboard (Bonus)
- [x] Clean and organized UI
- [x] Navigation system

#### Validations ✅
- [x] Required fields validation
- [x] Email and mobile format validation
- [x] Department-Company relationship
- [x] Error handling and messages

#### Employee Report (Bonus) ✅
- [x] Detailed employee information display
- [x] All required fields included
- [x] Sorting and filtering options

#### API Integration ✅
- [x] Frontend-Backend integration
- [x] Authentication handling
- [x] Error handling
- [x] Loading states
- [x] User feedback

### Additional Features

#### Internationalization ✅
- [x] Multi-language support
  - [x] English
  - [x] Arabic
  - [x] Spanish
  - [x] French
- [x] RTL support
- [x] Dynamic language switching

#### Performance Optimizations ✅
- [x] Efficient API calls
- [x] State management
- [x] Loading states
- [x] Error boundaries

### Legend
✅ - Fully Implemented
⚠️ - Partially Implemented
❌ - Not Implemented

## 🔍 Notes on Incomplete Features

1. Testing (❌):
   - Unit tests and integration tests are not implemented for the frontend
   - Focus was placed on core functionality and API integration

2. Advanced Logging (⚠️):
   - Basic error logging is implemented
   - Advanced logging features like log management and detailed tracking are not implemented

All mandatory requirements have been completed, with most bonus features implemented except for comprehensive testing and advanced logging.

## ✅ Task Completion Checklist

- [x] User Authentication and Authorization
  - [x] JWT implementation
  - [x] Role-based access control
  - [x] Protected routes

- [x] Company Management
  - [x] CRUD operations
  - [x] Company statistics
  - [x] Department relationships

- [x] Department Management
  - [x] CRUD operations
  - [x] Company association
  - [x] Employee tracking

- [x] Employee Management
  - [x] CRUD operations
  - [x] Workflow states
  - [x] Status tracking
  - [x] Profile management

- [x] Internationalization
  - [x] Multiple language support
  - [x] RTL implementation
  - [x] Dynamic language switching

- [x] Frontend Implementation
  - [x] Responsive design
  - [x] State management
  - [x] Form validation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.