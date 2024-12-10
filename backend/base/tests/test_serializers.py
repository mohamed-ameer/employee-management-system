from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from ..models import Company, Department, Employee
from ..serializers import UserSerializer, CompanySerializer, DepartmentSerializer, EmployeeSerializer

User = get_user_model()

class UserSerializerTests(TestCase):
    def setUp(self):
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123',
            'first_name': 'Test',
            'last_name': 'User',
            'role': 'employee'
        }

    def test_valid_user_data(self):
        serializer = UserSerializer(data=self.user_data)
        self.assertTrue(serializer.is_valid())

    def test_invalid_email(self):
        self.user_data['email'] = 'invalid-email'
        serializer = UserSerializer(data=self.user_data)
        self.assertFalse(serializer.is_valid())

class CompanySerializerTests(TestCase):
    def setUp(self):
        self.company_data = {
            'name': 'Test Company'
        }

    def test_valid_company_data(self):
        serializer = CompanySerializer(data=self.company_data)
        self.assertTrue(serializer.is_valid())
        company = serializer.save()
        self.assertEqual(company.name, self.company_data['name'])

    def test_blank_name(self):
        self.company_data['name'] = ''
        serializer = CompanySerializer(data=self.company_data)
        self.assertFalse(serializer.is_valid())

class DepartmentSerializerTests(TestCase):
    def setUp(self):
        self.company = Company.objects.create(name='Test Company')
        self.manager = User.objects.create_user(
            username='manager',
            email='manager@example.com',
            password='manager123',
            role='manager'
        )
        self.department_data = {
            'name': 'Test Department',
            'company': self.company.id,
            'manager': self.manager.id
        }

    def test_valid_department_data(self):
        serializer = DepartmentSerializer(data=self.department_data)
        self.assertTrue(serializer.is_valid())
        department = serializer.save()
        self.assertEqual(department.name, self.department_data['name'])

    def test_invalid_manager_role(self):
        employee = User.objects.create_user(
            username='employee',
            email='employee@example.com',
            password='employee123',
            role='employee'
        )
        self.department_data['manager'] = employee.id
        serializer = DepartmentSerializer(data=self.department_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('manager', serializer.errors)

class EmployeeSerializerTests(TestCase):
    def setUp(self):
        self.company = Company.objects.create(name='Test Company')
        self.department = Department.objects.create(
            name='Test Department',
            company=self.company
        )
        self.user = User.objects.create_user(
            username='employee',
            email='employee@example.com',
            password='employee123',
            role='employee'
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

    def test_valid_employee_data(self):
        serializer = EmployeeSerializer(data=self.employee_data)
        self.assertTrue(serializer.is_valid())
        employee = serializer.save()
        self.assertEqual(employee.name, self.employee_data['name'])

    def test_invalid_workflow_state(self):
        self.employee_data['workflow_state'] = 'invalid_state'
        serializer = EmployeeSerializer(data=self.employee_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('workflow_state', serializer.errors)

    def test_missing_required_fields(self):
        invalid_data = {}
        serializer = EmployeeSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertTrue(len(serializer.errors) > 0)
