from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from ..models import Company, Department, Employee
from datetime import datetime, timezone

User = get_user_model()

class AuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')
        self.login_url = reverse('token_obtain_pair')
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123',
            'first_name': 'Test',
            'last_name': 'User',
            'role': 'employee'
        }

    def test_user_registration(self):
        response = self.client.post(self.register_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue('access' in response.data)
        self.assertTrue(User.objects.filter(email=self.user_data['email']).exists())

    def test_user_login(self):
        # Create user first
        User.objects.create_user(
            username=self.user_data['username'],
            email=self.user_data['email'],
            password=self.user_data['password']
        )
        # Try to login
        response = self.client.post(self.login_url, {
            'username': self.user_data['username'],
            'password': self.user_data['password']
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('access' in response.data)

class CompanyTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='admin123'
        )
        self.client.force_authenticate(user=self.user)
        self.company = Company.objects.create(name='Test Company')
        self.companies_url = reverse('companies')

    def test_list_companies(self):
        response = self.client.get(self.companies_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_company(self):
        url = reverse('company-create')
        data = {'name': 'New Company'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Company.objects.count(), 2)

class DepartmentTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='admin123'
        )
        self.client.force_authenticate(user=self.user)
        self.company = Company.objects.create(name='Test Company')
        self.department = Department.objects.create(
            name='Test Department',
            company=self.company
        )
        self.departments_url = reverse('departments')

    def test_list_departments(self):
        response = self.client.get(self.departments_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_department(self):
        url = reverse('department-create')
        data = {
            'name': 'New Department',
            'company': self.company.id
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Department.objects.count(), 2)

class EmployeeTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='admin123'
        )
        self.client.force_authenticate(user=self.user)
        self.company = Company.objects.create(name='Test Company')
        self.department = Department.objects.create(
            name='Test Department',
            company=self.company
        )
        self.employee_data = {
            'name': 'Test Employee',
            'email': 'employee@example.com',
            'company': self.company.id,
            'department': self.department.id,
            'designation': 'Test Role',
            'workflow_state': 'application_received',
            'mobile_number': '+1234567890',
            'address': 'Test Address'
        }

    def test_create_employee(self):
        url = reverse('employee-create')
        response = self.client.post(url, self.employee_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Employee.objects.count(), 1)

    def test_workflow_transition(self):
        # First create an employee
        employee = Employee.objects.create(
            user=self.user,
            name='Test Employee',
            email='employee@example.com',
            company=self.company,
            department=self.department,
            designation='Test Role',
            workflow_state='application_received',
            mobile_number='+1234567890',
            address='Test Address'
        )
        
        url = reverse('employee-update', kwargs={'pk': employee.id})
        data = {
            'workflow_state': 'interview_scheduled',
            'interview_date': datetime.now(timezone.utc).isoformat()
        }
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        employee.refresh_from_db()
        self.assertEqual(employee.workflow_state, 'interview_scheduled')
